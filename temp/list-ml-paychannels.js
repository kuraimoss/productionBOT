const axios=require('axios');

const resolve=(p,i)=>p[i];

(async()=>{
  const {data:html}=await axios.get('https://www.codashop.com/id-id/mobile-legends',{headers:{'User-Agent':'Mozilla/5.0'}});
  const m=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const p=JSON.parse(m[1]);

  const pcs=[];
  for(const entry of p){
    if(entry && typeof entry==='object' && !Array.isArray(entry) && entry.displayName && entry.imageUrl && entry.sortOrder!=null && entry.isMno!=null){
      const id=resolve(p, entry.id);
      const name=resolve(p, entry.displayName);
      const isMno=resolve(p, entry.isMno);
      pcs.push({id,name,isMno});
    }
  }
  // de-dupe
  const map=new Map();
  for(const pc of pcs){
    const k=pc.id+'|'+pc.name;
    if(!map.has(k)) map.set(k,pc);
  }
  const arr=[...map.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  console.log('payment channels',arr.length);
  console.log(arr.filter(x=>['GoPay','Dana','QRIS','ShopeePay','OVO','Bank Transfer','Kartu Kredit','Indosat','Telkomsel'].includes(x.name)));
})();
