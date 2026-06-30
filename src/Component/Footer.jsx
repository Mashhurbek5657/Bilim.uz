  
  export default function Footer(){
  
  return (
  
  <footer className="
  
  text-white
  mt-20
  ">
  
  
  <div className="
  px-6
  py-6
  
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4
  
  gap-10
  ">
  
  
  {/* LOGO */}
  
  <div>
  
  
  <div className="
  flex
  items-center
  gap-3
  text-2xl
  font-bold
  mb-5
  ">
  
  <div className="
  bg-cyan-400
  text-black
  p-3
  rounded-2xl
  ">
  </div>
  
  
  Bilim Olami
  
  </div>
  
  
  
  <p className="
  text-gray-300
  leading-7
  ">
  
  O‘quvchilar uchun yaratilgan
  zamonaviy ta’lim platformasi.
  Testlar, fanlar va bilim
  rivoji uchun qulay tizim.
  
  </p>
  
  
  
  <div className="
  flex
  gap-4
  mt-6
  ">
  
  
  <div className="
  p-3
  rounded-full
  bg-white/10
  hover:bg-cyan-400
  hover:text-black
  transition
  cursor-pointer
  ">
  
Facebook
  
  </div>
  
  
  <div className="
  p-3
  rounded-full
  bg-white/10
  hover:bg-cyan-400
  hover:text-black
  transition
  cursor-pointer
  ">
  
  Instagram
  
  </div>
  
  
  <div className="
  p-3
  rounded-full
  bg-white/10
  hover:bg-cyan-400
  hover:text-black
  transition
  cursor-pointer
  ">
  
 Youtube
  
  </div>
  
  
  </div>
  
  
  </div>
  
  
  
  
  
  {/* SAYT HAQIDA */}
  
  <div>
  
  
  <h2 className="
  text-xl
  font-bold
  text-cyan-300
  mb-5
  ">
  
  Sayt haqida
  
  </h2>
  
  
  <p className="
  text-gray-300
  leading-7
  ">
  
  Bilim Olami — maktab o‘quvchilari
  uchun bilim olish, test ishlash,
  XP yig‘ish va kitob o'qish orqali
  rivojlanish imkonini beruvchi
  platforma.
  
  </p>
  
  
  </div>
  
  
  
  
  
  {/* FOYDALANISH */}
  
  <div>
  
  
  <h2 className="
  text-xl
  font-bold
  text-cyan-300
  mb-5
  ">
  
  Foydalanish
  
  </h2>
  
  
  
  <ul className="
  space-y-3
  text-gray-300
  ">
  
  
  <li className="hover:text-cyan-300 transition cursor-pointer">
  
  ➜ Test ishlash
  
  </li>
  
  
  
  <li className="hover:text-cyan-300 transition cursor-pointer">
  
  ➜ XP yig‘ish
  
  </li>

  <li className="hover:text-cyan-300 transition">

➜ Kitob o‘qish

</li>
  
  
  <li className="hover:text-cyan-300 transition cursor-pointer">
  
  ➜ Natijalarni ko‘rish
  
  </li>
  
  
  </ul>
  
  
  </div>
  
  
  
  
  
  
  {/* JAMOA */}
  
  <div>
  
  
  <h2 className="
  text-xl
  font-bold
  text-cyan-300
  mb-5
  ">
  
  Mutaxassislar
  
  </h2>
  
  
  
  <ul className="
  space-y-3
  text-gray-300
  ">
  
  
  <li>
  
  👨‍💻 Frontend dasturchilar
  
  </li>
  
  
  <li>
  
  🎨 UI/UX dizaynerlar
  
  </li>
  
  
  <li>
  
  📚 Ta’lim mutaxassislari
  
  </li>
  
  
  <li>
  
  ⚙️ Texnik guruh
  
  </li>
  
  
  </ul>
  
  
  
  </div>
  
  
  
  </div>
  
  
  
  
  
  {/* BOTTOM */}
  
  
  <div className="
  border-t
  border-white/20
  
  py-5
  
  text-center
  
  text-gray-400
  
  text-sm
  
  ">
  
  
  © 2026 Bilim Olami.
  Barcha huquqlar himoyalangan.
  
  
  </div>
  
  
  
  </footer>
  
  )
  
  }