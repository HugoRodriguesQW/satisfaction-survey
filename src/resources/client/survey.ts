import type { SafeData } from "../server/user";

export function createShareableLink(id: string | undefined, data?: SafeData) {
    if (!id) return "";
    const key = data?.private.keys?.[id].survey;
    if (!key) return "";

    return `${window.location.origin}/s/${id}/${key}`
}

