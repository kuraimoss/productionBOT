const toms = require('ms')
module.exports = {
    name: ['antispam_function'],
    antispam: true,
    function: true,
    desc: "Fungsi antispam: memberi cooldown agar command tidak di-spam (±6 detik).",
    async handler(m, {conn, isCreator}){
        if(m.command && m.type != 'buttonsResponseMessage' ){
            if(m.from in conn.cooldown == false){
                conn.cooldown[m.from] = {
                    id: m.from,
                    timestamp: Date.now() + await toms('6000')
                }
                setTimeout(() => {
                    delete conn.cooldown[m.from]
                }, 6000)
            }
        }
    }
}
