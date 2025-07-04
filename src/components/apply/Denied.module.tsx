import type { ApplyDeniedProps } from "@/pages/s/[id]/[access]";
import { ApplyContainer } from "./Common.module";
import Head from "next/head";
import { TbError404 } from "react-icons/tb";
import { MdOutlineLockClock } from "react-icons/md";
import { BiError } from "react-icons/bi";

export function ApplyDeniedPage({ name, ended, noaccess }: ApplyDeniedProps) {

    const titleReason = [
        [ended, name],
        [noaccess, "Sorry: we couldn't open your survey"],
    ]
    const title = name ?? titleReason.find(([condition]) => !!condition)?.[1] ?? "Something wrong"


    function handleNeedHelp() {
        window.open("mailto:support@privora.com", "_blank")
    }
    return (
        <ApplyContainer>
            <Head>
                <title>{title} | Privora</title>
            </Head>

            <div className="flex items-center h-full px-12 flex-col  justify-center gap-12 pb-10">
                <div className="flex  items-center  justify-center w-full">
                    <div className="animate-scheduled-calendar w-[12vmin] h-[12vmin] md:w-[15vmin] md:h-[15vmin] relative bg-gradient-to-br from-foreground/20 to-foreground/10 rounded-[10%]">
                        {noaccess && <TbError404 className="w-full h-full" />}
                        {ended && <MdOutlineLockClock className="w-full h-full p-2" />}
                        {(!noaccess && !ended) && <BiError className="w-full h-full p-2" />}
                    </div>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2 text-center w-full">
                    <div className="text-3xl font-bold">
                        {noaccess && "We couldn’t open the survey from this link."}
                        {ended && "This survey has been closed."}
                        {(!noaccess && !ended) && "Hmm, that didn’t go as expected."}
                    </div>
                    <div className="text-lg max-w-[700px]">
                        {noaccess && (
                            <div className="flex flex-col w-full items-center gap-4 text-center text-foreground/90 mt-5 mx-auto">

                                <div className="text-foreground">
                                    You can try again later. Here are a few possible reasons:
                                </div>
                                <ul className="list-disc list-inside  text-sm text-left text-foreground/80 space-y-1">
                                    <li>The link is invalid or no longer active</li>
                                    <li>The survey has been unpublished or deleted</li>
                                    <li>Your access has expired or is restricted</li>
                                </ul>

                                <div className="mt-5">
                                    <button
                                        className="px-6 py-1 bg-foreground/5 outline outline-foreground/30 rounded-md"
                                        onClick={handleNeedHelp}
                                    >
                                        I need help
                                    </button>
                                </div>
                            </div>
                        )}

                        {
                            ended && (
                                <div>
                                    <div className="text-foreground">
                                        It may have been closed by the creator or expired automatically after the response period ended. Thank you for your interest.
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            className="px-6 py-1 bg-foreground/5 outline outline-foreground/30 rounded-md"
                                            onClick={handleNeedHelp}
                                        >
                                            I need help
                                        </button>
                                    </div>
                                </div>
                            )
                        }

                        {(!noaccess && !ended) && (
                            <div className="flex flex-col w-full items-center gap-4 text-center text-foreground/90 mt-5 mx-auto">

                                <div className="text-foreground">

                                    We{"'"}re not sure what happened.
                                    You can try again, check your internet connection, or make sure the access link is correct.

                                </div>

                                <div className="mt-5">
                                    <button
                                        className="px-6 py-1 bg-foreground/5 outline outline-foreground/30 rounded-md"
                                        onClick={handleNeedHelp}
                                    >
                                        I need help
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </ApplyContainer>
    )
}