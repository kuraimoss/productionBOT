const cheerio = require("cheerio");
const fetch = require("node-fetch");
const axios = require("axios");
const got = require("got");
const request = require("request");
const encodeUrl = require("encodeurl");
const FormData = require("form-data");
const url = require("url");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { fromBuffer } = require("file-type");
const fs = require("fs");
const mime = require("mime");
const { JSDOM } = require("jsdom");

const error = {
    link: {
        status: false,
        message: "Link tidak valid!"
    }
}

exports.tiktokdl = async(url) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = []
			function formatNumber(integer) {
				let numb = parseInt(integer)
				return Number(numb).toLocaleString().replace(/,/g, '.')
			}
			
			function formatDate(n, locale = 'en') {
				let d = new Date(n)
				return d.toLocaleDateString(locale, {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric'
				})
			}
			
			let domain = 'https://www.tikwm.com/api/';
			let res = await (await axios.post(domain, {}, {
				headers: {
					'Accept': 'application/json, text/javascript, */*; q=0.01',
					'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'Origin': 'https://www.tikwm.com',
					'Referer': 'https://www.tikwm.com/',
					'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
					'Sec-Ch-Ua-Mobile': '?1',
					'Sec-Ch-Ua-Platform': 'Android',
					'Sec-Fetch-Dest': 'empty',
					'Sec-Fetch-Mode': 'cors',
					'Sec-Fetch-Site': 'same-origin',
					'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
					'X-Requested-With': 'XMLHttpRequest'
				},
				params: {
					url: url,
					count: 12,
					cursor: 0,
					web: 1,
					hd: 1
				}
			})).data.data
			if (res?.duration == 0) {
				res.images.map(v => {
					data.push({ type: 'photo', url: v })
				})
			} else {
				data.push({
					type: 'watermark',
					url: 'https://www.tikwm.com' + res?.wmplay || "/undefined",
				}, {
					type: 'nowatermark',
					url: 'https://www.tikwm.com' + res?.play || "/undefined",
				}, {
					type: 'nowatermark_hd',
					url: 'https://www.tikwm.com' + res?.hdplay || "/undefined"
				})
			}
			let json = {
				status: true,
				title: res.title,
				taken_at: formatDate(res.create_time).replace('1970', ''),
				region: res.region,
				id: res.id,
				durations: res.duration,
				duration: res.duration + ' Seconds',
				cover: 'https://www.tikwm.com' + res.cover,
				size_wm: res.wm_size,
				size_nowm: res.size,
				size_nowm_hd: res.hd_size,
				data: data,
				music_info: {
					id: res.music_info.id,
					title: res.music_info.title,
					author: res.music_info.author,
					album: res.music_info.album ? res.music_info.album : null,
					url: 'https://www.tikwm.com' + res.music || res.music_info.play
				},
				stats: {
					views: formatNumber(res.play_count),
					likes: formatNumber(res.digg_count),
					comment: formatNumber(res.comment_count),
					share: formatNumber(res.share_count),
					download: formatNumber(res.download_count)
				},
				author: {
					id: res.author.id,
					fullname: res.author.unique_id,
					nickname: res.author.nickname,
					avatar: 'https://www.tikwm.com' + res.author.avatar
				}
			}
			resolve(json)
		} catch (error) {
			return { status: false, message: "An error occurred:"+ error };
		}
	});
}

