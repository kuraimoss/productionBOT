const axios = require('axios');
(async () => {
  const { data: html } = await axios.get('https://www.codashop.com/id-id/mobile-legends', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) {
    console.log('no __NUXT_DATA__');
    return;
  }
  const json = m[1];
  console.log('payload chars', json.length);
  let payload;
  try {
    payload = JSON.parse(json);
  } catch (e) {
    console.log('json parse fail', e.message);
    return;
  }
  const str = JSON.stringify(payload);
  console.log('payload is array', Array.isArray(payload));
  console.log('contains MOBILE_LEGENDS', str.includes('MOBILE_LEGENDS'));
})();
