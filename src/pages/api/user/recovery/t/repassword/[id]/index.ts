/* eslint-disable @typescript-eslint/no-explicit-any */
import { newClient } from "@/resources/server/database";
import { isDone, SafeTransaction } from "@/resources/transactions";
import { deleteTransaction, searchTransactionBy } from "@/resources/server/transactions";
import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { decrypt, Hash } from "@/resources/server/crypto";
import { updateUserSecret } from "@/resources/server/user";
import { Client } from "@/resources/server/database.d";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { email_token, secret } = req.body;

  if (!isValidInput(id, secret, email_token)) return res.status(400).send("invalid input");

  const client = await newClient();

  const transaction = await searchTransactionBy(client, id as string);

  if (!transaction || transaction.attemps >= 5) return res.status(400).send(null);

  const email_key = decrypt(email_token, new Hash().withSecret());
  const emailTask = transaction.tasks[0];

  if (!isTokenValid(email_key, emailTask.meta as string)) {
    await incrementAttempts(client, transaction._id);
    return res.status(400).send(null);
  }

  const metadata = decrypt(transaction.meta, new Hash(email_key).withSecret());
  emailTask.done = true;

  if (!isDone(transaction.tasks)) return res.status(200).json(SafeTransaction(transaction));

  if (metadata) {
    await handleUpdateSecret(client, metadata, secret, transaction._id);
    return res.status(200).send(null);
  }

  return res.status(400).send(null);
}

function isValidInput(id: unknown, hexcode: unknown, code: unknown): boolean {
  return it(id, hexcode, code).is(String()) && ObjectId.isValid(id as string);
}

function isTokenValid(email_key: string, meta: string) {
  if (!email_key) return false;
  return bcrypt.compareSync(email_key as string, meta);
}

async function incrementAttempts(client: Client, id: ObjectId) {
  await client.transaction.updateOne({ _id: id }, { $inc: { attemps: 1 } });
}

async function handleUpdateSecret(
  client: Client,
  metadata: Record<string, any>,
  newSecret: string,
  transactionId: ObjectId
) {
  await client.session(async (session) => {
    const updated = await updateUserSecret(client, session, metadata.email, newSecret);
    if (!updated) throw new Error("Couldn't update the user secret");

    const deleted = await deleteTransaction(client, session, transactionId);
    if (!deleted) throw new Error("Couldn't delete the transaction");
  });
}
