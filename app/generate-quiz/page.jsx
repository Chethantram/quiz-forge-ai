"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "@/lib/data";
import { toast } from "sonner";
import GenerateQuizLoader from "./_components/GenerateQuizLoader";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export default function UploadQuizPage() {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");
  const router = useRouter();
  
  
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("question", numQuestions);
      formdata.append("difficult", difficulty);
      formdata.append("language", language);
      formdata.append("email", email);

      
      
      const res = await axios.post("/api/generate-quiz", formdata);
      const responseData = res?.data;
      setData(responseData);      
      
      if(responseData?.success) {
        toast.success("Quiz generated successfully!");
        if (responseData?.data?._id) {
          router.push(`/quiz/${responseData.data._id}`);
        }
      } else {
        toast.error(responseData?.message || "Failed to generate quiz");
      }
      
    } catch (error) {
      setError(error);
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  
  
  useEffect(() => {
      const currentUser = onAuthStateChanged(auth, async (user) => {
        try {
          
          if (user !== null) {
            setEmail(user?.email);
          } else {
            router.push("/sign-in");
          }
        } catch (error) {
          console.log(error);
        }
      });
      return () => currentUser;
    }, [router,auth]);

  return (
    <div className="md:py-2 py-8 lg:px-24 md:px-8 px-4">
      <div>
        <h1 className="text-3xl text-indigo-500 font-bold">
          Generate your Quiz from File
        </h1>
        <p className="text-gray-500 dark:text-gray-100 mt-2">
          Upload your study material, choose difficulty & language, and
          instantly generate quizzes with hints and explanations.
        </p>
      </div>
      <Card className={"mt-10 w-full md:max-w-6xl mx-auto dark:bg-gray-950"}>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-900 transition"
            >
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-md">
                {file ? file.name : "Click to upload a file (PDF)"}
              </p>
              <input
                id="file-upload"
                type="file"
                name="file-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="File upload"
              />
            </label>

            {/* choose a field */}
            <div className="md:flex justify-between items-center space-x-4 space-y-3 md:space-y-0 md:my-14">
              {/* Number of questions */}
              <Select
                required
                onValueChange={(value) => setNumQuestions(value)}
                defaultValue={numQuestions}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>

              {/* Select difficulty */}
              <Select
                required
                onValueChange={(value) => setDifficulty(value)}
                defaultValue={difficulty}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Select Language */}
              <Select
                required
                onValueChange={(value) => setLanguage(value)}
                defaultValue={language}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language, index) => (
                    <SelectItem key={index} value={`${language?.id}`}>
                      {language?.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full cursor-pointer py-4 bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                  Processing...
                </>
              ) : (
                "Generate quiz"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Show the loader overlay when loading */}
      {loading && <GenerateQuizLoader />}
    </div>
  );
}
