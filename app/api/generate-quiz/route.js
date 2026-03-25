"use server";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import User from "@/lib/models/user.model";
import { validateFile } from "@/lib/file-validation";
import { rateLimitQuizGeneration } from "@/lib/rate-limiter";
import { z } from "zod";

await connectDb();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateQuizSchema = z.object({
  question: z.coerce.number().int().min(1).max(50, "Cannot generate more than 50 questions"),
  difficult: z.enum(["easy", "medium", "hard"]),
  language: z.string().min(1),
  email: z.string().email("Invalid email"),
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const question = formData.get("question");
    const difficult = formData.get("difficult");
    const language = formData.get("language");
    const email = formData.get("email");

    // Validate required fields
    const validationResult = generateQuizSchema.safeParse({
      question,
      difficult,
      language,
      email,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 }
      );
    }

    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, message: fileValidation.error },
        { status: 400 }
      );
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Rate limit: max 5 quizzes per hour per user
    const rateLimitResult = rateLimitQuizGeneration(user._id.toString());
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Rate limit exceeded. ${rateLimitResult.reason}` 
        },
        { status: 429 } // Too Many Requests
      );
    }

    const { question: numQuestions, difficult: difficulty, language: lang, email: userEmail } = validationResult.data;

    const adminPrompt = `You are a quiz generator AI. The user has uploaded a file for quiz generation.

Requirements:
- Generate exactly ${numQuestions} questions based on the file content
- Difficulty level: ${difficulty}
- Language: ${lang}
- Each question must have exactly 4 options
- The answer must be one of the options
- Provide hints and explanations for each question

Return ONLY valid JSON (no extra text) with this structure:
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
}`;

    // Read and encode file
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Generate quiz using Gemini AI
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

    // Parse JSON response
    let responseObject;
    try {
      responseObject = JSON.parse(cleanedText);
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid response format from AI. Please try again." 
        },
        { status: 500 }
      );
    }

    // Validate response has questions
    if (!responseObject.questions || !Array.isArray(responseObject.questions)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid quiz format generated. Please try again." 
        },
        { status: 500 }
      );
    }

    // Create quiz document in database
    const quizData = await Question.create({
      userId: user._id,
      language: lang,
      difficulty: difficulty,
      questions: responseObject.questions.map((q) => ({
        question: q.question || "",
        options: q.options || [],
        correctAnswer: q.answer || "",
        hint: q.hint || "",
        explanation: q.explanation || "",
        difficulty: difficulty,
      })),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Quiz generated successfully",
        data: quizData,
        rateLimitRemaining: rateLimitResult.remaining 
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    // Handle specific errors
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { success: false, message: "AI service configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
};
