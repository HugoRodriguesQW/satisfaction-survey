// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/database";
import { can, validateAccessToken } from "@/resources/user";
import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { surveyId } = JSON.parse(req.body);

  // Validate input data
  if (!req.headers["authorization"]?.length) {
    return res.status(403).send(null);
  }

  if (!it(surveyId).custom(ObjectId.isValid)) {
    return res.status(400).send(null);
  }

  // validate user login
  const client = await newClient();
  const user = await validateAccessToken(client, req.headers["authorization"]);

  if (!user || !can(user, "read-data")) {
    return res.status(403).send(null);
  }

  const data = await client.data.findOne({
    surveyRef: ObjectId.createFromHexString(surveyId),
  });

  if (data) {
    return res.status(200).send(data);
  }
}
