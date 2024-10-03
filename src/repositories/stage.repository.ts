import { Stage } from "../models/stage.model";
import { IStage } from "../types/stage";

// create stage and save to db
export async function create(data: Omit<IStage, "optionA" | "optionB">) {
   const newStage = new Stage(data);
   return await newStage.save();
}

// get stages based on filter
export async function get(filter: { storyId?: string; _id?: string; stageNumber?: number }) {
   return await Stage.find(filter);
}

// update stage place-url
export async function update(data: { _id: string; place: string }) {
   const updatedStage = await Stage.findOneAndUpdate({ _id: data._id }, { place: data.place }, { new: true });
   return updatedStage;
}

// delete all stages by storyId
export async function deleteByStoryId(storyId: string) {
   const deletedData = await Stage.deleteMany({ storyId });
   return deletedData;
}
