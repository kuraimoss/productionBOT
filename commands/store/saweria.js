const axios = require('axios');
const cheerio = require('cheerio');

//scrape ini cocok untuk bot store, discord, dan apapun itu ini aman banget untuk kalian semua

const BACKEND = 'https://backend.saweria.co';
const FRONTEND = 'https://saweria.co';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15'
};

function insertPlusInEmail(email, insertStr) {
    return email.replace("@", `+${insertStr}@`);
}

async function paidStatus(transactionId) {
    try {
        const response = await axios.get(`${BACKEND}/donations/qris/${transactionId}`, {
            headers,
            timeout: 2000
        });

        if (Math.floor(response.status / 100) !== 2) {
            throw new Error("Transaction ID is not found!");
        }

        const data = response.data.data || {};
        return data.qr_string === "";
    } catch (error) {
        if (error.response) {
            throw new Error("Transaction ID is not found!");
        }
        throw error;
    }
}

async function createPaymentString(saweriaUsername, amount, sender, email, pesan) {
    if (!saweriaUsername || !amount || !sender || !email || !pesan) {
        throw new Error("Parameter is missing!");
    }
    if (amount < 10000) {
        throw new Error("Minimum amount is 10000");
    }

    console.log(`Loading ${FRONTEND}/${saweriaUsername}`);

    try {
        const response = await axios.get(`${FRONTEND}/${saweriaUsername}`, {
            headers,
            timeout: 2000
        });

        const $ = cheerio.load(response.data);
        const nextDataScript = $('#__NEXT_DATA__').html();

        if (!nextDataScript) {
            throw new Error("Saweria account not found");
        }

        const nextData = JSON.parse(nextDataScript);
        const userId = nextData?.props?.pageProps?.data?.id;

        if (!userId) {
            throw new Error("Saweria account not found");
        }

        const payload = {
            agree: true,
            notUnderage: true,
            message: pesan,
            amount: parseInt(amount),
            payment_type: "qris",
            vote: "",
            currency: "IDR",
            customer_info: {
                first_name: sender,
                email: email,
                phone: ""
            }
        };

        const postResponse = await axios.post(`${BACKEND}/donations/${userId}`, payload, {
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            }
        });

        return postResponse.data.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.message || "Request failed");
        }
        throw error;
    }
}

async function createPaymentQr(saweriaUsername, amount, sender, email, pesan) {
    const paymentDetails = await createPaymentString(saweriaUsername, amount, sender, email, pesan);
    return [paymentDetails.qr_string, paymentDetails.id];
}


