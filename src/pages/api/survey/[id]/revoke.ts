import { authMiddleware } from "@/resources/server/auth";
import { refreshSurveyKey, searchSurveyById } from "@/resources/server/surveys";
import { readUserData } from "@/resources/server/user";
import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";


const handler = authMiddleware(async (req, res) => {
    const { id } = req.query;


    if (!validateInput(id)) {
        console.error("Invalid input:", { id })
        return res.status(400).send(null)
    }

    const client = req.client;
    const user = await readUserData(client, req.access);

    if (!user) return res.status(400).send(null);

    const survey = await searchSurveyById(client, id as string)

    if (survey) {
        const newSurveyKey = await refreshSurveyKey(client, survey, user, req.access)
        if (newSurveyKey) return res.status(200).send(newSurveyKey)

    }

    console.error("General fail.")
    return res.status(400).send(null)

});

function validateInput(id: unknown) {
    return it(id).custom(ObjectId.isValid);
}

export default handler;
