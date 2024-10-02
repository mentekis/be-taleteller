export interface IStageArguments {
   storyId: string;
   premise: string;
   currentStageNumber: number;
   currentStorySummary: string;
   userChoice: string;
   maxStage: number;
}

export interface IStage {
   storyId: string;
   stageNumber: number;
   stageTitle: string;
   stageStory: string;
   optionA: string;
   optionB: string;
   place: string;
   isEnd: boolean;
   storySummary: string;
   bgm: string;
}
