import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [className, setClassName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [passwordLevel, setPasswordLevel] = useState("");

    // ✅ Parol darajasini tekshirish
    const checkPassword = (v) => {
        let text = "";

        if (/[a-z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*]/.test(v)) {
            text = "Kuchli";
        } else if (/[a-z]/.test(v) && /[0-9]/.test(v)) {
            text = "O'rta";
        } else if (/[a-z]/.test(v)) {
            text = "Oson";
        }

        setPasswordLevel(text);
    };

    // ✅ Ism - Katta harf bilan boshlash
    const validateName = (value) => {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
            return "Ism faqat harflardan iborat bo'lishi kerak";
        }
        if (!/^[A-Z]/.test(value)) {
            return "Ism katta harf bilan boshlashi kerak";
        }
        if (value.length < 4) {
            return "Ism kamida 4 ta harf bo'lishi kerak";
        }
        return "";
    };

    // ✅ Familiya - Katta harf bilan boshlash
    const validateSurname = (value) => {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
            return "Familiya faqat harflardan iborat bo'lishi kerak";
        }
        if (value.length < 4) {
            return "Familiya kamina 4 ta harf bo'lishi kerak";
        }
        if (!/^[A-Z]/.test(value)) {
            return "Familiya katta harf bilan boshlashi kerak";
        }
        return "";
    };

    // ✅ Sinf - 1-11 va format: 8b, 9a, 11v
    const validateClassName = (value) => {
        if (!value) {
            return "Sinfni tanlang";
        }
        const regex = /^(1[0-1]|[1-9])([a-v])$/i;
        if (!regex.test(value)) {
            return "Format: 8b, 9a, 11v (raqam + bitta harf)";
        }
        return "";
    };

    // ✅ Email - @ bilan
    const validateEmail = (value) => {
        if (!value.includes("@")) {
            return "Email-da @ bo'lishi kerak";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "To'g'ri email manzilini kiriting";
        }
        return "";
    };

    // ✅ Parol - 6+ ta belgi
    const validatePassword = (value) => {
        if (value.length < 6) {
            return "Parol kamina 6 ta belgi bo'lishi kerak";
        }
        return "";
    };

    const register = (e) => {
        e.preventDefault();

        let err = {};
        let msgs = {};

        // ✅ Barcha tekshiruvlar
        const nameError = validateName(name);
        if (nameError) {
            err.name = true;
            msgs.name = nameError;
        }

        const surnameError = validateSurname(surname);
        if (surnameError) {
            err.surname = true;
            msgs.surname = surnameError;
        }

        const classNameError = validateClassName(className);
        if (classNameError) {
            err.className = true;
            msgs.className = classNameError;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            err.email = true;
            msgs.email = emailError;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            err.password = true;
            msgs.password = passwordError;
        }

        setErrors(err);
        setErrorMessages(msgs);

        if (Object.keys(err).length) {
            toast.error("Ma'lumotlarni to'g'ri kiriting");
            return;
        }

        // ✅ Saqlash
        const newUser = {
            id: Date.now(),
            name,
            surname,
            className,
            email,
            password,
            avatar: "",
            xp: 0
        };

        let users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("isLogin", "true");

        toast.success("✅ Muvaffaqiyatli ro'yxatdan o'tildi!");
        navigate("/profil");
    };

    return (
        <div className="
min-h-screen 
flex 
items-center 
justify-center 
px-5 
mt-[40px]
max-md:-mt-[210px]
">
            <div
                className="
grid
grid-cols-1
md:grid-cols-2
gap-6
rounded-[26px]
border border-purple-500/40
bg-[#090B2A]/70
backdrop-blur-xl
p-4
sm:p-6
shadow-[0_0_35px_rgba(124,58,237,.25)]
"
            >
                <iframe
                    src="https://my.spline.design/genkubgreetingrobot-BEJT5t4bdIAhgacAXRzXgd9K/"
                    className=" w-full h-[260px] sm:h-[350px] lg:w-[500px] lg:h-[500px] rounded-md"
                />

                <div>
                    <h1 className="text-white text-2xl font-bold">
                        Ro'yxatdan o'tish
                    </h1>

                    <p className="text-[#A6AECD] text-sm mt-1">
                        Hisob yarating va testlarni boshlang.
                    </p>

                    <form onSubmit={register} className="mt-6 space-y-4">

                        <div className="grid grid-cols-2 gap-3">

                            <div>
                                <label className="text-white text-sm font-semibold">
                                    Ism
                                </label>
                                <input
                                    placeholder="ism"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (e.target.value) {
                                            const err = validateName(e.target.value);
                                            if (err) {
                                                setErrors({ ...errors, name: true });
                                                setErrorMessages({ ...errorMessages, name: err });
                                            } else {
                                                setErrors({ ...errors, name: false });
                                                setErrorMessages({ ...errorMessages, name: "" });
                                            }
                                        }
                                    }}
                                    className={`mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${errors.name ? "border-red-500" : "border-[#273066]"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-xs mt-1">{errorMessages.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-white text-sm font-semibold">
                                    Familiya
                                </label>
                                <input
                                    placeholder="familiya"
                                    value={surname}
                                    onChange={(e) => {
                                        setSurname(e.target.value);
                                        if (e.target.value) {
                                            const err = validateSurname(e.target.value);
                                            if (err) {
                                                setErrors({ ...errors, surname: true });
                                                setErrorMessages({ ...errorMessages, surname: err });
                                            } else {
                                                setErrors({ ...errors, surname: false });
                                                setErrorMessages({ ...errorMessages, surname: "" });
                                            }
                                        }
                                    }}
                                    className={`mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${errors.surname ? "border-red-500" : "border-[#273066]"
                                        }`}
                                />
                                {errors.surname && (
                                    <p className="text-red-400 text-xs mt-1">{errorMessages.surname}</p>
                                )}
                            </div>

                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold">
                                Sinf
                            </label>
                            <input
                                placeholder="sinf (masalan: 8b, 9a, 11v)"
                                value={className}
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase();
                                    setClassName(val);
                                    if (val) {
                                        const err = validateClassName(val);
                                        if (err) {
                                            setErrors({ ...errors, className: true });
                                            setErrorMessages({ ...errorMessages, className: err });
                                        } else {
                                            setErrors({ ...errors, className: false });
                                            setErrorMessages({ ...errorMessages, className: "" });
                                        }
                                    }
                                }}
                                className={`mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${errors.className ? "border-red-500" : "border-[#273066]"
                                    }`}
                            />
                            {errors.className && (
                                <p className="text-red-400 text-xs mt-1">{errorMessages.className}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="email@bilim.uz"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (e.target.value) {
                                        const err = validateEmail(e.target.value);
                                        if (err) {
                                            setErrors({ ...errors, email: true });
                                            setErrorMessages({ ...errorMessages, email: err });
                                        } else {
                                            setErrors({ ...errors, email: false });
                                            setErrorMessages({ ...errorMessages, email: "" });
                                        }
                                    }
                                }}
                                className={`mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${errors.email ? "border-red-500" : "border-[#273066]"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1">{errorMessages.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-sm font-semibold">
                                Parol
                            </label>
                            <input
                                type="password"
                                placeholder="password (kamina 6 ta belgi)"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    checkPassword(e.target.value);
                                    if (e.target.value) {
                                        const err = validatePassword(e.target.value);
                                        if (err) {
                                            setErrors({ ...errors, password: true });
                                            setErrorMessages({ ...errorMessages, password: err });
                                        } else {
                                            setErrors({ ...errors, password: false });
                                            setErrorMessages({ ...errorMessages, password: "" });
                                        }
                                    }
                                }}
                                className={`mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${errors.password ? "border-red-500" : "border-[#273066]"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errorMessages.password}</p>
                            )}

                            {password && (
                                <p
                                    className={`text-xs font-semibold mt-2 ${passwordLevel === "Kuchli"
                                            ? "text-green-400"
                                            : passwordLevel === "O'rta"
                                                ? "text-yellow-400"
                                                : passwordLevel === "Oson"
                                                    ? "text-red-400"
                                                    : "text-gray-400"
                                        }`}
                                >
                                    Qiyinlik darajasi: {passwordLevel || "—"}
                                </p>
                            )}
                        </div>

                        <button
                            className="
w-full
py-2.5
rounded-xl
bg-gradient-to-r
from-purple-600
to-cyan-500
text-white
font-semibold
text-sm
hover:scale-[1.02]
transition
"
                        >
                            Hisob ochish
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