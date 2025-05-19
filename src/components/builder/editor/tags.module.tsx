import { HTMLAttributes, ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Field } from "./field.module";
import { IoMdClose } from "react-icons/io";


type TagsFieldProps = {
    label: ReactNode,
    list?: string[],
    className?: HTMLAttributes<HTMLDivElement>["className"]
    onChange?: (list: string[]) => void;
}

export function TagsField({ className, label, onChange, list = [] }: TagsFieldProps) {
    const ref = useRef<HTMLInputElement>(null)


    function addItems(...items: string[]) {
        onChange?.([...list, ...items].filter((item, index, list) => list.lastIndexOf(item) === index))
    }

    function removeItem(index: number) {
        onChange?.([...list.filter((_, i) => i !== index)])
    }

    return (
        <Field label={label} className={className}>

            <div className="bg-foreground/10 rounded-md px-[0.4rem] py-[0.3rem] text-sm text-foreground/80 flex flex-wrap gap-1 justify-stretch">
                {!list[0] && !ref.current?.value[1] && <span className="text-foreground/50">#</span>}
                {list.map((item, i) =>
                    <div key={"tags-field-" + i} className="bg-violet-500/30 rounded-full pl-[0.6rem] pr-[0.3rem] py-[0.1rem] flex items-center">
                        {item} <div className="p-[0.1rem] rounded-full hover:bg-foreground/10 hover:text-red-600 cursor-pointer" onClick={() => {
                            removeItem(i)
                        }}><IoMdClose /></div>
                    </div>
                )}

                <input
                    ref={ref}
                    className={
                        twMerge(
                            "outline-0 min-w-[12px] flex-1",
                        )
                    }

                    onKeyDown={(event) => {

                        const condition = [
                            ["Enter"].includes(event.key)
                        ]

                        const eraseCondition = [
                            ["Backspace"].includes(event.key)
                        ]

                        if (eraseCondition.includes(true) && !ref.current?.value[1]) {
                            return removeItem(list.length - 1)
                        }

                        if (condition.includes(true) && ref.current?.value[1]) {

                            const item = event.currentTarget.value.trim()

                            if (item) {
                                addItems(item);
                                event.currentTarget.value = ""
                            }
                        }
                    }}
                    onChange={(event) => {
                        const value = event.target.value.split(",");
                        const input = value.pop()
                        const items = value.map((item) => item.trim()).filter((item) => item.length)


                        if (items[0]) {
                            addItems(...items)
                            event.target.value = input ?? "";
                        }
                    }} />



            </div>
        </Field>
    )
}