import { ObjectId } from "mongoose";
import { Auth } from "../models/auth.model";

export async function create(data: { userId: string | ObjectId; refreshToken: string }) {
   const newAuth = await new Auth(data).save();
   return newAuth;
}

export async function getOne(filter: { userId?: string; refreshToken?: string }) {
   const auth = await Auth.findOne(filter);
   return auth;
}

export async function deleteToken(filter: { userId?: string; refreshToken?: string }) {
   const deletedAuth = await Auth.deleteMany(filter);
   return deletedAuth;
}
