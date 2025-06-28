import { twMerge } from "tailwind-merge"

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function PublishTitle({ className, children, ...rest }: DivProps) {
    return (
        <div className={twMerge("text-sm text-foreground/70 not-last:mb-1 font-bold flex justify-between", className)} {...rest}>
            {children}
        </div>
    )
}

export function PublishSection({ className, children, ...rest }: DivProps) {
    return (
        <div className={twMerge(
            "not-last:border-b border-foreground/20 py-3 pt-4  last:pb-5",
            className)}
            {...rest}>

            {children}
        </ div>
    )
}

export function PublishComponent({ className, children, ...rest }: DivProps) {
    return (
        <div className={twMerge(
            "px-5 py-3 first:pt-1 last:pb-1",
            className)}
            {...rest}>

            {children}
        </ div>
    )
}
