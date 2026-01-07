const path = require("path");
const fs = require("fs");

const { Client } = require("@modelcontextprotocol/sdk/client");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { InMemoryTransport } = require("@modelcontextprotocol/sdk/inMemory.js");
const { z } = require("zod");

const WORKSPACE_ROOT = path.resolve(__dirname, "..", "..");

const contexts = new Map();
let initPromise = null;
let client = null;

function normalizeFlags(flags) {
  return {
    isOwner: !!flags?.isOwner,
    isAdmin: !!flags?.isAdmin,
    isBotAdmin: !!flags?.isBotAdmin,
  };
}

function resolveSafePath(requestedPath) {
  const resolved = path.resolve(WORKSPACE_ROOT, requestedPath);
  if (!resolved.startsWith(WORKSPACE_ROOT + path.sep) && resolved !== WORKSPACE_ROOT) {
    throw new Error("Path di luar workspace tidak diizinkan.");
  }
  if (resolved.includes(`${path.sep}node_modules${path.sep}`)) {
    throw new Error("Akses node_modules tidak diizinkan.");
  }
  return resolved;
}

function getContext(contextId) {
  const ctx = contexts.get(contextId);
  if (!ctx) throw new Error("Context tidak valid atau sudah kadaluarsa.");
  return ctx;
}

function ensurePermission(flags, requirement) {
  const f = normalizeFlags(flags);
  if (requirement === "public") return;
  if (requirement === "read") {
    if (!(f.isOwner || f.isAdmin || f.isBotAdmin)) throw new Error("Akses ditolak.");
    return;
  }
  if (requirement === "write") {
    if (!f.isOwner) throw new Error("Akses ditolak.");
    return;
  }
  throw new Error("Permission requirement tidak dikenal.");
}

function registerContext({ flags, conn, m }) {
  const contextId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  contexts.set(contextId, {
    flags: normalizeFlags(flags),
    conn,
    m,
    createdAt: Date.now(),
  });
  return contextId;
}

function unregisterContext(contextId) {
  contexts.delete(contextId);
}

