import OpenAI from "openai";
import fs from "fs";
import { systemPrompt } from "@/constant";

export async function callNebius(docBase64: string) {
  console.log("I'm in nebius");

  try {
    // write text to a temporary file

    const client = new OpenAI({
      baseURL: "https://api.studio.nebius.com/v1/",
      apiKey: process.env.NEBIUS_API_KEY,
    });
    console.log("Client : ",client);


    const result = await client.chat.completions.create({
      model: "google/gemma-3-27b-it",
      max_tokens: 512,
      temperature: 0.5,
      top_p: 0.9,
      // extra_body: {
      // 	top_k: 50,
      // },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: docBase64 },
            },
          ],
        },
      ],
    });
    if(!result){
      throw new Error("No model response")
    }
    console.log("Result :", result)

    const outputText = result?.choices[0].message.content;

    console.log(`Model : ${outputText}`);

    return {
      success: true,
      text: outputText,
    };
  } catch (error:any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
