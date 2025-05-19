import { createContext, DragEvent, HTMLAttributes, ReactNode, useContext, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge";

type dragContextProps<T> = {
    onDragEnd: (e: DragEvent, callback: (data: T) => void) => void;
    onDragStart: (e: DragEvent, data?: T) => void,
    dragging: boolean,
    clear: () => void,
    locked: boolean,
    lockFrontEnd: () => void
    unlockFrontEnd: () => void
}


type ItemProps<T> = {
    data?: T;
    children?: ReactNode
} & HTMLAttributes<HTMLDivElement>


type DropProps<T> = {
    children?: ReactNode,
    handleDrop?: (data: T) => void,
} & HTMLAttributes<HTMLDivElement>


type ContextProps = {
    children?: ReactNode
}

let globalDragId: symbol | null = null;

export function createDraggable<T>() {

    const contextId = Symbol("draggable-context")
    const dragContext = createContext({} as dragContextProps<T>)

    function Context({ children }: ContextProps) {
        const [data, setData] = useState<T>()
        const [locked, setLocked] = useState(false);


        useEffect(() => {
            console.info({ contextId, data, locked })
        }, [data, locked])


        function onDragEnd(e: DragEvent, callback: (data: T) => void) {
            if (!locked && data) {
                callback(data)
            }
            clear()
            unlockFrontEnd()
        }

        function onDragStart(e: DragEvent, data?: T) {
            globalDragId = contextId;
            setData(data)
            unlockFrontEnd()
        }

        function lockFrontEnd() {
            console.info({ global: globalDragId, id: contextId })
            if (!globalDragId) {
                return setLocked(true)
            }
            setLocked(globalDragId !== contextId)
        }

        function unlockFrontEnd() {
            setLocked(false)
        }

        function clear() {
            setData(undefined)
        }
        return (
            <dragContext.Provider value={{
                dragging: !!data,
                onDragEnd,
                onDragStart,
                locked,
                lockFrontEnd,
                unlockFrontEnd,
                clear
            }}>
                {children}
            </dragContext.Provider>
        )
    }


    function Item({ children, data, className, ...rest }: ItemProps<T>) {

        const { onDragStart, locked, clear } = useContext(dragContext)

        return (
            <div {...rest} className={twMerge(
                locked && "cursor-not-allowed",
                className
            )} draggable

                onDragEnd={() => {
                    clear()
                }}
                onDragStart={(e) => {
                    onDragStart(e, data)
                }}>
                {children}
            </div>
        )
    }

    function Drop({ children, handleDrop, className, ...rest }: DropProps<T>) {

        const { dragging, locked, onDragEnd, lockFrontEnd, unlockFrontEnd } = useContext(dragContext)
        const [hovering, setHovering] = useState(false)

        const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault()

        }

        const onEnter = () => {
            setHovering(true)
            lockFrontEnd()
        }

        const onLeave = () => {
            unlockFrontEnd()
            setHovering(false)
        }

        return (
            <div {...rest} className={twMerge(
                className,
                dragging && !locked && "border border-foreground/35",
                "relative  overflow-hidden"
            )} onDragOver={handleDragOver} onDragEnter={onEnter} onDragLeave={onLeave} onDrop={(e) => {
                e.preventDefault()
                setHovering(false)
                if (handleDrop) onDragEnd(e, handleDrop)
            }}>
                {children}

                <div className={
                    twMerge(
                        "absolute top-0 left-0 transition duration-100  w-full h-full bg-foreground/50",
                        !locked && !hovering && dragging && "opacity-30",
                        !locked && hovering && "opacity-100",
                        (!hovering || locked) && "opacity-0",
                    )} />
            </div>
        )
    }


    return {
        Context,
        Item,
        Drop,
    }
}
