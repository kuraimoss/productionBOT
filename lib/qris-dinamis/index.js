const QRCode = require('qrcode');
const Jimp = require('jimp');
const { dataQris, pad, toCRC16 } = require('./function.js');
const fs = require('fs');
const basePath = './media';

const makeString = (qris, { nominal, taxtype = 'p', fee = '0' } = {}) => {
    if (!qris) throw new Error('The parameter "qris" is required.');
    if (!nominal) throw new Error('The parameter "nominal" is required.');

    let tax = '';
    let qrisModified = qris.slice(0, -4).replace("010211", "010212");
    let qrisParts = qrisModified.split("5802ID");

    let amount = "54" + pad(nominal.length) + nominal;

    if (taxtype && fee) {
        tax = (taxtype === 'p')
            ? "55020357" + pad(fee.length) + fee
            : "55020256" + pad(fee.length) + fee;
    }

    amount += (tax.length === 0) ? "5802ID" : tax + "5802ID";
    let output = qrisParts[0].trim() + amount + qrisParts[1].trim();
    output += toCRC16(output);

    return output;
};

const makeFile = async (qris, { nominal, base64 = false, taxtype = 'p', fee = '0', path = '' } = {}) => {
    try {
        const qrisModified = makeString(qris, { nominal, taxtype, fee });
        let tempRandom = await tool.getRandom(nominal);

        await QRCode.toFile(`./temp/${tempRandom}.png`, qrisModified, { margin: 2, scale: 10 });

        let data = dataQris(qris);
        let text = data.merchantName;

        const qr = await Jimp.read(`./temp/${tempRandom}.png`);
        const image = await Jimp.read(`${basePath}/image/template.png`);

        const w = image.bitmap.width;
        const h = image.bitmap.height;

        const fontTitle = await Jimp.loadFont(text.length > 18 ? `${basePath}/font/BebasNeueSedang/BebasNeue-Regular.ttf.fnt` : `${basePath}/font/BebasNeue/BebasNeue-Regular.ttf.fnt`);
        const fontMid = await Jimp.loadFont(text.length > 28 ? `${basePath}/font/RobotoSedang/Roboto-Regular.ttf.fnt` : `${basePath}/font/RobotoBesar/Roboto-Regular.ttf.fnt`);
        const fontSmall = await Jimp.loadFont(`${basePath}/font/RobotoKecil/Roboto-Regular.ttf.fnt`);

        image
            .composite(qr, w / 4 - 30, h / 4 + 68)
            .print(fontTitle, w / 5 - 30, h / 5 + 68, { text, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, w / 1.5, text.length > 28 ? -180 : -210)
            .print(fontMid, w / 5 - 30, h / 5 + 68, { text: `NMID : ${data.nmid}`, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, w / 1.5, text.length > 28 ? 20 : -45)
            .print(fontMid, w / 5 - 30, h / 5 + 68, { text: data.id, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, w / 1.5, text.length > 28 ? 110 : 90)
            .print(fontSmall, w / 20, 1205, `Dicetak oleh: ${data.nns}`);

        if (!path) {
            path = `./temp/${text}-${Date.now()}.jpg`;
        }

        if (base64) {
            const base64Image = await image.getBase64Async(Jimp.MIME_JPEG);
            fs.unlinkSync(`./temp/${tempRandom}.png`);
            return base64Image;
        } else {
            await image.writeAsync(path);
            fs.unlinkSync(`./temp/${tempRandom}.png`);
            return path;
        }
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    makeFile,
    makeString
};
