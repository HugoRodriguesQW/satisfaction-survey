import { useEffect, useState } from "react"

export function useNavigator() {

    const [canShare, setCanShare] = useState<Navigator["canShare"]>(() => () => false);


    function shareOrCopyLink(link: string, title: string | undefined, username: string | undefined) {

        const sharableData: ShareData = {
            title: `${(title ?? "Survey")} | Privora`,
            text: `${username} invited you to answer this survey. No logins, no hassle — just your input.`,
            url: link
        }

        if (canShare(sharableData)) {
            navigator.share(sharableData)
            return "share"
        }
        navigator.clipboard.writeText(link)
        return "clipboard"
    }


    useEffect(() => {
        if (global && navigator) {
            if (navigator.canShare) {
                setCanShare(() => navigator.canShare || (() => false))
            }
        }
    }, [])


    return { canShare, shareOrCopyLink }


}