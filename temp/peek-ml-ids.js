const axios=require('axios');
(async()=>{
  const {data:html}=await axios.get('https://www.codashop.com/id-id/mobile-legends',{headers:{'User-Agent':'Mozilla/5.0'}});
  const m=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const p=JSON.parse(m[1]);
  [314,321,328,335,342].forEach(i=>console.log(i, p[i]));
})();
