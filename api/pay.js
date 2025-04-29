import Iyzipay from 'iyzipay';

const iyzico = new Iyzipay({
  apiKey: process.env.sandbox-MysDoPgh1uv2k5W6eTS0eTSJcVdDMIKE,
  secretKey: process.env.sandbox-v0JHTLmlQBfazqCtChWQbexV19JkyRKA,
  uri: 'https://sandbox-api.iyzipay.com'
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, surname, email } = req.body;

  const request = {
    locale: 'tr',
    conversationId: '123456789',
    price: '99.90',
    paidPrice: '99.90',
    currency: 'TRY',
    installment: '1',
    basketId: 'B67832',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: 'https://muzik-panel.vercel.app/payment-success',
    buyer: {
      id: 'BY789',
      name,
      surname,
      email,
      identityNumber: '74300864791',
      registrationAddress: 'Restoran Sokak No:1 Istanbul',
      ip: '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey'
    },
    shippingAddress: {
      contactName: `${name} ${surname}`,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Restoran Sokak No:1 Istanbul'
    },
    billingAddress: {
      contactName: `${name} ${surname}`,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Restoran Sokak No:1 Istanbul'
    },
    basketItems: [
      {
        id: 'BI101',
        name: 'Müzik Paneli Aboneliği',
        category1: 'Restoran Hizmeti',
        itemType: 'VIRTUAL',
        price: '99.90'
      }
    ]
  };

  iyzico.checkoutFormInitialize.create(request, (err, result) => {
    if (err || result.status !== 'success') {
      console.error('Redirect ödeme hatası:', err || result.errorMessage);
      return res.status(500).json({ success: false, error: result || err });
    }

    return res.status(200).json({ success: true, redirectUrl: result.paymentPageUrl });
  });
}
