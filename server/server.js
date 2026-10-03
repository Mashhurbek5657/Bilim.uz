const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

let eskizToken = null;

async function getEskizToken() {
  try {
    console.log("🔐 Eskiz login qilinmoqda...");

    const response = await axios.post(
      "https://notify.eskiz.uz/api/auth/login",
      {
        email: process.env.ESKIZ_EMAIL,
        password: process.env.ESKIZ_PASSWORD,
      }
    );

    console.log("✅ Eskiz login muvaffaqiyatli");

    eskizToken = response.data.data.token;

    return eskizToken;
  } catch (error) {
    console.log("❌ ESKIZ LOGIN XATOSI:");
    console.log(error.response?.data || error.message);

    throw error;
  }
}

app.post("/api/register", async (req, res) => {
  console.log("📩 Yangi so'rov keldi:");
  console.log(req.body);

  try {
    const { phone, firstName, lastName } = req.body;

    if (!phone || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Ism, familya va telefonni kiriting",
      });
    }

    if (!eskizToken) {
      await getEskizToken();
    }

    const smsText =
      `Yangi ro'yxatdan o'tish:\n` +
      `Ism: ${firstName}\n` +
      `Familya: ${lastName}\n` +
      `Telefon: ${phone}`;

    console.log("📱 SMS yuborilmoqda...");

    const response = await axios.post(
      "https://notify.eskiz.uz/api/message/sms/send",
      {
        mobile_phone: "998972108804",
        message: smsText,
        from: "4546",
      },
      {
        headers: {
          Authorization: `Bearer ${eskizToken}`,
        },
      }
    );

    console.log("✅ SMS yuborildi:");
    console.log(response.data);

    res.json({
      success: true,
      message: "SMS yuborildi",
    });
  } catch (error) {
    console.log("================================");
    console.log("❌ SERVER XATOSI:");
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error.message);
    console.log("================================");

    res.status(500).json({
      success: false,
      message: "SMS yuborishda xatolik",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server http://localhost:5000 da ishlayapti");
});