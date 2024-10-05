// import { replicate } from "../utils/replicate";
import { openai } from "../utils/openai";
import * as stageRepository from "../repositories/stage.repository";
import * as storyRepository from "../repositories/story.repository";
import * as storyService from "../services/story.service";
import { IStage, IStageArguments, IStageShow } from "../types/stage";
import { IStory } from "../types/story";
import { getBgmTags, getBgmUrl } from "../utils/bgm";

// create stage in db
export async function create(data: IStageArguments) {
   const stageData = await generateStage(data);

   // stageData contains data that need to be showed in user display
   // use some of stageData propertiess to be saved in db asynchronously
   const { storyId, stageNumber, stageStory, place, bgm, isEnd } = stageData;

   stageRepository.create({
      storyId,
      stageNumber,
      stageStory,
      place,
      bgm,
      isEnd,
   });

   // return stageData to be served in user display
   return stageData;
}

// update stage
export async function update(stageId: string, data: Partial<IStage>) {
   const updatedStage = await stageRepository.update(stageId, data);
   return updatedStage;
}

// get stages by storyId
export async function getByStoryId(storyId: string) {
   const stages = await stageRepository.get({ storyId });
   return stages;
}

// generate image using replicate api & flux-schnell model
// async function generateImage(prompt: string) {
//    const model = "black-forest-labs/flux-schnell";

//    const input = {
//       prompt: `Child storybook illustration of ${prompt}`,
//       go_fast: true,
//       num_outputs: 1,
//       aspect_ratio: "16:9",
//       output_format: "webp",
//       output_quality: 80,
//    };

//    const response = (await replicate.run(model, { input })) as string[];

//    return response[0];
// }

// generate stage using openai and save it to db
export async function generateStage(data: IStageArguments): Promise<IStageShow> {
   const { stageNumber, userChoice, storyId } = data;
   // get supporting data from story
   const story = (await storyRepository.getById(data.storyId)) as unknown as IStory;

   if (!story) throw new Error("story not found");

   const { premise, maxStage, context } = story;

   // throw error if stageNumber > maxStage
   if (stageNumber > maxStage) throw new Error("invalid stage number");

   let userPrompt = `Current stage number = ${
      stageNumber - 1
   };\nPrevious story context = ${context};\nUser choice = ${userChoice};\n`;

   if (stageNumber == maxStage - 1) {
      userPrompt = userPrompt + "CRITICAL: STAGE STORY AND OPTIONS MUST LEAD TO STORY CONCLUSION";
   }

   if (stageNumber == maxStage) {
      userPrompt = userPrompt + "CRITICAL: CONCLUDE THE STORY. DON'T GIVE OPTIONS ANYMORE. TELL THE MORAL OF THE STORY";
   }

   const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
         {
            role: "system",
            content: [
               {
                  type: "text",
                  text: `You are a storyteller for kids. Each response is a stage of a kids story. A stage consist of 5 senteces or less. A stage end with two options. Each option is an action choice. The option choosen by user directs what happens in the next stage. If given previous story, continue to the next stage. 
                  
                  Tell a kids story about ${premise}`,
               },
            ],
         },
         {
            role: "user",
            content: userPrompt,
         },
      ],
      temperature: 1.2,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
         type: "json_schema",
         json_schema: {
            name: "story_response",
            schema: {
               type: "object",
               required: ["stageNumber", "stageStory", "optionA", "optionB", "place", "bgm"],
               properties: {
                  bgm: {
                     type: "string",
                     description: `Choose the most suitable ambience from this list: ${getBgmTags()}`,
                  },
                  place: {
                     type: "string",
                     description:
                        "A detailed, colorful and whimsical description of the place where the story is set at this stage. CRITICAL: follow this format example: A whimsical, colorful cottage nestled in a lush, enchanted forest. Sunlight filters through the canopy, illuminating the cottage's vibrant exterior and casting playful shadows on the surrounding foliage",
                  },
                  optionA: {
                     type: "string",
                     description: "The first option available to the user.",
                  },
                  optionB: {
                     type: "string",
                     description: "The second option available to the user.",
                  },
                  stageStory: {
                     type: "string",
                     description: "The narrative or text of the stage in the story.",
                  },
                  stageNumber: {
                     type: "number",
                     description: "The current stage number in the story.",
                  },
               },
               additionalProperties: false,
            },
            strict: true,
         },
      },
   });

   const stage = JSON.parse(response.choices[0].message?.content as string) as IStageShow;
   stage.storyId = storyId;
   stage.isEnd = stage.stageNumber == maxStage;
   stage.bgm = getBgmUrl(stage.bgm) as string;
   // stage.place = await generateImage(stage.place);

   // update the story context
   storyRepository.update(storyId, { context: (context + stage.stageStory) as string });

   // TODO:
   // When stage isEnd, update story isFinish to true
   // complete the story metadata
   // all are done synchronoushly
   if (stage.isEnd) {
      storyRepository.update(storyId, { isFinish: true });
      storyService.completeStoryMetadata(storyId);
   }

   return stage;
}
