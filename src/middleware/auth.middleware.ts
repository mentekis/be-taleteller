import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
      const authData = await authService.authorize(req.cookies);

      if (authData.accessToken) {
         const domainRegex = /^(?:https?:\/\/)?([^/]+?)(?::\d+)?$/;
         const domain = domainRegex.exec(req.headers.origin as string)?.[1];

         res.cookie("accessToken", authData.accessToken, {
            maxAge: 999999999999,
            domain,
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
