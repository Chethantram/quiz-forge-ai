'use server';
import { connectDb } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

await connectDb();

export const POST = async (data) => {
  try {
    const { email,name,difficulty } = await data.json();
     console.log("Email received for update:", email);
     console.log("Data received for update:", data);
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { name, difficulty },
      { new: true }
    ).select("-password");
    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponseResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
