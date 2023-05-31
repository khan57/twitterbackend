import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// tweet Endpoints

router.post("/", async (req: Request, res: Response) => {
  try {
    const { content, userId } = req.body;
   
    // @ts-ignore
    const user = req.user

    const result = await prisma.tweet.create({
      data: {
        content,
        userId:user.id,
      },
    });

    return res.status(201).send(result);
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Username and email should be unique" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const allTweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });
  return res.json(allTweets);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: { user: true },
  });
  if (!tweet) {
    return res.status(404).json({ error: "Tweet not found" });
  }
  return res.json(tweet);
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  return res.status(501).send({ error: "Not implemented" });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.tweet.delete({ where: { id: Number(id) } });
  return res.sendStatus(200);
});

export default router;
