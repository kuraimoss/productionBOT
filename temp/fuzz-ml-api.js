const axios = require('axios');

const base = 'https://sg-api.mobilelegends.com';
const candidates = [
  '/base/profile',
  '/base/profile/',
  '/base/getProfile',
  '/base/getprofile',
  '/base/getUserInfo',
  '/base/getUserInfo/',
  '/base/getGameUserInfo',
  '/base/getGameUserInfo/',
  '/base/getGameProfile',
  '/base/getGameProfile/',
  '/player/profile',
  '/player/profile/',
  '/player',
  '/player/',
  '/user/profile',
  '/user/profile/',
  '/user/info',
  '/user/info/',
  '/api/profile',
  '/api/profile/',
  '/api/user/profile',
  '/api/user/info',
];

(async () => {
  const params = { userId: '49823518', zoneId: '2003' };
  for (const path of candidates) {
    const url = base + path;
    try {
      const r = await axios.get(url, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: '*/*' },
        timeout: 10000,
        validateStatus: () => true,
      });
      const ct = r.headers['content-type'] || '';
      if (r.status !== 404) {
        console.log(path, '->', r.status, ct.split(';')[0]);
        const data = typeof r.data === 'string' ? r.data.slice(0, 120) : JSON.stringify(r.data).slice(0, 200);
        console.log('  body:', data);
      }
    } catch (e) {
      console.log(path, 'ERR', e.message);
    }
  }
})();
