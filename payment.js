// muzik-panel/payment.js

import Iyzipay from 'iyzipay';

const iyzico = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com',
});

export default iyzico;
