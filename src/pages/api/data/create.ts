// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/database";
import { can, validateAccessToken } from "@/resources/user";
import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { surveyId, answers } = JSON.parse(req.body);

  // Validate input data
  if (!req.headers["authorization"]?.length) {
    return res.status(403).send(null);
  }
  if (!it(...answers).is(String())) {
    return res.status(400).send(null);
  }
  if (!it(surveyId).custom(ObjectId.isValid)) {
    return res.status(400).send(null);
  }

  // validate user login
  const client = await newClient();
  const user = await validateAccessToken(client, req.headers["authorization"]);

  if (!user || !can(user, "create-data")) {
    return res.status(403).send(null);
  }

  const survey = await client.survey.findOne({
    _id: ObjectId.createFromHexString(surveyId),
  });

  if (!survey) {
    return res.status(404).send(null);
  }

  const result = await client.data.insertOne({
    surveyRef: ObjectId.createFromHexString(surveyId as string),
    userRef: user._id,
    answers,
  });

  if (result.acknowledged && result.insertedId) {
    return res.status(200).send(null);
  }

  return res.status(500).send(null);
}
