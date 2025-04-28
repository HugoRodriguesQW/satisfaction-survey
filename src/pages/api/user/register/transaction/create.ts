// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { newClient } from "@/resources/server/database";
import { createRegisterTransaction } from "@/resources/server/transactions";
import { it } from "@/resources/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@/resources/server/database.d";
import { Hash } from "@/resources/server/crypto";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, secret, name } = req.body;

  // validate Input
  if (!it(email, secret, name).is(String())) {
    console.info(req.body);
    return res.status(400).send(null);
  }
  //TODO: Update the files to check if email is an email and secret attends the minimal requirements

  // open the mongoclient
  const client = await newClient();

  // check if user exists
  const user = await authenticateUser(client, email, secret);
  if (user) {
    return res.redirect("/api/user/login/transaction/create");
  }

  // create the register transaction
  const transaction = await createRegisterTransaction(
    client,
    (email as string).trim(),
    (secret as string).trim(),
    (name as string).trim()
  );

  if (transaction) {
    return res.json(transaction);
  }

  return res.status(500).send(null);
}

async function authenticateUser(client: Client, email: string, secret: string) {
  const user = await client.user.findOne({ user_hash: new Hash(email).valueOf() });

  if (!user) return false;
  if (!bcrypt.compareSync(secret, user.password_hash)) return false;
  return user;
}
