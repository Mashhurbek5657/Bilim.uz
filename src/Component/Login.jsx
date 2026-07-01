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





    const checkPassword = (v) => {


        let text = "";


        if (
            /[a-z]/.test(v) &&
            /[0-9]/.test(v) &&
            /[!@#$%^&*]/.test(v)
        ) {

            text = "Kuchli";

        }

        else if (
            /[a-z]/.test(v) &&
            /[0-9]/.test(v)
        ) {

            text = "O‘rta";

        }

        else if (
            /[a-z]/.test(v)
        ) {

            text = "Oson";

        }


        setPasswordLevel(text);


    };








    const register = async (e) => {

        e.preventDefault();


        let err = {};


        if (name.length < 2)
            err.name = true;


        if (surname.length < 2)
            err.surname = true;


        if (Number(className) < 1 || Number(className) > 11)
            err.className = true;


        if (!email.includes("@gmail.com"))
            err.email = true;


        if (password.length < 8)
            err.password = true;



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
            password,

            avatar: "",

            xp: 0,

            login: true

        };



        // profil saqlash

        let users =
            JSON.parse(
                localStorage.getItem("users") || "[]"
            );



        users.push(newUser);



        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );



        localStorage.setItem(
            "user",
            JSON.stringify(newUser)
        );



        localStorage.setItem(
            "isLogin",
            "true"
        );





        // telegram yuborish

        try {

            const res = await fetch("https://61bilim-olami.vercel.app/sendMessage",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        surname,
                        className,
                        email,
                        password,
                        passwordLevel
                    })
                }
            );


            const text = await res.text();

            console.log("SERVER JAVOB:", text);


            const data = JSON.parse(text);


            if (data.success) {

                localStorage.setItem(
                    "isAuthenticated",
                    "true"
                );

                toast.success(
                    "Muvaffaqiyatli kirildi"
                );

                navigate("/");


            } else {

                toast.error(
                    "Telegram yuborilmadi"
                );

            }



        } catch (error) {

            console.log(
                "FETCH XATO:",
                error
            );

            toast.error(
                "Server ishlamayapti"
            );

        }



        setLoading(false);


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


                    <h1 className="text-white text-2xl font-bold">

                        Ro‘yxatdan o‘tish

                    </h1>



                    <p className="text-[#A6AECD] text-sm mt-1">

                        Hisob yarating va testlarni boshlang.

                    </p>




                    <form
                        onSubmit={register}
                        className="mt-6 space-y-4"
                    >




                        <div className="grid grid-cols-2 gap-3">



                            <input

                                placeholder="Ism"

                                value={name}

                                onChange={e => setName(e.target.value)}

                                className={`
w-full rounded-lg bg-[#10133A]
border px-3 py-2 text-white outline-none
${errors.name ? "border-red-500" : "border-[#273066]"}
`}

                            />




                            <input

                                placeholder="Familiya"

                                value={surname}

                                onChange={e => setSurname(e.target.value)}

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

                            onChange={e => setClassName(e.target.value)}

                            className={`
w-full rounded-lg bg-[#10133A]
border px-3 py-2 text-white outline-none
${errors.className ? "border-red-500" : "border-[#273066]"}
`}

                        />





                        <input

                            placeholder="example@gmail.com"

                            value={email}

                            onChange={e => setEmail(e.target.value)}

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

                            onChange={e => {

                                setPassword(e.target.value);

                                checkPassword(e.target.value);


                            }}

                            className={`
w-full rounded-lg bg-[#10133A]
border px-3 py-2 text-white outline-none
${errors.password ? "border-red-500" : "border-[#273066]"}
`}

                        />




                        {
                            password &&
                            <p className="text-white text-sm">

                                Parol: {passwordLevel}

                            </p>
                        }




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


                            {
                                loading &&
                                <Loader className="animate-spin" size={18} />
                            }


                            Hisob ochish


                        </button>



                    </form>





                    <p className="text-[#A6AECD] text-center mt-5">

                        Hisobingiz bormi?

                        <span

                            onClick={() => navigate("/login")}

                            className="text-white underline ml-1 cursor-pointer"

                        >

                            Kiring

                        </span>


                    </p>



                </div>



            </div>


        </div>


    )


}