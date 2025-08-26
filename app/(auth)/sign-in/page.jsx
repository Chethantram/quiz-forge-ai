"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginSchema, userSchema } from "@/lib/zodSchema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const email = data.email;
      const password = data.password;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;


      // Store token in local storage with an expiry time of 24 hours
      

      

      if (user.emailVerified) {
        toast.success("Login Successfully");
        reset();
        router.push("/");
      } else {
        toast.error("Please verify your email before logging in.");
        // Optionally, you can sign out the user if not verified
        // await auth.signOut();
      }
    } catch (error) {
      const errorMessage = error.message;
      toast.error(
        errorMessage.split("auth/")[1]?.replace(").", "") ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="flex lg:h-screen bg-background dark:bg-[#00000D] w-full ">
      {/* Left Side Image */}
      <div className="w-full hidden lg:flex  bg-indigo-50  items-center justify-center">
        <img
          src={`/auth-light.png`}
          alt="QuizForge AI Illustration"
          className="max-w-lg"
        />
      </div>

      {/* Right Side Form */}
      <Card
        className={
          "border border-indigo-500 mt-24 md:mt-20 lg:border-none  outline-none w-full md:mx-10 mx-4 dark:bg-transparent "
        }
      >
        <CardHeader>
          <CardTitle className={"text-2xl text-indigo-500"}>Login for QuizForge AI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <Input
                {...register("email")}
                type="email"
                className="w-full  focus:outline-none focus:border-[#545CEF]"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <Input
                {...register("password")}
                type="password"
                className="w-full  focus:outline-none focus:border-[#545CEF]"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* CheckBox */}
            <div className="flex items-start gap-3 mt-4 ">
              <Checkbox
                id="terms-2"
                required
                className={"cursor-pointer text-[#545CEF]"}
              />
              <div className="grid gap-2">
                <Label htmlFor="terms-2 text-sm">
                  Accept terms and conditions
                </Label>
                <p className="text-muted-foreground text-xs">
                  By clicking this checkbox, you agree to the terms and
                  conditions.
                </p>
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#545CEF] dark:text-white hover:bg-indigo-700 cursor-pointer "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Signing....
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-500 dark:text-indigo-500 font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
