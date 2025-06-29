import { RelativeTime } from "@/resources/utils";
import { PublishComponent, PublishSection, PublishTitle } from "./Common.module";
import { DateIndicator } from "./DateIndicator";
import { PublishModal } from "../publish.module";
import { Separator } from "@/components/separator.module";
import { DataPicker } from "./DataPicker.module";
import { TimePicker } from "./TimePicker.module";

type SurveyScheduleProps = {
    start?: Date,
    end?: Date,
    disabled?: boolean
    onClick?: () => void
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


type ScheduleDateContainerProps = {
    variant: "start" | "end",
    end?: Date,
    start?: Date,
    onChange: (date?: Date) => void
}

export function ScheduleDateContainer({ variant, end, start, onChange }: ScheduleDateContainerProps) {

    return (
        <PublishModal.Container container={variant === "start" ? "start-date" : "end-date"}>
            <PublishModal.Header backTo="main" className="px-3" >
                <PublishTitle>Pick survey {variant} date</PublishTitle>
            </PublishModal.Header>

            <PublishComponent>
                {variant === "start" && <DataPicker value={start} onChange={onChange} min={new Date()} />}
                {variant === "end" && <DataPicker value={end} onChange={onChange} startAt={start} min={start} />}

                <Separator className="mt-4" />
                <div className="flex flex-col items-center mb-5 mt-1">
                    {variant === "start" && <DateIndicator date={start} relative={startRelativeTime(start)} />}
                    {variant === "end" && <DateIndicator date={end} relative={endRelativeTime(end, start)} />}

                    <PublishModal.Switch to={variant === "start" ? "start-time" : "end-time"}>
                        {({ caller }) => {
                            return (
                                <button onClick={caller} className="outline outline-foreground/10 bg-foreground/5 hover:bg-foreground/15 gap-2 font-bold flex justify-center px-3 py-2 mt-1 rounded-md w-full">
                                    Change time
                                </button>
                            )
                        }}
                    </PublishModal.Switch>

                </div>
            </PublishComponent>
        </PublishModal.Container>
    )
}





type ScheduleTimeContainer = {
    variant: "start" | "end",
    end?: Date,
    start?: Date,
    onChange: (date?: Date) => void
}

export function ScheduleTimeContainer({ variant, end, start, onChange }: ScheduleTimeContainer) {

    return (
        <PublishModal.Container container={variant === "start" ? "start-time" : "end-time"}>
            <PublishModal.Header backTo="main" className="px-3" >
                <PublishTitle>Pick survey {variant} time</PublishTitle>
            </PublishModal.Header>

            <PublishComponent>
                {variant === "start" && <TimePicker value={start} onChange={onChange} />}
                {variant === "end" && <TimePicker value={end} onChange={onChange} />}

                <Separator className="mt-4" />
                <div className="flex flex-col items-center mb-5 mt-1">
                    {variant === "start" && <DateIndicator date={start} relative={startRelativeTime(start)} />}
                    {variant === "end" && <DateIndicator date={end} relative={endRelativeTime(end, start)} />}

                    <PublishModal.Switch to={variant === "start" ? "start-date" : "end-date"}>
                        {({ caller }) => {
                            return (
                                <button onClick={caller} className="outline outline-foreground/10 bg-foreground/5 hover:bg-foreground/15 gap-2 font-bold flex justify-center px-3 py-2 mt-1 rounded-md w-full">
                                    Change date
                                </button>
                            )
                        }}
                    </PublishModal.Switch>

                </div>
            </PublishComponent>
        </PublishModal.Container>
    )
}

function startRelativeTime(start: Date | undefined) {
    return RelativeTime(start, new Date(), { useLong: true })
}

function endRelativeTime(end: Date | undefined, start: Date | undefined) {
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