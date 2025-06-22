import { Question, STATUS, STATUSValue } from "@/resources/definitions";
import { authMiddleware } from "@/resources/server/auth";
import { readSurveyData, SafeSurvey, searchSurveyById, UpdatableKeys, updatebleKeys, updateSurveyData } from "@/resources/server/surveys";
import { readUserData } from "@/resources/server/user";
import { it } from "@/resources/utils";


const handler = authMiddleware(async (req, res) => {
    const { id } = req.query;
    const { property, value } = req.body;


    if (!validateInput(id, property, value)) {
        console.error("Invalid input:", { id, value, property })
        return res.status(400).send(null)
    }

    const client = req.client;
    const user = await readUserData(client, req.access);

    if (!user) return res.status(400).send(null);

    const survey = await searchSurveyById(client, id as string)


    if (survey) {

        console.info("survey found")
        const data = readSurveyData(survey, user);

        if (data) {
            console.info("data found")
            switch (property as UpdatableKeys) {
                case "name":
                    data.name = value as string;
                    break;
                case "questions":
                    data.questions = value as Question[];
                    break;
                case "status":
                    data.status = value as STATUSValue;
                    break;
                default:
                    console.error("Invalid Property:", property)
                    return res.status(400).send(null)
            }

            const update = await updateSurveyData(client, survey, data, user)

            if (update) {
                console.info("update with success.")
                return res.status(200).send(SafeSurvey({ ...survey, data }))
            }
        }
    }

    console.error("General fail.")
    return res.status(400).send(null)

});

function validateInput(id: unknown, property: unknown, value: unknown) {
    if (!it(id, property).is(String())) return false;
    if (!(updatebleKeys).includes(property as UpdatableKeys)) return false;

    switch (property as UpdatableKeys) {
        case "name":
            return it(value).is(String());
        case "questions":
            return it(value).is(Object());
        case "status":
            return it(value).eq(STATUS.active, STATUS.disabled, STATUS.ended, STATUS.scheduled)
        default:
            return false;

    }
}

export default handler;
