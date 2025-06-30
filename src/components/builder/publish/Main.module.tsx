import { useContext, useEffect, useState } from "react";
import { builderContext } from "@/context/builderContext.module";
import { dataContext } from "@/context/dataContext.module";
import { IoShareSocial } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { SurveySchedule } from "./SurveySchedule.module";
import { PublishComponent, PublishSection, PublishTitle } from "./Common.module";
import { getSurveyStatus } from "@/resources/survey";
import { STATUS } from "@/resources/definitions";
import { it } from "@/resources/utils";
import { PublishModal } from "../publish.module";
import { MdErrorOutline } from "react-icons/md";
import { createShareableLink, shareOrCopyLink } from "@/resources/client/survey";

type PublishMainContainerProps = {
    startTime?: Date,
    endTime?: Date,
    startChange: (start: PublishMainContainerProps["startTime"]) => void,
    endChange: (end: PublishMainContainerProps["endTime"]) => void
}

export function PublishMainContainer({ startTime, endTime, startChange, endChange }: PublishMainContainerProps) {

    const { id, name, schedule, updateSchedule } = useContext(builderContext);
    const { data, revokeSurveyKey } = useContext(dataContext);
    const { switchTo } = PublishModal.useContext();

    const [fetching, setFetching] = useState(false);
    const [onError, setOnError] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const status = getSurveyStatus(schedule);
    const surveyLink = createShareableLink(id, data)

    function handleShare() {
        const shareMethod = shareOrCopyLink(surveyLink, name, data?.private.name)
        if (shareMethod === "clipboard") {
            setLinkCopied(true)
        }
    }

    useEffect(() => {
        if ((startTime?.getTime() ?? -Infinity) >= (endTime?.getTime() ?? Infinity)) {
            endChange(undefined)
        }

        const timeout = setTimeout(() => {
            startChange(startTime ? new Date(startTime) : undefined)
            endChange(endTime ? new Date(endTime) : undefined)
        }, 60 * 1000)

        return () => {
            clearTimeout(timeout)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, endTime])

    useEffect(() => {
        console.info({ startTime, endTime, schedule })
        setHasChanges(
            startTime?.getTime() !== schedule.start?.getTime() || endTime?.getTime() !== schedule.end?.getTime());
    }, [startTime, endTime, schedule])

    function handlePublish() {
        setFetching(true);
        updateSchedule({
            start: startTime ?? new Date(),
            end: endTime,
            active: true
        })
            .then(() => {
                setOnError(false)
                switchTo("publish-feedback")
            })
            .catch(() => setOnError(true))
            .finally(() => {
                setFetching(false)
            })
    }

    function handleDisable() {
        setFetching(true);
        updateSchedule({
            start: startTime,
            end: endTime,
            active: false
        })
            .then(() => {
                setOnError(false)
                switchTo("disable-feedback")
            })
            .catch(() => setOnError(true))
            .finally(() => {
                setFetching(false)
            })
    }

    function handleRecycle() {
        setFetching(true);
        updateSchedule({
            start: undefined,
            end: undefined,
            active: false
        })
            .then(() => setOnError(false))
            .catch(() => setOnError(true))
            .finally(() => {
                setFetching(false)
            })

    }

    function handleRevoke() {
        if (!id) return;

        setFetching(true);
        revokeSurveyKey(id)
            .then(() => {
                setOnError(false)
                switchTo("revoke-feedback")
            })
            .catch(() => setOnError(true))
            .finally(() => {
                setFetching(false)
            })
    }

    return (
        <PublishModal.Container container="main" defaultOpen>
            <PublishModal.Header className="pl-5 pr-3">
                <PublishTitle>Publish  {`"${name}"`}</PublishTitle>
            </PublishModal.Header>

            <PublishSection>
                <PublishComponent>
                    <PublishTitle>
                        Access sharing
                    </PublishTitle>

                    <div className="text-foreground/90">
                        {status === STATUS.active && <>Your survey <span className="font-semibold text-green-500">has been publish</span> and anyone with this link can apply your questions.</>}
                        {status === STATUS.scheduled && <>Your survey <span className="font-semibold text-neon-violet">has been scheduled</span> and anyone with this can apply when it starts.</>}
                        {status === STATUS.disabled && <>Your survey <span className="font-semibold text-red-500">is not published</span> and you can publish it whenever you’re ready.</>}
                        {status === STATUS.ended && (
                            <>Your survey has <span className="font-semibold text-green-600">ended</span> and all responses have been successfully collected. You can republish anytime.</>
                        )}
                    </div>

                    {
                        it(status).eq(STATUS.active, STATUS.scheduled) && (
                            <>
                                <div className="flex gap-2 w-full items-center">
                                    <input className={twMerge(
                                        "focus:outline-0  border border-foreground/15 w-full  overflow-clip bg-foreground/5 rounded-md py-[0.1rem] text-lg px-3 text-foreground/60",
                                        linkCopied && "outline outline-neon-mid bg-neon-mid/15"
                                        )} value={surveyLink}>
                                    </input>
                                    <button
                                        className={
                                            twMerge(
                                                "p-1 flex gap-1 items-center px-2 rounded-md border border-foreground/15 bg-foreground/5 hover:bg-foreground/20",
                                                linkCopied && "opacity-60"
                                            )
                                        }
                                        onClick={handleShare}
                                        onBlur={() => setLinkCopied(false)}
                                        onMouseLeave={() => {
                                            setTimeout(()=> {
                                                setLinkCopied(false)
                                            }, 600)
                                        }}
                                    >
                                        <IoShareSocial className="w-5 h-5" />
                                        <div>{linkCopied ? "Copied" : "Share"}</div>
                                    </button>
                                </div>
                                <button
                                    className={twMerge(
                                        "p-1 mt-3 flex gap-1 items-center px-2 rounded-md border border-foreground/15 bg font-medium text-sm",
                                        "bg-gradient-to-br from-red-500/60 to-red-600/60 hover:to-red-500/80"

                                    )}
                                    onClick={handleRevoke}
                                    disabled={fetching}>Revoke access</button>
                            </>
                        )
                    }
                </PublishComponent>
            </PublishSection>


            <SurveySchedule
                start={startTime}
                end={endTime}
                disabled={fetching || !it(status).eq(STATUS.disabled, STATUS.scheduled, STATUS.ended)}
                locked={!it(status).eq(STATUS.disabled, STATUS.scheduled, STATUS.ended)}
            />

            {
                onError && (
                    <PublishSection className="bg-red-500/25">
                        <PublishComponent className="font-bold text-red-500/80 flex items-center gap-2">
                            <MdErrorOutline className="w-6 h-6" /> We ran into a problem. Please try again.
                        </PublishComponent>
                    </PublishSection>
                )
            }

            <PublishSection>
                <PublishComponent className="flex justify-between items-center">
                    {
                        it(status).eq(STATUS.disabled) && (
                            <>
                                <div className="text-foreground/70">All ready to publish</div>

                                <button
                                    onClick={handlePublish}
                                    className="tail-button bg-foreground/20 font-bold px-6 py-[0.3rem] rounded-md"
                                    disabled={fetching}>
                                    Publish
                                </button>
                            </>
                        )
                    }


                    {
                        it(status).eq(STATUS.active) && (
                            <div className="flex w-full justify-end gap-3">
                                <button
                                    className="bg-foreground/5 outline outline-foreground/30 font-bold px-6 py-[0.3rem] rounded-md text-sm hover:bg-foreground/30"
                                    disabled={fetching}>
                                    Clear all 00 applies
                                </button>

                                <button
                                    className="font-bold px-6 py-[0.3rem] bg-red-500/70 hover:bg-red-500/90 rounded-md text-sm"
                                    onClick={handleDisable}
                                    disabled={fetching}>
                                    Unpublish
                                </button>
                            </div>
                        )
                    }



                    {
                        it(status).eq(STATUS.ended) && (
                            <div className="flex w-full justify-end gap-3">
                                <button
                                    className="bg-foreground/20 font-bold px-6 py-[0.3rem] rounded-md text-sm hover:bg-foreground/30"
                                    disabled={fetching}>
                                    Clear all 00 applies
                                </button>

                                <button
                                    className="font-bold px-6 py-[0.3rem] bg-red-500/70 hover:bg-red-500/90 rounded-md text-sm"
                                    onClick={handleRecycle}
                                    disabled={fetching}>
                                    Recycle
                                </button>
                            </div>
                        )
                    }

                    {
                        it(status).eq(STATUS.scheduled) && (
                            <div className={
                                twMerge(
                                    "flex w-full justify-end gap-3",
                                    hasChanges && "justify-between"
                                )
                            }>

                                <button
                                    className="bg-foreground/20 font-bold px-6 py-[0.3rem] rounded-md text-sm hover:bg-foreground/30"
                                    disabled={fetching}>
                                    Clear all 00 applies
                                </button>

                                <div className="flex justify-end gap-3">
                                    {
                                        !hasChanges && (
                                            <div></div>
                                        )
                                    }

                                    {
                                        hasChanges && <button
                                            onClick={handlePublish}
                                            className="font-bold  px-6 py-[0.3rem] bg-neon-mid/90 hover:bg-neon text-white rounded-md text-sm"
                                            disabled={fetching}>
                                            Apply changes
                                        </button>
                                    }


                                    <button
                                        className="font-bold px-6 py-[0.3rem] bg-red-500/70 hover:bg-red-500/90 rounded-md text-sm"
                                        onClick={handleDisable}
                                        disabled={fetching}>
                                        Unpublish
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </PublishComponent>
            </PublishSection>
        </PublishModal.Container >
    )
}