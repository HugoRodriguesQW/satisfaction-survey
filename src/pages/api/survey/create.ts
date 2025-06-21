import { authMiddleware } from "@/resources/server/auth";
import { createNewSurvey } from "@/resources/server/surveys";
import { readUserData } from "@/resources/server/user";

const handler = authMiddleware(async (req, res) => {
    const client = req.client;
    const user = await readUserData(client, req.access);

    if (!user) return res.status(400).send(null);

    const surveyId = await createNewSurvey(client, user, req.access)

    if (surveyId) {
        console.info("survey created: ", surveyId)
        return res.status(200).send(surveyId)
    }

    console.info("survey not created")

    return res.status(400).send(null)
});

export default handler;
