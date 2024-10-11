import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { replicate } from "../utils/replicate";
import { openai } from "../utils/openai";
import * as stageRepository from "../repositories/stage.repository";
import * as storyRepository from "../repositories/story.repository";
import * as storyService from "../services/story.service";
import { IStage, IStageArguments } from "../types/stage";
import { IStory } from "../types/story";
import { getBgmTags, getBgmUrl } from "../utils/bgm";
import { s3 } from "../utils/s3";

// create stage in db
export async function create(data: IStageArguments) {
   const stageData = await generateStage(data);

   const stage = await stageRepository.create(stageData);

   // move the image to s3
   uploadImgS3andUpdateDb(stage);

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
async function generateImage(prompt: string) {
   const model = "black-forest-labs/flux-schnell";

   const input = {
      seed: 29733,
      prompt: `Child storybook illustration of ${prompt}`,
      go_fast: true,
      num_outputs: 1,
      aspect_ratio: "16:9",
      output_format: "webp",
      output_quality: 80,
   };

   const response = (await replicate.run(model, { input })) as string[];

   return response[0];
}

// generate stage using openai and save it to db
export async function generateStage(data: IStageArguments): Promise<IStage> {
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

   const stage = JSON.parse(response.choices[0].message?.content as string) as IStage;
   stage.storyId = storyId;
   stage.isEnd = stage.stageNumber == maxStage;
   stage.bgm = getBgmUrl(stage.bgm) as string;
   stage.place = await generateImage(stage.place);

   // update the story context
   storyRepository.update(storyId, { context: (context + stage.stageStory) as string });

   // When stage isEnd, update story isFinish to true
   // complete the story metadata
   // all are done synchronoushly
   if (stage.isEnd) {
      storyRepository.update(storyId, { isFinish: true });
      storyService.completeStoryMetadata(storyId);
   }

   return stage;
}

export async function uploadImgS3(imgUrl: string, key: string) {
   const uploadImg = new Upload({
      client: s3,
      params: {
         Bucket: process.env.S3_BUCKET as string,
         Key: `img/${key}.webp`,
         Body: (await fetch(imgUrl).then((res) => res.body)) as ReadableStream<Uint8Array>,
      },
   });

   const result = await uploadImg.done();
   return result;
}

export async function deleteImgS3(key: string) {
   const result = await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET as string, Key: key }));
   return result;
}

async function uploadImgS3andUpdateDb(stage: IStage) {
   const { _id, storyId, stageNumber, place } = stage;
   const result = await uploadImgS3(place, `${storyId}-${stageNumber}`);
   update(_id as string, { place: result.Location });
   if (stageNumber == 1) {
      storyService.update(storyId as string, { thumbnail: result.Location });
   }
}

// delete a stage and its s3 img
export async function deleteStage(stage: IStage) {
   await deleteImgS3(`img/${stage.storyId}-${stage.stageNumber}.webp`);
   const deletedStage = await stageRepository.deleteOne(stage._id as string);
   return deletedStage;
}

