import { WithId } from "mongodb";
import { Question, STATUS } from "../definitions";
import { SafeObject } from "../utils";
import { decrypt, encrypt, Hash, randomBytes } from "./crypto";
import { generatePair } from "./crypto.asymetric";
import type { AuthSchema, Client, EncryptedSurveySchema, SurveySchema, UserSchema } from "./database.d";
import { updateUserPrivate } from "./user";
import { HextToObj, ObjToHex } from "./utils";

export type Survey = {
    name?: string,
    created_at: Date;
    status: STATUS;
    questions: Question[];
}

export type SurveyProperties = keyof Survey
export const updatebleKeys = (["name", "questions", "status"] as SurveyProperties[]);
export type UpdatableKeys = typeof updatebleKeys[number];


export async function searchSurveyById(client: Client, id: string) {
    const survey = await client.survey.findOne({ _id: HextToObj(id) })
    if (!survey) return false;
    return survey;
}

export function readSurveyData(survey: WithId<EncryptedSurveySchema>, userOrKey: UserSchema | UserSchema["private"]["keys"][number]["survey"]) {
    const surveyKey = typeof userOrKey === "string" ? userOrKey : userOrKey.private.keys[ObjToHex(survey._id)]?.survey;

    if (!surveyKey) {
        throw new Error("Missing surveyKey")
    };

    const surveyData = decrypt(survey.data, new Hash(surveyKey).withSecret());

    if (surveyData) {
        return surveyData as SurveySchema["data"]
    }

    return false;
}

export async function updateSurveyData(client: Client, survey: WithId<EncryptedSurveySchema>, data: SurveySchema["data"], user: UserSchema) {

    const surveyKey = user.private.keys[ObjToHex(survey._id)]?.survey;
    if (!surveyKey) {
        throw new Error("Missing surveyKey")
    };

    const encrypted = encrypt(data, new Hash(surveyKey).withSecret());

    if (encrypted === survey.data) {
        return true;
    }

    const update = await client.survey.updateOne({ _id: survey._id }, {
        $set: {
            data: encrypted
        }
    })

    if (update.acknowledged && update.modifiedCount) {
        return update;
    }
    return false;
}

export function createNewSurvey(client: Client, user: UserSchema, access: AuthSchema) {
    return new Promise<string | false>((next) => {
        const pair = generatePair();
        const surveyKey = randomBytes(32);

        client.session(async (session) => {

            const survey: SurveySchema = {
                data: {
                    public_key: pair.public,
                    questions: [],
                    status: "disabled",
                },
                created_at: new Date(),
            }

            const inserted = await client.survey.insertOne({
                ...survey,
                data: encrypt(survey.data, new Hash(surveyKey).withSecret())
            })

            if (!inserted.insertedId) throw new Error("Failed: client.survey.insertOne")

            const update = await updateUserPrivate(client, access, {
                ...user.private,
                keys: {
                    ...(user.private.keys ?? {}),
                    [ObjToHex(inserted.insertedId)]: {
                        replies: pair.private,
                        survey: surveyKey
                    }
                }
            }, session)

            if (!update) throw new Error("Failed: client.user.updateOne")
            next(ObjToHex(inserted.insertedId))
        })
            .catch((err) => {
                console.error(err)
                next(false)
            })

    })
}

export function SafeSurvey(survey: SurveySchema): Survey {
    return SafeObject({
        ...survey,
        name: survey.data.name,
        status: survey.data.status,
        questions: survey.data.questions
    }, {
        created_at: 1,
        name: 1,
        questions: 1,
        status: 1
    })
}