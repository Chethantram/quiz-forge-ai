'use server';
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

await connectDb();

export const POST = async (request) => {
  try {
    const { id } = await request.json();
    console.log("server id:", id);
    
    if(!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).populate({
      path: 'quizCompleted',
      model: Question
    });
    if(!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    user.quizCompleted.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json(
      { success: true, data: user.quizCompleted || [] },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
        details: error.message,
      },
      { status: 500 }
    );
  }
};

// export const POST = async (req) => {
//   try {
//     let body;
//     try {
//       body = await req.json();
//     } catch (e) {
//       return NextResponse.json(
//         { success: false, error: "Invalid JSON in request body" },
//         { status: 400 }
//       );
//     }
//     const { id } = body;

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
