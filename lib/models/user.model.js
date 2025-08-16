import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    id:{type:String,required:true,unique:true},
  name: { type:String, required: true },
  email: { type:String, required: true, unique: true },

  // Profile & Preferences
  role: {
    type: String,
    enum: ["student","admin"],
    default: "student",
  },
  avatarUrl: { type: String }, // profile picture
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },

  language: { type: String, default: "english" }, // language preference for questions

  // Stats & Progress
  quizTaken: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
},{timestamps:true});

const User = mongoose.models.User || mongoose.model("User",userSchema)
export default User;
