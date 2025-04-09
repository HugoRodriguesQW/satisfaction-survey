import { AuthRules, UserSchema, type Client } from "./database.d";
import bcrypt from "bcrypt";
import { randomSalt } from "./utils";
import { WithId } from "mongodb";

export async function createUser(
  client: Client,
  user: Omit<UserSchema, "hash">,
  secret: string
) {
  const result = await client.user.insertOne({
    ...user,
    hash: bcrypt.hashSync(secret, randomSalt()),
  });
  if (result.acknowledged && result.insertedId) {
    return result;
  }
  return false;
}

export async function authenticateUser(client: Client, userId: string, secret: string) {
  const user = await client.user.findOne({
    userId: userId,
  });

  if (!user) return false;
  if (!bcrypt.compareSync(secret, user.hash)) return false;
  return user;
}

export async function validateAccessToken(client: Client, token: string) {
  const access = await client.auth
    .aggregate<WithId<UserSchema>>([
      { $match: { token } },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "userId",
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

export async function createAccessToken(
  client: Client,
  userId: string,
  secret: string,
  expires: Date
) {
  const token = bcrypt.hashSync(userId + secret, randomSalt());

  const access = await client.auth.insertOne({
    expires,
    userId,
    token,
  });

  if (access.acknowledged && access.insertedId) {
    return token;
  }

  return false;
}

export function can(
  user: UserSchema | WithId<UserSchema> | false | null | undefined,
  ...rules: AuthRules[]
) {
  if (!user) return false;
  return rules.every((r) => user.rules.includes(r));
}
