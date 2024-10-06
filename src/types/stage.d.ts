import { ObjectId } from "mongoose";

export interface IStageArguments {
   storyId: string;
   stageNumber: number;
   userChoice: string;
}

export interface IStage {
   _id?: string | ObjectId;
   storyId: string | ObjectId;
   stageNumber: number;
   stageStory: string;
   optionA: string;
   optionB: string;
   place: string;
   isEnd: boolean;
   bgm: string;
}
