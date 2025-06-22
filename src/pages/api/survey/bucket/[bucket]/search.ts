import { authMiddleware } from "@/resources/server/auth";
import { MinimalSurvey, readMultipleSurveys, readSurveyData } from "@/resources/server/surveys";
import { readUserData } from "@/resources/server/user";
import { ObjToHex } from "@/resources/server/utils";
import { it } from "@/resources/utils";


export type SearchBucket = {
    surveys: MinimalSurvey[],
    nextExists: boolean
}

const envBucketSize = Number(process.env["SURVEY_BUCKET_SIZE"])
const defaultBucketSize = 10;

const bucketSize = (Number.isNaN(envBucketSize) || !envBucketSize) ? defaultBucketSize : envBucketSize

const handler = authMiddleware(async (req, res) => {
    const client = req.client;
    const user = await readUserData(req.client, req.access)

    const bucket = Number(req.query.bucket);

    if (!validateInput(bucket) || !user) {

        console.info("invalid input or missing user", { user, bucket })
        return res.status(400).send(null)
    }

    const userSurveyIds = Object.keys(user.private.keys).sort((a, b) => b.localeCompare(a))
    const bucketSurveysIds = userSurveyIds.slice(bucket * bucketSize, (bucket * bucketSize) + bucketSize);

    if (!bucketSurveysIds[0]) {
        return res.status(200).json({
            surveys: [],
            nextExists: false
        } as SearchBucket)
    }

    const surveys = await readMultipleSurveys(client, bucketSurveysIds);

    if (!surveys[0]) {
        return res.status(200).json({
            surveys: [],
            nextExists: false
        } as SearchBucket)
    }

    const surveyDatas = surveys.map((survey) => readSurveyData(survey, user.private.keys[ObjToHex(survey._id)].survey));

    const result: MinimalSurvey[] = surveys.map((survey, i) => {
        const data = surveyDatas[i]
        if (!data) return false;

        return {
            id: ObjToHex(survey._id),
            name: data.name,
            status: data.status,
            created_at: survey.created_at,
            questionsCount: data.questions.length,
        } as MinimalSurvey
    }).filter((s) => s !== false)

    return res.status(200).json({
        surveys: result,
        nextExists: !!userSurveyIds[(bucket * bucketSize) + bucketSize]
    } as SearchBucket)
})


function validateInput(bucket: unknown) {
    return it(bucket).is(Number()) && it(bucket).custom(Number.isSafeInteger) && it(bucket).moreEqThan(0)
}

export default handler;