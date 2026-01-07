const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const needle = require("needle");
const fetch = require("node-fetch");
const encodeUrl = require("encodeurl");

const speechToText = async(audioData) => {
const baseUrl = "https://api.assemblyai.com";

const headers = {
  authorization: "3c89d24595cb4c6da40cf8b49bfdbf8a",
};

// You can upload a local file using the following code
// const path = "./my-audio.mp3";
const uploadResponse = await axios.post(`${baseUrl}/v2/upload`, audioData, {
   headers,
});
const audioUrl = uploadResponse.data.upload_url;

//const audioUrl = "https://d.uguu.se/fvrfTwMr.aac";

const data = {
  audio_url: audioUrl,
  speaker_labels: true,
  format_text: true,
  punctuate: true,
  speech_model: "universal",
  language_code: "id",
};

const url = `${baseUrl}/v2/transcript`;
const response = await axios.post(url, data, { headers: headers });

const transcriptId = response.data.id;
const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

let sptt = {
status: false
}

while (true) {
  const pollingResponse = await axios.get(pollingEndpoint, {
    headers: headers,
  });
  const transcriptionResult = pollingResponse.data;

  if (transcriptionResult.status === "completed") {
  
sptt = {
status: true,
text: transcriptionResult.text
}
    break;
  } else if (transcriptionResult.status === "error") {
   
sptt = {
status: false
}

break;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

return sptt
}

const libur = async (tahun) => {
    const data = await axios.get("https://tanggalan.com/" + tahun);
    const $ = cheerio.load(data.data);
    const result = {};
    result["tahun"] = tahun;
    result["data"] = [];
    num = 1;
    $("#main > article > ul").each(function(a, b) {
        tbulan = $(b).find("li:nth-child(1) > a").attr("href").split("-")[0];
        bulan =
            tbulan == "januari" ?
            "January 1" :
            tbulan == "februari" ?
            "February 2" :
            tbulan == "maret" ?
            "March 3" :
            tbulan == "april" ?
            "April 4" :
            tbulan == "mei" ?
            "May 5" :
            tbulan == "juni" ?
            "June 6" :
            tbulan == "juli" ?
            "July 7" :
            tbulan == "agustus" ?
            "August 8" :
            tbulan == "september" ?
            "September 9" :
            tbulan == "oktober" ?
            "October 10" :
            tbulan == "november" ?
            "November 11" :
            tbulan == "desember" ?
            "December 12" :
            "";
        $(
            `#main > article > ul:nth-child(${num}) > li:nth-child(4) > table > tbody > tr`
        ).each(function() {
            //result.data = result.data ? result.data : []
            result.data.push({
                tanggal: $(this).find("td:nth-child(1)").text(),
                bulan: bulan,
                event: $(this).find("td:nth-child(2)").text(),
            });
        });
        num += 1;
    });
    return result;
};

async function styletext(teks) {
return new Promise((resolve, reject) => {
axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
.then(({ data }) => {
let $ = cheerio.load(data)
let hasil = []
$('table > tbody > tr').each(function (a, b) {
var name = $(b).find('td:nth-child(1) > span').text()
var il = 1;
hasil.push({ name: hasil.find(v => v.name == name) ? (name.replaceAll(" ", "_") + `_${il++}`) : name.replaceAll(" ", "_"), result: $(b).find('td:nth-child(2)').text().trim() })
})
resolve({ author, data: hasil })
})
})
}

const emojimix = (emoji1, emoji2) => {
  return new Promise(async (resolve, reject) => {
    const query = `${encodeURIComponent(emoji1)}${emoji2 != undefined ? '_' + encodeURIComponent(emoji2) : ''}`
    await fetch('https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=' + query)
      .then((res) => res.json())
      .then((json) => {
        if(json.error) return resolve(json.error)
        if (json.results.length === 0) return resolve(undefined)
        resolve(json)
      })
      .catch((err) => reject(err))
  })
}

const emoji = async (emoji) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://emojipedia.org/search/?q=${encodeUrl(emoji)}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                resolve({
                    author,
                    name: $("body > div.container > div.content > article > h1").text(),
                    result: {
                        apple: $("body")
                            .find(
                                "li:nth-child(1) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        google: $("body")
                            .find(
                                "li:nth-child(2) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        samsung: $("body")
                            .find(
                                "li:nth-child(3) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        microsoft: $("body")
                            .find(
                                "li:nth-child(4) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        whatsapp: $("body")
                            .find(
                                "li:nth-child(5) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        twitter: $("body")
                            .find(
                                "li:nth-child(6) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        facebook: $("body")
                            .find(
                                "li:nth-child(7) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        skype: $("body")
                            .find(
                                "li:nth-child(8) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        joypixels: $("body")
                            .find(
                                "li:nth-child(9) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        openemoji: $("body")
                            .find(
                                "li:nth-child(10) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        emojidex: $("body")
                            .find(
                                "li:nth-child(11) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        messenger: $("body")
                            .find(
                                "li:nth-child(12) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        lg: $("body")
                            .find(
                                "li:nth-child(13) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        htc: $("body")
                            .find(
                                "li:nth-child(14) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        mozilla: $("body")
                            .find(
                                "li:nth-child(15) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        softbank: $("body")
                            .find(
                                "li:nth-child(16) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                        docomo: $("body")
                            .find(
                                "li:nth-child(17) > div.vendor-container.vendor-rollout-target > div.vendor-image > img"
                            )
                            .attr("src"),
                    },
                });
            });
    });
};

const iplookup = (ip) => new Promise((resolve, reject) => {
    needle("http://ip-api.com/json/" + encodeURIComponent(ip) + "?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query", (error, resp, body) => {
        const { status, message, query, country, region, lat, lon, timezone, org, as, city, countryCode, zip } = body
        if (status == 'fail' || message == 'invalid query') {
            reject({
                message: `${message}`
            })
        } else {
          resolve({
              status: resp.statusCode,
              result: body,
              maps: 'https://www.google.com/maps/@' + lat + ',' + lon,
          })
        }
    })
})

module.exports = { styletext, emojimix, emoji, iplookup, libur, speechToText }