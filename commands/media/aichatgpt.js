const { chatGpt3 } = require("../functions/aichat.js")

module.exports = {
name: ["ai","aichat","openai"],
param: "<query>",
cmd: ["ai","aichatgpt","aichat","openai"],
category: "media",
query: true,
limit: true,
async handler(m, { conn, q, isImage, isQImage }) {
    const voiceCommandRegex = /(?:^|\s)voice(?:\s|$)/i;
    let text = q.replace("voice", "")
    await db.read()
    if (db.data.openai[m.sender] == undefined) {
      db.data.openai[m.sender] = [];
      await db.write()
    }
    if (db.data.openai[m.sender].length >= 10) {
      db.data.openai[m.sender] = [];
      await db.write()
    }
    
    if (isImage || isQImage) {
    
    tool.telegraph(isImage ? (await m.download()) : (await m.quoted.download())).then(async(urlImage) => {
    let messages = [{ 'role': 'user', 'content': text, 'img_url': urlImage }]
    var data = await scraper.ai.chatMatagVision(messages)
    
    let answerText = data.result

    if (voiceCommandRegex.test(q)) {
      await conn.sendPresenceUpdate('recording', m.from);
      
      try {
      let voiceUrl = `https://ai.xterm.codes/api/text2speech/elevenlabs?text=${encodeURIComponent(answerText)}&key=Bell409&voice=bella`;
      await conn.sendMessage(m.from, { audio: { url: voiceUrl }, fileName: "ai.mp3", mimetype: "audio/mpeg", ptt: true }, { quoted: m });
      } catch {
      xzons.gtts("id").save("./temp/"+m.sender+".mp3", answerText, function() {
      conn.sendMessage(m.from, { audio: { url: "./temp/"+m.sender+".mp3" }, ptt: true, mimetype: "audio/mpeg", fileName: m.sender+".mp3" }, { quoted: m })
      .then(() => fs.unlinkSync("./temp/"+m.sender+".mp3"))
      })
      }
    } else {
      await m.reply(answerText);
    }
    })
    
    } else {
    let messages = [
      ...(db.data.openai[m.sender].map((msg) => ({ role: msg.role, content: msg.content })) || []),
      { 'role': 'user', 'content': text }
    ];
    
    
    var data = await chatGpt3([{ 'role': 'user', 'content': text }], m);
    
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

    let answerText = data.data ? data.data.answer.trim().replace('Assistant:', '').trim().replaceAll("**","*") : data

    if (voiceCommandRegex.test(q)) {
      await conn.sendPresenceUpdate('recording', m.from);
      
      try {
      let voiceUrl = `https://ai.xterm.codes/api/text2speech/elevenlabs?text=${encodeURIComponent(answerText)}&key=Bell409&voice=bella`;
      await conn.sendMessage(m.from, { audio: { url: voiceUrl }, fileName: "ai.mp3", mimetype: "audio/mpeg", ptt: true }, { quoted: m });
      } catch {
      xzons.gtts("id").save("./temp/"+m.sender+".mp3", answerText, function() {
      conn.sendMessage(m.from, { audio: { url: "./temp/"+m.sender+".mp3" }, ptt: true, mimetype: "audio/mpeg", fileName: m.sender+".mp3" }, { quoted: m })
      .then(() => fs.unlinkSync("./temp/"+m.sender+".mp3"))
      })
      }
    } else {
      await m.reply(answerText, { msgId: "AICHAT"});
    }
    }
}}