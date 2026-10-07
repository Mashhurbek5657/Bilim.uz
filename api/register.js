import { connectDB, User, PHONE_RE, CLASS_RE, NAME_RE, toClient } from "./_lib/db.js";
import { cors } from "./_lib/cors.js";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { name, surname, className, phone } = req.body || {};

  if (
    typeof name !== "string" || name.length < 4 || name.length > 40 || !NAME_RE.test(name) ||
    typeof surname !== "string" || surname.length < 4 || surname.length > 40 || !NAME_RE.test(surname) ||
    typeof className !== "string" || !CLASS_RE.test(className) ||
    typeof phone !== "string" || !PHONE_RE.test(phone)
  ) {
    return res.status(400).json({ ok: false, error: "Ma'lumot noto'g'ri" });
  }

  let user;
  try {
    await connectDB();
    user = await User.create({ name, surname, className: className.toLowerCase(), phone });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ ok: false, error: "Bu raqam ro'yxatdan o'tgan" });
    }
    console.error("DB xato:", err.message);
    return res.status(500).json({ ok: false, error: "Server xatosi" });
  }

  // Telegramga yuborish (serverless'da javobdan oldin kutish shart)
  if (process.env.BOT_TOKEN && process.env.CHAT_ID) {
    const text =
      `🆕 <b>Yangi foydalanuvchi</b>\n\n` +
      `👤 Ism: ${esc(name)}\n` +
      `👤 Familiya: ${esc(surname)}\n` +
      `🏫 Sinf: ${esc(className.toLowerCase())}\n` +
      `📞 Telefon: ${esc(phone)}\n` +
      `🕒 Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;
    try {
      const tg = await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: process.env.CHAT_ID, text, parse_mode: "HTML" }),
          signal: AbortSignal.timeout(8000),
        }
      );
      const data = await tg.json().catch(() => ({}));
      if (!tg.ok || !data.ok) console.error("Telegram:", data.description);
    } catch (err) {
      console.error("Telegram xato:", err.message);
    }
  } else {
    console.error("BOT_TOKEN yoki CHAT_ID sozlanmagan");
  }

  res.status(200).json({ ok: true, user: toClient(user) });
}