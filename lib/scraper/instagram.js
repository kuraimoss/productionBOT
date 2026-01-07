const axios = require("axios");
const cheerio = require('cheerio');

const cookie = { 
    "cookie": 'GANTI KE cookie akun ig lu kur',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36", 
    "x-asbd-id": "129477", 
    "x-csrftoken": "Zcvcc4Ww4Az0WDs3cDLliLU4LeqIZlhT", 
    "x-ig-app-id": "936619743392459", 
    "x-ig-www-claim": "hmac.AR3ajL_pzSvqLdRm8n0mkI4PUkUJQaRD9Oi9fIwZJs19tZiF" 
} 

const highlight = async (url) => { 
    try {
        const id = atob(url.split("/")[4].split("?")[0]).split(":")[1]
        const {data} = await axios.get(`https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables=%7B%22reel_ids%22%3A%5B%5D%2C%22highlight_reel_ids%22%3A%5B${id}%5D%2C%22precomposed_overlay%22%3Afalse%7D`, { 
            headers: cookie
        })
        return (data.status == 'ok' ? data : {status: false, message: 'highlight not found'}) 
    } catch (e) { 
        return ({ 
            status: false, 
            message: e, 
        }) 
    } 
}

const metadata = async (mediaid) => { 
    try { 
        const {data} = await axios.get(`https://www.instagram.com/graphql/query/?doc_id=8845758582119845&variables=%7B%22shortcode%22%3A%22${mediaid}%22%2C%22fetch_tagged_user_count%22%3Anull%2C%22hoisted_comment_id%22%3Anull%2C%22hoisted_reply_id%22%3Anull%7D`, { 
            headers: cookie
        })
        return (data.status == 'ok' ? data : {status: false, message: 'media not found'}) 
    } catch (e) { 
        return ({ 
            status: false, 
            message: e, 
        }) 
    } 
}

const stalk = async (user) => { 
    try { 
        const {data} = await axios.get('https://i.instagram.com/api/v1/users/web_profile_info/?username=' + user, { 
            headers: cookie
        }) 
        return (data.status == 'ok' ? { 
            status: true, 
            user: data.data.user, 
        } : {status: false, message: 'user not found'}) 
    } catch (e){ 
        return ({ 
            status: false, 
            message: e, 
        }) 
    } 
}

const story = async (user) => {
  	try {
  		const userd = await stalk(user)
  		const userdata = userd.user
  		if (!userd.status) return ({
  			status: false,
  			message: 'user not found'
  		})
  		const {
  			data
  		} = await axios.get(`https://i.instagram.com/api/v1/feed/user/${userdata.id}/story/`, {
  			headers: cookie
  		})
  		const url = []
  		for (let i of data.reel.items) {
  			if (i.video_duration == 5 || i.video_duration == undefined) url.push({
  				type: 'image',
  				url: i.image_versions2.candidates[0].url
  			})
  			else url.push({
  				type: 'video',
  				url: i.video_versions[0].url
  			})
  		}
  		const result = {
  			status: true,
  			user: data.reel.user,
  			story: url
  		}
  		return result
  	} catch(e) {
  		return ({
  			status: false,
  			message: 'user not found',
  			error: e
  		})
  	}
}

const storyv2 = async (user) => { 
    try {
        const userd = await stalk(user)
  		const userdata = userd.user
  		if (!userd.status) return ({
  			status: false,
  			message: 'user not found'
  		})
        const { 
            data
        } = await axios.get(`https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables=%7B%22reel_ids%22%3A%5B${userdata.id}%5D%2C%22highlight_reel_ids%22%3A%5B%5D%2C%22precomposed_overlay%22%3Afalse%7D`, { 
            headers: cookie
        })
        return (data.status == 'ok' ? data : {status: false, message: 'user not found'}) 
    } catch (e) { 
        return ({ 
            status: false, 
            message: e, 
        }) 
    } 
}

/*
const download = async(url) => {
try {
   const response = await axios.post(`https://api.downloadgram.org/media`,
    new URLSearchParams({
      url: url,
            v: '3',
       lang: 'en',
    }).toString(),
    {
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
      },
     }
    )

 if (!response.data) {
 return { status: false, message: 'Invalid response format from API' }
 }

 // Parse the HTML response to extract the download URL
 const htmlResponse = response.data.trim()
 const $ = cheerio.load(htmlResponse)
 return { status: true,
 thumbnail: $('video').attr('poster')?.trim().replace(/\\"/g, '') || '',
 url: $('source').attr('src')?.trim().replace(/\\"/g, '') || '',
 }
 } catch (error) {
 return { status: false, message: 'Error downloading Instagram media', error: error }
 }
}*/

const download = async(url) => {
  try {
    const id = url.split("/")[4]
    const data = await metadata(id)
    const md = data.data.xdt_shortcode_media
    await md.display_resources.forEach(v => {
      v.accessibility_caption = md.accessibility_caption;
    })
    const result = md.is_video ? [{ src: md.video_url, accessibility_caption: md.accessibility_caption }] : md.edge_sidecar_to_children ? md.edge_sidecar_to_children.edges.map(v => v.node) : md.display_resources
    return { status: true, caption: md.edge_media_to_caption.edges[0] ? md.edge_media_to_caption.edges[0].node.text : null, thumbnail: md.thumbnail_src, is_video: md.is_video, is_sidecar: md.edge_sidecar_to_children ? true : false, media: result }
  } catch (error) {
    return { status: false, message: 'Error downloading Instagram media', error: error }
  }
}

module.exports = { stalk, story, download, metadata, highlight, storyv2 };