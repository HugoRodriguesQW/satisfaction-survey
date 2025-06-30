import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";


type DataPickerProps = {
    value?: Date,
    startAt?: Date,
    onChange?: (date?: Date) => void;
    min?: Date,
    max?: Date
}

type Indicator = "AM" | "PM"

export function TimePicker({ value, onChange }: DataPickerProps) {

    const localTime = (value ?? new Date()).toLocaleTimeString(undefined, { hour: "2-digit", minute: '2-digit' });

    const hour = Number(localTime.slice(0, 2));
    const minute = Number(localTime.slice(3, 5))
    const indicator = safeIndicator(localTime.slice(6, 8))

    const hourRange = new Array(indicator ? 12 : 24).fill(0).map((_, i) => indicator ? (i === 0 ? 12 : i) : i)
    const minuteRange = new Array(60).fill(0).map((_, i) => i)
    const indicatorRange = ["AM", "PM"]

    const [currentHour, setCurrentHour] = useState<number>(hour)
    const [currentMinute, setCurrentMinute] = useState<number>(minute)
    const [currentIndicator, setCurrentIndicator] = useState<string | undefined>(indicator)


    useEffect(() => {
        const date = value ?? new Date();
        onChange?.(applyTime(date, currentHour, currentMinute, currentIndicator))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentHour, currentMinute, currentIndicator])



    function applyTime(date: Date, hour: number, minute: number, indicator?: string) {
        if (indicator) {
            const offset = indicator === "AM" ? 0 : 12

            return new Date(new Date(date).setHours(
                offset + (hour === 12 ? 0 : hour),
                minute,
                0,
                0
            ))
        }

        return new Date(new Date(date).setHours(
            hour,
            minute,
            0,
            0
        ))
    }

    return (
        <div className="flex items-center w-full justify-center">
            <TimePickerCol value={currentHour} range={hourRange} onChange={setCurrentHour} />
            <TimePickerSeparator />
            <TimePickerCol value={currentMinute} range={minuteRange} onChange={setCurrentMinute} />
            {currentIndicator && <TimePickerSeparator />}
            {currentIndicator && <TimePickerCol value={currentIndicator} range={indicatorRange} onChange={setCurrentIndicator} />}
        </div>
    )
}

type TimePickerColProps<T extends string | number> = {
    value: T,
    range: Array<T>,
    onChange: (value: T) => void
}


function TimePickerCol<T extends string | number>({ value, range, onChange }: TimePickerColProps<T>) {

    const colRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState<number>(range.indexOf(value));

    function handleScroll(event: React.UIEvent<HTMLDivElement, UIEvent>) {
        const target = event.target as HTMLDivElement;
        const itemHeight = target.querySelector("button")?.getBoundingClientRect().height ?? 50;
        const mostClose = target.scrollTop / itemHeight;
        if (current !== Math.round(mostClose)) {
            setCurrent(Math.round(mostClose))
        }
    }


    function applyScroll(index: number) {
        if (colRef.current) {
            const itemHeight = colRef.current.querySelector("button")?.getBoundingClientRect().height ?? 50;
            colRef.current.scrollTo({
                top: itemHeight * index,
                behavior: "smooth"
            })
        }
    }


    useEffect(() => {
        if (colRef.current) {
            applyScroll(current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (colRef.current) {
                applyScroll(current)
                onChange(range[current])
            }
        }, 400)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current])

    return (
        <div ref={colRef} onScroll={handleScroll} className="relative flex flex-col h-[200px] overflow-y-scroll scroll-time-picker ">
            <div className="h-full pb-19" />
            {
                range.map((r, i) => {
                    return <TimePickerUnit key={"timer-picker-col" + i} value={r} primary={value === r} onClick={() => {
                        setCurrent(i)
                        applyScroll(i)
                    }} />
                })
            }

            <div className="h-full pt-19" />
        </div>
    )
}

type TimePickerUnitProps = {
    value: number | string | undefined,
    primary?: boolean,
    onClick?: () => void
}

function TimePickerUnit({ value, primary, onClick }: TimePickerUnitProps) {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "text-2xl px-9 py-2 font-bold transition-opacity",
                !primary && "text-foreground/60 font-normal"
            )}>
            {typeof value === "number" ? String(value).padStart(2, "0") : value}
        </button>
    )
}

function TimePickerSeparator() {
    return <div className="text-xl font-bold text-foreground/50">:</div>
}

function safeIndicator(ind: string) {
    if (["AM", "PM"].includes(ind.toUpperCase())) {
        return ind.toUpperCase() as Indicator
    }

    return undefined;
}