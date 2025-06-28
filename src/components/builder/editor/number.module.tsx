import { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { BasicFieldProps, Field } from "./field.module";

type BasicNumberFieldProps<T> = BasicFieldProps<T, {
    label: ReactNode,
    value?: number | null;
    onChange?: (value: number | null) => void;
    fieldClassName?: HTMLAttributes<HTMLDivElement>["className"]
}>

type NumberFieldProps = BasicNumberFieldProps<
    Omit<InputHTMLAttributes<HTMLInputElement>, "value">>

export function NumberField({ className, value, label, onChange, step = 1, ...rest }: NumberFieldProps) {
    return (
        <Field label={label} className={rest.fieldClassName}>
            <input {...rest} type="number" className={
                twMerge(
                    "bg-foreground/10 rounded-md px-[0.4rem] py-[0.3rem] text-sm text-foreground/80 outline-0",
                    className
                )
            } value={value ?? undefined} step={step}

                onChange={(e) => {
                    if (e.target.value === "" || e.target.value == null) {
                        return onChange?.(null)
                    }
                    onChange?.(Number(e.target.value))
                }} /></Field>
    )
}
