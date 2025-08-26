"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userSchema } from "@/lib/zodSchema";
import { CircleCheckBig, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(userSchema) });

  const router = useRouter();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [emailVerifiedLink, setEmailVerifiedLink] = useState(false);

  const onSubmit = async (data) => {
    try {
      const email = data.email;
      const password = data.password;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      if (user) {
        await sendEmailVerification(user);
        setEmailVerifiedLink(true);
      }
      const userData = {
        id: user?.uid,
        name: data?.name,
        email: data?.email,
      };
      
      const res = await axios.post("/api/user/create", userData);

      toast.success("Registration Successfully");
      reset();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(
        errorMessage.split("auth/")[1]?.replace(").", "") ||
          "Something went wrong"
      );
      alert(errorCode, errorMessage);
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          router.push("/sign-in");
        } else {
          router.push("/sign-up");
        }
      }
    });
    return () => unSubscribe;
  }, [router]);

  return (
    <div className=" flex lg:h-screen bg-white dark:bg-[#00000D] w-full ">
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
          <CardTitle className={"text-2xl text-indigo-500"}>
            Register for QuizForge AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {emailVerifiedLink == true && (
              <div className="flex items-center justify-center py-2 px-1 bg-green-300  text-center mb-4 rounded-md">
                {" "}
                <CircleCheckBig className="mr-2 text-green-700" />
                <p className="text-green-700">
                  Email Verification Sent Successfully{" "}
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <Input
                  {...register("name")}
                  type="text"
                  className="w-full  focus:outline-none focus:border-[#545CEF]"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
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
                className="w-full bg-[#545CEF] dark:text-white hover:bg-indigo-700 "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" /> Signing....
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-500 dark:text-indigo-500 font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
