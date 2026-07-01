// Vercel serverless function
export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).end();
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method not allowed" });
    }
  
    try {
      const body = req.body || {};
      const { type } = body;
  
      const BOT_TOKEN = process.env.BOT_TOKEN;
      const CHAT_ID = process.env.CHAT_ID;
  
      if (!BOT_TOKEN || !CHAT_ID) {
        console.error("BOT_TOKEN yoki CHAT_ID aniqlanmagan");
        return res.status(500).json({ success: false, message: "Bot sozlamalari yo'q" });
      }
  
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
      } else if (type === "booking") {
        const { productTitle, location, dateRange, price } = body;
        text = `
  📣 Booking
  
  🚗 Nomi: ${productTitle || "-"}
  🌍 Lokatsiya: ${location || "-"}
  📅 Sana: ${dateRange || "-"}
  💰 Narx: ${price ? "$" + price : "-"}
  `;
      } else {
        return res.status(400).json({ success: false, message: "unknown type" });
      }
  
      // Node 18+ global fetch ishlatsa kifoya; Vercel-da mavjud bo'ladi
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
      });
  
      const data = await tgRes.json();
      if (!data.ok) {
        console.error("Telegram javobi xato:", data);
        return res.status(500).json({ success: false, telegram: data });
      }
  
      return res.json({ success: true });
    } catch (err) {
      console.error("ERROR:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }