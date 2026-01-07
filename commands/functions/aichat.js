const fs = require("fs");

async function chatGpt3(messages, m) {
    try {
        return await new Promise(async(resolve, reject) => {
            if (!messages) return reject("undefined reading messages input");
            if (!Array.isArray(messages)) return reject("invalid array input at messages!");
      
            let promptHistory = `Human: jawab aku lebih santai dan gaul, tidak usah menjawab memakai tanda ### ngobrol seperti manusia saja

Assistant: Oke, santai aja! 😄 Jadi, apa yang mau kamu tanya atau bahas? Aku di sini buat bantu kamu dengan cara yang lebih asik. Nggak perlu ribet, langsung aja! ✌️`;
      
            for (let dt of messages) {
                promptHistory += `\n${dt.role === "user" ? ("Human: " + dt.content) : dt.role === "assistant" ? ("Assistant: " + dt.content) : "" }`
            }
      
           tool.fetchJson(`https://api.siputzx.my.id/api/ai/gpt3?prompt=${encodeURIComponent(prompts)}&content=${encodeURIComponent(promptHistory)}`)
               .then((data) => {
                   if (data.status) {
                       resolve({ status: true, data: { answer: data.data }})
                   } else {
                       reject(data)
                       if (m) m.reply(data)
                   }
               })
               .catch(err => reject(err))
       })
   } catch(e) {
       return { status: false, message: e }
       if (m) m.reply(e) 
   }
}

module.exports = {
    name: "aichat",
    category: "media",
    function: true,
    async handler(m, { conn, command }) {
    if (!command) {
        if (m.type != "stickerMessage") {
            let isiPesan = ""
            if (m.type == "audioMessage") {
                let dt = await scraper.tools.speechToText(await m.download())
                if (dt.status) {
                    isiPesan = dt.text
                }
            } else {
            isiPesan = m.body
            }
            
            if (isiPesan.length != 0) {
                let isAi = false
                let msgId = false

                if (!isiPesan.startsWith(">") && !isiPesan.startsWith("<") && !isiPesan.startsWith("=>") && !isiPesan.startsWith("$")) {
                    if (m.quoted && m.quoted.key.fromMe) msgId = m.quoted.key.id
                    if (msgId && msgId.startsWith("AICHAT")) isAi = true
                    if (!m.isGroup && users[m.sender].auto && users[m.sender].auto.ai && (tool.isUrl(isiPesan) ? !users[m.sender].auto.dl : true)) isAi = true

                    if (isAi) {
                        if (users[m.sender].limit <= 0) return m.reply(`Penggunaan harian anda telah habis, Perintah ini setidaknya membutuhkan 1 Limit\n\nLimit direset setiap pukul 00.00 WIB, gunakan kembali setelah limit direset\n\nAtau kamu bisa topup untuk membeli limit tambahan dengan menggunakan perintah \`#topup\` bisa juga dengan upgrade rank untuk mendapatkan lebih banyak limit \`#upgrade platinum 30d\``)
                        const voiceCommandRegex = /(?:^|\s)voice(?:\s|$)/i;
                        let text = isiPesan.replace("voice", "")
                        await db.read()
                        if (db.data.openai[m.sender] == undefined) {
                            db.data.openai[m.sender] = [];
                            await db.write()
                        }
                        if (db.data.openai[m.sender].length >= 10) {
                            db.data.openai[m.sender] = [];
                            await db.write()
                        }
                        
                        let messages = [
                            ...(db.data.openai[m.sender].map((msg) => ({ role: msg.role, content: msg.content })) || []),
                            { 'role': 'user', 'content': text },
                            { 'role': 'assistant', 'content': m.quoted ? m.quoted.text : "" },
                            { 'role': 'user', 'content': text }
                        ];
    
                        try {
                            var data = await scraper.ai.chatGptOss120b(messages);
    
                            if (data.data.answer) {
                                db.data.openai[m.sender].push({
                                    role: 'user',
                                    content: text
                                });
                                db.data.openai[m.sender].push({
                                    role: 'assistant',
                                    content: data.data.answer.trim().replace('Assistant:', '').trim()
                                });
                                await db.write()
                            }
                        } catch {
                            data = await chatGpt3([{ 'role': 'user', 'content': text }], m);
    
                            if (data.data.answer) {
                                db.data.openai[m.sender].push({
                                    role: 'user',
                                    content: text
                                });
                                db.data.openai[m.sender].push({
                                    role: 'assistant',
                                    content: data.data.answer.trim().replace('Assistant:', '').trim()
                                });
                                await db.write()
                            }
                        }
                        
                        let answerText = data;
                        if (data.data && data.data.answer) {
                            answerText = data.data.answer.includes("Assistant:") ? data.data.answer.trim().replace('**Assistant:**', 'Assistant:').replace('*Assistant:*', 'Assistant:').split("Assistant:")[1].trim() : data.data.answer.includes("Human") ? data.data.answer.trim().replace("**Human:**","Human:").replace("*Human:*","Human:").split("Human:")[1].trim() : data.data.answer.trim()
                           answerText = answerText.replaceAll("**","*")
                        }

                        if (voiceCommandRegex.test(isiPesan)) {
                            await conn.sendPresenceUpdate('recording', m.from);
      
                            scraper.elevenlabs.textToSpeech(setting.elevenlabs.key, answerText, "52LXmmR0nGnIcDs1TL3f", `${tool.getRandom(m.sender.split("@")[0])}AI`)
                                .then(async(d) => {
                                    await m.reply({ audio: fs.readFileSync(d), mimetype: "audio/mpeg", ptt: true })
                                    fs.unlinkSync(d)
                                })
                                .catch(() => {
                                    xzons.gtts("id").save("./temp/"+m.sender+".mp3", answerText, function() {
                                        conn.sendMessage(m.from, { audio: { url: "./temp/"+m.sender+".mp3" }, ptt: true, mimetype: "audio/mpeg", fileName: m.sender+".mp3" }, { quoted: m })
                                            .then(() => fs.unlinkSync("./temp/"+m.sender+".mp3"))
                                    })
                                })
                            } else {
                                conn.sendMessage(m.from, { text: answerText }, { quoted: m, msgId: "AICHAT" });
                            }
                        }
                    }
                }
            }
        }
    }, 
chatGpt3}