module.exports = {
    name: ['banchat','mute'],
    cmd: ['banchat', 'mute'],
    category: 'group',
    desc: 'mute chat in group',
    group: true,
    admin: true,
    async handler(m, {conn}){
        await db.read()
        if(db.data.group[m.from].mute) return m.reply('Bot telah dimute digroup sebelumnya!')
        db.data.group[m.from].mute = true
        await db.write()
        m.reply('Bot dimute digroup ini!')
    }
}