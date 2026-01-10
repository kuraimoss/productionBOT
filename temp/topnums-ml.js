const axios=require('axios');
(async()=>{
  const {data:html}=await axios.get('https://www.codashop.com/id-id/mobile-legends',{headers:{'User-Agent':'Mozilla/5.0'}});
  const m=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const payload=JSON.parse(m[1]);
  const nums=[];
  for(let i=0;i<payload.length;i++) if(typeof payload[i]==='number' && Number.isFinite(payload[i])) nums.push({i,v:payload[i]});
  nums.sort((a,b)=>b.v-a.v);
  console.log('top numbers:', nums.slice(0,30));
})();
