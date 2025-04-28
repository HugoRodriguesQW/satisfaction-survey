import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { token } = req.cookies;

  console.info({ token, id });

  if (!token) {
    return res.status(403).send(null);
  }

  return res.status(200).send(null);
}
