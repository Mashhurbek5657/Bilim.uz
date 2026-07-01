import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || "8645256830:AAEvQM4GO_BwCBUm-Hun6AY0sooyEBz4-D4";
const CHAT_ID = process.env.CHAT_ID || "8585388313";

// In-memory database
let users = [];

app.get("/", (req, res) => res.json({ message: "Server ishlayapti 🚀" }));

// 📝 REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, surname, className, email, password, passwordLevel } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring" });
    }

    // Email allaqachon mavjudligini tekshirish
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email allaqachon ro'yxatdan o'tgan" });
    }

    const newUser = {
      id: Date.now(),
      name,
      surname,
      className,
      email,
      password,
      avatar: "",
      xp: 0,
      createdAt: new Date(),
    };

    users.push(newUser);

    // Telegram-ga yuborish (ixtiyoriy)
    try {
      const text = `🆕 Yangi foydalanuvchi ro'yxatdan o'tdi\n\n👤 Ism: ${name}\n👤 Familiya: ${surname}\n🏫 Sinf: ${className}\n📧 Email: ${email}\n⚡ Parol darajasi: ${passwordLevel}`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }).catch(err => console.log("Telegram xatosi (ignore):", err));
    } catch (err) {
      console.log("Telegram yuborish muammo:", err);
    }

    return res.status(201).json({ 
      success: true, 
      user: { 
        id: newUser.id, 
        name, 
        surname, 
        email, 
        className, 
        xp: 0 
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 🔑 LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email va parol kiriting" });
    }

    // Foydalanuvchini topish
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Email yoki parol notog'ri" });
    }

    return res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        surname: user.surname, 
        email: user.email, 
        className: user.className,
        xp: user.xp,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 👤 GET USER PROFILE
app.get("/api/user/:id", (req, res) => {
  try {
    const user = users.find(u => u.id == req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    return res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        surname: user.surname, 
        email: user.email, 
        className: user.className,
        xp: user.xp,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 📊 GET ALL USERS
app.get("/api/users", (req, res) => {
  try {
    const allUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      surname: u.surname,
      className: u.className,
      xp: u.xp,
      avatar: u.avatar
    }));

    return res.json({ success: true, users: allUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server ishlayapti: http://localhost:${PORT}`));