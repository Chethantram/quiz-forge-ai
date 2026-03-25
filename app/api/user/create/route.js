'use server'
import { connectDb } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const createUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
});

export const POST = async (request) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, name, email } = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 } // Conflict
      );
    }

    // Create new user
    const newUser = await User.create({
      id,
      name,
      email,
    });

    if (!newUser) {
      return NextResponse.json(
        { success: false, message: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "User created successfully",
        data: newUser 
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}