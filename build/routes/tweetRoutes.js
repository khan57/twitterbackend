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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// tweet Endpoints
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, userId } = req.body;
        // @ts-ignore
        const user = req.user;
        const result = yield prisma.tweet.create({
            data: {
                content,
                userId: user.id,
            },
            include: { user: true }
        });
        return res.status(200).send(result);
    }
    catch (error) {
        return res
            .status(400)
            .json({ error: "Username and email should be unique" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTweets = yield prisma.tweet.findMany({
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
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tweet = yield prisma.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true },
    });
    if (!tweet) {
        return res.status(404).json({ error: "Tweet not found" });
    }
    return res.json(tweet);
}));
router.put("/:id", (req, res) => {
    const { id } = req.params;
    return res.status(501).send({ error: "Not implemented" });
});
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.tweet.delete({ where: { id: Number(id) } });
    return res.sendStatus(200);
}));
exports.default = router;
