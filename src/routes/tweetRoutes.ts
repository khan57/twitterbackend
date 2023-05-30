import {Router,Request,Response} from "express"

const router = Router();

// user Endpoints

router.post("/", (req: Request, res: Response) => {
    return res.status(501).send({ error: "Not implemented" });
  });
  
  router.get("/", (req: Request, res: Response) => {
    return res.status(501).send({ error: "Not implemented" });
  });
  
  router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    return res.status(501).send({ error: "Not implemented" });
  });
  
  router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    return res.status(501).send({ error: "Not implemented" });
  });
  
  router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    return res.status(501).send({ error: "Not implemented" });
  });

export default router