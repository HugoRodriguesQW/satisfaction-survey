import { HTMLAttributes, ReactNode, useRef } from "react"
import { Field } from "./field.module"
import { twMerge } from "tailwind-merge";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";

type DropdownFieldProps<T extends string> = {
    options: readonly T[] | T[],
    texts?: readonly T[] | T[],
    value?: T,
    label: ReactNode,
} & {
    onChange?: (value: T) => void;
    optionStyle?: (value: T) => HTMLAttributes<HTMLButtonElement>["className"]
}

export function DropdownField<T extends string>({ options, label, texts, value, onChange, optionStyle }: DropdownFieldProps<T>) {

    const current = value ? options.indexOf(value) : -1

    const ref = useRef<HTMLButtonElement>(null)

    return (
        <Field label={label}>
            <Menu as="div" className="relative">
                <MenuButton ref={ref} className={twMerge(
                    "inline-flex items-center gap-2 rounded-md bg-foreground/10 px-[0.4rem]  py-[0.3rem] outline-none  text-sm focus:not-data-focus:outline-none data-focus:outline data-focus:outline-foreground data-hover:bg-foreground/15 data-open:bg-foreground/20 w-full justify-between",
                )}>
                    {texts?.[current] ?? value} <BiChevronDown />
                </MenuButton>

                <MenuItems className={twMerge("origin-top-right before-dark min-w-[var(--button-width)]"
                )} anchor="bottom end" transition>
                    {
                        options.map((option, i) => (
                            <MenuItem key={option} >
                                <button onClick={(() => {
                                    onChange?.(option)
                                })} className={twMerge(
                                    "group flex w-full px-3 py-[0.3rem] hover:bg-foreground/10",
                                    current === i && "bg-foreground/15",
                                    optionStyle?.(option)
                                )}>
                                    {texts?.[i] ?? option}
                                </button>
                            </MenuItem>
                        ))
                    }
                </MenuItems>
            </Menu>

        </Field>
    )
}
