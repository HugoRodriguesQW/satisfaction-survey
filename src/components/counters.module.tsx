import { HTMLAttributes, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type CountersProps = {
    items: Array<{
        label?: string,
        icon?: ReactNode,
        value?: string | number,
        onClick?: () => void
    }>,
    className?: HTMLAttributes<HTMLDivElement>["className"]
}

export function Counters({ items, className }: CountersProps) {
    return <div className={twMerge(
        "flex gap-1 p-[0.5rem]",
        className
    )}>
        {
            items.map((item, i) => {
                return (
                    <div key={`counters-item-${i}`} title={item.label} onClick={item.onClick} className="flex items-center gap-[0.3rem] text-sm text-gray-400 ">
                        <div>
                            {item.icon}
                        </div>
                        {item.value}
                    </div>
                )
            })
        }
    </div>
}
