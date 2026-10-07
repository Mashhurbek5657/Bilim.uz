import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

const app = express();

// Render/Railway orqasida haqiqiy IP aniqlansin
app.set("trust proxy", 1);

// Faqat o'z saytingizdan so'rov qabul qilish (vergul bilan bir nechta manzil)
const origins = (process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);
app.use(cors(origins.length ? { origin: origins } : {}));
app.use(express.json({ limit: "10kb" }));

// ---------- BAZA ----------
const userSchema = new mongoose.Schema(
  {
    name: String,
    surname: String,
    className: String,
    phone: { type: String, unique: true, index: true },
    avatar: { type: String, default: "" },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI .env da yo'q");
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB ulandi");
} catch (err) {
  console.error("MongoDB ulanmadi:", err.message);
  process.exit(1);
}

// ---------- YORDAMCHILAR ----------
const PHONE_RE = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;
const CLASS_RE = /^(1[0-1]|[1-9])[a-v]$/i;
const NAME_RE = /^[A-Za-z\s]+$/;

const toClient = (u) => ({
  id: u._id,
  name: u.name,
  surname: u.surname,
  className: u.className,
  phone: u.phone,
  avatar: u.avatar,
  xp: u.xp,
});

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- MARSHRUTLAR ----------
app.get("/", (req, res) => res.send("Server ishlayapti"));

app.use("/api/register", rateLimit({ windowMs: 60 * 1000, max: 5 }));
app.use("/api/login", rateLimit({ windowMs: 60 * 1000, max: 10 }));

// Ro'yxatdan o'tish
app.post("/api/register", async (req, res) => {
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
    user = await User.create({
      name,
      surname,
      className: className.toLowerCase(),
      phone,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ ok: false, error: "Bu raqam ro'yxatdan o'tgan" });
    }
    console.error("DB xato:", err.message);
    return res.status(500).json({ ok: false, error: "Server xatosi" });
  }

  // Telegram botga yuborish (xato bo'lsa ham hisob ochiladi)
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
          body: JSON.stringify({
            chat_id: process.env.CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
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

  res.json({ ok: true, user: toClient(user) });
});

// Kirish
app.post("/api/login", async (req, res) => {
  const { phone } = req.body || {};

  if (typeof phone !== "string" || !PHONE_RE.test(phone)) {
    return res.status(400).json({ ok: false, error: "Raqam noto'g'ri" });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ ok: false, error: "Hisob topilmadi" });
    }
    res.json({ ok: true, user: toClient(user) });
  } catch (err) {
    console.error("Login xato:", err.message);
    res.status(500).json({ ok: false, error: "Server xatosi" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));