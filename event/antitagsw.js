var msgType = Object.keys(m.message)[0];
const isGroupStatus = msgType == "groupStatusMentionMessage" || msgType == "groupStatusMessageV2";

let userStatus = {};

if (isGroupStatus) {
    if (userStatus[m.sender] == undefined) {
        userStatus[m.sender] = {
            count: 0
        }
    };
    
    userStatus[m.sender].count += 1
    conn.sendMessage(m.from, { text: `Kamu membuat status tag group sebanyak ${userStatus[m.sender].count}, jika masih mengulanginya sebanyak 5 kali kamu akan dikick` }, { quoted: m })
    if (userStatus[m.sender].count >= 5) {
        //fungsi kick
    }
}