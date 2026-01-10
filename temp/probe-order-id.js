const axios = require('axios');

async function call(base, path, body) {
  const url = base + path;
  try {
    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
      },
      timeout: 15000,
    });
    return { url, ok: true, data, role: data?.confirmationFields?.roles?.[0]?.role };
  } catch (e) {
    return { url, ok: false, status: e.response?.status, data: e.response?.data || e.message };
  }
}

(async () => {
  const baseHosts = [
    'https://order-sg.codashop.com',
    'https://order-id.codashop.com',
  ];

  const bodyML = {
    'voucherPricePoint.id': 6000,
    'voucherPricePoint.price': '',
    'voucherPricePoint.variablePrice': '',
    n: '',
    email: '',
    userVariablePrice: '',
    'order.data.profile': '',
    'user.userId': '49823518',
    'user.zoneId': '2003',
    voucherTypeName: 'MOBILE_LEGENDS',
    affiliateTrackingId: '',
    impactClickId: '',
    checkoutId: '',
    tmwAccessToken: '',
    shopLang: 'in_ID',
  };

  for (const base of baseHosts) {
    console.log('\n===', base, '===');
    for (const path of ['/id/validateProfile.action','/id/initPayment.action','/initPayment.action']) {
      const r = await call(base, path, bodyML);
      if (r.ok) {
        console.log(path, 'success=', r.data?.success, 'err=', r.data?.errorMsg || r.data?.errorCode, 'role=', r.role || null);
      } else {
        console.log(path, 'ERR', r.status, JSON.stringify(r.data).slice(0,160));
      }
    }
  }
})();
