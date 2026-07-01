import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8645256830:AAEvQM4GO_BwCBUm-Hun6AY0sooyEBz4-D4";
const CHAT_ID = process.env.CHAT_ID || "8585388313";

app.get("/", (req, res) => res.send("Server ishlayapti 🚀"));

app.post("/sendMessage", async (req, res) => {
  try {
    const body = req.body || {};
    const { type } = body;

    let text = "";
    if (type === "register") {
      const { name, surname, className, email, passwordLevel } = body;
      text = `
🆕 Yangi foydalanuvchi ro'yxatdan o'tdi

👤 Ism: ${name || "-"}
👤 Familiya: ${surname || "-"}
🏫 Sinf: ${className || "-"}
📧 Email: ${email || "-"}
⚡ Parol darajasi: ${passwordLevel || "-"}
`;
    } else if (type === "order") {
      const { cart = [], totalSum = 0 } = body;
      text = `🛒 Yangi buyurtma\n\n`;
      cart.forEach((item, i) => {
        text += `🔹 ${i + 1}. ${item.title}\nQty: ${item.qty}\nNarx: ${(item.price * item.qty).toLocaleString()} so'm\n\n`;
      });
      text += `🧾 Jami: ${Number(totalSum).toLocaleString()} so'm\n`;
    } else {
      return res.status(400).json({ success: false, message: "unknown type" });
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });

    const data = await tgRes.json();
    if (!data.ok) return res.status(500).json({ success: false, telegram: data });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server ishlayapti: ${PORT}`));