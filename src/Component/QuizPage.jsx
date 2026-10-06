import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { questions } from "../data/generateQuestions";
import confetti from "canvas-confetti";

export default function QuizPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        navigate("/register");
        return null;
    }

    const allQuestions =
        state
            ? questions[state.subject]?.[state.difficulty] || []
            : [];

    // For multiplayer, create separate question sets for each player
    const quizQuestions = useMemo(() => {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

        if (state?.mode === "multiplayer") {
            // Create 5 unique questions for player 1
            const player1Qs = shuffled.slice(0, 5);
            // Create 5 different unique questions for player 2
            const player2Qs = shuffled.slice(5, 10);

            return {
                player1: player1Qs,
                player2: player2Qs
            };
        }

        // Solo mode: 10 questions
        return shuffled.slice(0, 10);
    }, [state, allQuestions.length]);

    // Solo Mode State
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [time, setTime] = useState(0);

    // Multiplayer Mode State
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player1CurrentQuestion, setPlayer1CurrentQuestion] = useState(0);
    const [player2CurrentQuestion, setPlayer2CurrentQuestion] = useState(0);
    const [player1Selected, setPlayer1Selected] = useState(null);
    const [player2Selected, setPlayer2Selected] = useState(null);
    const [player1ShowAnswer, setPlayer1ShowAnswer] = useState(false);
    const [player2ShowAnswer, setPlayer2ShowAnswer] = useState(false);
    const [multiplayerFinished, setMultiplayerFinished] = useState(false);

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-2xl">
                Test tanlanmagan
            </div>
        );
    }

    // Get current question based on mode
    const question = state?.mode === "multiplayer" ? null : quizQuestions[currentQuestion];
    const player1Question = state?.mode === "multiplayer" ? quizQuestions.player1?.[player1CurrentQuestion] : null;
    const player2Question = state?.mode === "multiplayer" ? quizQuestions.player2?.[player2CurrentQuestion] : null;

    // XP SAVE FOR SOLO
    const saveResult = (finalScore) => {
        const xpValue = finalScore * 5;
        let xpData = {};

        try {
            xpData = JSON.parse(localStorage.getItem("xpData")) || {};
        } catch {
            xpData = {};
        }

        xpData[state.subject] =
            Number(xpData[state.subject] || 0) + xpValue;

        localStorage.setItem("xpData", JSON.stringify(xpData));

        let history = [];

        try {
            history = JSON.parse(localStorage.getItem("testHistory")) || [];
        } catch {
            history = [];
        }

        const newHistory = {
            subject: state.subject,
            level: state.difficulty,
            score: `${finalScore}/${quizQuestions.length}`,
            xp: `+${xpValue} XP`,
            date: new Date().toLocaleString(),
            time: Date.now(),
        };

        localStorage.setItem(
            "testHistory",
            JSON.stringify([newHistory, ...history])
        );
    };

    // XP SAVE FOR MULTIPLAYER
    const saveMultiplayerResult = (winner, winnerScore, loserScore) => {
        const xpValue = winnerScore * 5;
        let xpData = {};

        try {
            xpData = JSON.parse(localStorage.getItem("xpData")) || {};
        } catch {
            xpData = {};
        }

        xpData[state.subject] =
            Number(xpData[state.subject] || 0) + xpValue;

        localStorage.setItem("xpData", JSON.stringify(xpData));

        let history = [];

        try {
            history = JSON.parse(localStorage.getItem("testHistory")) || [];
        } catch {
            history = [];
        }

        const newHistory = {
            subject: state.subject,
            level: state.difficulty,
            score: `${winner} YUTDI (${winnerScore} vs ${loserScore})`,
            xp: `+${xpValue} XP`,
            date: new Date().toLocaleString(),
            time: Date.now(),
        };

        localStorage.setItem(
            "testHistory",
            JSON.stringify([newHistory, ...history])
        );
    };

    const fireConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
        });
    };

    // SOLO MODE HANDLERS
    const handleSelect = (option) => {
        if (showAnswer) return;
        setSelected(option);
        setShowAnswer(true);

        if (option === question.answer) {
            setScore((p) => p + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion((p) => p + 1);
            setSelected(null);
            setShowAnswer(false);
            setTime(0);
        } else {
            const finalScore =
                score + (selected === question.answer ? 1 : 0);
            saveResult(finalScore);
            fireConfetti();
            setFinished(true);
        }
    };

    // MULTIPLAYER MODE HANDLERS
    const handlePlayer1Select = (option) => {
        if (player1ShowAnswer) return;
        setPlayer1Selected(option);
        setPlayer1ShowAnswer(true);

        if (option === player1Question.answer) {
            setPlayer1Score((p) => p + 1);
        }
    };

    const handlePlayer2Select = (option) => {
        if (player2ShowAnswer) return;
        setPlayer2Selected(option);
        setPlayer2ShowAnswer(true);

        if (option === player2Question.answer) {
            setPlayer2Score((p) => p + 1);
        }
    };

    const nextMultiplayerQuestion = () => {
        const player1Done = player1CurrentQuestion >= 4;
        const player2Done = player2CurrentQuestion >= 4;

        if (!player1Done) {
            setPlayer1CurrentQuestion((p) => p + 1);
            setPlayer1Selected(null);
            setPlayer1ShowAnswer(false);
        }

        if (!player2Done) {
            setPlayer2CurrentQuestion((p) => p + 1);
            setPlayer2Selected(null);
            setPlayer2ShowAnswer(false);
        }

        if (player1Done && player2Done) {
            saveMultiplayerResult(
                player1Score > player2Score
                    ? "Player 1"
                    : player2Score > player1Score
                        ? "Player 2"
                        : "DURANG",
                Math.max(player1Score, player2Score),
                Math.min(player1Score, player2Score)
            );

            fireConfetti();
            setMultiplayerFinished(true);
        }

        setTime(0);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((t) => {
                if (t >= 30) {
                    clearInterval(timer);
                    if (state?.mode === "multiplayer") {
                        nextMultiplayerQuestion();
                    } else {
                        nextQuestion();
                    }
                    return 0;
                }
                return t + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, player1CurrentQuestion, player2CurrentQuestion]);

    // ============ SOLO MODE FINISHED ============
    if (finished && state?.mode !== "multiplayer") {
        const finalScore =
            score + (selected === question.answer ? 1 : 0);
        return (
            <div className="min-h-screen flex items-center justify-center px-5 max-md:-mt-[210px]">
                <div className="max-w-[520px] w-full bg-[#080B25]/80 border border-[#1C265A] rounded-[30px] p-8 text-center backdrop-blur-xl">
                    <div className="text-5xl">🎉</div>

                    <h1 className="text-white text-3xl font-bold mt-3">
                        Tabriklaymiz!
                    </h1>

                    <p className="text-gray-400 mt-2">{state.subject} tugadi</p>

                    <div className="grid grid-cols-3 gap-3 mt-8">
                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">TO'G'RI</p>
                            <b className="text-white text-xl">
                                {finalScore}/{quizQuestions.length}
                            </b>
                        </div>

                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">XP</p>
                            <b className="text-cyan-400 text-xl">
                                +{finalScore * 5}
                            </b>
                        </div>

                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">%</p>
                            <b className="text-white text-xl">
                                {Math.round((finalScore / quizQuestions.length) * 100)}%
                            </b>
                        </div>
                    </div>

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

    // ============ MULTIPLAYER MODE FINISHED ============
    if (multiplayerFinished && state?.mode === "multiplayer") {
        const winner =
            player1Score > player2Score
                ? "Player 1"
                : player2Score > player1Score
                    ? "Player 2"
                    : "DURANG";

        return (
            <div className="min-h-screen flex items-center justify-center px-5 max-md:-mt-[210px]">
                <div className="max-w-[720px] w-full bg-[#080B25]/80 border border-[#1C265A] rounded-[30px] p-8 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">
                            {winner === "DURANG" ? "🤝" : "🏆"}
                        </div>

                        <h1 className="text-white text-4xl font-bold">
                            {winner === "Player 1"
                                ? "Player 1 G'ALABA QOZONI!"
                                : winner === "Player 2"
                                    ? "Player 2 G'ALABA QOZONI!"
                                    : "DURANG!"}
                        </h1>

                        <p className="text-gray-400 mt-2">
                            {state.subject} • Raqobat rejimi
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {/* Player 1 */}
                        <div
                            className={`border-2 rounded-2xl p-6 text-center ${player1Score > player2Score
                                    ? "border-cyan-400 bg-cyan-500/10"
                                    : "border-[#1C265A] bg-[#090F2A]/60"
                                }`}
                        >
                            <div className="text-4xl mb-3">👤</div>
                            <h3 className="text-white text-xl font-bold mb-4">
                                Player 1
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm">TO'G'RI JAVOB</p>
                                    <b className="text-cyan-400 text-2xl">
                                        {player1Score}/5
                                    </b>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">XP</p>
                                    <b className="text-cyan-400 text-xl">
                                        +{player1Score * 5}
                                    </b>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">FOIZ</p>
                                    <b className="text-white">
                                        {Math.round(
                                            (player1Score / 5) * 100
                                        )}
                                        %
                                    </b>
                                </div>
                            </div>
                        </div>

                        {/* Player 2 */}
                        <div
                            className={`border-2 rounded-2xl p-6 text-center ${player2Score > player1Score
                                    ? "border-cyan-400 bg-cyan-500/10"
                                    : "border-[#1C265A] bg-[#090F2A]/60"
                                }`}
                        >
                            <div className="text-4xl mb-3">👥</div>
                            <h3 className="text-white text-xl font-bold mb-4">
                                Player 2
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm">TO'G'RI JAVOB</p>
                                    <b className="text-cyan-400 text-2xl">
                                        {player2Score}/5
                                    </b>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">XP</p>
                                    <b className="text-cyan-400 text-xl">
                                        +{player2Score * 5}
                                    </b>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm">FOIZ</p>
                                    <b className="text-white">
                                        {Math.round(
                                            (player2Score / 5) * 100
                                        )}
                                        %
                                    </b>
                                </div>
                            </div>
                        </div>
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

    // ============ SOLO MODE PLAYING ============
    if (state?.mode !== "multiplayer" && question) {
        return (
            <div className="min-h-screen px-5 pt-[120px] max-md:-mt-[160px]">
                <div className="max-w-[730px] mx-auto">
                    <div className="flex justify-between text-gray-400 mb-5 text-sm">

                        <span>
                            Savol {currentQuestion + 1} / {quizQuestions.length}
                        </span>

                        <span className="text-cyan-400">⚡ {score * 5}</span>
                    </div>

                    <div className="h-1.5 bg-[#1C265A] rounded-full mb-8 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                            style={{
                                width: `${((currentQuestion + 1) / quizQuestions.length) * 100
                                    }%`,
                            }}
                        />
                    </div>

                    <div className="rounded-[30px] border border-[#1C265A] bg-[#070A24]/80 backdrop-blur-xl p-6 shadow-[0_0_80px_rgba(28,38,90,.35)]">
                        <div className="flex justify-between items-center mb-5">
                            <p className="text-gray-400 text-sm uppercase">
                                {state.subject} • {state.difficulty}
                            </p>
                            <span className="text-cyan-400 text-sm">
                                ⏱ {30 - time}s
                            </span>
                        </div>

                        <h1 className="text-white text-3xl font-bold mb-8">
                            {question.question}
                        </h1>

                        <div className="space-y-3">
                            {question.options.map((option, index) => {
                                const correct = option === question.answer;
                                const wrong = selected === option && !correct;

                                let style = "border-[#1C265A] hover:border-cyan-400";

                                if (showAnswer) {
                                    if (correct)
                                        style = "border-green-500 bg-green-500/10";
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
                        <div className=" flex justify-between bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 flex gap-3 md:gap-4">
                    <button
                        onClick={() => navigate("/testlar")}
                        className="mt-7  block px-8 py-3 rounded-xl bg-gradient-to-r bg-red-600/20 border border-red-500/50 text-red-400 font-semibold text-sm hover:bg-red-600/30"
                    >
                        ← Chiqish
                    </button>

                            <button
                                disabled={!showAnswer}
                                onClick={nextQuestion}
                                className="mt-7 ml-auto block px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-40"
                            >
                                Keyingisi →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============ MULTIPLAYER MODE PLAYING ============
    if (state?.mode === "multiplayer" && player1Question && player2Question) {
        const player1Done = player1CurrentQuestion >= 5;
        const player2Done = player2CurrentQuestion >= 5;
        const bothDone = player1Done && player2Done;

        return (
            <div className="min-h-screen px-0 pt-[120px] max-md:-mt-[160px] ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-screen md:h-auto">
                    {/* ========== PLAYER 1 SIDE ========== */}
                    <div className="border-r md:border-r border-[#1C265A] p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-white text-xl font-bold">
                                    👤 Player 1
                                </h2>
                                <p className="text-cyan-400 text-sm font-semibold">
                                    ⚡ {player1Score * 5} XP
                                </p>
                            </div>
                            <span className="text-cyan-400 text-sm">
                                ⏱ {30 - time}s
                            </span>
                        </div>

                        <div className="h-1 bg-[#1C265A] rounded-full mb-6 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                                style={{
                                    width: `${((player1CurrentQuestion + 1) / 5) * 100
                                        }%`,
                                }}
                            />
                        </div>

                        {!player1Done ? (
                            <div className="rounded-2xl border border-[#1C265A] bg-[#070A24]/60 backdrop-blur p-4 mb-4">
                                <p className="text-gray-400 text-xs uppercase mb-3">
                                    {state.subject} • {state.difficulty}
                                </p>

                                <h3 className="text-white text-lg font-bold mb-4">
                                    {player1Question.question}
                                </h3>

                                <div className="space-y-2">
                                    {player1Question.options.map((option, index) => {
                                        const correct = option === player1Question.answer;
                                        const wrong =
                                            player1Selected === option && !correct;

                                        let style =
                                            "border-[#1C265A] hover:border-cyan-400";

                                        if (player1ShowAnswer) {
                                            if (correct)
                                                style = "border-green-500 bg-green-500/10";
                                            if (wrong)
                                                style = "border-red-500 bg-red-500/10";
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handlePlayer1Select(option)}
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
                        ) : (
                            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 backdrop-blur p-6 mb-4 text-center">
                                <p className="text-green-400 text-lg font-bold">
                                    ✅ Testni tugatdingiz!
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-[#0A0F28] rounded-lg p-3 border border-[#1C265A]">
                                <p className="text-gray-400 text-xs">JAVOBLAR</p>
                                <b className="text-cyan-400">
                                    {player1Score}/5
                                </b>
                            </div>
                            <div className="bg-[#0A0F28] rounded-lg p-3 border border-[#1C265A]">
                                <p className="text-gray-400 text-xs">FOIZ</p>
                                <b className="text-white">
                                    {Math.round(
                                        (player1Score / 5) * 100
                                    )}
                                    %
                                </b>
                            </div>
                        </div>
                    </div>

                    {/* ========== PLAYER 2 SIDE ========== */}
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-white text-xl font-bold">
                                    👥 Player 2
                                </h2>
                                <p className="text-cyan-400 text-sm font-semibold">
                                    ⚡ {player2Score * 5} XP
                                </p>
                            </div>
                            <span className="text-cyan-400 text-sm">
                                ⏱ {30 - time}s
                            </span>
                        </div>

                        <div className="h-1 bg-[#1C265A] rounded-full mb-6 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                                style={{
                                    width: `${((player2CurrentQuestion + 1) / 5) * 100
                                        }%`,
                                }}
                            />
                        </div>

                        {!player2Done ? (
                            <div className="rounded-2xl border border-[#1C265A] bg-[#070A24]/60 backdrop-blur p-4 mb-4">
                                <p className="text-gray-400 text-xs uppercase mb-3">
                                    {state.subject} • {state.difficulty}
                                </p>

                                <h3 className="text-white text-lg font-bold mb-4">
                                    {player2Question.question}
                                </h3>

                                <div className="space-y-2">
                                    {player2Question.options.map((option, index) => {
                                        const correct = option === player2Question.answer;
                                        const wrong =
                                            player2Selected === option && !correct;

                                        let style =
                                            "border-[#1C265A] hover:border-cyan-400";

                                        if (player2ShowAnswer) {
                                            if (correct)
                                                style = "border-green-500 bg-green-500/10";
                                            if (wrong)
                                                style = "border-red-500 bg-red-500/10";
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handlePlayer2Select(option)}
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
                        ) : (
                            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 backdrop-blur p-6 mb-4 text-center">
                                <p className="text-green-400 text-lg font-bold">
                                    ✅ Testni tugatdingiz!
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-[#0A0F28] rounded-lg p-3 border border-[#1C265A]">
                                <p className="text-gray-400 text-xs">JAVOBLAR</p>
                                <b className="text-cyan-400">
                                    {player2Score}/5
                                </b>
                            </div>
                            <div className="bg-[#0A0F28] rounded-lg p-3 border border-[#1C265A]">
                                <p className="text-gray-400 text-xs">FOIZ</p>
                                <b className="text-white">
                                    {Math.round(
                                        (player2Score / 5) * 100
                                    )}
                                    %
                                </b>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== ACTION BUTTONS ========== */}
                <div className=" flex justify-between bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 flex gap-3 md:gap-4">
                    <button
                        onClick={() => navigate("/testlar")}
                        className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400 font-semibold text-sm hover:bg-red-600/30"
                    >
                        ← Chiqish
                    </button>

                    {!bothDone && (
                        <button
                            disabled={!player1ShowAnswer || !player2ShowAnswer}
                            onClick={nextMultiplayerQuestion}
                            className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm disabled:opacity-40"
                        >
                            Keyingisi →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return null;
}