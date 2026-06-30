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
            <div className="min-h-screen flex items-center justify-center text-white text-2xl">
                Test tanlanmagan
            </div>
        )

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

            <div className="
min-h-screen 
flex 
items-center 
justify-center 
px-5
max-md:-mt-[210px]
">


                <div className="
max-w-[520px]
w-full
bg-[#080B25]/80
border
border-[#1C265A]
rounded-[30px]
p-8
text-center
backdrop-blur-xl
">


                    <div className="text-5xl">
                        🎉
                    </div>


                    <h1 className="text-white text-3xl font-bold mt-3">
                        Tabriklaymiz!
                    </h1>



                    <p className="text-gray-400 mt-2">
                        {state.subject} tugadi
                    </p>



                    <div className="grid grid-cols-3 gap-3 mt-8">


                        <div className="border border-[#1C265A] rounded-xl p-4">
                            <p className="text-gray-400 text-sm">
                                TO‘G‘RI
                            </p>

                            <b className="text-white text-xl">
                                {score}/{quizQuestions.length}
                            </b>

                        </div>



                        <div className="border border-[#1C265A] rounded-xl p-4">

                            <p className="text-gray-400 text-sm">
                                XP
                            </p>

                            <b className="text-cyan-400 text-xl">
                                +{score * 5}
                            </b>

                        </div>




                        <div className="border border-[#1C265A] rounded-xl p-4">

                            <p className="text-gray-400 text-sm">
                                %
                            </p>

                            <b className="text-white text-xl">
                                {Math.round(score / quizQuestions.length * 100)}%
                            </b>


                        </div>


                    </div>




                    <button

                        onClick={() => navigate("/testlar")}

                        className="
mt-7
w-full
py-3
rounded-xl
bg-gradient-to-r
from-purple-600
to-cyan-500
text-white
font-semibold
">

                        Yangi test

                    </button>



                </div>

            </div>


        )

    }







    return (


        <div className="
min-h-screen 
px-5 
pt-[120px]
max-md:-mt-[160px]
">


            <div className="max-w-[730px] mx-auto">





                <div className="
flex
justify-between
text-gray-400
mb-5
text-sm
">


                    <button onClick={() => navigate("/testlar")}>

                        ← Chiqish

                    </button>


                    <span>

                        Savol {currentQuestion + 1} / {quizQuestions.length}

                    </span>



                    <span className="text-cyan-400">

                        ⚡ {score * 5}

                    </span>


                </div>





                <div className="
h-1.5
bg-[#1C265A]
rounded-full
mb-8
overflow-hidden
">


                    <div

                        className="
h-full
bg-gradient-to-r
from-purple-500
to-cyan-400
"

                        style={{

                            width:
                                `${((currentQuestion + 1) / quizQuestions.length) * 100}%`

                        }}

                    />


                </div>







                <div className="
rounded-[30px]
border
border-[#1C265A]
bg-[#070A24]/80
backdrop-blur-xl
p-6
shadow-[0_0_80px_rgba(28,38,90,.35)]
">





                    <p className="
text-gray-400
text-sm
uppercase
mb-5
">

                        {state.subject} • {state.difficulty}

                    </p>





                    <h1 className="
text-white
text-3xl
font-bold
mb-8
">

                        {question.question}

                    </h1>







                    <div className="space-y-3">


                        {

                            question.options.map((option, index) => {


                                const correct = option === question.answer;

                                const wrong =
                                    selected === option && !correct;



                                let style =
                                    "border-[#1C265A] hover:border-cyan-400";



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
py-4
px-5
rounded-2xl
border
text-left
text-white
transition
${style}
`}

                                    >


                                        <span className="
inline-flex
mr-4
w-8
h-8
rounded-full
bg-[#20274A]
items-center
justify-center
text-sm
">

                                            {String.fromCharCode(65 + index)}

                                        </span>


                                        {option}



                                    </button>


                                )



                            })


                        }



                    </div>







                    <button

                        disabled={!showAnswer}

                        onClick={nextQuestion}

                        className="
mt-7
ml-auto
block
px-8
py-3
rounded-xl
bg-gradient-to-r
from-purple-600
to-cyan-500
text-white
disabled:opacity-40
">


                        Keyingisi →

                    </button>




                </div>




            </div>





        </div>



    )


}