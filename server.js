import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Agar .env mavjud bo'lsa, u yerdan oling; aks holda fallback (siz bergan) ishlaydi.
const BOT_TOKEN = process.env.BOT_TOKEN || "8645256830:AAEvQM4GO_BwCBUm-Hun6AY0sooyEBz4-D4";
const CHAT_ID = process.env.CHAT_ID || "8585388313";

app.get("/", (req, res) => {
  res.send("Server ishlayapti 🚀");
});

/*
  POST /sendMessage
  body examples:
  - register: { type: "register", name, surname, className, email, passwordLevel }
  - order: { type: "order", cart: [...], totalSum }
  - booking: { type: "booking", productTitle, details }
*/
app.post("/sendMessage", async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.type) {
      return res.status(400).json({ success: false, message: "type field required" });
    }

    let text = "";

    if (body.type === "register") {
      const { name, surname, className, email, passwordLevel } = body;
      text = `
🆕 Yangi foydalanuvchi ro'yxatdan o'tdi

👤 Ism: ${name || "-"}
👤 Familiya: ${surname || "-"}
🏫 Sinf: ${className || "-"}
📧 Email: ${email || "-"}
⚡ Parol darajasi: ${passwordLevel || "-"}
`;
    } else if (body.type === "order") {
      const { cart = [], totalSum = 0 } = body;
      text = `🛒 Yangi buyurtma\n\n`;
      cart.forEach((item, i) => {
        text += `🔹 ${i + 1}. ${item.title}\n`;
        text += `   Qty: ${item.qty}\n`;
        text += `   Narx (jami): ${(item.price * item.qty).toLocaleString()} so'm\n`;
        if (item.desc) text += `   Izoh: ${item.desc}\n`;
        if (item.img) text += `   Rasm: ${item.img}\n`;
        text += `\n`;
      });
      text += `🧾 Jami: ${Number(totalSum).toLocaleString()} so'm\n`;
    } else if (body.type === "booking") {
      const { productTitle, location, dateRange, price } = body;
      text = `
📣 Yangi band qilish (Booking)

🚗 Nomi: ${productTitle || "-"}
🌍 Lokatsiya: ${location || "-"}
📅 Sana: ${dateRange || "-"}
💰 Narx: ${price ? "$" + price : "-"}
`;
    } else {
      return res.status(400).json({ success: false, message: "unknown type" });
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await tgRes.json();
    if (!data.ok) {
      console.error("Telegram error:", data);
      return res.status(500).json({ success: false, telegram: data });
    }

    return res.json({ success: true, telegram: data });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server ishlayapti: ${PORT}`));