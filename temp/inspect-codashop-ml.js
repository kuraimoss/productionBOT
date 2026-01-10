const axios = require('axios');

(async () => {
  const { data: html } = await axios.get('https://www.codashop.com/id-id/mobile-legends', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  const payload = JSON.parse(m[1]);

  const inspect = (i) => {
    const v = payload[i];
    console.log(i, typeof v, Array.isArray(v) ? `array(len=${v.length})` : v);
  };

  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,50,51,61,314,366,451,462,463,464,475,476,477,478,479,480,483,484,485,489,490,491,492,493,494,495,496,497,498,499,500,503,504,505,506,507,508,509,517,524].forEach(inspect);
})();
