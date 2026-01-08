module.exports = {
  name: ['block','unblock'],
  param: '<number/reply/mentions>',
  cmd: ['block','unblock'],
  category: 'owner',
  desc: "Blokir atau buka blokir user (owner).",
  owner: true,
  async handler(m, {conn, args}){
    const action = m.command == 'block' ? 'block' : 'unblock'
    let blockList = await conn.fetchBlocklist()
    if(m.quoted){
    if (action === "block" ? (blockList.includes(m.quoted.sender)) : (!blockList.includes(m.quoted.sender))) return m.reply(`Failed to ${action} user @${m.quoted.sender.split("@")[0]} ${action === "block" ? "because he has been blocked before" : "because it was not blocked before"}`, { withTag: true })
      await conn.updateBlockStatus(m.quoted.sender, action)
      m.reply(`Succsess ${action} @${m.quoted.sender.split("@")[0]} User`, { withTag: true })
    }
    else if(!m.quoted && m.mentions  != ''){
    if (action === "block" ? (blockList.includes(m.mentions[0])) : (!blockList.includes(m.mentions[0]))) return m.reply(`Failed to ${action} user @${m.mentions[0].split("@")[0]} ${action === "block" ? "because he has been blocked before" : "because it was not blocked before"}`, { withTag: true })
      await conn.updateBlockStatus(m.mentions[0], action)
      m.reply(`Succsess ${action} @${m.mentions[0].split("@")[0]} User`, { withTag: true })
    } else if (Number(args[0])) {
    let Nonye = args[0] + "@s.whatsapp.net"
    if (action === "block" ? (blockList.includes(Nonye)) : (!blockList.includes(Nonye))) return m.reply(`Failed to ${action} user @${args[0]} ${action === "block" ? "because he has been blocked before" : "because it was not blocked before"}`, { withTag: true })
      await conn.updateBlockStatus(Nonye, action)
      m.reply(`Succsess ${action} @${args[0]} User`, { withTag: true })
    }
  }
}
