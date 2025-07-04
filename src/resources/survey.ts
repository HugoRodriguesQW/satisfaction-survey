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