import { builderContext } from "@/context/builderContext.module";
import { Sync } from "@/resources/definitions/sync";
import { useContext, useEffect, useState } from "react";
import { IoShareSocial } from "react-icons/io5";
import { Separator } from "../separator.module";
import { LuScreenShare } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { HeaderSyncStatus } from "./editor/sync";
import { BuilderPublish } from "./publish.module";

export function EditorMenuBar() {

    const { syncStatus, schedule } = useContext(builderContext);
    const [isOpen, setIsOpen] = useState(false);
    const [hoveringButton, setHoveringButton] = useState(false);
    const [showText, setShowText] = useState(false);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowText(hoveringButton)
        }, hoveringButton ? 600 : 200)

        return () => {
            return clearTimeout(timeout)
        }
    }, [hoveringButton])

    function handleOpenPublish() {
        setIsOpen(true);
    }

    function handleClosePublish() {
        setIsOpen(false);
    }

    function handleButtonEnter() {
        setHoveringButton(true)
    }


    function handleButtonExit() {
        setHoveringButton(false)
    }

    return (
        <div className="w-full flex justify-between items-center text-sm pl-4 z-50 pr-8 pb-3  bg-gradient-to-b from-background to-transparent backdrop-blur-2xl backdrop-grayscale-100 border-b border-foreground/10">
            <div className="flex items-center gap-1">
                <div onMouseEnter={handleButtonEnter} onMouseLeave={handleButtonExit}
                    className={twMerge(
                        "flex items-center gap-1 outline px-[0.3rem] py-[0.2rem] rounded-md not-hover:[&>.show]:w-0",
                        syncStatus === Sync.Ok && "bg-foreground/5 outline-foreground/10",
                        syncStatus === Sync.Fail && "bg-red-500/5 outline-red-500/20 text-red-500",
                        syncStatus === Sync.Syncing && "bg-foreground/5 outline-foreground/10",
                    )}>
                    <HeaderSyncStatus />
                    <span className={twMerge("overflow-hidden pr-[0.3rem] transition-all duration-100")}>
                        {syncStatus === Sync.Ok && "Synced"}
                        {syncStatus === Sync.Fail && "Not Synced"}
                        {syncStatus === Sync.Syncing && "Synced"}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-1 border-l border-foreground/10 pl-3 [&>button]:py-[0.3rem]">
                <button onMouseEnter={handleButtonEnter} onMouseLeave={handleButtonExit} className="flex items-center hover:outline outline-foreground/10 rounded-md px-2 hover:bg-foreground/5  not-hover:[&>.show]:w-0"
                    name="open preview"
                >
                    <LuScreenShare className="h-6 w-6" /> <span className={twMerge("overflow-hidden w-0 transition-all duration-100", showText && "show w-15")}>Preview</span>
                </button>

                <Separator orientation="vertical" className="h-full" />

                <button className={
                    twMerge(
                        "bg-gradient-to-br from-neon  via-neon-mid to-80% to-neon-violet-sub flex gap-1 items-center font-bold px-3 rounded-sm hover:contrast-150 disabled:from-foreground/50 disabled:to-foreground/50 disabled:via-foreground/50 transition-colors duration-100",
                        schedule.active && "from-green-500 via-green-500/85 to-green-500/80"
                    )
                }
                    name='publish survey'
                    onClick={handleOpenPublish} disabled={syncStatus !== Sync.Ok}>
                    <IoShareSocial className="w-5 h-5" />  <span>{
                        schedule.active ? "Published" : "Publish"
                    }</span>
                </button>
            </div>


            <BuilderPublish isOpen={isOpen} handleClose={handleClosePublish} />
        </div>
    )
}