module.exports = {
    name: "typodetect",
    function: true,
    typo: true,
    async handler(m, { conn, isCreator, prefix, command }) {
        try {
            pe = await Object.values(attr.commands).filter(plugin => !plugin.disabled)
            cmd = []
            pe.map(cemde => {
                cemde.cmd.map(ps => {
                    cmd.push(ps)
                })
            })
            typo = await tool.typoDetect(command, cmd)
            if (typo != '') {
                if (typo.accuracy >= 0.7) {
                    m.reply(`Mungkin yang anda\nmaksud adalah : ${prefix}${typo.suggestion}\nKeakuratan : ${(typo.accuracy * 100).toFixed(0)}%\nSilahkan kirim ulang jika benar`)
                }
            }
        } catch {
        }
    }
}