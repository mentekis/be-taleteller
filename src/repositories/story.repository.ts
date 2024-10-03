import { Story } from "../models/story.model";
import { IStory } from "../types/story";

// create new story
export function create(data: IStory) {
   const newStory = new Story(data);
   return newStory.save();
}

// get list of stories based on filter
export function get(filter: Partial<IStory>) {
   return Story.find(filter);
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
export function update(id: string, data: Partial<IStory>) {
   return Story.findOneAndUpdate({ _id: id }, { data }, { new: true });
}
