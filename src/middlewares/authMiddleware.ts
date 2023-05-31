import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const JWT_SECRET = "supersecret";

type AuthRequest = Request & { user?: User };
export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader?.split(" ")[1];


  if (!jwtToken) {
    return res.sendStatus(401);
  }

  try {
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {
      tokenId: number;
    };

    if (!payload?.tokenId) {
      return res.sendStatus(401);
    }
    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: {
        user: true,
      },
    });

    if (!dbToken?.valid) {
      return res.status(401).json({ error: "API token not valid" });
    }

    req.user = dbToken.user;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}
