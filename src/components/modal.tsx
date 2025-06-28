/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogPanel } from "@headlessui/react"
import React, { createContext, HTMLAttributes, useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

type ModalProps = {
    isOpen: boolean,
    handleClose: () => void;
    children?: React.ReactNode;
    anchor?: "center" | "top" | "left" | "right" | "bottom"
    containerClassName?: HTMLAttributes<HTMLDivElement>["className"]
    contentClassName?: HTMLAttributes<HTMLDivElement>["className"]
    rootClassName?: HTMLAttributes<HTMLDivElement>["className"]
}

type modalContextProps = {
    isOpen: boolean,
    currentContainer?: string,
    switchTo: (id: string) => void,
    handleClose: () => void;
}

const modalContext = createContext({} as modalContextProps)



export function createModal<T extends string>(...containers: T[]) {


    function Modal<T extends string>({ anchor = "center", isOpen, handleClose, ...props }: ModalProps) {
        const [currentContainer, setCurrentContainer] = useState<T>();

        const switchTo: modalContextProps["switchTo"] = (id) => {
            if (containers.includes(id as any)) {

                setCurrentContainer(id as T)
            } else {
                console.warn(id, "is not in container list:", containers)
            }

        }


        return (
            <modalContext.Provider value={{ isOpen, currentContainer, switchTo, handleClose }}>

                {
                    isOpen && (
                        <Dialog onClose={handleClose} open={true} className="relative z-50">
                            <div className={twMerge(
                                "fixed inset-0 flex w-screen items-center  justify-center p-4 backdrop-grayscale-70 backdrop-contrast-[109%] backdrop-blur-xs",
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

                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-foreground/5 to-foreground/10 rounded-md" />
                                    <div className={twMerge(
                                        "z-40 overflow-y-auto",
                                        props.contentClassName
                                    )}>
                                        {props.children}
                                    </div>
                                </DialogPanel>
                            </div>
                        </Dialog>
                    )}
            </modalContext.Provider>
        )
    }


    type ModalContainerProps = {
        container: T,
        children: React.ReactNode,
        defaultOpen?: boolean
    }

    Modal.Container = function ModalContainer({ container, children, defaultOpen = false }: ModalContainerProps) {

        const { currentContainer, switchTo } = useContext(modalContext)

        useEffect(() => {
            if (defaultOpen) {
                switchTo(container)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        if (currentContainer !== container) {
            return null;
        }

        return (
            <>{children}</>
        )
    }


    type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement> & { container: T, backTo?: T, disableBack?: boolean, disableClose?: boolean }


    Modal.Header = function ModalHeader({ className, children, container, backTo, disableClose = false, ...rest }: ModalHeaderProps) {

        const { switchTo, handleClose, currentContainer } = useContext(modalContext)


        function handleBack() {
            if (backTo) switchTo(backTo)
        }

        if (currentContainer !== container) {
            return null;
        }


        return (
            <div className={twMerge("flex justify-between items-center border-b py-2 px-2", className)}>
                <div className={"flex gap-2 items-center"} {...rest}>
                    {backTo && (
                        <button className="p-[0.1rem] rounded-md not-hover:opacity-70  hover:bg-foreground/10 z-50" onClick={handleBack}>
                            <RiArrowLeftSLine className="w-7 h-7" />
                        </button>
                    )}

                    {children}
                </div>

                {
                    !disableClose && (
                        <button
                            className="p-[0.1rem] rounded-md not-hover:opacity-70  hover:bg-foreground/10 z-50"
                            onClick={handleClose}
                        >
                            <IoIosClose className="w-8 h-8" />
                        </button>
                    )
                }
            </div>
        )
    }



    type ModalCallerProps = React.HTMLAttributes<HTMLButtonElement> & { name?: string, container: T }

    Modal.Caller = function ModalCaller({ className, children, name, title, onClick, container, ...rest }: ModalCallerProps) {

        const ctx = useContext(modalContext)

        function handleCall(e: React.MouseEvent<HTMLButtonElement>) {
            onClick?.(e);
            if (container) ctx.switchTo(container);
        }


        return (<button name={name} title={title} className={twMerge(
            "relative mb-3 mt-1 bg-gradient-to-r  hover:from-foreground/15 hover:to-foreground/10 transition",
            "max-sm:border-y  w-full max-sm:max-w-[95%] max-sm:mx-auto max-sm:rounded-md  border-foreground/15"
        )} onClick={handleCall} {...rest}>
            <RiArrowRightSLine className="w-6 h-6 opacity-50 absolute right-2 top-1/2 -mt-3 " />
            <div className={twMerge("w-full", className)}>
                {children}
            </div>
        </button>)
    }

    return Modal<T>
}
