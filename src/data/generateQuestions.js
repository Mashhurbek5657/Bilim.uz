// ====================================================================
//  14 fan × 11 sinf. Har sinfga ~46 ta noyob savol (fan bo'yicha ~500).
//  Hisob fanlari generator bilan, matnli fanlar jadvallar bilan yig'iladi.
// ====================================================================
const PER_GRADE = 46;

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

const N = (question, a) => ({ question, options: numOptions(a), answer: String(a) });
const S = (question, a, wrong) => ({ question, options: shuffle([a, ...wrong]), answer: a });

function T(question, a, w, pool) {
  let wrong = [...new Set((w || []).filter((x) => x !== a))];
  if (wrong.length < 3) {
    const others = [
      ...new Set(
        pool.map((i) => i[1]).filter((x) => typeof x === "string" && x !== a && !wrong.includes(x))
      ),
    ];
    wrong = [...wrong, ...shuffle(others)];
  }
  return { question, options: shuffle([a, ...wrong.slice(0, 3)]), answer: a };
}

const fromItem = ([q, a, w], pool) => (typeof a === "number" ? N(q, a) : T(q, a, w, pool));

// Sinf massivlari: G[0] = 1-sinf manbalari ...
const mk = () => Array.from({ length: 11 }, () => []);
const add = (G, g, ...src) => G[g - 1].push(...src);
// Jadvalni sinflar oralig'iga teng taqsimlaydi
const spread = (G, a, b, items) => {
  const n = b - a + 1;
  const size = Math.ceil(items.length / n);
  for (let i = 0; i < n; i++) {
    const part = items.slice(i * size, (i + 1) * size);
    if (part.length) G[a - 1 + i].push({ items: part, pool: items });
  }
};
const pairs = (tmpl, rows) => rows.map(([x, y]) => [tmpl(x, y), y]);

// Manbalardan noyob savollar yig'ish
function build(sources, prefix) {
  const out = [];
  const seen = new Set();
  const push = (q, tag) => {
    if (!q || seen.has(q.question)) return false;
    seen.add(q.question);
    out.push({ ...q, tag });
    return true;
  };

  const lists = [];
  const params = [];
  sources.forEach((s, idx) => {
    if (typeof s === "function") params.push({ f: s, tag: `${prefix}-p${idx}` });
    else lists.push({ ...(Array.isArray(s) ? { items: s, pool: s } : s), tag: `${prefix}-l${idx}` });
  });

  lists.forEach((l) => l.items.forEach((it) => push(fromItem(it, l.pool), l.tag)));

  if (params.length) {
    const want = Math.max(PER_GRADE - out.length, Math.ceil(PER_GRADE * 0.3));
    const target = out.length + want;
    let tries = 0;
    const maxTries = want * 80;
    while (out.length < target && tries < maxTries) {
      const p = params[tries % params.length];
      tries++;
      const r = p.f();
      push(Array.isArray(r) ? N(r[0], r[1]) : r, p.tag);
    }
  }
  return shuffle(out);
}

const makeSubject = (name, G) =>
  Object.fromEntries(G.map((src, i) => [`${i + 1}-sinf`, build(src, `${name}${i + 1}`)]));

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const comb = (n, k) => fact(n) / (fact(k) * fact(n - k));
const TR = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25]];

// ============================= MATEMATIKA =============================
function matematika() {
  const G = mk();
  const nouns = ["olma", "nok", "qalam", "kitob", "daftar", "to'p", "gul", "shar"];
  add(G, 1,
    () => { const a = rnd(1, 9), b = rnd(1, 10 - a); return [`${a} + ${b} = ?`, a + b]; },
    () => { const a = rnd(2, 10), b = rnd(1, a - 1); return [`${a} - ${b} = ?`, a - b]; },
    () => { const a = rnd(1, 6), b = rnd(1, 10 - a), n = pick(nouns); return [`Qutida ${a} ta ${n} bor edi, yana ${b} ta qo'shildi. Jami nechta ${n} bo'ldi?`, a + b]; },
    () => { const a = rnd(1, 19); return [`${a} sonidan keyingi son qaysi?`, a + 1]; },
    () => { const a = rnd(2, 20); return [`${a} sonidan oldingi son qaysi?`, a - 1]; },
    () => { const a = rnd(2, 10), b = rnd(1, a - 1); return [`${b} + ? = ${a}`, a - b]; }
  );
  add(G, 2,
    () => { const a = rnd(10, 60), b = rnd(10, 40); return [`${a} + ${b} = ?`, a + b]; },
    () => { const a = rnd(30, 99), b = rnd(10, a - 1); return [`${a} - ${b} = ?`, a - b]; },
    () => { const a = rnd(2, 5), b = rnd(1, 10); return [`${a} × ${b} = ?`, a * b]; },
    () => { const a = rnd(5, 30), b = rnd(5, 30), c = rnd(5, 30); return [`${a} + ${b} + ${c} = ?`, a + b + c]; },
    () => { const n = 2 * rnd(2, 40); return [`${n} ning yarmi nechaga teng?`, n / 2]; }
  );
  add(G, 3,
    () => { const a = rnd(2, 9), b = rnd(2, 10); return [`${a} × ${b} = ?`, a * b]; },
    () => { const a = rnd(2, 9), b = rnd(2, 10); return [`${a * b} ÷ ${a} = ?`, b]; },
    () => { const a = rnd(100, 500), b = rnd(100, 400); return [`${a} + ${b} = ?`, a + b]; },
    () => { const a = rnd(300, 900), b = rnd(100, 299); return [`${a} - ${b} = ?`, a - b]; },
    () => { const n = 3 * rnd(2, 30); return [`${n} ning uchdan biri nechaga teng?`, n / 3]; }
  );
  add(G, 4,
    () => { const a = rnd(100, 999), b = rnd(2, 9); return [`${a} × ${b} = ?`, a * b]; },
    () => { const a = rnd(2, 20), b = rnd(2, 9), c = rnd(2, 9); return [`${a} + ${b} × ${c} = ?`, a + b * c]; },
    () => { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9); return [`(${a} + ${b}) × ${c} = ?`, (a + b) * c]; },
    () => { const a = rnd(2, 40), b = rnd(2, 40); return [`To'g'ri to'rtburchakning uzunligi ${a} sm, eni ${b} sm. Perimetri (sm)?`, 2 * (a + b)]; },
    () => { const b = rnd(2, 9), q = rnd(1, b - 1), k = rnd(5, 40); return [`${k * b + q} ni ${b} ga bo'lganda qoldiq nechaga teng?`, q]; }
  );
  add(G, 5,
    () => { const n = rnd(1, 30) * 20, p = pick([10, 20, 25, 50]); return [`${n} ning ${p}% i nechaga teng?`, (n * p) / 100]; },
    () => { const x = rnd(1, 80), a = rnd(1, 60); return [`x + ${a} = ${x + a}, x = ?`, x]; },
    () => { const a = rnd(3, 40), b = rnd(3, 40); return [`To'g'ri to'rtburchak tomonlari ${a} va ${b}. Yuzi?`, a * b]; },
    () => { const p = pick([[12, 18, 6], [24, 36, 12], [20, 30, 10], [15, 25, 5], [28, 42, 14], [16, 24, 8], [18, 27, 9], [30, 45, 15], [32, 48, 16], [21, 35, 7]]); return [`EKUB(${p[0]}, ${p[1]}) = ?`, p[2]]; },
    () => { const a = rnd(2, 9), b = rnd(2, 9), x = rnd(2, 20); return [`${a}x = ${a * x}, x = ?`, x]; }
  );
  add(G, 6,
    () => { const a = rnd(1, 30), b = rnd(1, 30); return [`(${-a}) + ${b} = ?`, -a + b]; },
    () => { const a = rnd(2, 9), k = rnd(2, 9), c = rnd(2, 12); return [`${a} : ${a * k} = ${c} : x, x = ?`, c * k]; },
    () => { const p = pick([[4, 6, 12], [6, 8, 24], [3, 5, 15], [4, 10, 20], [6, 9, 18], [8, 12, 24], [5, 7, 35], [9, 12, 36], [10, 15, 30], [6, 10, 30]]); return [`EKUK(${p[0]}, ${p[1]}) = ?`, p[2]]; },
    () => { const n = rnd(1, 30) * 20, p = pick([10, 20, 25, 50]); return [`Narxi ${n} so'm bo'lgan mahsulotga ${p}% chegirma qilindi. Chegirma miqdori?`, (n * p) / 100]; },
    () => { const a = rnd(2, 12), b = rnd(2, 12); return [`(${-a}) × ${b} = ?`, -a * b]; }
  );
  add(G, 7,
    () => { const a = rnd(2, 9), x = rnd(1, 25), b = rnd(1, 30); return [`${a}x + ${b} = ${a * x + b}, x = ?`, x]; },
    () => { const a = rnd(2, 9), n = rnd(2, 4); return [`${a}^${n} = ?`, a ** n]; },
    () => { const a = rnd(1, 30), b = rnd(1, 30); return [`|${-a}| + ${b} = ?`, a + b]; },
    () => { const a = rnd(1, 12), b = rnd(1, 12); return [`(${a} + ${b})² − 2·${a}·${b} = ?`, a * a + b * b]; },
    () => { const a = rnd(2, 12), b = rnd(2, 12); return [`${a}² − ${b}² = ?`, a * a - b * b]; }
  );
  add(G, 8,
    () => { const k = rnd(2, 30); return [`√${k * k} = ?`, k]; },
    () => { const p = rnd(3, 15), q = rnd(1, p - 1); return [`x² − ${p + q}x + ${p * q} = 0 tenglamaning katta ildizi?`, p]; },
    () => { const t = pick(TR); return [`Katetlari ${t[0]} va ${t[1]} bo'lgan to'g'ri burchakli uchburchakning gipotenuzasi?`, t[2]]; },
    () => { const x = rnd(2, 30); return [`x² = ${x * x}, x > 0 bo'lsa, x = ?`, x]; },
    () => { const a = rnd(2, 9), b = rnd(2, 9); return [`√${a * a * b * b} = ?`, a * b]; }
  );
  add(G, 9,
    () => { const a = rnd(1, 30), d = rnd(1, 9), n = rnd(4, 25); return [`Arifmetik progressiya: a₁ = ${a}, d = ${d}. a${n} = ?`, a + (n - 1) * d]; },
    () => { const b = rnd(1, 6), q = rnd(2, 4), n = rnd(3, 6); return [`Geometrik progressiya: b₁ = ${b}, q = ${q}. b${n} = ?`, b * q ** (n - 1)]; },
    () => { const b = rnd(-12, 12), c = rnd(-12, 12); return [`x² + ${b}x + ${c} = 0 tenglamaning diskriminanti? (b=${b}, c=${c})`, b * b - 4 * c]; },
    () => { const p = rnd(1, 12), q = rnd(1, 12); return [`x² − ${p + q}x + ${p * q} = 0 tenglama ildizlarining yig'indisi?`, p + q]; },
    () => { const p = rnd(1, 12), q = rnd(1, 12); return [`x² − ${p + q}x + ${p * q} = 0 tenglama ildizlarining ko'paytmasi?`, p * q]; }
  );
  add(G, 10,
    () => { const a = pick([2, 3, 5, 7]), n = rnd(1, 5); return [`log_${a}(${a ** n}) = ?`, n]; },
    () => { const n = rnd(4, 10), k = rnd(1, 4); return [`C(${n}, ${k}) = ?`, comb(n, k)]; },
    () => { const a = pick([2, 3, 5]), n = rnd(2, 6); return [`${a}^x = ${a ** n}, x = ?`, n]; },
    () => { const a = rnd(1, 10), d = rnd(1, 8), n = rnd(4, 15); return [`Arifmetik progressiyada a₁ = ${a}, d = ${d}. Dastlabki ${n} hadning yig'indisi?`, (n * (2 * a + (n - 1) * d)) / 2]; },
    () => { const n = rnd(3, 8), k = rnd(1, 3); return [`P(${n}, ${k}) = ? (o'rinlashtirish)`, fact(n) / fact(n - k)]; }
  );
  add(G, 11,
    () => { const a = rnd(1, 6), n = rnd(2, 4), k = rnd(1, 4); return [`f(x) = ${a}x^${n}, f'(${k}) = ?`, a * n * k ** (n - 1)]; },
    () => { const a = rnd(1, 6), k = rnd(1, 8); return [`∫₀^${k} ${2 * a}x dx = ?`, a * k * k]; },
    () => { const k = rnd(1, 8); return [`∫₀^${k} 3x² dx = ?`, k ** 3]; },
    () => { const n = rnd(3, 8); return [`${n}! = ?`, fact(n)]; },
    () => { const b = rnd(1, 15); return [`Cheksiz geometrik progressiya: b₁ = ${b}, q = 1/2. Yig'indisi?`, 2 * b]; },
    () => { const a = rnd(1, 9), b = rnd(1, 9); return [`f(x) = ${a}x + ${b}, f'(x) = ?`, a]; }
  );
  return G;
}

// ============================== GEOMETRIYA ==============================
const Pi = (f) => () => {
  const [q, c] = f();
  return { question: q, options: numOptions(c).map((x) => x + "π"), answer: c + "π" };
};

function geometriya() {
  const G = mk();
  const nm = ["Uchburchak", "To'rtburchak", "Beshburchak", "Oltiburchak", "Yettiburchak", "Sakkizburchak", "To'qqizburchak", "O'nburchak"];
  add(G, 1, nm.flatMap((x, i) => [
    [`${x}ning nechta tomoni bor?`, i + 3],
    [`${x}ning nechta burchagi bor?`, i + 3],
    [`${x}ning nechta uchi (cho'qqisi) bor?`, i + 3],
  ]),
  [
    ["Kvadratning barcha tomonlari qanday?", "Teng", ["Har xil", "Faqat ikkitasi teng", "Hech biri teng emas"]],
    ["Aylana qanday shakl?", "Yumaloq, burchaksiz", ["To'rtburchak", "Uchburchak", "Kub"]],
    ["To'p qaysi shaklga o'xshaydi?", "Shar", ["Kub", "Piramida", "Silindr"]],
    ["Qutichaga o'xshash shakl?", "Parallelepiped", ["Shar", "Konus", "Aylana"]],
  ]);
  add(G, 2,
    () => { const a = rnd(2, 40); return [`Kvadratning tomoni ${a} sm. Perimetri (sm)?`, 4 * a]; },
    () => { const a = rnd(2, 30), b = rnd(2, 30); return [`To'g'ri to'rtburchakning tomonlari ${a} sm va ${b} sm. Perimetri (sm)?`, 2 * (a + b)]; },
    () => { const a = rnd(2, 40); return [`Teng tomonli uchburchakning tomoni ${a} sm. Perimetri (sm)?`, 3 * a]; },
    () => { const a = rnd(2, 20), b = rnd(2, 20), c = rnd(2, 20); return [`Uchburchak tomonlari ${a}, ${b}, ${c} sm. Perimetri (sm)?`, a + b + c]; }
  );
  add(G, 3,
    () => { const a = rnd(2, 25); return [`Kvadratning tomoni ${a} sm. Yuzi (sm²)?`, a * a]; },
    () => { const a = rnd(2, 25), b = rnd(2, 25); return [`To'g'ri to'rtburchak: uzunligi ${a} sm, eni ${b} sm. Yuzi (sm²)?`, a * b]; },
    () => { const a = rnd(2, 25), b = rnd(2, 25); return [`To'g'ri to'rtburchak: uzunligi ${a} sm, eni ${b} sm. Perimetri (sm)?`, 2 * (a + b)]; }
  );
  add(G, 4,
    () => { const a = rnd(3, 30), b = rnd(2, a - 1); return [`To'g'ri to'rtburchakning perimetri ${2 * (a + b)} sm, eni ${b} sm. Uzunligi (sm)?`, a]; },
    [
      ["To'g'ri burchak necha gradus?", 90], ["Yoyiq burchak necha gradus?", 180],
      ["To'liq burchak necha gradus?", 360], ["Kvadratda nechta to'g'ri burchak bor?", 4],
    ],
    () => { const a = rnd(2, 25), b = rnd(2, 25); return [`Yuzi ${a * b} sm², eni ${b} sm bo'lgan to'g'ri to'rtburchakning uzunligi (sm)?`, a]; },
    () => { const a = rnd(2, 30); return [`Kvadratning perimetri ${4 * a} sm. Tomoni (sm)?`, a]; }
  );
  add(G, 5,
    () => { const a = rnd(20, 80), b = rnd(20, 80); return [`Uchburchakning ikki burchagi ${a}° va ${b}°. Uchinchi burchagi (°)?`, 180 - a - b]; },
    () => { const h = rnd(2, 20), a = 2 * rnd(1, 15); return [`Uchburchakning asosi ${a} sm, balandligi ${h} sm. Yuzi (sm²)?`, (a * h) / 2]; },
    () => { const a = rnd(2, 12), b = rnd(2, 12), c = rnd(2, 12); return [`Parallelepiped o'lchamlari ${a}, ${b}, ${c} sm. Hajmi (sm³)?`, a * b * c]; }
  );
  add(G, 6,
    () => { const r = rnd(1, 25); return [`Aylana uzunligi (π ≈ 3), r = ${r} sm. C = ?`, 6 * r]; },
    () => { const r = rnd(1, 20); return [`Doira yuzi (π ≈ 3), r = ${r} sm. S = ?`, 3 * r * r]; },
    () => { const x = rnd(5, 85); return [`${x}° burchakning to'ldiruvchi burchagi (°)?`, 90 - x]; },
    () => { const x = rnd(10, 170); return [`${x}° burchakning qo'shni burchagi (°)?`, 180 - x]; }
  );
  add(G, 7,
    () => { const A = 2 * rnd(10, 80); return [`Teng yonli uchburchakning uchidagi burchagi ${A}°. Asosidagi burchagi (°)?`, (180 - A) / 2]; },
    () => { const n = rnd(3, 20); return [`${n} burchakli ko'pburchak ichki burchaklari yig'indisi (°)?`, (n - 2) * 180]; },
    () => { const t = pick(TR); return [`To'g'ri burchakli uchburchak katetlari ${t[0]} va ${t[1]}. Gipotenuzasi?`, t[2]]; },
    () => { const a = rnd(20, 80); return [`Uchburchakning tashqi burchagi ichki burchaklaridan ikkitasi yig'indisiga teng. Agar ular ${a}° va ${a + 10}° bo'lsa, tashqi burchak (°)?`, 2 * a + 10]; }
  );
  add(G, 8,
    () => { const a = rnd(2, 15), b = a + 2 * rnd(1, 8), h = rnd(2, 14); return [`Trapetsiya asoslari ${a} va ${b}, balandligi ${h}. Yuzi?`, ((a + b) * h) / 2]; },
    () => { const d1 = 2 * rnd(2, 15), d2 = rnd(2, 16); return [`Rombning diagonallari ${d1} va ${d2}. Yuzi?`, (d1 * d2) / 2]; },
    () => { const n = rnd(4, 20); return [`${n} burchakli qavariq ko'pburchakda nechta diagonal bor?`, (n * (n - 3)) / 2]; },
    () => { const t = pick(TR); return [`To'g'ri burchakli uchburchakda gipotenuza ${t[2]}, bir katet ${t[0]}. Ikkinchi katet?`, t[1]]; }
  );
  add(G, 9,
    () => { const n = pick([3, 4, 6, 8, 9, 10, 12, 15, 18, 20]); return [`Muntazam ${n} burchakning ichki burchagi (°)?`, (180 * (n - 2)) / n]; },
    () => { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), k = rnd(1, 5), x = rnd(0, 9), y = rnd(0, 9); return [`A(${x}; ${y}) va B(${x + t[0] * k}; ${y + t[1] * k}) nuqtalar orasidagi masofa?`, t[2] * k]; },
    () => { const n = pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]); return [`Muntazam ${n} burchakning markaziy burchagi (°)?`, 360 / n]; }
  );
  add(G, 10,
    () => { const a = rnd(2, 20); return [`Kub qirrasi ${a} sm. Hajmi (sm³)?`, a ** 3]; },
    () => { const a = rnd(2, 20); return [`Kub qirrasi ${a} sm. To'la sirti (sm²)?`, 6 * a * a]; },
    () => { const a = rnd(2, 12), b = rnd(2, 12), c = rnd(2, 12); return [`To'g'ri burchakli parallelepiped o'lchamlari ${a}, ${b}, ${c}. To'la sirti?`, 2 * (a * b + b * c + a * c)]; },
    () => { const n = rnd(3, 15); return [`Asosi ${n} burchakli prizmada nechta qirra bor?`, 3 * n]; },
    () => { const n = rnd(3, 15); return [`Asosi ${n} burchakli piramidada nechta yoq (asosi bilan) bor?`, n + 1]; }
  );
  add(G, 11,
    Pi(() => { const r = 3 * rnd(1, 8); return [`Shar hajmi V = (4/3)πr³, r = ${r}. V = ?`, (4 * r ** 3) / 3]; }),
    Pi(() => { const r = rnd(1, 15); return [`Shar sirti S = 4πr², r = ${r}. S = ?`, 4 * r * r]; }),
    Pi(() => { const r = rnd(1, 12), h = rnd(1, 15); return [`Silindr hajmi V = πr²h, r = ${r}, h = ${h}. V = ?`, r * r * h]; }),
    Pi(() => { const r = 3 * rnd(1, 6), h = rnd(2, 14); return [`Konus hajmi V = (1/3)πr²h, r = ${r}, h = ${h}. V = ?`, (r * r * h) / 3]; })
  );
  return G;
}

