const paidUsers = {}; // Şu anlık sahte bir veri, ileride veritabanı ekleriz.

export default function handler(req, res) {
  const { username } = req.query;

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
      return res.status(200).json({ paid: true });
    }
  }
  return res.status(200).json({ paid: false });
}
