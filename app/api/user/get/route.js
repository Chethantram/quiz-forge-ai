'use server';
import { connectDb } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";

await connectDb();

const getUserSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const POST = async (req) => {
  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = getUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user (exclude sensitive fields)
    const user = await User.findOne({ email }).select('-password');
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
    console.error("Error in get user route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}