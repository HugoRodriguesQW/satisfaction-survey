/* eslint-disable @typescript-eslint/no-explicit-any */
import Head from "next/head";
import { ApplyContainer } from "./Common.module";
import { Survey } from "@/resources/server/surveys";
import { SelectionQuestionComponent } from "../questions/selection.module";
import { Question } from "@/resources/definitions";
import { QuestionCommonComponent } from "../questions/common.module";
import { useEffect, useState } from "react";
import { SliderQuestionComponent } from "../questions/slider.module";
import { TextInputQuestionComponent } from "../questions/textinput.module";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Progress } from "../progress.module";
import { twMerge } from "tailwind-merge";
import { Separator } from "../separator.module";
import { LuSendHorizontal } from "react-icons/lu";

type ApplyResponseProps = {
    survey: Survey
}

export function ApplyResponse({ survey }: ApplyResponseProps) {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showEnd, setShowEnd] = useState(false);
    const [showStart, setShowStart] = useState(true);

    const question = survey.questions[currentQuestion];

    const [surveyLength] = useState(survey.questions.length)

    function handleNextQuestion() {
        if (survey.questions[currentQuestion + 1]) {
            if (showStart) return setShowStart(false)
            return setCurrentQuestion(currentQuestion + 1)
        }

        if (!showEnd) setShowEnd(true);
    }

    function handleBackQuestion() {
        if (survey.questions[currentQuestion - 1]) {
            if (showEnd) return setShowEnd(false)
            return setCurrentQuestion(currentQuestion - 1)

        }

        if (!showStart) setShowStart(true)
    }

    function handleStart() {
        setShowStart(false);
    }


    return (
        <ApplyContainer surveyName={survey.name ?? "Untitled Survey"}>
            <Head>
                <title>{survey.name ?? "Untitled Survey"} | Privora</title>
            </Head>


            <div className="h-full  gap-6 pb-10 w-full flex">


                <div className="max-w-[980px] [&>*]:first:max-w-[80%] relative object-cover overflow-hidden  bg-foreground/5 rounded-[3rem] mx-auto flex flex-col justify-center items-center  w-full">

                    {showStart && (<>
                        <div className="flex-1 flex flex-col w-full justify-center gap-6 items-center">

                        </div>
                    </>)}

                    {(!showEnd && !showStart) && (<>
                        <div className="flex-1 flex flex-col w-full justify-center gap-6 items-center">
                            <div className="flex text-center flex-col gap-1 items-center">
                                <QuestionCommonComponent question={question} responseMode />
                            </div>
                            {CurrentSurveyForm({ question })}
                        </div>
                    </>)}

                    {showEnd && (<>
                        <div className="flex-1 flex flex-col w-full justify-center gap-6 items-center">

                        </div>
                    </>)}


                    {
                        !showEnd && <Progress
                            value={(showEnd ? surveyLength : currentQuestion) / surveyLength}
                            className="absolute top-0 w-full"
                            hidePercentage
                             />
                    }

                    <div className="flex  w-full border-t border-foreground/25">
                        {!showStart && <SwitchQuestionButton direction="back" onClick={handleBackQuestion} disabled={showStart} miniButton  className="rounded-bl-[3rem]" />}
                        <Separator orientation="vertical" />
                    {(!showEnd && !showStart) && <SwitchQuestionButton direction="next" onClick={handleNextQuestion} miniButton className="rounded-br-[3rem]" />}
                        {showStart && <SwitchQuestionButton direction="continue" miniButton onClick={handleStart}  className="rounded-b-[3rem]" />}
                        {showEnd && <SwitchQuestionButton direction="submit" miniButton delay={2900}  className="rounded-br-[3rem]" />}
                    </div>




                </div>

            </div>


        </ApplyContainer>
    )
}

type SwitchQuestionButtonProps = {
    direction: "next" | "back" | "submit" | "continue",
    miniButton?: boolean,
    disabled?: boolean,
    onClick?: () => void;
    className?: React.HtmlHTMLAttributes<HTMLDivElement>["className"],
    delay?: number;
}

function SwitchQuestionButton({ direction, disabled, onClick, className, miniButton, delay }: SwitchQuestionButtonProps) {

    const [lockedDelay, setLockedDelay] = useState(false);
    const [lockTimeout, setLockTimeout] = useState(0);

    useEffect(() => {
        if (delay) {
            setLockedDelay(true)
            setLockTimeout(delay)
            const timeout = setTimeout(() => {
                setLockedDelay(false)
            }, delay)

            return () => clearTimeout(timeout)

        } else {
            setLockedDelay(false)
        }
    }, [delay])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLockTimeout(lockTimeout - 1000)
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }

    }, [lockTimeout])

    return (
        <button
            disabled={disabled || lockedDelay}
            onClick={lockedDelay ? undefined : onClick}
            className={
                twMerge(
                    "start-4 flex-1 flex items-center justify-start h-full from-foreground/0 to-foreground/0 not-disabled:hover:to-foreground/10 transition-all duration-100 opacity-90 not-disabled:hover:opacity-100 not-disabled:hover:[&>*]:last:opacity-100 gap-1",
                    direction === "back" && "flex-row-reverse bg-gradient-to-l disabled:text-foreground/40",
                    direction === "next" && "flex-row         bg-gradient-to-r disabled:opacity-0 disabled:[&>*]:opacity-30",
                    direction === "submit" && "bg-gradient-to-r from-neon font-bold tail-button to-neon-sub not-disabled:hover:to-neon-violet",
                    (direction === "back" && !miniButton) && "not-disabled:hover:[&>*]:first:mr-30 ",
                    (direction === "next" && !miniButton) && "not-disabled:hover:[&>*]:first:ml-30",
                    !miniButton && "apply-response-mask ",
                    miniButton && "justify-center flex-1 text-lg py-5 font-bold",
                    (direction === "continue" && miniButton) && "py-5",
                    lockedDelay && "cursor-not-allowed",
                    !lockedDelay && "cursor-pointer",
                    className
                )
            }>

            {!lockedDelay && (<>
                {direction === "back" && <MdKeyboardArrowLeft className={twMerge("w-12 h-12 transition-all duration-100", miniButton && "w-8 h-8")} />}
                {direction === "next" && <MdKeyboardArrowRight className={twMerge("w-12 h-12 transition-all duration-100 ", miniButton && "w-8 h-8")} />}
                {direction === "submit" && <LuSendHorizontal className={twMerge("w-12 h-12 transition-all duration-100 ", miniButton && "w-6 h-5")} />}
            </>)}

            {lockedDelay && (<div>
                {Math.floor((lockTimeout / 1000))}s
            </div>)}
            <div className={twMerge("opacity-80", direction === "submit" && "opacity-100")}>
                {direction === "back" && "Back"}
                {direction === "next" && "Next"}
                {direction === "submit" && "Submit"}
                {direction === "continue" && "Continue"}
            </div>
        </button>
    )
}

function CurrentSurveyForm({ question }: { question: Question }) {
    switch (question.type) {
        case "selection":
            return <SelectionQuestionComponent question={question} responseMode />;
        case "slider":
            return <SliderQuestionComponent question={question} responseMode />;
        case "text-input":
            return <TextInputQuestionComponent question={question} responseMode />;
        case "text-message":
            return null;
        default:
            return null
    }
}