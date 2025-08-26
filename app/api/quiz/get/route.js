'use server';
import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import { NextResponse } from "next/server";

await connectDb();

export const POST = async(req) => {
    try {
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }
        const {id} = body;
        
        if (!id) {
            return NextResponse.json(
                {success: false, error: "Quiz ID is required"},
                {status: 400}
            );
        } 

        const quiz = await Question.findById(id);
        if(!quiz) {
            return NextResponse.json(
                {success: false, error: "Quiz not found"},
                {status: 404}
            );
        }

        return NextResponse.json(
            {success: true, data: quiz},
            {status: 200}
        );
    } catch (error) {
        console.error("Error in quiz GET route:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to fetch quiz",
                details: error.message 
            },
            { status: 500 }
        );
    }
}