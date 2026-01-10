const axios = require('axios');

function findAllStrings(payload, needle) {
  const json = JSON.stringify(payload);
  return json.includes(needle);
}

(async () => {
  const { data: html } = await axios.get('https://www.codashop.com/id-id/mobile-legends', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return console.log('no __NUXT_DATA__');
  const payload = JSON.parse(m[1]);
  const needles = [
    'voucherPricePoint',
    'pricePoint',
    'denomination',
    'MOBILE_LEGENDS',
    'initPayment.action',
    'userId',
    'zoneId',
    'role',
    'validate',
  ];
  for (const n of needles) console.log(n, findAllStrings(payload, n));

  // Try to locate plausible voucherPricePoint IDs near MOBILE_LEGENDS in the string table.
  const idx = payload.findIndex((x) => x === 'MOBILE_LEGENDS');
  console.log('MOBILE_LEGENDS index', idx);
  if (idx >= 0) {
    console.log('Around MOBILE_LEGENDS:', payload.slice(idx - 20, idx + 40));
  }
})();