// ============================== FIZIKA ==============================
function fizika() {
  const G = mk();
  add(G, 1, [
    ["Muz qizisa, nimaga aylanadi?", "Suvga", ["Toshga", "Havoga", "Yog'ga"]],
    ["Suv qaynasa, nimaga aylanadi?", "Bug'ga", ["Muzga", "Toshga", "Yog'ga"]],
    ["Suv sovuqda nimaga aylanadi?", "Muzga", ["Bug'ga", "Gazga", "Qumga"]],
    ["Quyosh bizga nima beradi?", "Yorug'lik va issiqlik", ["Faqat sovuq", "Faqat ovoz", "Faqat shamol"]],
    ["Qaysi biri qattiq jism?", "Tosh", ["Suv", "Havo", "Bug'"]],
    ["Qaysi biri suyuqlik?", "Sut", ["Tosh", "Temir", "Yog'och"]],
    ["Qaysi biri gaz?", "Havo", ["Suv", "Tosh", "Sut"]],
    ["Qor qanday rangda?", "Oq", ["Qora", "Yashil", "Qizil"]],
  ]);
  add(G, 2, [
    ["Magnit nimani tortadi?", "Temirni", ["Yog'ochni", "Shishani", "Plastmassani"]],
    ["Ovozni biz nima bilan eshitamiz?", "Quloq bilan", ["Ko'z bilan", "Burun bilan", "Til bilan"]],
    ["Tashlangan narsani yerga nima tortadi?", "Og'irlik kuchi", ["Magnit", "Shamol", "Ovoz"]],
    ["Soya qachon hosil bo'ladi?", "Yorug'lik to'silganda", ["Yomg'irda", "Shamolda", "Qor yog'ganda"]],
    ["Kamalak qachon paydo bo'ladi?", "Yomg'irdan keyin quyosh chiqqanda", ["Tunda", "Qorda", "Shamolda"]],
    ["Eng tez yoyiladigan narsa?", "Yorug'lik", ["Ovoz", "Shamol", "Yomg'ir"]],
    ["Narsalarni ko'rish uchun nima kerak?", "Yorug'lik", ["Sovuq", "Ovoz", "Shamol"]],
  ]);
  add(G, 3, [
    ["Suv necha °C da qaynaydi?", 100], ["Suv necha °C da muzlaydi?", 0],
    ["Insonning normal tana harorati taxminan necha °C?", 37],
    ["Ovoz havosiz bo'shliqda tarqaladimi?", "Yo'q", ["Ha", "Faqat kunduz", "Faqat tunda"]],
    ["Quyidagilardan qaysi biri yorug'lik manbai?", "Quyosh", ["Tosh", "Daraxt", "Stol"]],
    ["Haroratni nima bilan o'lchaymiz?", "Termometr", ["Tarozi", "Chizg'ich", "Soat"]],
    ["Qaysi jism magnitga tortiladi?", "Temir mix", ["Qalam", "Daftar", "Rezina"]],
    ["Qaysi biri elektr tokini o'tkazadi?", "Mis sim", ["Rezina", "Shisha", "Yog'och"]],
  ]);
  add(G, 4, [
    ["Quyosh sistemasida nechta sayyora bor?", 8], ["Yer Quyosh atrofida taxminan necha kunda aylanadi?", 365],
    ["Yorug'lik tezligi taxminan necha km/s?", 300000],
    ["Yerga eng yaqin yulduz qaysi?", "Quyosh", ["Oy", "Mars", "Sirius"]],
    ["Yerning tabiiy yo'ldoshi qaysi?", "Oy", ["Mars", "Quyosh", "Venera"]],
    ["Eng katta sayyora qaysi?", "Yupiter", ["Yer", "Mars", "Merkuriy"]],
    ["Quyoshga eng yaqin sayyora?", "Merkuriy", ["Venera", "Yer", "Mars"]],
    ["Qizil sayyora deb qaysi sayyora ataladi?", "Mars", ["Venera", "Yupiter", "Saturn"]],
    ["Halqali sayyora qaysi?", "Saturn", ["Mars", "Merkuriy", "Yer"]],
  ]);
  add(G, 5, [
    ["Kuch birligi nima?", "Nyuton", ["Joul", "Vatt", "Paskal"]],
    ["Energiya (ish) birligi nima?", "Joul", ["Nyuton", "Vatt", "Paskal"]],
    ["Quvvat birligi nima?", "Vatt", ["Nyuton", "Joul", "Paskal"]],
    ["Bosim birligi nima?", "Paskal", ["Nyuton", "Joul", "Vatt"]],
    ["Uzunlikning SI birligi nima?", "Metr", ["Kilogramm", "Sekund", "Amper"]],
    ["Massaning SI birligi nima?", "Kilogramm", ["Nyuton", "Metr", "Sekund"]],
    ["Vaqtning SI birligi nima?", "Sekund", ["Metr", "Kilogramm", "Nyuton"]],
    ["Haroratning SI birligi nima?", "Kelvin", ["Selsiy", "Joul", "Vatt"]],
    ["Tok kuchi birligi nima?", "Amper", ["Volt", "Om", "Vatt"]],
    ["Kuchlanish birligi nima?", "Volt", ["Amper", "Om", "Vatt"]],
  ]);
  add(G, 6,
    [["Tezlik birligi nima?", "m/s", ["kg", "N", "J"]], ["Qarshilik birligi nima?", "Om", ["Volt", "Amper", "Vatt"]]],
    () => { const v = rnd(2, 40), t = rnd(2, 20); return [`Jism ${v} m/s tezlik bilan ${t} s harakatlansa, qancha masofa (m) bosadi?`, v * t]; },
    () => { const v = rnd(2, 40), t = rnd(2, 20); return [`Jism ${v * t} m masofani ${t} s da bosdi. Tezligi (m/s)?`, v]; },
    () => { const v = rnd(2, 30), t = rnd(2, 20); return [`Tezligi ${v} m/s bo'lgan jism ${v * t} m yo'lni necha sekundda bosadi?`, t]; }
  );
  add(G, 7,
    () => { const r = rnd(1, 20) * 100, V = rnd(1, 15); return [`Hajmi ${V} m³, zichligi ${r} kg/m³ bo'lgan jismning massasi (kg)?`, r * V]; },
    () => { const S = rnd(1, 20), k = rnd(2, 80); return [`${S * k} N kuch ${S} m² yuzaga ta'sir qiladi. Bosim (Pa)?`, k]; },
    () => { const m = rnd(1, 50); return [`Massasi ${m} kg jismning og'irligi (N)? (g = 10 m/s²)`, m * 10]; },
    () => { const F = rnd(2, 60), d = rnd(2, 30); return [`Kuch ${F} N, yelka ${d} m bo'lsa, kuch momenti (N·m)?`, F * d]; }
  );
  add(G, 8,
    () => { const m = rnd(1, 20), dt = rnd(5, 80); return [`${m} kg suvni ${dt} °C ga qizdirish uchun issiqlik miqdori (J)? (c = 4200 J/kg·°C)`, 4200 * m * dt]; },
    () => { const I = rnd(1, 20), R = rnd(2, 50); return [`Zanjirda tok ${I} A, qarshilik ${R} Ω. Kuchlanish (V)?`, I * R]; },
    () => { const I = rnd(1, 20), R = rnd(2, 50); return [`Kuchlanish ${I * R} V, qarshilik ${R} Ω. Tok kuchi (A)?`, I]; },
    () => { const U = rnd(2, 40) * 10, I = rnd(1, 15); return [`Kuchlanish ${U} V, tok ${I} A. Quvvat (W)?`, U * I]; }
  );
  add(G, 9,
    () => { const m = rnd(1, 40), a = rnd(1, 15); return [`Massasi ${m} kg jism ${a} m/s² tezlanish oldi. Kuch (N)?`, m * a]; },
    () => { const v0 = rnd(0, 30), a = rnd(1, 9), t = rnd(1, 15); return [`Boshlang'ich tezlik ${v0} m/s, tezlanish ${a} m/s². ${t} s dan keyingi tezlik (m/s)?`, v0 + a * t]; },
    () => { const m = rnd(1, 50), v = rnd(1, 30); return [`Massasi ${m} kg jism ${v} m/s tezlikda. Impulsi (kg·m/s)?`, m * v]; },
    () => { const v0 = rnd(0, 15), a = 2 * rnd(1, 6), t = rnd(1, 12); return [`v₀ = ${v0} m/s, a = ${a} m/s², t = ${t} s. Bosib o'tilgan yo'l (m)?`, v0 * t + (a * t * t) / 2]; }
  );
  add(G, 10,
    () => { const m = rnd(2, 80), h = rnd(1, 40); return [`${m} kg jism ${h} m balandlikda. Potensial energiyasi (J)? (g = 10 m/s²)`, m * 10 * h]; },
    () => { const m = 2 * rnd(1, 30), v = rnd(1, 30); return [`${m} kg jism ${v} m/s tezlik bilan harakatlanmoqda. Kinetik energiyasi (J)?`, (m * v * v) / 2]; },
    () => { const F = rnd(2, 80), s = rnd(2, 40); return [`${F} N kuch ta'sirida jism ${s} m ko'chdi. Bajarilgan ish (J)?`, F * s]; },
    () => { const Nn = rnd(2, 50), t = rnd(2, 40); return [`${Nn * t} J ish ${t} s da bajarildi. Quvvat (W)?`, Nn]; }
  );
  add(G, 11,
    () => { const l = rnd(1, 20), f = rnd(2, 80); return [`To'lqin uzunligi ${l} m, chastotasi ${f} Hz. To'lqin tezligi (m/s)?`, l * f]; },
    () => { const a = rnd(2, 60), b = rnd(2, 60); return [`Ketma-ket ulangan ${a} Ω va ${b} Ω qarshiliklarning umumiy qarshiligi (Ω)?`, a + b]; },
    () => { const I = rnd(1, 15), t = rnd(2, 60); return [`Tok kuchi ${I} A, vaqt ${t} s. O'tgan zaryad (C)?`, I * t]; },
    () => { const U1 = rnd(1, 20) * 10, n1 = rnd(1, 15), k = rnd(2, 8); return [`Transformator: U₁ = ${U1} V, n₁ = ${n1}, n₂ = ${n1 * k}. U₂ (V)?`, U1 * k]; }
  );
  return G;
}

// ============================== KIMYO ==============================
const SUBS = [["H₂O", 18], ["CO₂", 44], ["O₂", 32], ["H₂", 2], ["CH₄", 16], ["NaOH", 40], ["CaCO₃", 100], ["H₂SO₄", 98], ["NH₃", 17], ["HCl", 36.5 | 0 || 36]];
const ELEMENTS = [["Vodorod", "H"], ["Geliy", "He"], ["Litiy", "Li"], ["Berilliy", "Be"], ["Bor", "B"], ["Uglerod", "C"], ["Azot", "N"], ["Kislorod", "O"], ["Ftor", "F"], ["Neon", "Ne"], ["Natriy", "Na"], ["Magniy", "Mg"], ["Alyuminiy", "Al"], ["Kremniy", "Si"], ["Fosfor", "P"], ["Oltingugurt", "S"], ["Xlor", "Cl"], ["Argon", "Ar"], ["Kaliy", "K"], ["Kalsiy", "Ca"], ["Temir", "Fe"], ["Mis", "Cu"], ["Rux", "Zn"], ["Kumush", "Ag"], ["Qalay", "Sn"], ["Oltin", "Au"], ["Simob", "Hg"], ["Qo'rg'oshin", "Pb"], ["Yod", "I"], ["Brom", "Br"]];
const FORMULAS = [["Suv", "H₂O"], ["Karbonat angidrid", "CO₂"], ["Osh tuzi", "NaCl"], ["Ammiak", "NH₃"], ["Metan", "CH₄"], ["Sulfat kislota", "H₂SO₄"], ["Xlorid kislota", "HCl"], ["Nitrat kislota", "HNO₃"], ["So'ndirilmagan ohak", "CaO"], ["Ohaktosh (bo'r)", "CaCO₃"], ["Natriy gidroksid", "NaOH"], ["Kaliy gidroksid", "KOH"], ["Ozon", "O₃"], ["Vodorod peroksid", "H₂O₂"], ["Etil spirti", "C₂H₅OH"], ["Glyukoza", "C₆H₁₂O₆"], ["Sirka kislota", "CH₃COOH"], ["Kvars (qum)", "SiO₂"], ["Temir(III) oksid", "Fe₂O₃"]];

function kimyo() {
  const G = mk();
  add(G, 1, [
    ["Muz qaysi agregat holatda?", "Qattiq", ["Suyuq", "Gaz", "Eriydi"]],
    ["Suv qaysi agregat holatda?", "Suyuq", ["Qattiq", "Gaz", "Eriydi"]],
    ["Bug' qaysi agregat holatda?", "Gaz", ["Qattiq", "Suyuq", "Eriydi"]],
    ["Shakar suvga solinsa nima bo'ladi?", "Eriydi", ["Qotadi", "Yonadi", "Uchadi"]],
    ["Tosh qaysi agregat holatda?", "Qattiq", ["Suyuq", "Gaz", "Bug'"]],
    ["Havo qaysi agregat holatda?", "Gaz", ["Qattiq", "Suyuq", "Tosh"]],
  ]);
  add(G, 2, [
    ["Suv necha °C da qaynaydi?", 100], ["Suv necha °C da muzlaydi?", 0],
    ["Osh tuzi qanday ta'mga ega?", "Sho'r", ["Shirin", "Nordon", "Achchiq"]],
    ["Shakar qanday ta'mga ega?", "Shirin", ["Sho'r", "Nordon", "Achchiq"]],
    ["Limon qanday ta'mga ega?", "Nordon", ["Shirin", "Sho'r", "Achchiq"]],
    ["Qaysi biri suvda yaxshi eriydi?", "Shakar", ["Qum", "Tosh", "Temir"]],
    ["Qaysi biri suvda erimaydi?", "Qum", ["Tuz", "Shakar", "Soda"]],
  ]);
  add(G, 3, [
    ["Havoning eng ko'p qismini qaysi gaz tashkil etadi?", "Azot", ["Kislorod", "Karbonat angidrid", "Vodorod"]],
    ["Nafas olish uchun zarur gaz?", "Kislorod", ["Azot", "Karbonat angidrid", "Vodorod"]],
    ["Olovni o'chirishda ishlatiladigan gaz?", "Karbonat angidrid", ["Kislorod", "Vodorod", "Metan"]],
    ["Suvning formulasi?", "H₂O", ["CO₂", "NaCl", "O₂"]],
    ["Yonish uchun nima kerak?", "Kislorod", ["Azot", "Argon", "Geliy"]],
    ["Gazlangan ichimlikdagi pufakchalar qaysi gaz?", "Karbonat angidrid", ["Kislorod", "Azot", "Vodorod"]],
  ]);
  add(G, 4, [
    ["Oddiy sharoitda suyuq holatdagi metall?", "Simob", ["Temir", "Mis", "Alyuminiy"]],
    ["Eng yengil gaz?", "Vodorod", ["Kislorod", "Azot", "Geliy"]],
    ["Temirning zanglashi uchun nima kerak?", "Namlik va kislorod", ["Faqat sovuq", "Faqat yorug'lik", "Faqat vodorod"]],
    ["Qaysi metall elektr tokini yaxshi o'tkazadi?", "Mis", ["Rezina", "Shisha", "Yog'och"]],
    ["Qaysi metall magnitga tortiladi?", "Temir", ["Mis", "Alyuminiy", "Oltin"]],
    ["Eng qimmatbaho metallardan biri?", "Oltin", ["Temir", "Qo'rg'oshin", "Rux"]],
  ]);
  add(G, 5, [
    ["Tuzli suvdan tuzni ajratish usuli?", "Bug'latish", ["Filtrlash", "Magnit yordamida", "Elash"]],
    ["Qum va suvni ajratish usuli?", "Filtrlash", ["Bug'latish", "Magnit yordamida", "Elash"]],
    ["Temir qirindisi va qum aralashmasini ajratish usuli?", "Magnit yordamida", ["Bug'latish", "Filtrlash", "Eritish"]],
    ["Toza modda necha turdagi zarrachadan iborat?", "Bir xil", ["Har xil", "Faqat gaz", "Faqat tuz"]],
    ["Havo qanday modda?", "Aralashma", ["Toza modda", "Element", "Birikma"]],
    ["Suv qanday modda?", "Birikma", ["Aralashma", "Oddiy modda", "Metall"]],
  ]);
  spread(G, 6, 9, pairs((x) => `${x} elementining kimyoviy belgisi?`, ELEMENTS));
  spread(G, 6, 9, pairs((s) => `"${s}" belgisi qaysi elementga tegishli?`, ELEMENTS.map(([n, s]) => [s, n]).reverse()));
  spread(G, 6, 10, pairs((x) => `${x}ning kimyoviy formulasi?`, FORMULAS));
  spread(G, 7, 10, pairs((f) => `${f} formulali modda qaysi?`, FORMULAS.map(([n, f]) => [f, n]).reverse()));
  add(G, 6, [
    ["Kimyoviy elementlar soni taxminan nechta?", 118],
    ["Moddaning eng kichik zarrachasi (kimyoviy bo'linmas)?", "Atom", ["Molekula", "Hujayra", "Ion"]],
  ]);
  add(G, 7,
    [...ELEMENTS.slice(0, 20).map(([n], i) => [`${n}ning tartib raqami nechchi?`, i + 1])]
  );
  add(G, 8,
    () => { const [f, M] = pick(SUBS), n = rnd(1, 12); return [`${n} mol ${f} ning massasi necha gramm? (M = ${M} g/mol)`, n * M]; },
    () => { const [f, M] = pick(SUBS), n = rnd(1, 12); return [`${n * M} g ${f} necha mol? (M = ${M} g/mol)`, n]; },
    [
      ["Atom yadrosidagi musbat zarracha?", "Proton", ["Elektron", "Neytron", "Foton"]],
      ["Atomdagi manfiy zarracha?", "Elektron", ["Proton", "Neytron", "Foton"]],
      ["Atom yadrosidagi neytral zarracha?", "Neytron", ["Proton", "Elektron", "Foton"]],
    ]
  );
  add(G, 9,
    () => { const m = rnd(1, 20) * 100, w = pick([5, 10, 15, 20, 25]); return [`${m} g eritmada ${w}% tuz bor. Tuz massasi (g)?`, (m * w) / 100]; },
    () => { const ms = rnd(5, 45); return [`${ms} g tuz ${100 - ms} g suvda eritildi. Tuzning massa ulushi (%)?`, ms]; },
    () => { const c = rnd(1, 9), V = rnd(1, 8); return [`${c * V} mol modda ${V} L eritmada erigan. Molyar konsentratsiya (mol/L)?`, c]; }
  );
  add(G, 10,
    () => { const n = rnd(1, 25); return [`Alkan CₙH₂ₙ₊₂ da n = ${n}. Vodorod atomlari soni?`, 2 * n + 2]; },
    () => { const n = rnd(2, 25); return [`Alkan CₙH₂ₙ₊₂ da n = ${n}. C–C bog'lar soni?`, n - 1]; },
    () => { const n = rnd(1, 25); return [`Alkan CₙH₂ₙ₊₂ da n = ${n}. Jami atomlar soni?`, 3 * n + 2]; },
    () => { const n = rnd(2, 25); return [`Alken CₙH₂ₙ da n = ${n}. Vodorod atomlari soni?`, 2 * n]; }
  );
  add(G, 11,
    () => { const n = 5 * rnd(1, 12); return [`${n} mol gaz normal sharoitda necha litr hajm egallaydi? (Vm = 22,4 L/mol)`, Math.round(n * 22.4)]; },
    () => { const k = rnd(1, 13); return [`[H⁺] = 10⁻${k} mol/L bo'lsa, pH = ?`, k]; },
    () => { const k = rnd(1, 13); return [`pH = ${k} bo'lsa, pOH = ?`, 14 - k]; },
    () => { const c = rnd(1, 9), V = rnd(2, 10); return [`${c * V} mol modda ${V} L eritmada. Molyar konsentratsiya (mol/L)?`, c]; }
  );
  return G;
}

