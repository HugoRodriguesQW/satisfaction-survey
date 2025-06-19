import { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"
import { STATUS, STATUSValue } from "@/resources/definitions"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { Counters } from "../counters.module"
import { Progress } from "../progress.module"
import { bigNumber } from "@/resources/utils"
import { FaCheckCircle, FaClock, FaCommentDots } from "react-icons/fa"

type SurveyCardProps = {
    className?: HTMLAttributes<HTMLDivElement>["className"]
    data: {
        title: string,
        description?: string,
        questions: number,
        answers: number,
        takers: number,
        feedbacks: number,
        status: STATUSValue
    },
    onClick?: () => void
}

export function SurveyCard({ className, data, onClick }: SurveyCardProps) {
    return (
        <div className={twMerge(
            "rounded-md w-full h-full relative pointer bg-gradient-to-bl transition-colors duration-75 from-foreground/10 hover:from-foreground/15 to-foreground/5 cursor-pointer",
            className
        )}
            onClick={onClick}>

            <button className="absolute top-0 right-0 p-2 bg-gradient-to-bl from-transparent to-transparent hover:from-foreground/25 hover:to-foreground/15 transition duration-100 rounded-full hover:rounded-md mt-2 mr-2">
                <HiOutlineDotsVertical />
            </button>

            <div className="flex flex-col p-4 pb-4">
                <h1 className="font-semibold overflow-hidden pb-3">{data.title}</h1>
                <StatusText status={data.status} />
                <p className="mt-3">{data.questions} questions ·  {data.takers} takers</p>
                <p className="text-sm text-gray-500 ">{data.description}</p>

            </div>


            <Progress value={([STATUS.active, STATUS.ended] as STATUSValue[]).includes(data.status) ?
                (data.answers / data.takers) : 0} className="rounded-none mt-4 mb-2" />


            <div className="flex justify-between w-full items-center pr-3">
                <Counters className="w-full" items={[
                    {
                        icon: <FaCheckCircle />,
                        label: "Answers",
                        value: bigNumber(data.feedbacks)
                    },

                    {
                        icon: <FaCommentDots />,
                        label: "Feedbacks",
                        value: bigNumber(data.feedbacks)
                    },

                    {
                        icon: <FaClock />,
                        label: "Pending",
                        value: bigNumber(data.takers - data.answers)
                    },

                ]} />

                <DateText date={new Date()} />
            </div>


        </div>
    )
}


function DateText({ date }: { date: Date }) {
    const day = String(date.getDate()).padStart(2, "0")
    const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dec"][date.getMonth()]
    const year = date.getFullYear()

    return <span className="text-gray-500 capitalize whitespace-nowrap">{day} {month} {year}</span>
}

function StatusText({ status }: { status: STATUSValue }) {

    return (<div className="[&>span]:py-[0.3rem] [&>span]:px-4 [&>span]:rounded-md [&>span]:bg-gradient-to-br  font-bold">{(() => {
        switch (status) {
            case STATUS.disabled:
                return <span className="from-foreground/15 to-foreground/30">Disabled</span>;
            case STATUS.active:
                return <span className="from-green-500/90 to-green-800/90">Active</span>

            case STATUS.scheduled:
                return <span className="from-neon/90 to-neon-violet/30">Scheduled</span>
            case STATUS.ended:
                return <span className="from-foreground/15 to-foreground/30">Ended</span>
            default:
                return <span className="from-red-500/50 to-red-400/80">Expired</span>
        }
    })()}
    </div>)
}