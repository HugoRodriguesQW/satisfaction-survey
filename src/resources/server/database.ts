import { ClientSession, MongoClient, ServerApiVersion } from "mongodb";
import {
  AuthSchema,
  Client,
  DataSchema,
  EncrypedUserSchema,
  SurveySchema,
  TransactionSchema,
} from "./database.d";

let cachedClient: MongoClient | null = null;

export async function newClient(): Promise<Client> {
  // Client: create and cache
  let reconnecting = false;

  if (!cachedClient) {
    reconnecting = true;
    console.info("> Opening a new MongoClient");
    cachedClient = new MongoClient(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrlyp5q.mongodb.net/?appName=Cluster0`,
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      }
    );
  }

  // Client: connect
  const connection = cachedClient.connect();

  connection
    .then(async () => {
      console.info("> MongoClient Connected.");
    })
    .catch(() => {
      cachedClient = null;
    });

  await Promise.resolve(connection);

  const db = cachedClient.db(process.env.DB_NAME);

  // Client:  structure the collections
  const client = {
    user: db.collection<EncrypedUserSchema>("user"),
    survey: db.collection<SurveySchema>("survey"),
    data: db.collection<DataSchema>("data"),
    auth: db.collection<AuthSchema>("auth"),
    transaction: db.collection<TransactionSchema>("transaction"),
    session: async (callback: (session: ClientSession) => Promise<void>) => {
      if (!cachedClient) {
        throw new Error("missing MongoClient instance");
      }
      const session = cachedClient.startSession();
      await Promise.resolve(
        session.withTransaction(
          async () => {
            return callback(session);
          },
          {
            readConcern: { level: "local" },
            writeConcern: { w: "majority" },
            readPreference: "primary",
          }
        )
      );
    },
  };

  if (reconnecting) {
    // Client: check database strucutre frame;
    console.info("> MongoClient: Creating standard Indexes.");
    await client.user.createIndex({ user_hash: 1 }, { unique: true });
    await client.data.createIndex({ member_ref: 1, survey_ref: 1 }, { unique: true });
    await client.auth.createIndex({ token: 1 }, { unique: true });
    await client.auth.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    await client.transaction.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });
    console.info("> MongoClient: Done.");
  }
  return client;
}
