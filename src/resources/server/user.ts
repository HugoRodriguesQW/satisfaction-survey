import { AuthSchema, UserSchema, type Client } from "./database.d";
import bcrypt from "bcrypt";
import { ClientSession, ObjectId } from "mongodb";
import { decrypt, decryptSafe, encrypt, Hash } from "./crypto";
import crypto from "crypto";
import { deleteTransaction } from "./transactions";
import { SafeObject } from "../utils";

export async function readUserData(client: Client, access: AuthSchema) {
  const user_hash = new Hash(access.payload);
  const user = await client.user.findOne({ user_hash: user_hash.valueOf() });

  if (!user) return false;

  const privateData = decrypt(user.private, user_hash.withSecret());

  if (!privateData) {
    return false;
  }

  return {
    ...user,
    private: privateData,
  } as UserSchema;
}

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

export async function validateAccessToken(client: Client, flatToken: string) {
  try {
    const token: AccessToken = decryptSafe(flatToken, new Hash().withSecret());

    const access = await client.auth.findOne({ token: token.part1 });

    if (!access) throw access;

    access.payload = decryptSafe(access.payload, new Hash(token.part2).withSecret());
    return access;
  } catch {
    return false;
  }
}

export type AccessToken = {
  part1: string;
  part2: string;
};

export async function createAccessToken(client: Client, meta: string, transactionId: ObjectId, expires: Date) {

  const data = JSON.parse(meta)


  const part1 = crypto.randomBytes(32).toString("hex");
  const part2 = crypto.randomBytes(32).toString("hex");

  await client.session(async (session) => {
    const auth = await client.auth.insertOne(
      {
        token: part1,
        expires,
        payload: encrypt(data.email, new Hash(part2).withSecret()),
      },
      { session }
    );

    if (!auth.insertedId) throw new Error("Couldn't create auth object");

    const deleted = await deleteTransaction(client, session, transactionId);
    if (!deleted) throw new Error("Couldn't delete transaction object");
  });

  return encrypt(
    {
      part1,
      part2,
    },
    new Hash().withSecret()
  );
}

export async function deleteAccessToken(client: Client, token: string) {
  return await client.auth.deleteOne({ token });
}

export type SafeData = {
  private: UserSchema["private"];
  public: UserSchema["public"];
};

export function SafeUserData(user: UserSchema): SafeData {
  return SafeObject(user, { private: 1, public: 1 });
}
