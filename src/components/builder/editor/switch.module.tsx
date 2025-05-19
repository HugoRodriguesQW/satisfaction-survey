import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Field } from "./field.module";


type SwitchFieldProps = {
    label?: ReactNode,
    value?: boolean,
    className?: HTMLAttributes<HTMLDivElement>["className"]
    onChange?: (value: boolean) => void;
}

export function SwitchField({ className, label, onChange, value }: SwitchFieldProps) {
    return <Field  label={label} className={twMerge(
        "gap-2 flex-row items-center justify-between my-3 [&>:first-child]:mb-0 [&>:first-child]:text-foreground/80 mt-3",
        className
    )}>
        <div onClick={() => {
            onChange?.(!value)
        }} className={
            twMerge(
                "bg-gradient-to-r from-foreground/5 to-foreground/15 min-w-[50px] min-h-6 rounded-lg relative overflow-hidden cursor-pointer transition-all",
                value && "bg-neon/20"
            )
        }>
            <div className={
                twMerge("absolute w-1/2 h-full transition-all duration-100 rounded-lg",
                    value && "bg-gradient-to-br from-neon/90 via-neon-mid/90 to-neon-sub/30 left-1/2",
                    !value && "bg-foreground/20 left-0"
                )
            } />
        </div>
    </Field>
}