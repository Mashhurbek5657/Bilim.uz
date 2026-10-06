 
const COUNT = 200;
 
// ----------------------------- yordamchilar -----------------------------
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rnd(0, arr.length - 1)];
 
function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
 
// Raqamli javob uchun 4 ta noyob variant
function numOptions(a) {
  const set = new Set([a]);
  const isYear = a >= 1000 && a <= 2100;
  const base = isYear ? 12 : Math.max(5, Math.round(Math.abs(a) * 0.15));
  let t = 0;
  while (set.size < 4) {
    const v = a + (Math.random() < 0.5 ? -1 : 1) * rnd(1, base + t);
    t++;
    if (a >= 0 && v < 0) continue;
    set.add(v);
  }
  return shuffle([...set].map(String));
}
 
// Raqamli savol
const N = (question, a) => ({
  question,
  options: numOptions(a),
  answer: String(a),
});
 
// Matnli savol: w - noto'g'ri variantlar (bo'lmasa, shu to'plamdagi boshqa javoblardan olinadi)
function T(question, a, w, items) {
  let wrong = (w || []).filter((x) => x !== a);
  if (wrong.length < 3) {
    const others = [
      ...new Set(
        items
          .map((i) => i[1])
          .filter((x) => typeof x === "string" && x !== a && !wrong.includes(x))
      ),
    ];
    wrong = [...wrong, ...shuffle(others)];
  }
  return {
    question,
    options: shuffle([a, ...shuffle(wrong).slice(0, 3)]),
    answer: a,
  };
}
 
// Generator: [savol, javob] qaytaruvchi funksiyani savol obyektiga aylantiradi
const E = (f) => () => {
  const [q, a] = f();
  return N(q, a);
};
 
// Faktlar bazasi: [savol, javob, [noto'g'ri variantlar]?]
const F = (items) => () => {
  const [q, a, w] = pick(items);
  return typeof a === "number" ? N(q, a) : T(q, a, w, items);
};
 
// 200 ta savol yig'ish (avval noyob savollar, yetmasa takrorlanadi)
function build(...gens) {
  const seen = new Set();
  const out = [];
  let tries = 0;
  while (out.length < COUNT && tries < COUNT * 30) {
    tries++;
    const q = pick(gens)();
    if (seen.has(q.question)) continue;
    seen.add(q.question);
    out.push(q);
  }
  while (out.length < COUNT) out.push(pick(gens)());
  return shuffle(out);
}
 
// 11 ta sinfni yig'ish
const G = (grades) =>
  Object.fromEntries(
    grades.map((gens, i) => [`${i + 1}-sinf`, build(...gens)])
  );
 
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const comb = (n, k) => fact(n) / (fact(k) * fact(n - k));
const TR = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]];
 
// ============================= MATEMATIKA =============================
const matematika_G = ([
  // 1-sinf
  [
    E(() => { const a = rnd(1, 9), b = rnd(1, 10 - a); return [`${a} + ${b} = ?`, a + b]; }),
    E(() => { const a = rnd(2, 10), b = rnd(1, a - 1); return [`${a} - ${b} = ?`, a - b]; }),
    E(() => { const a = rnd(1, 6), b = rnd(1, 10 - a); return [`Savatda ${a} ta olma bor edi, yana ${b} ta qo'shildi. Jami nechta olma bo'ldi?`, a + b]; }),
  ],
  // 2-sinf
  [
    E(() => { const a = rnd(10, 60), b = rnd(10, 40); return [`${a} + ${b} = ?`, a + b]; }),
    E(() => { const a = rnd(30, 99), b = rnd(10, a - 1); return [`${a} - ${b} = ?`, a - b]; }),
    E(() => { const a = rnd(2, 5), b = rnd(1, 5); return [`${a} × ${b} = ?`, a * b]; }),
  ],
  // 3-sinf
  [
    E(() => { const a = rnd(2, 9), b = rnd(2, 10); return [`${a} × ${b} = ?`, a * b]; }),
    E(() => { const a = rnd(2, 9), b = rnd(2, 10); return [`${a * b} ÷ ${a} = ?`, b]; }),
    E(() => { const a = rnd(100, 500), b = rnd(100, 400); return [`${a} + ${b} = ?`, a + b]; }),
    E(() => { const a = rnd(300, 900), b = rnd(100, 299); return [`${a} - ${b} = ?`, a - b]; }),
  ],
  // 4-sinf
  [
    E(() => { const a = rnd(100, 999), b = rnd(2, 9); return [`${a} × ${b} = ?`, a * b]; }),
    E(() => { const a = rnd(2, 20), b = rnd(2, 9), c = rnd(2, 9); return [`${a} + ${b} × ${c} = ?`, a + b * c]; }),
    E(() => { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9); return [`(${a} + ${b}) × ${c} = ?`, (a + b) * c]; }),
    E(() => { const a = rnd(2, 30), b = rnd(2, 30); return [`To'g'ri to'rtburchakning uzunligi ${a} sm, eni ${b} sm. Perimetri (sm)?`, 2 * (a + b)]; }),
  ],
  // 5-sinf
  [
    E(() => { const n = rnd(1, 20) * 20, p = pick([10, 20, 25, 50]); return [`${n} ning ${p}% i nechaga teng?`, (n * p) / 100]; }),
    E(() => { const x = rnd(1, 50), a = rnd(1, 40); return [`x + ${a} = ${x + a}, x = ?`, x]; }),
    E(() => { const a = rnd(3, 25), b = rnd(3, 25); return [`To'g'ri to'rtburchak tomonlari ${a} va ${b}. Yuzi?`, a * b]; }),
    E(() => { const p = pick([[12, 18, 6], [24, 36, 12], [20, 30, 10], [15, 25, 5], [28, 42, 14], [16, 24, 8]]); return [`EKUB(${p[0]}, ${p[1]}) = ?`, p[2]]; }),
  ],
  // 6-sinf
  [
    E(() => { const a = rnd(1, 20), b = rnd(1, 20); return [`(${-a}) + ${b} = ?`, -a + b]; }),
    E(() => { const a = rnd(2, 9), k = rnd(2, 9), c = rnd(2, 9); return [`${a} : ${a * k} = ${c} : x, x = ?`, c * k]; }),
    E(() => { const p = pick([[4, 6, 12], [6, 8, 24], [3, 5, 15], [4, 10, 20], [6, 9, 18], [8, 12, 24]]); return [`EKUK(${p[0]}, ${p[1]}) = ?`, p[2]]; }),
    E(() => { const n = rnd(1, 20) * 20, p = pick([10, 20, 25, 50]); return [`Narxi ${n} so'm bo'lgan mahsulotga ${p}% chegirma qilindi. Chegirma miqdori?`, (n * p) / 100]; }),
  ],
  // 7-sinf
  [
    E(() => { const a = rnd(2, 9), x = rnd(1, 15), b = rnd(1, 20); return [`${a}x + ${b} = ${a * x + b}, x = ?`, x]; }),
    E(() => { const a = rnd(2, 5), n = rnd(2, 4); return [`${a}^${n} = ?`, a ** n]; }),
    E(() => { const a = rnd(1, 20), b = rnd(1, 20); return [`|${-a}| + ${b} = ?`, a + b]; }),
    E(() => { const a = rnd(1, 9), b = rnd(1, 9); return [`(${a} + ${b})² − 2·${a}·${b} = ?`, a * a + b * b]; }),
  ],
  // 8-sinf
  [
    E(() => { const k = rnd(2, 20); return [`√${k * k} = ?`, k]; }),
    E(() => { const p = rnd(3, 12), q = rnd(1, p - 1); return [`x² − ${p + q}x + ${p * q} = 0 tenglamaning katta ildizi?`, p]; }),
    E(() => { const t = pick(TR); return [`Katetlari ${t[0]} va ${t[1]} bo'lgan to'g'ri burchakli uchburchakning gipotenuzasi?`, t[2]]; }),
    E(() => { const x = rnd(2, 15); return [`x² = ${x * x}, x > 0 bo'lsa, x = ?`, x]; }),
  ],
  // 9-sinf
  [
    E(() => { const a = rnd(1, 20), d = rnd(1, 8), n = rnd(4, 15); return [`Arifmetik progressiya: a₁ = ${a}, d = ${d}. a${n} = ?`, a + (n - 1) * d]; }),
    E(() => { const b = rnd(1, 5), q = rnd(2, 4), n = rnd(3, 5); return [`Geometrik progressiya: b₁ = ${b}, q = ${q}. b${n} = ?`, b * q ** (n - 1)]; }),
    E(() => { const b = rnd(-10, 10), c = rnd(-10, 10); return [`x² + ${b}x + ${c} = 0 tenglamaning diskriminanti? (b=${b}, c=${c})`, b * b - 4 * c]; }),
    E(() => { const p = rnd(1, 9), q = rnd(1, 9); return [`x² − ${p + q}x + ${p * q} = 0 tenglama ildizlarining yig'indisi?`, p + q]; }),
  ],
  // 10-sinf
  [
    E(() => { const a = pick([2, 3, 5]), n = rnd(1, 5); return [`log_${a}(${a ** n}) = ?`, n]; }),
    E(() => { const n = rnd(4, 9), k = rnd(1, 3); return [`C(${n}, ${k}) = ?`, comb(n, k)]; }),
    E(() => { const a = pick([2, 3, 5]), n = rnd(2, 5); return [`${a}^x = ${a ** n}, x = ?`, n]; }),
    E(() => { const a = rnd(1, 10), d = rnd(1, 6), n = rnd(4, 12); return [`Arifmetik progressiyada a₁ = ${a}, d = ${d}. Dastlabki ${n} hadning yig'indisi?`, (n * (2 * a + (n - 1) * d)) / 2]; }),
  ],
  // 11-sinf
  [
    E(() => { const a = rnd(1, 5), n = rnd(2, 4), k = rnd(1, 3); return [`f(x) = ${a}x^${n}, f'(${k}) = ?`, a * n * k ** (n - 1)]; }),
    E(() => { const a = rnd(1, 5), k = rnd(1, 6); return [`∫₀^${k} ${2 * a}x dx = ?`, a * k * k]; }),
    E(() => { const k = rnd(1, 6); return [`∫₀^${k} 3x² dx = ?`, k ** 3]; }),
    E(() => { const n = rnd(3, 7); return [`${n}! = ?`, fact(n)]; }),
    E(() => { const b = rnd(1, 12); return [`Cheksiz geometrik progressiya: b₁ = ${b}, q = 1/2. Yig'indisi?`, 2 * b]; }),
  ],
]);
 
// ============================== GEOMETRIYA ==============================
// (π li savollar uchun alohida yordamchi)
const P = (f) => () => {
  const [q, c] = f();
  return { question: q, options: numOptions(c).map((x) => x + "π"), answer: c + "π" };
};
 
