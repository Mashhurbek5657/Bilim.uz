import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Pencil,
  School,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040816] flex items-center justify-center px-4 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-10">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[180px]" />
      <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[180px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Big Background Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <GraduationCap
          size={280}
          className="text-cyan-500/5"
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute top-16 left-10 animate-bounce hidden lg:block">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-md">
          <BookOpen className="text-cyan-300" size={30} />
        </div>
      </div>

      <div className="absolute top-20 right-10 animate-pulse hidden lg:block">
        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-400/20 backdrop-blur-md">
          <GraduationCap className="text-blue-300" size={35} />
        </div>
      </div>

      <div className="absolute bottom-20 left-10 animate-bounce hidden lg:block">
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-md">
          <Pencil className="text-indigo-300" size={28} />
        </div>
      </div>

      <div className="absolute bottom-20 right-10 animate-pulse hidden lg:block">
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-md">
          <School className="text-cyan-200" size={32} />
        </div>
      </div>

      {/* Main Card */}
      <div
        className="relative z-10 w-full  max-w-2xl rounded-[35px] border border-[#1C265A] bg-[#0B1025]/70 backdrop-blur-xl p-6 md:p-8 text-center shadow-[0_0_120px_rgba(0,120,255,0.15)]"
      >
        {/* Top Icon */}
        <div
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-[0_0_50px_rgba(0,255,255,0.25)] animate-pulse"
        >
          <GraduationCap
            size={50}
            className="text-cyan-300"
          />
        </div>

        {/* 404 */}
        <h1
          className="text-[90px] md:text-[140px] font-black leading-none bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent"
        >
          404
        </h1>

        {/* Title */}
        <h2 className="mt-2 text-2xl md:text-4xl font-bold text-white">
          Sahifa Topilmadi
        </h2>

        {/* Description */}
        <p className="mx-auto mt-2 text-[#A0A8C5] text-sm md:text-[20px]">
          Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga
          ko'chirilgan. Savollar uchun Mutaxassis murojaat qiling.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-[#223A78] bg-[#071B4A] px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-[#0A2767]"
          >
            <Home size={18} />
            Bosh Sahifa
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl border border-[#223A78] px-6 py-3 text-[#C6CCE8] transition-all duration-300 hover:scale-105 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft size={18} />
            Orqaga
          </button>

        </div>

        {/* Bottom Cards */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">

          <div className="rounded-2xl border border-[#1C265A] bg-white/[0.03] p-4">
            <BookOpen
              size={24}
              className="mx-auto mb-2 text-cyan-300"
            />
            <p className="text-sm text-[#A0A8C5]">
              Fanlar bo'limiga qayting
            </p>
          </div>

          <div className="rounded-2xl border border-[#1C265A] bg-white/[0.03] p-4">
            <GraduationCap
              size={24}
              className="mx-auto mb-2 text-blue-300"
            />
            <p className="text-sm text-[#A0A8C5]">
              Maktab sahifalarini ko'ring
            </p>
          </div>

          <div className="rounded-2xl border border-[#1C265A] bg-white/[0.03] p-4">
            <School
              size={24}
              className="mx-auto mb-2 text-indigo-300"
            />
            <p className="text-sm text-[#A0A8C5]">
              Ta'lim platformasiga qayting
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-[#1C265A] pt-4">
          <p className="text-sm text-[#66729D]">
            🎓 Bilim Olami • 61-Maktab Ta'lim Platformasi
          </p>
        </div>
      </div>
    </div>
  );
}