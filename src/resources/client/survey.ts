import type { SafeData } from "../server/user";

export function createShareableLink(id: string | undefined, data?: SafeData) {
    if (!id) return "";
    const key = data?.private.keys?.[id].survey;
    if (!key) return "";

    return `${window.location.origin}/s/${id}/${key}`
}

export function shareOrCopyLink(link: string, title: string | undefined, username: string | undefined) {
    const sharableData: ShareData = {
        title: `${(title ?? "Survey")} | Privora`,
        text: `${username} invited you to answer this survey. No logins, no hassle — just your input.`,
        url: link
    }

    if (navigator.canShare?.(sharableData)) {
        navigator.share(sharableData)
        return "share"
    }
    navigator.clipboard.writeText(link)
    return "clipboard"
}