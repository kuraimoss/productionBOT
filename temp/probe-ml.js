const axios = require('axios');

async function tryEndpoint(url, body) {
  try {
    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
      },
      timeout: 15000,
    });
    const role = data?.confirmationFields?.roles?.[0]?.role;
    return { ok: true, role, data };
  } catch (e) {
    return { ok: false, status: e.response?.status, data: e.response?.data || e.message };
  }
}

(async () => {
  const userId = '49823518';
  const zoneId = '2003';

  const base = {
    'voucherPricePoint.price': '',
    'voucherPricePoint.variablePrice': '',
    n: '',
    email: '',
    userVariablePrice: '',
    'order.data.profile': '',
    'user.userId': userId,
    'user.zoneId': zoneId,
    voucherTypeName: 'MOBILE_LEGENDS',
    affiliateTrackingId: '',
    impactClickId: '',
    checkoutId: '',
    tmwAccessToken: '',
    shopLang: 'in_ID',
  };

  const vpps = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,6000];
  const urls = [
    'https://order-sg.codashop.com/id/validateProfile.action',
    'https://order-sg.codashop.com/id/initPayment.action',
    'https://order-sg.codashop.com/initPayment.action',
  ];

  for (const vpp of vpps) {
    const body = { ...base, 'voucherPricePoint.id': vpp };
    console.log(`\n=== vpp ${vpp} ===`);
    for (const url of urls) {
      const r = await tryEndpoint(url, body);
      if (r.ok) {
        console.log(url, 'success=', r.data?.success, 'err=', r.data?.errorMsg || r.data?.errorCode, 'role=', r.role || null);
      } else {
        console.log(url, 'ERR', r.status, JSON.stringify(r.data).slice(0,200));
      }
    }
  }
})();
