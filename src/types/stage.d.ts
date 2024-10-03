export interface IStageArguments {
   storyId: string;
   premise: string;
   currentStageNumber: number;
   currentStoryContext: string;
   userChoice: string;
   maxStage: number;
}

export interface IStage {
   storyId: string;
   stageNumber: number;
   stageStory: string;
   optionA: string;
   optionB: string;
   place: string;
   isEnd: boolean;
   storyContext: string;
   bgm: string;
}
