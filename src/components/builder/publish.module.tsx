import { useContext, useEffect, useState } from "react";
import { createModal } from "../modal";
import { builderContext } from "@/context/builderContext.module";
import { ScheduleDateContainer, ScheduleTimeContainer } from "./publish/SurveySchedule.module";
import { PublishMainContainer } from "./publish/Main.module";
import { PublishFeedbackContainer, RevokeFeedbackContainer, UnpublishFeedbackContainer } from "./publish/feedback";
import { dataContext } from "@/context/dataContext.module";

type BuilderPublishProps = {
    isOpen: boolean,
    handleClose: () => void;
}

export const PublishModal = createModal(
    "main",
    "start-date",
    "end-date",
    "start-time",
    "end-time",
    "publish-feedback",
    "revoke-feedback",
    "clear-feedback",
    "share-feedback",
    "disable-feedback"
);

export function BuilderPublish({ isOpen, handleClose }: BuilderPublishProps) {

    const { schedule, id, name } = useContext(builderContext);
    const { data } = useContext(dataContext);

    const [startTime, setStartTime] = useState<Date | undefined>(new Date());
    const [endTime, setEndTime] = useState<Date | undefined>();

    useEffect(() => {
        setStartTime(schedule.start)
        setEndTime(schedule.end)
    }, [schedule])

    useEffect(() => {
        if ((startTime?.getTime() ?? -Infinity) >= (endTime?.getTime() ?? Infinity)) {
            setEndTime(undefined)
        }

        const timeout = setTimeout(() => {
            setStartTime(startTime ? new Date(startTime) : undefined)
            setEndTime(endTime ? new Date(endTime) : undefined)
        }, 60 * 1000)

        return () => {
            clearTimeout(timeout)
        }

    }, [startTime, endTime])

    return (
        <PublishModal
            isOpen={isOpen}
            handleClose={handleClose}
            anchor="top"
            containerClassName="mt-12  not-sm:max-w-[100%] not-sm:w-full  sm:max-w-[520px] mb-12"
            contentClassName="flex flex-col w-full"
        >

            <PublishMainContainer startTime={startTime} endTime={endTime} startChange={setStartTime} endChange={setEndTime} />
            <ScheduleDateContainer variant="start" onChange={setStartTime} start={startTime} end={endTime} />
            <ScheduleDateContainer variant="end" onChange={setEndTime} start={startTime} end={endTime} />
            <ScheduleTimeContainer variant="start" onChange={setStartTime} start={startTime} end={endTime} />
            <ScheduleTimeContainer variant="end" onChange={setEndTime} start={startTime} end={endTime} />

            <PublishFeedbackContainer id={id} data={data} name={name} />
            <UnpublishFeedbackContainer />
            <RevokeFeedbackContainer  id={id} data={data} name={name} />
        </PublishModal>
    )
}