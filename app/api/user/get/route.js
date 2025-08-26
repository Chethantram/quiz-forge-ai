'use server';
import { connectDb } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

await connectDb();

export const POST = async (req) => {
    try {
        const body = await req.json();
        const {email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({email});
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, data: user },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error in update route:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get User" },
            { status: 500 }
        );
        
    }
}