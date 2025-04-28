// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/server/database";
import { createLoginTransaction } from "@/resources/server/transactions";
import { it } from "@/resources/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  // validate Input
  if (!it(email).is(String())) {
    return res.status(400).send(null);
  }

  // validate user login
  const client = await newClient();

  // create the login transaction
  const transaction = await createLoginTransaction(client, (email as string).trim());

  if (transaction) {
    return res.json(transaction);
  }

  return res.status(500).send(null);
}
