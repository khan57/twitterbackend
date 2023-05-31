import { Router, Request, Response } from "express";
import {PrismaClient} from "@prisma/client"
const router = Router();
const prisma = new PrismaClient() 


// email token expiration 

const EMAIL_TOKEN_EXPIRATION_TIME=10;
// generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
router.post("/login", async (req: Request, res: Response) => {
  // create user ,if it doesn't exist
  // generate the emailToken and it to email

  const { email } = req.body;

//   generate token 
const emailToken = generateEmailToken()
// generate a date for next 10 minutes 
const expiration = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000)

console.log(emailToken);

const createdToken = await prisma.token.create({
    data:{
        type:"EMAIL",
        emailToken,
        expiration,
        user:{
            connectOrCreate:{
                where:{
                    email
                },
                create:{email}
            }
        }
    }
})

});

router.post("/authenticate", async (req: Request, res: Response) => {
  // validate the emailToken
  // Generate a JWT token
});
export default router;
