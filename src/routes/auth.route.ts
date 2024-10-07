import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/api/v1/auth/register", authController.handleRegister);

authRouter.post("/api/v1/auth/login", authController.handleLogin);

authRouter.post("/api/v1/auth/logout", authMiddleware, authController.handleLogout);

authRouter.post("/api/v1/auth/", authMiddleware, authController.handleAuthorize);
