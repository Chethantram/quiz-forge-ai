import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const updateQuizSchema = z.object({
  id: z.string().min(1, "Quiz ID is required"),
  averageScore: z.number().min(0).max(100, "Score must be between 0 and 100"),
  userId: z.string().optional(),
});

/**
 * Helper function to calculate the correct average score
 * Gets all completed quiz scores for the user and averages them
 */
async function calculateUserAverageScore(userId) {
  try {
    const user = await User.findById(userId).populate({
      path: 'quizCompleted',
      select: 'averageScore',
    });

    if (!user || !user.quizCompleted || user.quizCompleted.length === 0) {
      return 0;
    }

    const totalScore = user.quizCompleted.reduce((sum, quiz) => {
      return sum + (quiz.averageScore || 0);
    }, 0);

    return Math.round((totalScore / user.quizCompleted.length) * 100) / 100; // Round to 2 decimals
  } catch (error) {
    console.error('Error calculating average score:', error);
    return 0;
  }
}

export const POST = async (req) => {
  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = updateQuizSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, averageScore, userId } = validationResult.data;

    // Update quiz - mark as completed and store score
    const updatedQuiz = await Question.findByIdAndUpdate(
      id,
      { 
        completed: true,
        averageScore: averageScore 
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Verify user exists
    const user = await User.findById(updatedQuiz.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if quiz is already in user's completed list to avoid duplicates
    const isAlreadyCompleted = user.quizCompleted.some(
      (quizId) => quizId.toString() === updatedQuiz._id.toString()
    );

    if (!isAlreadyCompleted) {
      // Add quiz to user's completed list
      await User.findByIdAndUpdate(
        updatedQuiz.userId,
        { $push: { quizCompleted: updatedQuiz._id } },
        { new: true }
      );
    }

    // Calculate and update user's average score properly
    const newAverageScore = await calculateUserAverageScore(updatedQuiz.userId);
    await User.findByIdAndUpdate(
      updatedQuiz.userId,
      { averageScore: newAverageScore },
      { new: true }
    );

    return NextResponse.json(
      { 
        success: true, 
        data: updatedQuiz,
        userAverageScore: newAverageScore 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in quiz update route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}