import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";

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

      res.status(200).json({
         message: "user logged in",
         data: data.user,
         accessToken: data.accessToken,
         refreshToken: data.refreshToken,
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
      res.status(200).json({
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
      accessToken: res.locals.accessToken,
   });
}

export async function handleGetUser(req: Request, res: Response) {
   try {
      const userId = req.params.userId;
      const user = await userService.getById(userId);

      if (user) {
         delete user.password;
         res.status(200).json({
            message: "user found",
            data: { _id: user._id, name: user.name, email: user.email },
         });
      } else {
         res.status(404).json({
            message: "user not found",
         });
      }
   } catch (error) {
      if (error instanceof Error) {
         res.status(404).json({
            message: "user not found",
            data: { ...error },
         });
      }
   }
}
