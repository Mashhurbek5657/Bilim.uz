import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [className, setClassName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = (e) => {
        e.preventDefault();

        if (!name || !surname || !className || !email || !password) {
            alert("Barcha joylarni to'ldiring");
            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify(newUser)
        );

        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        );

        const exist = users.find(
            (u) => u.email === email
        );

        if (exist) {
            alert("Bu email avval ro'yxatdan o'tgan");
            return;
        }

        const newUser = {
            name,
            surname,
            className,
            email,
            password,
            avatar:"",
            xp:0,
            login:true
           }

        const updatedUsers = [...users, newUser];

        localStorage.setItem(
            "users",
            JSON.stringify(updatedUsers)
        );

        localStorage.setItem(
            "users",
            JSON.stringify(updatedUsers)
        );

        localStorage.setItem(
            "currentUserId",
            newUser.id
        );

        localStorage.setItem(
            "user",
            JSON.stringify(newUser)
        );

        navigate("/profil");

        navigate("/profil");
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={register}
                className="bg-[#09112E] p-6 rounded-xl"
            >
                <input
                    className="block mb-2 p-2"
                    placeholder="Ism"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="block mb-2 p-2"
                    placeholder="Familiya"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />

                <input
                    className="block mb-2 p-2"
                    placeholder="Sinf"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />

                <input
                    className="block mb-2 p-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="block mb-2 p-2"
                    placeholder="Parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-purple-600 px-4 py-2 text-white">
                    Ro'yxatdan o'tish
                </button>
            </form>
        </div>
    );
}