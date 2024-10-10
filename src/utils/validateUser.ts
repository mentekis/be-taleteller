import { z } from "zod";
import { IUser } from "../types/user";

const userSchema = z.object({
   name: z.string().min(3, "Name must be at least 3 characters"),
   email: z.string().email("Invalid email"),
   password: z.string().min(8, "Password must be at least 8 characters"),
   passwordConfirmation: z.string(),
});

export function validateUser(data: IUser) {
   const validatedUser = userSchema.safeParse(data);
   if (!validatedUser.success) {
      throw new Error(`${validatedUser.error.issues[0].path}: ${validatedUser.error.issues[0].message}`);
   }
   return validatedUser.data;
}
