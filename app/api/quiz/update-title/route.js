'use server';
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const updateTitleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  title: z.string()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be less than 200 characters")
    .trim(),
});

export const POST = async (request) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = updateTitleSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, quizId, title } = validationResult.data;

    // Fetch quiz and verify ownership
    const quiz = await Question.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (quiz.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not have permission to update this quiz" },
        { status: 403 }
      );
    }

    // Update title
    quiz.title = title;
    await quiz.save();
    
    return NextResponse.json(
      { success: true, data: quiz, message: "Quiz title updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating quiz title:', error);
    return NextResponse.json(
      { success: false, error: "Failed to update quiz title" },
      { status: 500 }
    );
  }
}