// ============================== BIOLOGIYA ==============================
const ANIMALS = [["Burgut", "Qush"], ["Karp", "Baliq"], ["Ot", "Sutemizuvchi"], ["Ari", "Hasharot"], ["Ilon", "Sudralib yuruvchi"], ["Delfin", "Sutemizuvchi"], ["Qaldirg'och", "Qush"], ["Kapalak", "Hasharot"], ["Baqa", "Amfibiya"], ["Timsoh", "Sudralib yuruvchi"], ["Kit", "Sutemizuvchi"], ["Chumoli", "Hasharot"], ["Tovuq", "Qush"], ["Akula", "Baliq"], ["Sigir", "Sutemizuvchi"], ["Kaltakesak", "Sudralib yuruvchi"], ["Salamandra", "Amfibiya"], ["Pashsha", "Hasharot"], ["Uloq? (Echki)", "Sutemizuvchi"], ["Chumchuq", "Qush"], ["Qoplon", "Sutemizuvchi"], ["Laqqa baliq", "Baliq"], ["Toshbaqa", "Sudralib yuruvchi"], ["Ko'rshapalak", "Sutemizuvchi"], ["Sher", "Sutemizuvchi"], ["Tustovuq", "Qush"], ["Chigirtka", "Hasharot"], ["Qurbaqa", "Amfibiya"], ["Pingvin", "Qush"], ["Losos (qizil baliq)", "Baliq"]].map(([a, b]) => [a.replace("Uloq? (Echki)", "Echki"), b]);
const ORGANS = [["Yurak", "Qonni haydash"], ["O'pka", "Gaz almashinuvi"], ["Jigar", "Zaharsizlantirish va o't ishlab chiqarish"], ["Buyrak", "Siydik hosil qilish"], ["Oshqozon", "Ovqatni hazm qilish"], ["Bosh miya", "Nerv tizimini boshqarish"], ["Teri", "Himoya va issiqlik boshqarish"], ["Ingichka ichak", "Oziq moddalarni so'rish"], ["Qalqonsimon bez", "Yodli gormonlar ishlab chiqarish"], ["Oshqozon osti bezi", "Insulin ishlab chiqarish"], ["Ko'z", "Ko'rish"], ["Quloq", "Eshitish va muvozanat"], ["Suyaklar", "Tayanch va himoya"], ["Muskullar", "Harakatlanish"]];

