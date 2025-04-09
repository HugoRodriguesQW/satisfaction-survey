// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/database";
import { can, createUser, validateAccessToken } from "@/resources/user";
import { it } from "@/resources/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, userId, secret, rules } = JSON.parse(req.body);

  // Validate input data
  if (!req.headers["authorization"]?.length) {
    return res.status(403).send(null);
  }
  if (!it(name, userId, secret).is(String())) {
    return res.status(400).send(null);
  }
  if (!it(...rules).is(String())) {
    return res.status(400).send(null);
  }

  // validate user login
  const client = await newClient();
  const user = await validateAccessToken(client, req.headers["authorization"]);

  if (!user || !can(user, "create-user")) {
    return res.status(403).send(null);
  }

  const result = await createUser(
    client,
    {
      name,
      rules,
      userId,
    },
    secret
  );

  if (result) {
    return res.status(200).send(result);
  }

  return res.status(500).send(null);
}
