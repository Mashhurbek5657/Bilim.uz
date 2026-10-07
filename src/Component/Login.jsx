import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;

const inputClass = (hasError) =>
    `mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${hasError ? "border-red-500" : "border-[#273066]"
    }`;

const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// +998 90 123 45 67 ko'rinishiga keltirish
function formatPhone(value) {
    let digits = value.replace(/\D/g, "");
    digits = digits.startsWith("998") ? digits.slice(3) : digits;
    const r = digits.slice(0, 9);

    let out = "+998 ";
    if (r.length > 0) out += r.slice(0, 2);
    if (r.length > 2) out += " " + r.slice(2, 5);
    if (r.length > 5) out += " " + r.slice(5, 7);
    if (r.length > 7) out += " " + r.slice(7, 9);
    return out;
}

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [className, setClassName] = useState("");
    const [phone, setPhone] = useState("+998 ");

    const [errors, setErrors] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // ---------------- VALIDATSIYA ----------------
    const validateName = (value) => {
        if (!value) return "Ism kiritilishi shart";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Ism faqat harflardan iborat bo'lishi kerak";
        if (!/^[A-Z]/.test(value)) return "Ism katta harf bilan boshlanishi kerak";
        if (value.length < 4) return "Ism kamida 4 ta harf bo'lishi kerak";
        return "";
    };

    const validateSurname = (value) => {
        if (!value) return "Familiya kiritilishi shart";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Familiya faqat harflardan iborat bo'lishi kerak";
        if (value.length < 4) return "Familiya kamida 4 ta harf bo'lishi kerak";
        if (!/^[A-Z]/.test(value)) return "Familiya katta harf bilan boshlanishi kerak";
        return "";
    };

    const validateClassName = (value) => {
        if (!value) return "Sinfni kiriting";
        if (!/^(1[0-1]|[1-9])([a-v])$/i.test(value))
            return "Format: 8b, 9a, 11v (raqam + bitta harf)";
        return "";
    };

    const validatePhone = (value) => {
        const clean = value.replace(/\D/g, "");
        if (!clean.startsWith("998")) return "Raqam +998 bilan boshlanishi kerak";
        if (clean.length !== 12) return "Telefon raqami to'liq va 9 xonali bo'lishi kerak";
        return "";
    };

    const setFieldError = (field, err) => {
        setErrors((p) => ({ ...p, [field]: !!err }));
        setErrorMessages((p) => ({ ...p, [field]: err }));
    };

    // ---------------- HANDLERLAR ----------------
    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        if (val) setFieldError("name", validateName(val));
    };

    const handleSurnameChange = (e) => {
        const val = e.target.value;
        setSurname(val);
        if (val) setFieldError("surname", validateSurname(val));
    };

    const handleClassChange = (e) => {
        const val = e.target.value.toLowerCase();
        setClassName(val);
        if (val) setFieldError("className", validateClassName(val));
    };

    const handlePhoneChange = (e) => {
        const val = formatPhone(e.target.value);
        setPhone(val);
        setFieldError("phone", validatePhone(val));
    };

    // ---------------- TELEGRAMGA YUBORISH ----------------
    const sendToTelegram = async () => {
        if (!BOT_TOKEN || !CHAT_ID) {
            console.error("VITE_BOT_TOKEN yoki VITE_CHAT_ID .env da yo'q");
            return false;
        }

        const message =
            `🆕 <b>Yangi foydalanuvchi</b>\n\n` +
            `👤 Ism: ${esc(name)}\n` +
            `👤 Familiya: ${esc(surname)}\n` +
            `🏫 Sinf: ${esc(className)}\n` +
            `📞 Telefon: ${esc(phone)}\n` +
            `🕒 Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`;

        try {
            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "HTML",
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                console.error("Telegram:", data.description);
                return false;
            }
            return true;
        } catch (err) {
            console.error("Telegram xato:", err);
            return false;
        }
    };

    // ---------------- HISOB OCHISH ----------------
    const register = async (e) => {
        e.preventDefault();
        if (submitting) return;

        const nameErr = validateName(name);
        const surnameErr = validateSurname(surname);
        const classErr = validateClassName(className);
        const phoneErr = validatePhone(phone);

        setErrors({
            name: !!nameErr,
            surname: !!surnameErr,
            className: !!classErr,
            phone: !!phoneErr,
        });
        setErrorMessages({
            name: nameErr,
            surname: surnameErr,
            className: classErr,
            phone: phoneErr,
        });

        if (nameErr || surnameErr || classErr || phoneErr) {
            toast.error("Ma'lumotlarni to'g'ri kiriting");
            return;
        }

        // Shu raqam bilan hisob bormi
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem("users") || "[]");
        } catch {
            users = [];
        }
        if (users.some((u) => u.phone === phone)) {
            setFieldError("phone", "Bu raqam bilan hisob allaqachon mavjud");
            toast.error("Bu raqam ro'yxatdan o'tgan. Kirish sahifasiga o'ting");
            return;
        }

        setSubmitting(true);

        // Ma'lumotlarni Telegram botga yuborish
        const sent = await sendToTelegram();
        if (!sent) {
            toast.error("Ma'lumot yuborilmadi. Internetni tekshiring va qayta urinib ko'ring");
            setSubmitting(false);
            return;
        }

        // Telegramga bordi: hisob ochiladi
        const newUser = {
            id: Date.now(),
            name,
            surname,
            className,
            phone,
            avatar: "",
            xp: 0,
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("isLogin", "true");

        toast.success("✅ Muvaffaqiyatli ro'yxatdan o'tildi!");
        navigate("/profil");
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-5 mt-[40px] max-md:-mt-[90px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-[26px] border border-purple-500/40 bg-[#090B2A]/70 backdrop-blur-xl p-4 sm:p-6 shadow-[0_0_35px_rgba(124,58,237,.25)]">
                <iframe
                    src="https://my.spline.design/genkubgreetingrobot-BEJT5t4bdIAhgacAXRzXgd9K/"
                    className="w-full hidden md:block h-[260px] sm:h-[350px] lg:w-[500px] lg:h-[500px] rounded-md"
                />

                <div>
                    <h1 className="text-white text-2xl font-bold">Ro'yxatdan o'tish</h1>

                    <p className="text-[#A6AECD] text-sm mt-1">
                        Hisob yarating va testlarni boshlang.
                    </p>

                    <form onSubmit={register} className="mt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-white text-sm font-semibold">Ism</label>
                                <input
                                    placeholder="ism"
                                    value={name}
                                    onChange={handleNameChange}
                                    className={inputClass(errors.name)}
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-xs mt-1">{errorMessages.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-white text-sm font-semibold">Familiya</label>
                                <input
                                    placeholder="familiya"
                                    value={surname}
                                    onChange={handleSurnameChange}
                                    className={inputClass(errors.surname)}
                                />
                                {errors.surname && (
                                    <p className="text-red-400 text-xs mt-1">{errorMessages.surname}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold">Sinf</label>
                            <input
                                placeholder="sinf (masalan: 8b, 9a, 11v)"
                                value={className}
                                onChange={handleClassChange}
                                className={inputClass(errors.className)}
                            />
                            {errors.className && (
                                <p className="text-red-400 text-xs mt-1">{errorMessages.className}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold">Telefon raqami</label>
                            <input
                                type="tel"
                                placeholder="+998 90 123 45 67"
                                value={phone}
                                onChange={handlePhoneChange}
                                maxLength={17}
                                className={inputClass(errors.phone)}
                            />
                            {errors.phone && (
                                <p className="text-red-400 text-xs mt-1">{errorMessages.phone}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-[1.02] transition disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {submitting ? "Yuborilmoqda..." : "Hisob ochish"}
                        </button>
                    </form>

                    <p className="text-[#A6AECD] text-sm text-center mt-5">
                        Hisobingiz bormi?
                        <span
                            onClick={() => navigate("/login")}
                            className="text-white underline cursor-pointer ml-1"
                        >
                            Kiring
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}