function biologiya() {
  const G = mk();
  add(G, 1, [
    ["Sigir nima beradi?", "Sut", ["Tuxum", "Jun", "Asal"]], ["Tovuq nima qo'yadi?", "Tuxum", ["Sut", "Jun", "Asal"]],
    ["Asalari nima beradi?", "Asal", ["Sut", "Jun", "Tuxum"]], ["Qo'ydan nima olinadi?", "Jun", ["Asal", "Tuxum", "Ipak"]],
    ["O'simlik suvni nima orqali oladi?", "Ildiz", ["Barg", "Gul", "Meva"]], ["Baliq qayerda yashaydi?", "Suvda", ["Havoda", "Daraxtda", "Yerda"]],
    ["Qush nima bilan uchadi?", "Qanot", ["Dum", "Tumshuq", "Oyoq"]], ["Ipak qurti nimadan ipak beradi?", "Pilla", ["Barg", "Meva", "Gul"]],
    ["O'simlikka nima kerak?", "Suv va yorug'lik", ["Faqat sovuq", "Faqat shamol", "Faqat qum"]],
    ["Itning bolasi nima deyiladi?", "Kuchuk", ["Qo'zi", "Buzoq", "Toy"]], ["Qo'yning bolasi nima deyiladi?", "Qo'zi", ["Kuchuk", "Buzoq", "Toy"]],
    ["Sigirning bolasi nima deyiladi?", "Buzoq", ["Qo'zi", "Kuchuk", "Toy"]], ["Otning bolasi nima deyiladi?", "Toy", ["Buzoq", "Qo'zi", "Kuchuk"]],
  ]);
  spread(G, 2, 8, pairs((x) => `${x} qaysi guruhga kiradi?`, ANIMALS));
  add(G, 3, [
    ["O'simlikning tuproqdan suv so'ruvchi qismi?", "Ildiz", ["Barg", "Gul", "Poya"]],
    ["O'simlikni tik tutib turuvchi qismi?", "Poya", ["Ildiz", "Barg", "Meva"]],
    ["Fotosintez asosan qaysi qismda boradi?", "Barg", ["Ildiz", "Poya", "Meva"]],
    ["Urug' qaysi qismda hosil bo'ladi?", "Meva", ["Barg", "Ildiz", "Poya"]],
    ["Changlanish qaysi qismda sodir bo'ladi?", "Gul", ["Ildiz", "Barg", "Poya"]],
    ["Yangi o'simlik nimadan unib chiqadi?", "Urug'", ["Barg", "Tosh", "Suv"]],
    ["Qaysi biri daraxt?", "Chinor", ["Lola", "Beda", "Bug'doy"]],
    ["Qaysi biri o't o'simlik?", "Beda", ["Chinor", "Tut", "Terak"]],
    ["Kuzda barglar nima qiladi?", "To'kiladi", ["Katta bo'ladi", "Gullaydi", "Mevaga aylanadi"]],
  ]);
  add(G, 4, [
    ["Fotosintezda o'simlik qaysi gazni yutadi?", "Karbonat angidrid", ["Kislorod", "Azot", "Vodorod"]],
    ["Fotosintezda qaysi gaz ajralib chiqadi?", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"]],
    ["Odam nafas olganda qaysi gazni qabul qiladi?", "Kislorod", ["Karbonat angidrid", "Azot", "Vodorod"]],
    ["Havoning eng katta qismini qaysi gaz tashkil etadi?", "Azot", ["Kislorod", "Karbonat angidrid", "Argon"]],
    ["O'simlik ildizi orqali nimani oladi?", "Suv", ["Kislorod", "Yorug'lik", "Shamol"]],
    ["Odamda nechta sezgi a'zosi bor?", 5], ["Odamda nechta asosiy ta'm turi bor?", 4],
    ["Ko'rish a'zosi qaysi?", "Ko'z", ["Quloq", "Burun", "Til"]], ["Hidlash a'zosi qaysi?", "Burun", ["Ko'z", "Quloq", "Til"]],
    ["Eshitish a'zosi qaysi?", "Quloq", ["Ko'z", "Burun", "Teri"]], ["Ta'm bilish a'zosi qaysi?", "Til", ["Ko'z", "Quloq", "Burun"]],
  ]);
  add(G, 5, [
    ["Hujayra yadrosining vazifasi?", "Irsiy axborotni saqlash", ["Energiya hosil qilish", "Oqsil yig'ish", "Moddalarni tashish"]],
    ["Hujayrada fotosintez qaysi organoidda boradi?", "Xloroplast", ["Mitoxondriya", "Yadro", "Ribosoma"]],
    ["Hujayrada energiya hosil qiluvchi organoid?", "Mitoxondriya", ["Xloroplast", "Yadro", "Vakuola"]],
    ["Hujayrani tashqaridan o'rab turuvchi parda?", "Membrana", ["Yadro", "Vakuola", "Ribosoma"]],
    ["O'simlik hujayrasidagi qattiq qobiq?", "Hujayra devori", ["Membrana", "Yadro", "Mitoxondriya"]],
    ["Hujayrani kim kashf etgan?", "Robert Guk", ["Mendel", "Darvin", "Paster"]],
    ["Oqsil sintezi qaysi organoidda boradi?", "Ribosoma", ["Xloroplast", "Yadro", "Vakuola"]],
  ]);
  add(G, 6, [
    ["Bug'doy qaysi sinfga kiradi?", "Bir pallalilar", ["Ikki pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Makkajo'xori qaysi sinfga kiradi?", "Bir pallalilar", ["Ikki pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Loviya qaysi sinfga kiradi?", "Ikki pallalilar", ["Bir pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Archa qaysi bo'limga kiradi?", "Ochiq urug'lilar", ["Bir pallalilar", "Ikki pallalilar", "Suvo'tlar"]],
    ["Paporotnik qanday ko'payadi?", "Sporalar bilan", ["Urug' bilan", "Meva bilan", "Gul bilan"]],
    ["Pomidor qaysi sinfga kiradi?", "Ikki pallalilar", ["Bir pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Guruch qaysi sinfga kiradi?", "Bir pallalilar", ["Ikki pallalilar", "Ochiq urug'lilar", "Yo'sinlar"]],
    ["Zamburug'lar qaysi dunyoga kiradi?", "Zamburug'lar dunyosi", ["O'simliklar", "Hayvonlar", "Bakteriyalar"]],
  ]);
  add(G, 7, [
    ["Hasharotlarning oyoqlari soni?", 6], ["O'rgimchaklarning oyoqlari soni?", 8],
    ["Baliqlar nima bilan nafas oladi?", "Jabra", ["O'pka", "Teri", "Traxeya"]],
    ["Qushlarning tanasi nima bilan qoplangan?", "Patlar", ["Jun", "Tangacha", "Chig'anoq"]],
    ["Sutemizuvchilar bolasini nima bilan boqadi?", "Sut", ["Tuxum", "Yem", "Asal"]],
    ["Sudralib yuruvchilar terisi nima bilan qoplangan?", "Shoxsimon tangachalar", ["Patlar", "Jun", "Shilimshiq modda"]],
    ["Amfibiyalar qayerda ko'payadi?", "Suvda", ["Havoda", "Daraxtda", "Qumda"]],
    ["Baqaning lichinkasi nima deyiladi?", "Itbaliq", ["Qurt", "Pilla", "Tuxum"]],
  ]);
  spread(G, 7, 10, pairs((x) => `${x} a'zosining vazifasi?`, ORGANS));
  add(G, 8, [
    ["Odam yuragi nechta kameradan iborat?", 4], ["Odamda necha juft qovurg'a bor?", 12],
    ["Qonning qizil rangini beruvchi modda?", "Gemoglobin", ["Insulin", "Adrenalin", "Pepsin"]],
    ["Qonni filtrlab siydik hosil qiluvchi a'zo?", "Buyrak", ["Jigar", "O'pka", "Yurak"]],
    ["Gaz almashinuvi o'pkaning qaysi qismida boradi?", "Alveolalar", ["Bronxlar", "Traxeya", "Hiqildoq"]],
    ["Insulin qaysi bezda hosil bo'ladi?", "Oshqozon osti bezi", ["Jigar", "Qalqonsimon bez", "Buyrak usti bezi"]],
    ["Qon guruhlari nechta?", 4], ["Kattalarda tishlar soni?", 32],
    ["Kislorodni tashuvchi qon hujayralari?", "Eritrotsitlar", ["Leykotsitlar", "Trombotsitlar", "Limfa"]],
    ["Himoya vazifasini bajaruvchi qon hujayralari?", "Leykotsitlar", ["Eritrotsitlar", "Trombotsitlar", "Plazma"]],
    ["Qon ivishida ishtirok etuvchi hujayralar?", "Trombotsitlar", ["Eritrotsitlar", "Leykotsitlar", "Neyronlar"]],
  ]);
  add(G, 8, [
    ["A vitamini nima uchun muhim?", "Ko'rish uchun", ["Qon ivishi uchun", "Suyaklar uchun", "Hazm uchun"]],
    ["D vitamini nima uchun muhim?", "Suyaklar va kalsiy so'rilishi uchun", ["Ko'rish uchun", "Qon ivishi uchun", "Nafas uchun"]],
    ["C vitamini nima uchun muhim?", "Immunitetni mustahkamlash uchun", ["Ko'rish uchun", "Qon ivishi uchun", "Eshitish uchun"]],
    ["K vitamini nima uchun muhim?", "Qon ivishi uchun", ["Ko'rish uchun", "Suyak uchun", "Hazm uchun"]],
  ]);
  add(G, 9, [
    ["Insonda nechta xromosoma bor?", 46], ["Jinsiy hujayrada nechta xromosoma bor?", 23],
    ["Mitoz natijasida nechta hujayra hosil bo'ladi?", 2], ["Meyoz natijasida nechta hujayra hosil bo'ladi?", 4],
    ["DNK zanjiri nechta ipdan iborat?", 2],
    ["Irsiyat qonunlarini kim kashf etgan?", "Gregor Mendel", ["Charlz Darvin", "Lui Paster", "Karl Linney"]],
    ["Evolyutsiya nazariyasi muallifi?", "Charlz Darvin", ["Gregor Mendel", "Lui Paster", "Karl Linney"]],
    ["Ekosistemada energiyaning asosiy manbai?", "Quyosh", ["Shamol", "Tuproq", "Suv"]],
    ["Ekosistemada o'simliklar qanday rol o'ynaydi?", "Produtsent", ["Konsument", "Redutsent", "Parazit"]],
    ["O'txo'r hayvonlar ekosistemada kim?", "Konsument", ["Produtsent", "Redutsent", "Parazit"]],
    ["Organik moddalarni parchalovchi organizmlar?", "Redutsentlar", ["Produtsentlar", "Konsumentlar", "Parazitlar"]],
    ["Binar nomenklaturani kim kiritgan?", "Karl Linney", ["Gregor Mendel", "Charlz Darvin", "Lui Paster"]],
  ]);
  add(G, 10, [
    ["Oqsillar qaysi monomerlardan tuzilgan?", "Aminokislotalar", ["Monosaxaridlar", "Nukleotidlar", "Yog' kislotalari"]],
    ["Uglevodlarning monomeri?", "Monosaxaridlar", ["Aminokislotalar", "Nukleotidlar", "Yog' kislotalari"]],
    ["Nuklein kislotalarning monomeri?", "Nukleotidlar", ["Aminokislotalar", "Monosaxaridlar", "Yog' kislotalari"]],
    ["Ribosomada qaysi jarayon boradi?", "Oqsil sintezi", ["Fotosintez", "DNK replikatsiyasi", "Glikoliz"]],
    ["Hujayradagi universal energiya manbai molekulasi?", "ATF", ["DNK", "RNK", "Gemoglobin"]],
    ["DNKda nechta asosiy azotli asos bor?", 4],
    ["DNKda timinga komplementar asos?", "Adenin", ["Guanin", "Sitozin", "Uratsil"]],
    ["DNKda guaninga komplementar asos?", "Sitozin", ["Adenin", "Timin", "Uratsil"]],
    ["RNKda timin o'rniga qaysi asos bor?", "Uratsil", ["Adenin", "Guanin", "Sitozin"]],
    ["Glyukozaning formulasi?", "C₆H₁₂O₆", ["C₁₂H₂₂O₁₁", "H₂O", "CO₂"]],
  ]);
  add(G, 11, [
    ["Mendelning 1-qonuni: F₁ duragaylar qanday bo'ladi?", "Bir xil", ["Har xil", "Faqat retsessiv", "Faqat steril"]],
    ["Monoduragay chatishtirishda F₂ da fenotip bo'yicha nisbat?", "3:1", ["1:1", "9:3:3:1", "1:2:1"]],
    ["Diduragay chatishtirishda F₂ da fenotip nisbati?", "9:3:3:1", ["3:1", "1:1", "1:2:1"]],
    ["Gemofiliya geni qanday irsiylanadi?", "X-xromosomaga birikkan", ["Autosoma dominant", "Y-xromosomaga birikkan", "Sitoplazmatik"]],
    ["Biosfera haqidagi ta'limot muallifi?", "V.I. Vernadskiy", ["Charlz Darvin", "Gregor Mendel", "Lui Paster"]],
    ["Odam genomida nechta xromosoma juftligi bor?", 23],
    ["Monoduragay chatishtirishda F₂ da genotip bo'yicha nisbat?", "1:2:1", ["3:1", "9:3:3:1", "1:1"]],
    ["Tabiiy tanlanish nazariyasi kimga tegishli?", "Charlz Darvin", ["Lamark", "Mendel", "Paster"]],
    ["Vaktsinani (quturishga qarshi) kim yaratgan?", "Lui Paster", ["Charlz Darvin", "Mendel", "Linney"]],
  ]);
  return G;
}

// ============================== INFORMATIKA ==============================
const HW = ["kompyuter", "klaviatura", "protsessor", "sichqoncha", "monitor", "printer", "dastur", "internet", "fayl", "brauzer"];

function informatika() {
  const G = mk();
  add(G, 1, [
    ["Monitor nima uchun kerak?", "Tasvir ko'rsatish", ["Ovoz chiqarish", "Matn bosish", "Ma'lumot kiritish"]],
    ["Sichqoncha qanday qurilma?", "Kiritish qurilmasi", ["Chiqarish qurilmasi", "Xotira", "Dastur"]],
    ["Klaviatura vazifasi?", "Matn kiritish", ["Chop etish", "Tasvir chiqarish", "Ovoz yozish"]],
    ["Printer nima qiladi?", "Qog'ozga chop etadi", ["Ovoz yozadi", "Video ko'rsatadi", "Internetga ulaydi"]],
    ["Quloqchin nima uchun?", "Ovoz eshitish", ["Matn yozish", "Rasm chizish", "Chop etish"]],
    ["Mikrofon nima uchun?", "Ovoz yozish", ["Rasm ko'rish", "Chop etish", "Matn yozish"]],
    ["Kolonka nima qiladi?", "Ovoz chiqaradi", ["Matn bosadi", "Tasvir oladi", "Fayl saqlaydi"]],
    ["Veb-kamera nima uchun?", "Video tasvir olish", ["Ovoz chiqarish", "Chop etish", "Hisoblash"]],
  ]);
  add(G, 2, [
    ["Papka (jild) nima uchun ishlatiladi?", "Fayllarni tartiblash", ["Rasm chizish", "Ovoz yozish", "Internetga ulanish"]],
    ["Ctrl + C nima qiladi?", "Nusxa oladi", ["Qo'yadi", "Kesadi", "O'chiradi"]],
    ["Ctrl + V nima qiladi?", "Qo'yadi", ["Nusxa oladi", "Kesadi", "Saqlaydi"]],
    ["Ctrl + Z nima qiladi?", "Amalni bekor qiladi", ["Saqlaydi", "Chop etadi", "Yopadi"]],
    ["Ctrl + S nima qiladi?", "Saqlaydi", ["Ochadi", "Chop etadi", "Yopadi"]],
    ["Ctrl + X nima qiladi?", "Kesib oladi", ["Nusxa oladi", "Saqlaydi", "Chop etadi"]],
    ["Ctrl + A nima qiladi?", "Hammasini belgilaydi", ["Saqlaydi", "Yopadi", "Qidiradi"]],
    ["Ctrl + P nima qiladi?", "Chop etadi", ["Saqlaydi", "Yopadi", "Qo'yadi"]],
  ]);
  add(G, 3, [
    ["Paint dasturi nima uchun?", "Rasm chizish", ["Matn yozish", "Hisob-kitob", "Video ko'rish"]],
    ["Word dasturi nima uchun?", "Matn yozish va tahrirlash", ["Rasm chizish", "Musiqa tinglash", "O'yin o'ynash"]],
    ["Internet orqali xat yuborish xizmati?", "Elektron pochta", ["Kalkulyator", "Paint", "Printer"]],
    ["Brauzer misoli qaysi?", "Chrome", ["Word", "Excel", "Paint"]],
    ["Qidiruv tizimi misoli qaysi?", "Google", ["Word", "Paint", "Windows"]],
    ["Operatsion tizim misoli qaysi?", "Windows", ["Chrome", "Word", "Paint"]],
    ["Antivirus nima uchun?", "Viruslardan himoya", ["Rasm chizish", "Matn yozish", "Musiqa tinglash"]],
  ]);
  add(G, 4, [
    ["1 bayt necha bit?", 8], ["1 KB necha bayt?", 1024], ["1 MB necha KB?", 1024],
    ["Kompyuterning 'miyasi' qaysi qurilma?", "Protsessor", ["Monitor", "Klaviatura", "Printer"]],
    ["Operativ xotira qisqartmasi?", "RAM", ["ROM", "CPU", "SSD"]],
    ["Excel nima?", "Jadval protsessori", ["Matn muharriri", "Brauzer", "Antivirus"]],
    ["CPU nima?", "Markaziy protsessor", ["Operativ xotira", "Monitor", "Klaviatura"]],
    ["USB-fleshka nima uchun?", "Ma'lumot saqlash", ["Chop etish", "Ovoz chiqarish", "Tasvir olish"]],
  ],
    () => { const k = rnd(2, 60); return [`${k} bayt necha bit?`, k * 8]; }
  );
  add(G, 5, [
    ["Algoritm nima?", "Amallar ketma-ketligi", ["Dasturlash tili", "Kompyuter turi", "Qurilma nomi"]],
    ["Blok-sxemada romb nimani bildiradi?", "Shart (tekshirish)", ["Boshlanish", "Oddiy amal", "Chiqarish"]],
    ["Scratch nima?", "Vizual dasturlash muhiti", ["Brauzer", "Antivirus", "Jadval protsessori"]],
    ["Ikkilik sanoq tizimida nechta raqam ishlatiladi?", 2], ["Ikkilik 101 sonining o'nlik qiymati?", 5],
    ["Blok-sxemada oval nimani bildiradi?", "Boshlanish/tugash", ["Shart", "Amal", "Chiqarish"]],
    ["Algoritmning xossalaridan biri?", "Aniqlik", ["Tasodifiylik", "Cheksizlik", "Murakkablik"]],
  ],
    () => { const k = rnd(2, 20); return [`${k} KB necha bayt?`, k * 1024]; }
  );
  add(G, 6,
    () => { const n = rnd(1, 63); return [`${n.toString(2)} (ikkilik) soni o'nlik tizimda nechaga teng?`, n]; },
    [
      [".docx kengaytmali fayl qaysi dasturniki?", "Word", ["Excel", "Paint", "PowerPoint"]],
      ["Slayd tayyorlash dasturi?", "PowerPoint", ["Word", "Excel", "Paint"]],
      ["Excelda katak manzili misoli?", "B3", ["3B", "BB", "3-3"]],
      [".xlsx kengaytmali fayl qaysi dasturniki?", "Excel", ["Word", "Paint", "PowerPoint"]],
      [".pptx kengaytmali fayl qaysi dasturniki?", "PowerPoint", ["Word", "Excel", "Paint"]],
    ],
    () => { const k = rnd(2, 20); return [`${k * 1024} KB necha MB?`, k]; }
  );
  add(G, 7,
    () => {
      const n = rnd(4, 127), a = n.toString(2);
      return S(`O'nlik ${n} sonining ikkilik yozuvi?`, a, [n + 1, n - 1, n + 2].map((x) => x.toString(2)));
    },
    [
      ["Python qanday til?", "Dasturlash tili", ["Belgilash tili", "Operatsion tizim", "Brauzer"]],
      ["HTML nima?", "Belgilash tili", ["Dasturlash tili", "Operatsion tizim", "Antivirus"]],
      ["CSS nima uchun ishlatiladi?", "Sahifa dizayni uchun", ["Ma'lumotlar bazasi uchun", "Virusni topish uchun", "Ovoz yozish uchun"]],
      ["IP-manzil nima?", "Qurilmaning tarmoqdagi manzili", ["Fayl nomi", "Dastur turi", "Parol"]],
      ["URL nima?", "Veb-sahifa manzili", ["Antivirus", "Dastur", "Qurilma"]],
      ["Wi-Fi nima?", "Simsiz tarmoq", ["Dastur", "Fayl turi", "Brauzer"]],
    ],
    () => { const w = pick(HW); return [`Python: print(len("${w}")) natijasi?`, w.length]; }
  );
  add(G, 8,
    () => { const a = rnd(1, 9), b = rnd(2, 9), c = rnd(2, 9); return [`Python: print(${a} + ${b} * ${c}) natijasi?`, a + b * c]; },
    () => { const a = rnd(10, 99), b = rnd(2, 9); return [`Python: print(${a} % ${b}) natijasi?`, a % b]; },
    () => { const a = rnd(10, 99), b = rnd(2, 9); return [`Python: print(${a} // ${b}) natijasi?`, Math.floor(a / b)]; },
    () => { const n = rnd(3, 30); return [`1 dan ${n} gacha bo'lgan natural sonlar yig'indisi?`, (n * (n + 1)) / 2]; },
    () => { const a = rnd(2, 9), b = rnd(2, 3); return [`Python: print(${a} ** ${b}) natijasi?`, a ** b]; },
    () => { const n = rnd(3, 30); return [`Python: len(list(range(${n}))) natijasi?`, n]; },
    [["Python'da ro'yxat (list) qaysi qavs bilan yoziladi?", "[ ]", ["{ }", "( )", "< >"]],
     ["Python'da izoh qaysi belgi bilan boshlanadi?", "#", ["//", "--", "/*"]],
     ["Python'da matn kiritish funksiyasi?", "input()", ["print()", "len()", "int()"]]]
  );
  add(G, 9,
    () => { const k = rnd(2, 80); return [`${k} bayt necha bit?`, k * 8]; },
    () => { const k = rnd(2, 30); return [`${k} KB necha bayt?`, k * 1024]; },
    () => { const n = rnd(10, 255); return S(`O'nlik ${n} sonining 16 lik yozuvi?`, n.toString(16).toUpperCase(), [n + 1, n - 1, n + 3].map((x) => x.toString(16).toUpperCase())); },
    [
      ["Ma'lumotlar bazasidagi satr nima deb ataladi?", "Yozuv", ["Maydon", "Jadval", "Kalit"]],
      ["SQL nima?", "So'rovlar tili", ["Brauzer", "Antivirus", "Operatsion tizim"]],
      ["Excelda yig'indini hisoblovchi funksiya?", "SUM", ["COUNT", "AVERAGE", "MAX"]],
      ["Excelda o'rtacha qiymat funksiyasi?", "AVERAGE", ["SUM", "MAX", "IF"]],
      ["Excelda eng katta qiymatni topuvchi funksiya?", "MAX", ["MIN", "SUM", "IF"]],
      ["Excelda shartli funksiya?", "IF", ["SUM", "MAX", "COUNT"]],
    ]
  );
  add(G, 10,
    () => { const n = rnd(10, 255); return [`${n.toString(16).toUpperCase()} (16 lik) soni o'nlik tizimda nechaga teng?`, n]; },
    () => { const n = rnd(5, 255); return [`${n.toString(2)} (ikkilik) soni o'nlik tizimda nechaga teng?`, n]; },
    [
      ["HTTP protokolining standart porti?", 80], ["HTTPS protokolining standart porti?", 443],
      ["IPv4 manzil necha bitdan iborat?", 32], ["IPv6 manzil necha bitdan iborat?", 128],
      ["DNS vazifasi nima?", "Domen nomini IP-manzilga aylantirish", ["Fayllarni siqish", "Virus topish", "Rasm tahrirlash"]],
      ["Router nima qiladi?", "Tarmoqlarni bog'laydi", ["Matn chop etadi", "Rasm chizadi", "Ovoz yozadi"]],
      ["Brandmauer (firewall) nima uchun?", "Tarmoq xavfsizligi", ["Rasm tahrirlash", "Matn yozish", "O'yin"]],
    ]
  );
  add(G, 11,
    () => { const n = rnd(3, 9); return [`${n}! (faktorial) = ?`, fact(n)]; },
    () => { const n = rnd(2, 12); return [`Python: print(2 ** ${n}) natijasi?`, 2 ** n]; },
    [
      ["Binary search (ikkilik qidiruv) murakkabligi?", "O(log n)", ["O(n)", "O(n²)", "O(1)"]],
      ["Bubble sort murakkabligi?", "O(n²)", ["O(n)", "O(log n)", "O(1)"]],
      ["Rekursiya nima?", "Funksiyaning o'zini chaqirishi", ["Siklning to'xtashi", "Faylni siqish", "Xatoni yashirish"]],
      ["OOP ning asosiy tamoyillaridan biri?", "Inkapsulyatsiya", ["Rekursiya", "Kompilyatsiya", "Formatlash"]],
      ["Stack qaysi tamoyil bo'yicha ishlaydi?", "LIFO", ["FIFO", "LILO", "Tasodifiy"]],
      ["Queue (navbat) qaysi tamoyil bo'yicha ishlaydi?", "FIFO", ["LIFO", "LILO", "Tasodifiy"]],
      ["Massivda indekslash odatda nechadan boshlanadi?", 0],
      ["Git nima?", "Versiyalarni boshqarish tizimi", ["Brauzer", "Antivirus", "Matn muharriri"]],
    ]
  );
  return G;
}

// ============================== INGLIZ TILI ==============================
const VOCAB = [["cat", "mushuk"], ["dog", "it"], ["bird", "qush"], ["fish", "baliq"], ["horse", "ot"], ["cow", "sigir"], ["sheep", "qo'y"], ["goat", "echki"], ["chicken", "tovuq"], ["rabbit", "quyon"], ["lion", "sher"], ["tiger", "yo'lbars"], ["elephant", "fil"], ["monkey", "maymun"], ["bear", "ayiq"], ["wolf", "bo'ri"], ["fox", "tulki"], ["duck", "o'rdak"], ["mouse", "sichqon"], ["camel", "tuya"],
  ["red", "qizil"], ["blue", "ko'k"], ["green", "yashil"], ["yellow", "sariq"], ["black", "qora"], ["white", "oq"], ["pink", "pushti"], ["brown", "jigarrang"], ["grey", "kulrang"],
  ["mother", "ona"], ["father", "ota"], ["brother", "aka (uka)"], ["sister", "opa (singil)"], ["grandmother", "buvi"], ["grandfather", "bobo"], ["uncle", "amaki"], ["aunt", "xola"], ["son", "o'g'il"], ["daughter", "qiz farzand"],
  ["bread", "non"], ["milk", "sut"], ["water", "suv"], ["apple", "olma"], ["pear", "nok"], ["grape", "uzum"], ["pomegranate", "anor"], ["cheese", "pishloq"], ["egg", "tuxum"], ["meat", "go'sht"], ["rice", "guruch"], ["tea", "choy"], ["sugar", "shakar"], ["salt", "tuz"], ["butter", "sariyog'"],
  ["book", "kitob"], ["pen", "ruchka"], ["pencil", "qalam"], ["notebook", "daftar"], ["desk", "parta"], ["teacher", "o'qituvchi"], ["pupil", "o'quvchi"], ["school", "maktab"], ["lesson", "dars"], ["homework", "uy vazifasi"], ["blackboard", "doska"], ["bag", "sumka"],
  ["house", "uy"], ["door", "eshik"], ["window", "deraza"], ["table", "stol"], ["chair", "stul"], ["bed", "karavot"], ["kitchen", "oshxona"], ["garden", "bog'"], ["room", "xona"], ["roof", "tom"],
  ["run", "yugurmoq"], ["walk", "yurmoq"], ["read", "o'qimoq"], ["write", "yozmoq"], ["speak", "gapirmoq"], ["listen", "tinglamoq"], ["sleep", "uxlamoq"], ["eat", "yemoq"], ["drink", "ichmoq"], ["swim", "suzmoq"], ["open", "ochmoq"], ["close", "yopmoq"], ["buy", "sotib olmoq"], ["sell", "sotmoq"], ["help", "yordam bermoq"], ["learn", "o'rganmoq"], ["play", "o'ynamoq"], ["work", "ishlamoq"], ["think", "o'ylamoq"],
  ["big", "katta"], ["small", "kichik"], ["long", "uzun"], ["short", "qisqa"], ["fast", "tez"], ["slow", "sekin"], ["happy", "xursand"], ["sad", "xafa"], ["hot", "issiq"], ["cold", "sovuq"], ["new", "yangi"], ["old", "eski"], ["strong", "kuchli"], ["weak", "zaif"], ["clean", "toza"], ["dirty", "iflos"], ["easy", "oson"], ["difficult", "qiyin"], ["beautiful", "chiroyli"], ["clever", "aqlli"]];
const IRR = [["go", "went", "gone"], ["eat", "ate", "eaten"], ["see", "saw", "seen"], ["take", "took", "taken"], ["write", "wrote", "written"], ["buy", "bought", "bought"], ["come", "came", "come"], ["do", "did", "done"], ["drink", "drank", "drunk"], ["drive", "drove", "driven"], ["fly", "flew", "flown"], ["give", "gave", "given"], ["know", "knew", "known"], ["make", "made", "made"], ["run", "ran", "run"], ["say", "said", "said"], ["sing", "sang", "sung"], ["sit", "sat", "sat"], ["speak", "spoke", "spoken"], ["swim", "swam", "swum"], ["teach", "taught", "taught"], ["tell", "told", "told"], ["think", "thought", "thought"], ["win", "won", "won"], ["begin", "began", "begun"], ["break", "broke", "broken"], ["bring", "brought", "brought"], ["build", "built", "built"], ["choose", "chose", "chosen"], ["forget", "forgot", "forgotten"], ["get", "got", "got"], ["have", "had", "had"], ["hear", "heard", "heard"], ["leave", "left", "left"], ["meet", "met", "met"], ["sleep", "slept", "slept"]];
const reg = (b) => (b.endsWith("e") ? b + "d" : b + "ed");
const NUMW = [["one", 1], ["two", 2], ["three", 3], ["four", 4], ["five", 5], ["six", 6], ["seven", 7], ["eight", 8], ["nine", 9], ["ten", 10], ["eleven", 11], ["twelve", 12], ["thirteen", 13], ["fifteen", 15], ["twenty", 20], ["thirty", 30], ["fifty", 50], ["hundred", 100]];

function inglizTili() {
  const G = mk();
  spread(G, 1, 7, pairs((en) => `'${en}' so'zining tarjimasi?`, VOCAB));
  spread(G, 2, 8, pairs((uz) => `"${uz}" inglizcha qanday?`, VOCAB.map(([e, u]) => [u, e]).reverse()));
  add(G, 2, NUMW.map(([w, n]) => [`'${w}' raqamda nechchi?`, n]));
  add(G, 3, [
    ["I ___ a pupil.", "am", ["is", "are", "be"]], ["She ___ my sister.", "is", ["am", "are", "be"]],
    ["They ___ friends.", "are", ["am", "is", "be"]], ["He ___ a teacher.", "is", ["am", "are", "be"]],
    ["We ___ in the classroom.", "are", ["am", "is", "be"]], ["It ___ a cat.", "is", ["am", "are", "be"]],
    ["You ___ my friend.", "are", ["am", "is", "be"]], ["My name ___ Ali.", "is", ["am", "are", "be"]],
    ["There ___ a book on the table.", "is", ["are", "am", "be"]], ["There ___ two cats in the room.", "are", ["is", "am", "be"]],
    ["___ you a student?", "Are", ["Is", "Am", "Do"]], ["___ she a doctor?", "Is", ["Are", "Am", "Do"]],
  ]);
  add(G, 4, [
    ["One book, two ___.", "books", ["bookes", "book", "bookies"]], ["One child, two ___.", "children", ["childs", "childes", "childrens"]],
    ["One man, two ___.", "men", ["mans", "mens", "man"]], ["___ apple (a / an)", "an", ["a", "the", "–"]],
    ["___ dog (a / an)", "a", ["an", "the", "–"]], ["This is ___ umbrella.", "an", ["a", "the", "–"]],
    ["One woman, two ___.", "women", ["womans", "womens", "woman"]], ["One foot, two ___.", "feet", ["foots", "feets", "foot"]],
    ["One tooth, two ___.", "teeth", ["tooths", "teeths", "tooth"]], ["One box, two ___.", "boxes", ["boxs", "boxies", "box"]],
    ["___ orange (a / an)", "an", ["a", "the", "–"]], ["This is ___ pen.", "a", ["an", "the", "–"]],
    ["I ___ got a brother.", "have", ["has", "am", "is"]], ["She ___ got a cat.", "has", ["have", "am", "are"]],
  ]);
  add(G, 5, [
    ["She ___ to school every day.", "goes", ["go", "going", "gone"]], ["He ___ football now.", "is playing", ["plays", "play", "played"]],
    ["They ___ TV every evening.", "watch", ["watches", "watching", "watched"]], ["I ___ my homework now.", "am doing", ["do", "does", "did"]],
    ["Past tense of 'play'?", "played", ["plaied", "plays", "playing"]], ["Opposite of 'big'?", "small", ["tall", "long", "fat"]],
    ["Opposite of 'hot'?", "cold", ["warm", "big", "new"]], ["Opposite of 'happy'?", "sad", ["glad", "fast", "old"]],
    ["He ___ milk every morning.", "drinks", ["drink", "drinking", "drank"]], ["We ___ English now.", "are learning", ["learn", "learns", "learned"]],
    ["What ___ you do every day?", "do", ["does", "are", "is"]], ["___ he like tea?", "Does", ["Do", "Is", "Are"]],
  ]);
  spread(G, 5, 9, pairs((b) => `Past tense of '${b}'?`, IRR.map(([b, p]) => [b, p])).map((it, i) => [it[0], it[1], [reg(IRR[i][0]), IRR[i][2]]]));
  spread(G, 6, 9, IRR.filter(([, p, pp]) => p !== pp).map(([b, p, pp]) => [`Past participle of '${b}'?`, pp, [p, reg(b), b]]));
  add(G, 7, [
    ["Big – ___ – the biggest", "bigger", ["more big", "biger", "biggest"]], ["Good – ___ – the best", "better", ["gooder", "more good", "best"]],
    ["Beautiful – ___ – the most beautiful", "more beautiful", ["beautifuler", "most beautiful", "beautifuller"]],
    ["Bad – ___ – the worst", "worse", ["badder", "more bad", "worst"]], ["Tall – taller – ___", "the tallest", ["most tall", "the taller", "tallest of"]],
    ["There aren't ___ apples.", "many", ["much", "a little", "an"]], ["There isn't ___ water.", "much", ["many", "a few", "an"]],
    ["He is ___ than me.", "taller", ["more tall", "tallest", "tall"]], ["She is the ___ girl in class.", "cleverest", ["more clever", "cleverer", "clever"]],
    ["This book is ___ than that one.", "more interesting", ["interestinger", "most interesting", "interesting"]],
    ["I'm ___ a book now.", "reading", ["read", "reads", "to read"]], ["Yesterday I ___ to the park.", "went", ["go", "goes", "going"]],
  ]);
  add(G, 8, [
    ["I ___ already finished my homework.", "have", ["has", "had", "am"]], ["She ___ lived here since 2010.", "has", ["have", "had", "is"]],
    ["I think it ___ rain tomorrow.", "will", ["did", "has", "was"]], ["If it rains, we ___ stay at home.", "will", ["would", "did", "are"]],
    ["He ___ never been to London.", "has", ["have", "had", "did"]], ["I ___ to Paris last year.", "went", ["have gone", "go", "was going"]],
    ["They have lived here ___ five years.", "for", ["since", "ago", "from"]], ["She has worked here ___ 2015.", "since", ["for", "ago", "from"]],
    ["While I ___ TV, the phone rang.", "was watching", ["watched", "watch", "am watching"]], ["I ___ my keys. I can't find them.", "have lost", ["lost", "lose", "was losing"]],
    ["You ___ wear a seat belt. It's the law.", "must", ["may", "can", "need"]], ["___ I open the window?", "Can", ["Must", "Do", "Am"]],
  ]);
  add(G, 9, [
    ["The book ___ by Tom. (write, Past Passive)", "was written", ["wrote", "is wrote", "has write"]],
    ["English ___ all over the world.", "is spoken", ["speaks", "is speak", "speaked"]],
    ["If I ___ rich, I would travel.", "were", ["am", "will be", "have been"]], ["She said she ___ tired.", "was", ["is", "will be", "has been"]],
    ["I wish I ___ more time.", "had", ["have", "has", "will have"]], ["The window ___ by the boy yesterday.", "was broken", ["broke", "is broke", "has break"]],
    ["He asked me where I ___.", "lived", ["live", "do live", "am living"]], ["If she studies hard, she ___ the exam.", "will pass", ["would pass", "passed", "passes"]],
    ["The car ___ now. (repair)", "is being repaired", ["is repaired", "repairs", "was repair"]], ["I ___ him for ten years when he called.", "had known", ["knew", "know", "have known"]],
  ]);
  add(G, 10, [
    ["You ___ smoke here. It's forbidden.", "mustn't", ["needn't", "don't have to", "may"]], ["By next year I ___ graduated.", "will have", ["would", "have", "am"]],
    ["He suggested ___ to the cinema.", "going", ["to go", "go", "went"]], ["I'm used to ___ up early.", "getting", ["get", "got", "to get"]],
    ["Neither of them ___ here.", "is", ["are", "were", "be"]], ["I look forward to ___ you.", "seeing", ["see", "saw", "to see"]],
    ["She enjoys ___ books.", "reading", ["to read", "read", "reads"]], ["He promised ___ on time.", "to come", ["coming", "come", "came"]],
    ["If I ___ you, I would apologise.", "were", ["am", "was being", "be"]], ["Had I known, I ___ come.", "would have", ["will", "would", "had"]],
  ]);
  add(G, 11, [
    ["Hardly had he arrived ___ it started to rain.", "when", ["than", "then", "as"]], ["No sooner had she left ___ he called.", "than", ["when", "then", "that"]],
    ["Not only ___ smart, but also kind.", "is she", ["she is", "does she", "she does"]], ["The more you practise, ___ you become.", "the better", ["better", "best", "the best"]],
    ["I'd rather you ___ me tomorrow.", "called", ["call", "will call", "calling"]], ["He denied ___ the window.", "breaking", ["to break", "break", "broke"]],
    ["Were he here, he ___ help us.", "would", ["will", "had", "does"]], ["It's high time we ___ home.", "went", ["go", "will go", "going"]],
    ["Seldom ___ such a beautiful view.", "have I seen", ["I have seen", "I saw", "did I seen"]], ["She suggested that he ___ a doctor.", "see", ["sees", "saw", "seeing"]],
  ]);
  return G;
}

// ============================== TARIX ==============================
const EVENTS = [["Amir Temur tug'ilgan yil?", 1336], ["Amir Temur vafot etgan yil?", 1405], ["Mirzo Ulug'bek vafot etgan yil?", 1449], ["Zahiriddin Bobur tug'ilgan yil?", 1483], ["Alisher Navoiy tug'ilgan yil?", 1441], ["Alisher Navoiy vafot etgan yil?", 1501], ["Ankara jangi bo'lgan yil?", 1402], ["Kolumb Amerikani kashf etgan yil?", 1492], ["Bobur Panipat jangida g'alaba qozongan yil?", 1526], ["Usmonlilar Konstantinopolni egallagan yil?", 1453], ["Chingizxon Xorazmshohlar davlatiga hujum boshlagan yil?", 1219], ["Jaloliddin Manguberdi Parvon jangida g'alaba qozongan yil?", 1221], ["Rossiya Toshkentni egallagan yil?", 1865], ["Buxoro amirligi Rossiyaga qaram bo'lib qolgan yil?", 1868], ["Xiva xonligi Rossiyaga qaram bo'lib qolgan yil?", 1873], ["Qo'qon xonligi tugatilgan yil?", 1876], ["Birinchi jahon urushi boshlangan yil?", 1914], ["Birinchi jahon urushi tugagan yil?", 1918], ["Rossiyada Oktyabr to'ntarishi bo'lgan yil?", 1917], ["O'zbekiston SSR tuzilgan yil?", 1924], ["Ikkinchi jahon urushi boshlangan yil?", 1939], ["Ikkinchi jahon urushi tugagan yil?", 1945], ["Germaniya SSSRga hujum qilgan yil?", 1941], ["BMT tashkil topgan yil?", 1945], ["Yuriy Gagarin kosmosga uchgan yil?", 1961], ["Berlin devori qulagan yil?", 1989], ["AQSh Mustaqillik deklaratsiyasi qabul qilingan yil?", 1776], ["Buyuk Fransuz inqilobi boshlangan yil?", 1789], ["Vaterloo jangi bo'lgan yil?", 1815], ["Insonning Oyga birinchi qadami qo'yilgan yil?", 1969], ["Chernobil fojiasi bo'lgan yil?", 1986], ["O'zbekiston mustaqillikka erishgan yil?", 1991], ["O'zbekiston Konstitutsiyasi qabul qilingan yil?", 1992], ["O'zbekistonda milliy valyuta (so'm) joriy etilgan yil?", 1994], ["O'zbekiston BMTga a'zo bo'lgan yil?", 1992], ["Temuriylar davlati asos solingan yil?", 1370], ["Hijra (Makkadan Madinaga ko'chish) qaysi yilda?", 622], ["G'arbiy Rim imperiyasi qulagan yil?", 476], ["Arablar Samarqandni egallagan yil (Qutayba)?", 712], ["SSSR tarqalgan yil?", 1991]];

function tarix() {
  const G = mk();
  add(G, 1, [
    ["O'zbekiston poytaxti qaysi shahar?", "Toshkent", ["Samarqand", "Buxoro", "Xiva"]],
    ["Mustaqillik kuni qachon nishonlanadi?", "1-sentabr", ["1-may", "8-dekabr", "21-mart"]],
    ["Navro'z qaysi faslda nishonlanadi?", "Bahor", ["Yoz", "Kuz", "Qish"]],
    ["Vatanimiz nomi nima?", "O'zbekiston", ["Qozog'iston", "Qirg'iziston", "Turkmaniston"]],
    ["Konstitutsiya kuni qachon nishonlanadi?", "8-dekabr", ["1-sentabr", "1-may", "21-mart"]],
    ["Navro'z bayrami qachon nishonlanadi?", "21-mart", ["1-sentabr", "8-dekabr", "9-may"]],
    ["O'qituvchilar va murabbiylar kuni?", "1-oktabr", ["1-sentabr", "8-dekabr", "21-mart"]],
    ["Davlat bayrog'ida nechta yulduz bor?", 12],
  ]);
  add(G, 2, [
    ["Amir Temur qaysi shaharda tug'ilgan?", "Kesh (Shahrisabz)", ["Samarqand", "Buxoro", "Toshkent"]],
    ["Amir Temur davlatining poytaxti?", "Samarqand", ["Toshkent", "Buxoro", "Xiva"]],
    ["Mirzo Ulug'bek kim bo'lgan?", "Astronom olim", ["Savdogar", "Rassom", "Haykaltarosh"]],
    ["Alisher Navoiy kim bo'lgan?", "Shoir va mutafakkir", ["Savdogar", "Rassom", "Kosmonavt"]],
    ["Al-Xorazmiy qaysi fan asoschilaridan?", "Algebra", ["Kimyo", "Biologiya", "Geografiya"]],
    ["Ibn Sino kim bo'lgan?", "Buyuk tabib va olim", ["Sarkarda", "Rassom", "Savdogar"]],
    ["Imom Buxoriy nima bilan mashhur?", "Hadis to'plami", ["Astronomiya", "Algebra", "Sarkardalik"]],
    ["Bobur asos solgan davlat?", "Boburiylar", ["Somoniylar", "Temuriylar", "Xorazmshohlar"]],
  ]);
  add(G, 3, [
    ["Buyuk Ipak yo'li nimani bog'lagan?", "Sharq va G'arbni", ["Shimol va Janubni", "Faqat Xitoyni", "Faqat dengizlarni"]],
    ["Ipak yo'li orqali Xitoydan nima keltirilgan?", "Ipak", ["Neft", "Gaz", "Plastmassa"]],
    ["Registon maydoni qaysi shaharda?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"]],
    ["Ichan qal'a qaysi shaharda?", "Xiva", ["Samarqand", "Buxoro", "Toshkent"]],
    ["Ark qal'asi qaysi shaharda?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"]],
    ["Shohi Zinda qaysi shaharda?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"]],
    ["Bibixonim masjidi qaysi shaharda?", "Samarqand", ["Buxoro", "Xiva", "Qarshi"]],
    ["Poyi Kalon majmuasi qaysi shaharda?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"]],
    ["Kalta minor qaysi shaharda?", "Xiva", ["Buxoro", "Samarqand", "Termiz"]],
  ]);
  add(G, 4, [
    ["'Boburnoma' muallifi?", "Zahiriddin Muhammad Bobur", ["Alisher Navoiy", "Amir Temur", "Mirzo Ulug'bek"]],
    ["Temuriylar davlatining asoschisi?", "Amir Temur", ["Mirzo Ulug'bek", "Bobur", "Navoiy"]],
    ["Ulug'bek rasadxonasi qaysi shaharda qurilgan?", "Samarqand", ["Buxoro", "Xiva", "Toshkent"]],
    ["Somoniylar davlatining poytaxti?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"]],
    ["Xorazmshohlar davlatining mashhur hukmdori Jaloliddin kim?", "Manguberdi", ["Temur", "Bobur", "Ulug'bek"]],
    ["'Zij' asarining muallifi?", "Mirzo Ulug'bek", ["Navoiy", "Bobur", "Ibn Sino"]],
  ]);
  add(G, 5, [
    ["Qadimgi Misrda hukmdor qanday atalgan?", "Fir'avn", ["Imperator", "Sulton", "Amir"]],
    ["Qadimgi Misr qaysi daryo bo'yida joylashgan?", "Nil", ["Dajla", "Amudaryo", "Volga"]],
    ["Olimpiya o'yinlari qaysi mamlakatda boshlangan?", "Qadimgi Yunoniston", ["Qadimgi Misr", "Qadimgi Xitoy", "Qadimgi Hindiston"]],
    ["Qadimgi Rim davlatining poytaxti?", "Rim", ["Afina", "Karfagen", "Sparta"]],
    ["Eng mashhur Misr inshootlari?", "Piramidalar", ["Minoralar", "Qal'alar", "Ko'priklar"]],
    ["Qadimgi Yunonistonda demokratiya qaysi shaharda paydo bo'lgan?", "Afina", ["Sparta", "Rim", "Misr"]],
    ["Qadimgi Rimda hukmdor qanday atalgan?", "Imperator", ["Fir'avn", "Amir", "Xon"]],
    ["Buyuk Xitoy devori nima uchun qurilgan?", "Chegarani himoya qilish uchun", ["Savdo uchun", "Sug'orish uchun", "Ibodat uchun"]],
  ]);
  add(G, 6, [
    ["Jaloliddin Manguberdi qaysi davlat hukmdori edi?", "Xorazmshohlar", ["Temuriylar", "Somoniylar", "Qoraxoniylar"]],
    ["Somoniylar davlatining poytaxti?", "Buxoro", ["Samarqand", "Xiva", "Toshkent"]],
    ["Buyuk Xitoy devori qaysi davlatda joylashgan?", "Xitoy", ["Hindiston", "Eron", "Mo'g'uliston"]],
    ["Somoniylar davlatining asoschisi?", "Ismoil Somoniy", ["Amir Temur", "Bobur", "Ulug'bek"]],
    ["Mo'g'ul imperiyasining asoschisi?", "Chingizxon", ["Amir Temur", "Bobur", "Attila"]],
    ["Qoraxoniylar davlati qaysi asrlarda hukm surgan?", "X–XIII asrlar", ["I–III asrlar", "XVI–XVIII asrlar", "XIX asr"]],
  ]);
  add(G, 7, [
    ["Bobur Hindistonda qaysi davlatga asos solgan?", "Boburiylar davlati", ["Temuriylar davlati", "Usmoniylar davlati", "Safaviylar davlati"]],
    ["Bobur qaysi shaharda tug'ilgan?", "Andijon", ["Samarqand", "Buxoro", "Toshkent"]],
    ["Xiva xonligi poytaxti?", "Xiva", ["Buxoro", "Qo'qon", "Samarqand"]],
    ["Qo'qon xonligi poytaxti?", "Qo'qon", ["Xiva", "Buxoro", "Toshkent"]],
    ["Buxoro amirligi poytaxti?", "Buxoro", ["Xiva", "Qo'qon", "Samarqand"]],
    ["Shayboniylar davlatining asoschisi?", "Muhammad Shayboniyxon", ["Amir Temur", "Bobur", "Ulug'bek"]],
  ]);
  add(G, 8, [
    ["Rossiya Turkiston general-gubernatorligi qachon tuzilgan (1867)?", "1867-yil", ["1865-yil", "1876-yil", "1900-yil"]],
    ["Turkiston general-gubernatorligining birinchi general-gubernatori?", "K. fon Kaufman", ["Chernyayev", "Skobelev", "Nikolay II"]],
    ["Jadidchilik harakati nimani talab qilgan?", "Yangi usul maktablar va islohotlar", ["Yangi urush", "Soliqni oshirish", "Savdoni to'xtatish"]],
  ]);
  spread(G, 6, 11, EVENTS);
  add(G, 9, [
    ["Jadidchilik harakati vakillaridan biri?", "Mahmudxo'ja Behbudiy", ["Amir Temur", "Alisher Navoiy", "Bobur"]],
    ["O'zbekiston mustaqilligi e'lon qilingan sana?", "1991-yil 31-avgust", ["1991-yil 1-sentabr", "1992-yil 8-dekabr", "1990-yil 20-iyun"]],
    ["Cho'lpon kim bo'lgan?", "Jadid shoiri va yozuvchi", ["Sarkarda", "Astronom", "Savdogar"]],
    ["Abdulla Avloniy nima bilan mashhur?", "Jadid ma'rifatparvari", ["Sarkarda", "Astronom", "Haykaltarosh"]],
  ]);
  add(G, 10, [
    ["O'zbekistonning birinchi Prezidenti kim?", "Islom Karimov", ["Shavkat Mirziyoyev", "Abdulla Oripov", "Rustam Azimov"]],
    ["O'zbekistonning ikkinchi Prezidenti kim?", "Shavkat Mirziyoyev", ["Islom Karimov", "Abdulla Oripov", "Rustam Azimov"]],
    ["O'zbekiston davlat madhiyasi qachon qabul qilingan?", "1992-yil", ["1991-yil", "1994-yil", "2000-yil"]],
  ]);
  add(G, 11, [
    ["Sovuq urush asosan qaysi ikki davlat o'rtasida bo'lgan?", "AQSh va SSSR", ["Xitoy va Hindiston", "Angliya va Fransiya", "Yaponiya va Koreya"]],
    ["Kosmosga uchgan birinchi inson?", "Yuriy Gagarin", ["Neyl Armstrong", "German Titov", "Aleksey Leonov"]],
    ["Yevropa Ittifoqi Maastrixt shartnomasi asosida tuzilgan yil?", 1993],
    ["NATO tashkil topgan yil?", 1949],
    ["Oyga birinchi qadam qo'ygan inson?", "Neyl Armstrong", ["Yuriy Gagarin", "Buzz Oldrin", "Mayk Kollinz"]],
  ]);
  return G;
}

