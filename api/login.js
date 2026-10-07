import { connectDB, User, PHONE_RE, toClient } from "./_lib/db.js";
import { cors } from "./_lib/cors.js";

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { phone } = req.body || {};
  if (typeof phone !== "string" || !PHONE_RE.test(phone)) {
    return res.status(400).json({ ok: false, error: "Raqam noto'g'ri" });
  }

  try {
    await connectDB();
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ ok: false, error: "Hisob topilmadi" });
    res.status(200).json({ ok: true, user: toClient(user) });
  } catch (err) {
    console.error("Login xato:", err.message);
    res.status(500).json({ ok: false, error: "Server xatosi" });
  }
}