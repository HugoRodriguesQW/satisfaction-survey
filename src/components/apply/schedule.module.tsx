import Head from "next/head";
import { ApplyContainer } from "./Common.module";
import { DateIndicator } from "../builder/publish/DateIndicator";
import { RelativeTime, timeDiff } from "@/resources/utils";
import { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { PiClockBold } from "react-icons/pi";
import Image from "next/image";
import { formatToGoogleUTC, formatToOutlook } from "@/resources/client/calendar";

type ApplyScheduledProps = {
    date: string,
    name: string
}
export function ApplySchedulePage({ date, name }: ApplyScheduledProps) {

    const [uDate, setuDate] = useState<Date>(new Date(date))

    useEffect(() => {
        const timeout = setTimeout(() => {
            setuDate(new Date(uDate))
            if (timeDiff(uDate, new Date()) < 0) {
                window.location.reload()
            }
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [uDate])

    function handleGoogleCalendarExport() {
        const url = new URL("https://www.google.com/calendar/render");
        url.searchParams.set("action", "TEMPLATE")
        url.searchParams.set("text", `${name} - Survey`)
        url.searchParams.set("details", `You are invited to participate in the “You Fell Safe” survey. The survey will open on the scheduled date.`)
        url.searchParams.set("dates", `${formatToGoogleUTC(new Date(date))}/${formatToGoogleUTC(new Date(date))}`)
        url.searchParams.set("ctz", Intl.DateTimeFormat().resolvedOptions().timeZone)
        window.open(url, "_blank")
    }

    function handleOutlookCalendarExport() {
        const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
        url.searchParams.set("subject", `${name} - Survey`)
        url.searchParams.set("body", `You are invited to participate in the “You Fell Safe” survey. The survey will open on the scheduled date.`)
        url.searchParams.set("startdt", formatToOutlook(new Date(date)))
        url.searchParams.set("allday", "false")

        window.open(url, "_blank")
    }

    function handleIcsExport() {

        const data = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${name} - Survey
DESCRIPTION:You are invited to participate in the “You Fell Safe” survey. The survey will open on the scheduled date.
DTSTART:${formatToGoogleUTC(new Date(date))}
END:VEVENT
END:VCALENDAR`

        const bufferdata = btoa(unescape(encodeURIComponent(data)));
        const safeName = name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();

        const link = document.createElement("a");
        link.href = `data:text/calendar;charset=utf-8;base64,${bufferdata}`;
        link.download = `${safeName}.ics`
        document.body.appendChild(link);
        link.click();
        link.remove()
    }


    return (
        <ApplyContainer>
            <Head>
                <title>{name} | Privora</title>
            </Head>

            <div className="flex items-center h-full px-12 max-[850px]:flex-col justify-center  gap-12 pb-10">
                <div className="flex  items-center justify-end max-[850px]:justify-center max-[850px]:w-full">
                    <div className="animate-scheduled-calendar w-[20vmin] h-[20vmin] md:w-[24vmin] md:h-[24vmin] relative bg-gradient-to-br from-neon/80 to-neon-violet-sub/80 rounded-[10%]">
                        <IoCalendarOutline className="w-full h-full text-white z-0" />
                        <PiClockBold className="w-[11.5%] h-[11.5%] z-10 absolute right-[21%] bottom-[17.5%] animate-spin text-white" />
                    </div>
                </div>
                <div className="flex flex-col max-[850px]:flex-1 gap-2 max-[850px]:text-center max-[850px]:w-full">
                    <div className="text-5xl max-sm:text-3xl font-bold">{name}</div>
                    <div className="text-lg  max-w-[700px]">The creator of this survey has scheduled it to begin at a future date. It’s not available for responses at this time.</div>
                    <div className="mt-5 text-foreground/85 text-lg flex flex-col gap-2  max-[850px]:items-center">
                        
                        <div>
                            Responses open <span className="font-bold text-green-500">{RelativeTime(new Date(date), new Date(), { useLong: true, lowDiffText: "in few seconds" })}</span>
                        </div>

                        <div className="flex gap-3 max-[650px]:flex-wrap">
                            <DateIndicator
                                className="justify-start w-fit h-fit p-2 bg-foreground/5 outline outline-foreground/30 text-lg"
                                date={new Date(date)}
                            />

                            <div className="w-1 max-[650px]:hidden" />

                            <button
                                onClick={handleGoogleCalendarExport}
                                className="outline outline-foreground/25 bg-foreground/5 p-1 px-3 rounded-md bg-gradient-to-br from-yellow-400/50 to-sky-700/50">
                                <Image src={"/logos/google_calendar.svg"} width={34} height={34} alt="google_calendar"
                                    className="w-7 h-7 drop-shadow-sm drop-shadow-black/60"
                                />
                            </button>

                            <button
                                onClick={handleOutlookCalendarExport}
                                className="outline outline-foreground/25 p-1 px-3 rounded-md bg-gradient-to-br from-sky-400/50 to-sky-700/50">
                                <Image src={"/logos/microsoft_calendar.svg"} width={34} height={34} alt="microsoft_calendar"
                                    className="w-7 h-7 drop-shadow-sm drop-shadow-black/60"
                                />
                            </button>

                            <button
                                onClick={handleIcsExport}
                                className="outline outline-foreground/25 p-1 px-3 rounded-md bg-gradient-to-br from-foreground/15  to-foreground/0">
                                <div>.ics</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ApplyContainer>
    )
}