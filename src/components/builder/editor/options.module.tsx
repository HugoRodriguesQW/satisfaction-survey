import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { QuestionProperties } from "@/resources/definitions";
import { TextField } from "./text.module";
import { NumberField } from "./number.module";
import { IoMdClose } from "react-icons/io";


type OptionsFieldProps = {
    option: QuestionProperties["selection"]["options"][number],
    className?: HTMLAttributes<HTMLDivElement>["className"]
    onChange?: (list: OptionsFieldProps["option"]) => void;
    disableRemove?: boolean
    onRemove?: () => void
}

export function OptionsField({ className, option, onChange, disableRemove, onRemove }: OptionsFieldProps) {
    return (
        <div className={twMerge("grid options-grid-template items-end gap-2 bg-foreground/5 first:mt-2 not-last:border-b border-b-foreground/10 px-3 pb-3", className)}>
            <TextField label="Text" placeholder="None" value={option.text}
                onChange={(value) => {
                    onChange?.({
                        ...option,
                        text: value
                    })
                }} />

            <NumberField value={option.bias}
                className="col-span-2 ring-violet-500/60 ring-1  text-violet-500 font-semibold"
                label={<div className="text-violet-600">Bias</div>}
                placeholder={String(QuestionProperties.selection.options[0].bias)}
                onChange={(value) => {
                    onChange?.({
                        ...option,
                        bias: value
                    })
                }} />

            <button
                disabled={disableRemove}
                className={twMerge(
                    "bg-background/50 hover:bg-red-500/50 text-red-500/50 ring-red-500/60 ring aspect-square rounded-md flex items-center w-full justify-center",
                    "disabled:text-foreground/30 disabled:ring-foreground/30 disabled:cursor-not-allowed disabled:bg-background/50"
                )}
                onClick={onRemove}>
                <IoMdClose />
            </button>
        </div>
    )
}