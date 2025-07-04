import { SliderQuestion } from "@/resources/definitions"
import { twMerge } from "tailwind-merge"

type SliderQuestionCompProps = {
    question: SliderQuestion,
    responseMode?: boolean
}

export function SliderQuestionComponent({ question, responseMode }: SliderQuestionCompProps) {

    
    return (
        <div className={twMerge(
            "w-full max-w-[600px] flex gap-2 items-center  max-sm:flex-wrap",
            responseMode && "max-w-full lg:text-xl gap-7 max-sm:gap-3  text-foreground/85"
        )}>
            <div className="max-sm:order-2 max-sm:flex-1/2">{question.input.minText}</div>
            <div className={
                twMerge(
                    "relative bg-foreground/10 w-full rounded-full h-3 flex items-center max-sm:order-1"
                )
            }>
                <div className={
                    twMerge(
                        "absolute h-7 w-7 rounded-full bg-gradient-to-br from-neon to-neon-sub left-[50%] -ml-3 pointer",
                        responseMode && "sm:h-9 sm:w-9 -ml-4.5"
                    )
                } />
            </div>
             <div className="max-sm:order-3">{question.input.maxText}</div>
        </div>
    )
}