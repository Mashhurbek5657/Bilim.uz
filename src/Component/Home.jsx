import {
    Sparkles,
    ArrowRight,
    Rocket,
    Users,
    Brain,
    Zap,
    BookOpen,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { books } from "./booksData";
import img from "../../public/ChatGPT Image 11 июн. 2026 г., 20_37_15.png"

export default function Home() {
    return (
        <div className="max-w-[1300px] m-auto text-white px-4 xs:px-4 sm:px-4 md:px-6 lg:px-8">

            <div />

            {/* HERO SECTION */}
            <div className="relative z-10 -mt-[70px] md:mt-[80px] md:xs:mt-[80px] md:sm:mt-[100px] md:md:mt-[120px] lg:mt-[150px] flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-0">

                {/* LEFT */}
                <div className="w-full lg:w-[52%]">

                    {/* BADGE */}
                    <div className="flex items-center gap-2 w-fit bg-[#0B1025]/80 border border-[#24306E] text-slate-300 text-[9px] xs:text-[10px] sm:text-[11px] px-2 xs:px-3 py-1 xs:py-1.5 rounded-full mx-auto md:mx-0">
                        <Sparkles size={12} className="text-cyan-400" />
                        <p>Yangi avlod ta'lim platformasi</p>
                    </div>

                    {/* TITLE */}
                    <div className="mt-4 xs:mt-5 sm:mt-6 leading-[40px] xs:leading-[48px] sm:leading-[56px] md:leading-[64px] lg:leading-[68px] font-bold text-[50px] xs:text-[36px] sm:text-[44px] md:text-[52px] lg:text-[68px] text-center md:text-left">

                        <div className="flex items-center gap-2 xs:gap-3 flex-wrap justify-center md:justify-start">
                            <h1>Bilim</h1>

                            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                                olamiga
                            </h1>
                        </div>

                        <h1 className=" mt-2">sayohat</h1>
                        <h1 className=" mt-3">boshlansin</h1>

                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-4 xs:mt-5 sm:mt-6 text-[#9FA5C5] text-[12px] xs:text-[14px] sm:text-[16px] lg:text-[18px] leading-[20px] xs:leading-[24px] sm:leading-[26px] lg:leading-[30px] text-center md:text-left">
                        <p>Testlar yech, XP yig', do'stlaring bilan musobaqalash va o'zbek</p>
                        <p>61-maktab dasturi bo'yicha eng yaxshi natijalarga erish.</p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xs:gap-4 mt-6 xs:mt-8">
                        <NavLink to="/testlar" className="flex-1 sm:flex-none">
                            <button className="w-full sm:w-auto h-[44px] xs:h-[48px] px-4 xs:px-6 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 flex items-center justify-center gap-2 text-[13px] xs:text-[15px] font-medium hover:scale-105 duration-300 transition-transform">
                                <Rocket size={16} className="xs:w-[17px]" />
                                <span>Testni boshlash</span>
                            </button>
                        </NavLink>
                        <NavLink to="/kitoblar" className="flex-1 sm:flex-none">
                            <button className="w-full sm:w-auto h-[44px] xs:h-[48px] px-4 xs:px-6 rounded-xl border border-[#24306E] bg-[#0B1025]/40 backdrop-blur-xl flex items-center justify-center gap-3 text-[13px] xs:text-[15px] hover:bg-[#121938] duration-300 transition-colors">
                                <span>Kitoblar o'qish</span>
                                <ArrowRight size={16} />
                            </button>
                        </NavLink>
                    </div>

                    {/* STATS */}
                    <div className="flex gap-3 xs:gap-4 mt-8 xs:mt-12 flex-wrap">

                        <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[150px] h-[100px] xs:h-[110px] sm:h-[120px] rounded-[22px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl px-4 xs:px-5 py-4 xs:py-5">
                            <Users size={16} className="text-cyan-400 xs:w-[18px]" />
                            <h1 className="text-[22px] xs:text-[26px] sm:text-[28px] font-bold mt-2">
                                24,800+
                            </h1>
                            <p className="text-[#9FA5C5] -mt-1 text-[11px] xs:text-[12px] sm:text-[13px]">
                                Faol o'quvchilar
                            </p>
                        </div>

                        <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[150px] h-[100px] xs:h-[110px] sm:h-[120px] rounded-[22px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl px-4 xs:px-5 py-4 xs:py-5">
                            <Brain size={16} className="text-cyan-400 xs:w-[18px]" />
                            <h1 className="text-[22px] xs:text-[26px] sm:text-[28px] font-bold mt-2">
                                14+
                            </h1>
                            <p className="text-[#9FA5C5] -mt-1 text-[11px] xs:text-[12px] sm:text-[13px]">
                                Fan testlar
                            </p>
                        </div>

                        <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[150px] h-[100px] xs:h-[110px] sm:h-[120px] rounded-[22px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl px-4 xs:px-5 py-4 xs:py-5">
                            <Zap size={16} className="text-cyan-400 xs:w-[18px]" />
                            <h1 className="text-[22px] xs:text-[26px] sm:text-[28px] font-bold mt-2">
                                2K
                            </h1>
                            <p className="text-[#9FA5C5] -mt-1 text-[11px] xs:text-[12px] sm:text-[13px]">
                                Berilgan XP
                            </p>
                        </div>

                        <div className="w-[calc(50%-6px)] xs:w-[calc(50%-8px)] sm:w-[150px] h-[100px] xs:h-[110px] sm:h-[120px] rounded-[22px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl px-4 xs:px-5 py-4 xs:py-5">
                            <BookOpen size={16} className="text-cyan-400 xs:w-[18px]" />
                            <h1 className="text-[22px] xs:text-[26px] sm:text-[28px] font-bold mt-2">
                                3K+
                            </h1>
                            <p className="text-[#9FA5C5] -mt-1 text-[11px] xs:text-[12px] sm:text-[13px]">
                                Kitoblar soni
                            </p>
                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[40%] flex justify-center items-center relative mt-8 lg:mt-0">

                    {/* RINGS */}
                    <div className="absolute w-[200px] xs:w-[240px] sm:w-[280px] md:w-[320px] h-[200px] xs:h-[240px] sm:h-[280px] md:h-[320px] border border-white/10 rounded-full"></div>

                    <div className="absolute w-[280px] xs:w-[320px] sm:w-[380px] md:w-[430px] h-[280px] xs:h-[320px] sm:h-[380px] md:h-[430px] border border-white/5 rounded-full"></div>

                    {/* MAIN CIRCLE */}
                    <div className="animate-logo">
                        <img
                            src={img}
                            alt="Logo"
                            className="w-[200px] xs:w-[240px] sm:w-[280px] md:w-[320px] mt-4 xs:mt-6 sm:mt-8"
                        />
                    </div>

                    {/* TOP CARD */}
                    <div className="absolute top-[-30px] xs:top-[-40px] sm:top-[-50px] left-[10px] xs:left-[20px] w-[180px] xs:w-[210px] rounded-[20px] border border-white/10 bg-[#0B1025]/40 backdrop-blur-xl p-3 xs:p-4 animate-float1 text-sm xs:text-base">

                        <p className="text-[#BFC6E5] text-[11px] xs:text-[12px]">
                            🏅 Direktor
                        </p>

                        <h1 className="font-semibold text-[16px] xs:text-[18px] mt-1">
                            Nurullaev.A
                        </h1>

                    </div>

                    {/* XP CARD */}
                    <div className="absolute top-[-40px] xs:top-[-20px] sm:top-[-30px] right-[0px] xs:right-[10px] w-[170px] xs:w-[200px] rounded-[20px] border border-white/10 bg-[#0B1025]/40 backdrop-blur-xl p-3 xs:p-4 animate-float2 text-sm xs:text-base">

                        <p className="text-[#BFC6E5] text-[11px] xs:text-[12px]">
                            ⚡ XP olindi
                        </p>

                        <h1 className="text-cyan-400 text-[22px] xs:text-[26px] font-bold mt-1">
                            +5 XP
                        </h1>

                        <p className="text-[#9FA5C5] mt-1 text-[11px] xs:text-[12px]">
                            Fan · daraja
                        </p>

                    </div>

                    {/* STREAK */}
                    <div className="absolute bottom-[-40px] xs:bottom-[40px] sm:bottom-[50px] left-[10px] xs:left-[20px] h-[80px] xs:h-[90px] w-[180px] xs:w-[220px] rounded-[20px] border border-white/10 bg-[#0B1025]/40 backdrop-blur-xl p-3 xs:p-4 animate-float3 text-sm xs:text-base">

                        <p className="text-[#BFC6E5] text-[11px] xs:text-[12px]">
                            🔥 Yutuqlarni qo'lga kiriting
                        </p>

                        <h1 className="text-[18px] xs:text-[22px] font-semibold mt-2">
                            3 kun ketma-ket
                        </h1>
                    </div>

                </div>

            </div>

            {/* POPULAR SUBJECTS SECTION */}
            <div className="mt-[60px] xs:mt-[80px] sm:mt-[90px]">
                <div className="mt-8 xs:mt-12 sm:mt-16">

                    {/* TOP */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 xs:gap-6">

                        <div>
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-100">
                                Mashhur fanlar
                            </h1>
                            <p className="text-[#9FA5C5] text-[13px] xs:text-[14px] sm:text-[15px] mt-1">
                                Sevimli faningni tanla va testni boshla
                            </p>
                        </div>

                    </div>

                    {/* CARDS */}
                    <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 mt-6 xs:mt-8 sm:mt-10">

                        {/* MATEMATIKA */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[20px] xs:text-[25px]">
                                    ∑
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Matematika
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Algebra, geometriya, mantiq
                                </p>

                            </div>
                        </NavLink>

                        {/* INFORMATIKA */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-[20px] xs:text-[24px] font-bold">
                                    {"{ }"}
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Informatika
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Algoritmlar, dasturlash
                                </p>

                            </div>
                        </NavLink>

                        {/* INGLIZ TILI */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[24px] xs:text-[28px] font-bold">
                                    A
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Ingliz tili
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Grammar, vocabulary, listening
                                </p>

                            </div>
                        </NavLink>

                        {/* FIZIKA */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-[22px] xs:text-[26px]">
                                    ⚛
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Fizika
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Mexanika, optika, elektr
                                </p>

                            </div>
                        </NavLink>

                        {/* KIMYO */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-[22px] xs:text-[26px]">
                                    ⚗
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Kimyo
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Reaksiyalar, formulalar
                                </p>

                            </div>
                        </NavLink>

                        {/* BIOLOGIYA */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-[22px] xs:text-[26px]">
                                    🧬
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Biologiya
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Hujayra, genetika, ekologiya
                                </p>

                            </div>
                        </NavLink>

                        {/* TARIX */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-[22px] xs:text-[25px]">
                                    📜
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Tarix
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Jahon va O'zbekiston tarixi
                                </p>

                            </div>
                        </NavLink>

                        {/* GEOGRAFIYA */}
                        <NavLink to="/testlar">
                            <div className="h-[140px] xs:h-[145px] sm:h-[150px] hover:shadow-[0_0_10px_#1C265A,0_0_30px_#1C265A,0_0_120px_#1C265A] cursor-pointer rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] border border-[#1C265A] bg-[#081020]/40 backdrop-blur-xl p-3 xs:p-4 sm:p-5 hover:-translate-y-1 duration-300 transition-all">

                                <div className="w-[45px] xs:w-[48px] h-[45px] xs:h-[48px] rounded-[16px] xs:rounded-[20px] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[22px] xs:text-[26px]">
                                    🌍
                                </div>

                                <h1 className="text-[18px] xs:text-[20px] sm:text-[22px] font-semibold text-white mt-2">
                                    Geografiya
                                </h1>

                                <p className="text-[#9FA5C5] text-[12px] xs:text-[13px] sm:text-[15px] mt-1">
                                    Materiklar, iqlim, xaritalar
                                </p>

                            </div>
                        </NavLink>

                    </div>

                </div>
            </div>

            {/* POPULAR BOOKS SECTION */}
            <section className="mt-[60px] xs:mt-[80px] sm:mt-[90px]">

                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 xs:gap-6 mb-6 xs:mb-8 sm:mb-10">

                    <div>
                        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-100">
                            Mashhur kitoblar
                        </h1>
                        <p className="text-[#9FA5C5] text-[13px] xs:text-[14px] sm:text-[15px] mt-1">
                            Eng ko'p o'qilayotgan asarlar
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">

                    {books.slice(0, 4).map((book) => (
                        <div
                            key={book.id}
                            className="relative h-full rounded-[24px] xs:rounded-[28px] sm:rounded-[32px] border border-[#1C265A] backdrop-blur-xl bg-[#0B1025] overflow-hidden shadow-[0_0_40px_rgba(28,38,90,0.3)] hover:shadow-[0_0_10px_#1C265A,0_0_50px_#1C265A] transition-all duration-500 hover:-translate-y-2"
                        >
                            <img
                                src={book.image}
                                alt={book.title}
                                className="w-full h-[180px] xs:h-[200px] sm:h-[230px] object-cover"
                            />

                            <div className="p-4 xs:p-5 sm:p-6">

                                <h3 className="text-white text-lg xs:text-xl font-bold truncate">
                                    {book.title}
                                </h3>

                                <p className="text-slate-400 mt-1 xs:mt-2 text-xs xs:text-sm">
                                    {book.author}
                                </p>

                                <div className="mt-4 xs:mt-5 flex justify-between items-center">

                                    <span className="text-cyan-400 font-semibold text-xs xs:text-sm">
                                        📖 Kitob
                                    </span>

                                    <a
                                        href={book.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold hover:shadow-lg duration-300 transition-shadow"
                                    >
                                        O'qish
                                    </a>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </section>

            {/* CTA SECTION */}
            <div className="mt-[60px] xs:mt-[80px] sm:mt-[90px] lg:mt-[100px] w-full min-h-[200px] xs:min-h-[220px] sm:h-[260px] rounded-[20px] xs:rounded-[28px] sm:rounded-[34px] border border-[#202A63] bg-gradient-to-r from-[#24115A] via-[#070B33] to-[#0B3553] relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 xs:py-10 sm:py-12">

                {/* LIGHT EFFECT */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.08),transparent_60%)]"></div>

                {/* TITLE */}
                <h1 className="relative z-10 text-[28px] xs:text-[36px] sm:text-[44px] lg:text-[50px] font-bold leading-[44px] xs:leading-[56px] sm:leading-[68px] lg:leading-[90px] text-white text-center px-2">

                    Bugun{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                        birinchi qadamingni
                    </span>
                    {" "}qo'y

                </h1>

                {/* DESCRIPTION */}
                <p className="relative z-10 text-[#9EA5C5] text-[13px] xs:text-[15px] sm:text-[16px] lg:text-[17px] mt-3 xs:mt-4 sm:mt-2 text-center px-2">
                    Bepul ro'yxatdan o't, profilingni shakllantir va testni boshla.
                </p>

                {/* BUTTONS */}
                <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xs:gap-4 sm:gap-5 mt-6 xs:mt-8 w-full sm:w-auto px-2">
                    <NavLink to="/profil" className="flex-1 sm:flex-none">
                        <button className="w-full sm:w-auto h-[44px] xs:h-[45px] sm:h-[45px] px-6 xs:px-7 rounded-[16px] xs:rounded-[18px] text-[13px] xs:text-[15px] text-white bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_40px_rgba(0,200,255,0.18)] hover:scale-105 duration-300 transition-transform font-medium">

                            Ro'yxatdan o'tish

                        </button>
                    </NavLink>
                    <NavLink to="/testlar" className="flex-1 sm:flex-none">
                        <button className="w-full sm:w-auto h-[44px] xs:h-[45px] sm:h-[45px] px-6 xs:px-8 rounded-[16px] xs:rounded-[18px] border border-[#28346B] bg-[#0A1129]/40 backdrop-blur-xl text-[13px] xs:text-[15px] text-white hover:bg-[#121938] duration-300 transition-colors font-medium">

                            Demo test

                        </button>
                    </NavLink>

                </div>

            </div>

        </div>
    );
}