import { Story } from "../models/story.model";
import { IStory } from "../types/story";

// create new story
export function create(data: IStory) {
   const newStory = new Story(data);
   return newStory.save();
}

// get list of stories based on filter
export async function get(filter: Partial<IStory>, start: number, limit: number, orderBy: string) {
   const order = orderBy === "dsc" ? -1 : 1;
   const stories = await Story.find(filter).skip(start).limit(limit).sort({ updatedAt: order });
   return stories;
}

// get a single story by storyId
export function getById(id: string) {
   return Story.findById(id);
}

// delete a single story by storyId
export function deleteById(id: string) {
   return Story.findByIdAndDelete(id);
}

// update a story
export async function update(id: string, data: Partial<IStory>) {
   data.updatedAt = Date.now() as unknown as Date;
   const updatedStory = await Story.findOneAndUpdate({ _id: id }, data, { new: true });
   return updatedStory;
}

// count number of stories
export async function count(filter: Partial<IStory>) {
   return await Story.countDocuments(filter);
}
