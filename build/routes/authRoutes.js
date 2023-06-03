"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// email token expiration
const EMAIL_TOKEN_EXPIRATION_TIME = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "SUPER SECRET";
// generate a random 8 digit number as the email token
function generateEmailToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // create user ,if it doesn't exist
    // generate the emailToken and it to email
    const { email } = req.body;
    //   generate token
    const emailToken = generateEmailToken();
    // generate a date for next 10 minutes
    const expiration = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_TIME * 60 * 1000);
    console.log(emailToken);
    try {
        const createdToken = yield prisma.token.create({
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
        res.status(200).json({ emailToken: createdToken });
    }
    catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ error: "Could'nt start the authentication process" });
    }
}));
function generateAuthToken(tokenId) {
    const jwtPayload = { tokenId, JWT_SECRET };
    return jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
        noTimestamp: false,
        algorithm: "HS256",
    });
}
router.post("/authenticate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // validate the emailToken
    var _a;
    const { email, emailToken } = req.body;
    const dbEmailToken = yield prisma.token.findUnique({
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
    if (((_a = dbEmailToken === null || dbEmailToken === void 0 ? void 0 : dbEmailToken.user) === null || _a === void 0 ? void 0 : _a.email) !== email) {
        return res.sendStatus(401);
    }
    const expiration = new Date(Date.now() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000);
    const apiToken = yield prisma.token.create({
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
    yield prisma.token.update({
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
}));
exports.default = router;
