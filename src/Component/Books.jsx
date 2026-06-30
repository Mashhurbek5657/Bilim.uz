import { books } from "./booksData";
import { useState, useEffect } from "react";

import {
  Search,
  BookOpen,
} from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css";

export default function Books() {

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 120
    });
  }, []);

  const [search, setSearch] = useState("");

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase()
      .includes(search.toLowerCase())
    ||
    book.author.toLowerCase()
      .includes(search.toLowerCase())
  );

  // 4 TALIK QATORLARGA BO'LISH
  const rows = [];
  for (let i = 0; i < filteredBooks.length; i += 4) {
    rows.push(
      filteredBooks.slice(i, i + 4)
    );
  }

  return (
    <div className="min-h-screen mt-[60px] xs:mt-[80px] sm:mt-[100px] lg:mt-[150px] px-4 xs:px-4 sm:px-4 md:px-6 lg:px-8 pb-10 xs:pb-12 sm:pb-16 lg:pb-20">

      {/* BANNER */}
      <div
        data-aos="fade-right"
        className="max-w-[1400px] mx-auto rounded-[20px] xs:rounded-[25px] sm:rounded-[30px] lg:rounded-[35px] border border-[#20336B] bg-gradient-to-r from-[#07113A] via-[#0B163F] to-[#06142F] p-4 xs:p-6 sm:p-8 lg:p-10 shadow-[0_0_40px_rgba(0,200,255,.15)] overflow-hidden relative"
      >

        <div className="relative z-10">

          <h1 className="text-white text-2xl xs:text-3xl sm:text-4xl font-bold">
            📚 Kitoblar olami
          </h1>

          <p className="text-[#A6AECD] text-sm xs:text-base sm:text-lg lg:text-xl mt-2 xs:mt-3">
            Eng yaxshi asarlar, hikoyalar va fanlarni bir joydan o'qing.
          </p>

          <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 mt-4 xs:mt-5 sm:mt-6">

            <div className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#071B4A] border border-[#223A78] text-white text-xs xs:text-sm sm:text-base">
              📖 {books.length}+ Kitob
            </div>

            <div className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#071B4A] border border-[#223A78] text-white text-xs xs:text-sm sm:text-base">
              ⭐ Mashhur asarlar
            </div>

          </div>

        </div>

        <BookOpen
          size={80}
          className="absolute right-4 xs:right-6 sm:right-8 lg:right-10 bottom-[-20px] xs:bottom-[-25px] lg:bottom-[-30px] text-cyan-400/20 animate-pulse"
        />

      </div>

      {/* SEARCH */}
      <div
        data-aos="fade-down"
        className="max-w-[800px] xs:max-w-[700px] sm:max-w-[600px] mx-auto mt-6 xs:mt-8 sm:mt-10 mb-8 xs:mb-10 relative"
      >

        <Search
          className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Kitob yoki yozuvchi qidiring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 xs:pl-12 pr-4 xs:pr-5 py-2.5 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#081020] border border-[#1C265A] text-white text-xs xs:text-sm sm:text-base outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all duration-300 placeholder-gray-500"
        />

      </div>

      {/* CARDS GRID */}
      <div className="max-w-[1400px] mx-auto space-y-6 xs:space-y-8 sm:space-y-10">

        {rows.map((row, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-6"
          >

            {row.map((book) => (
              <a
                key={book.id}
                href={book.link}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[16px] xs:rounded-[18px] sm:rounded-[20px] lg:rounded-[25px] overflow-hidden bg-[#050D22] border border-[#20336B] hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2 shadow-[0_0_35px_rgba(0,200,255,.08)] hover:shadow-[0_0_50px_rgba(0,200,255,.2)]"
              >

                {/* IMAGE CONTAINER */}
                <div className="h-[160px] xs:h-[180px] sm:h-[200px] md:h-[240px] lg:h-[300px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#081020] to-[#101B45] relative">

                  <div className="absolute w-[100px] xs:w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-[100px] xs:h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] rounded-full bg-cyan-400/20 blur-3xl animate-pulse"></div>

                  <img
                    src={book.image}
                    alt={book.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />

                </div>

                {/* CONTENT */}
                <div className="p-2.5 xs:p-3 sm:p-4 lg:p-5">

                  <h2 className="text-white font-bold text-sm xs:text-base sm:text-lg lg:text-xl truncate group-hover:text-cyan-400 transition-colors duration-300">
                    {book.title}
                  </h2>

                  <p className="text-[#A6AECD] text-xs xs:text-xs sm:text-sm lg:text-sm mt-0.5 xs:mt-1 sm:mt-1.5 lg:mt-2 truncate">
                    {book.author}
                  </p>

                  <div className="flex justify-between items-center gap-2 mt-3 xs:mt-3 sm:mt-4 lg:mt-6">

                    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-1.5 lg:gap-2 text-cyan-400 font-semibold text-xs xs:text-xs sm:text-sm lg:text-sm flex-shrink-0">
                      <BookOpen size={14} className="xs:w-[14px] sm:w-[16px] lg:w-[18px]" />
                      Kitob
                    </div>

                    <button
                      className="px-2.5 xs:px-3 sm:px-4 lg:px-6 py-1.5 xs:py-1.5 sm:py-2 lg:py-3 rounded-lg xs:rounded-lg sm:rounded-lg lg:rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs xs:text-xs sm:text-sm lg:text-base font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,.4)] flex-shrink-0"
                    >
                      O'qish
                    </button>

                  </div>

                </div>

              </a>
            ))}

          </div>
        ))}

      </div>

      {/* NO RESULTS */}
      {filteredBooks.length === 0 && (
        <div
          data-aos="zoom-in"
          className="text-center text-white mt-8 xs:mt-10 sm:mt-12 text-base xs:text-lg sm:text-xl"
        >
          Kitob topilmadi 📕
        </div>
      )}

    </div>
  );
}