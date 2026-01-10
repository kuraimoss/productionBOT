const axios=require('axios');
(async()=>{
  const {data:html}=await axios.get('https://www.codashop.com/id-id/free-fire',{headers:{'User-Agent':'Mozilla/5.0'}});
  const m=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const payload=JSON.parse(m[1]);
  const idxs=[];
  for(let i=0;i<payload.length;i++) if(payload[i]===8050) idxs.push(i);
  console.log('8050 indices', idxs);
  // also check string '8050'
  const idxsS=[];
  for(let i=0;i<payload.length;i++) if(payload[i]==='8050') idxsS.push(i);
  console.log('"8050" indices', idxsS);
  // find first denom and inspect voucherId value
  const denom = payload.find((x)=>x && typeof x==='object' && !Array.isArray(x) && x.displayId && x.pricePoints);
  console.log('denom.voucherId idx', denom.voucherId,'value', payload[denom.voucherId]);
})();
