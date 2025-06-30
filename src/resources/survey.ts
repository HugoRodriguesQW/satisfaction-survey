import { STATUS, STATUSValue } from "./definitions";
import type { Survey } from "./server/surveys";

export function getSurveyStatus(schedule: Survey["schedule"]): STATUSValue {
    const now = Date.now();

    const status = {
        ended: schedule.active && (schedule.end?.getTime() ?? Infinity) < now,
        active: schedule.active && (schedule.start?.getTime() ?? -Infinity) <= now && (schedule.end?.getTime() ?? Infinity) >= now,
        scheduled: schedule.active && (schedule.start?.getTime() ?? -Infinity) > now
    } as Record<STATUS, boolean>

    for (const s in status) {
        if (status[s as STATUS]) return STATUS[s as STATUS];
    }

    return STATUS.disabled;
}