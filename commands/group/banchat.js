module.exports = {
    name: ['banchat','mute'],
    cmd: ['banchat', 'mute'],
    category: 'group',
    desc: 'Mute bot di grup ini (bot tidak akan merespons sampai di-unmute).',
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
