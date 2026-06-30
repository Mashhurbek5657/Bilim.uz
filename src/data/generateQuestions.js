function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createOptions(correct) {
  const options = [
    correct,
    correct + Math.floor(Math.random() * 5) + 1,
    correct - Math.floor(Math.random() * 4) + 1,
    correct + Math.floor(Math.random() * 8) + 2,
  ];

  return shuffle([...new Set(options)].map(String));
}
export const matematika = {
  Oson: Array.from({ length: 200 }, () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;

    const answer = a + b;

    return {
      question: `${a} + ${b} = ?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const type = Math.floor(Math.random() * 2);

    let question = "";
    let answer = 0;

    if (type === 0) {
      const a = Math.floor(Math.random() * 100) + 20;
      const b = Math.floor(Math.random() * 50) + 1;

      answer = a - b;
      question = `${a} - ${b} = ?`;
    } else {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;

      answer = a * b;
      question = `${a} × ${b} = ?`;
    }

    return {
      question,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const type = Math.floor(Math.random() * 3);

    let question = "";
    let answer = 0;

    if (type === 0) {
      const a = Math.floor(Math.random() * 30) + 1;
      const b = Math.floor(Math.random() * 30) + 1;
      const c = Math.floor(Math.random() * 20) + 1;

      answer = a * b + c;
      question = `${a} × ${b} + ${c} = ?`;
    }

    if (type === 1) {
      const a = Math.floor(Math.random() * 15) + 2;

      answer = a * a;
      question = `${a}² = ?`;
    }

    if (type === 2) {
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * 20) + 1;
      const c = Math.floor(Math.random() * 10) + 1;

      answer = a - b + c;
      question = `${a} - ${b} + ${c} = ?`;
    }

    return {
      question,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const type = Math.floor(Math.random() * 4);

    let question = "";
    let answer = 0;

    if (type === 0) {
      const x = Math.floor(Math.random() * 50) + 1;
      const result = x * 3;

      answer = x;
      question = `3x = ${result}, x = ?`;
    }

    if (type === 1) {
      const x = Math.floor(Math.random() * 30) + 1;

      answer = x;
      question = `x + 15 = ${x + 15}, x = ?`;
    }

    if (type === 2) {
      const x = Math.floor(Math.random() * 20) + 1;

      answer = x;
      question = `5x = ${x * 5}, x = ?`;
    }

    if (type === 3) {
      const x = Math.floor(Math.random() * 25) + 1;

      answer = x;
      question = `x² = ${x * x}, x = ?`;
    }

    return {
      question,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),
};

export const fizika = {
  Oson: Array.from({ length: 200 }, () => {
    const v = Math.floor(Math.random() * 20) + 1;
    const t = Math.floor(Math.random() * 10) + 1;
    const answer = v * t;

    return {
      question: `Jism ${v} m/s tezlik bilan ${t} s harakat qilsa qancha masofa bosadi?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const m = Math.floor(Math.random() * 20) + 1;
    const a = Math.floor(Math.random() * 10) + 1;
    const answer = m * a;

    return {
      question: `Massasi ${m} kg bo'lgan jism ${a} m/s² tezlanish olsa kuch qancha?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const m = Math.floor(Math.random() * 50) + 10;
    const h = Math.floor(Math.random() * 20) + 1;
    const g = 10;

    const answer = m * g * h;

    return {
      question: `${m} kg jism ${h} m balandlikda. Potensial energiyasi qancha? (g=10)`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const m = Math.floor(Math.random() * 20) + 1;
    const v = Math.floor(Math.random() * 20) + 1;

    const answer = Math.floor((m * v * v) / 2);

    return {
      question: `${m} kg jism ${v} m/s tezlik bilan harakat qilmoqda. Kinetik energiyasi qancha?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),
};

const cells = [
  { question: "Insonda nechta xromosoma mavjud?", answer: 46 },
  { question: "Jinsiy hujayrada nechta xromosoma bo'ladi?", answer: 23 },
  { question: "Odam yuragi nechta kameradan iborat?", answer: 4 },
  { question: "Katta qon aylanishi nechta yurak qismidan boshlanadi?", answer: 1 },
  { question: "Odamda nechta o'pka mavjud?", answer: 2 },
  { question: "Buyraklar soni nechta?", answer: 2 },
  { question: "Odam tanasida nechta asosiy qon guruhi mavjud?", answer: 4 },
  { question: "DNK zanjiri nechta ipdan iborat?", answer: 2 },
];

export const biologiya = {
  Oson: Array.from({ length: 200 }, () => {
    const item = cells[Math.floor(Math.random() * cells.length)];

    return {
      question: item.question,
      options: createOptions(item.answer),
      answer: String(item.answer),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const organs = [
      { q: "Odamda nechta qovurg'a mavjud?", a: 24 },
      { q: "Bosh miya nechta yarim shardan iborat?", a: 2 },
      { q: "Yurakda nechta bo'lmacha mavjud?", a: 2 },
      { q: "Yurakda nechta qorincha mavjud?", a: 2 },
      { q: "Sut tishlari soni nechta?", a: 20 },
    ];

    const item = organs[Math.floor(Math.random() * organs.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const genetics = [
      { q: "Diploid hujayrada 46 xromosoma bo'lsa, gaploid hujayrada nechta bo'ladi?", a: 23 },
      { q: "Mitoz natijasida nechta qiz hujayra hosil bo'ladi?", a: 2 },
      { q: "Meyoz natijasida nechta hujayra hosil bo'ladi?", a: 4 },
      { q: "DNK tarkibida nechta asosiy azotli asos mavjud?", a: 4 },
      { q: "RNK tarkibida nechta asosiy azotli asos mavjud?", a: 4 },
    ];

    const item = genetics[Math.floor(Math.random() * genetics.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const a = Math.floor(Math.random() * 20) + 10;
    const b = Math.floor(Math.random() * 20) + 10;
    const answer = a + b;

    return {
      question: `${a} ta ota xromosomasi va ${b} ta ona xromosomasi mavjud. Jami nechta xromosoma?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),
};

export const kimyo = {
  Oson: Array.from({ length: 200 }, () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a + b;

    return {
      question: `${a} + ${b} = ? (oddiy hisob)`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const type = Math.floor(Math.random() * 2);

    let question = "";
    let answer = 0;

    if (type === 0) {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 5) + 1;

      answer = a * b;
      question = `${a} mol × ${b} g/mol = ? (massa hisobla)`;
    }

    if (type === 1) {
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 5) + 1;

      answer = a / b;
      question = `${a} g modda ${b} mol ga teng bo‘lsa, molyar massa nechchi?`;
    }

    return {
      question,
      options: createOptions(Math.floor(answer)),
      answer: String(Math.floor(answer)),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const type = Math.floor(Math.random() * 3);

    let question = "";
    let answer = 0;

    if (type === 0) {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;

      answer = a * b * 2;
      question = `${a}A + ${b}B → ? (reaksiya mahsuloti miqdori)`;
    }

    if (type === 1) {
      const a = Math.floor(Math.random() * 100) + 10;
      const yieldRate = Math.floor(Math.random() * 40) + 60;

      answer = Math.floor((a * yieldRate) / 100);
      question = `Reaksiya 100% bo‘lsa ${a},  ${yieldRate}% chiqishda natija?`;
    }

    if (type === 2) {
      const a = Math.floor(Math.random() * 20) + 1;

      answer = a * 6;
      question = `C${a}H? birikmada umumiy atomlar soni?`;
    }

    return {
      question,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const type = Math.floor(Math.random() * 3);

    let question = "";
    let answer = 0;

    if (type === 0) {
      const m = Math.floor(Math.random() * 50) + 10;
      const M = Math.floor(Math.random() * 10) + 1;

      answer = Math.floor(m / M);
      question = `${m} g modda, molyar massa ${M} g/mol bo‘lsa, mol soni?`;
    }

    if (type === 1) {
      const a = Math.floor(Math.random() * 20) + 1;

      answer = a * 4;
      question = `CH₄ molekulada umumiy bog‘lar soni (${a} molekula)?`;
    }

    if (type === 2) {
      const a = Math.floor(Math.random() * 100) + 20;

      answer = Math.floor(a * 0.6);
      question = `60% chiqish bilan ${a} g mahsulotdan haqiqiy natija?`;
    }

    return {
      question,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),
};

// ======================= INGLIZ TILI =======================
export const inglizTili = {
  Oson: Array.from({ length: 200 }, () => {
    const words = [
      { q: "Apple tarjimasi?", a: "Olma" },
      { q: "Book tarjimasi?", a: "Kitob" },
      { q: "Car tarjimasi?", a: "Mashina" },
      { q: "School tarjimasi?", a: "Maktab" },
      { q: "Pen tarjimasi?", a: "Qalam" },
    ];

    const item = words[Math.floor(Math.random() * words.length)];

    return {
      question: item.q,
      options: createOptions(1),
      answer: "1",
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const sentences = [
      { q: "I ___ a student. (am/is/are)", a: "am" },
      { q: "She ___ happy. (is/are/am)", a: "is" },
      { q: "They ___ playing. (is/are/am)", a: "are" },
      { q: "He ___ a doctor. (is/are/am)", a: "is" },
    ];

    const item = sentences[Math.floor(Math.random() * sentences.length)];

    return {
      question: item.q,
      options: shuffle(["am", "is", "are"]),
      answer: item.a,
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const q = [
      { q: "Past tense of go?", a: "went" },
      { q: "Past tense of eat?", a: "ate" },
      { q: "Past tense of see?", a: "saw" },
    ];

    const item = q[Math.floor(Math.random() * q.length)];

    return {
      question: item.q,
      options: shuffle([item.a, "goed", "eated", "seed"]),
      answer: item.a,
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const q = [
      { q: "Future tense: I ___ go.", a: "will" },
      { q: "He ___ finished homework.", a: "has" },
    ];

    const item = q[Math.floor(Math.random() * q.length)];

    return {
      question: item.q,
      options: shuffle([item.a, "is", "was", "did"]),
      answer: item.a,
    };
  }),
};

// ======================= TARIX =======================
export const tarix = {
  Oson: Array.from({ length: 200 }, () => {
    const facts = [
      { q: "O‘zbekiston poytaxti?", a: "Toshkent" },
      { q: "O‘zbekiston mustaqilligi yili?", a: 1991 },
      { q: "Yer yuzidagi eng qadimiy davlatlardan biri?", a: "Misr" },
    ];

    const item = facts[Math.floor(Math.random() * facts.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const facts = [
      { q: "Amir Temur tug‘ilgan yil?", a: 1336 },
      { q: "Jaloliddin Manguberdi davlati?", a: "Xorazm" },
      { q: "Ikkinchi jahon urushi yili boshlanishi?", a: 1939 },
    ];

    const item = facts[Math.floor(Math.random() * facts.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const facts = [
      { q: "Buyuk Ipak yo‘li qaysi savdo yo‘li?", a: "Sharq-G‘arb" },
      { q: "Rim imperiyasi qulash yili?", a: 476 },
    ];

    const item = facts[Math.floor(Math.random() * facts.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const year = 1000 + Math.floor(Math.random() * 1000);

    return {
      question: `${year} yilda sodir bo‘lgan voqea qaysi davrga tegishli?`,
      options: shuffle(["Qadimgi davr", "O‘rta asrlar", "Yangi davr"]),
      answer: "O‘rta asrlar",
    };
  }),
};

// ======================= INFORMATIKA =======================
export const informatika = {
  Oson: Array.from({ length: 200 }, () => {
    const q = [
      { q: "Kompyuter miyasi nima?", a: "CPU" },
      { q: "1 KB nechta bayt?", a: 1024 },
      { q: "Internet nima?", a: "Tarmoq" },
    ];

    const item = q[Math.floor(Math.random() * q.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const q = [
      { q: "HTML nima?", a: "Markup" },
      { q: "CSS nima uchun ishlatiladi?", a: "Dizayn" },
      { q: "JavaScript nima?", a: "Dasturlash tili" },
    ];

    const item = q[Math.floor(Math.random() * q.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const q = [
      { q: "React nima?", a: "Library" },
      { q: "DOM nima?", a: "Document Object Model" },
    ];

    const item = q[Math.floor(Math.random() * q.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const q = [
      { q: "HTTP nima uchun ishlatiladi?", a: "Data uzatish" },
      { q: "Backend nima?", a: "Server qismi" },
    ];

    const item = q[Math.floor(Math.random() * q.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),
};

export const onatili = {
  Oson: Array.from({ length: 200 }, () => {
    const items = [
      { q: "Ot nima?", a: "Predmet nomi" },
      { q: "Fe'l nima?", a: "Harakat bildiradi" },
      { q: "Sifat nima?", a: "Belgini bildiradi" },
      { q: "Gap nima?", a: "Tugallangan fikr" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Predmet nomi", "Harakat bildiradi", "Belgini bildiradi", "Sonni bildiradi"]),
      answer: item.a,
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const items = [
      { q: "Otning kelishiklari nechta?", a: 6 },
      { q: "Fe'l zamonlari nechta asosiy turga bo‘linadi?", a: 3 },
      { q: "So‘z turkumlari nechta?", a: 10 },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const items = [
      { q: "Ega va kesim nima?", a: "Gap bo‘laklari" },
      { q: "To‘ldiruvchi nima?", a: "Harakatni to‘ldiradi" },
      { q: "Aniqlovchi nima?", a: "Belgini bildiradi" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Gap bo‘laklari", "So‘z turi", "Zamon", "Undalma"]),
      answer: item.a,
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const items = [
      { q: "Murakkab gap nima?", a: "Bir nechta sodda gapdan iborat" },
      { q: "Qo‘shma gap nima?", a: "Bog‘langan gaplar majmui" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Sodda gap", "Murakkab gap", "So‘z birikmasi", "Fe'l"]),
      answer: item.a,
    };
  }),
};

// ======================= ADABIYOT =======================
export const adabiyot = {
  Oson: Array.from({ length: 200 }, () => {
    const items = [
      { q: "Alisher Navoiy kim bo‘lgan?", a: "Shoir va mutafakkir" },
      { q: "Abdulla Qodiriy qaysi asar muallifi?", a: "O‘tkan kunlar" },
      { q: "G‘afur G‘ulom kasbi nima?", a: "Shoir va yozuvchi" },
      { q: "Cho‘lpon kim bo‘lgan?", a: "Shoir" },
      { q: "Hamid Olimjon kim bo‘lgan?", a: "Shoir" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle([
        "Shoir",
        "Yozuvchi",
        "Shoir va mutafakkir",
        "Rassom",
      ]),
      answer: item.a,
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const items = [
      {
        q: "Abdulla Qodiriyning eng mashhur romani qaysi?",
        a: "O‘tkan kunlar",
      },
      {
        q: "Abdulla Qahhor qaysi janrda ijod qilgan?",
        a: "Hikoya va roman",
      },
      {
        q: "Erkin Vohidov asarlari asosan qaysi janrda?",
        a: "She’riyat",
      },
      {
        q: "Muhammad Yusuf kim bo‘lgan?",
        a: "Shoir",
      },
      {
        q: "Alisher Navoiy qaysi davrda yashagan?",
        a: "Temuriylar davri",
      },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle([
        "She’riyat",
        "Hikoya va roman",
        "Drama",
        "Epos",
      ]),
      answer: item.a,
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const items = [
      {
        q: "Alisher Navoiyning asosiy asarlaridan biri?",
        a: "Xamsa",
      },
      {
        q: "Zahiriddin Muhammad Boburning mashhur asari?",
        a: "Boburnoma",
      },
      {
        q: "Alisher Navoiy asarlari qaysi tilda yozilgan?",
        a: "Chig‘atoy tili",
      },
      {
        q: "Boburnoma qanday janrga kiradi?",
        a: "Memuar",
      },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle([
        "Roman",
        "Memuar",
        "Doston",
        "Hikoya",
      ]),
      answer: item.a,
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const items = [
      {
        q: "Alisher Navoiy ijodining asosiy g‘oyasi?",
        a: "Insonparvarlik",
      },
      {
        q: "Bobur adabiyotda nimasi bilan mashhur?",
        a: "Tarixiy memuar asar",
      },
      {
        q: "O‘zbek mumtoz adabiyotining asoschisi kim?",
        a: "Alisher Navoiy",
      },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle([
        "Insonparvarlik",
        "Vatanparvarlik",
        "Realizm",
        "Romantizm",
      ]),
      answer: item.a,
    };
  }),
};

export const huquq = {
  Oson: Array.from({ length: 200 }, () => {
    const items = [
      { q: "O‘zbekiston Konstitutsiyasi qachon qabul qilingan?", a: 1992 },
      { q: "Huquq nima?", a: "Qonunlar tizimi" },
      { q: "Fuqarolik huquqi nimani tartibga soladi?", a: "Mulk va munosabatlar" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const items = [
      { q: "Jinoyat huquqi nima bilan shug‘ullanadi?", a: "Jinoyatlar bilan" },
      { q: "Sud hokimiyati vazifasi?", a: "Adolatni ta’minlash" },
      { q: "Huquqiy davlat nima?", a: "Qonun ustuvor davlat" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Jinoyatlar bilan", "Sport bilan", "Ta’lim bilan", "Savdo bilan"]),
      answer: item.a,
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const items = [
      { q: "Konstitutsiya nima?", a: "Asosiy qonun" },
      { q: "Huquq manbai nima?", a: "Qonunlar" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Asosiy qonun", "Oddiy hujjat", "Shartnoma", "Buyruq"]),
      answer: item.a,
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const items = [
      { q: "Huquqiy normalar nimani belgilaydi?", a: "Qoidalar va majburiyatlar" },
      { q: "Demokratiya asosiy prinsipi?", a: "Xalq hokimiyati" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle([
        "Qoidalar va majburiyatlar",
        "Erkin savdo",
        "Sport qoidalari",
        "Ta’lim tizimi",
      ]),
      answer: item.a,
    };
  }),
};

// ======================= SPORT =======================
export const sport = {
  Oson: Array.from({ length: 200 }, () => {
    const items = [
      { q: "Futbolda nechta o‘yinchi bo‘ladi?", a: 11 },
      { q: "Basketbol halqa balandligi?", a: 3 },
      { q: "Olimpiada necha yilda bir bo‘ladi?", a: 4 },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: createOptions(item.a),
      answer: String(item.a),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const items = [
      { q: "Futbol maydoni uzunligi?", a: "100-110 m" },
      { q: "VOLEYBOL jamoada nechta o‘yinchi?", a: 6 },
      { q: "Tennis set necha gacha o‘ynaladi?", a: 6 },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["6", "7", "8", "11"]),
      answer: item.a,
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const items = [
      { q: "FIFA nimani boshqaradi?", a: "Futbol" },
      { q: "Olimpiya ramzi nechta halqa?", a: 5 },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Futbol", "Basketbol", "Tennis", "Suzish"]),
      answer: item.a,
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const items = [
      { q: "Eng ko‘p Olimpiada oltin medal olgan sport?", a: "Suzish" },
      { q: "Marafon masofasi?", a: "42 km" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Suzish", "Futbol", "Boks", "Tennis"]),
      answer: item.a,
    };
  }),
};

// ======================= GEOMETRIYA =======================
export const geometriya = {
  Oson: Array.from({ length: 200 }, () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const answer = a * a;

    return {
      question: `Kvadrat yuzi (a=${a})?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const r = Math.floor(Math.random() * 10) + 1;
    const answer = Math.floor(3.14 * r * r);

    return {
      question: `Doira yuzi (r=${r})?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const h = Math.floor(Math.random() * 10) + 1;
    const answer = Math.floor((a * h) / 2);

    return {
      question: `Uchburchak yuzi (a=${a}, h=${h})?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const a = Math.floor(Math.random() * 10) + 3;
    const b = Math.floor(Math.random() * 10) + 3;
    const answer = Math.floor(Math.sqrt(a * a + b * b));

    return {
      question: `Pifagor: a=${a}, b=${b}, c=?`,
      options: createOptions(answer),
      answer: String(answer),
    };
  }),
};

// ======================= TEXNOLOGIYA =======================
export const texnologiya = {
  Oson: Array.from({ length: 200 }, () => {
    const items = [
      { q: "Kompyuter nima?", a: "Hisoblash qurilmasi" },
      { q: "Internet nima?", a: "Global tarmoq" },
      { q: "CPU nima?", a: "Protsessor" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Protsessor", "Monitor", "Klaviatura", "Sichqoncha"]),
      answer: item.a,
    };
  }),

  "O'rta": Array.from({ length: 200 }, () => {
    const items = [
      { q: "HTML nima?", a: "Markup tili" },
      { q: "CSS nima qiladi?", a: "Dizayn beradi" },
      { q: "JavaScript nima?", a: "Dasturlash tili" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Markup tili", "Oyin", "Video", "Rasm"]),
      answer: item.a,
    };
  }),

  Qiyin: Array.from({ length: 200 }, () => {
    const items = [
      { q: "React nima?", a: "Frontend library" },
      { q: "Backend nima?", a: "Server qismi" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle(["Frontend library", "OS", "Game", "Database"]),
      answer: item.a,
    };
  }),

  "Eng qiyin": Array.from({ length: 200 }, () => {
    const items = [
      { q: "API nima?", a: "Dasturlar orasida aloqa" },
      { q: "Database nima?", a: "Ma’lumotlar ombori" },
    ];

    const item = items[Math.floor(Math.random() * items.length)];

    return {
      question: item.q,
      options: shuffle([
        "Dasturlar orasida aloqa",
        "Oyin",
        "Rasm",
        "Video",
      ]),
      answer: item.a,
    };
  }),
};