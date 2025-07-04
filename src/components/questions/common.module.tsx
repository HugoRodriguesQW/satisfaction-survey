import { Question } from "@/resources/definitions"
import { twMerge } from "tailwind-merge"

type CommonQuestionCompProps = {
    question: Question,
    responseMode?: boolean
}

export function QuestionCommonComponent({ question, responseMode }: CommonQuestionCompProps) {
    return (
        <>
            <div className={
                twMerge(
                    "text-xl border border-foreground/10 px-2 py-1 focus:outline-0",
                    `font-${question.typography.title.weight}`,
                    `font-${question.typography.title.fontFamily}`,
                    responseMode && "border-0 text-3xl w-full"
                )
            } >
                {question.section.title}
            </div>

            <div className={twMerge("text-lg text-gray-500  border border-foreground/10 px-2 py-1 focus:outline-0 mb-5",
                `font-${question.typography.description.weight}`,
                `font-${question.typography.description.fontFamily}`,
                responseMode && "border-0 text-2xl w-full"
            )} >
                {question.section.description}
            </div>
        </>
    )
}