import { WithId } from "mongodb";
import { Question } from "../definitions";
import { SafeObject } from "../utils";
import { decrypt, encrypt, Hash, randomBytes } from "./crypto";
import { generatePair } from "./crypto.asymetric";
import type { AuthSchema, Client, EncryptedSurveySchema, SurveySchema, UserSchema } from "./database.d";
import { updateUserPrivate } from "./user";
import { HextToObj, ObjToHex } from "./utils";

export type Survey = {
    name?: string,
    created_at: Date;
    schedule: {
        start?: Date,
        end?: Date,
        active: boolean,
    }
    questions: Question[];
}

export type MinimalSurvey = Omit<Survey, "questions"> & { questionsCount: number, id: string }
export type SurveyProperties = keyof Survey
export const updatebleKeys = (["name", "questions", "schedule"] as const);
export type UpdatableKeys = typeof updatebleKeys[number];

export async function searchSurveyById(client: Client, id: string) {
    const survey = await client.survey.findOne({ _id: HextToObj(id) })
    if (!survey) return false;
    return survey;
}


export async function readMultipleSurveys(client: Client, ids: string[]) {
    const surveys = await client.survey.find({
        _id: {
            $in: ids.map(HextToObj)
        }
    }).toArray();

    return surveys;
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


export async function refreshSurveyKey(client: Client, survey: WithId<EncryptedSurveySchema>, user: UserSchema, access: AuthSchema) {
    const surveyKey = user.private.keys[ObjToHex(survey._id)]?.survey;
    if (!surveyKey) {
        throw new Error("Missing surveyKey")
    };

    const decrypted = decrypt(survey.data, new Hash(surveyKey).withSecret());

    if (!decrypted) {
        return false;
    }

    const newSurveyKey = randomBytes(32);
    user.private.keys[ObjToHex(survey._id)].survey = newSurveyKey;

    const encrypted = encrypt(decrypted, new Hash(newSurveyKey).withSecret());

    await client.session(async (session) => {
        const update = await client.survey.updateOne({ _id: survey._id }, {
            $set: {
                data: encrypted
            }
        }, { session })

        if (!update.acknowledged || !update.modifiedCount) {
            throw new Error("failed: update survey data");
        }

        const userUpdate = await updateUserPrivate(client, access, {
            ...user.private,
            keys: user.private.keys
        }, session)

        if (!userUpdate) {
            throw new Error("failed: update user survey key");
        }
    })

    return newSurveyKey;
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
                    schedule: {
                        active: false,
                    }
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
        schedule: survey.data.schedule,
        questions: survey.data.questions
    }, {
        created_at: 1,
        name: 1,
        questions: 1,
        schedule: 1
    })
}