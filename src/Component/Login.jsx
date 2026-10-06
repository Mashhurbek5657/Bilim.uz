import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [className, setClassName] = useState("");
    const [phone, setPhone] = useState("+998 ");

    const [errors, setErrors] = useState({});
    const [errorMessages, setErrorMessages] = useState({});

    // ✅ Ism - Katta harf bilan boshlash
    const validateName = (value) => {
        if (!value) {
            return "Ism kiritilishi shart";
        }
        if (!/^[a-zA-Z\s]*$/.test(value)) {
            return "Ism faqat harflardan iborat bo'lishi kerak";
        }
        if (!/^[A-Z]/.test(value)) {
            return "Ism katta harf bilan boshlanishi kerak";
        }
        if (value.length < 4) {
            return "Ism kamida 4 ta harf bo'lishi kerak";
        }
        return "";
    };

    // ✅ Familiya - Katta harf bilan boshlash
    const validateSurname = (value) => {
        if (!value) {
            return "Familiya kiritilishi shart";
        }
        if (!/^[a-zA-Z\s]*$/.test(value)) {
            return "Familiya faqat harflardan iborat bo'lishi kerak";
        }
        if (value.length < 4) {
            return "Familiya kamida 4 ta harf bo'lishi kerak";
        }
        if (!/^[A-Z]/.test(value)) {
            return "Familiya katta harf bilan boshlanishi kerak";
        }
        return "";
    };

    // ✅ Sinf - 1-11 va format: 8b, 9a, 11v
    const validateClassName = (value) => {
        if (!value) {
            return "Sinfni kiriting";
        }
        const regex = /^(1[0-1]|[1-9])([a-v])$/i;
        if (!regex.test(value)) {
            return "Format: 8b, 9a, 11v (raqam + bitta harf)";
        }
        return "";
    };

    // ✅ Telefon raqami - +998 dan keyin 9 ta raqam bo'lishi kerak
    const validatePhone = (value) => {
        const cleanPhone = value.replace(/\D/g, ""); // Faqat raqamlarni ajratish
        if (!cleanPhone.startsWith("998")) {
            return "Raqam +998 bilan boshlanishi kerak";
        }
        if (cleanPhone.length !== 12) {
            return "Telefon raqami to'liq va 9 xonali bo'lishi kerak";
        }
        return "";
    };

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        const err = validateName(val);
        setErrors((prev) => ({ ...prev, name: !!err }));
        setErrorMessages((prev) => ({ ...prev, name: err }));
    };

    const handleSurnameChange = (e) => {
        const val = e.target.value;
        setSurname(val);
        const err = validateSurname(val);
        setErrors((prev) => ({ ...prev, surname: !!err }));
        setErrorMessages((prev) => ({ ...prev, surname: err }));
    };

    const handleClassChange = (e) => {
        const val = e.target.value.toLowerCase();
        setClassName(val);
        const err = validateClassName(val);
        setErrors((prev) => ({ ...prev, className: !!err }));
        setErrorMessages((prev) => ({ ...prev, className: err }));
    };

    const handlePhoneChange = (e) => {
        let val = e.target.value;
        if (!val.startsWith("+998 ")) {
            val = "+998 ";
        }
        setPhone(val);
        const err = validatePhone(val);
        setErrors((prev) => ({ ...prev, phone: !!err }));
        setErrorMessages((prev) => ({ ...prev, phone: err }));
    };

    const register = (e) => {
        e.preventDefault();

        const nameErr = validateName(name);
        const surnameErr = validateSurname(surname);
        const classErr = validateClassName(className);
        const phoneErr = validatePhone(phone);

        const newErrors = {
            name: !!nameErr,
            surname: !!surnameErr,
            className: !!classErr,
            phone: !!phoneErr,
        };

        const newErrorMsgs = {
            name: nameErr,
            surname: surnameErr,
            className: classErr,
            phone: phoneErr,
        };

        setErrors(newErrors);
        setErrorMessages(newErrorMsgs);

        if (nameErr || surnameErr || classErr || phoneErr) {
            toast.error("Ma'lumotlarni to'g'ri kiriting");
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            surname,
            className,
            phone,
            avatar: "",
            xp: 0,
        };

        const users = JSON.parse(localStorage.getItem("users") || "[]");
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
max-md:-mt-[90px]
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

                        {/* Telefon raqami */}
                        <div>
                            <label className="text-white text-sm font-semibold">
                                Telefon raqami
                            </label>

                            <input
                                type="tel"
                                placeholder="+998 90 123 45 67"
                                value={phone}
                                onChange={handlePhoneChange}
                                maxLength={17}
                                className={`mt-1 w-full rounded-lg bg-[#10133A] border px-3 py-2 text-sm text-white outline-none transition ${errors.phone
                                        ? "border-red-500"
                                        : "border-[#273066]"
                                    }`}
                            />

                            {errors.phone && (
                                <p className="text-red-400 text-xs mt-1">
                                    {errorMessages.phone}
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