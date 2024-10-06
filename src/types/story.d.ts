export interface IStory {
   _id?: string | ObjectId;
   userId: string | ObjectId;
   title: string | RegExp;
   description: string;
   premise: string;
   thumbnail: string;
   isFinish: boolean;
   maxStage: NonNullable<number>;
   context: string;
   createdAt?: Date;
   updatedAt?: Date;
}
