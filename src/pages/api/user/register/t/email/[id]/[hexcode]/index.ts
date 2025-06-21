import { newClient } from "@/resources/server/database";
import { SafeTransaction } from "@/resources/server/transactions";
import { searchTransactionBy, updateTransaction } from "@/resources/server/transactions";
import { HexToUtf8, it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "@/resources/server/user";
import { Client } from "@/resources/server/database.d";
import { Compound, Task } from "@/resources/server/tasks";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, hexcode } = req.query;

  if (!isValidInput(id, hexcode)) return res.status(400).send("invalid input");

  const code = HexToUtf8(hexcode as string);
  const client = await newClient();
  const transaction = await searchTransactionBy(client, id as string);

  if (!transaction || transaction.attemps >= 5) return res.status(400).send(null);

  const tasks = Compound.TaskStack(transaction.tasks.map(Task.from))
    .attachRaw(transaction.meta)

  await tasks.getTask("register_email_check", async (emailTask) => {
    if (!emailTask) {
      return res.status(400).send(null)
    }

    const metadata = tasks.unmount(code);

    if (!(await emailTask.test(code)) || !metadata) {
      await incrementAttempts(client, transaction._id);
      return res.status(400).send(null);
    }

    if (!tasks.done()) {
      if (metadata.layer !== 0) {
        await updateTransaction(client, metadata.meta, tasks, transaction._id)
      }
      return res.status(200).json(SafeTransaction(transaction, tasks));
    }

    await handleUserCreation(client, metadata.meta, transaction._id);
    return res.status(200).send(null);
  })
}

function isValidInput(id: unknown, hexcode: unknown): boolean {
  return it(id, hexcode).is(String()) && ObjectId.isValid(id as string);
}

async function incrementAttempts(client: Client, id: ObjectId) {
  await client.transaction.updateOne({ _id: id }, { $inc: { attemps: 1 } });
}

async function handleUserCreation(client: Client, metadata: string, id: ObjectId) {
  const data = JSON.parse(metadata)

  await client.session(async (session) => {
    const user = await createUser(
      client,
      session,
      data.email,
      data.secret,
      {
        name: data.name,
        team: [],
        keys: {},
      },
      { team: [] }
    );

    if (!user || !user?.insertedId) throw new Error("Couldn't create the user object");

    const deleted = await client.transaction.deleteOne({ _id: id }, { session });
    if (!deleted.deletedCount) throw new Error("Couldn't delete the transaction");
  });
}
