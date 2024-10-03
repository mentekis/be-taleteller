import { Stage } from "../models/stage.model";
import { IStage } from "../types/stage";

// create stage
export async function create(data: Omit<IStage, "optionA" | "optionB">) {
   const newStage = new Stage(data);
   return await newStage.save();
}

// get stages based on filter
export async function get(filter: Partial<IStage>) {
   return await Stage.find(filter);
}

// get a single stage by stageId
export async function getById(id: string) {
   return await Stage.findById(id);
}

// delete all stages by storyId
export async function deleteByStoryId(storyId: string) {
   const deletedData = await Stage.deleteMany({ storyId });
   return deletedData;
}

// update a stage
export async function update(id: string, data: Partial<IStage>) {
   const updatedStage = await Stage.findOneAndUpdate({ _id: id }, { data }, { new: true });
   return updatedStage;
}
