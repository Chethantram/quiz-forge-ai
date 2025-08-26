import { connectDb } from "@/lib/db";
import Question from "@/lib/models/questions.model";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

await connectDb();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { id ,averageScore} = body;
        if (!id) {
            return NextResponse.json(
                { success: false, error: "Quiz ID is required" },
                { status: 400 }
            );
        }
        // Here you would typically update the quiz in your database
        const res = await Question.findByIdAndUpdate(id,{completed: true,averageScore:averageScore}, { new: true });
        if (!res) {
            return NextResponse.json(
                { success: false, error: "Quiz not found" },
                { status: 404 }
            );
        }
        const user = await User.findById(res.userId);

        if(!user){
            return NextResponse.json(
                {success:false, error: "User not found" },
                { status: 404 }
            );
        }

        const avgScore = user?.averageScore;
        if(avgScore === 0)
        {
            const userScoreUpdate = await User.findByIdAndUpdate(res.userId,{averageScore: averageScore},{new:true});
        }else{
            const newAvg =Number(avgScore + averageScore)/2;
            const userScoreUpdate = await User.findByIdAndUpdate(res.userId,{averageScore: newAvg},{new:true});
        }


        const userUpdate = await User.findByIdAndUpdate(res.userId,{$push: {quizCompleted: res._id}},{new:true});
        
        return NextResponse.json(
            { success: true, data: res },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in update route:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update quiz" },
            { status: 500 }
        );
        
    }
}