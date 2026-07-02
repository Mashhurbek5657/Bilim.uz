import { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Zap,
  User,
  Clock3,
  LogOut
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Profil() {
  
  const [avatarUrl, setAvatarUrl] = useState("");
  const [xpData, setXpData] = useState({});
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // ================= LOAD DATA =================

  const loadData = () => {
    const savedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
   
    setUser(savedUser);
   
    setAvatarUrl(
      savedUser.avatar || 
      localStorage.getItem("profileImage") ||
      ""
    );

    try {
      setXpData(
        JSON.parse(
          localStorage.getItem("xpData")
        ) || {}
      );
    } catch {
      setXpData({});
    }

    try {
      setHistory(
        JSON.parse(
          localStorage.getItem("testHistory")
        ) || []
      );
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener(
      "storage",
      loadData
    );

    const timer = setInterval(
      loadData,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadData
      );

      clearInterval(timer);
    }

  }, []);

  // ================= IMAGE =================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      setAvatarUrl(image);

      localStorage.setItem(
        "profileImage",
        image
      );

      const oldUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || {};

      const updatedUser = {
        ...oldUser,
        avatar: image
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      window.dispatchEvent(
        new Event("storage")
      );
    };

    reader.readAsDataURL(file);
  };

  // ================= XP =================

  const totalXP = useMemo(() => {
    return Object.values(xpData)
      .reduce(
        (sum, x) => sum + Number(x || 0),
        0
      );
  }, [xpData]);

  const level =
    Math.floor(totalXP / 100) + 1;

  const levelProgress =
    ((totalXP % 100) / 100) * 100;

  const nextXP =
    100 - (totalXP % 100);

  // ================= HISTORY =================

  const filteredHistory =
    history.filter(
      h =>
        Date.now() - h.time <=
        2 * 60 * 60 * 1000
    );

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user.name) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 mt-[100px] xs:mt-[120px] sm:mt-[150px] lg:mt-[200px] mb-10 xs:mb-12 sm:mb-16 lg:mb-20 flex justify-center min-h-screen">

        <div className="w-full max-w-[490px] h-[200px] rounded-[20px] xs:rounded-[25px] sm:rounded-[32px] border border-[#1C265A] bg-[#09112E]/60 backdrop-blur-xl p-5 xs:p-6 sm:p-8 lg:p-10 text-center">

          <h1 className="text-white text-xl xs:text-2xl sm:text-[26px] font-bold mb-2 xs:mb-3">
            Profilni ko'rish uchun kiring
          </h1>

          <p className="text-[#A6AECD] text-sm xs:text-base mb-4 xs:mb-6">
            Ro'yxatdan o'ting yoki hisobingizga kiring.
          </p>

          <div className="flex flex-col xs:flex-row justify-center gap-2 xs:gap-3">

            <button
              onClick={() => navigate("/register")}
              className="px-4 xs:px-6 py-2 xs:py-3 rounded-lg xs:rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm xs:text-base font-semibold hover:scale-105 transition-transform duration-300"
            >
              Ro'yxatdan o'tish
            </button>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div
      className="
      max-w-[1200px]
      mx-auto
      px-4
  
      mt-[130px]
  
      xs:mt-[130px]
      sm:mt-[130px]
      md:mt-[130px]
  
      max-[767px]:-mt-[60px]
  
      mb-8
      xs:mb-10
      sm:mb-12
      lg:mb-16
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-[300px_1fr]
          lg:grid-cols-[340px_1fr]
    
          gap-4
          xs:gap-5
          sm:gap-6
          lg:gap-5
          "
      >

        {/* LEFT PROFILE */}
        <div className="rounded-[20px] xs:rounded-[25px] sm:rounded-[28px] lg:rounded-[32px] border border-[#1C265A] bg-[#09112E]/60 backdrop-blur-xl p-4 xs:p-5 sm:p-6 lg:p-7">

          <div className="flex flex-col items-center">

            <div className="w-[90px] xs:w-[100px] sm:w-[110px] lg:w-[120px] h-[90px] xs:h-[100px] sm:h-[110px] lg:h-[120px] rounded-full p-[3px] xs:p-[4px] bg-gradient-to-r from-purple-500 to-cyan-400">

              <div className="w-full h-full rounded-full overflow-hidden bg-[#0B1025] flex items-center justify-center">

                {avatarUrl ?
                  <img
                    src={avatarUrl}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                  :
                  <User
                    size={40}
                    className="xs:w-[45px] lg:w-[55px] text-[#7D86B2]"
                  />
                }

              </div>

            </div>

            <h1 className="text-white text-lg xs:text-xl sm:text-xl lg:text-[20px] font-bold mt-2 xs:mt-3 sm:mt-4 text-center">
              {
                user.name && user.surname
                  ?
                  `${user.name} ${user.surname}`
                  :
                  "Ro'yxatdan o'ting"
              }
            </h1>

            <p className="text-[#A6AECD] text-xs xs:text-sm mt-1">
              {
                user.className
                  ?
                  `${user.className}-sinf`
                  :
                  "Profil yaratish kerak"
              }
            </p>

          </div>

          {/* IMAGE */}
          <div className="mt-4 xs:mt-5 sm:mt-6 lg:mt-6 space-y-2 xs:space-y-3">

            <input
              placeholder="Rasm link kiriting..."
              className="w-full bg-[#10183A] border border-[#243066] rounded-lg xs:rounded-xl px-2.5 xs:px-3 py-1.5 xs:py-2 text-white text-xs xs:text-sm focus:border-cyan-400 transition-colors duration-300"
              onBlur={(e) => {
                if (e.target.value) {
                  setAvatarUrl(
                    e.target.value
                  );

                  localStorage.setItem(
                    "profileImage",
                    e.target.value
                  );

                  const oldUser =
                    JSON.parse(
                      localStorage.getItem("user")
                    ) || {};

                  const updatedUser = {
                    ...oldUser,
                    avatar: e.target.value
                  };

                  localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                  );
                }
              }}
            />

            <label
              className="flex justify-center py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs xs:text-sm sm:text-base cursor-pointer hover:shadow-[0_0_20px_rgba(34,211,238,.3)] transition-shadow duration-300"
            >
              Rasm tanlash

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

          </div>

          {/* XP LEVEL */}
          <div className="mt-5 xs:mt-6 sm:mt-7 lg:mt-7 space-y-3 xs:space-y-4">

            <div className="bg-white/5 rounded-lg xs:rounded-xl p-3 xs:p-4">

              <div className="flex justify-between items-center gap-2">

                <div className="flex gap-2 xs:gap-3 text-[#B0B8D8] items-center text-xs xs:text-sm">
                  <Trophy size={14} className="xs:w-[16px]" />
                  <span>Umumiy XP</span>
                </div>

                <b className="text-white text-sm xs:text-base">{totalXP}</b>

              </div>

              <div className="mt-2 xs:mt-3 h-1.5 xs:h-2 bg-[#1C265A] rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${Math.min((totalXP / 2000) * 100, 100)}%`
                  }}
                />

              </div>

              <p className="text-xs text-gray-400 mt-1.5 xs:mt-2">
                {totalXP}/2000 XP
              </p>

            </div>

            <div className="bg-white/5 rounded-lg xs:rounded-xl p-3 xs:p-4">

              <div className="flex justify-between items-center gap-2">

                <div className="flex gap-2 xs:gap-3 text-[#B0B8D8] items-center text-xs xs:text-sm">
                  <Zap size={14} className="xs:w-[16px]" />
                  <span>Level</span>
                </div>

                <b className="text-white text-sm xs:text-base">Lv {level}</b>

              </div>

              <div className="mt-2 xs:mt-3 h-1.5 xs:h-2 bg-[#1C265A] rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${levelProgress}%`
                  }}
                />

              </div>

              <p className="text-xs text-gray-400 mt-1.5 xs:mt-2">
                Keyingi level: {nextXP} XP
              </p>

            </div>

          </div>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full mt-5 xs:mt-6 py-2 xs:py-2.5 px-3 xs:px-4 rounded-lg xs:rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 text-xs xs:text-sm font-semibold hover:bg-red-600/30 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Chiqish
          </button>

        </div>

        {/* RIGHT */}
        <div className="space-y-4 xs:space-y-5 sm:space-y-6 lg:space-y-6">

          {/* FAN XP */}
          <div className="rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] p-4 xs:p-5 border border-[#1C265A] bg-[#09112E]/60 text-white backdrop-blur-xl">

            <h2 className="text-white font-bold text-base xs:text-lg sm:text-xl mb-3 xs:mb-4">
              Fanlar bo'yicha XP
            </h2>

            <div className="grid grid-cols-2 xs:grid-cols-2 gap-2 xs:gap-3 max-h-[130px] xs:max-h-[150px] overflow-y-auto pr-2">

              {Object.entries(xpData).length === 0 ? (
                <p className="text-gray-400 text-sm col-span-2">Hozircha testlar yo'q</p>
              ) : (
                Object.entries(xpData)
                  .map(([subject, xp]) => (
                    <div
                      key={subject}
                      className="bg-white/5 rounded-lg xs:rounded-xl p-2.5 xs:p-3 flex justify-between items-center"
                    >
                      <span className="text-[#B0B8D8] text-xs xs:text-sm">
                        {subject}
                      </span>
                      <span className="text-white text-sm xs:text-base font-semibold">
                        {xp}
                      </span>
                    </div>
                  ))
              )}

            </div>

          </div>

          {/* HISTORY */}
          <div className="rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] p-4 xs:p-5 border border-[#1C265A] bg-[#09112E]/60 backdrop-blur-xl">

            <h2 className="text-white font-bold text-base xs:text-lg sm:text-xl mb-3 xs:mb-4">
              Test tarixi ({filteredHistory.length})
            </h2>

            <div className="max-h-[250px] xs:max-h-[300px] overflow-y-auto text-white pr-2">

              {filteredHistory.length === 0 ?
                <p className="text-gray-400 text-sm">
                  Hozircha test yo'q
                </p>
                :
                filteredHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start py-2 xs:py-3 border-b border-[#1C265A] last:border-b-0 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm xs:text-base font-semibold truncate">
                        {item.subject}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock3 size={12} />
                        {item.date}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm xs:text-base font-semibold">
                        {item.score}
                      </p>
                      <p className="text-cyan-400 text-xs xs:text-sm font-semibold">
                        {item.xp}
                      </p>
                    </div>

                  </div>
                ))
              }

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="mt-8 xs:mt-10 sm:mt-12 lg:mt-16 border border-[#1C265A] rounded-[20px] xs:rounded-[24px] sm:rounded-[30px] lg:rounded-3xl p-4 xs:p-5 sm:p-6 text-gray-400 max-w-[1300px] mx-auto">

        <b className="text-white text-base xs:text-lg">
          Bilim Olami
        </b>
        <br />
        <span className="text-xs xs:text-sm sm:text-base">
          O'zbek o'quvchilari uchun futuristik ta'lim platformasi
        </span>

      </footer>

    </div>
  );
}