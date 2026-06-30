import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const navigate = useNavigate();


    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [className, setClassName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const newUser = {
        id: Date.now(),
        name,
        surname,
        className,
        avatar: "",
        xp: 0
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(newUser));



    const register = (e) => {

        e.preventDefault();


        if (!name || !surname || !className || !email || !password) {

            alert("Barcha joylarni to‘ldiring");

            return;

        }



        localStorage.setItem(

            "user",

            JSON.stringify({

                name,
                surname,
                className,
                email,
                password,

                avatar: "",

                xp: 0,

                login: true

            })

        );



        localStorage.setItem(
            "isLogin",
            "true"
        );



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

w-full

max-w-[420px]

rounded-[26px]

border border-purple-500/40

bg-[#090B2A]/70

backdrop-blur-xl

p-7

shadow-[0_0_35px_rgba(124,58,237,.25)]

"


            >





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



                        <div>


                            <label className="text-white text-sm font-semibold">

                                Ism

                            </label>


                            <input


                                placeholder="ism"

                                value={name}

                                onChange={(e) => setName(e.target.value)}


                                className="mt-1 w-full rounded-lg

bg-[#10133A]

border border-[#273066]

px-3 py-2

text-sm

text-white

outline-none"

                            />


                        </div>








                        <div>


                            <label className="text-white text-sm font-semibold">

                                Familiya

                            </label>



                            <input


                                placeholder="familiya"

                                value={surname}

                                onChange={(e) => setSurname(e.target.value)}


                                className="mt-1 w-full rounded-lg

bg-[#10133A]

border border-[#273066]

px-3 py-2

text-sm

text-white

outline-none"

                            />



                        </div>




                    </div>









                    <div>


                        <label className="text-white text-sm font-semibold">

                            Sinf

                        </label>



                        <input


                            placeholder="sinf"

                            value={className}

                            onChange={(e) => setClassName(e.target.value)}


                            className="mt-1 w-full rounded-lg

bg-[#10133A]

border border-[#273066]

px-3 py-2

text-sm

text-white

outline-none"

                        />



                    </div>









                    <div>


                        <label className="text-white text-sm font-semibold">

                            Email

                        </label>




                        <input


                            type="email"

                            placeholder="email@bilim.uz"

                            value={email}

                            onChange={(e) => setEmail(e.target.value)}


                            className="mt-1 w-full rounded-lg

bg-[#10133A]

border border-[#273066]

px-3 py-2

text-sm

text-white

outline-none"

                        />



                    </div>









                    <div>


                        <label className="text-white text-sm font-semibold">

                            Parol

                        </label>




                        <input


                            type="password"

                            placeholder="password"

                            value={password}

                            onChange={(e) => setPassword(e.target.value)}


                            className="mt-1 w-full rounded-lg

bg-[#10133A]

border border-[#273066]

px-3 py-2

text-sm

text-white

outline-none"

                        />



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


    );


}