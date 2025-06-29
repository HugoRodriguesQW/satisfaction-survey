import { FaRegClock } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

type DateSelectorProps = {
    active?: boolean,
    date?: Date,
    relative?: string,
    onClick?: () => void;
    disabled?: boolean,
    emptyText?: string
    disableTime?: boolean;
}

export function DateIndicator(props: DateSelectorProps) {


    if (!props.date) {
        return (
            <Content className={twMerge(props.active && "")}>
                <FaRegClock className="w-4 h-4 fill-foreground/50 mr-0.5" />
                {props.emptyText}
                <div className="text-green-500/80 not-first:ml-2">{props.relative}</div>
            </Content>
        )
    }

    const date = props.date.toLocaleDateString().split("/").map((d) => [d, "/"])
    const time = props.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: '2-digit' }).split(":").map((t) => [t.split(" ")[0], ':'])
    const indicator = props.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: '2-digit' }).split(" ").slice(1).map((t) => [t, " "])

    if (date[0]) date.slice(-1)[0][1] = "";
    if (time[0]) time.slice(-1)[0][1] = "";
    if (indicator[0]) indicator.slice(-1)[0][1] = "";


    return (
        <Content className={twMerge(props.active && "", "flex-row items-center gap-1 max-sm:flex-wrap")}>
            <FaRegClock className="w-4 h-4 fill-foreground/50 mr-0.5" />
            <div className="flex flex-nowrap gap-0.5 justify-center mr-1.5">
                {date.map(([t, sep], i) =>
                    <div className="flex flex-nowrap gap-0.5" key={"publish-date-date-" + i}>
                        <span className="rounded-md">{t.padStart(2, "0")}</span>
                        <span className="text-foreground/50">{sep}</span>
                    </div>
                )}
            </div>

            {
                !props.disableTime && (
                    <>
                        <div className="bg-foreground w-[3px] h-[3px] rounded-full mr-1.5" />
                        <div className="flex flex-nowrap gap-0.5 justify-center">
                            {time.map(([t, sep], i) =>
                                <div className="flex flex-nowrap gap-0.5" key={"publish-date-time-" + i}>
                                    <span className="">{t.padStart(2, "0")}</span>
                                    <span className="text-foreground/50">{sep}</span>
                                </div>
                            )}


                            {indicator.map(([t, sep], i) =>
                                <div className="flex flex-nowrap gap-0.5" key={"publish-date-indicator-" + i}>
                                    <span>{t}</span>
                                    <span>{sep}</span>
                                </div>
                            )}
                        </div>
                    </>
                )
            }

            <div className="text-green-500/80 ml-2 max-sm:w-full">{props.relative}</div>
        </Content >
    )
}

type ContentProps = React.HTMLAttributes<HTMLDivElement>

function Content({ children, className, ...rest }: ContentProps) {
    return (
        <div
            className={twMerge(
                "rounded-md flex h-full max-sm:w-full justify-center items-center text-foreground/80",
                "p-1 pb-2 font-bold",
                className,
            )}
            {...rest}>
            {children}
        </div>)
}