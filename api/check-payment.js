export default function handler(req, res) {
    const { username } = req.query;
  
    if (username) {
      res.status(200).json({ paid: true });
    } else {
      res.status(400).json({ paid: false });
    }
  }
  