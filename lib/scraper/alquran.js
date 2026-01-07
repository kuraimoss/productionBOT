const axios = require("axios");
const cheerio = require("cheerio");

exports.surah = async (surah) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://litequran.net/` + surah).then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const arab = [];
            const latin = [];
            const arti = [];
            const result = [];
            $("body > main > article > ol > li > p.arabic").each(function(a, b) {
                deta = $(b).text();
                arab.push(deta);
            });
            $("body > main > article > ol > li > p.translate").each(function(a, b) {
                deta = $(b).text();
                latin.push(deta);
            });
            $("body > main > article > ol > li > p.meaning").each(function(a, b) {
                deta = $(b).text();
                arti.push(deta);
            });
            num = 1;
            for (let i = 0; i < arab.length; i++) {
                result.push({
                    ayat: num,
                    arabic: arab[i],
                    latin: latin[i],
                    arti: arti[i],
                });
                num += 1;
            }
            resolve({
                status: true,
                author,
                surat: $("body > main > article > h1").text(),
                jumlah_ayat: arab.length,
                result: result,
            });
        });
    });
};

exports.listsurah = async () => {
    return new Promise((resolve, reject) => {
        axios.get("https://litequran.net/").then(({
            data
        }) => {
            const $ = cheerio.load(data);
            surah = [];
            data = [];
            $("body > main > ol > li > a").each(function(a, b) {
                data.push($(b).attr("href"));
            });
            no = 1;
            for (let i of data) {
                surah.push({
                    no: no,
                    surah: i,
                });
                no += 1;
            }
            resolve(surah);
        });
    });
};