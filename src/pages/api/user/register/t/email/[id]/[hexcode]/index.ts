/* eslint-disable @typescript-eslint/no-explicit-any */
import { newClient } from "@/resources/server/database";
import { isDone, SafeTransaction } from "@/resources/transactions";
import { searchTransactionBy } from "@/resources/server/transactions";
import { HexToUtf8, it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { decrypt, Hash } from "@/resources/server/crypto";
import { createUser } from "@/resources/server/user";
import { Client } from "@/resources/server/database.d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, hexcode } = req.query;

  if (!isValidInput(id, hexcode)) return res.status(400).send("invalid input");

  const code = HexToUtf8(hexcode as string);
  const client = await newClient();
  const transaction = await searchTransactionBy(client, id as string);

  if (!transaction || transaction.attemps >= 5) return res.status(400).send(null);

  const emailTask = transaction.tasks[0];

  if (!isCodeValid(code, emailTask.meta as string)) {
    await incrementAttempts(client, transaction._id);
    return res.status(400).send(null);
  }

  const metadata = decrypt(transaction.meta, new Hash(code).withSecret());
  emailTask.done = true;

  if (!isDone(transaction.tasks)) return res.status(200).json(SafeTransaction(transaction));

  if (metadata) {
    await handleUserCreation(client, metadata, transaction._id);
    return res.status(200).send(null);
  }

  return res.status(400).send(null);
}

function isValidInput(id: unknown, hexcode: unknown): boolean {
  return it(id, hexcode).is(String()) && ObjectId.isValid(id as string);
}

function isCodeValid(code: string, hash: string): boolean {
  return bcrypt.compareSync(code, hash);
}

async function incrementAttempts(client: Client, id: ObjectId) {
  await client.transaction.updateOne({ _id: id }, { $inc: { attemps: 1 } });
}

async function handleUserCreation(client: Client, metadata: Record<string, any>, transactionId: ObjectId) {
  await client.session(async (session) => {
    const user = await createUser(
      client,
      session,
      metadata.email,
      metadata.secret,
      { name: metadata.name, team: [] },
      { team: [] }
    );
    if (!user || !user?.insertedId) throw new Error("Couldn't create the user object");

    const deleted = await client.transaction.deleteOne({ _id: transactionId }, { session });
    if (!deleted.deletedCount) throw new Error("Couldn't delete the transaction");
  });
}
