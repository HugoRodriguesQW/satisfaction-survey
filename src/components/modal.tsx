import { Dialog, DialogPanel } from "@headlessui/react"
import { HTMLAttributes } from "react";
import { IoIosClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

type ModalProps = {
    isOpen: boolean,
    handleClose: () => void;
    children?: React.ReactNode;
    anchor?: "center" | "top" | "left" | "right" | "bottom"
    containerClassName?: HTMLAttributes<HTMLDivElement>["className"]
    contentClassName?: HTMLAttributes<HTMLDivElement>["className"]
    rootClassName?: HTMLAttributes<HTMLDivElement>["className"]
    hideCloseButton?: boolean
}

export function Modal({ anchor = "center", ...props }: ModalProps) {


    return (
        <Dialog open={props.isOpen} onClose={props.handleClose} className="relative z-50">
            <div className={twMerge(
                "fixed inset-0 flex w-screen items-center justify-center p-4 backdrop-grayscale-70 backdrop-contrast-[109%] backdrop-blur-xs",
                anchor === "left" && "justify-start",
                anchor === "right" && "justify-end",
                anchor === "top" && "items-start",
                anchor === "bottom" && "items-end",
                props.rootClassName
            )}>
                <DialogPanel style={{ maxHeight: 'calc(100% - 6rem)' }} className={twMerge(
                    "w-full flex bg-gradient-to-br from-background via-background/95 to-background/70 rounded-md relative",
                    props.containerClassName
                )}>

                    {!props.hideCloseButton && (
                        <button
                            className="absolute right-0 top-0 p-[0.1rem] rounded-bl-md not-hover:opacity-70  hover:bg-foreground/10 z-50"
                            onClick={props.handleClose}
                        >
                            <IoIosClose className="w-8 h-8" />
                        </button>

                    )}

                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-foreground/5 to-foreground/10 rounded-md" />
                    <div className={twMerge(
                        "z-40",
                        props.contentClassName
                    )}>
                        {props.children}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

type ModalCallerProps = React.HTMLAttributes<HTMLButtonElement> & { name?: string }

export function ModalCaller({ className, children, name, title, ...rest }: ModalCallerProps) {
    return (<button name={name} title={title} className="w-full relative  mb-3 mt-1 bg-gradient-to-r  hover:from-foreground/15 hover:to-foreground/10 transition" {...rest}>
        <RiArrowRightSLine className="w-6 h-6 opacity-50 absolute right-2 top-1/2 -mt-3 " />
        <div className={twMerge("w-full", className)}>
            {children}
        </div>
    </button>)
}