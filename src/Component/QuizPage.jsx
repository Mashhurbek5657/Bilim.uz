import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { questions } from "../data/generateQuestions";
import confetti from "canvas-confetti";

const TIME_LIMIT = 30;
const PER_TEST = 5;
const PERFECT_BONUS = 10;

// ---------- XP: sinf qanchalik yuqori bo'lsa, shuncha ko'p ----------
const gradeNumber = (g) => parseInt(g, 10) || 1;
const xpPerCorrect = (g) => {
    const n = gradeNumber(g);
    if (n <= 3) return 5;
    if (n <= 6) return 8;
    if (n <= 9) return 10;
    return 12;
};
const calcXP = (correct, g) =>
    correct * xpPerCorrect(g) + (correct === PER_TEST ? PERFECT_BONUS : 0);

// ---------- yordamchilar ----------
function readJSON(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Tanlangan sinfdagi savollar; kam bo'lsa qo'shni sinflardan to'ldiriladi
function getPool(subject, grade) {
    const all = questions[subject];
    if (!all) return [];
    const n = gradeNumber(grade);
    let pool = [...(all[`${n}-sinf`] || [])];
    for (let d = 1; pool.length < PER_TEST * 3 && d <= 3; d++) {
        for (const g of [n - d, n + d]) {
            if (g >= 1 && g <= 11) pool = pool.concat(all[`${g}-sinf`] || []);
        }
    }
    const seen = new Set();
    return pool.filter((q) => (seen.has(q.question) ? false : seen.add(q.question)));
}

const isWordAnswer = (a) => typeof a === "string" && a.length >= 4 && Number.isNaN(Number(a));

// count ta bir-biridan farq qiluvchi savol tanlash
function pickQuestions(pool, count, memoryKey) {
    const recent = readJSON(memoryKey, []);
    const fresh = pool.filter((q) => !recent.includes(q.question));
    const source = fresh.length >= count ? fresh : pool;

    const chosen = [];
    const tagCount = {};

    const compatible = (q, cap, strict) => {
        if (chosen.some((c) => c.question === q.question)) return false;
        if ((tagCount[q.tag] || 0) >= cap) return false;
        if (strict) {
            for (const c of chosen) {
                if (c.answer === q.answer) return false;
                if (isWordAnswer(c.answer) && q.question.includes(c.answer)) return false;
                if (isWordAnswer(q.answer) && c.question.includes(q.answer)) return false;
            }
        }
        return true;
    };

    const rounds = [[2, true], [3, true], [5, false]];
    for (const [cap, strict] of rounds) {
        for (const q of shuffle(source)) {
            if (chosen.length >= count) break;
            if (compatible(q, cap, strict)) {
                chosen.push(q);
                tagCount[q.tag] = (tagCount[q.tag] || 0) + 1;
            }
        }
        if (chosen.length >= count) break;
    }

    // Hali yetmasa, butun to'plamdan (faqat savol matni takrorlanmasin)
    if (chosen.length < count) {
        for (const q of shuffle(pool)) {
            if (chosen.length >= count) break;
            if (!chosen.some((c) => c.question === q.question)) chosen.push(q);
        }
    }

    const keep = Math.min(80, Math.max(0, pool.length - count * 2));
    try {
        localStorage.setItem(
            memoryKey,
            JSON.stringify([...chosen.map((q) => q.question), ...recent].slice(0, keep))
        );
    } catch {
        /* e'tiborsiz */
    }

    return shuffle(chosen);
}

// ---------- Raqobat rejimida bitta o'yinchi paneli ----------
function PlayerPanel({
    title, icon, score, question, qIndex, selected, showAnswer,
    onSelect, time, subject, grade, bordered,
}) {
    return (
        <div className={`p-4 md:p-6 ${bordered ? "border-b md:border-b-0 md:border-r border-[#1C265A]" : ""}`}>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-white text-xl font-bold">{icon} {title}</h2>
                    <p className="text-cyan-400 text-sm font-semibold">⚡ {score * xpPerCorrect(grade)} XP</p>
                </div>
                <span className="text-cyan-400 text-sm">⏱ {TIME_LIMIT - time}s</span>
            </div>

            <div className="h-1 bg-[#1C265A] rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                    style={{ width: `${((qIndex + 1) / PER_TEST) * 100}%` }}
                />
            </div>

            <div className="rounded-2xl border border-[#1C265A] bg-[#070A24]/60 backdrop-blur p-4 mb-4">
                <p className="text-gray-400 text-xs uppercase mb-3">
                    {subject} • {grade} • {qIndex + 1}/{PER_TEST}
                </p>
                <h3 className="text-white text-lg font-bold mb-4">{question.question}</h3>

                <div className="space-y-2">
                    {question.options.map((option, index) => {
                        const correct = option === question.answer;
                        const wrong = selected === option && !correct;
                        let style = "border-[#1C265A] hover:border-cyan-400";
                        if (showAnswer) {
                            if (correct) style = "border-green-500 bg-green-500/10";
                            if (wrong) style = "border-red-500 bg-red-500/10";
                        }
                        return (
                            <button
                                key={index}
                                onClick={() => onSelect(option)}
                                className={`w-full py-3 px-4 rounded-xl border text-left text-white text-sm transition ${style}`}
                            >
                                <span className="inline-flex mr-3 w-6 h-6 rounded-full bg-[#20274A] items-center justify-center text-xs">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#0A0F28] rounded-lg p-3 border border-[#1C265A]">
                    <p className="text-gray-400 text-xs">JAVOBLAR</p>
                    <b className="text-cyan-400">{score}/{PER_TEST}</b>
                </div>
                <div className="bg-[#0A0F28] rounded-lg p-3 border border-[#1C265A]">
                    <p className="text-gray-400 text-xs">FOIZ</p>
                    <b className="text-white">{Math.round((score / PER_TEST) * 100)}%</b>
                </div>
            </div>
        </div>
    );
}

export default function QuizPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }

    const isMulti = state?.mode === "multiplayer";
    const grade = state?.grade || state?.difficulty || "5-sinf";

    // ---------- Savollar (har test boshida yangi 5 ta / raqobatda 10 ta) ----------
    const quizQuestions = useMemo(() => {
        if (!state?.subject) return isMulti ? { player1: [], player2: [] } : [];
        const pool = getPool(state.subject, grade);
        const key = `recentQ:${state.subject}:${grade}`;

        if (isMulti) {
            const ten = pickQuestions(pool, PER_TEST * 2, key);
            return {
                player1: ten.filter((_, i) => i % 2 === 0),
                player2: ten.filter((_, i) => i % 2 === 1),
            };
        }
        return pickQuestions(pool, PER_TEST, key);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    // Solo
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [time, setTime] = useState(0);

    // Raqobat
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [p1Index, setP1Index] = useState(0);
    const [p2Index, setP2Index] = useState(0);
    const [p1Selected, setP1Selected] = useState(null);
    const [p2Selected, setP2Selected] = useState(null);
    const [p1Show, setP1Show] = useState(false);
    const [p2Show, setP2Show] = useState(false);
    const [multiplayerFinished, setMultiplayerFinished] = useState(false);

    useEffect(() => {
        if (!user) navigate("/login");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Taymer
    useEffect(() => {
        if (finished || multiplayerFinished) return;
        const id = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [finished, multiplayerFinished]);

    // Vaqt tugasa keyingi savolga o'tadi
    useEffect(() => {
        if (time < TIME_LIMIT || finished || multiplayerFinished) return;
        if (isMulti) nextMultiplayerQuestion();
        else nextQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    // ---------- Saqlash ----------
    const addXP = (xp) => {
        const xpData = readJSON("xpData", {});
        xpData[state.subject] = Number(xpData[state.subject] || 0) + xp;
        localStorage.setItem("xpData", JSON.stringify(xpData));
    };

    const addHistory = (entry) => {
        const history = readJSON("testHistory", []);
        localStorage.setItem("testHistory", JSON.stringify([entry, ...history]));
    };

    const saveResult = (finalScore) => {
        const xp = calcXP(finalScore, grade);
        addXP(xp);
        addHistory({
            subject: state.subject,
            level: grade,
            score: `${finalScore}/${PER_TEST}`,
            xp: `+${xp} XP`,
            date: new Date().toLocaleString(),
            time: Date.now(),
        });
    };

    const saveMultiplayerResult = (winner, s1, s2) => {
        const best = Math.max(s1, s2);
        const xp = calcXP(best, grade);
        addXP(xp);
        addHistory({
            subject: state.subject,
            level: grade,
            score:
                winner === "DURANG"
                    ? `DURANG (${s1} vs ${s2})`
                    : `${winner} YUTDI (${best} vs ${Math.min(s1, s2)})`,
            xp: `+${xp} XP`,
            date: new Date().toLocaleString(),
            time: Date.now(),
        });
    };

    const fireConfetti = () => confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    // ---------- Solo ----------
    const question = !isMulti ? quizQuestions[currentQuestion] : null;

    const handleSelect = (option) => {
        if (showAnswer || !question) return;
        setSelected(option);
        setShowAnswer(true);
        if (option === question.answer) setScore((p) => p + 1);
    };

    function nextQuestion() {
        if (finished) return;
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion((p) => p + 1);
            setSelected(null);
            setShowAnswer(false);
            setTime(0);
        } else {
            saveResult(score);
            fireConfetti();
            setFinished(true);
        }
    }

    // ---------- Raqobat ----------
    const player1Question = isMulti ? quizQuestions.player1?.[p1Index] : null;
    const player2Question = isMulti ? quizQuestions.player2?.[p2Index] : null;

    const handlePlayer1Select = (option) => {
        if (p1Show || !player1Question) return;
        setP1Selected(option);
        setP1Show(true);
        if (option === player1Question.answer) setPlayer1Score((p) => p + 1);
    };

    const handlePlayer2Select = (option) => {
        if (p2Show || !player2Question) return;
        setP2Selected(option);
        setP2Show(true);
        if (option === player2Question.answer) setPlayer2Score((p) => p + 1);
    };

    function nextMultiplayerQuestion() {
        if (multiplayerFinished) return;
        if (p1Index >= PER_TEST - 1) {
            const winner =
                player1Score > player2Score ? "Player 1" : player2Score > player1Score ? "Player 2" : "DURANG";
            saveMultiplayerResult(winner, player1Score, player2Score);
            fireConfetti();
            setMultiplayerFinished(true);
            return;
        }
        setP1Index((p) => p + 1);
        setP2Index((p) => p + 1);
        setP1Selected(null);
        setP2Selected(null);
        setP1Show(false);
        setP2Show(false);
        setTime(0);
    }

    // ---------- Render ----------
    if (!user) return null;

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-2xl">
                Test tanlanmagan
            </div>
        );
    }

    const notEnough = isMulti ? !player1Question || !player2Question : !question;

    if (notEnough && !finished && !multiplayerFinished) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4 px-5 text-center">
                <p className="text-2xl">Bu fan/sinf uchun savollar topilmadi</p>
                <button
                    onClick={() => navigate("/testlar")}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 font-semibold"
                >
                    ← Orqaga
                </button>
            </div>
        );
    }

    // ===== SOLO TUGADI =====
    if (finished && !isMulti) {
        const xp = calcXP(score, grade);
        return (
            <div className="min-h-screen flex items-center justify-center px-5 max-md:-mt-[210px]">
                <div className="max-w-[520px] w-full bg-[#080B25]/80 border border-[#1C265A] rounded-[30px] p-8 text-center backdrop-blur-xl">
                    <div className="text-5xl">{score === PER_TEST ? "🏆" : "🎉"}</div>
                    <h1 className="text-white text-3xl font-bold mt-3">Tabriklaymiz!</h1>
                    <p className="text-gray-400 mt-2">{state.subject} • {grade} tugadi</p>

                    <div className="grid grid-cols-3 gap-3 mt-8">
                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">TO'G'RI</p>
                            <b className="text-white text-xl">{score}/{PER_TEST}</b>
                        </div>
                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">XP</p>
                            <b className="text-cyan-400 text-xl">+{xp}</b>
                        </div>
                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">%</p>
                            <b className="text-white text-xl">{Math.round((score / PER_TEST) * 100)}%</b>
                        </div>
                    </div>

                    <p className="text-[#9FA5C5] text-xs mt-4">
                        Har to'g'ri javob: {xpPerCorrect(grade)} XP
                        {score === PER_TEST ? ` • Mukammal natija bonusi: +${PERFECT_BONUS} XP` : ""}
                    </p>

                    <button
                        onClick={() => navigate("/testlar")}
                        className="mt-7 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold"
                    >
                        Yangi test
                    </button>
                </div>
            </div>
        );
    }

    // ===== RAQOBAT TUGADI =====
    if (multiplayerFinished && isMulti) {
        const winner =
            player1Score > player2Score ? "Player 1" : player2Score > player1Score ? "Player 2" : "DURANG";

        const card = (name, icon, sc, isWinner) => (
            <div
                className={`border-2 rounded-2xl p-6 text-center ${isWinner ? "border-cyan-400 bg-cyan-500/10" : "border-[#1C265A] bg-[#090F2A]/60"}`}
            >
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-white text-xl font-bold mb-4">{name}</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-gray-400 text-sm">TO'G'RI JAVOB</p>
                        <b className="text-cyan-400 text-2xl">{sc}/{PER_TEST}</b>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">XP</p>
                        <b className="text-cyan-400 text-xl">+{calcXP(sc, grade)}</b>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">FOIZ</p>
                        <b className="text-white">{Math.round((sc / PER_TEST) * 100)}%</b>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="min-h-screen flex items-center justify-center px-5 max-md:-mt-[210px]">
                <div className="max-w-[720px] w-full bg-[#080B25]/80 border border-[#1C265A] rounded-[30px] p-8 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{winner === "DURANG" ? "🤝" : "🏆"}</div>
                        <h1 className="text-white text-4xl font-bold">
                            {winner === "DURANG" ? "DURANG!" : `${winner} G'ALABA QOZONDI!`}
                        </h1>
                        <p className="text-gray-400 mt-2">{state.subject} • {grade} • Raqobat rejimi</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {card("Player 1", "👤", player1Score, player1Score > player2Score)}
                        {card("Player 2", "👥", player2Score, player2Score > player1Score)}
                    </div>

                    <button
                        onClick={() => navigate("/testlar")}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold"
                    >
                        Yangi test
                    </button>
                </div>
            </div>
        );
    }

    // ===== SOLO O'YIN =====
    if (!isMulti && question) {
        return (
            <div className="min-h-screen px-5 pt-[120px] pb-[130px] md:pb-10 max-md:-mt-[160px]">
                <div className="max-w-[730px] mx-auto">
                    <div className="flex justify-between text-gray-400 mb-5 text-sm">
                        <span>Savol {currentQuestion + 1} / {quizQuestions.length}</span>
                        <span className="text-cyan-400">
                            ⚡ {score * xpPerCorrect(grade)} XP
                            <span className="text-gray-500"> (+{xpPerCorrect(grade)} / to'g'ri)</span>
                        </span>
                    </div>

                    <div className="h-1.5 bg-[#1C265A] rounded-full mb-8 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                        />
                    </div>

                    <div className="rounded-[30px] border border-[#1C265A] bg-[#070A24]/80 backdrop-blur-xl p-6 shadow-[0_0_80px_rgba(28,38,90,.35)]">
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-gray-400 text-sm uppercase">{state.subject} • {grade}</p>
                            <span className="text-cyan-400 text-sm">⏱ {TIME_LIMIT - time}s</span>
                        </div>

                        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-8">{question.question}</h1>

                        <div className="space-y-3">
                            {question.options.map((option, index) => {
                                const correct = option === question.answer;
                                const wrong = selected === option && !correct;
                                let style = "border-[#1C265A] hover:border-cyan-400";
                                if (showAnswer) {
                                    if (correct) style = "border-green-500 bg-green-500/10";
                                    if (wrong) style = "border-red-500 bg-red-500/10";
                                }
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelect(option)}
                                        className={`w-full py-4 px-5 rounded-2xl border text-left text-white transition ${style}`}
                                    >
                                        <span className="inline-flex mr-4 w-8 h-8 rounded-full bg-[#20274A] items-center justify-center text-sm">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-between gap-3 md:gap-4">
                            <button
                                onClick={() => navigate("/testlar")}
                                className="mt-7 block px-8 py-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 font-semibold text-sm hover:bg-red-600/30"
                            >
                                ← Chiqish
                            </button>
                            <button
                                disabled={!showAnswer}
                                onClick={() => {
                                    nextQuestion();

                                    setTimeout(() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                    }, 50);
                                }}
                                className="mt-7 ml-auto block px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-40"
                            >
                                {currentQuestion === quizQuestions.length - 1 ? "Yakunlash" : "Keyingisi →"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== RAQOBAT O'YINI =====
    if (isMulti && player1Question && player2Question) {
        return (
            <div className="min-h-screen px-0 pt-[120px] pb-[130px] md:pb-10 max-md:-mt-[160px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <PlayerPanel
                        title="Player 1" icon="👤" score={player1Score} question={player1Question}
                        qIndex={p1Index} selected={p1Selected} showAnswer={p1Show}
                        onSelect={handlePlayer1Select} time={time} subject={state.subject} grade={grade} bordered
                    />
                    <PlayerPanel
                        title="Player 2" icon="👥" score={player2Score} question={player2Question}
                        qIndex={p2Index} selected={p2Selected} showAnswer={p2Show}
                        onSelect={handlePlayer2Select} time={time} subject={state.subject} grade={grade}
                    />
                </div>

                <div className="flex justify-between gap-3 md:gap-4 px-4 md:px-6 mt-4">
                    <button
                        onClick={() => navigate("/testlar")}
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 font-semibold text-sm hover:bg-red-600/30"
                    >
                        ← Chiqish
                    </button>
                    <button
                        disabled={!p1Show || !p2Show}
                        onClick={() => {
                            nextMultiplayerQuestion();

                            setTimeout(() => {
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });
                            }, 50);
                        }}
                        className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm disabled:opacity-40"
                    >
                        {p1Index >= PER_TEST - 1 ? "Yakunlash" : "Keyingisi →"}
                    </button>
                </div>
            </div>
        );
    }

    return null;
}