// ============================== ONA TILI ==============================
const ANT = [["katta", "kichik"], ["baland", "past"], ["uzun", "qisqa"], ["keng", "tor"], ["yengil", "og'ir"], ["tez", "sekin"], ["yangi", "eski"], ["to'g'ri", "noto'g'ri"], ["quvnoq", "xafa"], ["kuchli", "zaif"], ["issiq", "sovuq"], ["shirin", "achchiq"], ["toza", "iflos"], ["qimmat", "arzon"], ["ochiq", "yopiq"], ["do'st", "dushman"], ["kelmoq", "ketmoq"], ["boy", "kambag'al"], ["semiz", "oriq"], ["chuqur", "sayoz"], ["yorug'", "qorong'i"], ["erta", "kech"], ["kun", "tun"], ["yaxshi", "yomon"]];
const SYN = [["chiroyli", "go'zal"], ["yer", "zamin"], ["osmon", "falak"], ["dono", "oqil"], ["jasur", "botir"], ["ko'p", "serob"], ["ota", "dada"], ["tinch", "osoyishta"], ["yosh", "navqiron"], ["mehnat", "zahmat"]];
const WORDCLASS = [["kitob", "Ot"], ["yaxshi", "Sifat"], ["yozdi", "Fe'l"], ["beshinchi", "Son"], ["biz", "Olmosh"], ["tez", "Ravish"], ["o'qiydi", "Fe'l"], ["baland", "Sifat"], ["maktab", "Ot"], ["olti", "Son"], ["sen", "Olmosh"], ["sekin", "Ravish"], ["chiroyli", "Sifat"], ["bolalar", "Ot"], ["kuladi", "Fe'l"], ["u", "Olmosh"], ["ancha", "Ravish"], ["yugurdi", "Fe'l"], ["daftar", "Ot"], ["o'n", "Son"], ["qizil", "Sifat"], ["kecha", "Ravish"]];
const SYLL = [["qalam", 2], ["kitob", 2], ["daftar", 2], ["o'qituvchi", 4], ["maktab", 2], ["bolalar", 3], ["Vatan", 2], ["Toshkent", 2], ["Samarqand", 3], ["olma", 2], ["o'quvchi", 3], ["kitobxona", 4], ["do'st", 1], ["ona", 2], ["Buxoro", 3], ["mehribon", 3], ["o'zbek", 2], ["sinfdosh", 2]];
const STEMS = ["kitob", "maktab", "daftar", "qalam", "uy", "bog'", "shahar", "ona"];
const CASES = [["ning", "Qaratqich"], ["ni", "Tushum"], ["ga", "Jo'nalish"], ["da", "O'rin-payt"], ["dan", "Chiqish"]];

