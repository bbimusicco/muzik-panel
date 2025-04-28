if (!process.env.IYZIPAY_API_KEY || !process.env.IYZIPAY_SECRET_KEY) {
    console.error('API anahtarları eksik! .env dosyasını kontrol et.');
    process.exit(1);
  }
  
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const iyzipay = require('iyzipay');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// İyzipay bağlantısı
const iyzico = new iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com' // Normalde sandbox, prod'da değişir
});

// Basit bir ödeme veritabanı gibi olacak
const paidUsers = {};

// Ödeme başlatma
app.post('/api/pay', (req, res) => {
  const { name, surname, email, cardHolderName, cardNumber, expireMonth, expireYear, cvc } = req.body;

  const request = {
    locale: iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: '99.90',
    paidPrice: '99.90',
    currency: 'TRY',
    installment: '1',
    basketId: 'B67832',
    paymentChannel: iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard: '0'
    },
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
        itemType: iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: '99.90'
      }
    ]
  };

  iyzico.payment.create(request, (err, result) => {
    if (err || result.status !== 'success') {
      console.error('Ödeme başarısız:', err || result.errorMessage);
      return res.json({ success: false, error: result || err });
    }

    // Ödeme başarılıysa kullanıcıyı "paid" olarak işaretliyoruz
    paidUsers[email] = {
      paidAt: new Date()
    };

    console.log('Ödeme Başarılı! 🎉', paidUsers);
    return res.json({ success: true });
  });
});

// Kullanıcı ödeme yapmış mı kontrolü
app.get('/api/check-payment/:username', (req, res) => {
  const username = req.params.username;

  // Username'e göre email eşleşmesi
  let email = '';
  if (username === 'tellakebap.1') email = 'pekcan@example.com';
  else if (username === 'admin') email = 'admin@example.com';
  else if (username === 'demo') email = 'demo@example.com';
  else email = `${username}@example.com`;

  const paymentInfo = paidUsers[email];

  if (paymentInfo) {
    const now = new Date();
    const paidDate = new Date(paymentInfo.paidAt);
    const diffInDays = (now - paidDate) / (1000 * 60 * 60 * 24);
    if (diffInDays <= 30) {
      return res.json({ paid: true });
    }
  }
  return res.json({ paid: false });
});

// Server çalıştır
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
