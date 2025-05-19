import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type FieldProps = {
    label?: ReactNode,
    className?: string,
    children: ReactNode
}

export type BasicFieldProps<T, S> = Omit<T, "onChange"> & S

export function Field(props: FieldProps) {
    return (
        <div className={
            twMerge(
                "flex flex-col mt-[1rem]",
                props.className
            )
        }>
            {props.label && (
                <div className="text-xs font-semibold text-foreground/80 mb-[0.2rem]">
                    {props.label}
                </div>
            )}
            {props.children}
        </div>
    )
}