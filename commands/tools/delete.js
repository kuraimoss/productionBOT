module.exports = {
  name: 'delete',
  param: '<reply chat>',
  cmd: ['delete', 'del'],
  category: "tools",
  desc: 'Menghapus pesan dengan cara reply pesan (butuh izin admin jika menghapus pesan orang lain di grup).',
  quoted: true,
  async handler(m, {conn, isAdmin, isCreator, isBotAdmin}){
    if (m.quoted.key.fromMe) {
    await conn.sendMessage(m.from, {delete: {...m.quoted.key}})
    } else {
    if (!m.isGroup) return
    if (!isAdmin && !isCreator) return
    if (!isBotAdmin) return m.reply(response.botadmin);
    await conn.sendMessage(m.from, {delete: {...m.quoted.key, participant: m.quoted.sender}})
    }
  }
}
