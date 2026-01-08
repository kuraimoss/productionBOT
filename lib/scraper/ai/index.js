const { OpenAI } = require("openai");
const axios = require("axios");

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: setting.huggingface.key,
});

const BLACKBOX_CHAT_URL = "https://api.blackbox.ai/chat/completions";

async function chatBlackbox(messages, options = {}) {
    try {
        return await new Promise(async(resolve, reject) => {
            if (!messages) return reject("undefined reading messages input");
            if (!Array.isArray(messages)) return reject("invalid array input at messages!");

            const apiKey = setting?.blackbox?.key;
            if (!apiKey) return reject("BLACKBOX_API_KEY is not set");

            const model = options.model || setting?.blackbox?.model || "blackboxai/anthropic/claude-opus-4";

            const payload = {
                model,
                messages: messages
                    .filter((m) => m && typeof m === "object")
                    .map((m) => ({
                        role: m.role || "user",
                        content: String(m.content ?? ""),
                    })),
                stream: false,
            };

            axios
                .post(BLACKBOX_CHAT_URL, payload, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 60000,
                })
                .then((res) => {
                    const data = res?.data;
                    const answer =
                        data?.choices?.[0]?.message?.content ??
                        data?.choices?.[0]?.text ??
                        data?.output_text ??
                        data?.response ??
                        data?.message ??
                        "";
                    if (!answer) return reject(data || "empty response from blackbox");
                    resolve({
                        status: true,
                        data: options.raw ? { answer: String(answer), raw: data } : { answer: String(answer) },
                        meta: {
                            provider: "blackbox",
                            endpoint: BLACKBOX_CHAT_URL,
                            modelRequested: model,
                            modelReported: data?.model || data?.choices?.[0]?.model || null,
                            requestId:
                                res?.headers?.["x-request-id"] ||
                                res?.headers?.["x-requestid"] ||
                                res?.headers?.["request-id"] ||
                                null,
                        },
                    });
                })
                .catch((err) => reject(err));
        });
    } catch (e) {
        throw e;
    }
}

async function chatGptOss120b(messages) {
    try {
        return await new Promise(async(resolve, reject) => {
            if (!messages) return reject("undefined reading messages input");
            if (!Array.isArray(messages)) return reject("invalid array input at messages!");
      
            let promptHistory = "";
      
            for (let dt of messages) {
                promptHistory += `\n${dt.role === "user" ? ("Human: " + dt.content) : dt.role === "assistant" ? ("Assistant: " + dt.content) : "" }`
            }
            
            client.responses.create({
                model: "openai/gpt-oss-120b",
                instructions: prompts,
                input: promptHistory
            })
                .then(respon => {
                    if (respon.status == "completed") {
                        resolve({
                            status: true,
                            data: { answer: respon.output_text },
                            meta: {
                                provider: "hf-router",
                                endpoint: "https://router.huggingface.co/v1",
                                modelRequested: "openai/gpt-oss-120b",
                                modelReported: respon?.model || null,
                                requestId: respon?.id || null,
                            },
                        })
                    } else {
                        reject(respon.error)
                    }
                })
                .catch(err => reject(err))
        })
    } catch(e) {
        return { status: false, message: e }
    }
}

async function chatToImage(prompt, options = {}) {
    try {
        return await new Promise(async(resolve, reject) => {
            if (!prompt) return reject("undefined reading prompt input");
            const apiKey = setting?.blackbox?.key;
            if (!apiKey) return reject("BLACKBOX_API_KEY is not set");

            const model = options.model || setting?.blackbox?.imageModel || "blackboxai/black-forest-labs/flux-1.1-pro-ultra";

            const payload = {
                model,
                messages: [{ role: "user", content: String(prompt) }],
                stream: false,
            };

            axios
                .post(BLACKBOX_CHAT_URL, payload, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 60000,
                })
                .then((res) => {
                    const data = res?.data;
                    const url = data?.choices?.[0]?.message?.content || "";
                    if (!url) return reject(data || "empty response from blackbox");
                    resolve({
                        status: true,
                        result: String(url),
                        meta: { provider: "blackbox", endpoint: BLACKBOX_CHAT_URL, modelRequested: model },
                    });
                })
                .catch((err) => reject(err));
        });
    } catch (e) {
        return { status: false, message: e };
    }
}

module.exports = { chatBlackbox, chatGptOss120b, chatToImage }
