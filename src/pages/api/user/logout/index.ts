import { newClient } from "@/resources/server/database";
import { deleteAccessToken } from "@/resources/server/user";
import { setCookie } from "@/resources/server/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies["token"];

  if (token) {
    const client = await newClient();

    const deleted = await deleteAccessToken(client, token);

    if (deleted) {
      setCookie(
        res,
        { token: undefined },
        {
          "Max-Age": -1,
          SameSite: "Strict",
          Secure: false, // TODO: Change this in production
        }
      );

      res.status(200).send(null);
    }

    res.status(500).send(null);
  }

  return res.status(200).send(null);
}
