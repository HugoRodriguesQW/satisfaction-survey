import { twMerge } from "tailwind-merge"

type ApplySurveyHeaderProps = {
    name?: string
}

export function ApplySurveyHeader({ name }: ApplySurveyHeaderProps) {
    return (
        <div className={
            twMerge(
                "absolute left-1/2 -ml-10 overflow-visible text-nowrap w-20 justify-center flex text-lg font-bold",
                "max-sm:static max-sm:-ml-0 max-sm:w-auto max-sm:left-auto max-[500px]:hidden"
            )
        }>{name} <span className="text-foreground/80 ml-1">/ Survey</span></div>
    )
}