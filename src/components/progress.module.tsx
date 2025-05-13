import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ProgressProps = {
    value: number;
    max?: number;
    orientation?: "vertical" | "horizontal",
    className?: HTMLAttributes<HTMLDivElement>["className"]
}
export function Progress({ value = 0.5, max = 1, className, orientation = "horizontal" }: ProgressProps) {
    return (
        <div className={twMerge(
            "relative w-full h-3 bg-foreground/20 rounded-full flex items-center",
            orientation === "vertical" && "h-full",
            orientation === "horizontal" && "w-full",
            className
        )}>
            <div className={twMerge(
                "from-neon-sub/10 to-neon from-20%",
                orientation === "vertical" && "rounded-t-full bg-gradient-to-t left-0 bottom-0 w-full",
                orientation === "horizontal" && "rounded-r-full bg-gradient-to-r left-0 top-0 h-full")} style={{
                    [orientation === "horizontal" ? "width" : "height"]: `${(value / max) * 100}%`
                }} >
                {
                    value !== 0 && <div className="-my-[1.3rem] -mr-[0.8rem] text-right text-neon-sub text-sm">
                        {Math.max(0, Math.min(Math.ceil(value * 100), 100))}%
                    </div>
                }
            </div>



        </div>
    )
}