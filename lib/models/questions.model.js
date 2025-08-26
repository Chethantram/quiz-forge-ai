import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    title:{
      type: String,
      default: "Untitled Quiz",
    },
    language: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    averageScore:{
      type: Number,
      default: 0,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          { 
            type: String, 
            required: true
         },
        ],
        correctAnswer: {
          type: String,
          required: true,
        },
        hint: {
          type: String,
          default: "",
        },
        explanation: {
          type: String,
          default: "",
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
