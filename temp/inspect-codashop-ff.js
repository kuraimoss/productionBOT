const axios = require('axios');

async function inspect(slug, voucherType) {
  const { data: html } = await axios.get(`https://www.codashop.com/id-id/${slug}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no __NUXT_DATA__');
  const payload = JSON.parse(m[1]);
  const idx = payload.findIndex((x) => x === voucherType);
  console.log('---',slug,'voucherType',voucherType,'idx',idx);
  const productObj = payload.find((x) => x && typeof x === 'object' && !Array.isArray(x) && x.voucherTypeName);
  console.log('productObj voucherTypeName idx', productObj?.voucherTypeName, 'resolved', payload[productObj?.voucherTypeName]);
  // find first denom-like object
  const denom = payload.find((x) => x && typeof x === 'object' && !Array.isArray(x) && x.displayId && x.pricePoints);
  console.log('first denom keys', Object.keys(denom||{}));
  const ppIdx = Array.isArray(payload[denom?.pricePoints]) ? payload[denom.pricePoints][0] : null;
  const ppObj = ppIdx!=null ? payload[ppIdx] : null;
  console.log('first pricePoint obj idx', ppIdx, 'obj', ppObj);
  if (ppObj && ppObj.id!=null) console.log('pricePoint.id idx', ppObj.id, 'resolved', payload[ppObj.id]);
}

(async () => {
  await inspect('free-fire','FREEFIRE');
})();
