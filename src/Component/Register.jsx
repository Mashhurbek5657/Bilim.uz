import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const login = async (e) => {
    e.preventDefault();

    let err = {};

    if (!email.includes("@")) err.email = true;
    if (password.length < 6) err.password = true;

    setErrors(err);

    if (Object.keys(err).length) {
      toast.error("Ma'lumotlarni tekshiring");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login xatosi");
        setLoading(false);
        return;
      }

      if (data.success && data.user) {
        const user = data.user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", String(user.id));
        localStorage.setItem("isAuthenticated", "true");

        toast.success(`✅ Salom ${user.name}!`);
        
        setTimeout(() => {
          navigate(`/profil/${user.id}`);
        }, 500);
      }
    } catch (error) {
      console.error("Fetch xatosi:", error);
      toast.error("Server bilan bog'lanib bo'lmadi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 mt-[40px] max-md:-mt-[100px]">
      <div className="flex flex-col lg:flex-row gap-6 shadow-xl w-full max-w-[900px] p-4 sm:p-6 rounded-[26px] border border-purple-500/40 bg-[#090B2A]/70 backdrop-blur-xl shadow-[0_0_35px_rgba(124,58,237,.25)]">
        <div className="w-full lg:w-[500px] h-[260px] sm:h-[350px] lg:h-[500px] rounded-md bg-[#10133A] border border-[#273066] flex items-center justify-center text-[#A6AECD]">
          <iframe
            src="https://my.spline.design/genkubgreetingrobot-BEJT5t4bdIAhgacAXRzXgd9K/"
            className="w-full h-full rounded-md border-none"
            loading="lazy"
            title="Spline Design"
          />
        </div>

        <div className="w-full">
          <h1 className="text-white text-2xl font-bold">Kirish</h1>
          <p className="text-[#A6AECD] text-sm mt-1">Hisobingizga kiring va testlarni davom ettiring.</p>

          <form onSubmit={login} className="mt-6 space-y-4">
            <input
              placeholder="example@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg bg-[#10133A] border px-3 py-2 text-white outline-none transition ${
                errors.email ? "border-red-500" : "border-[#273066]"
              }`}
            />

            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg bg-[#10133A] border px-3 py-2 text-white outline-none transition ${
                errors.password ? "border-red-500" : "border-[#273066]"
              }`}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold flex justify-center gap-2 hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 transition"
            >
              {loading && <Loader className="animate-spin" size={18} />}
              {loading ? "Kirilmoqda..." : "Kiring"}
            </button>
          </form>

          <p className="text-[#A6AECD] text-center mt-5">
            Hisobingiz yo'qmi?
            <span 
              onClick={() => navigate("/register")} 
              className="text-white underline ml-1 cursor-pointer hover:text-cyan-400 transition"
            >
              Ro'yxatdan o'ting
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}