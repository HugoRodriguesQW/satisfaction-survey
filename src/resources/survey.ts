import { STATUS, STATUSValue } from "./definitions";
import type { Survey } from "./server/surveys";

export function getSurveyStatus(schedule: Survey["schedule"]): STATUSValue {
    const now = Date.now();

    const start = schedule.start ? new Date(schedule.start) : undefined;
    const end = schedule.end ? new Date(schedule.end) : undefined;

    const status = {
        ended: schedule.active && (end?.getTime() ?? Infinity) < now,
        active: schedule.active && (start?.getTime() ?? -Infinity) <= now && (end?.getTime() ?? Infinity) >= now,
        scheduled: schedule.active && (start?.getTime() ?? -Infinity) > now
    } as Record<STATUS, boolean>

    for (const s in status) {
        if (status[s as STATUS]) return STATUS[s as STATUS];
    }

    return STATUS.disabled;
}

export function ThreePairCards(n:number) {

    const cards = [n % 3, (n + 1) % 3, (n + 2) % 3]
    const contents = [n-1, n, n + 1];
    
    return {
        c1: {
            pos: cards.indexOf(0),
            content: contents[cards.indexOf(0)]
        },
        c2: {
            pos: cards.indexOf(1),
            content: contents[cards.indexOf(1)]
        },
        c3: {
            pos: cards.indexOf(2),
            content: contents[cards.indexOf(2)]
        }
    }
}
