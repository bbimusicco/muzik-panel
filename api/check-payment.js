export default function handler(req, res) {
    const { username } = req.query;
  
    let email = '';
    if (username === 'tellakebap.1') email = 'pekcan@example.com';
    else if (username === 'admin') email = 'admin@example.com';
    else if (username === 'demo') email = 'demo@example.com';
    else email = `${username}@example.com`;
  
    // Şu anda fake kontrol yapıyoruz. Gerçek kontrol database'den yapılacak.
    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo') || '{}');
    const now = new Date();
    const paidDate = new Date(paymentInfo.date);
    const diffInDays = (now - paidDate) / (1000 * 60 * 60 * 24);
  
    if (diffInDays <= 30) {
      res.status(200).json({ paid: true });
    } else {
      res.status(200).json({ paid: false });
    }
  }
  