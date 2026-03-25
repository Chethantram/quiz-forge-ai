'use server';
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const getQuizSchema = z.object({
  id: z.string().min(1, "Quiz ID is required"),
  userId: z.string().min(1, "User ID is required").optional(), // For owner verification
});

export const POST = async(req) => {
  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = getQuizSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, userId } = validationResult.data;

    // Fetch the quiz
    const quiz = await Question.findById(id).populate('userId', 'email');
    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }

    // Optional: Verify user owns the quiz if userId is provided
    if (userId && quiz.userId._id.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You don't have access to this quiz" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, data: quiz },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in quiz GET route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}