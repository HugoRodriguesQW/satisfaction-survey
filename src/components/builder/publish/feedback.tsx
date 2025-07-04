import React, { useState } from "react"
import { PublishModal } from "../publish.module"
import { PublishComponent } from "./Common.module"
import { createShareableLink } from "@/resources/client/survey"
import type { SafeData } from "@/resources/server/user"
import { IoShareSocial } from "react-icons/io5"
import { TbShare } from "react-icons/tb"
import { FaLink } from "react-icons/fa"
import { twMerge } from "tailwind-merge"
import { useNavigator } from "@/resources/client/navigator"

type FeedbackContainerProps = {
    container: typeof PublishModal.Containers[number],
    children: React.ReactNode,
    title?: string
    backTo?: typeof PublishModal.Containers[number],
}

export function FeedbackContainer({ container, children, title, backTo }: FeedbackContainerProps) {
    return (
        <PublishModal.Container container={container}>
            <PublishModal.Header backTo={backTo}>
                {title}
            </PublishModal.Header>
            <PublishComponent>
                {children}
            </PublishComponent>
        </PublishModal.Container>
    )
}

type PublishFeedbackContainerProps = {
    id?: string,
    data?: SafeData,
    name?: string
}

export function PublishFeedbackContainer({ id, data, name }: PublishFeedbackContainerProps) {

    const link = createShareableLink(id, data);
    const [copied, setCopied] = useState(false);
    const { canShare, shareOrCopyLink } = useNavigator();


    function handleShare() {
        const shareMethod = shareOrCopyLink(link, name, data?.private.name)

        if (shareMethod === "clipboard") {
            setCopied(true)
        }
    }

    return (
        <FeedbackContainer container="publish-feedback" title="Survey Published" backTo="main">
            <div className="[&>*]:mb-5">
                <div className="text-foreground/60 font-bold flex items-center flex-col text-xl gap-2">
                    <div className="turn-on-animate p-3 bg-gradient-to-br text-white from-neon to-neon-sub rounded-full w-fit">
                        <TbShare className="w-15 h-15" />
                    </div>
                    Survey Published!
                </div>

                <div className="text-center w-full text-foreground/90 ">
                    We’ve generated a unique link just for you. Anyone with this link can access and respond to your survey.
                </div>
                <div>
                    <div className="flex gap-2 w-full items-center">
                        <textarea className={twMerge(
                            "focus:outline-0  border border-foreground/15 w-full overflow-clip bg-foreground/5 rounded-md py-1 text-lg px-3 text-foreground/60",
                            copied && "outline outline-neon-mid bg-neon-mid/15"
                        )} value={link} />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        className="tail-button px-4 py-1.5 rounded-md text-white font-bold flex gap-2 items-center"
                        onClick={handleShare}
                        onMouseLeave={() => {
                            setTimeout(() => {
                                setCopied(false)
                            }, 600)
                        }}
                        onBlur={() => setCopied(false)}>
                        <IoShareSocial className="w-5 h-5 -mt-0.5" />
                        {copied && <div>Copied to clipboard</div>}
                        {!copied && <div>{canShare() ? "Share" : "Copy"} the link</div>}
                    </button>
                </div>
            </div>
        </FeedbackContainer>
    )
}


export function UnpublishFeedbackContainer() {

    const { switchTo } = PublishModal.useContext();

    function handleContinue() {
        switchTo("main")
    }

    return (
        <FeedbackContainer container="disable-feedback" title="Survey Unpublished" backTo="main">
            <div className="[&>*]:mb-5">
                <div className="text-foreground/60 font-bold flex items-center flex-col text-xl gap-2">
                    <div className="turn-off-animate p-3 bg-gradient-to-br text-white from-neon to-neon-sub rounded-full w-fit">
                        <TbShare className="w-15 h-15" />
                    </div>
                    Survey Unpublished!
                </div>

                <div className="text-center w-full text-foreground/90 ">
                    The shared link has been disabled, and no one can access or respond to your survey anymore.
                    You can publish it again at any time.
                </div>

                <div className="flex justify-center">
                    <button
                        className="tail-button px-9 py-1.5 rounded-md text-white font-bold flex gap-2 items-center"
                        onClick={handleContinue}
                    >
                        Great
                    </button>
                </div>
            </div>
        </FeedbackContainer>
    )
}


type RevokeFeedbackContainerProps = {
    id?: string,
    data?: SafeData,
    name?: string
}


export function RevokeFeedbackContainer({ id, data, name }: RevokeFeedbackContainerProps) {

    const link = createShareableLink(id, data);
    const [copied, setCopied] = useState(false);
    const { canShare, shareOrCopyLink } = useNavigator();


    function handleShare() {
        const shareMethod = shareOrCopyLink(link, name, data?.private.name)

        if (shareMethod === "clipboard") {
            setCopied(true)
        }
    }

    return (
        <FeedbackContainer container="revoke-feedback" title="Survey Link Revoked" backTo="main">
            <div className="[&>*]:mb-5">
                <div className="text-foreground/60 font-bold flex items-center flex-col text-xl gap-2">
                    <div className="animate-refresh p-3 bg-gradient-to-br text-white from-neon to-neon-sub rounded-full w-fit">
                        <FaLink className="w-15 h-15" />
                    </div>
                    Access Link Revoked
                </div>

                <div className="text-center w-full text-foreground/90 ">
                    It can no longer be used to access your survey.
                    <div>A new link has been generated — share it to continue collecting responses.</div>
                </div>

                <div>
                    <div className="flex gap-2 w-full items-center">
                        <textarea className={twMerge(
                            "focus:outline-0  border border-foreground/15 w-full overflow-clip bg-foreground/5 rounded-md py-1 text-lg px-3 text-foreground/60",
                            copied && "outline outline-neon-mid bg-neon-mid/15"
                        )} value={link} />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        className="tail-button px-4 py-1.5 rounded-md text-white font-bold flex gap-2 items-center"
                        onClick={handleShare}
                        onMouseLeave={() => {
                            setTimeout(() => {
                                setCopied(false)
                            }, 600)
                        }}
                        onBlur={() => setCopied(false)}>
                        <IoShareSocial className="w-5 h-5 -mt-0.5" />
                        {copied && <div>Copied to clipboard</div>}
                        {!copied && <div>{canShare() ? "Share" : "Copy"} the new link</div>}
                    </button>
                </div>
            </div>
        </FeedbackContainer>
    )
}