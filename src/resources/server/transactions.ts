import { TransactionSchema, type Client } from "./database.d";
import { HextToObj, ObjToHex } from "./utils";
import type { ClientSession, ObjectId, WithId } from "mongodb";
import { Hash } from "./crypto";
import type { Transaction } from "../transactions";
import { Compound, Task } from "./tasks";

export type UnsafeTransaction = Transaction & TransactionSchema;

export async function searchTransactionBy(client: Client, id: string) {
  const transaction = await client.transaction.findOne({ _id: HextToObj(id) });
  if (!transaction) return false;
  return transaction;
}



export async function createLoginTransaction(client: Client, email: string) {
  const user_hash = new Hash(email);

  const openedCount = await client.transaction.countDocuments({
    user_hash,
  });

  if (openedCount > 5) return false;

  const expires = new Date(Date.now() + 10 * 60 * 1000);

  // TODO: Check user 2FA rules to create transaction tasks
  const user = await client.user.findOne({ user_hash: user_hash.valueOf() });

  const tasks = Compound.TaskStack([
    Task.LoginValidation(email, user?.password_hash)
    //TODO: Add 2FA tasks here
  ])

  tasks.attach({ email })

  const transaction = await client.transaction.insertOne({
    type: "login",
    user_hash: user_hash.valueOf(),
    meta: tasks.mount(),
    attemps: 0,
    expires,
    tasks: tasks.map(Task.save),
  });


  console.info({transaction});
  transaction.acknowledged.valueOf();
  if (!transaction.insertedId) return false;


  const safe: Transaction = {
    id: ObjToHex(transaction.insertedId),
    tasks: tasks.map(Task.safeSave)
  };
  return safe;
}

export async function createRegisterTransaction(client: Client, email: string, secret: string, name: string) {
  const user_hash = new Hash(email);

  const openedCount = await client.transaction.countDocuments({ user_hash });
  if (openedCount > 15) return false;

  const tasks = Compound.TaskStack([
    Task.RegisterEmailCheck()
  ])

  tasks.attach({ email, secret, name })

  const transaction = await client.transaction.insertOne({
    type: "register",
    user_hash: user_hash.valueOf(),
    meta: tasks.mount(),
    attemps: 0,
    expires: new Date(Date.now() + 10 * 60 * 1000),
    tasks: tasks.map(Task.save)
  });

  if (!transaction.insertedId) return false;

  //TODO: Send and Email
  tasks.getTask("register_email_check", (task) => {
    console.info({
      email_code: task?.revealSecret(),
      sended: task?.revealSecret(),
      email
    });
  })

  const safe: Transaction = {
    id: ObjToHex(transaction.insertedId),
    tasks: tasks.map(Task.safeSave),
  };

  return safe;
}

export async function createRecoveryTransaction(client: Client, email: string) {
  const user_hash = new Hash(email);

  const openedCount = await client.transaction.countDocuments({
    user_hash,
  });

  if (openedCount > 5) return false;
  const expires = new Date(Date.now() + 10 * 60 * 1000);


  const tasks = Compound.TaskStack([
    Task.RecoveryEmailCheck(),
  ])

  tasks.attach({ email })

  const transaction = await client.transaction.insertOne({
    type: "recovery",
    user_hash: user_hash.valueOf(),
    meta: tasks.mount(),
    attemps: 0,
    expires,
    tasks: tasks.map(Task.save)
  });

  const userExists = !!(await client.user.countDocuments({ user_hash: user_hash.valueOf() }));

  if (userExists) {
    //TODO: Send and Email
    tasks.getTask("recovery_email_check", (task) => {
      console.info({
        transactionId: transaction.insertedId,
        email_key: task?.revealSecret(),
        sended: task?.revealSecret(),
        email
      });
    })
  }

  if (!transaction.insertedId) return false;

  const safe: Transaction = {
    id: ObjToHex(transaction.insertedId),
    tasks: tasks.map(Task.safeSave),
  };
  return safe;
}

export async function updateTransaction(client: Client, meta: string, tasks: Compound<Task>, id: ObjectId, session?: ClientSession) {
  await client.transaction.updateOne({ _id: id }, {
    $set: {
      meta,
      tasks: tasks.map(Task.save)
    },
  }, { session })
}


export async function deleteTransaction(client: Client, session: ClientSession | null, transactionId: ObjectId) {
  const deleted = await client.transaction.deleteOne({ _id: transactionId }, { session: session ?? undefined });
  if (deleted.deletedCount) return deleted;
  return false;
}


export function SafeTransaction(transaction: WithId<TransactionSchema>, tasks: Compound<Task>): Transaction {
  return {
    id: transaction._id.toHexString(),
    tasks: tasks.map(Task.safeSave),
  };
}
