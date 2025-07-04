import { TextInputQuestion } from "@/resources/definitions"
import { Input } from "../input.module"
import { twMerge } from "tailwind-merge"


type TextInputQuestionCompProps = {
    question: TextInputQuestion,
    responseMode?: boolean
}

export function TextInputQuestionComponent({ question, responseMode }: TextInputQuestionCompProps) {


    return (
        <div className={twMerge(
            "w-full max-w-[600px]",
            responseMode && "text-xl max-w-full [&>*]:[&>input]:py-3 [&>*]:[&>input]:text-center [&>*]:[&>input]:focus:outline-foreground/40 [&>*]:[&>input]:outline [&>*]:[&>input]:outline-foreground/20"
        )}>
            <Input placeholder={question.input.placeholder} maxLength={question.input.max ?? 512} minLength={question.input.min ?? 0} />
        </div>
    )
}