const geometriya_G = ([
  // 1-sinf
  [F([
    ["Uchburchakning nechta tomoni bor?", 3],
    ["To'rtburchakning nechta burchagi bor?", 4],
    ["Kvadratning nechta tomoni bor?", 4],
    ["Beshburchakning nechta tomoni bor?", 5],
    ["Oltiburchakning nechta tomoni bor?", 6],
    ["Uchburchakning nechta uchi (cho'qqisi) bor?", 3],
  ])],
  // 2-sinf
  [
    E(() => { const a = rnd(2, 20); return [`Kvadratning tomoni ${a} sm. Perimetri (sm)?`, 4 * a]; }),
    E(() => { const a = rnd(2, 15), b = rnd(2, 15); return [`To'g'ri to'rtburchakning tomonlari ${a} sm va ${b} sm. Perimetri (sm)?`, 2 * (a + b)]; }),
    E(() => { const a = rnd(2, 20); return [`Teng tomonli uchburchakning tomoni ${a} sm. Perimetri (sm)?`, 3 * a]; }),
  ],
  // 3-sinf
  [
    E(() => { const a = rnd(2, 12); return [`Kvadratning tomoni ${a} sm. Yuzi (sm²)?`, a * a]; }),
    E(() => { const a = rnd(2, 15), b = rnd(2, 15); return [`To'g'ri to'rtburchak: uzunligi ${a} sm, eni ${b} sm. Yuzi (sm²)?`, a * b]; }),
    E(() => { const a = rnd(2, 15), b = rnd(2, 15); return [`To'g'ri to'rtburchak: uzunligi ${a} sm, eni ${b} sm. Perimetri (sm)?`, 2 * (a + b)]; }),
  ],
  // 4-sinf
  [
    E(() => { const a = rnd(3, 20), b = rnd(2, a - 1); return [`To'g'ri to'rtburchakning perimetri ${2 * (a + b)} sm, eni ${b} sm. Uzunligi (sm)?`, a]; }),
    F([
      ["To'g'ri burchak necha gradus?", 90],
      ["Yoyiq burchak necha gradus?", 180],
      ["To'liq burchak necha gradus?", 360],
      ["Kvadratda nechta to'g'ri burchak bor?", 4],
    ]),
    E(() => { const a = rnd(2, 15), b = rnd(2, 15); return [`Yuzi ${a * b} sm², eni ${b} sm bo'lgan to'g'ri to'rtburchakning uzunligi (sm)?`, a]; }),
  ],
  // 5-sinf
  [
    E(() => { const a = rnd(20, 80), b = rnd(20, 80); return [`Uchburchakning ikki burchagi ${a}° va ${b}°. Uchinchi burchagi (°)?`, 180 - a - b]; }),
    E(() => { const h = rnd(2, 12), a = 2 * rnd(1, 10); return [`Uchburchakning asosi ${a} sm, balandligi ${h} sm. Yuzi (sm²)?`, (a * h) / 2]; }),
    E(() => { const a = rnd(2, 8), b = rnd(2, 8), c = rnd(2, 8); return [`Parallelepiped o'lchamlari ${a}, ${b}, ${c} sm. Hajmi (sm³)?`, a * b * c]; }),
  ],
  // 6-sinf
  [
    E(() => { const r = rnd(1, 15); return [`Aylana uzunligi (π ≈ 3), r = ${r} sm. C = ?`, 6 * r]; }),
    E(() => { const r = rnd(1, 12); return [`Doira yuzi (π ≈ 3), r = ${r} sm. S = ?`, 3 * r * r]; }),
    E(() => { const x = rnd(5, 85); return [`${x}° burchakning to'ldiruvchi burchagi (°)?`, 90 - x]; }),
    E(() => { const x = rnd(10, 170); return [`${x}° burchakning qo'shni burchagi (°)?`, 180 - x]; }),
  ],
  // 7-sinf
  [
    E(() => { const A = 2 * rnd(10, 80); return [`Teng yonli uchburchakning uchidagi burchagi ${A}°. Asosidagi burchagi (°)?`, (180 - A) / 2]; }),
    E(() => { const n = rnd(3, 12); return [`${n} burchakli ko'pburchak ichki burchaklari yig'indisi (°)?`, (n - 2) * 180]; }),
    E(() => { const t = pick(TR); return [`To'g'ri burchakli uchburchak katetlari ${t[0]} va ${t[1]}. Gipotenuzasi?`, t[2]]; }),
    E(() => { const a = rnd(20, 80); return [`Uchburchakning tashqi burchagi ichki burchaklaridan ikkitasi yig'indisiga teng. Agar ular ${a}° va ${a + 10}° bo'lsa, tashqi burchak (°)?`, 2 * a + 10]; }),
  ],
  // 8-sinf
  [
    E(() => { const a = rnd(2, 12), b = a + 2 * rnd(1, 6), h = rnd(2, 10); return [`Trapetsiya asoslari ${a} va ${b}, balandligi ${h}. Yuzi?`, ((a + b) * h) / 2]; }),
    E(() => { const d1 = 2 * rnd(2, 10), d2 = rnd(2, 12); return [`Rombning diagonallari ${d1} va ${d2}. Yuzi?`, (d1 * d2) / 2]; }),
    E(() => { const n = rnd(4, 12); return [`${n} burchakli qavariq ko'pburchakda nechta diagonal bor?`, (n * (n - 3)) / 2]; }),
    E(() => { const t = pick(TR); return [`To'g'ri burchakli uchburchakda gipotenuza ${t[2]}, bir katet ${t[0]}. Ikkinchi katet?`, t[1]]; }),
  ],
  // 9-sinf
  [
    E(() => { const n = pick([3, 4, 6, 8, 9, 10, 12]); return [`Muntazam ${n} burchakning ichki burchagi (°)?`, (180 * (n - 2)) / n]; }),
    E(() => { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), k = rnd(1, 4), x = rnd(0, 6), y = rnd(0, 6); return [`A(${x}; ${y}) va B(${x + t[0] * k}; ${y + t[1] * k}) nuqtalar orasidagi masofa?`, t[2] * k]; }),
    E(() => { const n = pick([3, 4, 5, 6, 8, 9, 10, 12]); return [`Muntazam ${n} burchakning markaziy burchagi (°)?`, 360 / n]; }),
  ],
  // 10-sinf
  [
    E(() => { const a = rnd(2, 12); return [`Kub qirrasi ${a} sm. Hajmi (sm³)?`, a ** 3]; }),
    E(() => { const a = rnd(2, 10); return [`Kub qirrasi ${a} sm. To'la sirti (sm²)?`, 6 * a * a]; }),
    E(() => { const a = rnd(2, 8), b = rnd(2, 8), c = rnd(2, 8); return [`To'g'ri burchakli parallelepiped o'lchamlari ${a}, ${b}, ${c}. To'la sirti?`, 2 * (a * b + b * c + a * c)]; }),
    E(() => { const n = rnd(3, 10); return [`Asosi ${n} burchakli prizmada nechta qirra bor?`, 3 * n]; }),
    E(() => { const n = rnd(3, 10); return [`Asosi ${n} burchakli piramidada nechta yoq (asosi bilan) bor?`, n + 1]; }),
  ],
  // 11-sinf
  [
    P(() => { const r = 3 * rnd(1, 4); return [`Shar hajmi V = (4/3)πr³, r = ${r}. V = ?`, (4 * r ** 3) / 3]; }),
    P(() => { const r = rnd(1, 9); return [`Shar sirti S = 4πr², r = ${r}. S = ?`, 4 * r * r]; }),
    P(() => { const r = rnd(1, 8), h = rnd(1, 10); return [`Silindr hajmi V = πr²h, r = ${r}, h = ${h}. V = ?`, r * r * h]; }),
    P(() => { const r = 3 * rnd(1, 4), h = rnd(2, 9); return [`Konus hajmi V = (1/3)πr²h, r = ${r}, h = ${h}. V = ?`, (r * r * h) / 3]; }),
  ],
]);
 
// ============================== FIZIKA ==============================
const fizika_G = ([
  // 1-sinf
  [F([
    ["Muz qizisa, nimaga aylanadi?", "Suvga", ["Toshga", "Havoga", "Yog'ga"]],
    ["Suv qaynasa, nimaga aylanadi?", "Bug'ga", ["Muzga", "Toshga", "Yog'ga"]],
    ["Suv sovuqda nimaga aylanadi?", "Muzga", ["Bug'ga", "Gazga", "Qumga"]],
    ["Quyosh bizga nima beradi?", "Yorug'lik va issiqlik", ["Faqat sovuq", "Faqat ovoz", "Faqat shamol"]],
  ])],
  // 2-sinf
  [F([
    ["Magnit nimani tortadi?", "Temirni", ["Yog'ochni", "Shishani", "Plastmassani"]],
    ["Ovozni biz nima bilan eshitamiz?", "Quloq bilan", ["Ko'z bilan", "Burun bilan", "Til bilan"]],
    ["Tashlangan narsani yerga nima tortadi?", "Og'irlik kuchi", ["Magnit", "Shamol", "Ovoz"]],
    ["Soya qachon hosil bo'ladi?", "Yorug'lik to'silganda", ["Yomg'irda", "Shamolda", "Qor yog'ganda"]],
  ])],
  // 3-sinf
  [F([
    ["Suv necha °C da qaynaydi?", 100],
    ["Suv necha °C da muzlaydi?", 0],
    ["Insonning normal tana harorati taxminan necha °C?", 37],
    ["Ovoz havosiz bo'shliqda tarqaladimi?", "Yo'q", ["Ha", "Faqat kunduz", "Faqat tunda"]],
    ["Quyidagilardan qaysi biri yorug'lik manbai?", "Quyosh", ["Tosh", "Daraxt", "Stol"]],
  ])],
  // 4-sinf
  [F([
    ["Quyosh sistemasida nechta sayyora bor?", 8],
    ["Yer Quyosh atrofida taxminan necha kunda aylanadi?", 365],
    ["Yorug'lik tezligi taxminan necha km/s?", 300000],
    ["Yerga eng yaqin yulduz qaysi?", "Quyosh", ["Oy", "Mars", "Sirius"]],
  ])],
  // 5-sinf
  [F([
    ["Kuch birligi nima?", "Nyuton", ["Joul", "Vatt", "Paskal"]],
    ["Energiya (ish) birligi nima?", "Joul", ["Nyuton", "Vatt", "Paskal"]],
    ["Quvvat birligi nima?", "Vatt", ["Nyuton", "Joul", "Paskal"]],
    ["Bosim birligi nima?", "Paskal", ["Nyuton", "Joul", "Vatt"]],
    ["Uzunlikning SI birligi nima?", "Metr", ["Kilogramm", "Sekund", "Amper"]],
  ])],
  // 6-sinf
  [
    F([
      ["Massaning SI birligi nima?", "Kilogramm", ["Nyuton", "Metr", "Sekund"]],
      ["Vaqtning SI birligi nima?", "Sekund", ["Metr", "Kilogramm", "Nyuton"]],
      ["Tezlik birligi nima?", "m/s", ["kg", "N", "J"]],
    ]),
    E(() => { const v = rnd(2, 20), t = rnd(2, 10); return [`Jism ${v} m/s tezlik bilan ${t} s harakatlansa, qancha masofa (m) bosadi?`, v * t]; }),
    E(() => { const v = rnd(2, 20), t = rnd(2, 10); return [`Jism ${v * t} m masofani ${t} s da bosdi. Tezligi (m/s)?`, v]; }),
  ],
  // 7-sinf
  [
    E(() => { const r = rnd(1, 10) * 100, V = rnd(1, 9); return [`Hajmi ${V} m³, zichligi ${r} kg/m³ bo'lgan jismning massasi (kg)?`, r * V]; }),
    E(() => { const S = rnd(1, 10), k = rnd(2, 50); return [`${S * k} N kuch ${S} m² yuzaga ta'sir qiladi. Bosim (Pa)?`, k]; }),
    E(() => { const v = rnd(2, 30), t = rnd(2, 12); return [`Tezligi ${v} m/s bo'lgan jism ${t} s da qancha yo'l (m) bosadi?`, v * t]; }),
  ],
  // 8-sinf
  [
    E(() => { const m = rnd(1, 10), dt = rnd(5, 50); return [`${m} kg suvni ${dt} °C ga qizdirish uchun issiqlik miqdori (J)? (c = 4200 J/kg·°C)`, 4200 * m * dt]; }),
    E(() => { const I = rnd(1, 10), R = rnd(2, 30); return [`Zanjirda tok ${I} A, qarshilik ${R} Ω. Kuchlanish (V)?`, I * R]; }),
    E(() => { const I = rnd(1, 10), R = rnd(2, 30); return [`Kuchlanish ${I * R} V, qarshilik ${R} Ω. Tok kuchi (A)?`, I]; }),
    E(() => { const U = rnd(2, 24) * 10, I = rnd(1, 10); return [`Kuchlanish ${U} V, tok ${I} A. Quvvat (W)?`, U * I]; }),
  ],
  // 9-sinf
  [
    E(() => { const m = rnd(1, 20), a = rnd(1, 10); return [`Massasi ${m} kg jism ${a} m/s² tezlanish oldi. Kuch (N)?`, m * a]; }),
    E(() => { const v0 = rnd(0, 20), a = rnd(1, 6), t = rnd(1, 10); return [`Boshlang'ich tezlik ${v0} m/s, tezlanish ${a} m/s². ${t} s dan keyingi tezlik (m/s)?`, v0 + a * t]; }),
    E(() => { const m = rnd(1, 30), v = rnd(1, 20); return [`Massasi ${m} kg jism ${v} m/s tezlikda. Impulsi (kg·m/s)?`, m * v]; }),
    E(() => { const v0 = rnd(0, 10), a = 2 * rnd(1, 5), t = rnd(1, 8); return [`v₀ = ${v0} m/s, a = ${a} m/s², t = ${t} s. Bosib o'tilgan yo'l (m)?`, v0 * t + (a * t * t) / 2]; }),
  ],
  // 10-sinf
  [
    E(() => { const m = rnd(2, 50), h = rnd(1, 20); return [`${m} kg jism ${h} m balandlikda. Potensial energiyasi (J)? (g = 10 m/s²)`, m * 10 * h]; }),
    E(() => { const m = 2 * rnd(1, 15), v = rnd(1, 20); return [`${m} kg jism ${v} m/s tezlik bilan harakatlanmoqda. Kinetik energiyasi (J)?`, (m * v * v) / 2]; }),
    E(() => { const F = rnd(2, 50), s = rnd(2, 20); return [`${F} N kuch ta'sirida jism ${s} m ko'chdi. Bajarilgan ish (J)?`, F * s]; }),
    E(() => { const N_ = rnd(2, 30), t = rnd(2, 20); return [`${N_ * t} J ish ${t} s da bajarildi. Quvvat (W)?`, N_]; }),
  ],
  // 11-sinf
  [
    E(() => { const l = rnd(1, 10), f = rnd(2, 50); return [`To'lqin uzunligi ${l} m, chastotasi ${f} Hz. To'lqin tezligi (m/s)?`, l * f]; }),
    E(() => { const a = rnd(2, 30), b = rnd(2, 30); return [`Ketma-ket ulangan ${a} Ω va ${b} Ω qarshiliklarning umumiy qarshiligi (Ω)?`, a + b]; }),
    E(() => { const I = rnd(1, 10), t = rnd(2, 30); return [`Tok kuchi ${I} A, vaqt ${t} s. O'tgan zaryad (C)?`, I * t]; }),
    E(() => { const U1 = rnd(1, 10) * 10, n1 = rnd(1, 10), k = rnd(2, 6); return [`Transformator: U₁ = ${U1} V, n₁ = ${n1}, n₂ = ${n1 * k}. U₂ (V)?`, U1 * k]; }),
  ],
]);
 
