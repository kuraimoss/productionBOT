const crypto = require('crypto');
const axios = require('axios');
const { URLSearchParams } = require('url');
const qrcode = require("qrcode");

module.exports = {
name: "donasi",
cmd: ["donasi"],
category: "store",
maintenance: true,
async handler(m, { conn, prefix, args }) {
if (!args[0]) return m.reply(`*• Example :* ${prefix}donasi 5k - 5000`)
if (args[0] === '0') return m.reply('Masukan jumlah saldo yang valid.')

function pickrandomref() {
  var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var symbolLength = symbols.length;
  var currentDate = new Date();
  
  // Generate a random 3-letter symbol
  var randomSymbol = '';
  for (var i = 0; i < 3; i++) {
    randomSymbol += symbols.charAt(Math.floor(Math.random() * symbolLength));
  }

  var randomString = 'MANS' +
    currentDate.getFullYear() +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    ('0' + currentDate.getDate()).slice(-2) + randomSymbol;

  return randomString;
}

let data = await parseAmount(args[0])
let payment = await paydisini(pickrandomref(), data)
if (!payment) return m.reply("Fitur ini sedang mengalami bug silahkan coba lagi nanti")
let images = await sendQRCode(payment.qr_content);
let capt = `*Lakukan Pembayaran Sebesar "Rp ${await tool.formatRupiah(payment.amount.toString())}"*\n`;
capt += `(Sudah Termasuk Biaya Admin)\n\n`;
capt += `QRIS Berlaku Selama 5 Menit atau Hingga ${payment.expired}\n\n`;
capt += 'Untuk cek donasi yang sudah masuk, ketik `#donatur`\n\n';
capt += '```Panduan Pembayaran :```\n';
capt += '1. Buka aplikasi yang mendukung pembayaran dengan QRIS\n';
capt += '2. Pilih fitur QRIS / Bayar\n';
capt += '3. Pindai kode QR yang diberikan oleh Merchant\n';
capt += '4. Pastikan tagihan yang ditagihkan sesuai\n';
capt += '5. Klik tombol Konfirmasi\n';
capt += '6. Masukkan PIN untuk menyelesaikan pembayaran\n';
capt += '7. Setelah pembayaran berhasil, kamu akan dialihkan ke Halaman Hasil Pembayaran';
let zm = await conn.sendFile(m.from, images, "", capt, m)
let startTime = Date.now();
let timeout = 300000;
let cektrx = "";
let status = "";

while (Date.now() - startTime < timeout) {
  cektrx = await paydisinicek(payment.unique_code);
  let match = cektrx.status;

  if (match === "Success") {
  status = "sukses";
  break;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
}
if (status === "sukses") {
await m.reply(`Pembayaran @${m.sender.split("@")[0]} Berhasil dilakukan.`, { withTag: true });
users[m.sender].donatur = true
users[m.sender].donate += Number(data);
await fs.writeFileSync('./database/json/user.json', JSON.stringify(users, null, 2))
await m.reply(`Makasih atas dukungannya 🙏`);
await conn.sendMessage(m.from, { delete: zm.key });
await conn.sendMessage(m.from, { react: { text: '✅', key: m.key } });
} else {
await m.reply(`Pembayaran @${m.sender.split("@")[0]} Gagal dilakukan.`, { withTag: true });
await conn.sendMessage(m.from, { delete: zm.key });
await conn.sendMessage(m.from, { react: { text: '❎', key: m.key } });
}
  }
}

async function paydisini(code, amount) {
 const keys = setting.paydisini.key;
 const data = keys + code + '11' + amount + '300' + 'NewTransaction';
 const hash = crypto.createHash('md5').update(data).digest('hex');
 const sign = hash;

 const config = {
  method: 'POST',
  url: 'https://api.paydisini.co.id/v1/',
  data: new URLSearchParams(Object.entries({
key: keys,
request: 'new',
unique_code: code,
service: '11',
amount: amount,
note: 'Terimakasih Sudah Donasi Kak!',
valid_time: '300',
type_fee: '1',
signature: sign,
  })),
 };

 try {
  const response = await axios(config);
  return response.data.data;
 } catch (error) {
  throw new Error(`Error in paydisini: ${error.message}`);
 }
}

async function paydisinicek(code) {
 const keys = setting.paydisini.key;
 const data = keys + code + 'StatusTransaction';
 const hash = crypto.createHash('md5').update(data).digest('hex');
 const sign = hash;

 const config = {
  method: 'POST',
  url: 'https://api.paydisini.co.id/v1/',
  data: new URLSearchParams(Object.entries({
key: keys,
request: 'status',
unique_code: code,
signature: sign,
  })),
 };

 try {
  const response = await axios(config);
  return response.data.data;
 } catch (error) {
  throw new Error(`Error in paydisini: ${error.message}`);
 }
}

async function status() {
 const keys = setting.paydisini.key;
 const data = keys + 'PaymentChannel'
 const hash = crypto.createHash('md5').update(data).digest('hex');
 const sign = hash;

 const config = {
  method: 'POST',
  url: 'https://api.paydisini.co.id/v1/',
  data: new URLSearchParams(Object.entries({
key: keys,
request: 'payment_channel',
signature: sign,
  })),
 };

 try {
  const response = await axios(config);
  return response.data.data;
 } catch (error) {
  throw new Error(`Error in paydisini: ${error.message}`);
 }
}

async function sendQRCode(text) {
 try {
  const images = await qrcode.toDataURL(text.slice(0, 2048), { scale: 8 })
  return images
 } catch (error) {
  console.error('Error downloading image:', error);
 }
}

async function parseAmount(input) {
 input = input.replace(/\s+/g, '').toLowerCase();

 const patterns = [
  /^(\d+(?:[.,]\d{1,2})?)$/,
  /^(\d+(?:[.,]\d{1,2})?k)$/, 
  /^(\d+(?:[.,]\d{1,2})?jt)$/,  
  /^(\d+(?:[.,]\d{1,2})?juta)$/ 
 ];

 for (const pattern of patterns) {
  const match = input.match(pattern);
  if (match) {
let amountStr = match[1].replace(/[^0-9]/g, '');

if (input.includes('k')) {
 amountStr += '000';
} else if (input.includes('jt') || input.includes('juta')) {
 amountStr += '000000';
}

return parseInt(amountStr, 10);
  }
 }
 return null;
}