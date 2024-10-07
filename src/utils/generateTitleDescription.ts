import { openai } from "./openai";

export async function generateTitleDescription(context: string) {
   const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
         {
            role: "system",
            content: [
               {
                  type: "text",
                  text: "Given a kids story, create a suitable title and description for the story. Description is 2 sentences or less. Do not sound like a commercial. Do not try to convice reader to read the story.",
               },
            ],
         },
         {
            role: "user",
            content: context,
         },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
         type: "json_schema",
         json_schema: {
            name: "json_schema",
            strict: true,
            schema: {
               type: "object",
               properties: {
                  title: {
                     type: "string",
                     description: "The title of the story object.",
                  },
                  description: {
                     type: "string",
                     description: "A description of the story.",
                  },
               },
               required: ["title", "description"],
               additionalProperties: false,
            },
         },
      },
   });

   const { title, description } = JSON.parse(response.choices[0].message?.content as string);

   return { title, description };
}
