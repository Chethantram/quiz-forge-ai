'use server'
import { connectDb } from "@/lib/db";
import User from "@/lib/models/user.model";
import { NextResponse } from "next/server";

await connectDb();
export const POST = async(data) => {
try {
    const userData = await data.json();
    
    const {id,name,email} = userData;
    
    if (!id || !name || !email) {
      return NextResponse.json({ success: false, message: "All fields are Required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ success: false, message: "User Already exists" });
    }

    const newUser = await User.create({id, name, email });

    if (!newUser) {
      return NextResponse.json({ success: false, message: "User not created" });
    }

    return NextResponse.json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false,message:error});
  }
}