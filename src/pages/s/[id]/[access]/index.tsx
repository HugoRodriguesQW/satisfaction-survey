import { GetServerSideProps } from "next";
import type { Survey } from "@/resources/server/surveys";
import { getSurveyStatus } from "@/resources/survey";
import { STATUS } from "@/resources/definitions";
import { ApplySchedulePage } from "@/components/apply/schedule.module";

export type ApplyActiveProps = {
    survey: Survey
}

export type ApplyScheduledProps = {
    scheduleStrDate: string,
    name: string
}

export type ApplyDeniedProps = {
    noaccess?: boolean,
    ended?: boolean,
    name?: string
}

type ApplyPageProps = ApplyActiveProps | ApplyScheduledProps | ApplyDeniedProps

export default function AppyPage(props: ApplyPageProps) {
    if ((props as ApplyScheduledProps).scheduleStrDate) {
        const scheduleProps = props as ApplyScheduledProps;
        return <ApplySchedulePage date={scheduleProps.scheduleStrDate} name={scheduleProps.name} />
    }

    if ((props as ApplyActiveProps).survey) {
        const activeProps = props as ApplyActiveProps;
        const survey = activeProps.survey;

        if (survey.created_at) survey.created_at = new Date(survey.created_at)
        if (survey.schedule.start) survey.schedule.start = new Date(survey.schedule.start)
        if (survey.schedule.end) survey.schedule.end = new Date(survey.schedule.end)

        return <ApplyResponse survey={survey} />
    }

    const deniedProps = props as ApplyDeniedProps;
    return <ApplyDeniedPage {...deniedProps} />
}


import { newClient } from "@/resources/server/database";
import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import { readSurveyData, SafeSurvey, searchSurveyById } from "@/resources/server/surveys";
import { ApplyDeniedPage } from "@/components/apply/Denied.module";
import { ApplyResponse } from "@/components/apply/Response.module";

export const getServerSideProps: GetServerSideProps<ApplyPageProps> = async (ctx) => {
    const { id, access } = ctx.query;

    if (!validateInput(id, access)) {
        return {
            props: {
                noaccess: true
            }
        }
    }

    const client = await newClient()
    const survey = await searchSurveyById(client, id as string)

    if (!survey) {
        return {
            props: {
                noaccess: true
            } as ApplyDeniedProps
        }
    }


    const data = readSurveyData(survey, access as string);

    if (!data) {
        return {
            props: {
                noaccess: true
            } as ApplyDeniedProps
        }
    }

    if (!data.schedule) data.schedule = { active: false };


    const status = getSurveyStatus(data.schedule);

    // Parse Date to string before return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    survey.created_at = survey.created_at.toString() as any;

    switch (status) {
        case STATUS.active:
            return {
                props: {
                    survey: SafeSurvey({ ...survey, data })
                } as ApplyActiveProps
            }
        case STATUS.disabled:
        case STATUS.ended:
            return {
                props: {
                    ended: status === STATUS.ended,
                    noaccess: status === STATUS.disabled,
                    name: data.name ?? "Untitled Survey"
                } as ApplyDeniedProps
            }
        case STATUS.scheduled:
            return {
                props: {
                    scheduleStrDate: String(data.schedule.start),
                    name: data.name ?? "Untitled Survey"
                } as ApplyScheduledProps
            }
    }

}

function validateInput(id: unknown, access: unknown) {
    return (
        it(id).is(String()) &&
        it(access).is(String()) &&
        it(id).custom(ObjectId.isValid)
    )
}