function onaTili() {
  const G = mk();
  add(G, 1, [
    ["O'zbek lotin alifbosida nechta harf bor?", 29], ["Alifbodagi unli harflar soni?", 6],
    ["Alifbo qaysi harf bilan boshlanadi?", "A", ["B", "D", "O"]], ["Gap oxirida nima qo'yiladi?", "Nuqta", ["Vergul", "Tire", "Qavs"]],
    ["Gap qaysi harf bilan boshlanadi?", "Bosh harf", ["Kichik harf", "Raqam", "Belgi"]], ["Kishi ismlari qanday yoziladi?", "Bosh harf bilan", ["Kichik harf bilan", "Qavs ichida", "Raqam bilan"]],
    ["Qaysi biri unli harf?", "A", ["B", "D", "T"]], ["Qaysi biri undosh harf?", "M", ["A", "O", "I"]],
  ], pairs((x, y) => `'${x}' so'zida nechta bo'g'in bor?`, SYLL));
  add(G, 2, [
    ["Ot qaysi savolga javob bo'ladi?", "Kim? Nima?", ["Qanday?", "Nima qildi?", "Qancha?"]],
    ["Sifat qaysi savolga javob bo'ladi?", "Qanday?", ["Kim?", "Nima qildi?", "Qancha?"]],
    ["Fe'l qaysi savolga javob bo'ladi?", "Nima qildi?", ["Kim?", "Qanday?", "Qancha?"]],
    ["Son qaysi savolga javob bo'ladi?", "Qancha?", ["Kim?", "Qanday?", "Nima qildi?"]],
    ["'Qizil' qaysi so'z turkumi?", "Sifat", ["Ot", "Fe'l", "Son"]], ["'Yozdi' qaysi so'z turkumi?", "Fe'l", ["Ot", "Sifat", "Son"]],
  ]);
  spread(G, 2, 5, pairs((x) => `"${x}" so'zining zid ma'nosi?`, ANT));
  spread(G, 3, 6, pairs((x) => `"${x}" so'zining zid ma'nosi?`, ANT.map(([a, b]) => [b, a]).reverse()));
  spread(G, 4, 7, pairs((x) => `"${x}" so'zining ma'nodoshi (sinonimi) qaysi?`, SYN));
  add(G, 3, [
    ["Darak gap oxiriga qanday belgi qo'yiladi?", "Nuqta", ["Vergul", "Tire", "Qo'shtirnoq"]],
    ["So'roq gap oxiriga qanday belgi qo'yiladi?", "So'roq belgisi", ["Nuqta", "Vergul", "Undov belgisi"]],
    ["Undov gap oxiriga qanday belgi qo'yiladi?", "Undov belgisi", ["Nuqta", "Vergul", "Tire"]],
    ["Bir turdagi bo'laklar orasiga nima qo'yiladi?", "Vergul", ["Nuqta", "Tire", "Qavs"]],
  ]);
  spread(G, 3, 7, pairs((x) => `"${x}" qaysi so'z turkumi?`, WORDCLASS));
  add(G, 4, [["Otning kelishiklari soni nechta?", 6]]);
  const caseItems = STEMS.flatMap((s) => CASES.map(([suf, name]) => [`"${s}${suf}" so'zi qaysi kelishikda?`, name]));
  spread(G, 4, 7, caseItems);
  add(G, 4, [
    ["Qaratqich kelishigi qaysi savolga javob beradi?", "Kimning? Nimaning?", ["Kimni? Nimani?", "Kimga? Nimaga?", "Kimda? Nimada?"]],
    ["Tushum kelishigi qaysi savolga javob beradi?", "Kimni? Nimani?", ["Kimning? Nimaning?", "Kimga? Nimaga?", "Kimda? Nimada?"]],
    ["Jo'nalish kelishigi qaysi savolga javob beradi?", "Kimga? Nimaga?", ["Kimni? Nimani?", "Kimdan? Nimadan?", "Kimda? Nimada?"]],
    ["O'rin-payt kelishigi qaysi savolga javob beradi?", "Kimda? Nimada?", ["Kimga? Nimaga?", "Kimdan? Nimadan?", "Kimni? Nimani?"]],
    ["Chiqish kelishigi qaysi savolga javob beradi?", "Kimdan? Nimadan?", ["Kimda? Nimada?", "Kimga? Nimaga?", "Kimni? Nimani?"]],
  ]);
  add(G, 5, [
    ["'Men' so'zi qaysi so'z turkumi?", "Olmosh", ["Ot", "Son", "Fe'l"]], ["'Besh' so'zi qaysi so'z turkumi?", "Son", ["Ot", "Olmosh", "Sifat"]],
    ["'Va' so'zi qaysi so'z turkumi?", "Bog'lovchi", ["Ko'makchi", "Yuklama", "Undov"]], ["'Uchun' so'zi qaysi so'z turkumi?", "Ko'makchi", ["Bog'lovchi", "Yuklama", "Undov"]],
    ["'Voy!' so'zi qaysi so'z turkumi?", "Undov", ["Ravish", "Bog'lovchi", "Olmosh"]], ["'Faqat' so'zi qaysi so'z turkumi?", "Yuklama", ["Bog'lovchi", "Ko'makchi", "Ot"]],
  ]);
  add(G, 6, [
    ["Fe'l zamonlari nechta asosiy turga bo'linadi?", 3],
    ["'Bordi' fe'li qaysi zamonda?", "O'tgan zamon", ["Hozirgi zamon", "Kelasi zamon", "Buyruq mayli"]],
    ["'O'qiyapti' fe'li qaysi zamonda?", "Hozirgi zamon", ["O'tgan zamon", "Kelasi zamon", "Buyruq mayli"]],
    ["'Yozadi' fe'li qaysi zamonda?", "Kelasi zamon", ["O'tgan zamon", "Hozirgi zamon", "Buyruq mayli"]],
    ["Gapning bosh bo'laklari: ega va ___", "kesim", ["to'ldiruvchi", "aniqlovchi", "hol"]],
    ["Ega qaysi savolga javob beradi?", "Kim? Nima?", ["Nima qildi?", "Qanday?", "Qachon?"]],
    ["Kesim qaysi savolga javob beradi?", "Nima qildi?", ["Kim?", "Qanday?", "Qaysi?"]],
  ]);
  add(G, 7, [
    ["Ikkinchi darajali bo'laklar nechta (aniqlovchi, to'ldiruvchi, hol)?", 3],
    ["Aniqlovchi qaysi savollarga javob beradi?", "Qanday? Qaysi? Qancha?", ["Kimni? Nimani?", "Qachon? Qayerda?", "Nima qildi?"]],
    ["To'ldiruvchi qaysi savollarga javob beradi?", "Kimni? Nimani? Kimga?", ["Qanday?", "Qachon?", "Nima qildi?"]],
    ["Hol qaysi savollarga javob beradi?", "Qachon? Qayerda? Qanday?", ["Kim?", "Nima?", "Kimning?"]],
    ["Sodda gapda nechta asosiy kesim bo'ladi?", 1],
  ]);
  add(G, 8, [
    ["Qaysi so'z zidlov bog'lovchisi?", "lekin", ["va", "hamda", "yoki"]], ["Qaysi so'z biriktiruv bog'lovchisi?", "va", ["lekin", "ammo", "yoki"]],
    ["Qaysi so'z ayiruv bog'lovchisi?", "yoki", ["va", "lekin", "hamda"]], ["Undalma gapda qanday ajratiladi?", "Vergul bilan", ["Nuqta bilan", "Tire bilan", "Ikki nuqta bilan"]],
    ["Qo'shma gap qismlarida kamida nechta kesim bo'ladi?", 2], ["Qaysi so'z zidlov bog'lovchisi?", "ammo", ["va", "hamda", "yoki"]],
  ]);
  add(G, 9, [
    ["Fonetika nimani o'rganadi?", "Tovushlarni", ["So'zlarni", "Gaplarni", "Imloni"]],
    ["Leksikologiya nimani o'rganadi?", "So'z boyligini", ["Tovushlarni", "Gap tuzilishini", "Imloni"]],
    ["Morfologiya nimani o'rganadi?", "So'z turkumlarini", ["Tovushlarni", "Tinish belgilarini", "So'z boyligini"]],
    ["Sintaksis nimani o'rganadi?", "So'z birikmasi va gapni", ["Tovushlarni", "So'z yasalishini", "Imloni"]],
    ["Ko'chirma gap qaysi belgi ichida yoziladi?", "Qo'shtirnoq", ["Qavs", "Kvadrat qavs", "Tire"]],
    ["Orfografiya nimani o'rganadi?", "To'g'ri yozish qoidalarini", ["Tovushlarni", "Gap turini", "So'z boyligini"]],
  ]);
  add(G, 10, [
    ["Nutq uslublari (asosiy) nechta?", 5],
    ["Rasmiy uslub qaysi sohada qo'llaniladi?", "Hujjatlarda", ["Badiiy asarda", "Do'stona suhbatda", "Reklamada"]],
    ["Frazeologizm nima?", "Turg'un birikma", ["Yakka so'z", "Qo'shma gap", "Tovush"]],
    ["Antonim nima?", "Zid ma'noli so'z", ["Ma'nodosh so'z", "Shakldosh so'z", "Eskirgan so'z"]],
    ["Omonim nima?", "Shakldosh so'z", ["Ma'nodosh so'z", "Zid ma'noli so'z", "Yangi so'z"]],
    ["Sinonim nima?", "Ma'nodosh so'z", ["Zid ma'noli so'z", "Shakldosh so'z", "Yangi so'z"]],
    ["Arxaizm nima?", "Eskirgan so'z", ["Yangi so'z", "Shakldosh so'z", "Zid ma'noli so'z"]],
    ["Neologizm nima?", "Yangi paydo bo'lgan so'z", ["Eskirgan so'z", "Zid ma'noli so'z", "Turg'un birikma"]],
  ]);
  add(G, 11, [
    ["O'zbek tili davlat tili deb e'lon qilingan yil?", 1989], ["Lotin yozuviga o'tish haqidagi qonun qabul qilingan yil?", 1993],
    ["O'zbek tili qaysi til oilasiga kiradi?", "Turkiy tillar", ["Hind-yevropa", "Slavyan", "German"]],
    ["1929-yilgacha o'zbek tili qaysi yozuvda yozilgan?", "Arab yozuvi", ["Kirill", "Lotin", "Yunon"]],
    ["O'zbek yozuvi kirill alifbosiga qaysi yilda o'tkazilgan?", 1940],
    ["Til bayrami (O'zbek tili bayrami) qachon nishonlanadi?", "21-oktabr", ["1-sentabr", "8-dekabr", "9-may"]],
  ]);
  return G;
}

// ============================== ADABIYOT ==============================
const WORKS = [["O'tkan kunlar", "Abdulla Qodiriy"], ["Mehrobdan chayon", "Abdulla Qodiriy"], ["Kecha va kunduz", "Cho'lpon"], ["Sarob", "Abdulla Qahhor"], ["Sinchalak", "Abdulla Qahhor"], ["Qutlug' qon", "Oybek"], ["Navoiy (roman)", "Oybek"], ["Boburnoma", "Zahiriddin Bobur"], ["Xamsa", "Alisher Navoiy"], ["Layli va Majnun (doston)", "Alisher Navoiy"], ["Farhod va Shirin", "Alisher Navoiy"], ["Sab'ai sayyor", "Alisher Navoiy"], ["Hayrat ul-abror", "Alisher Navoiy"], ["Qutadg'u bilig", "Yusuf Xos Hojib"], ["Devonu lug'atit turk", "Mahmud Koshg'ariy"], ["Hikmat", "Ahmad Yassaviy"], ["Dunyoning ishlari", "O'tkir Hoshimov"], ["Ikki eshik orasi", "O'tkir Hoshimov"], ["Shum bola", "G'afur G'ulom"], ["Padarkush", "Mahmudxo'ja Behbudiy"], ["Turkiy guliston yohud axloq", "Abdulla Avloniy"], ["Boy ila xizmatchi", "Hamza"], ["Oygul bilan Baxtiyor", "Hamid Olimjon"], ["Hamlet", "Uilyam Shekspir"], ["Romeo va Juletta", "Uilyam Shekspir"], ["Don Kixot", "Migel de Servantes"], ["Dubrovskiy", "Aleksandr Pushkin"], ["Urush va tinchlik", "Lev Tolstoy"], ["Jinoyat va jazo", "Fyodor Dostoyevskiy"], ["Robinzon Kruzo", "Daniel Defo"], ["Gulliverning sayohatlari", "Jonatan Svift"], ["Muhokamat ul-lug'atayn", "Alisher Navoiy"], ["Saddi Iskandariy", "Alisher Navoiy"], ["Mahbub ul-qulub", "Alisher Navoiy"], ["Hibat ul-haqoyiq", "Ahmad Yugnakiy"]];

function adabiyot() {
  const G = mk();
  add(G, 1, [
    ["'Zumrad va Qimmat' qaysi janr?", "Ertak", ["She'r", "Maqol", "Topishmoq"]], ["'Mehnat – rohat kaliti' qaysi janr?", "Maqol", ["Ertak", "She'r", "Hikoya"]],
    ["Javobi yashirin savol-tasvir qaysi janr?", "Topishmoq", ["Maqol", "Ertak", "Doston"]], ["Qofiyali, ohangdor matn qaysi janr?", "She'r", ["Maqol", "Ertak", "Hikoya"]],
    ["'Kal va ayiq' qaysi janr?", "Ertak", ["She'r", "Maqol", "Topishmoq"]], ["'Ko'p bilgan – ko'p yutadi' qaysi janr?", "Maqol", ["Ertak", "She'r", "Doston"]],
    ["Ertaklar odatda qanday tugaydi?", "Yaxshilik g'alabasi bilan", ["Yomonlik g'alabasi bilan", "Urush bilan", "Sirli yakun bilan"]],
  ]);
  add(G, 2, [
    ["Alisher Navoiy kim bo'lgan?", "Shoir", ["Rassom", "Astronom", "Haykaltarosh"]], ["Abdulla Qodiriy kim bo'lgan?", "Yozuvchi", ["Rassom", "Astronom", "Haykaltarosh"]],
    ["Zahiriddin Muhammad Bobur kim bo'lgan?", "Shoir va hukmdor", ["Rassom", "Savdogar", "Tabib"]], ["Mirzo Ulug'bek kim bo'lgan?", "Olim va hukmdor", ["Rassom", "Savdogar", "Shoir"]],
    ["Maqol nima?", "Qisqa hikmatli ibora", ["Uzun doston", "Roman", "Drama"]], ["Hikoya nima?", "Kichik hajmli nasriy asar", ["She'r", "Doston", "Maqol"]],
  ]);
  spread(G, 3, 11, pairs((w) => `"${w}" asarining muallifi?`, WORKS));
  spread(G, 4, 11, pairs((a) => `Quyidagilardan qaysi biri ${a}ga tegishli asar?`, WORKS.map(([w, a]) => [a, w]).reverse()));
  add(G, 4, [
    ["'Boburnoma' qaysi janrga kiradi?", "Memuar", ["Roman", "Doston", "Ertak"]], ["Hikoya qaysi adabiy turga kiradi?", "Epik", ["Lirik", "Dramatik", "Ilmiy"]],
    ["She'r qaysi adabiy turga kiradi?", "Lirik", ["Epik", "Dramatik", "Hujjatli"]], ["Drama qaysi adabiy turga kiradi?", "Dramatik", ["Lirik", "Epik", "Ilmiy"]],
    ["Navoiy asarlari asosan qaysi tilda yozilgan?", "Chig'atoy tili", ["Arab tili", "Fors tili", "Rus tili"]],
  ]);
  add(G, 5, [
    ["Tashbeh nima?", "O'xshatish", ["Mubolag'a", "Jonlantirish", "Qarama-qarshi qo'yish"]],
    ["Jonlantirish (tajassum) nima?", "Jonsiz narsaga jon bag'ishlash", ["O'xshatish", "Bo'rttirish", "Qofiya"]],
    ["Mubolag'a nima?", "Bo'rttirish", ["O'xshatish", "Jonlantirish", "Qofiya"]], ["Epitet nima?", "Ta'rif beruvchi so'z", ["O'xshatish", "Bo'rttirish", "Ishora"]],
    ["Qofiya nima?", "Misra oxiridagi tovush uyg'unligi", ["She'r nomi", "Muallif ismi", "Asar hajmi"]], ["Bayt necha misradan iborat?", 2],
    ["Band nima?", "She'rning bir necha misradan iborat qismi", ["Muallif nomi", "Asar nomi", "Qofiya"]],
  ]);
  add(G, 6, [
    ["'Sinchalak' qaysi janrga kiradi?", "Qissa", ["She'r", "Doston", "Drama"]], ["'Dunyoning ishlari' qaysi janrga kiradi?", "Qissa", ["She'r", "Doston", "Drama"]],
    ["Roman nima?", "Katta hajmli nasriy asar", ["Qisqa she'r", "Maqol", "Topishmoq"]], ["Qissa hajmi jihatidan qaysi o'rinda?", "Hikoya va roman o'rtasida", ["Hikoyadan kichik", "Romandan katta", "She'rga teng"]],
  ]);
  add(G, 7, [
    ["Navoiy 'Xamsa'si nechta dostondan iborat?", 5], ["'Layli va Majnun' (Navoiy) qaysi janrda?", "Doston", ["Roman", "Hikoya", "Drama"]],
    ["'Hayrat ul-abror' qaysi asar tarkibiga kiradi?", "Xamsa", ["Boburnoma", "Qutadg'u bilig", "Devonu lug'atit turk"]],
    ["'Muhokamat ul-lug'atayn' nimani solishtiradi?", "Turkiy va fors tillarini", ["Tarixni", "Tibbiyotni", "Falakiyotni"]],
    ["Navoiyning fors tilidagi taxallusi?", "Foniy", ["Hofiz", "Mashrab", "Bobur"]], ["Navoiyning turkiy tildagi taxallusi?", "Navoiy", ["Foniy", "Bobur", "Mashrab"]],
    ["Navoiy tug'ilgan shahar?", "Hirot", ["Samarqand", "Buxoro", "Toshkent"]],
  ]);
  add(G, 8, [
    ["'O'tkan kunlar' qahramonlari kim?", "Otabek va Kumush", ["Layli va Majnun", "Farhod va Shirin", "Tohir va Zuhra"]],
    ["Cho'lponning mashhur romani?", "Kecha va kunduz", ["O'tkan kunlar", "Sarob", "Qutlug' qon"]], ["Hamid Olimjon dostoni?", "Oygul bilan Baxtiyor", ["Layli va Majnun", "Sab'ai sayyor", "Boburnoma"]],
    ["Layli va Majnun qahramonlari qaysi mavzuda?", "Muhabbat", ["Urush", "Savdo", "Sayohat"]], ["Abdulla Qodiriy 'O'tkan kunlar'ni qaysi yillarda yozgan?", "1920-yillar", ["1950-yillar", "1990-yillar", "1800-yillar"]],
  ]);
  add(G, 9, [
    ["Realizm nima?", "Hayotni haqqoniy aks ettirish", ["Faqat bo'rttirish", "Faqat fantaziya", "Faqat tarixiy dalil"]],
    ["Romantizm nimani ulug'laydi?", "Ideal va his-tuyg'ularni", ["Faqat dalillarni", "Faqat raqamlarni", "Faqat qonunlarni"]],
    ["Jadid adabiyoti vakillaridan biri?", "Abdulla Avloniy", ["Alisher Navoiy", "Mashrab", "Fuzuliy"]], ["Jadid adabiyotining yirik vakili Fitrat qaysi janrda ham ijod qilgan?", "Drama", ["Faqat roman", "Faqat ertak", "Faqat maqol"]],
  ]);
  add(G, 10, [
    ["Erkin Vohidov asarlari asosan qaysi janrda?", "She'riyat", ["Roman", "Drama", "Qissa"]], ["Hamzaning 'Boy ila xizmatchi' asari qaysi janrda?", "Drama", ["Roman", "Ertak", "Doston"]],
    ["Oybekning 'Navoiy' asari qaysi turga kiradi?", "Tarixiy roman", ["Ertak", "Lirika", "Komediya"]], ["Abdulla Oripov asarlari asosan qaysi janrda?", "She'riyat", ["Roman", "Drama", "Qissa"]],
    ["Abdulla Oripov qaysi mashhur she'r muallifi (madhiya so'zlari)?", "O'zbekiston davlat madhiyasi", ["Hamyon", "Navro'z", "Vatan"]],
  ]);
  add(G, 11, [
    ["O'zbek mumtoz adabiyotining asoschisi sifatida kim tan olingan?", "Alisher Navoiy", ["Bobur", "Mashrab", "Lutfiy"]],
    ["'Qutadg'u bilig' qaysi asrda yozilgan?", "XI asr", ["V asr", "XV asr", "XIX asr"]], ["Ahmad Yassaviy qaysi shahar bilan bog'liq?", "Turkiston", ["Samarqand", "Buxoro", "Xiva"]],
    ["Mumtoz adabiyotda g'azal necha baytdan iborat bo'ladi (odatda)?", "5–12", ["1–2", "50–100", "200 dan ko'p"]],
  ]);
  return G;
}

