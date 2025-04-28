import { newClient } from "@/resources/server/database";
import { isDone, SafeTransaction } from "@/resources/transactions";
import {  searchTransactionBy } from "@/resources/server/transactions";

import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { decrypt, Hash } from "@/resources/server/crypto";
import { Client, TransactionSchema } from "@/resources/server/database.d";
import { createAccessToken } from "@/resources/server/user";
import { setCookie } from "@/resources/server/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { secret, email } = req.body;

  if (!validateInput(id, secret, email)) return res.status(400).send("invalid input");

  const client = await newClient();
  const transaction = await searchTransactionBy(client, id as string);

  if (!transaction || transaction.attemps >= 10) return res.status(400).send(null);

  const isValid = await validateSecret(secret, transaction.tasks[0]);

  if (!isValid) {
    await incrementAttempt(client, transaction._id);
    return res.status(400).send(null);
  }

  const metadata = decrypt(transaction.meta, new Hash(email).withSecret());

  transaction.tasks[0].done = true;

  if (!isDone(transaction.tasks)) return res.status(200).json(SafeTransaction(transaction));

  if (metadata) {
    const token = await createAccessToken(client, metadata.email, transaction._id, new Date(Date.now() + 24 * 60 * 60 * 1000));
    setCookie(
      res,
      { token },
      {
        "Max-Age": 24 * 3600,
        SameSite: "Strict",
        Secure: false, // TODO: Change this in production
      }
    );

    return res.status(200).send(null);
  }

  return res.status(400).send(null);
}

function validateInput(id: unknown, secret: unknown, email: unknown): boolean {
  return it(id, secret, email).is(String()) && ObjectId.isValid(id as string);
}

async function validateSecret(secret: string, login_task: TransactionSchema["tasks"][number]): Promise<boolean> {
  const result = bcrypt.compareSync(secret, login_task.meta as string);
  return result;
}

async function incrementAttempt(client: Client, id: ObjectId) {
  await client.transaction.updateOne({ _id: id }, { $inc: { attemps: 1 } });
}
