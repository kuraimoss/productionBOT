const axios = require("axios");

async function generateImageFromPrompt(prompt) {
    if (!prompt) throw new Error("prompt is required");

    const apiKey = setting?.blackbox?.key;
    if (!apiKey) throw new Error("BLACKBOX_API_KEY is not set");

    const model = setting?.blackbox?.imageModel;
    if (!model) throw new Error("BLACKBOX_IMAGE_MODEL is not set");

    const payload = {
        model,
        messages: [{ role: "user", content: String(prompt) }],
        stream: false,
    };

    const res = await axios.post("https://api.blackbox.ai/v1/images/generations", payload, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });

    const url = res?.data?.choices?.[0]?.message?.content;
    if (!url) throw new Error("Image URL not found in response");

    return url;
}

module.exports = {
name: ["aichattoimage","aictimage","dalle"],
param: "<query>",
cmd: ["aichattoimage","aictimage","aicreateimage","dalle"],
category: "ai",
desc: "Membuat gambar dari prompt teks (AI text-to-image).",
query: true,
async handler(m, { conn, q, args }) {
await m.reply(response.wait)
try {
    const imageUrl = await generateImageFromPrompt(q);
    await conn.sendMessage(m.from, { image: { url: imageUrl }}, { quoted: m });
} catch (e) {
    throw e;
}
}}
