async function call(json, conn) {
    const content = json.content[0]
    await db.read();
	if (content.tag == "offer") {
	    let blockList = await conn.fetchBlocklist()
	    //console.log(content)
	    let sender = content.attrs["call-creator"]
	    let idCall = content.attrs["call-id"]
	    if (db.data.call[sender] == undefined) {
	    db.data.call[sender] = { count: 0 }
	    await db.write();
	    }
	    await conn.rejectCall(idCall, sender);
	    if (blockList.includes(sender)) return;
		
		db.data.call[sender].count += 1
		await db.write();
		conn.sendMessage(sender, {
			text: `${botName} tidak bisa menerima panggilan telfon, anda menelfon sebanyak *${db.data.call[sender].count}* kali, jika kamu masih spam telfon sampai 3 kali, kamu akan diblockir, hubungi @${owner[0].split("@")[0]} untuk membuka pemblokiran.`, withTag: true
		});
		if (db.data.call[sender].count >= 3) {
		conn.sendMessage(sender, { text: "kamu diblockir!!" })
		await tool.sleep(8000);
		await conn.updateBlockStatus(sender, "block");
		db.data.call[sender].count = 0
		await db.write();
		}
	}
}
module.exports = call;
