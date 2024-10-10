import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
      const authData = await authService.authorize(req.cookies);

      const domainRegex = /^(?:https?:\/\/)?([^/]+?)(?::\d+)?$/;
      const domainMatch = domainRegex.exec(req.headers.origin as string);

      if (!domainMatch) {
         throw new Error("Invalid origin header");
      }

      const domain = domainMatch[1];

      if (authData.accessToken) {
         res.locals.accessToken = authData.accessToken;
         res.cookie("accessToken", authData.accessToken, {
            maxAge: 999999999999,
            domain,
            sameSite: "lax",
         });
      }

      res.locals.userId = authData.userId;
      next();
   } catch (error) {
      if (error instanceof Error) {
         res.status(401).json({
            message: "unauthorized",
         });
      }
   }
}
