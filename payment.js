const express = require('express');
const Iyzipay = require('iyzipay');

const router = express.Router();

const iyzipay = new Iyzipay({
  apiKey: 'sandbox-MysDoPgh1uv2k5W6eTS0eTSJcVdDMIKE',
  secretKey: 'sandbox-v0JHTLmlQBfazqCtChWQbexV19JkyRKA',
  uri: 'https://sandbox-api.iyzipay.com'
});

router.post('/pay', (req, res) => {
  const paymentRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: '1',
    paidPrice: '1',
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: 'B67832',
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: req.body.cardHolderName,
      cardNumber: req.body.cardNumber,
      expireMonth: req.body.expireMonth,
      expireYear: req.body.expireYear,
      cvc: req.body.cvc,
      registerCard: '0'
    },
    buyer: {
      id: 'BY789',
      name: req.body.name,
      surname: req.body.surname,
      gsmNumber: '+905350000000',
      email: req.body.email,
      identityNumber: '11111111111',
      lastLoginDate: '2020-10-05 12:43:35',
      registrationDate: '2013-04-21 15:12:09',
      registrationAddress: 'Test adresi',
      ip: req.ip,
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: req.body.name + ' ' + req.body.surname,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Test adresi',
      zipCode: '34732'
    },
    billingAddress: {
      contactName: req.body.name + ' ' + req.body.surname,
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Test adresi',
      zipCode: '34732'
    },
    basketItems: [
      {
        id: 'BI101',
        name: 'Restoran Müzik Üyeliği',
        category1: 'Hizmet',
        category2: 'Müzik',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: '1'
      }
    ]
  };

  iyzipay.payment.create(paymentRequest, function (err, result) {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }
    res.json({ success: true, result });
  });
});

module.exports = router;
