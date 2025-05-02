import { authMiddleware } from "@/resources/server/auth";
import { readUserData, SafeUserData } from "@/resources/server/user";

const handler = authMiddleware(async (req, res) => {
  const client = req.client;
  const user = await readUserData(client, req.access);

  if (!user) return res.status(400).send(null);

  res.status(200).json(SafeUserData(user));
});

export default handler;
