import { callNebius } from "@/lib/nebiusLLModel";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	// const formData = await req.formData();
	// const doc = formData.get("doc");
	// const inputText = formData.get("inputText");

	// if (!doc || !(doc instanceof File) || typeof inputText !== "string") {
	// 	return NextResponse.json({ error: "No files received." }, { status: 400 });
	// }

	// const buffer = Buffer.from(await doc.arrayBuffer());

	// fs.writeFileSync("public/input.pdf", buffer);

	const { docBase64, inputText } = await req.json();

	const { text } = await callNebius(docBase64, inputText);

	if (!text) {
		return NextResponse.json(
			{ success: false, message: "model call failed" },
			{ status: 500 }
		);
	}

	// const json = JSON.stringify(text);

	try {
		// write json text to a temporary file
		fs.writeFileSync("public/output.pdf", text!);

		//json.pdf file upload code here
		const upload = true;
		(() => {
			setTimeout(() => {
				console.log("File uploaded successfully");
			}, 5000);
		})();

		if (!upload) {
			return NextResponse.json(
				{ success: false, message: "File upload failed" },
				{ status: 500 }
			);
		}

		// after upload delete the file
		// fs.unlinkSync("public/output.pdf");

		return NextResponse.json(
			{ success: true, message: "File uploaded successfully" },
			{ status: 200 }
		);
	} catch (error : any) {
		console.error(error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
