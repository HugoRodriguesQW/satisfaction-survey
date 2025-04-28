import { TransactionSchema, type Client } from "./database.d";
import bcrypt from "bcrypt";
import { SafeObject, Utf8ToHex } from "../utils";
import { HextToObj, ObjToHex } from "./utils";
import type { ClientSession, ObjectId } from "mongodb";
import { encrypt, Hash, randomBytes } from "./crypto";
import crypto from "crypto";
import type { Transaction } from "../transactions";

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

  const tasks: TransactionSchema["tasks"] = [
    {
      done: false,
      meta: user?.password_hash ?? bcrypt.hashSync(randomBytes(32), 10),
      name: "login_validation",
    },
  ];

  const transaction = await client.transaction.insertOne({
    type: "login",
    user_hash: user_hash.valueOf(),
    meta: encrypt({ email }, new Hash(email).withSecret()),
    attemps: 0,
    expires,
    tasks,
  });

  if (!transaction.insertedId) return false;
  const safe: Transaction = {
    id: ObjToHex(transaction.insertedId),
    tasks: tasks.map((task) => SafeObject(task, { name: 1, done: 1 })),
  };
  return safe;
}

export async function createRegisterTransaction(client: Client, email: string, secret: string, name: string) {
  const user_hash = new Hash(email);

  const openedCount = await client.transaction.countDocuments({ user_hash });
  if (openedCount > 15) return false;

  const email_code = String(crypto.randomInt(1010, 9989));
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  const tasks: TransactionSchema["tasks"] = [
    {
      meta: bcrypt.hashSync(email_code, 10),
      name: "register_email_check",
      done: false,
    },
  ];

  const transaction = await client.transaction.insertOne({
    type: "register",
    user_hash: user_hash.valueOf(),
    meta: encrypt({ email, secret, name }, new Hash(email_code).withSecret()),
    attemps: 0,
    expires,
    tasks,
  });

  console.info({
    email_code,
    email,
    encrypted: Utf8ToHex(email_code),
  });

  //TODO: Send and Email

  if (!transaction.insertedId) return false;
  const safe: Transaction = {
    id: ObjToHex(transaction.insertedId),
    tasks: tasks.map((task) => SafeObject(task, { name: 1, done: 1 })),
  };
  return safe;
}

export async function createRecoveryTransaction(client: Client, email: string) {
  const user_hash = new Hash(email);

  const openedCount = await client.transaction.countDocuments({
    user_hash,
  });

  if (openedCount > 5) return false;

  const email_key = randomBytes(32);
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  const tasks: TransactionSchema["tasks"] = [
    {
      meta: bcrypt.hashSync(email_key, 10),
      name: "recovery_email_check",
      done: false,
    },
  ];

  const transaction = await client.transaction.insertOne({
    type: "recovery",
    user_hash: user_hash.valueOf(),
    meta: encrypt({ email }, new Hash(email_key).withSecret()),
    attemps: 0,
    expires,
    tasks,
  });

  const userExists = !!(await client.user.countDocuments({ user_hash: user_hash.valueOf() }));

  if (userExists) {
    console.info({
      transactionId: transaction.insertedId,
      email_key,
      email,
      encrypted: encrypt(email_key, new Hash().withSecret()),
    });

    //TODO: Send and Email
  }

  if (!transaction.insertedId) return false;
  const safe: Transaction = {
    id: ObjToHex(transaction.insertedId),
    tasks: tasks.map((task) => SafeObject(task, { name: 1, done: 1 })),
  };
  return safe;
}

export async function deleteTransaction(client: Client, session: ClientSession | null, transactionId: ObjectId) {
  const deleted = await client.transaction.deleteOne({ _id: transactionId }, { session: session ?? undefined });
  if (deleted.deletedCount) return deleted;
  return false;
}
