import { SelectionQuestion } from "@/resources/definitions";
import { twMerge } from "tailwind-merge";

type SelectionQuestionCompProps = {
    question: SelectionQuestion,
    responseMode?: boolean
}

export function SelectionQuestionComponent({ question }: SelectionQuestionCompProps) {
    return (
        <div className="flex max-w-[600px] flex-wrap gap-3 items-center"> {
            question.selection.options.map((option, j) => {
                let selected = false;
                return <button
                    key={"question-component-" + question.type + j}
                    itemProp={String(selected)}
                    onClick={() => selected = !selected}
                    className={
                        twMerge(
                            "bg-gradient-to-br to-violet-500/80 from-neon-mid/70 p-2 px-6 rounded-md min-h- flex-[1_auto]",
                            `font-${question.typography.buttons.fontFamily}`,
                            `font-${question.typography.buttons.weight}`
                        )
                    } >
                    {option.text}
                </button>
            })

        }
        </div>
    )
}