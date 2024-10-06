import { z } from "zod";
import { IUser } from "../types/user";

const userSchema = z.object({
   email: z.string().email("Email must be valid"),
   password: z.string().min(8, "Password must be at least 8 characters long"),
   passwordConfirmation: z.string().min(8, "Passwords don't match"),
   name: z.string().min(5, "Name must be at least 5 characters long"),
});

export function validateUser(data: IUser) {
   userSchema.parse(data);
   return data;
}