// ============================== HUQUQ ==============================
function huquq() {
  const G = mk();
  add(G, 1, [
    ["Kattalarga qanday munosabatda bo'lish kerak?", "Hurmat bilan", ["Beparvo", "Qo'pol", "E'tiborsiz"]], ["Yo'lni qaysi chiroqda kesib o'tish mumkin?", "Yashil", ["Qizil", "Sariq", "Hech qaysida"]],
    ["Qizil chiroq nimani bildiradi?", "To'xta", ["O'tib ket", "Tezlash", "Kuta turma"]], ["Uzr so'rash qanday xulq?", "Odobli", ["Odobsiz", "Zararli", "Qo'pol"]],
    ["Qarzga olingan narsani nima qilish kerak?", "Qaytarish", ["Yo'qotish", "Berkitish", "Sotish"]], ["Yo'lda qayerdan yurish kerak?", "Yo'lakdan", ["Yo'l o'rtasidan", "Yo'l chetidagi chuqurdan", "Avtomobil yo'lidan"]],
    ["Yolg'on gapirish qanday xatti-harakat?", "Yomon", ["Yaxshi", "Foydali", "Odatiy"]], ["Birovning mulkiga zarar yetkazish mumkinmi?", "Yo'q", ["Ha", "Ba'zan", "Faqat kechasi"]],
  ]);
  add(G, 2, [
    ["Har bir bolaning ta'lim olish huquqi bormi?", "Ha", ["Yo'q", "Faqat o'g'il bolalarda", "Faqat boy oilalarda"]], ["Maktabga borish bola uchun nima?", "Huquq va burch", ["Faqat o'yin", "Jazo", "Tanlov emas"]],
    ["Birovning narsasini ruxsatsiz olish nima?", "Noto'g'ri ish", ["Yaxshi ish", "O'yin", "Odat"]], ["Qonunga rioya qilish kimning burchi?", "Hammaning", ["Faqat kattalarning", "Faqat bolalarning", "Faqat politsiyaning"]],
    ["Har bir insonning yashash huquqi bormi?", "Ha", ["Yo'q", "Faqat kattalarda", "Faqat shaharda"]], ["Bolalar qaysi huquqqa ega?", "Oila bag'rida o'sish", ["Ishlash majburiyati", "Mustaqil yashash", "Soliq to'lash"]],
  ]);
  add(G, 3, [
    ["O'zbekiston davlat ramzlari soni nechta (bayroq, gerb, madhiya)?", 3],
    ["O'zbekiston davlat madhiyasi so'zlari muallifi?", "Abdulla Oripov", ["Erkin Vohidov", "Hamid Olimjon", "Oybek"]],
    ["O'zbekiston davlat madhiyasi musiqasi muallifi?", "Mutal Burhonov", ["Muhammad Yusuf", "Said Ahmad", "Abdulla Qodiriy"]],
    ["Davlat ramzlari nimani anglatadi?", "Davlat mustaqilligini", ["Sport turini", "Bayram taomini", "Maktab fanini"]],
    ["O'zbekiston davlat tili qaysi?", "O'zbek tili", ["Rus tili", "Ingliz tili", "Fors tili"]], ["O'zbekiston davlat bayrog'ida nechta yulduz bor?", 12],
    ["Davlat bayrog'ida qaysi shakl tasvirlangan?", "Yarim oy va yulduzlar", ["Quyosh", "Burgut", "Kitob"]],
  ]);
  add(G, 4, [
    ["O'zbekiston Konstitutsiyasi qachon qabul qilingan?", "1992-yil 8-dekabr", ["1991-yil 1-sentabr", "1993-yil 21-mart", "1994-yil 1-iyul"]],
    ["Konstitutsiya kuni qachon nishonlanadi?", "8-dekabr", ["1-sentabr", "21-mart", "9-may"]], ["Inson necha yoshgacha bola hisoblanadi?", 18],
    ["Qonunlarni kim qabul qiladi?", "Oliy Majlis", ["Sud", "Maktab", "Mahalla"]], ["Mahalla nima?", "Fuqarolarning o'zini o'zi boshqarish organi", ["Maktab", "Sud", "Bank"]],
  ]);
  add(G, 5, [
    ["Davlatning asosiy qonuni qanday ataladi?", "Konstitutsiya", ["Kodeks", "Farmon", "Buyruq"]], ["O'zbekistonda pasport (ID-karta) necha yoshdan beriladi?", 16],
    ["Saylov huquqi necha yoshdan boshlanadi?", 18], ["Fuqarolik nima?", "Shaxsning davlat bilan huquqiy aloqasi", ["Faqat yashash joyi", "Ish haqi", "Maktab turi"]],
    ["Fuqaro kim?", "Davlat bilan huquqiy aloqada bo'lgan shaxs", ["Faqat kattalar", "Faqat ishchilar", "Faqat talabalar"]],
  ]);
  add(G, 6, [
    ["Davlat hokimiyati nechta tarmoqqa bo'linadi?", 3], ["Qonun chiqaruvchi hokimiyat qaysi?", "Oliy Majlis", ["Prezident", "Sud", "Hokimlik"]],
    ["Ijro etuvchi hokimiyat organi qaysi?", "Vazirlar Mahkamasi", ["Oliy Majlis", "Sud", "Parlament"]], ["Sud hokimiyatining vazifasi nima?", "Adolatni o'rnatish", ["Qonun yaratish", "Soliq yig'ish", "Saylov o'tkazish"]],
    ["Davlat boshlig'i kim?", "Prezident", ["Hokim", "Vazir", "Sudya"]],
  ]);
  add(G, 7, [
    ["Qonunbuzarlik nima?", "Qonunga zid xatti-harakat", ["Qonunga muvofiq ish", "Bayram", "Sport turi"]],
    ["Mulk huquqi nimani anglatadi?", "Narsani egallash, foydalanish, tasarruf etish", ["Faqat ijaraga olish", "Faqat sotish", "Faqat meros qoldirish"]],
    ["Jinoyat uchun javobgarlik yoshi odatda necha?", 16], ["Ayrim og'ir jinoyatlar uchun javobgarlik yoshi necha?", 14],
    ["Huquq nima?", "Davlat o'rnatgan umumiy majburiy qoidalar", ["Faqat odat", "Faqat axloq", "Faqat urf"]], ["Burch nima?", "Bajarilishi shart bo'lgan majburiyat", ["Ixtiyoriy ish", "O'yin", "Dam olish"]],
  ]);
  add(G, 8, [
    ["Mehnat shartnomasining tomonlari kimlar?", "Ishchi va ish beruvchi", ["O'qituvchi va o'quvchi", "Sotuvchi va xaridor", "Shifokor va bemor"]],
    ["Mehnat kodeksi nimani tartibga soladi?", "Mehnat munosabatlarini", ["Jinoyatlarni", "Soliqlarni", "Oilaviy munosabatlarni"]],
    ["Oila kodeksi nimani tartibga soladi?", "Oila munosabatlarini", ["Mehnat munosabatlarini", "Jinoyatlarni", "Soliqlarni"]],
    ["Fuqarolik kodeksi nimani tartibga soladi?", "Mulkiy munosabatlarni", ["Jinoyatlarni", "Saylovlarni", "Harbiy xizmatni"]], ["Nikoh yoshi (erkak va ayol uchun) necha?", 18],
    ["Jinoyat kodeksi nimani belgilaydi?", "Jinoyat va jazoni", ["Mehnat haqini", "Soliqlarni", "Nikoh yoshini"]],
  ]);
  add(G, 9, [
    ["O'zbekiston Prezidenti necha yilga saylanadi?", 7], ["Oliy Majlis nechta palatadan iborat?", 2],
    ["Qonunchilik palatasi deputatlari soni nechta?", 150], ["Senat a'zolari soni nechta?", 100],
    ["Qonunchilik palatasi qaysi organning bir qismi?", "Oliy Majlis", ["Vazirlar Mahkamasi", "Sud", "Prokuratura"]],
  ]);
  add(G, 10, [
    ["Inson huquqlari umumjahon deklaratsiyasi qabul qilingan yil?", 1948], ["BMT tashkil topgan yil?", 1945],
    ["Huquqiy davlatning asosiy belgisi?", "Qonun ustuvorligi", ["Bir kishi hokimiyati", "Cheksiz hokimiyat", "Qonunsizlik"]],
    ["Hokimiyatlar bo'linishi tamoyilini kim ilgari surgan?", "Sharl Monteske", ["Jan-Jak Russo", "Gregor Mendel", "Charlz Darvin"]],
    ["Jinoyat kodeksining vazifasi?", "Jinoyat va jazoni belgilash", ["Mehnatni tartiblash", "Oilani tartiblash", "Soliq undirish"]],
    ["Xalqaro Inson huquqlari kuni?", "10-dekabr", ["1-sentabr", "8-dekabr", "21-mart"]],
  ]);
  add(G, 11, [
    ["Prezident saylovida ovoz berish huquqi necha yoshdan?", 18], ["Referendum nima?", "Umumxalq ovoz berishi", ["Sud majlisi", "Parlament majlisi", "Matbuot anjumani"]],
    ["Xalqaro huquqning asosiy subyektlari?", "Davlatlar", ["Faqat shaxslar", "Faqat firmalar", "Faqat maktablar"]],
    ["Aybsizlik prezumpsiyasi nimani anglatadi?", "Isbotlanmaguncha aybsiz", ["Har kim aybdor", "Gumon = ayb", "Avval jazo"]],
    ["O'zbekiston Konstitutsiyasining yangi tahriri referendumda qabul qilingan yil?", 2023],
    ["Konstitutsiyaviy sud nimani tekshiradi?", "Qonunlarning Konstitutsiyaga muvofiqligini", ["Soliq to'lovlarini", "Saylov natijalarini", "Maktab dasturini"]],
  ]);
  return G;
}

// ============================== SPORT ==============================
const OLY = [[1980, "Moskva"], [1984, "Los-Anjeles"], [1988, "Seul"], [1992, "Barselona"], [1996, "Atlanta"], [2000, "Sidney"], [2004, "Afina"], [2008, "Pekin"], [2012, "London"], [2016, "Rio-de-Janeyro"], [2020, "Tokio"], [2024, "Parij"]];
const WCUP = [[1998, "Fransiya"], [2002, "Braziliya"], [2006, "Italiya"], [2010, "Ispaniya"], [2014, "Germaniya"], [2018, "Fransiya"], [2022, "Argentina"]];
const SPORTORIGIN = [["Dzyudo", "Yaponiya"], ["Taekvondo", "Koreya"], ["Karate", "Yaponiya"], ["Sumo", "Yaponiya"], ["Zamonaviy futbol", "Angliya"], ["Basketbol", "AQSh"], ["Voleybol", "AQSh"], ["Shaxmat", "Hindiston"], ["Kurash", "O'zbekiston"], ["Zamonaviy tennis", "Angliya"], ["Krikket", "Angliya"]];
const TEAMN = [["Futbol", 11], ["Basketbol", 5], ["Voleybol", 6], ["Regbi (15 lik)", 15], ["Suv polosi", 7], ["Beysbol", 9], ["Qo'l to'pi", 7]];
const UZATH = [["Rishod Sobirov", "Dzyudo"], ["Bahodir Jalolov", "Boks"], ["Hasanboy Do'smatov", "Boks"], ["Nodirbek Abdusattorov", "Shaxmat"], ["Rustam Qosimjonov", "Shaxmat"], ["Eldor Shomurodov", "Futbol"], ["Oksana Chusovitina", "Gimnastika"], ["Akgul Amanmuradova", "Tennis"]];

function sport() {
  const G = mk();
  add(G, 1, [
    ["Futbolda nima bilan o'ynaladi?", "To'p", ["Raketka", "Shayba", "Kamon"]], ["Tennisda to'pga nima bilan uriladi?", "Raketka", ["Shayba", "Kamon", "Tayoq"]],
    ["Futbolda to'pni qo'l bilan kim ushlay oladi?", "Darvozabon", ["Himoyachi", "Hujumchi", "Yarim himoyachi"]], ["Yugurish qaysi a'zolar uchun foydali?", "Oyoqlar va yurak", ["Faqat quloq", "Faqat til", "Faqat soch"]],
    ["Sport salomatlik uchun qanday?", "Foydali", ["Zararli", "Befoyda", "Xavfli"]], ["Arqon tortish nima?", "Kuch sinash o'yini", ["Chizish", "Qo'shiq", "Raqs"]],
  ], pairs((x, y) => `${x}da bir jamoadan maydonda nechta o'yinchi bo'ladi?`, TEAMN));
  add(G, 2, [
    ["Shaxmat taxtasida nechta katak bor?", 64], ["Shaxmatda har bir o'yinchida nechta dona bor?", 16],
    ["Olimpiya halqalari soni nechta?", 5], ["Olimpiya o'yinlari necha yilda bir marta o'tkaziladi?", 4],
    ["Shaxmatda har bir o'yinchida nechta piyoda bor?", 8], ["Shaxmatda eng kuchli dona qaysi?", "Farzin", ["Piyoda", "Ot", "Fil"]],
    ["Shaxmatda har bir o'yinchida nechta ot bor?", 2], ["Shaxmatda har bir o'yinchida nechta fil bor?", 2],
  ]);
  add(G, 3, [
    ["Marafon masofasi necha km (taxminan)?", 42], ["100 m yugurish qaysi sport turiga kiradi?", "Yengil atletika", ["Suzish", "Boks", "Voleybol"]],
    ["Dzyudo qaysi mamlakatdan kelib chiqqan?", "Yaponiya", ["Xitoy", "Rossiya", "Braziliya"]], ["Taekvondo qaysi mamlakatdan kelib chiqqan?", "Koreya", ["Yaponiya", "Xitoy", "Hindiston"]],
    ["Suzish qaysi muhitda o'tadi?", "Suvda", ["Qumda", "Muzda", "Havoda"]], ["Gimnastika nimaga asoslangan?", "Egiluvchanlik va muvozanat", ["Faqat kuch", "Faqat tezlik", "Faqat zarba"]],
  ]);
  spread(G, 3, 8, pairs((x) => `${x} qaysi mamlakatda paydo bo'lgan?`, SPORTORIGIN));
  add(G, 4, [
    ["Futbol o'yinining asosiy vaqti necha daqiqa?", 90], ["Tennisdagi 'Grand Slam' turnirlari soni?", 4],
    ["Futbolda penalti nuqtasi darvozadan necha metr uzoqlikda?", 11], ["Basketbolda bitta jamoa maydonda nechta o'yinchi bilan o'ynaydi?", 5],
    ["Futbolda bir o'yinda necha yarim vaqt bor?", 2], ["Voleybolda to'p necha marta ushlanadi (jamoaga)?", 3],
  ]);
  add(G, 5, [
    ["Futbolda qizil kartochka nimani bildiradi?", "O'yindan chetlatish", ["Ogohlantirish", "Jarima", "Almashtirish"]], ["Futbolda sariq kartochka nimani bildiradi?", "Ogohlantirish", ["Chetlatish", "Gol", "Almashtirish"]],
    ["Voleybolda set necha ochkogacha o'ynaladi (5-setdan tashqari)?", 25], ["O'zbekistonning milliy kurash turi?", "Kurash", ["Judo", "Sambo", "Boks"]],
    ["Basketbolda halqaga tushgan to'p necha ochko beradi (oddiy)?", 2], ["Basketbolda 3 ochkolik chiziqdan tashlangan to'p necha ochko?", 3],
  ]);
  add(G, 6, [
    ["Mashqdan oldin nima qilinadi?", "Razminka", ["Ovqatlanish", "Uyqu", "Suzish"]], ["Mashqdan keyin nima qilinadi?", "Sovutish (tinchlanish)", ["Razminka", "Sakrash", "Yugurish"]],
    ["Mashq paytida eng yaxshi ichimlik?", "Suv", ["Gazlangan ichimlik", "Kofe", "Energetik ichimlik"]], ["Maktab o'quvchisi uchun sog'lom uyqu taxminan necha soat?", 9],
    ["Sport kiyimi qanday bo'lishi kerak?", "Qulay", ["Tor", "Og'ir", "Rasmiy"]],
  ]);
  spread(G, 7, 9, pairs((y) => `${y}-yilgi yozgi Olimpiada qayerda o'tkazilgan?`, OLY.map(([y, c]) => [y, c])));
  add(G, 7, [
    ["Zamonaviy Olimpiya o'yinlari birinchi marta qaysi yilda o'tkazilgan?", 1896],
    ["Zamonaviy Olimpiya o'yinlari asoschisi kim?", "Per de Kuberten", ["Mark Spitz", "Pele", "Muhammad Ali"]],
    ["Qadimgi Olimpiya o'yinlari qayerda o'tkazilgan?", "Olimpiya (Yunoniston)", ["Rim", "Misr", "Xitoy"]], ["Olimpiya shiori: 'Tezroq, Yuqoriroq, ___'", "Kuchliroq", ["Bardamroq", "Yaxshiroq", "Tinchroq"]],
  ]);
  spread(G, 8, 10, pairs((x) => `${x} qaysi sport turida mashhur?`, UZATH));
  spread(G, 9, 11, pairs((y) => `${y}-yilgi futbol bo'yicha jahon chempionati g'olibi?`, WCUP));
  add(G, 9, [
    ["Suzishning asosiy uslublari soni?", 4], ["Yengil atletikadagi o'nkurash necha turdan iborat?", 10],
    ["Futbol bo'yicha jahon chempionati necha yilda bir marta o'tkaziladi?", 4],
  ]);
  add(G, 10, [
    ["Maksimal yurak urishi taxminan 220 minus nima?", "Yosh", ["Vazn", "Bo'y", "Kun"]], ["BMI nimani baholaydi?", "Tana vazni indeksini", ["Qon bosimini", "Yurak urishini", "Bo'y o'sishini"]],
    ["Doping nima?", "Taqiqlangan moddalar", ["Mashq turi", "Ovqat turi", "Kiyim turi"]], ["WADA nimaga qarshi kurashadi?", "Dopingga", ["Futbolga", "Savdoga", "Tennisga"]],
    ["Aerob mashqlarga qaysi biri misol?", "Uzoq yugurish", ["Shtanga ko'tarish", "100 m sprint", "Yakka sakrash"]],
  ]);
  add(G, 11, [
    ["FIFA tashkil topgan yil?", 1904], ["Xalqaro Olimpiya qo'mitasi (XOQ) tashkil topgan yil?", 1894],
    ["2028-yilgi yozgi Olimpiada qayerda o'tkaziladi?", "Los-Anjeles", ["Parij", "Brisben", "Pekin"]], ["O'zbekiston Olimpiadada birinchi marta mustaqil qatnashgan yil?", 1996],
    ["2032-yilgi yozgi Olimpiada qayerda o'tkaziladi?", "Brisben", ["Parij", "Los-Anjeles", "Pekin"]],
  ]);
  return G;
}

// ============================== TEXNOLOGIYA ==============================
const JOBS = [["Duradgor", "Yog'ochdan buyum yasaydi"], ["Novvoy", "Non yopadi"], ["Tikuvchi", "Kiyim tikadi"], ["Kulol", "Sopol idish yasaydi"], ["Temirchi", "Metallga ishlov beradi"], ["Shifokor", "Bemorlarni davolaydi"], ["O'qituvchi", "Bilim beradi"], ["Haydovchi", "Transport vositasini boshqaradi"], ["Quruvchi", "Bino quradi"], ["Oshpaz", "Ovqat tayyorlaydi"], ["Elektrik", "Elektr tarmoqlarini o'rnatadi va ta'mirlaydi"], ["Dehqon", "Ekin ekib hosil yetishtiradi"], ["Sartarosh", "Soch oladi va turmaklaydi"], ["Dasturchi", "Kompyuter dasturlarini yozadi"], ["Payvandchi", "Metallarni payvandlaydi"], ["Muhandis", "Loyiha va qurilmalarni ishlab chiqadi"]];
const TOOLS = [["Bolg'a", "Mix qoqish uchun"], ["Arra", "Yog'och kesish uchun"], ["Randa", "Yog'ochni silliqlash uchun"], ["Egov", "Metallni silliqlash uchun"], ["Qisqich", "Detalni ushlab turish uchun"], ["Bolta", "Daraxt kesish uchun"], ["Parma", "Teshik ochish uchun"], ["Chizg'ich", "Uzunlikni o'lchash uchun"], ["Sirkul", "Aylana chizish uchun"], ["Transportir", "Burchak o'lchash uchun"], ["Igna", "Tikish uchun"], ["Qaychi", "Qirqish uchun"], ["Burg'u", "Teshik ochish uchun (qo'l asbobi)"]].filter(([a]) => a !== "Burg'u");

