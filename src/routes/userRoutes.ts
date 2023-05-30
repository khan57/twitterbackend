import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();
// user Endpoints

router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, name, username } = req.body;
    const result = await prisma.user.create({
      data: {
        email,
        username,
        name,
        bio: "Hello i am a full stack developer",
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
  const allUsers = await prisma.user.findMany();
  return res.send({ data: allUsers });
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  return res.send({ data: user });
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;
  try {
    const result = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        bio,
        name,
        image,
      },
    });

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: "Failed to update the user" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.user.delete({ where: { id: Number(id) } });
  return res.status(200).send({ msg:"user deleted successfully" });
});

export default router;
