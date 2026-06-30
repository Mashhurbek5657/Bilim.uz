import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { questions } from "../data/questions";
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
            ?
            questions[state.subject]?.[state.difficulty] || []
            :
            [];

    const quizQuestions = useMemo(() => {
        return [
            ...allQuestions
        ]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    }, [state]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [time, setTime] = useState(0);

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl xs:text-2xl px-4">
                Test tanlanmagan
            </div>
        );
    }

    const question = quizQuestions[currentQuestion];

    // XP SAVE
    const saveResult = (finalScore) => {
        const xpValue = finalScore * 5;

        let xpData = {};

        try {
            xpData =
                JSON.parse(localStorage.getItem("xpData")) || {};
        } catch {
            xpData = {};
        }

        xpData[state.subject] =
            Number(xpData[state.subject] || 0) + xpValue;

        localStorage.setItem(
            "xpData",
            JSON.stringify(xpData)
        );

        let history = [];

        try {
            history =
                JSON.parse(localStorage.getItem("testHistory")) || [];
        } catch {
            history = [];
        }

        const newHistory = {
            subject: state.subject,
            level: state.difficulty,
            score: `${finalScore}/${quizQuestions.length}`,
            xp: `+${xpValue} XP`,
            date: new Date().toLocaleString(),
            time: Date.now()
        };

        localStorage.setItem(
            "testHistory",
            JSON.stringify(
                [
                    newHistory,
                    ...history
                ]
            )
        );
    };

    const fireConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: {
                y: 0.6
            }
        });
    };

    const handleSelect = (option) => {
        if (showAnswer) return;

        setSelected(option);
        setShowAnswer(true);

        if (option === question.answer) {
            setScore(p => p + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(p => p + 1);
            setSelected(null);
            setShowAnswer(false);
        } else {
            const finalScore =
                score +
                (selected === question.answer ? 1 : 0);

            saveResult(finalScore);
            fireConfetti();
            setFinished(true);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(t => {
                if (t >= 30) {
                    clearInterval(timer);
                    nextQuestion();
                    return 0;
                }
                return t + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion]);

    if (finished) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 xs:px-5 pt-[80px] xs:pt-[100px] pb-8">

                <div className="
                w-full
                max-w-[520px]
                bg-[#080B25]/80
                border
                border-[#1C265A]
                rounded-[20px]
                xs:rounded-[25px]
                sm:rounded-[30px]
                p-5
                xs:p-6
                sm:p-8
                text-center
                backdrop-blur-xl
                shadow-[0_0_80px_rgba(28,38,90,.35)]
                ">

                    <div className="text-4xl xs:text-5xl">
                        🎉
                    </div>

                    <h1 className="text-white text-2xl xs:text-3xl sm:text-4xl font-bold mt-2 xs:mt-3">
                        Tabriklaymiz!
                    </h1>

                    <p className="text-gray-400 mt-1 xs:mt-2 text-sm xs:text-base">
                        {state.subject} tugadi
                    </p>

                    {/* STATS GRID */}
                    <div className="grid grid-cols-3 gap-2 xs:gap-3 mt-6 xs:mt-8">

                        <div className="border border-[#1C265A] rounded-lg xs:rounded-xl p-3 xs:p-4">
                            <p className="text-gray-400 text-xs xs:text-sm">
                                TO'G'RI
                            </p>
                            <b className="text-white text-lg xs:text-xl">
                                {score}/{quizQuestions.length}
                            </b>
                        </div>

                        <div className="border border-[#1C265A] rounded-lg xs:rounded-xl p-3 xs:p-4">
                            <p className="text-gray-400 text-xs xs:text-sm">
                                XP
                            </p>
                            <b className="text-cyan-400 text-lg xs:text-xl">
                                +{score * 5}
                            </b>
                        </div>

                        <div className="border border-[#1C265A] rounded-lg xs:rounded-xl p-3 xs:p-4">
                            <p className="text-gray-400 text-xs xs:text-sm">
                                %
                            </p>
                            <b className="text-white text-lg xs:text-xl">
                                {Math.round(score / quizQuestions.length * 100)}%
                            </b>
                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/testlar")}
                        className="
                        mt-6
                        xs:mt-7
                        w-full
                        py-2.5
                        xs:py-3
                        rounded-lg
                        xs:rounded-xl
                        bg-gradient-to-r
                        from-purple-600
                        to-cyan-500
                        text-white
                        text-sm
                        xs:text-base
                        font-semibold
                        hover:shadow-[0_0_20px_rgba(34,211,238,.35)]
                        transition-all
                        duration-300
                        "
                    >
                        Yangi test
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 xs:px-5 pt-[80px] xs:pt-[100px] sm:pt-[120px] pb-6 xs:pb-8 sm:pb-10">

            <div className="w-full max-w-[730px] mx-auto">

                {/* HEADER */}
                <div className="
                flex
                justify-between
                items-center
                text-gray-400
                mb-4
                xs:mb-5
                sm:mb-6
                text-xs
                xs:text-sm
                ">

                    <button
                        onClick={() => navigate("/testlar")}
                        className="hover:text-white transition-colors duration-300"
                    >
                        ← Chiqish
                    </button>

                    <span className="text-center flex-1">
                        Savol {currentQuestion + 1} / {quizQuestions.length}
                    </span>

                    <span className="text-cyan-400 font-semibold">
                        ⚡ {score * 5}
                    </span>

                </div>

                {/* PROGRESS BAR */}
                <div className="
                h-1 xs:h-1.5
                bg-[#1C265A]
                rounded-full
                mb-6
                xs:mb-8
                overflow-hidden
                ">

                    <div
                        className="
                        h-full
                        bg-gradient-to-r
                        from-purple-500
                        to-cyan-400
                        transition-all
                        duration-300
                        "
                        style={{
                            width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`
                        }}
                    />

                </div>

                {/* TIMER */}
                <div className="flex justify-end mb-4 xs:mb-5">
                    <div className={`
                    text-xs
                    xs:text-sm
                    font-semibold
                    px-3
                    xs:px-4
                    py-1.5
                    xs:py-2
                    rounded-full
                    ${time > 20
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        }
                    `}>
                        ⏱️ {30 - time}s
                    </div>
                </div>

                {/* QUESTION CARD */}
                <div className="
                rounded-[20px]
                xs:rounded-[25px]
                sm:rounded-[30px]
                border
                border-[#1C265A]
                bg-[#070A24]/80
                backdrop-blur-xl
                p-4
                xs:p-5
                sm:p-6
                shadow-[0_0_80px_rgba(28,38,90,.35)]
                ">

                    {/* SUBJECT & DIFFICULTY */}
                    <p className="
                    text-gray-400
                    text-xs
                    xs:text-sm
                    uppercase
                    mb-3
                    xs:mb-4
                    sm:mb-5
                    tracking-wider
                    ">
                        {state.subject} • {state.difficulty}
                    </p>

                    {/* QUESTION TEXT */}
                    <h1 className="
                    text-white
                    text-xl
                    xs:text-2xl
                    sm:text-3xl
                    font-bold
                    mb-6
                    xs:mb-8
                    leading-[1.4]
                    ">
                        {question.question}
                    </h1>

                    {/* OPTIONS */}
                    <div className="space-y-2 xs:space-y-3">

                        {question.options.map((option, index) => {

                            const correct = option === question.answer;
                            const wrong = selected === option && !correct;

                            let style =
                                "border-[#1C265A] hover:border-cyan-400 hover:bg-cyan-500/5";

                            if (showAnswer) {
                                if (correct)
                                    style =
                                        "border-green-500 bg-green-500/10";
                                if (wrong)
                                    style =
                                        "border-red-500 bg-red-500/10";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                    w-full
                                    py-3
                                    xs:py-4
                                    px-4
                                    xs:px-5
                                    rounded-lg
                                    xs:rounded-xl
                                    sm:rounded-2xl
                                    border
                                    text-left
                                    text-white
                                    text-sm
                                    xs:text-base
                                    transition-all
                                    duration-300
                                    cursor-pointer
                                    ${style}
                                    `}
                                    disabled={showAnswer}
                                >

                                    <span className="
                                    inline-flex
                                    mr-3
                                    xs:mr-4
                                    w-7
                                    xs:w-8
                                    h-7
                                    xs:h-8
                                    rounded-full
                                    bg-[#20274A]
                                    items-center
                                    justify-center
                                    text-xs
                                    xs:text-sm
                                    font-semibold
                                    flex-shrink-0
                                    ">
                                        {String.fromCharCode(65 + index)}
                                    </span>

                                    <span className="break-words">
                                        {option}
                                    </span>

                                </button>
                            );

                        })}

                    </div>

                    {/* NEXT BUTTON */}
                    <button
                        disabled={!showAnswer}
                        onClick={nextQuestion}
                        className="
                        mt-6
                        xs:mt-7
                        sm:mt-8
                        ml-auto
                        block
                        px-5
                        xs:px-6
                        sm:px-8
                        py-2.5
                        xs:py-3
                        rounded-lg
                        xs:rounded-xl
                        bg-gradient-to-r
                        from-purple-600
                        to-cyan-500
                        text-white
                        text-sm
                        xs:text-base
                        font-semibold
                        disabled:opacity-40
                        transition-all
                        duration-300
                        hover:shadow-[0_0_20px_rgba(34,211,238,.35)]
                        "
                    >
                        Keyingisi →
                    </button>

                </div>

            </div>

        </div>
    );
}