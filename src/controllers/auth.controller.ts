import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function handleRegister(req: Request, res: Response) {
   try {
      const user = await authService.register(req.body);
      res.status(201).json({
         message: "user created",
         data: user,
      });
   } catch (error) {
      if (error instanceof Error) {
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
      const domainRegex = /^(?:https?:\/\/)?([^/]+?)(?::\d+)?$/;

      const domain = domainRegex.exec(req.headers.origin as string)?.[1];
      res.status(200)
         .cookie("accessToken", data.accessToken, { maxAge: 999999999999, domain })
         .cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            maxAge: 999999999999,
            domain,
         })
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

export async function handleAuthorize(req: Request, res: Response) {
   res.status(200).json({
      message: "authorized",
   });
}
