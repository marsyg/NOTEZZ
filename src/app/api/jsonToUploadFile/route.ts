import { callNebius } from "@/lib/callNebius";
import { uploadCloudinary } from "@/lib/uploadToCloudinary";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { docBase64, filename } = await req.json();
	console.log("docbase:", docBase64);


    const { text } = await callNebius(docBase64);
	console.log("text : ",text);

    if (!text) {
      throw new Error("model call failed...");
    }
    // write json text to a temporary file
    const filePath = `public/${filename}`;
    fs.writeFileSync(filePath, text!);

    const uploadResult = await uploadCloudinary(filename, filePath);

    if (!uploadResult) {
      throw new Error("File upload failed...");
    }

    fs.unlinkSync(filePath);

    return NextResponse.json(
      { success: true, message: "File uploaded successfully", uploadResult},
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