exports.spotifydl = async(track) => {
  puppeteer.use(StealthPlugin());
  const worker = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const windows = await worker.newPage();

    await windows.setRequestInterception(true);
    windows.on("request", (req) => {
      const resourceType = req.resourceType();
      if (
        resourceType === "image" ||
        resourceType === "stylesheet" ||
        resourceType === "font"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await windows.goto("https://spowload.com/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await windows.waitForSelector("#trackUrl", { timeout: 10000 });
    await windows.evaluate((track) => {
      const input = document.querySelector("#trackUrl");
      if (input) {
        input.value = track;
      }
    }, track);

    await windows.waitForSelector("#btnSubmit", { timeout: 10000 });
    await windows.click("#btnSubmit");

    await windows.waitForSelector(".btn.btn-light", { timeout: 10000 });
    await windows.click(".btn.btn-light");

    await windows.waitForSelector(
      "#tracks > div > span.text-end.col-6.col-sm-5.text-end > div > a",
      { timeout: 30000 }
    );
    const downloadUrl = await windows.evaluate(() => {
      const linkElement = document.querySelector(
        "#tracks > div > span.text-end.col-6.col-sm-5.text-end > div > a"
      );
      return linkElement ? linkElement.getAttribute("href") : null;
    });

    return { status: true, result: downloadUrl };
  } catch (error) {
    return { status: false, message: "An error occurred:"+ error };
  } finally {
    await worker.close();
  }
}

exports.pinterest = async(querry) => {     
  return new Promise(async(resolve,reject) => {
  try {
    axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {     
      headers: {     
"cookie" : 'csrftoken=9e6e2663eadbf0825849ab1b60c446da;_b="AY8Yl5ookdlK+JSeFyIxFKEGi4V0h2xz8Demsv0I+JphiTmMYrFcCICqXIFuTL26xCY=";_routing_id="2e57314f-11b6-48c8-a170-353d70c35208";sessionFunnelEventLogged=1;g_state={"i_l":0,"i_ll":1765391937932};_auth=1;_pinterest_sess=TWc9PSZSVmRCNjI3eDc3TWxoY2lnRDh6ejlrNXVaK0haRUpUWlhCNlFMaUV4T1BMWVhLbTQ0RXBzclpYWmhjWmFCRWZWT1VvWUtvdEJKYkVnNEhMbnp0RUJNb1Foc2xNK1R6bzV2VnVqZVZmTDdmeHdyakovdHBrK2xTS3JRcEoyRnV1cWpMeHBtRUl2Qi9QNnpGNzZvVEF2WldDTnBXcFV5eWJEbXkxaWNZUEJRSFd4QjY1T2JOQTg3QXhCOWJRdlVRd3pFVlljd3RxanVnQ25pWTg3dzgxeVpTNXNhTG5Md0pjelhkNUFmdU9TajA4UnVRYW5ERDZTRkJWeG9ZeFBNV1VYWkxtR1RINmdYSlA0NGF6a2xoUVRHWWZYTnk2bVc1aXNRMEJPSmhFcERxMXlZMktRNk1ZdjJCbWxWNUszS3ZULzFVcU0vSjV6SHZReFlOVWNyS0ZJem44ODBwNFV4V0FjZGF5TjBPdWNxOE4weUxEdlplOWFCZDlDeWx6UUxDOHBFRGtiVHhUWjFxd1lTUGI3VzlVZFMvZGJqcTNuamdvK2ovOTlEcnRjRVdSck13ZnVRbDkrejBNREdMQjMzWVoyMkxHTTIxeWM1aTdIYU0vMDlabFJoaktoaGJUTXB3bEdZNTkwRlNLbENTUStuRzlkUlRlS3BhSEd4Wk5PWjlSM24ycHQrSXFEUkhiSWxPYmJHQkZlRHJNS1BmNGUwZmxDbWNVeFRIU3QvdVM4b3BQcUV1RnVNb1VJemNWUkpIWi9zSlBUTmhZQzJPbW5HTGxNbi9VNURSNDVQUU1pZGl1RnYwLzhWZkJ3UmcrT3BWY0tHd1FSUkhhd2Y2L0dwaGhkU0hPc09NQ2w3amV6TDJTbFNuemRGcllFVHdSRXg4a015SW1QbGY0NjhhVmlJdXc2eTJLMXhwRlh1SW1NVUdEcjVWdkF4SFV0UGpwdkE1c1VYaktTWk1QdmxscVpKbmgvcC9KRDNBNU9ZVFU0WFp6aHZkZFp4UnNQMTFNVUw4OFVYVmxKekZYenM5M2FZa1FYVFlCUUtLRDNXQy9UVVArK1R5Z0s3ckF0eTdrVEF3WEVvRmhyNCsvMmhmUnkwdUFielM1Wlg0ZmpyS3EzNElueHV2MmgrSlNtSVZDb1dGalN3M3N2bXkybGQ2RzJaT01BOUh3VVgxZFdKYURkZ0JhbGJXMHV6ak9qdXRDOUlJdC9zSzRZM3N3bXN3eGJCYnBFVEFzSFhadURtdW5TZEEza0xvQjcvUVdTV0tWMzRYbVZWS0x2aUw1cmZtSWZiSGhHQzlGaGdsZW1nOE5zcE9RVGhIdi9NYnlBemFYQlVXQUpybGExRHBDYjE1cU5WUkkzMHNkanU2cDJKZHNKU29UeVM4RmZlZzlheDdLem00dVc2eUJKN2Y1UEk0a2xxcEg2VFFiNXFHanJDK3hucXpwYjBYc3puNjI3WDhyYU91K1FvT1JKMTdGZ0RwSjZKRHNxOXdSWlMzUXRSaFpaNHJKbWxCOXdLMkVweTRHQTQ3djdlTUhSSDBNS2JtbEQzZ3FZUklzTXBhTmtTTk94TmZHS0Y2M0JJaGNGSzFWSGdKTU1WdTQ5VnMvM0RucXJZekU2Qm15MkM2WmVORlREWjk1QTk3emZacXZHUW5EdW14U3J5cnpDS2xBU0R2RlhXV0VUaEJuVW1lcVRLaytxbkt3ZWt2WG9uWlMySXJ6RVltbC9SNHlpZkV0M2FWVTB0MXRIWktucTRmOERuWEpCSXBRWVNtMEVncVNmSjNvWW55RlMmUlYwWEljOXgxMzg0dFVtNXJDOVYzM0ErQUlVPQ==;__Secure-s_a=T0x4M1RrVHVJYk1MVU5aRlk4cXFadzZhL2NLRXBzMjdBeEFwMDdSSTR1bTNUSlJTbXhqSEN6YzZrMHlFMDRra0h0QmtMS3d0WnZQS1BidGJmalNQQnIvUGZBa0lhWkNCSjVvOWRTTWNRbzhYcGQ3ZFlsK01lZXBzWW9IY0dWMjllVi9XK0ZrNkV5NDlkcWZWRWtjR3I4b09yekV2MnVzK1RiR0ZuQ0FpQm5CVnM3cTFTeFFScWFvR0NDTU4xeFVVUVR4ak5ONSthWnl4NGhSeThUNXE0S1g4RXNLbGhqUmE2Z0E5bUwyQVVQYnIvNUtMNEd3cGh5L1c1cGZTOWx3M0xYaUowditUZDE0SG1IRmNYWUZnWGV2d2YxSlk1VDRqNyt2Z0hpZGUyZDJUSXBvRVpYcmJudktPZmgrUWFZaExNakhWM0JBYjJrZWN6VC9yWEhablJLUnQreGxVSGl0LzZjYTZGYkpWQnVQSDl6ODJIMWdnbWdaZUZIYjVSMkw3ZVE1Ym9sSDlZSXQ5ZHFNNTlIL1dkbzZaWHlWWUZwNHo0SFJiMXc2ZUx4RS9rczNQNE0vbGQvV3dIOGNXcHlOM3NqQnVYYlZWSnN5TkFVQ3d2ZWtxV29nUDBLbmJBMEpSVno5VzRJT3YrYmNKZTdxUGxrb2RWV2ZFN25pNEFEK2V1RjZTQWdtR2JSNGQ0NzltWWVIZ3p0VFl0dlZpSURPRXlIRzk3emdhQ0xnMHdtTTJlUUpsTnp6Q0UwRHJtcVZaMzZzRStESmlJbzVCNmVDbzE3WmpuaVQ0UDZRRDFBbEFSWGNHcEp2OG5sc3FxRVZWWkFUMytBTmJXYTlkdGtBYWVnK05MS0RuYnVZTyt6V1o2RUFTUFp0dUE3QmJidkl1aDVZMUFlRnNsdjFzVGVlZFByRHFQMktxcEFWd0VrUGljZWhTTzc2YW05RHRqRWd0VEJHRlM2eElyeFlOS1lmb0VtSVRKVXRDYkpreDBQTmQrQXpDZk5vd2J4MXNlTi9QSjJGdis0eG43NHhhMWdiU2tqeDJQZkdKN2RhQk0zV1RFUFUwNThvK2RGOVZiZU9sK0MxcEhxd2ZFZkkvT05ESlczbWhhYi9FVnhBaEErZEI1WEZUN0MyWDIwc0FNSjN5VlNTSUs2b2cxVmRQa21LeGdkbXF4NWJMTkwrSEg4aVAwdVkzeDBaNGIrN1JldURwL3F2eHBTTC9hdllEYy9YTFNEVEJ0a0FNZ3N5eTFMamphRkRBSjBleTVjTG51bHg0L1ZxMWNnRkdvMUlsbEJoamYrVkpNWk83N2dXMEpqellTZGFkdzkxT0xNZz0maGV0VFZrVW1TMmFiUXYxanRON2pJemcveFVnPQ==;'
      }     
    }).then(({ data }) => {
      const $ = cheerio.load(data)
      const hasil = [];
      const result = [];
      
      $('div > a').get().map(b => {   
        const getlink = $(b).find('img').attr('src')
        const gettitle = $(b).find('img').attr('alt')
        result.push({ url: getlink, title: gettitle })
      });
      
      result.forEach(v => {
        if (v.url == undefined) return
        titleSplit = v.title.split(":")
        hasil.push({ url: v.url.replace(/236/g,'736'), title: titleSplit[1] ? titleSplit[1].trim() : titleSplit[0].trim() })
      })
      
    hasil.shift();
    resolve(hasil)        
    })     
    } catch(e) {
    console.error(e)
    }
  })     
}

exports.aiovdl = async(url) => {
    return new Promise(async(resolve, reject) => {
        const gettoken = await axios.get('https://viddownloader.online/pinterest-downloader/')
        const token = cheerio.load(gettoken.data)('#token').attr('value')
        const options = {
            method: 'POST',
            url: 'https://viddownloader.online/wp-json/aio-dl/video-data/',
            headers: {
                "content-type": 'application/json; charset=UTF-8',
                "cookie": 'PHPSESSID=pboq0ag9iikl5fd1ahf1cchs93;'
            },
            formData: {
                url: url,
                token: token
            }
        }
        request(options, async function(error, response, body){
            if(error) return resolve({status: false})
            const data = JSON.parse(body)
            resolve(data.error ? { status: false, ...data } : { status: true, ...data })
        })
    })
}

exports.mediafire = async(url) => {
    try{
        const {data} = await axios.get(url)
        const $ = cheerio.load(data)
        const result = {
            filename: $("div.dl-btn-label").attr("title"),
            filesize: $("a#downloadButton").text().split("(")[1].split(")")[0],
            uploadAt: $("ul.details > li:nth-child(2)").text().split(": ")[1],
            mimetype: mime.lookup($("a#downloadButton").attr("href")),
            ext: $("a#downloadButton").attr("href").replace(/^.*[\.\/\\]/, ""),
            filetype: $("div.filetype").text(),
            link: $("a#downloadButton").attr("href")
        }
        return({ status: true, ...result })
    }catch{
        return({ status: false, message: 'error' })
    }
}

exports.ghuser = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            var response = await axios.get(`https://api.github.com/users/${user}`);
        } catch {
            return resolve({
                status: false,
                message: "User not found",
            });
        }
        if (response.status == 200) {
            const results = response.data;
            data = {};
            data.code = response.status;
            (data.status = true),
            (data.user = {
                idUser: results.id,
                username: results.login,
                nodeId: results.node_id,
                avatarUrl: results.avatar_url,
                gravatarId: results.gravatar_id == "" ? null : results.gravatar_id,
                githubUrl: results.html_url,
                type: results.type,
                isSiteAdmin: results.site_admin,
                name: results.name,
                company: results.company,
                blog: results.blog,
                email: results.email,
                hireable: results.hireable,
                bio: results.bio,
                twitterUsername: results.twitter_username,
                location: results.location,
                publicRepos: results.public_repos,
                publicGists: results.public_gists,
                followers: results.followers,
                following: results.following,
                createdAt: results.created_at,
                updatedAt: results.updated_at,
            });
            data.creator = author
            resolve(data);
        } else {
            resolve({
                code: 500,
                status: false,
                success: false,
                message: "Server Bermasalah",
            });
        }
    });
};

