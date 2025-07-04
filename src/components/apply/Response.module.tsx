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
import { ThreePairCards } from "@/resources/survey";

type ApplyResponseProps = {
    survey: Survey
}

export function ApplyResponse({ survey }: ApplyResponseProps) {


    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [surveyLength] = useState(survey.questions.length)

    const view = ThreePairCards(currentQuestion)


    function handleNextQuestion() {
        if (currentQuestion <= surveyLength) {
            return setCurrentQuestion(currentQuestion + 1)
        }
    }

    function handleBackQuestion() {
        if (currentQuestion >= 0) {
            return setCurrentQuestion(currentQuestion - 1)

        }
    }

    return (
        <ApplyContainer surveyName={survey.name ?? "Untitled Survey"}>
            <Head>
                <title>{survey.name ?? "Untitled Survey"} | Privora</title>
            </Head>


            <div className="lg:pb-10  w-full h-full flex items-center overflow-hidden">
                <div className="w-full h-full max-w-[1024px] max-h-[710px] mx-auto relative flex items-center  overflow-visible">
                    {/* Previous Card */}
                    <div className={twMerge(
                        "absolute x-auto  lg:[&>*]:first:max-w-[80%] object-cover overflow-hidden bg-foreground/5 rounded-[3rem]  flex flex-col justify-center items-center  w-full h-full lg:transition-all lg:duration-400 backdrop-blur-3xl",
                        view.c1.pos === 0 && "-left-[calc(100%+5vw)] h-[70%] opacity-60 lg:blur-xs z-20",
                        view.c1.pos === 1 && "left-0  h h-[100%]  z-30",
                        view.c1.pos === 2 && "left-[calc(100%+5vw)]  h-[70%] opacity-60 lg:blur-xs z-10",
                        (view.c1.content < -1 || view.c1.content > surveyLength) && "hidden",
                        "max-lg:rounded-none"
                    )} >
                        <ResponseCard
                            question={survey.questions[view.c1.content]}
                            index={view.c1.content}
                            handleBack={handleBackQuestion}
                            handleNext={handleNextQuestion}
                            length={surveyLength} secondary={view.c1.pos !== 1} />
                    </div>

                    {/* Current Card */}
                    <div className={twMerge(
                        "absolute  x-auto lg:[&>*]:first:max-w-[80%] object-cover overflow-hidden  bg-foreground/5 rounded-[3rem] flex flex-col justify-center items-center  w-full h-full lg:transition-all lg:duration-400  backdrop-blur-3xl",
                        view.c2.pos === 0 && "-left-[calc(100%+5vw)] h-[70%] opacity-60 lg:blur-xs z-20",
                        view.c2.pos === 1 && "left-0  h h-[100%]  z-30",
                        view.c2.pos === 2 && "left-[calc(100%+5vw)]  h-[70%] opacity-60 lg:blur-xs z-10",
                        (view.c2.content < -1 || view.c2.content > surveyLength) && "hidden",
                        "max-lg:rounded-none"
                    )}>
                        <ResponseCard
                            question={survey.questions[view.c2.content]}
                            index={view.c2.content}

                            handleBack={handleBackQuestion}
                            handleNext={handleNextQuestion}
                            length={surveyLength} secondary={view.c2.pos !== 1} />
                    </div>

                    {/* Next Card */}
                    <div className={twMerge(
                        "absolute flex-1 lg:[&>*]:first:max-w-[80%] object-cover overflow-hidden bg-foreground/5 rounded-[3rem]  flex flex-col justify-center items-center  w-full h-full lg:transition-all lg:duration-400  backdrop-blur-3xl",
                        view.c3.pos === 0 && "-left-[calc(100%+5vw)] h-[70%] opacity-60 lg:blur-xs z-20",
                        view.c3.pos === 1 && "left-0  h h-[100%]  z-30",
                        view.c3.pos === 2 && "left-[calc(100%+5vw)]  h-[70%] opacity-60 lg:blur-xs z-10",
                        (view.c3.content < -1 || view.c3.content > surveyLength) && "hidden",
                        "max-lg:rounded-none"
                    )} >
                        <ResponseCard
                            question={survey.questions[view.c3.content]}
                            index={view.c3.content}
                            handleBack={handleBackQuestion}
                            handleNext={handleNextQuestion}
                            length={surveyLength} secondary={view.c3.pos !== 1} />
                    </div>
                </div>
            </div>

        </ApplyContainer>
    )
}

type ResponseCardProps = {
    question: Question,
    index: number,
    length: number,
    handleBack: () => void,
    handleNext: () => void,
    secondary?: boolean

}

function ResponseCard({ question, index, length, handleBack, handleNext, secondary }: ResponseCardProps) {

    const showStart = index === -1;
    const showEnd = index === length;


    return (
        <>

            {showStart && (<>
                <div className="flex-1 flex flex-col w-full justify-center gap-6 items-center">

                </div>
            </>)}

            {(!showEnd && !showStart && question) && (<>
                <div className={twMerge("flex-1 flex  flex-col justify-center-safe gap-6  w-full py-[8%] px-[4%] sm:px-[8%] overflow-y-auto show-scrollbar")}>
                    <div className="flex  text-center flex-col gap-1 items-center">
                        <QuestionCommonComponent question={question} responseMode />
                    </div>
                    {!secondary && CurrentSurveyForm({ question })}
                </div>
            </>)}

            {showEnd && (<>
                <div className="flex-1 flex flex-col w-full justify-center gap-6 items-center">

                </div>
            </>)}


            {
                (!showEnd && !secondary) && <Progress
                    value={(showEnd ? length : index) / length}
                    className="order-[-1] w-full grayscale-100 bg-foreground/5"
                    hidePercentage
                />
            }

            {!secondary && <div className="flex w-full border-t border-foreground/25">
                {!showStart && <SwitchQuestionButton direction="back" onClick={handleBack} disabled={showStart} miniButton className="lg:rounded-bl-[3rem]" />}
                {showStart &&  <div className="flex-1"></div>}
                <Separator orientation="vertical" />
                {(!showEnd && !showStart) && <SwitchQuestionButton direction="next" onClick={handleNext} miniButton className="lg:rounded-br-[3rem]" />}
                {showStart && <SwitchQuestionButton direction="continue" miniButton onClick={handleNext} className="lg:rounded-b-[3rem]" />}
                {showEnd && <SwitchQuestionButton direction="submit" miniButton delay={2900} className="lg:rounded-br-[3rem]" />}
            </div>}
        </>
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