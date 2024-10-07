import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { ZodError } from "zod";

export async function handleRegister(req: Request, res: Response) {
   try {
      const user = await authService.register(req.body);
      res.status(201).json({
         message: "user created",
         data: user,
      });
   } catch (error) {
      if (error instanceof ZodError) {
         res.status(400).json({
            message: "user creation failed",
            data: error.issues[0].path + " " + error.issues[0].message,
         });
      } else if (error instanceof Error) {
         res.status(400).json({
            message: "user creation failed",
            data: error.message,
         });
      }
   }
}

export async function handleLogin(req: Request, res: Response) {
   try {
      const { email, password } = req.body;
      const data = await authService.login({ email, password });
      res.status(200)
         .cookie("accessToken", data.accessToken)
         .cookie("refreshToken", data.refreshToken, { httpOnly: true })
         .json({
            message: "user logged in",
            data: data.user,
         });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "user login failed",
            data: error.message,
         });
      }
   }
}

export async function handleLogout(req: Request, res: Response) {
   try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
         message: "logout successful",
      });
   } catch (error) {
      if (error instanceof Error) {
         res.status(400).json({
            message: "logout failed",
            data: error.message,
         });
      }
   }
}
