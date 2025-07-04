import { SliderQuestion } from "@/resources/definitions"
import { twMerge } from "tailwind-merge"

type SliderQuestionCompProps = {
    question: SliderQuestion,
    responseMode?: boolean
}

export function SliderQuestionComponent({ question, responseMode }: SliderQuestionCompProps) {

    
    return (
        <div className={twMerge(
            "w-full max-w-[600px] flex gap-2 items-center",
            responseMode && "max-w-full text-xl gap-7 font-bold text-foreground/85"
        )}>
            {question.input.minText}
            <div className={
                twMerge(
                    "relative bg-foreground/10 w-full rounded-full h-3 flex items-center",
                    responseMode && "h-5"
                )
            }>
                <div className={
                    twMerge(
                        "absolute h-6 w-6 rounded-full bg-gradient-to-br from-neon to-neon-sub left-[50%] -ml-3 pointer",
                        responseMode && "h-9 w-9 -ml-4.5"
                    )
                } />
            </div>
            {question.input.maxText}
        </div>
    )
}