// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/server/database";
import { createRecoveryTransaction } from "@/resources/server/transactions";
import { it } from "@/resources/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  // validate Input
  if (!it(email).is(String())) {
    console.info(req.body);
    return res.status(400).send(null);
  }
  //TODO: Update the files to check if email is an email and secret attends the minimal requirements

  // open the mongoclient
  const client = await newClient();

  // create the register transaction
  const transaction = await createRecoveryTransaction(client, (email as string).trim());

  if (transaction) {
    return res.json(transaction);
  }

  return res.status(500).send(null);
}
