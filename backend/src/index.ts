import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { prisma } from "./infrastructure/prisma/client";
import { authMiddleware } from "./middlewares/auth.middleware";
import { authRouter } from "./interfaces/http/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { sendSuccess } from "./utils/response";
import { requireAccessToken } from "./middlewares/accessToken.middelware";

import { BE_PORT } from "./env/variables";

const apiPort = BE_PORT || 4000;

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/auth", authRouter);

app.get('/protected', requireAccessToken, authMiddleware, (_, res) => {
    return sendSuccess(res, { message: 'You are authenticated' });
});

app.use(errorHandler);

app.listen(apiPort, () => {
  console.log(`API server running on: localhost:${apiPort}`);
});