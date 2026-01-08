const slirik = require('music-lyrics')
module.exports = {
    name: 'lirik',
    param: '<query>',
    cmd: ['lirik', 'lyrics'],
    category: 'search',
    desc: 'Mencari lirik lagu berdasarkan judul/keyword.',
    query: true,
    async handler(m, {conn, text}){
        await m.reply(response.wait)
        try {
            const lirik = await slirik.search(text)
            if (lirik == '') return m.reply('Lyrics not found!')
            await m.reply(lirik)
        } catch {
            m.reply('Lyrics not found!')
        }
    }
}
