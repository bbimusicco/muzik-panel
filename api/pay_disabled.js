const Iyzipay = require('iyzipay');

const iyzipay = new Iyzipay({
  apiKey: 'sandbox-MysDoPgh1uv2k5W6eTS0eTSJcVdDMIKE',
  secretKey: 'sandbox-v0JHTLmlQBfazqCtChWQbexV19JkyRKA',
  uri: 'https://sandbox-api.iyzipay.com'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Sadece POST' });
  }

  // Body parse: Hem local hem Vercel için garanti çözüm
  let body = req.body;
  if (!body || Object.keys(body).length === 0) {
    let data = '';
    await new Promise(resolve => {
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve());
    });
    try {
      body = JSON.parse(data);
    } catch {
      return res.status(400).json({ success: false, message: 'Geçersiz istek gövdesi' });
    }
  }

  const { name, surname, email } = body;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: '99.90',
    paidPrice: '99.90',
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: 'B67832',
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: 'https://muzik-panel.vercel.app/payment-success',
    buyer: {
      id: 'BY789',
      name,
      surname,
      email,
      identityNumber: '11111111111',
      registrationAddress: 'Test Adresi',
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: `${name} ${surname}`,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Test Adresi',
      zipCode: '34732'
    },
    billingAddress: {
      contactName: `${name} ${surname}`,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Test Adresi',
      zipCode: '34732'
    },
    basketItems: [
      {
        id: 'BI101',
        name: 'Restoran Müzik Aboneliği',
        category1: 'Hizmet',
        category2: 'Müzik',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: '99.90'
      }
    ]
  };

  iyzipay.checkoutFormInitialize.create(request, (err, result) => {
    if (err || result.status !== 'success') {
      return res.status(500).json({ success: false, error: err || result.errorMessage });
    }
    res.status(200).json({ success: true, redirectUrl: result.paymentPageUrl });
  });
}
