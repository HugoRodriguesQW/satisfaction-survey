import { InputHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { BasicFieldProps, Field } from "./field.module";

type BasicTextFieldProps<T> = BasicFieldProps<T, {
    label: ReactNode,
    onChange?: (value: string) => void;
}>

type TextFieldProps = BasicTextFieldProps<InputHTMLAttributes<HTMLInputElement>>

export function TextField({ className, value, label, onChange, ...rest }: TextFieldProps) {
    return (
        <Field label={label} className={className}>
            <input {...rest} type="text" className={
                twMerge(
                    "bg-foreground/10 rounded-md px-[0.4rem] py-[0.3rem] text-sm text-foreground/80 outline-0",
                )
            } value={value}

                onChange={(e) => {
                    onChange?.(e.target.value.replace("\n", ""))
                }} /></Field>
    )
}

type LongTextField = BasicTextFieldProps<InputHTMLAttributes<HTMLTextAreaElement>>

export function LongTextField({ className, value, label, onChange, ...rest }: LongTextField) {
    return (
        <Field label={label} className={className}>
            <textarea {...rest} className={
                twMerge(
                    "bg-foreground/10 rounded-md px-[0.4rem] py-[0.3rem] text-sm resize-none text-foreground/80 h-[80px] overflow-auto outline-0"
                )
            } value={value}

                onChange={(e) => {
                    onChange?.(e.target.value.replace("\n", ""))
                }} /></Field>
    )
}