// ============================== BIOLOGIYA ==============================
const biologiya_G = ([
  // 1
  [F([
    ["Sigir nima beradi?", "Sut"], ["Tovuq nima qo'yadi?", "Tuxum"],
    ["Asalari nima beradi?", "Asal"], ["Qo'ydan nima olinadi?", "Jun"],
    ["O'simlik suvni nima orqali oladi?", "Ildiz"], ["Baliq qayerda yashaydi?", "Suvda"],
    ["Qush nima bilan uchadi?", "Qanot"],
  ])],
  // 2
  [F([
    ["Burgut qaysi guruhga kiradi?", "Qush"], ["Karp qaysi guruhga kiradi?", "Baliq"],
    ["Ot qaysi guruhga kiradi?", "Sutemizuvchi"], ["Ari qaysi guruhga kiradi?", "Hasharot"],
    ["Ilon qaysi guruhga kiradi?", "Sudralib yuruvchi"], ["Delfin qaysi guruhga kiradi?", "Sutemizuvchi"],
    ["Qaldirg'och qaysi guruhga kiradi?", "Qush"], ["Kapalak qaysi guruhga kiradi?", "Hasharot"],
  ])],
  // 3
  [F([
    ["O'simlikning tuproqdan suv so'ruvchi qismi?", "Ildiz"],
    ["O'simlikni tik tutib turuvchi qismi?", "Poya"],
    ["Fotosintez asosan qaysi qismda boradi?", "Barg"],
    ["Urug' qaysi qismda hosil bo'ladi?", "Meva"],
    ["Changlanish qaysi qismda sodir bo'ladi?", "Gul"],
    ["Yangi o'simlik nimadan unib chiqadi?", "Urug'"],
  ])],
  // 4
  [F([
    ["Fotosintezda o'simlik qaysi gazni yutadi?", "Karbonat angidrid", ["Kislorod", "Azot", "Vodorod"]],
    ["Fotosintezda qaysi gaz ajralib chiqadi?", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"]],
    ["Odam nafas olganda qaysi gazni qabul qiladi?", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"]],
    ["Havoning eng katta qismini qaysi gaz tashkil etadi?", "Azot", ["Kislorod", "Karbonat angidrid", "Argon"]],
    ["O'simlik ildizi orqali nimani oladi?", "Suv", ["Kislorod", "Yorug'lik", "Shamol"]],
    ["Odamda nechta sezgi a'zosi bor?", 5],
  ])],
  // 5
  [F([
    ["Hujayra yadrosining vazifasi?", "Irsiy axborotni saqlash"],
    ["Hujayrada fotosintez qaysi organoidda boradi?", "Xloroplast"],
    ["Hujayrada energiya hosil qiluvchi organoid?", "Mitoxondriya"],
    ["Hujayrani tashqaridan o'rab turuvchi parda?", "Membrana"],
    ["O'simlik hujayrasidagi qattiq qobiq?", "Hujayra devori"],
  ])],
  // 6
  [F([
    ["Bug'doy qaysi sinfga kiradi?", "Bir pallalilar", ["Ikki pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Makkajo'xori qaysi sinfga kiradi?", "Bir pallalilar", ["Ikki pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Loviya qaysi sinfga kiradi?", "Ikki pallalilar", ["Bir pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Archa qaysi bo'limga kiradi?", "Ochiq urug'lilar", ["Bir pallalilar", "Ikki pallalilar", "Suvo'tlar"]],
    ["Paporotnik qanday ko'payadi?", "Sporalar bilan", ["Urug' bilan", "Meva bilan", "Gul bilan"]],
  ])],
  // 7
  [F([
    ["Hasharotlarning oyoqlari soni?", 6],
    ["O'rgimchaklarning oyoqlari soni?", 8],
    ["Baliqlar nima bilan nafas oladi?", "Jabra", ["O'pka", "Teri", "Traxeya"]],
    ["Qushlarning tanasi nima bilan qoplangan?", "Patlar", ["Jun", "Tangacha", "Chig'anoq"]],
    ["Sutemizuvchilar bolasini nima bilan boqadi?", "Sut", ["Tuxum", "Yem", "Asal"]],
    ["Sudralib yuruvchilar terisi nima bilan qoplangan?", "Shoxsimon tangachalar", ["Patlar", "Jun", "Shilimshiq modda"]],
  ])],
  // 8
  [F([
    ["Odam yuragi nechta kameradan iborat?", 4],
    ["Odamda necha juft qovurg'a bor?", 12],
    ["Qonning qizil rangini beruvchi modda?", "Gemoglobin", ["Insulin", "Adrenalin", "Pepsin"]],
    ["Qonni filtrlab siydik hosil qiluvchi a'zo?", "Buyrak", ["Jigar", "O'pka", "Yurak"]],
    ["Gaz almashinuvi o'pkaning qaysi qismida boradi?", "Alveolalar", ["Bronxlar", "Traxeya", "Hiqildoq"]],
    ["Insulin qaysi bezda hosil bo'ladi?", "Oshqozon osti bezi", ["Jigar", "Qalqonsimon bez", "Buyrak usti bezi"]],
  ])],
  // 9
  [F([
    ["Insonda nechta xromosoma bor?", 46],
    ["Jinsiy hujayrada nechta xromosoma bor?", 23],
    ["Mitoz natijasida nechta hujayra hosil bo'ladi?", 2],
    ["Meyoz natijasida nechta hujayra hosil bo'ladi?", 4],
    ["DNK zanjiri nechta ipdan iborat?", 2],
    ["Irsiyat qonunlarini kim kashf etgan?", "Gregor Mendel", ["Charlz Darvin", "Lui Paster", "Karl Linney"]],
    ["Evolyutsiya nazariyasi muallifi?", "Charlz Darvin", ["Gregor Mendel", "Lui Paster", "Karl Linney"]],
    ["Ekosistemada energiyaning asosiy manbai?", "Quyosh", ["Shamol", "Tuproq", "Suv"]],
  ])],
  // 10
  [F([
    ["Oqsillar qaysi monomerlardan tuzilgan?", "Aminokislotalar", ["Monosaxaridlar", "Nukleotidlar", "Yog' kislotalari"]],
    ["Uglevodlarning monomeri?", "Monosaxaridlar", ["Aminokislotalar", "Nukleotidlar", "Yog' kislotalari"]],
    ["Nuklein kislotalarning monomeri?", "Nukleotidlar", ["Aminokislotalar", "Monosaxaridlar", "Yog' kislotalari"]],
    ["Ribosomada qaysi jarayon boradi?", "Oqsil sintezi", ["Fotosintez", "DNK replikatsiyasi", "Glikoliz"]],
    ["Hujayradagi universal energiya manbai molekulasi?", "ATF", ["DNK", "RNK", "Gemoglobin"]],
    ["DNKda nechta asosiy azotli asos bor?", 4],
  ])],
  // 11
  [F([
    ["Mendelning 1-qonuni: F₁ duragaylar qanday bo'ladi?", "Bir xil", ["Har xil", "Faqat retsessiv", "Faqat steril"]],
    ["Monoduragay chatishtirishda F₂ da fenotip bo'yicha nisbat?", "3:1", ["1:1", "9:3:3:1", "1:2:1"]],
    ["Diduragay chatishtirishda F₂ da fenotip nisbati?", "9:3:3:1", ["3:1", "1:1", "1:2:1"]],
    ["Gemofiliya geni qanday irsiylanadi?", "X-xromosomaga birikkan", ["Autosoma dominant", "Y-xromosomaga birikkan", "Sitoplazmatik"]],
    ["Biosfera haqidagi ta'limot muallifi?", "V.I. Vernadskiy", ["Charlz Darvin", "Gregor Mendel", "Lui Paster"]],
    ["Odam genomida taxminan nechta xromosoma juftligi bor?", 23],
  ])],
]);
 
// ============================== KIMYO ==============================
const SUBS = [["H₂O", 18], ["CO₂", 44], ["O₂", 32], ["H₂", 2], ["CH₄", 16], ["NaOH", 40], ["CaCO₃", 100], ["H₂SO₄", 98]];
 
const kimyo_G = ([
  // 1
  [F([
    ["Muz qaysi agregat holatda?", "Qattiq", ["Suyuq", "Gaz", "Eriydi"]],
    ["Suv qaysi agregat holatda?", "Suyuq", ["Qattiq", "Gaz", "Eriydi"]],
    ["Bug' qaysi agregat holatda?", "Gaz", ["Qattiq", "Suyuq", "Eriydi"]],
    ["Shakar suvga solinsa nima bo'ladi?", "Eriydi", ["Qotadi", "Yonadi", "Uchadi"]],
  ])],
  // 2
  [F([
    ["Suv necha °C da qaynaydi?", 100],
    ["Suv necha °C da muzlaydi?", 0],
    ["Osh tuzi qanday ta'mga ega?", "Sho'r", ["Shirin", "Nordon", "Achchiq"]],
    ["Shakar qanday ta'mga ega?", "Shirin", ["Sho'r", "Nordon", "Achchiq"]],
    ["Limon qanday ta'mga ega?", "Nordon", ["Shirin", "Sho'r", "Achchiq"]],
  ])],
  // 3
  [F([
    ["Havoning eng ko'p qismini qaysi gaz tashkil etadi?", "Azot", ["Kislorod", "Karbonat angidrid", "Vodorod"]],
    ["Nafas olish uchun zarur gaz?", "Kislorod", ["Azot", "Karbonat angidrid", "Vodorod"]],
    ["Olovni o'chirishda ishlatiladigan gaz?", "Karbonat angidrid", ["Kislorod", "Vodorod", "Metan"]],
    ["Suvning formulasi?", "H₂O", ["CO₂", "NaCl", "O₂"]],
  ])],
  // 4
  [F([
    ["Oddiy sharoitda suyuq holatdagi metall?", "Simob", ["Temir", "Mis", "Alyuminiy"]],
    ["Eng yengil gaz?", "Vodorod", ["Kislorod", "Azot", "Geliy"]],
    ["Temirning zanglashi uchun nima kerak?", "Namlik va kislorod", ["Faqat sovuq", "Faqat yorug'lik", "Faqat vodorod"]],
    ["Qaysi metall elektr tokini yaxshi o'tkazadi?", "Mis", ["Rezina", "Shisha", "Yog'och"]],
  ])],
  // 5
  [F([
    ["Tuzli suvdan tuzni ajratish usuli?", "Bug'latish", ["Filtrlash", "Magnit yordamida", "Elash"]],
    ["Qum va suvni ajratish usuli?", "Filtrlash", ["Bug'latish", "Magnit yordamida", "Elash"]],
    ["Temir qirindisi va qum aralashmasini ajratish usuli?", "Magnit yordamida", ["Bug'latish", "Filtrlash", "Eritish"]],
    ["Toza modda necha turdagi zarrachadan iborat?", "Bir xil", ["Har xil", "Faqat gaz", "Faqat tuz"]],
  ])],
  // 6
  [F([
    ["Kimyoviy elementlar soni taxminan nechta?", 118],
    ["Osh tuzining formulasi?", "NaCl", ["H₂O", "CO₂", "O₂"]],
    ["Karbonat angidrid formulasi?", "CO₂", ["H₂O", "NaCl", "O₂"]],
    ["Kislorod molekulasining formulasi?", "O₂", ["H₂O", "NaCl", "CO₂"]],
    ["Oltinning kimyoviy belgisi?", "Au", ["Ag", "Fe", "Cu"]],
  ])],
  // 7
  [F([
    ["Vodorodning kimyoviy belgisi?", "H", ["He", "O", "N"]],
    ["Temirning kimyoviy belgisi?", "Fe", ["F", "Ti", "Cu"]],
    ["Natriyning kimyoviy belgisi?", "Na", ["N", "K", "Ne"]],
    ["Kaliyning kimyoviy belgisi?", "K", ["Ca", "Na", "Kr"]],
    ["Misning kimyoviy belgisi?", "Cu", ["C", "Co", "Cr"]],
    ["Kumushning kimyoviy belgisi?", "Ag", ["Au", "Al", "Ar"]],
    ["Uglerodning kimyoviy belgisi?", "C", ["Ca", "Cu", "Cl"]],
  ])],
  // 8
  [
    E(() => { const [f, M] = pick(SUBS), n = rnd(1, 10); return [`${n} mol ${f} ning massasi necha gramm? (M = ${M} g/mol)`, n * M]; }),
    E(() => { const [f, M] = pick(SUBS), n = rnd(1, 10); return [`${n * M} g ${f} necha mol? (M = ${M} g/mol)`, n]; }),
    F([
      ["Atom yadrosidagi musbat zarracha?", "Proton", ["Elektron", "Neytron", "Foton"]],
      ["Atomdagi manfiy zarracha?", "Elektron", ["Proton", "Neytron", "Foton"]],
    ]),
  ],
  // 9
  [
    E(() => { const m = rnd(1, 10) * 100, w = pick([5, 10, 15, 20, 25]); return [`${m} g eritmada ${w}% tuz bor. Tuz massasi (g)?`, (m * w) / 100]; }),
    E(() => { const ms = rnd(5, 40); return [`${ms} g tuz ${100 - ms} g suvda eritildi. Tuzning massa ulushi (%)?`, ms]; }),
    E(() => { const c = rnd(1, 6), V = rnd(1, 5); return [`${c * V} mol modda ${V} L eritmada erigan. Molyar konsentratsiya (mol/L)?`, c]; }),
  ],
  // 10
  [
    E(() => { const n = rnd(1, 15); return [`Alkan CₙH₂ₙ₊₂ da n = ${n}. Vodorod atomlari soni?`, 2 * n + 2]; }),
    E(() => { const n = rnd(2, 15); return [`Alkan CₙH₂ₙ₊₂ da n = ${n}. C–C bog'lar soni?`, n - 1]; }),
    E(() => { const n = rnd(1, 12); return [`Alkan CₙH₂ₙ₊₂ da n = ${n}. Jami atomlar soni?`, 3 * n + 2]; }),
  ],
  // 11
  [
    E(() => { const n = 5 * rnd(1, 8); return [`${n} mol gaz normal sharoitda necha litr hajm egallaydi? (Vm = 22,4 L/mol)`, Math.round(n * 22.4)]; }),
    E(() => { const k = rnd(1, 13); return [`[H⁺] = 10⁻${k} mol/L bo'lsa, pH = ?`, k]; }),
    E(() => { const c = rnd(1, 6), V = rnd(2, 8); return [`${c * V} mol modda ${V} L eritmada. Molyar konsentratsiya (mol/L)?`, c]; }),
  ],
]);
 
// ============================== INGLIZ TILI ==============================
const inglizTili_G = ([
  // 1
  [F([
    ["'Cat' so'zining tarjimasi?", "Mushuk", ["It", "Ot", "Qush"]],
    ["'Dog' so'zining tarjimasi?", "It", ["Mushuk", "Ot", "Qush"]],
    ["'Apple' so'zining tarjimasi?", "Olma", ["Nok", "Uzum", "Anor"]],
    ["'Book' so'zining tarjimasi?", "Kitob", ["Qalam", "Daftar", "Stol"]],
    ["'Red' so'zining tarjimasi?", "Qizil", ["Ko'k", "Sariq", "Yashil"]],
    ["'Water' so'zining tarjimasi?", "Suv", ["Sut", "Non", "Choy"]],
    ["'Mother' so'zining tarjimasi?", "Ona", ["Ota", "Aka", "Opa"]],
    ["'Father' so'zining tarjimasi?", "Ota", ["Ona", "Aka", "Opa"]],
  ])],
  // 2
  [F([
    ["'Blue' so'zining tarjimasi?", "Ko'k", ["Qizil", "Sariq", "Qora"]],
    ["'Green' so'zining tarjimasi?", "Yashil", ["Ko'k", "Sariq", "Qora"]],
    ["'Yellow' so'zining tarjimasi?", "Sariq", ["Qizil", "Yashil", "Qora"]],
    ["'Black' so'zining tarjimasi?", "Qora", ["Oq", "Ko'k", "Sariq"]],
    ["'Seven' raqamda nechchi?", 7],
    ["'Ten' raqamda nechchi?", 10],
    ["'Three' raqamda nechchi?", 3],
  ])],
  // 3
  [F([
    ["I ___ a pupil.", "am", ["is", "are", "be"]],
    ["She ___ my sister.", "is", ["am", "are", "be"]],
    ["They ___ friends.", "are", ["am", "is", "be"]],
    ["He ___ a teacher.", "is", ["am", "are", "be"]],
    ["We ___ in the classroom.", "are", ["am", "is", "be"]],
    ["It ___ a cat.", "is", ["am", "are", "be"]],
  ])],
  // 4
  [F([
    ["One book, two ___.", "books", ["bookes", "book", "bookies"]],
    ["One child, two ___.", "children", ["childs", "childes", "childrens"]],
    ["One man, two ___.", "men", ["mans", "mens", "man"]],
    ["___ apple (a / an)", "an", ["a", "the", "–"]],
    ["___ dog (a / an)", "a", ["an", "the", "–"]],
    ["This is ___ umbrella.", "an", ["a", "the", "–"]],
  ])],
  // 5
  [F([
    ["She ___ to school every day.", "goes", ["go", "going", "gone"]],
    ["He ___ football now.", "is playing", ["plays", "play", "played"]],
    ["They ___ TV every evening.", "watch", ["watches", "watching", "watched"]],
    ["I ___ my homework now.", "am doing", ["do", "does", "did"]],
    ["Past tense of 'play'?", "played", ["plaied", "plays", "playing"]],
    ["Opposite of 'big'?", "small", ["tall", "long", "fat"]],
  ])],
  // 6
  [F([
    ["Past tense of 'go'?", "went", ["goed", "gone", "going"]],
    ["Past tense of 'eat'?", "ate", ["eated", "eaten", "eats"]],
    ["Past tense of 'see'?", "saw", ["seed", "seen", "sees"]],
    ["Past tense of 'buy'?", "bought", ["buyed", "boughten", "buys"]],
    ["Past tense of 'take'?", "took", ["taked", "taken", "takes"]],
    ["Past tense of 'write'?", "wrote", ["writed", "written", "writes"]],
  ])],
  // 7
  [F([
    ["Big – ___ – the biggest", "bigger", ["more big", "biger", "biggest"]],
    ["Good – ___ – the best", "better", ["gooder", "more good", "best"]],
    ["Beautiful – ___ – the most beautiful", "more beautiful", ["beautifuler", "most beautiful", "beautifuller"]],
    ["Bad – ___ – the worst", "worse", ["badder", "more bad", "worst"]],
    ["Tall – taller – ___", "the tallest", ["most tall", "the taller", "tallest of"]],
    ["There aren't ___ apples.", "many", ["much", "a little", "an"]],
  ])],
  // 8
  [F([
    ["I ___ already finished my homework.", "have", ["has", "had", "am"]],
    ["She ___ lived here since 2010.", "has", ["have", "had", "is"]],
    ["I think it ___ rain tomorrow.", "will", ["did", "has", "was"]],
    ["If it rains, we ___ stay at home.", "will", ["would", "did", "are"]],
    ["He ___ never been to London.", "has", ["have", "had", "did"]],
  ])],
  // 9
  [F([
    ["The book ___ by Tom. (write, Past Passive)", "was written", ["wrote", "is wrote", "has write"]],
    ["English ___ all over the world.", "is spoken", ["speaks", "is speak", "speaked"]],
    ["If I ___ rich, I would travel.", "were", ["am", "will be", "have been"]],
    ["She said she ___ tired.", "was", ["is", "will be", "has been"]],
    ["I wish I ___ more time.", "had", ["have", "has", "will have"]],
  ])],
  // 10
  [F([
    ["You ___ smoke here. It's forbidden.", "mustn't", ["needn't", "don't have to", "may"]],
    ["By next year I ___ graduated.", "will have", ["would", "have", "am"]],
    ["He suggested ___ to the cinema.", "going", ["to go", "go", "went"]],
    ["I'm used to ___ up early.", "getting", ["get", "got", "to get"]],
    ["Neither of them ___ here.", "is", ["are", "were", "be"]],
  ])],
  // 11
  [F([
    ["Hardly had he arrived ___ it started to rain.", "when", ["than", "then", "as"]],
    ["No sooner had she left ___ he called.", "than", ["when", "then", "that"]],
    ["Not only ___ smart, but also kind.", "is she", ["she is", "does she", "she does"]],
    ["The more you practise, ___ you become.", "the better", ["better", "best", "the best"]],
    ["I'd rather you ___ me tomorrow.", "called", ["call", "will call", "calling"]],
    ["He denied ___ the window.", "breaking", ["to break", "break", "broke"]],
  ])],
]);
 
// ============================== TARIX ==============================
const tarix_G = ([
  // 1
  [F([
    ["O'zbekiston poytaxti qaysi shahar?", "Toshkent", ["Samarqand", "Buxoro", "Xiva"]],
    ["Mustaqillik kuni qachon nishonlanadi?", "1-sentabr", ["1-may", "8-dekabr", "21-mart"]],
    ["Navro'z qaysi faslda nishonlanadi?", "Bahor", ["Yoz", "Kuz", "Qish"]],
    ["Vatanimiz nomi nima?", "O'zbekiston", ["Qozog'iston", "Qirg'iziston", "Turkmaniston"]],
    ["Konstitutsiya kuni qachon nishonlanadi?", "8-dekabr", ["1-sentabr", "1-may", "21-mart"]],
  ])],
  // 2
  [F([
    ["Amir Temur qaysi shaharda tug'ilgan?", "Kesh (Shahrisabz)", ["Samarqand", "Buxoro", "Toshkent"]],
    ["Amir Temur davlatining poytaxti?", "Samarqand", ["Toshkent", "Buxoro", "Xiva"]],
    ["Mirzo Ulug'bek kim bo'lgan?", "Astronom olim", ["Savdogar", "Rassom", "Haykaltarosh"]],
    ["Alisher Navoiy kim bo'lgan?", "Shoir va mutafakkir", ["Savdogar", "Rassom", "Kosmonavt"]],
    ["Al-Xorazmiy qaysi fan asoschilaridan?", "Algebra", ["Kimyo", "Biologiya", "Geografiya"]],
  ])],
  // 3
  [F([
    ["Buyuk Ipak yo'li nimani bog'lagan?", "Sharq va G'arbni", ["Shimol va Janubni", "Faqat Xitoyni", "Faqat dengizlarni"]],
    ["Ipak yo'li orqali Xitoydan nima keltirilgan?", "Ipak", ["Neft", "Gaz", "Plastmassa"]],
    ["Registon maydoni qaysi shaharda?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"]],
    ["Ichan qal'a qaysi shaharda?", "Xiva", ["Samarqand", "Buxoro", "Toshkent"]],
    ["Ark qal'asi qaysi shaharda?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"]],
  ])],
  // 4
  [F([
    ["Amir Temur tug'ilgan yil?", 1336],
    ["O'zbekiston mustaqillikka erishgan yil?", 1991],
    ["'Boburnoma' muallifi?", "Zahiriddin Muhammad Bobur", ["Alisher Navoiy", "Amir Temur", "Mirzo Ulug'bek"]],
    ["Temuriylar davlatining asoschisi?", "Amir Temur", ["Mirzo Ulug'bek", "Bobur", "Navoiy"]],
    ["Ulug'bek rasadxonasi qaysi shaharda qurilgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"]],
  ])],
  // 5
  [F([
    ["Qadimgi Misrda hukmdor qanday atalgan?", "Fir'avn", ["Imperator", "Sulton", "Amir"]],
    ["Qadimgi Misr qaysi daryo bo'yida joylashgan?", "Nil", ["Dajla", "Amudaryo", "Volga"]],
    ["Olimpiya o'yinlari qaysi mamlakatda boshlangan?", "Qadimgi Yunoniston", ["Qadimgi Misr", "Qadimgi Xitoy", "Qadimgi Hindiston"]],
    ["Qadimgi Rim davlatining poytaxti?", "Rim", ["Afina", "Karfagen", "Sparta"]],
  ])],
  // 6
  [F([
    ["G'arbiy Rim imperiyasi qaysi yilda qulagan?", 476],
    ["Xorazmshohlar davlatiga Chingizxon hujumi qaysi yilda boshlangan?", 1219],
    ["Jaloliddin Manguberdi qaysi davlat hukmdori edi?", "Xorazmshohlar", ["Temuriylar", "Somoniylar", "Qoraxoniylar"]],
    ["Somoniylar davlatining poytaxti?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"]],
    ["Buyuk Xitoy devori qaysi davlatda joylashgan?", "Xitoy", ["Hindiston", "Eron", "Mo'g'uliston"]],
  ])],
  // 7
  [F([
    ["Amir Temur vafot etgan yil?", 1405],
    ["Mirzo Ulug'bek vafot etgan yil?", 1449],
    ["Kolumb Amerikani qaysi yili kashf etgan?", 1492],
    ["Bobur Panipat jangida g'alaba qozongan yil?", 1526],
    ["Bobur Hindistonda qaysi davlatga asos solgan?", "Boburiylar davlati", ["Temuriylar davlati", "Usmoniylar davlati", "Safaviylar davlati"]],
  ])],
  // 8
  [F([
    ["Birinchi jahon urushi boshlangan yil?", 1914],
    ["Birinchi jahon urushi tugagan yil?", 1918],
    ["Fransuz inqilobi boshlangan yil?", 1789],
    ["Rossiya imperiyasi Toshkentni egallagan yil?", 1865],
    ["O'zbekiston SSR tuzilgan yil?", 1924],
  ])],
  // 9
  [F([
    ["Ikkinchi jahon urushi boshlangan yil?", 1939],
    ["Ikkinchi jahon urushi tugagan yil?", 1945],
    ["BMT tashkil topgan yil?", 1945],
    ["SSSR tarqalgan yil?", 1991],
    ["Jadidchilik harakati vakillaridan biri?", "Mahmudxo'ja Behbudiy", ["Amir Temur", "Alisher Navoiy", "Bobur"]],
    ["O'zbekiston mustaqilligi e'lon qilingan sana?", "1991-yil 31-avgust", ["1991-yil 1-sentabr", "1992-yil 8-dekabr", "1990-yil 20-iyun"]],
  ])],
  // 10
  [F([
    ["O'zbekiston Konstitutsiyasi qabul qilingan yil?", 1992],
    ["O'zbekistonda milliy valyuta (so'm) joriy etilgan yil?", 1994],
    ["O'zbekistonning birinchi Prezidenti kim?", "Islom Karimov", ["Shavkat Mirziyoyev", "Abdulla Oripov", "Rustam Azimov"]],
    ["O'zbekistonning ikkinchi Prezidenti kim?", "Shavkat Mirziyoyev", ["Islom Karimov", "Abdulla Oripov", "Rustam Azimov"]],
    ["O'zbekiston BMTga a'zo bo'lgan yil?", 1992],
  ])],
  // 11
  [F([
    ["Sovuq urush asosan qaysi ikki davlat o'rtasida bo'lgan?", "AQSh va SSSR", ["Xitoy va Hindiston", "Angliya va Fransiya", "Yaponiya va Koreya"]],
    ["Berlin devori qaysi yilda qulagan?", 1989],
    ["Yuriy Gagarin kosmosga uchgan yil?", 1961],
    ["Kosmosga uchgan birinchi inson?", "Yuriy Gagarin", ["Neyl Armstrong", "German Titov", "Aleksey Leonov"]],
    ["Yevropa Ittifoqi Maastrixt shartnomasi asosida tuzilgan yil?", 1993],
  ])],
]);
 
// ============================== INFORMATIKA ==============================
const informatika_G = ([
  // 1
  [F([
    ["Monitor nima uchun kerak?", "Tasvir ko'rsatish", ["Ovoz chiqarish", "Matn bosish", "Ma'lumot kiritish"]],
    ["Sichqoncha qanday qurilma?", "Kiritish qurilmasi", ["Chiqarish qurilmasi", "Xotira", "Dastur"]],
    ["Klaviatura vazifasi?", "Matn kiritish", ["Chop etish", "Tasvir chiqarish", "Ovoz yozish"]],
    ["Printer nima qiladi?", "Qog'ozga chop etadi", ["Ovoz yozadi", "Video ko'rsatadi", "Internetga ulaydi"]],
    ["Quloqchin nima uchun?", "Ovoz eshitish", ["Matn yozish", "Rasm chizish", "Chop etish"]],
  ])],
  // 2
  [F([
    ["Papka (jild) nima uchun ishlatiladi?", "Fayllarni tartiblash", ["Rasm chizish", "Ovoz yozish", "Internetga ulanish"]],
    ["Ctrl + C nima qiladi?", "Nusxa oladi", ["Qo'yadi", "Kesadi", "O'chiradi"]],
    ["Ctrl + V nima qiladi?", "Qo'yadi", ["Nusxa oladi", "Kesadi", "Saqlaydi"]],
    ["Ctrl + Z nima qiladi?", "Amalni bekor qiladi", ["Saqlaydi", "Chop etadi", "Yopadi"]],
    ["Ctrl + S nima qiladi?", "Saqlaydi", ["Ochadi", "Chop etadi", "Yopadi"]],
  ])],
  // 3
  [F([
    ["Paint dasturi nima uchun?", "Rasm chizish", ["Matn yozish", "Hisob-kitob", "Video ko'rish"]],
    ["Word dasturi nima uchun?", "Matn yozish va tahrirlash", ["Rasm chizish", "Musiqa tinglash", "O'yin o'ynash"]],
    ["Internet orqali xat yuborish xizmati?", "Elektron pochta", ["Kalkulyator", "Paint", "Printer"]],
    ["Brauzer misoli qaysi?", "Chrome", ["Word", "Excel", "Paint"]],
    ["Qidiruv tizimi misoli qaysi?", "Google", ["Word", "Paint", "Windows"]],
  ])],
  // 4
  [F([
    ["1 bayt necha bit?", 8],
    ["1 KB necha bayt?", 1024],
    ["1 MB necha KB?", 1024],
    ["Kompyuterning 'miyasi' qaysi qurilma?", "Protsessor", ["Monitor", "Klaviatura", "Printer"]],
    ["Operativ xotira qisqartmasi?", "RAM", ["ROM", "CPU", "SSD"]],
    ["Excel nima?", "Jadval protsessori", ["Matn muharriri", "Brauzer", "Antivirus"]],
  ])],
  // 5
  [F([
    ["Algoritm nima?", "Amallar ketma-ketligi", ["Dasturlash tili", "Kompyuter turi", "Qurilma nomi"]],
    ["Blok-sxemada romb nimani bildiradi?", "Shart (tekshirish)", ["Boshlanish", "Oddiy amal", "Chiqarish"]],
    ["Scratch nima?", "Vizual dasturlash muhiti", ["Brauzer", "Antivirus", "Jadval protsessori"]],
    ["Ikkilik sanoq tizimida nechta raqam ishlatiladi?", 2],
    ["Ikkilik 101 sonining o'nlik qiymati?", 5],
  ])],
  // 6
  [
    E(() => { const n = rnd(1, 31); return [`${n.toString(2)} (ikkilik) soni o'nlik tizimda nechaga teng?`, n]; }),
    F([
      [".docx kengaytmali fayl qaysi dasturniki?", "Word", ["Excel", "Paint", "PowerPoint"]],
      ["Slayd tayyorlash dasturi?", "PowerPoint", ["Word", "Excel", "Paint"]],
      ["Excelda katak manzili misoli?", "B3", ["3B", "BB", "3-3"]],
    ]),
  ],
  // 7
  [
    () => {
      const n = rnd(4, 63);
      const a = n.toString(2);
      const w = [n + 1, n - 1, n + 2].map((x) => x.toString(2));
      return { question: `O'nlik ${n} sonining ikkilik yozuvi?`, options: shuffle([a, ...w]), answer: a };
    },
    F([
      ["Python qanday til?", "Dasturlash tili", ["Belgilash tili", "Operatsion tizim", "Brauzer"]],
      ["HTML nima?", "Belgilash tili", ["Dasturlash tili", "Operatsion tizim", "Antivirus"]],
      ["CSS nima uchun ishlatiladi?", "Sahifa dizayni uchun", ["Ma'lumotlar bazasi uchun", "Virusni topish uchun", "Ovoz yozish uchun"]],
      ["IP-manzil nima?", "Qurilmaning tarmoqdagi manzili", ["Fayl nomi", "Dastur turi", "Parol"]],
    ]),
  ],
  // 8
  [
    E(() => { const a = rnd(1, 9), b = rnd(2, 9), c = rnd(2, 9); return [`Python: print(${a} + ${b} * ${c}) natijasi?`, a + b * c]; }),
    E(() => { const a = rnd(10, 99), b = rnd(2, 9); return [`Python: print(${a} % ${b}) natijasi?`, a % b]; }),
    E(() => { const a = rnd(10, 99), b = rnd(2, 9); return [`Python: print(${a} // ${b}) natijasi?`, Math.floor(a / b)]; }),
    E(() => { const n = rnd(3, 20); return [`1 dan ${n} gacha bo'lgan natural sonlar yig'indisi?`, (n * (n + 1)) / 2]; }),
    F([["Python'da ro'yxat (list) qaysi qavs bilan yoziladi?", "[ ]", ["{ }", "( )", "< >"]]]),
  ],
  // 9
  [
    E(() => { const k = rnd(2, 50); return [`${k} bayt necha bit?`, k * 8]; }),
    E(() => { const k = rnd(2, 20); return [`${k} KB necha bayt?`, k * 1024]; }),
    F([
      ["Ma'lumotlar bazasidagi satr nima deb ataladi?", "Yozuv", ["Maydon", "Jadval", "Kalit"]],
      ["SQL nima?", "So'rovlar tili", ["Brauzer", "Antivirus", "Operatsion tizim"]],
      ["Excelda yig'indini hisoblovchi funksiya?", "SUM", ["COUNT", "AVERAGE", "MAX"]],
      ["Excelda o'rtacha qiymat funksiyasi?", "AVERAGE", ["SUM", "MAX", "IF"]],
    ]),
  ],
  // 10
  [
    E(() => { const n = rnd(10, 255); return [`${n.toString(16).toUpperCase()} (16 lik) soni o'nlik tizimda nechaga teng?`, n]; }),
    F([
      ["HTTP protokolining standart porti?", 80],
      ["HTTPS protokolining standart porti?", 443],
      ["IPv4 manzil necha bitdan iborat?", 32],
      ["IPv6 manzil necha bitdan iborat?", 128],
      ["DNS vazifasi nima?", "Domen nomini IP-manzilga aylantirish", ["Fayllarni siqish", "Virus topish", "Rasm tahrirlash"]],
    ]),
  ],
  // 11
  [
    E(() => { const n = rnd(3, 7); return [`${n}! (faktorial) = ?`, fact(n)]; }),
    F([
      ["Binary search (ikkilik qidiruv) murakkabligi?", "O(log n)", ["O(n)", "O(n²)", "O(1)"]],
      ["Bubble sort murakkabligi?", "O(n²)", ["O(n)", "O(log n)", "O(1)"]],
      ["Rekursiya nima?", "Funksiyaning o'zini chaqirishi", ["Siklning to'xtashi", "Faylni siqish", "Xatoni yashirish"]],
      ["OOP ning asosiy tamoyillaridan biri?", "Inkapsulyatsiya", ["Rekursiya", "Kompilyatsiya", "Formatlash"]],
      ["Stack qaysi tamoyil bo'yicha ishlaydi?", "LIFO", ["FIFO", "LILO", "Tasodifiy"]],
      ["Queue (navbat) qaysi tamoyil bo'yicha ishlaydi?", "FIFO", ["LIFO", "LILO", "Tasodifiy"]],
    ]),
  ],
]);
 
// ============================== ONA TILI ==============================
const onatili_G = ([
  // 1
  [F([
    ["O'zbek lotin alifbosida nechta harf bor?", 29],
    ["Alifbodagi unli harflar soni?", 6],
    ["'Maktab' so'zida nechta bo'g'in bor?", 2],
    ["'Qaldirg'och' so'zida nechta bo'g'in bor?", 3],
    ["'Kitobxona' so'zida nechta bo'g'in bor?", 4],
    ["'Olma' so'zida nechta bo'g'in bor?", 2],
  ])],
  // 2
  [F([
    ["Ot qaysi savolga javob bo'ladi?", "Kim? Nima?", ["Qanday?", "Nima qildi?", "Qancha?"]],
    ["Sifat qaysi savolga javob bo'ladi?", "Qanday?", ["Kim?", "Nima qildi?", "Qancha?"]],
    ["Fe'l qaysi savolga javob bo'ladi?", "Nima qildi?", ["Kim?", "Qanday?", "Qancha?"]],
    ["Son qaysi savolga javob bo'ladi?", "Qancha?", ["Kim?", "Qanday?", "Nima qildi?"]],
    ["'Qizil' qaysi so'z turkumi?", "Sifat", ["Ot", "Fe'l", "Son"]],
    ["'Yozdi' qaysi so'z turkumi?", "Fe'l", ["Ot", "Sifat", "Son"]],
  ])],
  // 3
  [F([
    ["'Katta' so'zining zid ma'nosi?", "Kichik", ["Baland", "Uzun", "Keng"]],
    ["'Yaxshi' so'zining zid ma'nosi?", "Yomon", ["Chiroyli", "Katta", "Tez"]],
    ["'Issiq' so'zining zid ma'nosi?", "Sovuq", ["Iliq", "Qaynoq", "Shirin"]],
    ["'Kun' so'zining zid ma'nosi?", "Tun", ["Tong", "Kech", "Oy"]],
    ["Darak gap oxiriga qanday belgi qo'yiladi?", "Nuqta", ["Vergul", "Tire", "Qo'shtirnoq"]],
    ["So'roq gap oxiriga qanday belgi qo'yiladi?", "So'roq belgisi", ["Nuqta", "Vergul", "Undov belgisi"]],
  ])],
  // 4
  [F([
    ["Otning kelishiklari soni nechta?", 6],
    ["Qaratqich kelishigi qaysi savolga javob beradi?", "Kimning? Nimaning?", ["Kimni? Nimani?", "Kimga? Nimaga?", "Kimda? Nimada?"]],
    ["Tushum kelishigi qaysi savolga javob beradi?", "Kimni? Nimani?", ["Kimning? Nimaning?", "Kimga? Nimaga?", "Kimda? Nimada?"]],
    ["Jo'nalish kelishigi qaysi savolga javob beradi?", "Kimga? Nimaga?", ["Kimni? Nimani?", "Kimdan? Nimadan?", "Kimda? Nimada?"]],
    ["O'rin-payt kelishigi qaysi savolga javob beradi?", "Kimda? Nimada?", ["Kimga? Nimaga?", "Kimdan? Nimadan?", "Kimni? Nimani?"]],
    ["Chiqish kelishigi qaysi savolga javob beradi?", "Kimdan? Nimadan?", ["Kimda? Nimada?", "Kimga? Nimaga?", "Kimni? Nimani?"]],
  ])],
  // 5
  [F([
    ["'Men' so'zi qaysi so'z turkumi?", "Olmosh", ["Ot", "Son", "Fe'l"]],
    ["'Besh' so'zi qaysi so'z turkumi?", "Son", ["Ot", "Olmosh", "Sifat"]],
    ["'Va' so'zi qaysi so'z turkumi?", "Bog'lovchi", ["Ko'makchi", "Yuklama", "Undov"]],
    ["'Uchun' so'zi qaysi so'z turkumi?", "Ko'makchi", ["Bog'lovchi", "Yuklama", "Undov"]],
    ["'Voy!' so'zi qaysi so'z turkumi?", "Undov", ["Ravish", "Bog'lovchi", "Olmosh"]],
  ])],
  // 6
  [F([
    ["Fe'l zamonlari nechta asosiy turga bo'linadi?", 3],
    ["'Bordi' fe'li qaysi zamonda?", "O'tgan zamon", ["Hozirgi zamon", "Kelasi zamon", "Buyruq mayli"]],
    ["'O'qiyapti' fe'li qaysi zamonda?", "Hozirgi zamon", ["O'tgan zamon", "Kelasi zamon", "Buyruq mayli"]],
    ["Gapning bosh bo'laklari: ega va ___", "kesim", ["to'ldiruvchi", "aniqlovchi", "hol"]],
    ["Ega qaysi savolga javob beradi?", "Kim? Nima?", ["Nima qildi?", "Qanday?", "Qachon?"]],
  ])],
  // 7
  [F([
    ["Ikkinchi darajali bo'laklar nechta (aniqlovchi, to'ldiruvchi, hol)?", 3],
    ["Aniqlovchi qaysi savollarga javob beradi?", "Qanday? Qaysi? Qancha?", ["Kimni? Nimani?", "Qachon? Qayerda?", "Nima qildi?"]],
    ["To'ldiruvchi qaysi savollarga javob beradi?", "Kimni? Nimani? Kimga?", ["Qanday?", "Qachon?", "Nima qildi?"]],
    ["Hol qaysi savollarga javob beradi?", "Qachon? Qayerda? Qanday?", ["Kim?", "Nima?", "Kimning?"]],
    ["Sodda gapda nechta asosiy kesim bo'ladi?", 1],
  ])],
  // 8
  [F([
    ["Qaysi so'z zidlov bog'lovchisi?", "lekin", ["va", "hamda", "yoki"]],
    ["Qaysi so'z biriktiruv bog'lovchisi?", "va", ["lekin", "ammo", "yoki"]],
    ["Qaysi so'z ayiruv bog'lovchisi?", "yoki", ["va", "lekin", "hamda"]],
    ["Undalma gapda qanday ajratiladi?", "Vergul bilan", ["Nuqta bilan", "Tire bilan", "Ikki nuqta bilan"]],
    ["Qo'shma gap qismlarida kamida nechta kesim bo'ladi?", 2],
  ])],
  // 9
  [F([
    ["Fonetika nimani o'rganadi?", "Tovushlarni", ["So'zlarni", "Gaplarni", "Imloni"]],
    ["Leksikologiya nimani o'rganadi?", "So'z boyligini", ["Tovushlarni", "Gap tuzilishini", "Imloni"]],
    ["Morfologiya nimani o'rganadi?", "So'z turkumlarini", ["Tovushlarni", "Tinish belgilarini", "So'z boyligini"]],
    ["Sintaksis nimani o'rganadi?", "So'z birikmasi va gapni", ["Tovushlarni", "So'z yasalishini", "Imloni"]],
    ["Ko'chirma gap qaysi belgi ichida yoziladi?", "Qo'shtirnoq", ["Qavs", "Kvadrat qavs", "Tire"]],
  ])],
  // 10
  [F([
    ["Nutq uslublari (asosiy) nechta?", 5],
    ["Rasmiy uslub qaysi sohada qo'llaniladi?", "Hujjatlarda", ["Badiiy asarda", "Do'stona suhbatda", "Reklamada"]],
    ["Frazeologizm nima?", "Turg'un birikma", ["Yakka so'z", "Qo'shma gap", "Tovush"]],
    ["Antonim nima?", "Zid ma'noli so'z", ["Ma'nodosh so'z", "Shakldosh so'z", "Eskirgan so'z"]],
    ["Omonim nima?", "Shakldosh so'z", ["Ma'nodosh so'z", "Zid ma'noli so'z", "Yangi so'z"]],
    ["Sinonim nima?", "Ma'nodosh so'z", ["Zid ma'noli so'z", "Shakldosh so'z", "Yangi so'z"]],
  ])],
  // 11
  [F([
    ["O'zbek tili davlat tili deb e'lon qilingan yil?", 1989],
    ["Lotin yozuviga o'tish haqidagi qonun qabul qilingan yil?", 1993],
    ["O'zbek tili qaysi til oilasiga kiradi?", "Turkiy tillar", ["Hind-yevropa", "Slavyan", "German"]],
    ["1929-yilgacha o'zbek tili qaysi yozuvda yozilgan?", "Arab yozuvi", ["Kirill", "Lotin", "Yunon"]],
    ["O'zbek yozuvi kirill alifbosiga qaysi yilda o'tkazilgan?", 1940],
  ])],
]);
 
// ============================== ADABIYOT ==============================
const adabiyot_G = ([
  // 1
  [F([
    ["'Zumrad va Qimmat' qaysi janr?", "Ertak", ["She'r", "Maqol", "Topishmoq"]],
    ["'Mehnat – rohat kaliti' qaysi janr?", "Maqol", ["Ertak", "She'r", "Hikoya"]],
    ["Javobi yashirin savol-tasvir qaysi janr?", "Topishmoq", ["Maqol", "Ertak", "Doston"]],
    ["Qofiyali, ohangdor matn qaysi janr?", "She'r", ["Maqol", "Ertak", "Hikoya"]],
  ])],
  // 2
  [F([
    ["Alisher Navoiy kim bo'lgan?", "Shoir", ["Rassom", "Astronom", "Haykaltarosh"]],
    ["Abdulla Qodiriy kim bo'lgan?", "Yozuvchi", ["Rassom", "Astronom", "Haykaltarosh"]],
    ["Zahiriddin Muhammad Bobur kim bo'lgan?", "Shoir va hukmdor", ["Rassom", "Savdogar", "Tabib"]],
    ["Mirzo Ulug'bek kim bo'lgan?", "Olim va hukmdor", ["Rassom", "Savdogar", "Shoir"]],
  ])],
  // 3
  [F([
    ["'O'tkan kunlar' muallifi?", "Abdulla Qodiriy", ["Cho'lpon", "Oybek", "Abdulla Qahhor"]],
    ["'Xamsa' muallifi?", "Alisher Navoiy", ["Bobur", "Fuzuliy", "Mashrab"]],
    ["'Boburnoma' muallifi?", "Zahiriddin Muhammad Bobur", ["Alisher Navoiy", "Fuzuliy", "Cho'lpon"]],
    ["'Mehrobdan chayon' muallifi?", "Abdulla Qodiriy", ["Cho'lpon", "Oybek", "G'afur G'ulom"]],
    ["'Kecha va kunduz' muallifi?", "Cho'lpon", ["Abdulla Qodiriy", "Oybek", "G'afur G'ulom"]],
  ])],
  // 4
  [F([
    ["'Boburnoma' qaysi janrga kiradi?", "Memuar", ["Roman", "Doston", "Ertak"]],
    ["Hikoya qaysi adabiy turga kiradi?", "Epik", ["Lirik", "Dramatik", "Ilmiy"]],
    ["She'r qaysi adabiy turga kiradi?", "Lirik", ["Epik", "Dramatik", "Hujjatli"]],
    ["Drama qaysi adabiy turga kiradi?", "Dramatik", ["Lirik", "Epik", "Ilmiy"]],
    ["Navoiy asarlari asosan qaysi tilda yozilgan?", "Chig'atoy tili", ["Arab tili", "Fors tili", "Rus tili"]],
  ])],
  // 5
  [F([
    ["Tashbeh nima?", "O'xshatish", ["Mubolag'a", "Jonlantirish", "Qarama-qarshi qo'yish"]],
    ["Jonlantirish (tajassum) nima?", "Jonsiz narsaga jon bag'ishlash", ["O'xshatish", "Bo'rttirish", "Qofiya"]],
    ["Mubolag'a nima?", "Bo'rttirish", ["O'xshatish", "Jonlantirish", "Qofiya"]],
    ["Epitet nima?", "Ta'rif beruvchi so'z", ["O'xshatish", "Bo'rttirish", "Ishora"]],
  ])],
  // 6
  [F([
    ["'Sarob' asarining muallifi?", "Abdulla Qahhor", ["Oybek", "Cho'lpon", "Abdulla Qodiriy"]],
    ["'Qutlug' qon' muallifi?", "Oybek", ["Abdulla Qahhor", "Cho'lpon", "Abdulla Qodiriy"]],
    ["'Navoiy' romanining muallifi?", "Oybek", ["Abdulla Qahhor", "Cho'lpon", "G'afur G'ulom"]],
    ["'Dunyoning ishlari' muallifi?", "O'tkir Hoshimov", ["Oybek", "Abdulla Qahhor", "Cho'lpon"]],
    ["'Sinchalak' qaysi janrga kiradi?", "Qissa", ["She'r", "Doston", "Drama"]],
  ])],
  // 7
  [F([
    ["Navoiy 'Xamsa'si nechta dostondan iborat?", 5],
    ["'Layli va Majnun' (Navoiy) qaysi janrda?", "Doston", ["Roman", "Hikoya", "Drama"]],
    ["'Hayrat ul-abror' qaysi asar tarkibiga kiradi?", "Xamsa", ["Boburnoma", "Qutadg'u bilig", "Devonu lug'atit turk"]],
    ["'Muhokamat ul-lug'atayn' nimani solishtiradi?", "Turkiy va fors tillarini", ["Tarixni", "Tibbiyotni", "Falakiyotni"]],
    ["Navoiyning fors tilidagi taxallusi?", "Foniy", ["Hofiz", "Mashrab", "Bobur"]],
  ])],
  // 8
  [F([
    ["'O'tkan kunlar' qahramonlari kim?", "Otabek va Kumush", ["Layli va Majnun", "Farhod va Shirin", "Tohir va Zuhra"]],
    ["'Farhod va Shirin' muallifi?", "Alisher Navoiy", ["Abdulla Qodiriy", "Cho'lpon", "Oybek"]],
    ["Cho'lponning mashhur romani?", "Kecha va kunduz", ["O'tkan kunlar", "Sarob", "Qutlug' qon"]],
    ["Hamid Olimjon dostoni?", "Oygul bilan Baxtiyor", ["Layli va Majnun", "Sab'ai sayyor", "Boburnoma"]],
  ])],
  // 9
  [F([
    ["Realizm nima?", "Hayotni haqqoniy aks ettirish", ["Faqat bo'rttirish", "Faqat fantaziya", "Faqat tarixiy dalil"]],
    ["Romantizm nimani ulug'laydi?", "Ideal va his-tuyg'ularni", ["Faqat dalillarni", "Faqat raqamlarni", "Faqat qonunlarni"]],
    ["Jadid adabiyoti vakillaridan biri?", "Abdulla Avloniy", ["Alisher Navoiy", "Mashrab", "Fuzuliy"]],
    ["'Turkiy guliston yohud axloq' muallifi?", "Abdulla Avloniy", ["Cho'lpon", "Fitrat", "Behbudiy"]],
    ["'Padarkush' dramasi muallifi?", "Mahmudxo'ja Behbudiy", ["Abdulla Avloniy", "Cho'lpon", "Fitrat"]],
  ])],
  // 10
  [F([
    ["Erkin Vohidov asarlari asosan qaysi janrda?", "She'riyat", ["Roman", "Drama", "Qissa"]],
    ["Hamzaning 'Boy ila xizmatchi' asari qaysi janrda?", "Drama", ["Roman", "Ertak", "Doston"]],
    ["O'tkir Hoshimovning 'Dunyoning ishlari' asari qaysi janrda?", "Qissa", ["She'r", "Drama", "Doston"]],
    ["Oybekning 'Navoiy' asari qaysi turga kiradi?", "Tarixiy roman", ["Ertak", "Lirika", "Komediya"]],
    ["Abdulla Oripov asarlari asosan qaysi janrda?", "She'riyat", ["Roman", "Drama", "Qissa"]],
  ])],
  // 11
  [F([
    ["O'zbek mumtoz adabiyotining asoschisi sifatida kim tan olingan?", "Alisher Navoiy", ["Bobur", "Mashrab", "Lutfiy"]],
    ["'Qutadg'u bilig' muallifi?", "Yusuf Xos Hojib", ["Mahmud Koshg'ariy", "Alisher Navoiy", "Ahmad Yugnakiy"]],
    ["'Devonu lug'atit turk' muallifi?", "Mahmud Koshg'ariy", ["Yusuf Xos Hojib", "Ahmad Yassaviy", "Alisher Navoiy"]],
    ["'Hikmat' asarlari muallifi?", "Ahmad Yassaviy", ["Mahmud Koshg'ariy", "Yusuf Xos Hojib", "Lutfiy"]],
    ["'Hibat ul-haqoyiq' muallifi?", "Ahmad Yugnakiy", ["Ahmad Yassaviy", "Mahmud Koshg'ariy", "Alisher Navoiy"]],
  ])],
]);
 
// ============================== HUQUQ ==============================
const huquq_G = ([
  // 1
  [F([
    ["Kattalarga qanday munosabatda bo'lish kerak?", "Hurmat bilan", ["Beparvo", "Qo'pol", "E'tiborsiz"]],
    ["Yo'lni qaysi chiroqda kesib o'tish mumkin?", "Yashil", ["Qizil", "Sariq", "Hech qaysida"]],
    ["Qizil chiroq nimani bildiradi?", "To'xta", ["O'tib ket", "Tezlash", "Kuta turma"]],
    ["Uzr so'rash qanday xulq?", "Odobli", ["Odobsiz", "Zararli", "Qo'pol"]],
    ["Qarzga olingan narsani nima qilish kerak?", "Qaytarish", ["Yo'qotish", "Berkitish", "Sotish"]],
  ])],
  // 2
  [F([
    ["Har bir bolaning ta'lim olish huquqi bormi?", "Ha", ["Yo'q", "Faqat o'g'il bolalarda", "Faqat boy oilalarda"]],
    ["Maktabga borish bola uchun nima?", "Huquq va burch", ["Faqat o'yin", "Jazo", "Tanlov emas"]],
    ["Birovning narsasini ruxsatsiz olish nima?", "Noto'g'ri ish", ["Yaxshi ish", "O'yin", "Odat"]],
    ["Qonunga rioya qilish kimning burchi?", "Hammaning", ["Faqat kattalarning", "Faqat bolalarning", "Faqat politsiyaning"]],
  ])],
  // 3
  [F([
    ["O'zbekiston davlat ramzlari soni nechta (bayroq, gerb, madhiya)?", 3],
    ["O'zbekiston davlat madhiyasi so'zlari muallifi?", "Abdulla Oripov", ["Erkin Vohidov", "Hamid Olimjon", "Oybek"]],
    ["O'zbekiston davlat madhiyasi musiqasi muallifi?", "Mutal Burhonov", ["Muhammad Yusuf", "Said Ahmad", "Abdulla Qodiriy"]],
    ["Davlat ramzlari nimani anglatadi?", "Davlat mustaqilligini", ["Sport turini", "Bayram taomini", "Maktab fanini"]],
  ])],
  // 4
  [F([
    ["O'zbekiston Konstitutsiyasi qachon qabul qilingan?", "1992-yil 8-dekabr", ["1991-yil 1-sentabr", "1993-yil 21-mart", "1994-yil 1-iyul"]],
    ["Konstitutsiya kuni qachon nishonlanadi?", "8-dekabr", ["1-sentabr", "21-mart", "9-may"]],
    ["Inson necha yoshgacha bola hisoblanadi?", 18],
    ["Qonunlarni kim qabul qiladi?", "Oliy Majlis", ["Sud", "Maktab", "Mahalla"]],
  ])],
  // 5
  [F([
    ["Davlatning asosiy qonuni qanday ataladi?", "Konstitutsiya", ["Kodeks", "Farmon", "Buyruq"]],
    ["O'zbekistonda pasport (ID-karta) necha yoshdan beriladi?", 16],
    ["Saylov huquqi necha yoshdan boshlanadi?", 18],
    ["Fuqarolik nima?", "Shaxsning davlat bilan huquqiy aloqasi", ["Faqat yashash joyi", "Ish haqi", "Maktab turi"]],
  ])],
  // 6
  [F([
    ["Davlat hokimiyati nechta tarmoqqa bo'linadi?", 3],
    ["Qonun chiqaruvchi hokimiyat qaysi?", "Oliy Majlis", ["Prezident", "Sud", "Hokimlik"]],
    ["Ijro etuvchi hokimiyat organi qaysi?", "Vazirlar Mahkamasi", ["Oliy Majlis", "Sud", "Parlament"]],
    ["Sud hokimiyatining vazifasi nima?", "Adolatni o'rnatish", ["Qonun yaratish", "Soliq yig'ish", "Saylov o'tkazish"]],
  ])],
  // 7
  [F([
    ["Qonunbuzarlik nima?", "Qonunga zid xatti-harakat", ["Qonunga muvofiq ish", "Bayram", "Sport turi"]],
    ["Mulk huquqi nimani anglatadi?", "Narsani egallash, foydalanish, tasarruf etish", ["Faqat ijaraga olish", "Faqat sotish", "Faqat meros qoldirish"]],
    ["Jinoyat uchun javobgarlik yoshi odatda necha?", 16],
    ["Ayrim og'ir jinoyatlar uchun javobgarlik yoshi necha?", 14],
  ])],
  // 8
  [F([
    ["Mehnat shartnomasining tomonlari kimlar?", "Ishchi va ish beruvchi", ["O'qituvchi va o'quvchi", "Sotuvchi va xaridor", "Shifokor va bemor"]],
    ["Mehnat kodeksi nimani tartibga soladi?", "Mehnat munosabatlarini", ["Jinoyatlarni", "Soliqlarni", "Oilaviy munosabatlarni"]],
    ["Oila kodeksi nimani tartibga soladi?", "Oila munosabatlarini", ["Mehnat munosabatlarini", "Jinoyatlarni", "Soliqlarni"]],
    ["Fuqarolik kodeksi nimani tartibga soladi?", "Mulkiy munosabatlarni", ["Jinoyatlarni", "Saylovlarni", "Harbiy xizmatni"]],
    ["Nikoh yoshi (erkak va ayol uchun) necha?", 18],
  ])],
  // 9
  [F([
    ["O'zbekiston Prezidenti necha yilga saylanadi?", 7],
    ["Oliy Majlis nechta palatadan iborat?", 2],
    ["Qonunchilik palatasi deputatlari soni nechta?", 150],
    ["Senat a'zolari soni nechta?", 100],
  ])],
  // 10
  [F([
    ["Inson huquqlari umumjahon deklaratsiyasi qabul qilingan yil?", 1948],
    ["BMT tashkil topgan yil?", 1945],
    ["Huquqiy davlatning asosiy belgisi?", "Qonun ustuvorligi", ["Bir kishi hokimiyati", "Cheksiz hokimiyat", "Qonunsizlik"]],
    ["Hokimiyatlar bo'linishi tamoyilini kim ilgari surgan?", "Sharl Monteske", ["Jan-Jak Russo", "Gregor Mendel", "Charlz Darvin"]],
    ["Jinoyat kodeksining vazifasi?", "Jinoyat va jazoni belgilash", ["Mehnatni tartiblash", "Oilani tartiblash", "Soliq undirish"]],
  ])],
  // 11
  [F([
    ["Prezident saylovida ovoz berish huquqi necha yoshdan?", 18],
    ["Referendum nima?", "Umumxalq ovoz berishi", ["Sud majlisi", "Parlament majlisi", "Matbuot anjumani"]],
    ["Xalqaro huquqning asosiy subyektlari?", "Davlatlar", ["Faqat shaxslar", "Faqat firmalar", "Faqat maktablar"]],
    ["Aybsizlik prezumpsiyasi nimani anglatadi?", "Isbotlanmaguncha aybsiz", ["Har kim aybdor", "Gumon = ayb", "Avval jazo"]],
    ["O'zbekiston Konstitutsiyasining yangi tahriri referendumda qabul qilingan yil?", 2023],
  ])],
]);
 
// ============================== SPORT ==============================
const sport_G = ([
  // 1
  [F([
    ["Futbolda bir jamoadan maydonda nechta o'yinchi bo'ladi?", 11],
    ["Basketbolda bir jamoadan maydonda nechta o'yinchi bo'ladi?", 5],
    ["Voleybolda bir jamoadan maydonda nechta o'yinchi bo'ladi?", 6],
    ["Futbolda nima bilan o'ynaladi?", "To'p", ["Raketka", "Shayba", "Kamon"]],
    ["Tennisda to'pga nima bilan uriladi?", "Raketka", ["Shayba", "Kamon", "Tayoq"]],
  ])],
  // 2
  [F([
    ["Shaxmat taxtasida nechta katak bor?", 64],
    ["Shaxmatda har bir o'yinchida nechta dona bor?", 16],
    ["Olimpiya halqalari soni nechta?", 5],
    ["Olimpiya o'yinlari necha yilda bir marta o'tkaziladi?", 4],
  ])],
  // 3
  [F([
    ["Marafon masofasi necha km?", 42],
    ["100 m yugurish qaysi sport turiga kiradi?", "Yengil atletika", ["Suzish", "Boks", "Voleybol"]],
    ["Dzyudo qaysi mamlakatdan kelib chiqqan?", "Yaponiya", ["Xitoy", "Rossiya", "Braziliya"]],
    ["Taekvondo qaysi mamlakatdan kelib chiqqan?", "Koreya", ["Yaponiya", "Xitoy", "Hindiston"]],
  ])],
  // 4
  [F([
    ["Futbol o'yinining asosiy vaqti necha daqiqa?", 90],
    ["Tennisdagi 'Grand Slam' turnirlari soni?", 4],
    ["Futbolda penalti nuqtasi darvozadan necha metr uzoqlikda?", 11],
    ["Basketbolda bitta jamoa maydonda nechta o'yinchi bilan o'ynaydi?", 5],
  ])],
  // 5
  [F([
    ["Futbolda qizil kartochka nimani bildiradi?", "O'yindan chetlatish", ["Ogohlantirish", "Jarima", "Almashtirish"]],
    ["Futbolda sariq kartochka nimani bildiradi?", "Ogohlantirish", ["Chetlatish", "Gol", "Almashtirish"]],
    ["Voleybolda set necha ochkogacha o'ynaladi (5-setdan tashqari)?", 25],
    ["O'zbekistonning milliy kurash turi?", "Kurash", ["Judo", "Sambo", "Boks"]],
  ])],
  // 6
  [F([
    ["Mashqdan oldin nima qilinadi?", "Razminka", ["Ovqatlanish", "Uyqu", "Suzish"]],
    ["Mashqdan keyin nima qilinadi?", "Sovutish (tinchlanish)", ["Razminka", "Sakrash", "Yugurish"]],
    ["Mashq paytida eng yaxshi ichimlik?", "Suv", ["Gazlangan ichimlik", "Kofe", "Energetik ichimlik"]],
    ["Maktab o'quvchisi uchun sog'lom uyqu taxminan necha soat?", 9],
  ])],
  // 7
  [F([
    ["Zamonaviy Olimpiya o'yinlari birinchi marta qaysi yilda o'tkazilgan?", 1896],
    ["Zamonaviy Olimpiya o'yinlari asoschisi kim?", "Per de Kuberten", ["Mark Spitz", "Pele", "Muhammad Ali"]],
    ["Qadimgi Olimpiya o'yinlari qayerda o'tkazilgan?", "Olimpiya (Yunoniston)", ["Rim", "Misr", "Xitoy"]],
    ["Olimpiya shiori: 'Tezroq, Yuqoriroq, ___'", "Kuchliroq", ["Bardamroq", "Yaxshiroq", "Tinchroq"]],
  ])],
  // 8
  [F([
    ["Rishod Sobirov qaysi sport turida mashhur?", "Dzyudo", ["Boks", "Suzish", "Futbol"]],
    ["Bahodir Jalolov qaysi sport turida mashhur?", "Boks", ["Dzyudo", "Futbol", "Tennis"]],
    ["Nodirbek Abdusattorov qaysi sport turida mashhur?", "Shaxmat", ["Tennis", "Boks", "Suzish"]],
    ["Eldor Shomurodov qaysi sport turida mashhur?", "Futbol", ["Boks", "Tennis", "Shaxmat"]],
  ])],
  // 9
  [F([
    ["Suzishning asosiy uslublari soni?", 4],
    ["Yengil atletikadagi o'nkurash necha turdan iborat?", 10],
    ["Futbol bo'yicha jahon chempionati necha yilda bir marta o'tkaziladi?", 4],
    ["2022-yilgi futbol bo'yicha jahon chempioni?", "Argentina", ["Fransiya", "Braziliya", "Xorvatiya"]],
    ["2018-yilgi futbol bo'yicha jahon chempioni?", "Fransiya", ["Argentina", "Braziliya", "Germaniya"]],
  ])],
  // 10
  [F([
    ["Maksimal yurak urishi taxminan 220 minus nima?", "Yosh", ["Vazn", "Bo'y", "Kun"]],
    ["BMI nimani baholaydi?", "Tana vazni indeksini", ["Qon bosimini", "Yurak urishini", "Bo'y o'sishini"]],
    ["Doping nima?", "Taqiqlangan moddalar", ["Mashq turi", "Ovqat turi", "Kiyim turi"]],
    ["WADA nimaga qarshi kurashadi?", "Dopingga", ["Futbolga", "Savdoga", "Tennisga"]],
  ])],
  // 11
  [F([
    ["FIFA tashkil topgan yil?", 1904],
    ["Xalqaro Olimpiya qo'mitasi (XOQ) tashkil topgan yil?", 1894],
    ["2024-yilgi yozgi Olimpiada qayerda o'tkazilgan?", "Parij", ["London", "Tokio", "Rio-de-Janeyro"]],
    ["2020-yilgi yozgi Olimpiada (2021-yilda o'tgan) qayerda?", "Tokio", ["Parij", "London", "Pekin"]],
    ["2028-yilgi yozgi Olimpiada qayerda o'tkaziladi?", "Los-Anjeles", ["Parij", "Brisben", "Pekin"]],
    ["O'zbekiston Olimpiadada birinchi marta mustaqil qatnashgan yil?", 1996],
  ])],
]);
 
// ============================== TEXNOLOGIYA ==============================
const texnologiya_G = ([
  // 1
  [F([
    ["Qaychi nima uchun kerak?", "Qirqish", ["Yozish", "Chizish", "Yelimlash"]],
    ["Yelim nima uchun kerak?", "Yopishtirish", ["Kesish", "Bo'yash", "O'lchash"]],
    ["Plastilindan nima yasash mumkin?", "Shakllar", ["Elektr", "Suv", "Yorug'lik"]],
    ["Qalam nima uchun kerak?", "Yozish va chizish", ["Qirqish", "Kesish", "Yelimlash"]],
  ])],
  // 2
  [F([
    ["Qog'ozdan buyum yasash san'ati?", "Origami", ["Kalligrafiya", "Kulolchilik", "Zargarlik"]],
    ["Gil bilan ishlash san'ati?", "Kulolchilik", ["Duradgorlik", "Kashtachilik", "Zargarlik"]],
    ["Mato ustiga ip bilan naqsh solish?", "Kashtachilik", ["Kulolchilik", "Duradgorlik", "Temirchilik"]],
    ["Ignadan nima uchun foydalaniladi?", "Tikish", ["Kesish", "Yozish", "Bo'yash"]],
  ])],
  // 3
  [F([
    ["Yog'ochga ishlov beruvchi usta?", "Duradgor", ["Kulol", "Tikuvchi", "Novvoy"]],
    ["Non yopuvchi usta?", "Novvoy", ["Duradgor", "Kulol", "Tikuvchi"]],
    ["Kiyim tikuvchi usta?", "Tikuvchi", ["Duradgor", "Kulol", "Novvoy"]],
    ["Metallga ishlov beruvchi usta?", "Temirchi", ["Kulol", "Novvoy", "Tikuvchi"]],
    ["Sopol idish yasovchi usta?", "Kulol", ["Temirchi", "Duradgor", "Novvoy"]],
  ])],
  // 4
  [F([
    ["Uzunlikni o'lchaydigan asbob?", "Chizg'ich", ["Termometr", "Tarozi", "Soat"]],
    ["Massani o'lchaydigan asbob?", "Tarozi", ["Chizg'ich", "Termometr", "Soat"]],
    ["Haroratni o'lchaydigan asbob?", "Termometr", ["Chizg'ich", "Tarozi", "Soat"]],
    ["Vaqtni o'lchaydigan asbob?", "Soat", ["Chizg'ich", "Tarozi", "Termometr"]],
    ["Pichoq bilan ishlaganda qanday bo'lish kerak?", "Ehtiyotkor", ["Shoshqin", "Beparvo", "Tez"]],
  ])],
  // 5
  [F([
    ["O't o'chirish xizmati raqami?", 101],
    ["Politsiya xizmati raqami?", 102],
    ["Tez yordam xizmati raqami?", 103],
    ["Gaz xizmati raqami?", 104],
    ["Elektr tokidan himoya uchun nima ishlatiladi?", "Izolyatsiya", ["Suv", "Metall", "Havo"]],
  ])],
  // 6
  [F([
    ["Elektr zanjiri: manba, iste'molchi va ___", "sim", ["tosh", "taxta", "suv"]],
    ["Elektr tokini yaxshi o'tkazadigan material?", "Mis", ["Rezina", "Shisha", "Plastmassa"]],
    ["Izolyator material?", "Rezina", ["Mis", "Alyuminiy", "Temir"]],
    ["Kuchlanish birligi?", "Volt", ["Amper", "Om", "Vatt"]],
    ["Tok kuchi birligi?", "Amper", ["Volt", "Om", "Vatt"]],
    ["Qarshilik birligi?", "Om", ["Volt", "Amper", "Vatt"]],
  ])],
  // 7
  [F([
    ["Eskiz nima?", "Dastlabki chizma", ["Tayyor buyum", "Material", "Asbob"]],
    ["Chizmada 1:2 masshtab nimani bildiradi?", "Kichraytirilgan", ["Kattalashtirilgan", "Tabiiy kattalik", "Noma'lum"]],
    ["Chizmada 1:1 masshtab nimani bildiradi?", "Tabiiy kattalik", ["Kichraytirilgan", "Kattalashtirilgan", "Noma'lum"]],
    ["Chizmada ko'rinmas chiziqlar qanday chiziladi?", "Shtrix chiziq bilan", ["Qalin chiziq bilan", "Nuqta bilan", "To'lqinsimon"]],
  ])],
  // 8
  [F([
    ["Qayta tiklanadigan energiya manbai qaysi?", "Quyosh", ["Ko'mir", "Neft", "Tabiiy gaz"]],
    ["Qayta tiklanmaydigan energiya manbai qaysi?", "Neft", ["Quyosh", "Shamol", "Oqar suv"]],
    ["Shamol energiyasini elektrga aylantiruvchi qurilma?", "Shamol turbinasi", ["Reaktor", "Bug' qozoni", "Akkumulyator"]],
    ["Quyosh panellari asosan nimani hosil qiladi?", "Elektr energiyasini", ["Yoqilg'ini", "Suvni", "Gazni"]],
  ])],
  // 9
  [
    E(() => { const d = rnd(20, 200) * 10, x = rnd(5, 19) * 10; return [`Daromad ${d} so'm, xarajat ${x} so'm. Foyda (so'm)?`, d - x]; }),
    F([
      ["Biznes reja nima?", "Faoliyat rejasi", ["Qarz daftari", "Soliq to'lovi", "Bayram dasturi"]],
      ["Daromad nima?", "Tushgan pul", ["Sarflangan pul", "Soliq", "Qarz"]],
      ["Xarajat nima?", "Sarflangan pul", ["Tushgan pul", "Foyda", "Aksiya"]],
      ["Foyda = daromad ___ xarajat", "minus", ["plus", "ko'paytirish", "bo'lish"]],
    ]),
  ],
  // 10
  [F([
    ["3D printer nima qiladi?", "Hajmli buyum chop etadi", ["Faqat rasm chiqaradi", "Ovoz yozadi", "Video suratga oladi"]],
    ["CAD dasturi nima uchun?", "Kompyuterda loyihalash", ["Musiqa tinglash", "Xat yozish", "Virus topish"]],
    ["Robotning tarkibiy qismlari: sensor, ___, aktuator", "kontroller", ["monitor", "printer", "klaviatura"]],
    ["Arduino nima?", "Mikrokontroller platformasi", ["Brauzer", "Matn muharriri", "Antivirus"]],
  ])],
  // 11
  [F([
    ["Sun'iy intellekt (AI) nima?", "Inson aqlini taqlid qiluvchi tizimlar", ["Faqat o'yin dasturi", "Bosma mashina", "Elektr manbai"]],
    ["Mashinali o'rganish nima?", "Ma'lumotlardan o'rganuvchi algoritmlar", ["Qo'lda hisoblash", "Faylni nusxalash", "Tarmoq kabeli"]],
    ["IoT nima?", "Narsalar interneti", ["Internet do'koni", "Veb-sayt", "Matn muharriri"]],
    ["Startap nima?", "Yangi innovatsion biznes", ["Eski zavod", "Davlat qonuni", "Maktab fani"]],
    ["Barqaror rivojlanish nimani anglatadi?", "Kelajak avlodni ham hisobga olish", ["Faqat bugungi foyda", "Tabiatni ishlatmaslik", "Faqat eksport"]],
  ])],
]);
 
// ============================== GEOGRAFIYA ==============================
const geografiya_G = ([
  // 1
  [F([
    ["Quyosh qaysi tomondan chiqadi?", "Sharqdan", ["G'arbdan", "Shimoldan", "Janubdan"]],
    ["Quyosh qaysi tomonga botadi?", "G'arbga", ["Sharqqa", "Shimolga", "Janubga"]],
    ["Yilda nechta fasl bor?", 4],
    ["Haftada necha kun bor?", 7],
    ["Qor qaysi faslda yog'adi?", "Qishda", ["Yozda", "Bahorda", "Kuzda"]],
  ])],
  // 2
  [F([
    ["Tog'ning eng yuqori qismi nima deyiladi?", "Cho'qqi", ["Etak", "Vodiy", "Dara"]],
    ["Tog'lar orasidagi pastlik nima deyiladi?", "Vodiy", ["Cho'qqi", "Etak", "Qum"]],
    ["Tekis va keng joy nima deyiladi?", "Tekislik", ["Tog'", "Cho'qqi", "Vodiy"]],
    ["Qumli keng hudud nima deyiladi?", "Cho'l", ["Daryo", "Tog'", "O'rmon"]],
  ])],
  // 3
  [F([
    ["Yer yuzida nechta materik bor?", 6],
    ["Yer yuzida nechta okean bor?", 5],
    ["Eng katta okean qaysi?", "Tinch okeani", ["Atlantika okeani", "Hind okeani", "Shimoliy Muz okeani"]],
    ["Eng katta materik qaysi?", "Yevroosiyo", ["Afrika", "Avstraliya", "Antarktida"]],
    ["O'zbekiston qaysi qit'ada joylashgan?", "Osiyo", ["Yevropa", "Afrika", "Amerika"]],
  ])],
  // 4
  [F([
    ["O'zbekistonda nechta viloyat bor?", 12],
    ["Qoraqalpog'iston qanday maqomga ega?", "Avtonom respublika", ["Viloyat", "Shahar", "Tuman"]],
    ["Samarqand qaysi daryo bo'yida joylashgan?", "Zarafshon", ["Amudaryo", "Sirdaryo", "Chirchiq"]],
    ["Toshkent qaysi daryo bo'yida joylashgan?", "Chirchiq", ["Zarafshon", "Amudaryo", "Qashqadaryo"]],
    ["Qizilqum qaysi daryolar oralig'ida joylashgan?", "Amudaryo va Sirdaryo", ["Zarafshon va Chirchiq", "Volga va Don", "Nil va Kongo"]],
  ])],
  // 5
  [F([
    ["Ekvator Yerni nechta yarimsharga ajratadi?", 2],
    ["Yer o'z o'qi atrofida necha soatda aylanadi?", 24],
    ["Yer Quyosh atrofida necha kunda aylanadi?", 365],
    ["Geografik kenglik qaysi chiziqlar bilan o'lchanadi?", "Parallellar", ["Meridianlar", "Daryolar", "Tog'lar"]],
    ["Geografik uzunlik qaysi chiziqlar bilan o'lchanadi?", "Meridianlar", ["Parallellar", "Daryolar", "Tog'lar"]],
  ])],
  // 6
  [F([
    ["Dunyodagi eng baland tog' cho'qqisi?", "Jomolungma (Everest)", ["Elbrus", "Monblan", "Kilimanjaro"]],
    ["Eng chuqur okean xandagi?", "Mariana", ["Puerto-Riko", "Yava", "Tonga"]],
    ["Eng katta issiq cho'l?", "Sahroi Kabir", ["Qizilqum", "Gobi", "Qoraqum"]],
    ["Atmosferaning eng pastki qatlami?", "Troposfera", ["Stratosfera", "Mezosfera", "Termosfera"]],
    ["Nil daryosi qaysi materikda oqadi?", "Afrika", ["Osiyo", "Yevropa", "Janubiy Amerika"]],
  ])],
  // 7
  [F([
    ["Afrikaning eng baland cho'qqisi?", "Kilimanjaro", ["Elbrus", "Everest", "Monblan"]],
    ["Dunyodagi eng katta orol?", "Grenlandiya", ["Madagaskar", "Borneo", "Kuba"]],
    ["Janubiy Amerikadagi eng uzun tog' tizmasi?", "And", ["Alp", "Himolay", "Ural"]],
    ["Amazonka daryosi qaysi materikda?", "Janubiy Amerika", ["Afrika", "Osiyo", "Avstraliya"]],
    ["Eng sovuq materik?", "Antarktida", ["Avstraliya", "Yevropa", "Afrika"]],
    ["Yevropa va Osiyo chegarasidagi tog' tizmasi?", "Ural", ["And", "Alp", "Tyan-Shan"]],
  ])],
  // 8
  [F([
    ["O'zbekiston nechta davlat bilan chegaradosh?", 5],
    ["O'zbekiston bilan chegaradosh davlat qaysi?", "Qozog'iston", ["Rossiya", "Xitoy", "Eron"]],
    ["O'zbekiston iqlimi qanday?", "Keskin kontinental", ["Ekvatorial", "Dengiz iqlimi", "Subtropik nam"]],
    ["Orol dengizi qurishining asosiy sababi?", "Daryo suvidan sug'orishda haddan ortiq foydalanish", ["Zilzila", "Vulqon otilishi", "Yomg'ir ko'pligi"]],
  ])],
  // 9
  [F([
    ["Maydoni bo'yicha eng katta davlat?", "Rossiya", ["Kanada", "Xitoy", "AQSh"]],
    ["Dunyodagi eng kichik davlat?", "Vatikan", ["Monako", "San-Marino", "Lixtenshteyn"]],
    ["Dunyodagi eng baland sharshara?", "Anxel", ["Niagara", "Viktoriya", "Iguasu"]],
    ["Panama kanali qaysi okeanlarni bog'laydi?", "Atlantika va Tinch", ["Hind va Tinch", "Atlantika va Hind", "Shimoliy Muz va Tinch"]],
    ["Aholisi eng ko'p qit'a?", "Osiyo", ["Afrika", "Yevropa", "Shimoliy Amerika"]],
  ])],
  // 10
  [F([
    ["Neft eksport qiluvchi davlatlar tashkiloti?", "OPEK", ["BMT", "NATO", "Yevropa Ittifoqi"]],
    ["Eng yirik iqtisodiyotga ega davlat (nominal YaIM)?", "AQSh", ["Xitoy", "Yaponiya", "Germaniya"]],
    ["Urbanizatsiya nima?", "Shaharlar o'sishi va aholining shaharga ko'chishi", ["Qishloqlar ko'payishi", "Tog'larning yemirilishi", "Daryolarning qurishi"]],
    ["Demografik portlash nimani anglatadi?", "Aholining tez o'sishini", ["Aholining kamayishini", "Shaharlar yo'qolishini", "Migratsiya to'xtashini"]],
    ["Dunyo aholisi qaysi yilda 8 mlrd dan oshgan?", 2022],
  ])],
  // 11
  [F([
    ["Iqlim o'zgarishining asosiy sababi?", "Issiqxona gazlari", ["Oy tutilishi", "Zilzilalar", "Okean to'lqinlari"]],
    ["Parij kelishuvi qaysi muammoga bag'ishlangan?", "Iqlim o'zgarishi", ["Savdo", "Chegara", "Migratsiya"]],
    ["BMT shtab-kvartirasi qayerda joylashgan?", "Nyu-York", ["Jeneva", "Parij", "London"]],
    ["Yevropa Ittifoqining asosiy yagona valyutasi?", "Yevro", ["Dollar", "Funt", "Frank"]],
    ["BMTning Barqaror rivojlanish maqsadlari soni?", 17],
    ["Globallashuv nima?", "Mamlakatlarning o'zaro bog'lanishi", ["Davlatlarning ajralishi", "Aholining kamayishi", "Savdoning to'xtashi"]],
  ])],
]);


export const questions = {
  Matematika: G(matematika_G),
  Fizika: G(fizika_G),
  Biologiya: G(biologiya_G),
  Kimyo: G(kimyo_G),
  Informatika: G(informatika_G),
  Tarix: G(tarix_G),
  "Ingliz tili": G(inglizTili_G),
  "Ona tili": G(onatili_G),
  Adabiyot: G(adabiyot_G),
  Huquq: G(huquq_G),
  Sport: G(sport_G),
  Geometriya: G(geometriya_G),
  Texnologiya: G(texnologiya_G),
  Geografiya: G(geografiya_G),
};