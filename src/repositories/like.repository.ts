import { ILike } from "../types/like";
import { Like } from "../models/like.model";

// create a liked story
export async function create(data: ILike) {
   const newLike = new Like(data);
   return await newLike.save();
}

// get list of likes based on filter
export async function get(filter: Partial<ILike>, start: number, limit: number) {
   return await Like.find(filter).skip(start).limit(limit);
}

// delete a single like by filter
export async function deleteOneLike(filter: Partial<ILike>) {
   return await Like.deleteOne(filter);
}

// delete many likes by filter
export async function deleteManyLikes(filter: Partial<ILike>) {
   return await Like.deleteMany(filter);
}

// count number of likes
export async function count(filter: Partial<ILike>) {
   return await Like.countDocuments(filter);
}
