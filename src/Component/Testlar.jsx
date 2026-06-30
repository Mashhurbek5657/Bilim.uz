import {
    Sigma,
    Languages,
    Atom,
    FlaskConical,
    Dna,
    ScrollText,
    Globe,
    Braces,
    BookOpen,
    Landmark,
    Dumbbell,
    Calculator,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Testlar() {

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }, []);

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [difficulty, setDifficulty] = useState("O'rta");
    const [scrollPosition, setScrollPosition] = useState(0);

    const navigate = useNavigate();

    const subjects = [
        { name: "Matematika", desc: "Algebra, geometriya", icon: Sigma, color: "from-purple-500 to-fuchsia-500" },
        { name: "Ingliz tili", desc: "Grammar, vocabulary", icon: Languages, color: "from-cyan-500 to-sky-500" },
        { name: "Fizika", desc: "Mexanika, optika", icon: Atom, color: "from-blue-500 to-indigo-500" },
        { name: "Kimyo", desc: "Reaksiyalar", icon: FlaskConical, color: "from-emerald-500 to-teal-500" },
        { name: "Biologiya", desc: "Genetika", icon: Dna, color: "from-lime-500 to-green-500" },
        { name: "Tarix", desc: "Jahon tarixi", icon: ScrollText, color: "from-orange-500 to-amber-500" },
        { name: "Geografiya", desc: "Materiklar", icon: Globe, color: "from-sky-500 to-blue-500" },
        { name: "Informatika", desc: "Dasturlash", icon: Braces, color: "from-pink-500 to-rose-500" },
        { name: "Ona tili", desc: "Grammatika", icon: BookOpen, color: "from-red-500 to-orange-500" },
        { name: "Adabiyot", desc: "Asarlar", icon: BookOpen, color: "from-violet-500 to-purple-500" },
        { name: "Huquq", desc: "Qonunlar", icon: Landmark, color: "from-yellow-500 to-orange-500" },
        { name: "Sport", desc: "Jismoniy", icon: Dumbbell, color: "from-green-500 to-emerald-500" },
        { name: "Geometriya", desc: "Shakllar", icon: Calculator, color: "from-cyan-500 to-blue-500" },
        { name: "Texnologiya", desc: "Amaliy", icon: BookOpen, color: "from-teal-500 to-cyan-500" },
    ];

    const startQuiz = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            navigate("/login");
            return;
        }

        navigate("/quiz", {
            state: {
                subject: selectedSubject,
                difficulty
            }
        });
    };

    const levels = ["Oson", "O'rta", "Qiyin", "Eng qiyin"];

    const handleScroll = (e) => {
        setScrollPosition(e.target.scrollLeft);
    };

    return (
        <div className="min-h-screen flex justify-center mt-[60px] xs:mt-[80px] sm:mt-[100px] px-4 xs:px-4 sm:px-4 md:px-6 lg:px-8">

            <div className="w-full max-w-[1300px] py-6 xs:py-8 sm:py-10">

                {/* HEADER */}
                <h1
                    data-aos="fade-right"
                    className="text-white text-2xl xs:text-3xl sm:text-4xl font-bold"
                >
                    Test tanlash
                </h1>

                <p
                    data-aos="fade-right"
                    className="text-[#9FA5C5] mt-1 xs:mt-2 text-[13px] xs:text-[14px] sm:text-[15px]"
                >
                    Fan va qiyinlik darajasini tanlang
                </p>

                {/* SUBJECTS TITLE */}
                <h2
                    data-aos="fade-up"
                    className="text-white text-xl xs:text-2xl font-bold mt-6 xs:mt-8 sm:mt-10 mb-3 xs:mb-4"
                >
                    Fanlar
                </h2>

                {/* SUBJECTS SLIDER - 2 ROWS WRAPPER */}
                <div
                    data-aos="fade-up"
                    className="relative group"
                >

                    {/* SLIDER CONTAINER - 2 ROWS */}
                    <div
                        id="subjectsContainer"
                        onScroll={handleScroll}
                        className="overflow-x-auto scrollbar-hide scroll-smooth"
                        style={{
                            scrollBehavior: 'smooth',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        <div className="flex flex-wrap gap-3 xs:gap-4 sm:gap-5 pt-5 pb-4 w-max">
                            {subjects.map((subject, index) => {
                                const Icon = subject.icon;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSubject(subject.name)}
                                        className={`flex-shrink-0 w-[160px] xs:w-[180px] sm:w-[200px] md:w-[220px] h-[130px] xs:h-[135px] sm:h-[140px] rounded-[18px] xs:rounded-[20px] sm:rounded-2xl border p-3 xs:p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_#1C265A]
                                        ${selectedSubject === subject.name
                                                ? "border-cyan-400 bg-cyan-500/10"
                                                : "border-[#1C265A] bg-[#090F2A]/60 backdrop-blur-lg"
                                            }
                                        `}
                                    >
                                        <div
                                            className={`w-10 xs:w-11 h-10 xs:h-11 rounded-lg xs:rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-2 xs:mb-3`}
                                        >
                                            <Icon size={16} className="xs:w-[18px]" color="white" />
                                        </div>

                                        <h3 className="text-white text-[14px] xs:text-[15px] sm:text-[16px] font-semibold line-clamp-2">
                                            {subject.name}
                                        </h3>

                                        <p className="text-[#9FA5C5] text-[10px] xs:text-[11px] sm:text-[12px] mt-1 line-clamp-1">
                                            {subject.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* MOBILE SCROLL INDICATORS */}
                    <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
                        {[...Array(Math.ceil(subjects.length / 2))].map((_, i) => (
                            <div
                                key={i}
                                className="h-1 rounded-full transition-all duration-300"
                                style={{
                                    width: scrollPosition > i * 200 - 100 && scrollPosition < (i + 1) * 200 + 100 ? '24px' : '8px',
                                    backgroundColor: scrollPosition > i * 200 - 100 && scrollPosition < (i + 1) * 200 + 100 ? '#06b6d4' : '#1C265A'
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* DIFFICULTY TITLE */}
                <h2
                    data-aos="fade-up"
                    className="text-white text-xl xs:text-2xl font-bold mt-8 xs:mt-10 sm:mt-12 mb-3 xs:mb-4"
                >
                    Qiyinlik
                </h2>

                {/* DIFFICULTY BUTTONS */}
                <div
                    data-aos="fade-up"
                    className="flex flex-wrap gap-2 xs:gap-3 sm:gap-3"
                >
                    {levels.map((level) => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`px-4 xs:px-5 py-2 xs:py-2.5 rounded-full border text-xs xs:text-sm transition-all duration-300
                            ${difficulty === level
                                    ? "bg-purple-600/30 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,.25)]"
                                    : "border-[#1C265A] text-[#C6CCE8] hover:border-[#2a3d7f]"
                                }
                            `}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* ACTION CARD */}
                <div
                    data-aos="zoom-in"
                    className="mt-8 xs:mt-10 sm:mt-12 rounded-[18px] xs:rounded-[20px] sm:rounded-2xl border border-[#1C265A] bg-[#090F2A]/60 backdrop-blur-xl p-4 xs:p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 xs:gap-5 sm:gap-6"
                >
                    <div>
                        <p className="text-[#9FA5C5] text-xs xs:text-sm">
                            Tayyormisiz?
                        </p>

                        <h3 className="text-white text-base xs:text-lg sm:text-xl font-bold mt-1">
                            {selectedSubject || "Fanni tanlang"}
                        </h3>
                    </div>

                    <button
                        onClick={startQuiz}
                        disabled={!selectedSubject}
                        className={`w-full sm:w-auto px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 rounded-lg xs:rounded-xl text-white text-sm xs:text-base font-medium transition-all duration-300 whitespace-nowrap
                        ${selectedSubject
                                ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,.35)] hover:shadow-[0_0_30px_rgba(34,211,238,.5)]"
                                : "bg-[#1C265A] opacity-40 cursor-not-allowed"
                            }
                        `}
                    >
                        Boshlash →
                    </button>
                </div>

            </div>

        </div>
    );
}