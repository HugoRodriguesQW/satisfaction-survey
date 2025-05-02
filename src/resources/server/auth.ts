import { NextApiRequest, NextApiResponse } from "next";
import { it } from "../utils";
import { newClient } from "./database";
import { validateAccessToken } from "./user";
import { AuthSchema, Client } from "./database.d";

type ExtNextApiRequest = NextApiRequest & { client: Client; access: AuthSchema };

export function authMiddleware(handler: (req: ExtNextApiRequest, res: NextApiResponse) => unknown) {
  return async function middleware(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.cookies;

    if (!validateInput(token)) {
      return res.status(400).send(null);
    }

    const client = await newClient();
    const access = await validateAccessToken(client, token as string);

    if (!access) return res.status(403).send(null);

    console.info("Authenticated:", access.payload);
    return handler(Object.assign(req, { client, access }), res);
  };
}

function validateInput(token: unknown) {
  return it(token).is(String());
}
