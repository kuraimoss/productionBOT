const pendingTransactions = new Map();
const QRCode = require('qrcode')
const axios = require('axios');
const cheerio = require('cheerio');
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

module.exports = {
    name: "donasi",
    cmd: ["donasi"],
    category: "store",
    async handler(m, { conn, prefix, args }) {
        if (!args[0]) return m.reply(`*• Example :* ${prefix + m.command} 10000`)
        if (isNaN(args[0])) return m.reply('Saldo harus berupa angka!')
        let amount = parseInt(args[0])
        if (amount < 10000) return m.reply('Jumlah saldo minamal Rp10.000')
        
        try {
            const payment = await createPaymentString(
                "zackmans",
                amount,
                "Donatur",
                "msalmanalfarizi6342@gmail.com",
                "tidak ada pesan"
            );

            const qrBuffer = await QRCode.toBuffer(payment.qr_string, {
                width: 500,
                margin: 2
            });
            
            let capt = `*Lakukan Pembayaran Sebesar "Rp ${await tool.formatRupiah(payment.amount.toString())}"*\n`;
            capt += `(Sudah Termasuk Biaya Admin)\n\n`;
            capt += `QRIS Berlaku Selama 5 Menit\n\n`;
            capt += 'Untuk cek donasi yang sudah masuk, ketik `#donatur`\n\n';
            capt += '```Panduan Pembayaran :```\n';
            capt += '1. Buka aplikasi yang mendukung pembayaran dengan QRIS\n';
            capt += '2. Pilih fitur QRIS / Bayar\n';
            capt += '3. Pindai kode QR yang diberikan oleh Merchant\n';
            capt += '4. Pastikan tagihan yang ditagihkan sesuai\n';
            capt += '5. Klik tombol Konfirmasi\n';
            capt += '6. Masukkan PIN untuk menyelesaikan pembayaran\n';
            capt += '7. Setelah pembayaran berhasil, kamu akan dialihkan ke Halaman Hasil Pembayaran';
            let zm = await m.reply({ image: qrBuffer, caption: capt})
            let startTime = Date.now();
            let timeout = 300000;
            let isPaid = false;
            let status = false;
            
            while (Date.now() - startTime < timeout) {
                isPaid = await paidStatus(payment.id);
                if (isPaid) {
                    status = true;
                break;
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            if (status) {
                await m.reply(`Pembayaran @${m.sender.split("@")[0]} Berhasil dilakukan.`, { withTag: true });
                users[m.sender].donatur = true
                users[m.sender].donate += Number(amount);
                await fs.writeFileSync('./database/json/user.json', JSON.stringify(users, null, 2))
                await m.reply(`Makasih atas dukungannya 🙏`);
                await conn.sendMessage(m.from, { delete: zm.key });
                await conn.sendMessage(m.from, { react: { text: '✅', key: m.key } });
            } else {
                await m.reply(`Pembayaran @${m.sender.split("@")[0]} Gagal dilakukan.`, { withTag: true });
                await conn.sendMessage(m.from, { delete: zm.key });
                await conn.sendMessage(m.from, { react: { text: '❎', key: m.key } });
            }
        } catch(e) {
            console.error('Saweria error:', e);
            return m.reply('❌ *Gagal membuat pembayaran!*');
        }
    }
}