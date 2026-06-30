import { Sun, User, Home, Search, MessageCircle, Send, BookOpen, Text, TestTube, TestTube2Icon, TestTube2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import img from "../../public/ChatGPT Image 11 июн. 2026 г., 20_37_15.png"

export default function Navbar() {

    const [user, setUser] = useState(null);
    const [xpData, setXpData] = useState({});

    // 🔥 LOAD USER + XP
    useEffect(() => {

        const loadUser = () => {

            const savedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );

            const savedXP =
                JSON.parse(
                    localStorage.getItem("xpData") || "{}"
                );

            setUser(savedUser || null);
            setXpData(savedXP);

        };

        loadUser();

        window.addEventListener(
            "storage",
            loadUser
        );

        const timer = setInterval(
            loadUser,
            1000
        );

        return () => {

            window.removeEventListener(
                "storage",
                loadUser
            );

            clearInterval(timer);

        };

    }, []);

    const totalXP = useMemo(() => {

        return Object.values(xpData || {})
            .reduce(
                (a, b) =>
                    a + (Number(b) || 0),
                0
            );

    }, [xpData]);

    const level =
        Math.floor(totalXP / 100) + 1;

    return (
        <>
            {/* DESKTOP NAVBAR */}
            <div className="hidden md:block fixed top-4 left-0 right-0 z-50 px-4">

                <nav className="max-w-[1300px] mx-auto w-full h-[75px] bg-[#0B1025]/40 backdrop-blur-xl border border-[#0f173eae] rounded-[20px]">

                    <div className="p-2 flex items-center justify-between h-full">

                        {/* LOGO */}
                        <div className="flex items-center gap-3">

                            <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                    alt="Logo"
                                />
                            </div>

                            <div>
                                <h1 className="text-white font-mono text-[18px]">
                                    Bilim Olami
                                </h1>
                                <p className="text-[#9FA5C5] text-[12px]">
                                    61-maktab ta'lim
                                </p>
                            </div>

                        </div>

                        {/* MENU */}
                        <div className="flex gap-10">

                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-[15px] font-medium border transition-all duration-300
                                    ${isActive
                                        ? "bg-[#06062bdb] border-[#0e11367d] text-white"
                                        : "border-transparent text-[#B7BDD7] hover:text-white"
                                    }`
                                }
                            >
                                Bosh sahifa
                            </NavLink>

                            <NavLink
                                to="/testlar"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-[15px] font-medium border transition-all duration-300
                                    ${isActive
                                        ? "bg-[#06062bdb] border-[#0e11367d] text-white"
                                        : "border-transparent text-[#B7BDD7] hover:text-white"
                                    }`
                                }
                            >
                                Testlar
                            </NavLink>

                            <NavLink
                                to="/kitoblar"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-[15px] font-medium border transition-all duration-300
                                    ${isActive
                                        ? "bg-[#06062bdb] border-[#0e11367d] text-white"
                                        : "border-transparent text-[#B7BDD7] hover:text-white"
                                    }`
                                }
                            >
                                Kitoblar
                            </NavLink>

                            <NavLink
                                to="/profil"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-[15px] font-medium border transition-all duration-300
                                    ${isActive
                                        ? "bg-[#06062bdb] border-[#0e11367d] text-white"
                                        : "border-transparent text-[#B7BDD7] hover:text-white"
                                    }`
                                }
                            >
                                Profil
                            </NavLink>

                        </div>

                        {/* USER CARD */}
                        <NavLink to="/profil">

                            <div className="flex items-center gap-4">

                                <Sun size={18} className="text-white" />

                                <div className="flex items-center gap-3 px-4 py-2 rounded-[20px] bg-[#071B4A] border border-[#223A78]">

                                    {user?.avatar ||
                                        localStorage.getItem("profileImage")
                                        ?
                                        <img
                                            src={
                                                user?.avatar ||
                                                localStorage.getItem("profileImage")
                                            }
                                            className="w-8 h-8 rounded-full object-cover"
                                            alt="Avatar"
                                        />
                                        :
                                        <div className="w-8 h-8 rounded-full bg-[#10183A] flex items-center justify-center">
                                            <User size={18} className="text-[#A0A8C5]" />
                                        </div>
                                    }

                                    <div>
                                        <h3 className="text-white text-[12px] font-semibold">
                                            {
                                                user
                                                    ?
                                                    `${user.name} ${user.surname}`
                                                    :
                                                    "Mehmon"
                                            }
                                        </h3>

                                        <p className="text-[#A0A8C5] text-[10px]">
                                            {
                                                user
                                                    ?
                                                    `${user.className}-sinf · Lvl ${level} · ${totalXP} XP`
                                                    :
                                                    "Kirish"
                                            }
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </NavLink>

                    </div>

                </nav>

            </div>

            {/* MOBILE NAVBAR - HORIZONTAL BOTTOM */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] px-4 xs:px-3 py-3 xs:py-4">

                <div className="w-full rounded-[20px] xs:rounded-[22px] bg-[#0B1025]/95 backdrop-blur-2xl border border-[#1E295C] px-3 xs:px-4 py-3 xs:py-4">

                    <div className="flex items-center justify-between gap-1 xs:gap-2">

                        {/* HOME */}
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center justify-center relative transition-all duration-300`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute -top-7 xs:-top-10 w-12 xs:w-14 h-12 xs:h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                                            <Home size={20} className="xs:w-[24px] text-black" />
                                        </div>
                                    )}
                                    <Home 
                                        size={18} 
                                        className={`xs:w-[20px] transition-colors duration-300 ${
                                            isActive ? "text-white" : "text-gray-500"
                                        }`} 
                                    />
                                    <span className={`text-[10px] xs:text-[11px] mt-1 transition-colors duration-300 ${
                                        isActive ? "text-white" : "text-gray-400"
                                    }`}>
                                        Home
                                    </span>
                                </>
                            )}
                        </NavLink>

                        {/* SEARCH */}
                        <NavLink
                            to="/testlar"
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center justify-center relative transition-all duration-300`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute -top-7 xs:-top-10 w-12 xs:w-14 h-12 xs:h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                                            <TestTube2 size={20} className="xs:w-[24px] text-black" />
                                        </div>
                                    )}
                                    <TestTube2
                                        size={18} 
                                        className={`xs:w-[20px] transition-colors duration-300 ${
                                            isActive ? "text-white" : "text-gray-500"
                                        }`} 
                                    />
                                    <span className={`text-[10px] xs:text-[11px] mt-1 transition-colors duration-300 ${
                                        isActive ? "text-white" : "text-gray-400"
                                    }`}>
                                        Testlar
                                    </span>
                                </>
                            )}
                        </NavLink>

                        {/* EXPLORE */}
                        <NavLink
                            to="/kitoblar"
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center justify-center relative transition-all duration-300`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute -top-7 xs:-top-10 w-12 xs:w-14 h-12 xs:h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                                            <BookOpen size={20} className="xs:w-[24px] text-black" />
                                        </div>
                                    )}
                                    <BookOpen size={18} 
                                        className={`xs:w-[20px] transition-colors duration-300 ${
                                            isActive ? "text-white" : "text-gray-500"
                                        }`}  />
                                    <span className={`text-[10px] xs:text-[11px] mt-1 transition-colors duration-300 ${
                                        isActive ? "text-white" : "text-gray-400"
                                    }`}>
                                        Kitoblar
                                    </span>
                                </>
                            )}
                        </NavLink>

                        {/* MESSAGE */}
                        <NavLink
                            to="/profil"
                            className={({ isActive }) =>
                                `flex-1 flex flex-col items-center justify-center relative transition-all duration-300`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute -top-7 xs:-top-10 w-12 xs:w-14 h-12 xs:h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                                            <User size={20} className="xs:w-[24px] text-black" />
                                        </div>
                                    )}
                                    <User 
                                        size={18} 
                                        className={`xs:w-[20px] transition-colors duration-300 ${
                                            isActive ? "text-white" : "text-gray-500"
                                        }`} 
                                    />
                                    <span className={`text-[10px] xs:text-[11px] mt-1 transition-colors duration-300 ${
                                        isActive ? "text-white" : "text-gray-400"
                                    }`}>
                                        Profil
                                    </span>
                                </>
                            )}
                        </NavLink>

                    </div>

                </div>

            </div>

            {/* MOBILE BOTTOM PADDING */}
            <div className="md:hidden h-[100px] xs:h-[110px]"></div>

        </>
    );

}