import { replicate } from "../utils/replicate";
import { openai } from "../utils/openai";
import { Stage, StageArguments } from "../types/stage";

/**
 * Create a 16:9 illustration image using replicate:flux-schnell
 * https://replicate.com/black-forest-labs/flux-schnell
 */
async function generateImage(prompt: string) {
   const model = "black-forest-labs/flux-schnell";

   const input = {
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

/**
 * Create a stage using OpenAI. Inside the stage properties there is
 * an illustration created by generateImage()
 */
export async function generateStage(data: StageArguments): Promise<Stage> {
   const { storyId, premise, currentStageNumber, currentStorySummary, userChoice, maxStage } = data;

   const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
         {
            role: "system",
            content: [
               {
                  text: `Create a kids story about ${premise}. Give character name. Each response is a stage. A stage consists of 3 or less events. .  A stage always end with two options of main character actions. Each option describes the action that main character will take. Each option is opposite of the other. Each option is an active action. The action then directs what happen on the next stage. Repeat the action chosen on the next stage story. \n\nIMPORTANT:\nDescribe the character and story settings in stageNumber = 1. Introduce an engaging conflict or opposing characters in stageNumber = 2. Give some mindblowing plot in stageNumber = 3. Conclude the story in stageNumber=6. The conclucion should solve all the conflicts of the story.\n\nIMPORTANT:\nDescribe the place where the stage take place in 1 sentence. Describe like you are a kids storybook illustrator. include the style and color in the description. Don't repeat the place description on the next stage. Always describe in a whimsical and vivid art style. \n\nCRITICAL: Do not include any name in the place description. Do not include any character name in the place description. Do not include any living creature in the place description. Keep showing the description when the story has concluded.\n\nCRITICAL: CONCLUDE THE STORY AT STAGE NUMBER ${maxStage}. \n\nCRITICAL: The options on stage number ${
                     maxStage - 1
                  } must lead to story conclusion.`,
                  type: "text",
               },
            ],
         },
         {
            role: "user",
            content: [
               {
                  type: "text",
                  text: `current stage number: ${currentStageNumber}\nstory summary : ${currentStorySummary}\nuser choice : ${userChoice}\ncontinue to stage number : ${
                     currentStageNumber + 1
                  }\nend the story at stage number : ${maxStage}. The options on stage number ${
                     maxStage - 1
                  } must lead to story conclusion`,
               },
            ],
         },
      ],
      temperature: 1.1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
         type: "json_schema",
         json_schema: {
            name: "stage_story",
            schema: {
               type: "object",
               required: [
                  "stageNumber",
                  "stageTitle",
                  "stageStory",
                  "optionA",
                  "optionB",
                  "place",
                  "isEnd",
                  "storySummary",
                  "bgm",
               ],
               properties: {
                  isEnd: {
                     type: "boolean",
                     description: "True if story has been concluded. False if story is still on going",
                  },
                  place: {
                     type: "string",
                     description:
                        "Description of a place where stage taking place. The description must be whimsical, colorful and full of detail",
                  },
                  optionA: {
                     type: "string",
                     description: "Option of main character action.  Null if story have been concluded",
                  },
                  optionB: {
                     type: "string",
                     description: "Option of main character action. Null if story have been concluded",
                  },
                  stageStory: {
                     type: "string",
                     description: "Naration of events taking place on the stage",
                  },
                  stageTitle: {
                     type: "string",
                  },
                  stageNumber: {
                     type: "number",
                     description: "increment of current stage number",
                  },
                  storySummary: {
                     type: "string",
                     description: "The story SUMMARY. Accumulation of summary of previous stage.",
                  },
                  bgm: {
                     type: "string",
                     description:
                        "choose the url of the most suitable background music/ambience sound based on the tags for the stage from this list [{tags:'outer space', url:'http://outerspace.bgm'},{tags:'jungle', url:'http://jungle.bgm'},{tags:'city', url:'http://city.bgm'}, {tags:'sea', url:'http://sea.bgm'}]",
                  },
                  additionalProperties: false,
               },
               strict: true,
            },
         },
      },
   });

   const stage = JSON.parse(response.choices[0].message?.content as string);
   stage.place = await generateImage(stage.place);
   stage.storyId = storyId
   return stage;
}