async function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const server = new McpServer({ name: "kurabot-mcp-local", version: "1.0.0" });

    server.registerTool(
      "readFile",
      {
        description: "Read file contents from workspace.",
        inputSchema: z.object({
          contextId: z.string(),
          filePath: z.string(),
        }),
      },
      async (args) => {
        const { contextId, filePath } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "read");
        const abs = resolveSafePath(String(filePath || ""));
        const content = fs.readFileSync(abs, "utf8");
        return { content: [{ type: "text", text: content }] };
      }
    );

    server.registerTool(
      "writeFile",
      {
        description: "Write file contents to workspace (owner only).",
        inputSchema: z.object({
          contextId: z.string(),
          filePath: z.string(),
          content: z.string().optional(),
        }),
      },
      async (args) => {
        const { contextId, filePath, content } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "write");
        const abs = resolveSafePath(String(filePath || ""));
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, String(content ?? ""), "utf8");
        return { content: [{ type: "text", text: "OK" }] };
      }
    );

    server.registerTool(
      "createFile",
      {
        description: "Create a file in workspace (owner only).",
        inputSchema: z.object({
          contextId: z.string(),
          filePath: z.string(),
          content: z.string().optional(),
        }),
      },
      async (args) => {
        const { contextId, filePath, content } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "write");
        const abs = resolveSafePath(String(filePath || ""));
        if (fs.existsSync(abs)) throw new Error("File sudah ada.");
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, String(content ?? ""), "utf8");
        return { content: [{ type: "text", text: "OK" }] };
      }
    );

    server.registerTool(
      "deleteFile",
      {
        description: "Delete a file in workspace (owner only).",
        inputSchema: z.object({
          contextId: z.string(),
          filePath: z.string(),
        }),
      },
      async (args) => {
        const { contextId, filePath } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "write");
        const abs = resolveSafePath(String(filePath || ""));
        if (!fs.existsSync(abs)) throw new Error("File tidak ditemukan.");
        const stat = fs.statSync(abs);
        if (stat.isDirectory()) throw new Error("Path adalah folder, bukan file.");
        fs.unlinkSync(abs);
        return { content: [{ type: "text", text: "OK" }] };
      }
    );

    server.registerTool(
      "listFiles",
      {
        description: "List files in a directory (workspace).",
        inputSchema: z.object({
          contextId: z.string(),
          dirPath: z.string().optional(),
        }),
      },
      async (args) => {
        const { contextId, dirPath } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "read");
        const abs = resolveSafePath(String(dirPath || "."));
        const entries = fs.readdirSync(abs, { withFileTypes: true }).map((d) => ({
          name: d.name,
          type: d.isDirectory() ? "dir" : "file",
        }));
        return { content: [{ type: "text", text: JSON.stringify(entries, null, 2) }] };
      }
    );

    server.registerTool(
      "listCommands",
      {
        description: "List registered bot commands (safe metadata only).",
        inputSchema: z.object({
          contextId: z.string(),
        }),
      },
      async (args) => {
        const { contextId } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "public");

        const cmds = global.attr?.commands ? Object.values(global.attr.commands) : [];
        const safe = cmds
          .map((c) => {
            const names = Array.isArray(c.cmd) ? c.cmd : Array.isArray(c.name) ? c.name : c.name ? [c.name] : [];
            return {
              names: names.filter(Boolean).map((n) => String(n).toLowerCase()),
              category: c.category ? String(c.category) : null,
              owner: !!c.owner,
              admin: !!c.admin,
              botadmin: !!c.botadmin,
            };
          })
          .filter((c) => c.names.length > 0);

        return { content: [{ type: "text", text: JSON.stringify(safe, null, 2) }] };
      }
    );

    server.registerTool(
      "reloadCommand",
      {
        description: "Reload a command file (owner only).",
        inputSchema: z.object({
          contextId: z.string(),
          filePath: z.string(),
        }),
      },
      async (args) => {
        const { contextId, filePath } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "write");
        const rel = String(filePath || "").replace(/^[./\\]+/, "");
        if (!rel) throw new Error("filePath tidak valid.");
        resolveSafePath(rel);

        if (typeof global.reload !== "function") throw new Error("Reload tidak tersedia di runtime.");
        global.reload(rel);
        return { content: [{ type: "text", text: "OK" }] };
      }
    );

    server.registerTool(
      "createCommand",
      {
        description: "Create a new command file under commands/custom (owner only).",
        inputSchema: z.object({
          contextId: z.string(),
          name: z.string(),
          code: z.string(),
        }),
      },
      async (args) => {
        const { contextId, name, code } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "write");
        const safeName = String(name || "").replace(/[^a-z0-9_-]/gi, "").toLowerCase();
        if (!safeName) throw new Error("Nama command tidak valid.");

        const rel = path.join("commands", "custom", `${safeName}.js`);
        const abs = resolveSafePath(rel);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, String(code ?? ""), "utf8");

        if (typeof global.reload === "function") {
          try {
            global.reload(rel);
          } catch {
            // ignore
          }
        }

        return { content: [{ type: "text", text: "OK" }] };
      }
    );

    server.registerTool(
      "executeCommand",
      {
        description: "Execute an existing bot command (guarded by system flags).",
        inputSchema: z.object({
          contextId: z.string(),
          command: z.string(),
          argv: z.array(z.string()).optional(),
        }),
      },
      async (args) => {
        const { contextId, command, argv } = args || {};
        const ctx = getContext(contextId);
        ensurePermission(ctx.flags, "public");

        const cmdName = String(command || "").replace(/^[.#/]/, "").toLowerCase();
        if (!cmdName) throw new Error("Command tidak valid.");

        const commands = global.attr?.commands ? Object.values(global.attr.commands) : [];
        const cmd = commands.find(
          (cmn) => (cmn.cmd && cmn.cmd.includes(cmdName)) || (Array.isArray(cmn.name) ? cmn.name.includes(cmdName) : cmn.name === cmdName)
        );
        if (!cmd) throw new Error("Command tidak ditemukan.");

        if (cmd.owner && !ctx.flags.isOwner) throw new Error("Akses ditolak. Perintah ini khusus owner.");
        if (cmd.admin && !ctx.flags.isAdmin && !ctx.flags.isOwner) throw new Error("Akses ditolak. Perintah ini khusus admin.");
        if (cmd.botadmin && !ctx.flags.isBotAdmin && !ctx.flags.isOwner)
          throw new Error("Akses ditolak. Bot tidak memiliki izin admin.");

        const argsList = Array.isArray(argv) ? argv.map(String) : [];
        const q = argsList.join(" ");
        const prefix = ".";

        ctx.m.command = cmdName;
        const extra = {
          conn: ctx.conn,
          args: argsList,
          q,
          command: cmdName,
          prefix,
          text: q,
          isCreator: ctx.flags.isOwner,
          ...ctx.m.attribute,
        };

        await cmd.handler(ctx.m, extra);
        return { content: [{ type: "text", text: "OK" }] };
      }
    );

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);

    client = new Client({ name: "kurabot-mcp-client", version: "1.0.0" });
    await client.connect(clientTransport);

    return client;
  })();
  return initPromise;
}

async function getClient() {
  return init();
}

module.exports = {
  getClient,
  registerContext,
  unregisterContext,
};
