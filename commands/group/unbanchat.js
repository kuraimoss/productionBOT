module.exports = {
    name: ['unbanchat','unmute'],
    cmd: ['unbanchat', 'unmute'],
    category: 'group',
    desc: 'mute chat in group',
    group: true,
    admin: true,
    async handler(m, {conn}){
        await db.read()
        if(!db.data.group[m.from].mute) return m.reply('Bot tidak dimute digroup ini!')
        db.data.group[m.from].mute = false
        await db.write()
        m.reply('Bot diunmute digroup ini!')
    }
}