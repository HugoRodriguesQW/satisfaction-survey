/* eslint-disable @typescript-eslint/no-explicit-any */
import { newClient } from "@/resources/server/database";
import { SafeTransaction } from "@/resources/server/transactions";
import { deleteTransaction, searchTransactionBy, updateTransaction } from "@/resources/server/transactions";
import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateUserSecret } from "@/resources/server/user";
import { Client } from "@/resources/server/database.d";
import { Compound, Task } from "@/resources/server/tasks";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { email_token, secret } = req.body;

  if (!isValidInput(id, secret, email_token)) return res.status(400).send("invalid input");

  const client = await newClient();

  const transaction = await searchTransactionBy(client, id as string);

  if (!transaction || transaction.attemps >= 5) return res.status(400).send(null);

  const tasks = Compound.TaskStack(transaction.tasks.map(Task.from)).attachRaw(transaction.meta)

  await tasks.getTask("recovery_email_check", async (emailTask) => {
    if (!emailTask) {
      return res.status(400).send(null);
    }

    const metadata = tasks.unmount(email_token);

    if (!(await emailTask.test(email_token)) || !metadata) {
      await incrementAttempts(client, transaction._id);
      return res.status(400).send(null);
    }

    if (!tasks.done()) {
      if (metadata.layer !== 0) {
        await updateTransaction(client, metadata.meta, tasks, transaction._id)
      }
      return res.status(200).json(SafeTransaction(transaction, tasks));
    }

    await handleUpdateSecret(client, metadata.meta, secret, transaction._id);
    return res.status(200).send(null);
  })

}

function isValidInput(id: unknown, hexcode: unknown, code: unknown): boolean {
  return it(id, hexcode, code).is(String()) && ObjectId.isValid(id as string);
}

async function incrementAttempts(client: Client, id: ObjectId) {
  await client.transaction.updateOne({ _id: id }, { $inc: { attemps: 1 } });
}

async function handleUpdateSecret(
  client: Client,
  metadata: string,
  newSecret: string,
  transactionId: ObjectId
) {

  const data = JSON.parse(metadata)

  await client.session(async (session) => {
    const updated = await updateUserSecret(client, session, data.email, newSecret);
    if (!updated) throw new Error("Couldn't update the user secret");

    const deleted = await deleteTransaction(client, session, transactionId);
    if (!deleted) throw new Error("Couldn't delete the transaction");
  });
}
