const axios=require('axios');
(async()=>{
  const {data:html}=await axios.get('https://www.codashop.com/id-id/mobile-legends',{headers:{'User-Agent':'Mozilla/5.0'}});
  const m=html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const p=JSON.parse(m[1]);
  const denom=p.find(x=>x&&typeof x==='object'&&!Array.isArray(x)&&x.displayId&&x.pricePoints);
  const displayId=p[denom.displayId];
  console.log('displayId',displayId);
  const body={
    'voucherPricePoint.id': displayId,
    'voucherPricePoint.price':'',
    'voucherPricePoint.variablePrice':'',
    n:'',email:'',userVariablePrice:'','order.data.profile':'',
    'user.userId':'617243212','user.zoneId':'8460',
    voucherTypeName:'MOBILE_LEGENDS',shopLang:'in_ID'
  };
  const {data}=await axios.post('https://order-sg.codashop.com/id/validateProfile.action',body,{headers:{'Content-Type':'application/json; charset=utf-8','User-Agent':'Mozilla/5.0','Accept':'application/json'}});
  console.log(JSON.stringify(data,null,2));
})();
