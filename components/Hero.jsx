"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [themes, setThemes] = useState("");
  const { theme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    setThemes(theme);
  }, [theme]);
  return (
    <section className="flex justify-center md:justify-between md:px-4 mt-10">
      <div className="flex flex-col md:flex-row md:items-center  md:justify-between w-full max-w-6xl md:w-full space-y-10 md:space-y-0 md:space-x-10 md:mt-2 text-center md:text-left">
        {/* Left Content */}
        <div className="w-full space-y-4 md:space-y-8">
          <h1 className="text-5xl md:text-5xl  lg:text-8xl font-bold text-emerald-500">
            AI-Generated <br />
            <span className="text-gray-800/80 dark:text-gray-100/80">
              Personalized <br /> QuestionBank
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400/80 text-md lg:text-xl font-medium">
            Generate Customized Quizzes in seconds and assess your knowledge
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Button onClick={()=>router.push('/generate-quiz')} className="lg:px-10 lg:py-6 px-6 py-4 text-md bg-indigo-600/80 rounded-full hover:bg-indigo-800/80 cursor-pointer dark:text-gray-100">
              Get started
            </Button>
            <Button className="lg:px-10 lg:py-6 px-6 py-4 text-md border-emerald-500 bg-transparent border-2 text-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-900/60 dark:text-gray-100 rounded-full cursor-pointer">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Right Content (Image only visible on desktop) */}
        <div className="w-full hidden md:block">
          {themes === "dark" ? (
            <Image
              src={"/hero-dark.png"}
              width={1800}
              height={1800}
              alt="Hero-Image"
              className="rounded-full backdrop:blur-2xl 
          [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),rgba(0,0,0,0))] 
          [mask-repeat:no-repeat] [mask-size:100%]"
            />
          ) : (
            <Image
              src={"/hero-light.png"}
              width={1800}
              height={1800}
              alt="Hero-Image"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
