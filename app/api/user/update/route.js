'use server';
import { connectDb } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const updateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  language: z.string().optional(),
});

export const POST = async (request) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, name, difficulty, language } = validationResult.data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update object (only include provided fields)
    const updateData = {};
    if (name) updateData.name = name;
    if (difficulty) updateData.difficulty = difficulty;
    if (language) updateData.language = language;

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json(
      { 
        success: true, 
        message: "User updated successfully", 
        data: updatedUser 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}
