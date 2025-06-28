import { AwesomeBox } from "@/components/awesome";
import { Header } from "@/components/header.module";
import { PageContainer } from "@/components/page.module";
import { Progress } from "@/components/progress.module";
import { apiGet } from "@/resources/client/fetch";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

let frontLock = false;

export default function Builder() {

    const phrases = [
        "Building something truly awesome…",
        "Shaping something meaningful and powerful…",
        "Your epic survey is on the way…",
        "This is gonna be awesome…"
    ]

    const standardTimes = [
        [200, 0.2],
        [300, 0.4],
        [700, 0.5],
        [800, 0.6],
        [900, 0.8]
    ] // [ms, percentage]

    const [failed, setFailed] = useState(false);
    const [phrase, setPhrase] = useState("");
    const [currentTime, setCurrentTime] = useState(0)
    const [virtualPercentage, setVirtualPercentage] = useState(0)

    function handleRetry() {
        window.location.reload()
    }

    function randomPhrase() {
        const random = phrases[Math.floor(Math.random() * phrases.length)];
        return random;
    }

    useEffect(() => {
        if (frontLock) return;
        frontLock = true;

        setPhrase(randomPhrase())

        apiGet<string>("/api/survey/create", "text").then((surveyId) => {
            setVirtualPercentage(1)
            window.location.replace(window.location.origin + "/builder/" + surveyId)
        }).catch(() => {
            setFailed(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setVirtualPercentage([currentTime][1])

        if (standardTimes[currentTime + 1]) {
            const timeout = setTimeout(() => {
                if (virtualPercentage < 1) {
                    setCurrentTime(currentTime + 1)
                }
            }, standardTimes[currentTime + 1][0])

            return () => {
                clearTimeout(timeout)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime])

    return (
        <PageContainer noOverflow>
            <Header showAccount={false} showFile={false} />

            <AwesomeBox className={twMerge("transition-opacity duration-150 opacity-100 -z-10", failed && "opacity-0")} />

            <div className="w-full h-full  items-center justify-center  overflow-clip flex ">
                {!failed && (<div className="text-4xl select-none text-center font-bold flex flex-col gap-7 items-center">
                    <div>{phrase}</div>
                    <Progress value={virtualPercentage} orientation="horizontal" className="h-1 max-w-[70%]" hidePercentage />
                </div>)}

                {failed && (
                    <div className="max-w-[350px] w-full flex flex-col gap-8 p-3 py-6 rounded-md items-center">
                        <div className="font-semibold text-2xl text-center">Something went wrong</div>

                        <div className="font-medium text-center">
                            We ran into a problem while trying to create your survey. This might be a temporary issue. Please try again shortly.
                        </div>


                        <button onClick={handleRetry} className="tail-button px-7 py-1 rounded-md text-lg cursor-pointer text-white">Retry</button>
                    </div>
                )}
            </div>
        </PageContainer >
    )
}