function texnologiya() {
  const G = mk();
  add(G, 1, [
    ["Qaychi nima uchun kerak?", "Qirqish", ["Yozish", "Chizish", "Yelimlash"]], ["Yelim nima uchun kerak?", "Yopishtirish", ["Kesish", "Bo'yash", "O'lchash"]],
    ["Plastilindan nima yasash mumkin?", "Shakllar", ["Elektr", "Suv", "Yorug'lik"]], ["Qalam nima uchun kerak?", "Yozish va chizish", ["Qirqish", "Kesish", "Yelimlash"]],
    ["Rangli qog'ozdan nima yasaladi?", "Applikatsiya", ["Elektr zanjiri", "Kir yuvish", "Non"]], ["Qaychini ishlatishda nima qilish kerak?", "Ehtiyot bo'lish", ["Yugurish", "O'ynash", "Uloqtirish"]],
  ]);
  add(G, 2, [
    ["Qog'ozdan buyum yasash san'ati?", "Origami", ["Kalligrafiya", "Kulolchilik", "Zargarlik"]], ["Gil bilan ishlash san'ati?", "Kulolchilik", ["Duradgorlik", "Kashtachilik", "Zargarlik"]],
    ["Mato ustiga ip bilan naqsh solish?", "Kashtachilik", ["Kulolchilik", "Duradgorlik", "Temirchilik"]], ["Ignadan nima uchun foydalaniladi?", "Tikish", ["Kesish", "Yozish", "Bo'yash"]],
    ["Gilamdo'zlik nima?", "Gilam to'qish", ["Non yopish", "Idish yasash", "Kiyim tikish"]],
  ]);
  spread(G, 3, 7, pairs((x) => `${x} nima ish qiladi?`, JOBS));
  spread(G, 4, 8, pairs((y) => `"${y}" — qaysi kasb egasi?`, JOBS.map(([a, b]) => [b, a]).reverse()));
  spread(G, 3, 8, pairs((x) => `${x} nima uchun ishlatiladi?`, TOOLS));
  add(G, 3, [
    ["Yog'ochga ishlov beruvchi usta?", "Duradgor", ["Kulol", "Tikuvchi", "Novvoy"]], ["Non yopuvchi usta?", "Novvoy", ["Duradgor", "Kulol", "Tikuvchi"]],
    ["Sopol idish yasovchi usta?", "Kulol", ["Temirchi", "Duradgor", "Novvoy"]],
  ]);
  add(G, 4, [
    ["Uzunlikni o'lchaydigan asbob?", "Chizg'ich", ["Termometr", "Tarozi", "Soat"]], ["Massani o'lchaydigan asbob?", "Tarozi", ["Chizg'ich", "Termometr", "Soat"]],
    ["Haroratni o'lchaydigan asbob?", "Termometr", ["Chizg'ich", "Tarozi", "Soat"]], ["Vaqtni o'lchaydigan asbob?", "Soat", ["Chizg'ich", "Tarozi", "Termometr"]],
    ["Pichoq bilan ishlaganda qanday bo'lish kerak?", "Ehtiyotkor", ["Shoshqin", "Beparvo", "Tez"]],
  ]);
  add(G, 5, [
    ["O't o'chirish xizmati raqami?", 101], ["Politsiya xizmati raqami?", 102], ["Tez yordam xizmati raqami?", 103], ["Gaz xizmati raqami?", 104],
    ["Elektr tokidan himoya uchun nima ishlatiladi?", "Izolyatsiya", ["Suv", "Metall", "Havo"]], ["Ho'l qo'l bilan rozetkaga tegish mumkinmi?", "Yo'q", ["Ha", "Ba'zan", "Faqat kunduz"]],
    ["Yong'in chiqsa, avval nima qilinadi?", "101 ga qo'ng'iroq qilinadi", ["Yashirinib olinadi", "Oyna ochiladi", "Kutiladi"]],
  ]);
  add(G, 6, [
    ["Elektr zanjiri: manba, iste'molchi va ___", "sim", ["tosh", "taxta", "suv"]], ["Elektr tokini yaxshi o'tkazadigan material?", "Mis", ["Rezina", "Shisha", "Plastmassa"]],
    ["Izolyator material?", "Rezina", ["Mis", "Alyuminiy", "Temir"]], ["Kuchlanish birligi?", "Volt", ["Amper", "Om", "Vatt"]],
    ["Tok kuchi birligi?", "Amper", ["Volt", "Om", "Vatt"]], ["Qarshilik birligi?", "Om", ["Volt", "Amper", "Vatt"]],
    ["Elektr zanjirini ulab-uzuvchi qurilma?", "Kalit", ["Lampochka", "Batareya", "Sim"]], ["Quvvat birligi?", "Vatt", ["Volt", "Amper", "Om"]],
  ]);
  add(G, 7, [
    ["Eskiz nima?", "Dastlabki chizma", ["Tayyor buyum", "Material", "Asbob"]], ["Chizmada 1:2 masshtab nimani bildiradi?", "Kichraytirilgan", ["Kattalashtirilgan", "Tabiiy kattalik", "Noma'lum"]],
    ["Chizmada 1:1 masshtab nimani bildiradi?", "Tabiiy kattalik", ["Kichraytirilgan", "Kattalashtirilgan", "Noma'lum"]], ["Chizmada ko'rinmas chiziqlar qanday chiziladi?", "Shtrix chiziq bilan", ["Qalin chiziq bilan", "Nuqta bilan", "To'lqinsimon"]],
    ["Chizmada 2:1 masshtab nimani bildiradi?", "Kattalashtirilgan", ["Kichraytirilgan", "Tabiiy kattalik", "Noma'lum"]],
  ]);
  add(G, 8, [
    ["Qayta tiklanadigan energiya manbai qaysi?", "Quyosh", ["Ko'mir", "Neft", "Tabiiy gaz"]], ["Qayta tiklanmaydigan energiya manbai qaysi?", "Neft", ["Quyosh", "Shamol", "Oqar suv"]],
    ["Shamol energiyasini elektrga aylantiruvchi qurilma?", "Shamol turbinasi", ["Reaktor", "Bug' qozoni", "Akkumulyator"]], ["Quyosh panellari asosan nimani hosil qiladi?", "Elektr energiyasini", ["Yoqilg'ini", "Suvni", "Gazni"]],
    ["GES nima?", "Gidroelektrostansiya", ["Gaz stansiyasi", "Quyosh stansiyasi", "Atom stansiyasi"]], ["Qaysi biri qayta tiklanuvchi manba?", "Oqar suv", ["Ko'mir", "Neft", "Gaz"]],
  ]);
  add(G, 9,
    () => { const d = rnd(20, 200) * 10, x = rnd(5, 19) * 10; return [`Daromad ${d} so'm, xarajat ${x} so'm. Foyda (so'm)?`, d - x]; },
    () => { const n = rnd(2, 30), p = rnd(1, 20) * 100; return [`${n} dona mahsulot, har birining narxi ${p} so'm. Jami summa (so'm)?`, n * p]; },
    [
      ["Biznes reja nima?", "Faoliyat rejasi", ["Qarz daftari", "Soliq to'lovi", "Bayram dasturi"]], ["Daromad nima?", "Tushgan pul", ["Sarflangan pul", "Soliq", "Qarz"]],
      ["Xarajat nima?", "Sarflangan pul", ["Tushgan pul", "Foyda", "Aksiya"]], ["Foyda = daromad ___ xarajat", "minus", ["plus", "ko'paytirish", "bo'lish"]],
    ]
  );
  add(G, 10, [
    ["3D printer nima qiladi?", "Hajmli buyum chop etadi", ["Faqat rasm chiqaradi", "Ovoz yozadi", "Video suratga oladi"]], ["CAD dasturi nima uchun?", "Kompyuterda loyihalash", ["Musiqa tinglash", "Xat yozish", "Virus topish"]],
    ["Robotning tarkibiy qismlari: sensor, ___, aktuator", "kontroller", ["monitor", "printer", "klaviatura"]], ["Arduino nima?", "Mikrokontroller platformasi", ["Brauzer", "Matn muharriri", "Antivirus"]],
    ["Sensor nima qiladi?", "Muhit ma'lumotini sezadi", ["Harakatlantiradi", "Chop etadi", "Saqlaydi"]],
  ]);
  add(G, 11, [
    ["Sun'iy intellekt (AI) nima?", "Inson aqlini taqlid qiluvchi tizimlar", ["Faqat o'yin dasturi", "Bosma mashina", "Elektr manbai"]],
    ["Mashinali o'rganish nima?", "Ma'lumotlardan o'rganuvchi algoritmlar", ["Qo'lda hisoblash", "Faylni nusxalash", "Tarmoq kabeli"]], ["IoT nima?", "Narsalar interneti", ["Internet do'koni", "Veb-sayt", "Matn muharriri"]],
    ["Startap nima?", "Yangi innovatsion biznes", ["Eski zavod", "Davlat qonuni", "Maktab fani"]], ["Barqaror rivojlanish nimani anglatadi?", "Kelajak avlodni ham hisobga olish", ["Faqat bugungi foyda", "Tabiatni ishlatmaslik", "Faqat eksport"]],
    ["Blokcheyn nima?", "Zanjirsimon taqsimlangan reyestr", ["Antivirus", "Brauzer", "Matn muharriri"]],
  ]);
  return G;
}

// ============================== GEOGRAFIYA ==============================
const CAPITALS = [["O'zbekiston", "Toshkent"], ["Qozog'iston", "Ostona"], ["Qirg'iziston", "Bishkek"], ["Tojikiston", "Dushanbe"], ["Turkmaniston", "Ashxobod"], ["Afg'oniston", "Kobul"], ["Rossiya", "Moskva"], ["Xitoy", "Pekin"], ["Hindiston", "Nyu-Dehli"], ["Yaponiya", "Tokio"], ["Janubiy Koreya", "Seul"], ["Eron", "Tehron"], ["Turkiya", "Anqara"], ["Saudiya Arabistoni", "Ar-Riyod"], ["Misr", "Qohira"], ["Fransiya", "Parij"], ["Germaniya", "Berlin"], ["Italiya", "Rim"], ["Ispaniya", "Madrid"], ["Portugaliya", "Lissabon"], ["Buyuk Britaniya", "London"], ["Ukraina", "Kiyev"], ["Polsha", "Varshava"], ["Gretsiya", "Afina"], ["Shvetsiya", "Stokgolm"], ["Norvegiya", "Oslo"], ["Finlyandiya", "Xelsinki"], ["Avstriya", "Vena"], ["Shveytsariya", "Bern"], ["Niderlandiya", "Amsterdam"], ["Belgiya", "Bryussel"], ["AQSh", "Vashington"], ["Kanada", "Ottava"], ["Meksika", "Mexiko"], ["Braziliya", "Brazilia"], ["Argentina", "Buenos-Ayres"], ["Chili", "Santyago"], ["Peru", "Lima"], ["Kolumbiya", "Bogota"], ["Kuba", "Gavana"], ["Avstraliya", "Kanberra"], ["Yangi Zelandiya", "Vellington"], ["Nigeriya", "Abuja"], ["Keniya", "Nayrobi"], ["Marokash", "Rabat"], ["Iroq", "Bag'dod"], ["Pokiston", "Islomobod"], ["Bangladesh", "Dakka"], ["Indoneziya", "Jakarta"], ["Tailand", "Bangkok"], ["Vyetnam", "Xanoy"], ["Malayziya", "Kuala-Lumpur"], ["Filippin", "Manila"], ["Mo'g'uliston", "Ulan-Bator"], ["Ozarbayjon", "Boku"], ["Gruziya", "Tbilisi"], ["Armaniston", "Yerevan"], ["Belarus", "Minsk"], ["Ruminiya", "Buxarest"], ["Chexiya", "Praga"], ["Vengriya", "Budapesht"], ["Daniya", "Kopengagen"], ["Irlandiya", "Dublin"]];
const RIVERS = [["Nil", "Afrika"], ["Amazonka", "Janubiy Amerika"], ["Volga", "Yevropa"], ["Amudaryo", "Osiyo"], ["Sirdaryo", "Osiyo"], ["Missisipi", "Shimoliy Amerika"], ["Yantszi", "Osiyo"], ["Kongo", "Afrika"], ["Dunay", "Yevropa"], ["Gang", "Osiyo"], ["Reyn", "Yevropa"], ["Yenisey", "Osiyo"], ["Lena", "Osiyo"], ["Zarafshon", "Osiyo"], ["Orinoko", "Janubiy Amerika"], ["Missuri", "Shimoliy Amerika"], ["Niger", "Afrika"]];
const PEAKS = [["Jomolungma (Everest)", "Osiyo"], ["Elbrus", "Yevropa"], ["Kilimanjaro", "Afrika"], ["Akonkagua", "Janubiy Amerika"], ["Monblan", "Yevropa"], ["Denali (Mak-Kinli)", "Shimoliy Amerika"], ["Vinson massivi", "Antarktida"], ["Kosciuszko", "Avstraliya"]];
const REGIONS = [["Andijon viloyati", "Andijon"], ["Buxoro viloyati", "Buxoro"], ["Farg'ona viloyati", "Farg'ona"], ["Jizzax viloyati", "Jizzax"], ["Xorazm viloyati", "Urganch"], ["Namangan viloyati", "Namangan"], ["Navoiy viloyati", "Navoiy"], ["Qashqadaryo viloyati", "Qarshi"], ["Samarqand viloyati", "Samarqand"], ["Sirdaryo viloyati", "Guliston"], ["Surxondaryo viloyati", "Termiz"], ["Toshkent viloyati", "Nurafshon"], ["Qoraqalpog'iston Respublikasi", "Nukus"]];

function geografiya() {
  const G = mk();
  add(G, 1, [
    ["Quyosh qaysi tomondan chiqadi?", "Sharqdan", ["G'arbdan", "Shimoldan", "Janubdan"]], ["Quyosh qaysi tomonga botadi?", "G'arbga", ["Sharqqa", "Shimolga", "Janubga"]],
    ["Yilda nechta fasl bor?", 4], ["Haftada necha kun bor?", 7], ["Qor qaysi faslda yog'adi?", "Qishda", ["Yozda", "Bahorda", "Kuzda"]],
    ["Eng issiq fasl qaysi?", "Yoz", ["Qish", "Kuz", "Bahor"]], ["Yilda nechta oy bor?", 12], ["Daraxtlar qaysi faslda gullaydi?", "Bahorda", ["Qishda", "Kuzda", "Yozda"]],
  ]);
  add(G, 2, [
    ["Tog'ning eng yuqori qismi nima deyiladi?", "Cho'qqi", ["Etak", "Vodiy", "Dara"]], ["Tog'lar orasidagi pastlik nima deyiladi?", "Vodiy", ["Cho'qqi", "Etak", "Qum"]],
    ["Tekis va keng joy nima deyiladi?", "Tekislik", ["Tog'", "Cho'qqi", "Vodiy"]], ["Qumli keng hudud nima deyiladi?", "Cho'l", ["Daryo", "Tog'", "O'rmon"]],
    ["Ko'l nima?", "Quruqlikdagi suv havzasi", ["Tog' cho'qqisi", "Cho'l", "Tekislik"]], ["Daryo qayerdan boshlanadi?", "Manbadan", ["Cho'ldan", "Tekislikdan", "Shahardan"]],
  ]);
  add(G, 3, [
    ["Yer yuzida nechta materik bor?", 6], ["Yer yuzida nechta okean bor?", 5],
    ["Eng katta okean qaysi?", "Tinch okeani", ["Atlantika okeani", "Hind okeani", "Shimoliy Muz okeani"]], ["Eng katta materik qaysi?", "Yevroosiyo", ["Afrika", "Avstraliya", "Antarktida"]],
    ["O'zbekiston qaysi qit'ada joylashgan?", "Osiyo", ["Yevropa", "Afrika", "Amerika"]], ["Eng sovuq materik?", "Antarktida", ["Avstraliya", "Yevropa", "Afrika"]],
  ]);
  spread(G, 4, 6, pairs((x) => `${x} markazi qaysi shahar?`, REGIONS));
  spread(G, 5, 7, pairs((x) => `${x} qaysi viloyat markazi?`, REGIONS.map(([r, c]) => [c, r]).reverse()));
  add(G, 4, [
    ["O'zbekistonda nechta viloyat bor?", 12], ["Qoraqalpog'iston qanday maqomga ega?", "Avtonom respublika", ["Viloyat", "Shahar", "Tuman"]],
    ["Samarqand qaysi daryo bo'yida joylashgan?", "Zarafshon", ["Amudaryo", "Sirdaryo", "Chirchiq"]], ["Toshkent qaysi daryo bo'yida joylashgan?", "Chirchiq", ["Zarafshon", "Amudaryo", "Qashqadaryo"]],
    ["Qizilqum qaysi daryolar oralig'ida joylashgan?", "Amudaryo va Sirdaryo", ["Zarafshon va Chirchiq", "Volga va Don", "Nil va Kongo"]],
    ["O'zbekistonning eng katta daryosi?", "Amudaryo", ["Zarafshon", "Chirchiq", "Sirdaryo"]],
  ]);
  add(G, 5, [
    ["Ekvator Yerni nechta yarimsharga ajratadi?", 2], ["Yer o'z o'qi atrofida necha soatda aylanadi?", 24], ["Yer Quyosh atrofida necha kunda aylanadi?", 365],
    ["Geografik kenglik qaysi chiziqlar bilan o'lchanadi?", "Parallellar", ["Meridianlar", "Daryolar", "Tog'lar"]], ["Geografik uzunlik qaysi chiziqlar bilan o'lchanadi?", "Meridianlar", ["Parallellar", "Daryolar", "Tog'lar"]],
    ["Boshlang'ich meridian qaysi shahar orqali o'tadi?", "Grinvich", ["Parij", "Moskva", "Nyu-York"]],
  ]);
  spread(G, 6, 11, pairs((x) => `${x} poytaxti qaysi shahar?`, CAPITALS));
  spread(G, 7, 11, pairs((c) => `${c} qaysi davlatning poytaxti?`, CAPITALS.map(([a, b]) => [b, a]).reverse()));
  spread(G, 6, 9, pairs((x) => `${x} daryosi qaysi materikda oqadi?`, RIVERS));
  spread(G, 7, 9, pairs((x) => `${x} cho'qqisi qaysi materikda joylashgan?`, PEAKS));
  add(G, 6, [
    ["Dunyodagi eng baland tog' cho'qqisi?", "Jomolungma (Everest)", ["Elbrus", "Monblan", "Kilimanjaro"]], ["Eng chuqur okean xandagi?", "Mariana", ["Puerto-Riko", "Yava", "Tonga"]],
    ["Eng katta issiq cho'l?", "Sahroi Kabir", ["Qizilqum", "Gobi", "Qoraqum"]], ["Atmosferaning eng pastki qatlami?", "Troposfera", ["Stratosfera", "Mezosfera", "Termosfera"]],
  ]);
  add(G, 7, [
    ["Afrikaning eng baland cho'qqisi?", "Kilimanjaro", ["Elbrus", "Everest", "Monblan"]], ["Dunyodagi eng katta orol?", "Grenlandiya", ["Madagaskar", "Borneo", "Kuba"]],
    ["Janubiy Amerikadagi eng uzun tog' tizmasi?", "And", ["Alp", "Himolay", "Ural"]], ["Yevropa va Osiyo chegarasidagi tog' tizmasi?", "Ural", ["And", "Alp", "Tyan-Shan"]],
    ["Eng chuqur ko'l qaysi?", "Baykal", ["Kaspiy", "Viktoriya", "Superior"]], ["Dunyodagi eng katta ko'l (dengiz)?", "Kaspiy dengizi", ["Baykal", "Orol", "Viktoriya"]],
  ]);
  add(G, 8, [
    ["O'zbekiston nechta davlat bilan chegaradosh?", 5], ["O'zbekiston bilan chegaradosh davlat qaysi?", "Qozog'iston", ["Rossiya", "Xitoy", "Eron"]],
    ["O'zbekiston iqlimi qanday?", "Keskin kontinental", ["Ekvatorial", "Dengiz iqlimi", "Subtropik nam"]],
    ["Orol dengizi qurishining asosiy sababi?", "Daryo suvidan sug'orishda haddan ortiq foydalanish", ["Zilzila", "Vulqon otilishi", "Yomg'ir ko'pligi"]],
    ["O'zbekistonning eng baland cho'qqisi qaysi tog'larda?", "Hisor tizmasi", ["Ural", "Alp", "Kavkaz"]],
  ]);
  add(G, 9, [
    ["Maydoni bo'yicha eng katta davlat?", "Rossiya", ["Kanada", "Xitoy", "AQSh"]], ["Dunyodagi eng kichik davlat?", "Vatikan", ["Monako", "San-Marino", "Lixtenshteyn"]],
    ["Dunyodagi eng baland sharshara?", "Anxel", ["Niagara", "Viktoriya", "Iguasu"]], ["Panama kanali qaysi okeanlarni bog'laydi?", "Atlantika va Tinch", ["Hind va Tinch", "Atlantika va Hind", "Shimoliy Muz va Tinch"]],
    ["Aholisi eng ko'p qit'a?", "Osiyo", ["Afrika", "Yevropa", "Shimoliy Amerika"]], ["Suvaysh kanali qaysi dengizlarni bog'laydi?", "O'rta va Qizil dengiz", ["Qora va Kaspiy", "Boltiq va Shimoliy", "Orol va Kaspiy"]],
  ]);
  add(G, 10, [
    ["Neft eksport qiluvchi davlatlar tashkiloti?", "OPEK", ["BMT", "NATO", "Yevropa Ittifoqi"]], ["Eng yirik iqtisodiyotga ega davlat (nominal YaIM)?", "AQSh", ["Xitoy", "Yaponiya", "Germaniya"]],
    ["Urbanizatsiya nima?", "Shaharlar o'sishi va aholining shaharga ko'chishi", ["Qishloqlar ko'payishi", "Tog'larning yemirilishi", "Daryolarning qurishi"]],
    ["Demografik portlash nimani anglatadi?", "Aholining tez o'sishini", ["Aholining kamayishini", "Shaharlar yo'qolishini", "Migratsiya to'xtashini"]],
    ["Dunyo aholisi qaysi yilda 8 mlrd dan oshgan?", 2022],
  ]);
  add(G, 11, [
    ["Iqlim o'zgarishining asosiy sababi?", "Issiqxona gazlari", ["Oy tutilishi", "Zilzilalar", "Okean to'lqinlari"]], ["Parij kelishuvi qaysi muammoga bag'ishlangan?", "Iqlim o'zgarishi", ["Savdo", "Chegara", "Migratsiya"]],
    ["BMT shtab-kvartirasi qayerda joylashgan?", "Nyu-York", ["Jeneva", "Parij", "London"]], ["Yevropa Ittifoqining asosiy yagona valyutasi?", "Yevro", ["Dollar", "Funt", "Frank"]],
    ["BMTning Barqaror rivojlanish maqsadlari soni?", 17], ["Globallashuv nima?", "Mamlakatlarning o'zaro bog'lanishi", ["Davlatlarning ajralishi", "Aholining kamayishi", "Savdoning to'xtashi"]],
  ]);
  return G;
}

// ============================== EKSPORT ==============================
export const questions = {
  Matematika: makeSubject("mat", matematika()),
  Geometriya: makeSubject("geo", geometriya()),
  Fizika: makeSubject("fiz", fizika()),
  Kimyo: makeSubject("kim", kimyo()),
  Biologiya: makeSubject("bio", biologiya()),
  Informatika: makeSubject("inf", informatika()),
  "Ingliz tili": makeSubject("eng", inglizTili()),
  Tarix: makeSubject("tar", tarix()),
  "Ona tili": makeSubject("ona", onaTili()),
  Adabiyot: makeSubject("adb", adabiyot()),
  Huquq: makeSubject("huq", huquq()),
  Sport: makeSubject("spo", sport()),
  Texnologiya: makeSubject("tex", texnologiya()),
  Geografiya: makeSubject("gey", geografiya()),
};

// Konsolda: import { questionStats } from "../data/generateQuestions"; questionStats();
export function questionStats() {
  const rows = {};
  let total = 0;
  for (const [subject, grades] of Object.entries(questions)) {
    const n = Object.values(grades).reduce((s, arr) => s + arr.length, 0);
    rows[subject] = { jami: n, ...Object.fromEntries(Object.entries(grades).map(([g, a]) => [g, a.length])) };
    total += n;
  }
  console.table(rows);
  console.log("JAMI savollar:", total);
  return total;
}

if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
  console.info("Savollar yuklandi. Hisobot uchun questionStats() ni chaqiring.");
}