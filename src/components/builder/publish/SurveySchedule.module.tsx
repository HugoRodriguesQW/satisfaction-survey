import { RelativeTime } from "@/resources/utils";
import { PublishComponent, PublishSection, PublishTitle } from "./Common.module";
import { DateIndicator } from "./DateIndicator";
import { PublishModal } from "../publish.module";

type SurveyScheduleProps = {
    start: Date,
    end: Date,
    disabled?: boolean
    onClick?: () => void
}

export function startRelativeTime(start: Date | undefined) {
    return RelativeTime(start, new Date(), { useLong: true })
}

export function endRelativeTime(end: Date | undefined, start: Date | undefined) {
    const started = Date.now() >= (start ? start.getTime() : -Infinity);

    return RelativeTime(
        end,
        started ? new Date() : start,
        {
            inText: started ? "in" : "after",
            lowDiffText: end ? "immediately" : "never",
            useLong: true
        })
}

export function SurveySchedule({ start, end, disabled, onClick }: SurveyScheduleProps) {

    return (
        <PublishSection onClick={onClick}>
            <PublishComponent>
                <PublishTitle>Survey scheduling</PublishTitle>
            </PublishComponent>


            <div className="max-sm:flex items-center flex-col">

                <PublishModal.Caller
                    container="start-date"
                    className="flex flex-col items-start px-5"
                    title="change the start time"
                    name="change the start time"
                >

                    <div className="font-bold text-foreground/60 text-xs px-1 pt-2">Start at</div>

                    <DateIndicator
                        date={start}
                        disabled={disabled}
                        relative={startRelativeTime(start)}

                    />

                </PublishModal.Caller>



                <PublishModal.Caller
                    container="end-date"
                    className="flex flex-col items-start px-5"
                    title="change the end time"
                    name="change the end time"
                >
                    <div className="font-bold text-foreground/60 text-xs px-1 pt-2">End at</div>
                    <DateIndicator
                        date={end}
                        disabled={disabled}
                        relative={endRelativeTime(end, start)}
                    />
                </PublishModal.Caller>
            </div>

        </PublishSection>
    )
}