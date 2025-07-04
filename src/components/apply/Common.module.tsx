import { twMerge } from "tailwind-merge"
import { PageContainer } from "../page.module"
import { Header } from "../header.module"

type ApplyContainerProps = React.HTMLAttributes<HTMLDivElement> & { surveyName?: string }
export function ApplyContainer({ className, children, surveyName }: ApplyContainerProps) {

    return (
        <PageContainer>
            <Header showFile={false} showAccount={false} showSurveyName={!!surveyName} surveyName={surveyName} />
            <div className={twMerge(
                "h-full w-full",
                className
            )}>
                {children}
            </div>
        </PageContainer>
    )
}