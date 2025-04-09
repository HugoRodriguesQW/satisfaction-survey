// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/database";
import { authenticateUser, createAccessToken } from "@/resources/user";
import { it } from "@/resources/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, secret } = JSON.parse(req.body);

  // validate Input
  if (!it(userId, secret).is(String())) {
    return res.status(400).send(null);
  }

  // validate user login
  const client = await newClient();

  const user = await authenticateUser(client, userId as string, secret as string);
  if (!user) {
    return res.status(403).send(null);
  }

  const token = await createAccessToken(
    client,
    userId,
    secret,
    new Date(new Date().setHours(24))
  );

  if (token) {
    return res.status(200).send({
      token,
      user,
    });
  }

  return res.status(500).send(null);
}
