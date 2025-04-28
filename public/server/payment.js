const Iyzipay = require('iyzipay');

// Buraya kendi API bilgilerimizi yazacağız
const iyzipay = new Iyzipay({
  apiKey: sandbox-MysDoPgh1uv2k5W6eTS0eTSJcVdDMIKE
  secretKey: sandbox-v0JHTLmlQBfazqCtChWQbexV19JkyRKA
  uri: 'https://sandbox-api.iyzipay.com' // Test ortamı için, gerçek için değiştireceğiz
});

// Basit bir ödeme başlatma örneği
const createPayment = async () => {
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: '1', // ödeme miktarı
    paidPrice: '1',
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: 'B67832',
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: 'https://your-site.com/payment-callback', // Ödeme sonrası yönlendirilecek URL
    buyer: {
      id: 'BY789',
      name: 'Pekcan',
      surname: 'Birinci',
      gsmNumber: '+905350000000',
      email: 'pekcan@example.com',
      identityNumber: '74300864791',
      lastLoginDate: '2025-04-28 12:00:00',
      registrationDate: '2025-01-05 12:00:00',
      registrationAddress: 'Adres buraya',
      ip: '85.34.78.112',
      city: 'İstanbul',
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: 'Pekcan Birinci',
      city: 'İstanbul',
      country: 'Turkey',
      address: 'Adres buraya',
      zipCode: '34732'
    },
    billingAddress: {
      contactName: 'Pekcan Birinci',
      city: 'İstanbul',
      country: 'Turkey',
      address: 'Adres buraya',
      zipCode: '34732'
    },
    basketItems: [
      {
        id: 'BI101',
        name: 'Çalma Listesi 1',
        category1: 'Müzik',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: '1'
      }
    ]
  };

  iyzipay.checkoutFormInitialize.create(request, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log('Ödeme Formu Başlatıldı:', result);
    }
  });
};

createPayment();
