import { UserSchema, type Client } from "./database.d";
import bcrypt from "bcrypt";
import { ClientSession, ObjectId, WithId } from "mongodb";
import { encrypt, Hash } from "./crypto";
import crypto from "crypto";
import { deleteTransaction } from "./transactions";

export async function createUser(
  client: Client,
  session: ClientSession,
  email: string,
  password: string,
  user_private: UserSchema["private"],
  user_public: UserSchema["public"]
) {
  const user_hash = new Hash(email);

  const result = await client.user.insertOne(
    {
      user_hash: user_hash.valueOf(),
      password_hash: bcrypt.hashSync(password, 10),
      private: encrypt(user_private, user_hash.withSecret()),
      public: user_public,
    },
    { session }
  );

  if (result.acknowledged && result.insertedId) {
    return result;
  }
  return false;
}

export async function updateUserSecret(client: Client, session: ClientSession, email: string, newSecret: string) {
  const user_hash = new Hash(email);

  const update = await client.user.updateOne(
    { user_hash: user_hash.valueOf() },
    {
      $set: {
        password_hash: bcrypt.hashSync(newSecret, 10),
      },
    },
    { session }
  );

  if (update.acknowledged && update.modifiedCount) {
    return update;
  }

  return false;
}

export async function userExists(client: Client, email: string) {
  return !!(await client.user.countDocuments({ user_hash: new Hash(email).valueOf() }));
}

export async function validateAccessToken(client: Client, token: string) {
  const access = await client.auth
    .aggregate<WithId<UserSchema>>([
      { $match: { token } },
      {
        $lookup: {
          from: "user",
          localField: "user_hash",
          foreignField: "user_hash",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      { $replaceRoot: { newRoot: "$userData" } },
    ])
    .next();

  if (!access) {
    return false;
  }

  return access;
}

export async function createAccessToken(client: Client, email: string, transactionId: ObjectId, expires: Date) {
  const accessToken = crypto.randomBytes(32).toString("hex");
  await client.session(async (session) => {
    const auth = await client.auth.insertOne(
      {
        token: accessToken,
        expires,
        user_hash: new Hash(email).valueOf(),
      },
      { session }
    );

    if (!auth.insertedId) throw new Error("Couldn't create auth object");

    const deleted = await deleteTransaction(client, session, transactionId);
    if (!deleted) throw new Error("Couldn't delete transaction object");
  });

  return accessToken;
}

export async function deleteAccessToken(client: Client, token: string) {
  const deleted = await client.auth.deleteOne({ token });
  return !!deleted.deletedCount;
}
