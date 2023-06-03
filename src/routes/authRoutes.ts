import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import { sendEmailToken } from "../services/emailService";
// email token expiration

const EMAIL_TOKEN_EXPIRATION_TIME = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";

// generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
router.post("/login", async (req: Request, res: Response) => {
  // create user ,if it doesn't exist
  // generate the emailToken and it to email

  const { email } = req.body;

  //   generate token
  const emailToken = generateEmailToken();
  // generate a date for next 10 minutes
  const expiration = new Date(
    Date.now() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000
  );

  console.log(emailToken);

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: { email },
          },
        },
      },
    });

    console.log(createdToken);
    // await sendEmailToken(email, emailToken);
    res.status(200).json({emailToken:createdToken});
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Could'nt start the authentication process" });
  }
});

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId, JWT_SECRET };
  return jwt.sign(jwtPayload, JWT_SECRET, {
    noTimestamp: false,
    algorithm: "HS256",
  });
}
router.post("/authenticate", async (req: Request, res: Response) => {
  // validate the emailToken

  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: "Token Expired" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  const expiration = new Date(
    Date.now() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  const apiToken = await prisma.token.create({
    data: {
      type: "API",
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });
  // invalidate email token here

  await prisma.token.update({
    where: {
      id: dbEmailToken.id,
    },
    data: {
      valid: false,
    },
  });

  // Generate a JWT token

  const authToken = generateAuthToken(apiToken.id);
  return res.json({ authToken });
});
export default router;
