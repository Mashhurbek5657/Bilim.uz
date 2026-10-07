// Lokal sinov (localhost:5173) uchun CORS. true qaytarsa, so'rov shu yerda tugaydi.
export function cors(req, res) {
    const allowed = (process.env.ALLOWED_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((s) => s.trim().replace(/\/$/, ""))
      .filter(Boolean);
  
    const origin = req.headers.origin;
    if (origin && allowed.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return true;
    }
    return false;
  }