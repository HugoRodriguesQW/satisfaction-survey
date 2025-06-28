import { RelativeTime } from "@/resources/utils";
import { PublishComponent, PublishSection, PublishTitle } from "./Common.module";
import { DateSelector } from "./DateSelector.module";
import { ModalCaller } from "@/components/modal";

type SurveyScheduleProps = {
    start?: Date,
    end?: Date,
    disabled?: boolean
    onClick?: () => void
}

export function SurveySchedule({ start, end, disabled, onClick }: SurveyScheduleProps) {

    const startTime = start?.getTime() ?? Infinity;
    const started = Date.now() >= startTime;
    
    return (
        <PublishSection onClick={onClick}>
            <PublishComponent>
                <PublishTitle>Survey scheduling</PublishTitle>
            </PublishComponent>



            <ModalCaller
                className="flex flex-col items-start px-5"
                title="change the start time"
                name="change the start time"
            >

                <div className="font-bold text-foreground/60 text-xs px-1 pt-2">Start at</div>

                <DateSelector
                    date={start}
                    disabled={disabled}
                    relative={RelativeTime(start, new Date(), { useLong: true })}

                />

            </ModalCaller>



            <ModalCaller
                className="flex flex-col items-start px-5"
                title="change the end time"
                name="change the end time"
            >
                <div className="font-bold text-foreground/60 text-xs px-1 pt-2">End at</div>
                <DateSelector
                    date={end}
                    disabled={disabled}
                    relative={RelativeTime(
                        end,
                        started ? new Date() : start,
                        {
                            inText: started ? "in" : "after",
                            lowDiffText: end ? "immediately" : "never",
                            useLong: true
                        })}
                />
            </ModalCaller>

        </PublishSection>
    )
}