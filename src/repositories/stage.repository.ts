import { Stage } from "../models/stage.model";
import { IStage } from "../types/stage";

// create stage
export async function create(data: IStage) {
   const newStage = await new Stage(data).save() as unknown as IStage ;
   return newStage;
}

// get stages based on filter
export async function get(filter: Partial<IStage>) {
    const stages = await Stage.find(filter) as IStage[]
    return stages
}

// get a single stage
export async function getSingle(filter: Partial<IStage>) {
   return await Stage.findOne(filter).populate("storyId");
}

// delete stages
export async function deleteByStoryId(filter: Partial<IStage>) {
   const deletedData = await Stage.deleteMany(filter);
   return deletedData;
}

// delete a stage
export async function deleteOne(_id: string) {
   const deletedData = await Stage.findByIdAndDelete(_id);
   return deletedData;
}

// update a stage
export async function update(id: string, data: Partial<IStage>) {
   const updatedStage = await Stage.findOneAndUpdate({ _id: id }, data, { new: true });
   return updatedStage;
}
