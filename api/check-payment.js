export default function handler(req, res) {
    const { username } = req.query;
  
    // Şu anda fake sabit değer dönüyoruz. (Gerçekte database sorgulanır)
    if (username) {
      res.status(200).json({ paid: true });
    } else {
      res.status(400).json({ paid: false });
    }
  }
  