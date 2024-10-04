export interface IStory {
   _id?: string;
   userId: string;
   title: string | RegExp;
   description: string;
   premise: string;
   thumbnail: string;
   isFinish: boolean;
   maxStage: number;
   createdAt?: Date;
   updatedAt?: Date;
}
