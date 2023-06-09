import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes"
import tweetRoutes from "./routes/tweetRoutes"
import authRoutes from "./routes/authRoutes"
import { authenticateToken } from "./middlewares/authMiddleware";


const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("Twitter APIS");
});

app.use("/user",authenticateToken,userRoutes)
app.use("/tweet",authenticateToken,tweetRoutes)
app.use("/auth",authRoutes)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server listening on:", PORT);
});
