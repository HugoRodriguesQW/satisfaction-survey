
import React, { HTMLAttributes, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs"
import { twMerge } from "tailwind-merge"

type Axis = "x" | "y"

type Border = {
    x: "left" | "right",
    y: "top" | "bottom"
}

type ResizableProps = {
    axis: Axis[],
    border?: Border,
    handler?: boolean,
    onResize?: () => void,
    className?: HTMLAttributes<HTMLDivElement>["className"],
    children?: ReactNode
}

export function Resizable({ axis, border = {
    x: "right",
    y: "bottom"
}, handler, onResize, className, children }: ResizableProps) {

    const [width, setWidth] = useState<number>()
    const [height, setHeight] = useState<number>()
    const [resizing, setResizing] = useState<Axis>()

    const ref = useRef<HTMLDivElement>(null)

    const handleResize = useCallback(function handleResize(event: MouseEvent) {


        const rect = ref.current?.getBoundingClientRect()

        if (rect) {
            if (resizing === "x") {
                const b = border.x === "right" ? event.clientX : rect[border.x];
                const e = border.x === "right" ? rect[border.x] : event.clientX;

                setWidth(rect.width + (b - e))
            }
            if (resizing === "y") {
                const b = border.y === "bottom" ? event.clientY : rect[border.y];
                const e = border.y === "top" ? rect[border.y] : event.clientY;
                setHeight(rect.height + (b - e))
            }
            onResize?.()
        }
    }, [border.x, border.y, onResize, resizing])


    function disableResize() {
        setResizing(undefined)
    }


    useEffect(() => {
        if (resizing) {
            window.addEventListener("mouseup", disableResize)
            window.addEventListener("mousemove", handleResize)
        }

        return () => {
            window.removeEventListener("mouseup", disableResize)
            window.removeEventListener("mousemove", handleResize)
        }
    }, [resizing, handleResize])



    function resize(axis: Axis) {
        setResizing(axis)
    }

    return <div ref={ref} className={twMerge(
        className,
        "relative",
    )} style={{
        width,
        height
    }}>


        {children}


        {
            axis.includes("x") && <div className={twMerge("absolute flex items-center top-0 w-2 h-full  border-foreground/5 cursor-col-resize",
                border.x === "right" ? "right-0 border-r" : "left-0 border-l"
            )}
                onMouseDown={() => resize("x")} >
                {handler && <DefaultHandler axis="x" border={border} />}
            </div>
        }

        {
            axis.includes("y") && <div className={
                twMerge(
                    "absolute flex flex-col items-center left-0 h-2 w-full  border-foreground/5 cursor-row-resize",
                    border.y === "bottom" ? "bottom-0 border-b" : "top-0 border-t"
                )
            } onMouseDown={() => resize("y")}>{handler && <DefaultHandler axis="y" border={border} />}</div>
        }
    </div>
}


function DefaultHandler({ axis, border }: { axis: Axis, border: Border }) {
    return <div className={twMerge("border border-foreground/10  overflow-visible text-foreground/30 rounded-full bg-background flex items-center justify-center select-none [&>*]:select-none",
        axis === "x" && "w-3 h-12",
        axis === "y" && "w-12 h-3",
        border.x === "left" && "-ml-[0.3rem]",
        border.x === "right" && "ml-[0.1rem]",
    )} >
        {
            axis === 'x' && <BsThreeDotsVertical />
        }

        {axis === "y" && <BsThreeDots />}
    </div>
}