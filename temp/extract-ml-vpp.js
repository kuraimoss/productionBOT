const axios=require('axios');

function resolve(payload, maybeIndex) {
  return payload[maybeIndex];
}

(async()=>{
  const {data:html}=await axios.get('https://www.codashop.com/id-id/mobile-legends',{headers:{'User-Agent':'Mozilla/5.0'}});
  const m=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const payload=JSON.parse(m[1]);

  const denoms=[];
  for(const entry of payload){
    if(entry && typeof entry==='object' && !Array.isArray(entry) && entry.displayId && entry.pricePoints) denoms.push(entry);
  }

  const results=new Map();
  for(const denom of denoms){
    const pricePointIdxs = resolve(payload, denom.pricePoints);
    if(!Array.isArray(pricePointIdxs)) continue;
    for(const ppIdx of pricePointIdxs){
      const ppObj = resolve(payload, ppIdx);
      if(!ppObj || typeof ppObj!=='object' || Array.isArray(ppObj)) continue;
      const vppId = resolve(payload, ppObj.id);
      const pcObj = resolve(payload, ppObj.paymentChannel);
      const pcName = pcObj ? resolve(payload, pcObj.displayName) : undefined;
      const isMno = pcObj ? resolve(payload, pcObj.isMno) : undefined;
      const key = `${vppId}|${pcName}|${isMno}`;
      results.set(key, { vppId, pcName, isMno });
    }
  }

  const arr=[...results.values()].filter(x=>typeof x.vppId==='number' || typeof x.vppId==='string');
  arr.sort((a,b)=>String(a.vppId).localeCompare(String(b.vppId)));
  console.log('unique vpp candidates',arr.length);
  console.log(arr.slice(0,50));
  const nonMno=arr.filter(x=>x.isMno===false);
  console.log('nonMno count', nonMno.length);
  console.log(nonMno.slice(0,40));
})();
