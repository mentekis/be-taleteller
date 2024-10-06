import { User } from "../models/user.model";
import { IUser } from "../types/user";

// create user
export async function create(data: IUser) {
   const newUser = new User(data);
   return await newUser.save();
}

// get users
export async function get(filter: Partial<IUser>) {
   const user = await User.find(filter);
   return user;
}

// get one user
export async function getOne(filter: Partial<IUser>) {
   const user = await User.findOne(filter);
   return user;
}

// update user
export async function update(id: string, data: Partial<IUser>) {
   const updatedUser = await User.findOneAndUpdate({ _id: id }, data, { new: true });
   return updatedUser;
}

// delete user
export async function deleteUser(id: string) {
   const deletedUser = await User.findByIdAndDelete(id);
   return deletedUser;
}