exports.ghrepo = async (repo) => {
    return new Promise(async (resolve, reject) => {
        await axios
            .get(`https://api.github.com/search/repositories?q=${repo}`)
            .then((response) => {
                if (response.status == 200) {
                    const results = response.data.items;

                    data = {};
                    data.code = response.status;
                    data.message = "ok";
                    data.totalCount = response.data.total_count;
                    data.items = [];
                    data.creator = author

                    if (data.totalCount != 0) {
                        results.forEach((res) => {
                            data.items.push({
                                id: res.id,
                                nodeId: res.node_id,
                                nameRepo: res.name,
                                fullNameRepo: res.full_name,
                                url_repo: res.html_url,
                                description: res.description,
                                git_url: res.git_url,
                                ssh_url: res.ssh_url,
                                clone_url: res.clone_url,
                                svn_url: res.svn_url,
                                homepage: res.homepage,
                                stargazers: res.stargazers_count,
                                watchers: res.watchers,
                                forks: res.forks,
                                defaultBranch: res.default_branch,
                                language: res.language,
                                isPrivate: res.private,
                                isFork: res.fork,
                                createdAt: res.created_at,
                                updatedAt: res.updated_at,
                                pushedAt: res.pushed_at,
                                author: {
                                    username: res.owner.login,
                                    id_user: res.owner.id,
                                    avatar_url: res.owner.avatar_url,
                                    user_github_url: res.owner.html_url,
                                    type: res.owner.type,
                                    isSiteAdmin: res.owner.site_admin,
                                },
                            });
                        });
                    } else {
                        data.items = "Repositories not found";
                    }

                    resolve(data);
                } else {
                    reject({
                        code: 500,
                        success: false,
                        message: "Server Bermasalah",
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};