/**
jika butuh fitur bot whatsapp casenya nih
const pendingTransactions = new Map();
const QRCode = require('qrcode')

case 'saweria':
case 'donate':
case 'donasi': {
    if (!text) {
        return reply(`╭━━━━『 *SAWERIA DONATION* 』━━━━╮

📝 *Format Penggunaan:*
${prefix + command} [username] [jumlah] [nama] [email] [pesan]

📌 *Contoh:*
${prefix + command} hannuniverse 10000 Budi budi@saweria.co Semangat!

⚠️ *Catatan:*
• Minimal donasi: Rp 10.000
• Pastikan semua data diisi dengan benar
• Email harus valid

╰━━━━━━━━━━━━━━━━━━━━━╯`);
    }

    const cmdArgs = text.split(' ');
    if (cmdArgs.length < 5) {
        return reply('❌ *Format salah!*\n\nGunakan: ' + prefix + command + ' [username] [jumlah] [nama] [email] [pesan]');
    }

    const [username, amountStr, nama, email, ...pesanArr] = cmdArgs;
    const amount = parseInt(amountStr);
    const pesan = pesanArr.join(' ');

    if (isNaN(amount)) {
        return reply('❌ Jumlah donasi harus berupa angka!');
    }

    if (amount < 10000) {
        return reply('❌ Minimal donasi adalah Rp 10.000');
    }

    reply('⏳ *Sedang membuat pembayaran...*\nMohon tunggu sebentar...');

    try {
        const [qrString, transactionId] = await createPaymentQr(
            username,
            amount,
            nama,
            email,
            pesan
        );

        const qrBuffer = await QRCode.toBuffer(qrString, {
            width: 500,
            margin: 2
        });

        pendingTransactions.set(transactionId, {
            sender: sender,
            amount: amount,
            nama: nama,
            email: email,
            pesan: pesan,
            username: username,
            timestamp: Date.now()
        });

        const message = `╭━━━━『 *PAYMENT CREATED* 』━━━━╮

✅ *Pembayaran berhasil dibuat!*

📋 *Detail Transaksi:*
• ID: ${transactionId.substring(0, 8)}...
• Penerima: @${username}
• Jumlah: Rp ${amount.toLocaleString('id-ID')}
• Nama: ${nama}
• Pesan: ${pesan}

📱 *Cara Pembayaran:*
1. Scan QR Code di atas
2. Atau gunakan string QRIS manual
3. Selesaikan pembayaran

⏰ *Cek Status:*
Gunakan: ${prefix}cekpayment ${transactionId}

╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await client.sendMessage(m.chat, {
            image: qrBuffer,
            caption: message,
            mentions: [sender]
        }, { quoted: m });

        setTimeout(async () => {
            try {
                const isPaid = await paidStatus(transactionId);
                if (isPaid && pendingTransactions.has(transactionId)) {
                    const txData = pendingTransactions.get(transactionId);
                    pendingTransactions.delete(transactionId);
                    
                    await client.sendMessage(m.chat, {
                        text: `╭━━━━『 *PAYMENT SUCCESS* 』━━━━╮

🎉 *Pembayaran Berhasil!*

✅ Transaksi ID: ${transactionId.substring(0, 8)}...
💰 Jumlah: Rp ${txData.amount.toLocaleString('id-ID')}
👤 Nama: ${txData.nama}

Terima kasih atas donasi Anda! 🙏

╰━━━━━━━━━━━━━━━━━━━━━╯`,
                        mentions: [txData.sender]
                    });
                }
            } catch (err) {
                console.error('Auto check payment error:', err);
            }
        }, 60000);

    } catch (error) {
        console.error('Saweria error:', error);
        return reply('❌ *Gagal membuat pembayaran!*\n\n' + 
                    'Kemungkinan penyebab:\n' +
                    '• Username Saweria tidak ditemukan\n' +
                    '• Server sedang bermasalah\n' +
                    '• Format email salah');
    }
    break;
}

case 'cekpayment':
case 'checkpayment':
case 'statuspayment': {
    if (!text) {
        return reply(`╭━━━━『 *CEK STATUS PAYMENT* 』━━━━╮

📝 *Format Penggunaan:*
${prefix + command} [transaction_id]

📌 *Contoh:*
${prefix + command} 12345678-1234-1234-1234-123456789012

╰━━━━━━━━━━━━━━━━━━━━━╯`);
    }

    const transactionId = text.trim();
    
    reply('⏳ *Mengecek status pembayaran...*');

    try {
        const isPaid = await paidStatus(transactionId);
        
        const txData = pendingTransactions.get(transactionId);
        
        if (isPaid) {
            if (pendingTransactions.has(transactionId)) {
                pendingTransactions.delete(transactionId);
            }

            let message = `╭━━━━『 *PAYMENT STATUS* 』━━━━╮

✅ *STATUS: PAID (Lunas)*

📋 *Detail:*
• ID: ${transactionId.substring(0, 8)}...
`;
            
            if (txData) {
                message += `• Jumlah: Rp ${txData.amount.toLocaleString('id-ID')}
• Nama: ${txData.nama}
• Penerima: @${txData.username}
`;
            }

            message += `
🎉 Pembayaran telah berhasil!
Terima kasih atas donasi Anda! 🙏

╰━━━━━━━━━━━━━━━━━━━━━╯`;

            return reply(message);
        } else {
            let message = `╭━━━━『 *PAYMENT STATUS* 』━━━━╮

⏳ *STATUS: PENDING (Belum Dibayar)*

📋 *Detail:*
• ID: ${transactionId.substring(0, 8)}...
`;
            
            if (txData) {
                message += `• Jumlah: Rp ${txData.amount.toLocaleString('id-ID')}
• Nama: ${txData.nama}
• Penerima: @${txData.username}
• Dibuat: ${moment(txData.timestamp).format('DD/MM/YYYY HH:mm')}
`;
            }

            message += `
⚠️ Pembayaran belum diselesaikan
Silakan selesaikan pembayaran terlebih dahulu

╰━━━━━━━━━━━━━━━━━━━━━╯`;

            return reply(message);
        }

    } catch (error) {
        console.error('Check payment error:', error);
        return reply('❌ *Gagal mengecek status pembayaran!*\n\n' +
                    'Kemungkinan penyebab:\n' +
                    '• Transaction ID tidak valid\n' +
                    '• Transaction ID tidak ditemukan\n' +
                    '• Server sedang bermasalah');
    }
    break;
}

case 'listtransaction':
case 'listtx':
case 'mytransactions': {
    const userTransactions = Array.from(pendingTransactions.entries())
        .filter(([_, data]) => data.sender === sender);

    if (userTransactions.length === 0) {
        return reply('📝 *Tidak ada transaksi pending*\n\nAnda belum memiliki transaksi yang pending.');
    }

    let message = `╭━━━━『 *MY TRANSACTIONS* 』━━━━╮

📋 *Transaksi Pending Anda:*\n\n`;

    userTransactions.forEach(([txId, data], index) => {
        message += `${index + 1}. *Transaction ${txId.substring(0, 8)}...*
   💰 Jumlah: Rp ${data.amount.toLocaleString('id-ID')}
   👤 Penerima: @${data.username}
   ⏰ Waktu: ${moment(data.timestamp).format('DD/MM/YY HH:mm')}
   
`;
    });

    message += `\n💡 *Cek status:* ${prefix}cekpayment [id]

╰━━━━━━━━━━━━━━━━━━━━━╯`;

    return reply(message);
    break;
}
 */