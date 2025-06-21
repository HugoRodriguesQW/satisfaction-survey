import { newClient } from "@/resources/server/database";
import { readSurveyData, SafeSurvey, searchSurveyById } from "@/resources/server/surveys";
import { it } from "@/resources/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { surveyKey } = req.body;

    if (!validateInput(id, surveyKey)) {
        return res.status(400).send(null)
    }

    const client = await newClient();
    const survey = await searchSurveyById(client, id as string);

    if (survey) {

        const surveyData = readSurveyData(survey, surveyKey)

        if (surveyData) {
            res.status(200).json(SafeSurvey({ ...survey, data: surveyData }))
        }
    }
    return res.status(400).send(null)
}

function validateInput(id: unknown, surveyKey: unknown) {
    return it(id, surveyKey).is(String())
}