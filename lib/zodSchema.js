import * as z from "zod";

// Email validation
const emailSchema = z.string().email("Invalid email address").toLowerCase();

// Password validation - strong requirements
const strongPasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Basic password validation
const basicPasswordSchema = z.string().min(6, "Password must be at least 6 characters");

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").trim(),
  email: emailSchema,
  password: strongPasswordSchema,
  role: z.enum(["student", "admin"]).default("student"),
  language: z.string().default("english"),
  averageScore: z.number().min(0).max(100).default(0),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
  avatarUrl: z.string().url().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: basicPasswordSchema,
});

export const updateUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(2).max(100).trim().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  language: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  email: emailSchema,
  currentPassword: basicPasswordSchema,
  newPassword: basicPasswordSchema,
  confirmPassword: basicPasswordSchema,
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

// Quiz validation
export const quizSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  language: z.string().default("english"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  questions: z.array(
    z.object({
      question: z.string().min(5, "Question must be at least 5 characters"),
      options: z.array(z.string()).min(4, "Must have at least 4 options").max(4, "Must have exactly 4 options"),
      correctAnswer: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]).optional(),
      hint: z.string().optional(),
      explanation: z.string().optional(),
    }).refine(
      (data) => data.options.includes(data.correctAnswer),
      {
        message: "Correct answer must be one of the options",
        path: ["correctAnswer"],
      }
    )
  ).min(1, "Quiz must have at least one question"),
});

// Quiz generation validation
export const generateQuizSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  email: emailSchema,
  file: z.any(), // FormData file
  numQuestions: z.number().int().min(1).max(50).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  language: z.string().default("english"),
});

// Quiz completion validation
export const quizCompletionSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required"),
  userId: z.string().min(1, "User ID is required"),
  score: z.number().min(0).max(100),
  answers: z.array(z.object({
    questionIndex: z.number(),
    selectedAnswer: z.string(),
    timeSpent: z.number().positive(),
  })).optional(),
});

// Input sanitization
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000); // Limit length
}

export function sanitizeObject(obj) {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}