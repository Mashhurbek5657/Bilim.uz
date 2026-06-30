import { useState, useEffect } from "react";

export default function Reyting() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(data);
    }, []);

    const sortedUsers = [...users].sort(
        (a, b) => (b.xp || 0) - (a.xp || 0)
    );

    const getLevel = (xp = 0) => Math.floor(xp / 200) + 1;

    return (
        <div className="mt-[130px] min-h-screen px-4">

            <div className="max-w-[1300px] mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-[30px]">
                    <div>
                        <h1 className="text-4xl font-bold text-white">
                            Reyting jadvali
                        </h1>
                        <p className="text-[#8F96B8]">
                            Eng yaxshi o'quvchilar — jonli yangilanish
                        </p>
                    </div>
                </div>

                {/* TOP 3 */}
                <div className="grid lg:grid-cols-3 gap-6 mb-10">

                    {sortedUsers.slice(0, 3).map((u, i) => (
                        <div
                            key={u.id}
                            className="h-[320px] rounded-[32px] border border-[#1C265A] bg-[#09112E]/60 backdrop-blur-xl flex flex-col items-center justify-center"
                        >

                            <span className="text-4xl">
                                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                            </span>

                            <img
                                src={
                                    u.avatar && u.avatar.length > 0
                                        ? u.avatar
                                        : "https://i.pravatar.cc/100?img=1"
                                }
                                alt=""
                                className="w-[90px] h-[90px] rounded-full object-cover"
                            />

                            <h2 className="text-white text-[18px] font-bold mt-3">
                                {u.name} {u.surname}
                            </h2>

                            <p className="text-[#8F96B8]">
                                {u.className} · Lvl {getLevel(u.xp)}
                            </p>

                            <h1 className="text-cyan-400 text-[26px] mt-1">
                                {u.xp || 0}
                            </h1>

                        </div>
                    ))}

                </div>

                {/* TABLE */}
                <div className="rounded-[36px] border border-[#1a2558] bg-[#09112E]/70 backdrop-blur-xl overflow-hidden">

                    <div className="grid grid-cols-[60px_1fr_140px_140px] px-8 h-[72px] items-center text-[#9FA5C5] border-b border-[#182149]">
                        <div>#</div>
                        <div>O'quvchi</div>
                        <div className="text-center">Lvl</div>
                        <div className="text-right">Ball</div>
                    </div>

                    {sortedUsers.map((u) => (
                        <div key={u.id}>
                            <img
                                src={
                                    u.avatar ||
                                    "https://i.pravatar.cc/100"
                                }
                                alt=""
                            />

                            <h3>
                                {u.name} {u.surname}
                            </h3>

                            <p>{u.className}</p>

                            <h4>{u.xp} XP</h4>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}