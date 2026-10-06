import { User, Home, BookOpen, TestTube2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import img from "../../public/ChatGPT Image 11 июн. 2026 г., 20_37_15.png";

function readJSON(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
}

const NAV_ITEMS = [
    { to: "/", label: "Bosh sahifa", end: true },
    { to: "/testlar", label: "Testlar" },
    { to: "/kitoblar", label: "Kitoblar" },
    { to: "/profil", label: "Profil" },
];

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [xpData, setXpData] = useState({});

    // LOAD USER + XP
    useEffect(() => {
        const loadUser = () => {
            const savedUser = readJSON("user", null);
            const savedXP = readJSON("xpData", {});

            setUser(savedUser);
            setXpData((prev) =>
                JSON.stringify(prev) === JSON.stringify(savedXP) ? prev : savedXP
            );
        };

        loadUser();

        window.addEventListener("storage", loadUser);
        const timer = setInterval(loadUser, 1000);

        return () => {
            window.removeEventListener("storage", loadUser);
            clearInterval(timer);
        };
    }, []);

    const totalXP = useMemo(() => {
        return Object.values(xpData || {}).reduce(
            (a, b) => a + (Number(b) || 0),
            0
        );
    }, [xpData]);

    const level = Math.floor(totalXP / 100) + 1;
    const avatar = user?.avatar || localStorage.getItem("profileImage");

    return (
        <>
            {/* TOP NAVBAR (hamma ekranda, ekranga qarab kichrayadi) */}
            <div className="fixed top-2 md:top-3 lg:top-4 left-0 right-0 z-50 px-2 xs:px-3 lg:px-4">
                <nav className="max-w-[1300px] mx-auto w-full h-[52px] xs:h-[56px] md:h-[64px] xl:h-[75px] bg-[#0B1025]/40 backdrop-blur-xl border border-[#0f173eae] rounded-[14px] md:rounded-[16px] xl:rounded-[20px] transition-all duration-300">
                    <div className="px-2 xl:p-2 flex items-center justify-between gap-2 h-full">

                        {/* LOGO */}
                        <div className="flex items-center gap-2 xl:gap-3 min-w-0">
                            <div className="w-[34px] h-[34px] xs:w-[38px] xs:h-[38px] md:w-[46px] md:h-[46px] xl:w-[60px] xl:h-[60px] rounded-full overflow-hidden shrink-0">
                                <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                    alt="Logo"
                                />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-white font-mono text-[13px] xs:text-[14px] md:text-[16px] xl:text-[18px] leading-tight truncate">
                                    Bilim Olami
                                </h1>
                                <p className="text-[#9FA5C5] text-[9px] xs:text-[10px] md:text-[11px] xl:text-[12px] leading-tight truncate">
                                    61-maktab ta'lim
                                </p>
                            </div>
                        </div>

                        {/* MENU: kichik ekranda yashirin, md dan boshlab ko'rinadi */}
                        <div className="hidden md:flex items-center gap-1 lg:gap-3 xl:gap-6">
                            {NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-[13px] xl:text-[15px] font-medium border transition-all duration-300
                                        ${isActive
                                            ? "bg-[#06062bdb] border-[#0e11367d] text-white"
                                            : "border-transparent text-[#B7BDD7] hover:text-white"
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>

                        {/* USER CARD */}
                        <NavLink to="/profil" className="shrink-0">
                            <div className="flex items-center gap-2 xl:gap-3 px-2 xs:px-2.5 md:px-3 xl:px-4 py-1 md:py-1.5 xl:py-2 rounded-[14px] xl:rounded-[20px] bg-[#071B4A] border border-[#223A78]">

                                {avatar ? (
                                    <img
                                        src={avatar}
                                        className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 rounded-full object-cover"
                                        alt="Avatar"
                                    />
                                ) : (
                                    <div className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 rounded-full bg-[#10183A] flex items-center justify-center">
                                        <User size={15} className="text-[#A0A8C5]" />
                                    </div>
                                )}

                                <div className="max-w-[90px] xs:max-w-[120px] md:max-w-none">
                                    <h3 className="text-white text-[10px] xs:text-[11px] xl:text-[12px] font-semibold leading-tight truncate">
                                        {user ? `${user.name} ${user.surname}` : "Mehmon"}
                                    </h3>

                                    <p className="text-[#A0A8C5] text-[8px] xs:text-[9px] xl:text-[10px] leading-tight truncate">
                                        {user
                                            ? `${user.className}-sinf · Lvl ${level} · ${totalXP} XP`
                                            : "Kirish"}
                                    </p>
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

                        {[
                            { to: "/", label: "Home", Icon: Home, end: true },
                            { to: "/testlar", label: "Testlar", Icon: TestTube2 },
                            { to: "/kitoblar", label: "Kitoblar", Icon: BookOpen },
                            { to: "/profil", label: "Profil", Icon: User },
                        ].map(({ to, label, Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className="flex-1 flex flex-col items-center justify-center relative transition-all duration-300"
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute -top-7 xs:-top-10 w-12 xs:w-14 h-12 xs:h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                                                <Icon size={20} className="xs:w-[24px] text-black" />
                                            </div>
                                        )}
                                        <Icon
                                            size={18}
                                            className={`xs:w-[20px] transition-colors duration-300 ${isActive ? "text-white" : "text-gray-500"}`}
                                        />
                                        <span
                                            className={`text-[10px] xs:text-[11px] mt-1 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400"}`}
                                        >
                                            {label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}

                    </div>
                </div>
            </div>

            {/* MOBILE BOTTOM PADDING */}
            <div className="md:hidden h-[100px] xs:h-[110px]"></div>
        </>
    );
}