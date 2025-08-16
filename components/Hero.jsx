"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

const Hero = () => {
    const [themes, setThemes] = useState("");
  const { theme } = useTheme();
  console.log(theme);

  useEffect(() => {
    setThemes(theme);
  }, [theme])
  return (
    <section>
      <div className="flex items-center justify-between w-full space-x-10">
        <div className="w-full space-y-8">
          <h1 className="text-8xl font-bold text-emerald-500 space-y-4">
            AI-Generated <br />
            <span className="text-gray-800/80 dark:text-gray-100/80">
              Personalized <br /> QuestionBank
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400/80 text-xl font-medium">
            Generate Customized Quizzes in seconds and asses your knowledge
          </p>
          <div className="flex items-center justify-start gap-4">
            <Button
              className={
                "px-10 py-6 text-md bg-indigo-600/80 rounded-full hover:bg-indigo-800/80 cursor-pointer dark:text-gray-100"
              }
            >
              Get started
            </Button>
            <Button
              className={
                "px-10 py-6 text-md border-emerald-500 bg-transparent border-2 text-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-900/60 dark:text-gray-100 rounded-full cursor-pointer"
              }
            >
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="w-full">
          {themes === "dark" ? (
            <Image
              src={"/hero-dark.png"}
              width={1800}
              height={1800}
              alt="Hero-Image"
              className="rounded-full backdrop:blur-2xl [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),rgba(0,0,0,0))] [mask-repeat:no-repeat] [mask-size:100%]"
            />
          ) : (
            <Image
              src={"/hero-light.png"}
              width={1800}
              height={1800}
              alt="Hero-Image"
            />
          )}
          {/* <Image
            src={"/hero-light.png"}
            width={1800}
            height={1800}
            alt="Hero-Image"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
