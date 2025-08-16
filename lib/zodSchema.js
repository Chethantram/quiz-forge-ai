import * as z from "zod";

export const userSchema = z.object({
    name: z.string().min(3, "Name must contain more than 3 Letters"),
    email: z.email({message: "Invalid email address"}),
    password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    role:z.enum(["student", "admin"]).default("student"),
    language:z.string().default("english"),
    quizTaken:z.number().default(0),
    averageScore:z.float64().default(0.0),
    difficulty:z.enum(["easy","medium","hard"]).default("easy")
});

export const loginSchema = z.object({
    email: z.email({message: "Invalid email address"}),
    password:z.string().min(1,"Password is required"),
})