export default function handler(req, res) {
    const { username } = req.query;
  
    if (!username) {
      return res.status(400).json({ paid: false });
    }
  
    // Şu an sabit "ödedi" diyoruz (test amaçlı)
    return res.status(200).json({ paid: true });
  }
  