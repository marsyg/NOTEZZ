import OpenAI from "openai";
import fs from "fs";

const systemPrompt =
	"You are an exceptional reader who can read any document having worse to worst handwriting like maaz & chandan. You can provide a summary as well as detailed description about the topic of a document or the whole document. You can also provide a list of key takeaways from the document.";

export async function callNebius(docBase64: string, text: string) {
	const userPrompt = text;

	try {
		// write text to a temporary file

		const client = new OpenAI({
			baseURL: "https://api.studio.nebius.com/v1/",
			apiKey: process.env.NEBIUS_API_KEY,
		});

		// console.log("nebius api key : ", process.env.NEBIUS_API_KEY);

		// if(client) console.log("client : ", client);

		// const file = await client.files.create({
		// 	file: fs.createReadStream("public/input.pdf"),
		// 	purpose: "user_data",
		// });

		// after upload to model, delete the file
		// fs.unlinkSync("public/output.pdf");

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
						{
							type: "text",
							text: userPrompt,
						},
					],
				},
			],
		});

		const outputText = result?.choices[0].message.content;

		console.log(`Model : ${outputText}`);

		return {
			success: true,
			text: outputText,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			// message: error.message,
		};
	}
}
