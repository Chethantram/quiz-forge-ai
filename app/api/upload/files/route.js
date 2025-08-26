import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { connectDb } from "@/lib/db";

await connectDb();


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const prompt = formData.get("prompt");
    const question = 20;
    const difficult = "medium";
    const language = "english";

    const adminPrompt = `You are a quiz generator AI. The user will upload a file and provide additional instructions 
such as the number of questions is ${question}, difficulty level is ${difficult}, and language is ${language}. 

Read the uploaded file carefully and generate quiz questions based only on its content.

Return the output **strictly in JSON format** with the following structure:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string",
      "hint": "string",
      "explanation": "string"
    }
  ]
}

⚠️ Rules:
- Generate exactly the number of questions requested by the user.
- Each question must have **4 options**.
- "answer" should be one of the options.
- "hint" should give a small clue without giving away the answer.
- "explanation" should briefly explain why the answer is correct.
- Translate everything into the requested language.
- Do not include any text outside the JSON.
`;

    if (!file || !prompt) {
      return NextResponse.json(
        { error: "File and prompt are required" },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        },
        { text: adminPrompt },
      ],
    });

    const response = result.text;
    const cleanedText = response
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();
    const responseObject = JSON.parse(cleanedText);
    

    return NextResponse.json(
      { success: true, response: responseObject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process file" },
      { status: 500 }
    );
  }
};
