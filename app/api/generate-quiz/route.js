"use server";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import User from "@/lib/models/user.model";

await connectDb();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const question = formData.get("question");
    const difficult = formData.get("difficult");
    const language = formData.get("language");
    const email = formData.get("email");

    if(!email){
      return NextResponse.json(
        {success:false, error: "User email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({email});
    if(!user){
      return NextResponse.json(
        {success:false, error: "User not found" },
        { status: 404 }
      );
    }

  
    

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

    if (!file || !question || !difficult || !language) {
      return NextResponse.json(
        {success:false, error: "All fields are required" },
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
    let cleanedText = response
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();
      
    let responseObject;
    try {
      responseObject = JSON.parse(cleanedText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${e.message}\nReceived: ${cleanedText}`);
    }
    
    // Create a single document with all questions
    const res = await Question.create({
      userId: user?._id,
      language,
      questions: responseObject.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        hint: q.hint,
        explanation: q.explanation,
        difficulty: difficult
      }))
    });
    
    return NextResponse.json(
      { success: true,message: "Quiz generated successfully", data: res },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {success:false, error: error.message || "Failed to process file" },
      { status: 500 }
    );
  }
};
