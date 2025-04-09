import { MongoClient, ServerApiVersion } from "mongodb";
import { AuthSchema, Client, DataSchema, SurveySchema, UserSchema } from "./database.d";

let cachedClient: MongoClient | null = null;

export async function newClient(): Promise<Client> {
  // Client: create and cache
  if (!cachedClient) {
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

    // Client: connect
    const connection = cachedClient.connect();
    connection
      .then(() => console.info("DB: Connected."))
      .catch(() => {
        cachedClient = null;
      });

    await connection;
  }

  // Client:  structure the collections
  const client = {
    user: cachedClient.db(process.env.DB_NAME).collection<UserSchema>("user"),
    survey: cachedClient.db(process.env.DB_NAME).collection<SurveySchema>("survey"),
    data: cachedClient.db(process.env.DB_NAME).collection<DataSchema>("data"),
    auth: cachedClient.db(process.env.DB_NAME).collection<AuthSchema>("auth"),
  };

  // Client: check database strucutre frame;
  client.user.createIndex({ userId: 1 }, { unique: true });
  client.data.createIndex({ useRef: 1, surveyRef: 1 }, { unique: true });
  client.auth.createIndex({ token: 1 }, { unique: true });
  client.auth.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

  return client;
}
