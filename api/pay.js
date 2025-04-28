import Iyzipay from 'iyzipay';

const iyzico = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, surname, email, cardHolderName, cardNumber, expireMonth, expireYear, cvc } = req.body;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      price: '99.90',
      paidPrice: '99.90',
      currency: 'TRY',
      installment: '1',
      basketId: 'B67832',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: '99.90'
        }
      ]
    };

    iyzico.payment.create(request, (err, result) => {
      if (err || result.status !== 'success') {
        console.error('Ödeme başarısız:', err || result.errorMessage);
        return res.status(500).json({ success: false, error: result || err });
      }

      console.log('Ödeme Başarılı 🎉');
      return res.status(200).json({ success: true });
    });
  } else {
    res.status(405).end(); // Only POST
  }
}
