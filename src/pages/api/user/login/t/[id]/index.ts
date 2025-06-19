import { newClient } from "@/resources/server/database";
import { SafeTransaction, updateTransaction } from "@/resources/server/transactions";
import { searchTransactionBy } from "@/resources/server/transactions";

import { it } from "@/resources/utils";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@/resources/server/database.d";
import { createAccessToken } from "@/resources/server/user";
import { setCookie } from "@/resources/server/utils";
import { Compound, Task } from "@/resources/server/tasks";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { secret, email } = req.body;

  console.info({ login: { email, secret } })
  if (!validateInput(id, secret, email)) return res.status(400).send("invalid input");

  const client = await newClient();
  const transaction = await searchTransactionBy(client, id as string);
  console.info(transaction)

  if (!transaction || transaction.attemps >= 10) return res.status(400).send(null);

  const tasks = Compound.TaskStack(transaction.tasks.map(Task.from)).attachRaw(transaction.meta)

  await tasks.getTask("login_validation", async (loginTask) => {
    if (!loginTask) {
      return res.status(400).send(null)
    }

    const metadata = tasks.unmount(email)

    console.info({ metadata })
    if (!(await loginTask.test(secret)) || !metadata) {
      console.info("login atttemp:", await loginTask.test(secret))
      await incrementAttempt(client, transaction._id);
      return res.status(400).send(null);
    }

    if (!tasks.done()) {
      if (metadata.layer !== 0) {
        await updateTransaction(client, metadata.meta, tasks, transaction._id)
      }
      return res.status(200).json(SafeTransaction(transaction, tasks));
    }

    const token = await createAccessToken(
      client,
      metadata.meta,
      transaction._id,
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

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
  })
}

function validateInput(id: unknown, secret: unknown, email: unknown): boolean {
  return it(id, secret, email).is(String()) && ObjectId.isValid(id as string);
}


async function incrementAttempt(client: Client, id: ObjectId) {
  await client.transaction.updateOne({ _id: id }, { $inc: { attemps: 1 } });
}
