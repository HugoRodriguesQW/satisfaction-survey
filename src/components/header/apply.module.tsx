type ApplySurveyHeaderProps = {
    name?: string
}

export function ApplySurveyHeader({ name }: ApplySurveyHeaderProps) {
    return (
        <div className="absolute left-1/2 -ml-10 overflow-visible text-nowrap w-20 justify-center flex text-lg font-bold">{name} <span className="text-foreground/80 ml-1">/ Survey</span></div>
    )
}