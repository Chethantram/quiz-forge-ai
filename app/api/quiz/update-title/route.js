'use server';
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import { NextResponse } from "next/server";

await connectDb();

export const POST = async (request) => {
    try {
        const data = await request.json();
        const {userId,quizId,title} = data;
        
        if(!userId || !quizId || !title) {
            return NextResponse.json(
                { success: false, error: "User ID, Quiz ID and Title are required" },
                { status: 400 }
            );
        }

        const quiz = await Question.findById(quizId);
        if(!quiz) {
            return NextResponse.json(
                { success: false, error: "Quiz not found" },
                { status: 404 }
            );
        }

        if(quiz.userId.toString() !== userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized to update this quiz" },
                { status: 403 }
            );
        }
        quiz.title = title;
        await quiz.save();
        
        return NextResponse.json(
            { success: true, data: quiz },
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
}