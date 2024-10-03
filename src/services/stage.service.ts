// import { replicate } from "../utils/replicate";
import { openai } from "../utils/openai";
import { IStage, IStageArguments } from "../types/stage";
// import { Stage } from "../models/stage.model";
import { getBgmTags, getBgmUrl } from "../utils/bgm";

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
export async function generateStage(data: IStageArguments): Promise<IStage> {
   const { storyId, premise, currentStageNumber, currentStoryContext, userChoice, maxStage } = data;

   let userPrompt = `Current stage number = ${currentStageNumber};\nPrevious story context = ${currentStoryContext};\nUser choice = ${userChoice};\n`;

   if (currentStageNumber == maxStage - 2) {
      userPrompt = userPrompt + " CRITICAL: STAGE STORY AND OPTIONS MUST LEAD TO STORY CONCLUSION";
   }

   if (currentStageNumber == maxStage - 1) {
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

   const stage = JSON.parse(response.choices[0].message?.content as string) as IStage;
   stage.storyId = storyId;
   stage.storyContext = currentStoryContext + stage.stageStory;
   stage.isEnd = stage.stageNumber == maxStage;
   stage.bgm = getBgmUrl(stage.bgm) as string;
   // stage.place = await generateImage(stage.place);

   // const { optionA, optionB, ...stageData } = stage;
   // Stage.create(stageData);

   return stage;
}
