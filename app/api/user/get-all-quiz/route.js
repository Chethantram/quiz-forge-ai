'use server';
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const getAllQuizSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export const POST = async (request) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = getAllQuizSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id } = validationResult.data;
    
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Populate completed quizzes
    const userData = await User.findById(id).populate({
      path: 'quizCompleted',
      model: Question,
      select: 'title difficulty language averageScore createdAt questions'
    });

    // Sort by creation date (newest first)
    const quizzes = userData.quizCompleted?.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }) || [];

    return NextResponse.json(
      { success: true, data: quizzes, count: quizzes.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Fetch quizzes created by the user from another API route

//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz/get-by-user`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId: id }),
//     });

//     const data = await response.json();

//     if (!data.success) {
//       return NextResponse.json(
//         { success: false, error: data.error || "Failed to fetch quizzes" },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: data.data },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to fetch quizzes",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// };
