"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useRef, useState } from "react";
import CircularProgress from "./CircularProgress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";


const QuizSummary = ({
  quizData,
  answers,
  timeSpent,
  onRetake,
  retakesLeft,
  id,
}) => {
  const [loading, setLoading] = useState(false);
  const [avg, setAvg] = useState(0);
  const contentRef = useRef();

  const correctCount = quizData.filter(
    (q, index) => answers[index] === q.correctAnswer
  ).length;
  const percentage = ((correctCount / quizData.length) * 100).toFixed(2);
  const avgTime = (
    timeSpent.reduce((a, b) => a + b, 0) / quizData.length
  ).toFixed(2);

  React.useEffect(() => {
    const perc = Number(percentage);
    setAvg(perc);
  }, [percentage]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (!id) {
        toast.error("Quiz ID is missing");
        return;
      }
      const res = await axios.post("/api/quiz/update", {
        id,
        averageScore: avg,
      });
      if (res.data.success) {
        toast.success("Quiz Completed successfully!");
      } else {
        toast.error(res.data.error || "Failed to update quiz");
      }
    } catch (error) {
      console.log("Error in handleUpdate:", error);
      toast.error("Failed to update quiz");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="container mx-auto w-full border border-indigo-500 bg-white dark:bg-gray-900/40 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="darK:bg-[#111827] bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-500 rounded-2xl rounded-b-none py-5">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#ffffff]">
          Quiz Summary
        </h1>
        
        <div
          ref={contentRef}
          style={{ minHeight: "100px" }}
          className="md:flex justify-center items-center gap-10 mb-6"
        >
          <div>
            <CircularProgress percentage={percentage} />
            <div className=" md:block flex items-center justify-center space-x-3 mt-5">
              {retakesLeft > 0 ? (
                <Button variant={"outline"} onClick={onRetake} className={'bg-white/10 cursor-pointer text-white hover:bg-white/20 hover:text-white'}>
                  Retake Quiz ({retakesLeft} left)
                </Button>
              ) : (
                <Button variant={"outline"} disabled title="No retakes left">
                  No Retakes Left
                </Button>
              )}
              <Link href={"/"}>
                <Button onClick={handleUpdate} variant={"outline"} className={'dark:bg-white cursor-pointer dark:text-black hover:shadow-black hover:bg-white/80 dark:hover:shadow-black dark:hover:bg-white/80'}>
                  Complete
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex md:flex-col flex-row items-center gap-4 mt-5 md:mt-0 mx-4 md:mx-0 text-[#ffffff]">
            <Card className="p-2 md:p-4 w-[180px] text-center bg-transparent text-white border border-white">
              <CardHeader className="px-0 pt-0">
                <CardTitle className={'leading-5 md:leading-none'}>Quiz Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl px-0 pb-0">
                <div>
                  {correctCount} / <span className="">{quizData.length} </span>
                  <span className="text-sm">correct</span>
                </div>
              </CardContent>
            </Card>
            <Card className="p-2 md:p-4 w-[180px] text-center bg-[transparent] border border-white text-white">
              <CardHeader className="px-0 pt-0">
                <CardTitle className={'leading-5 md:leading-none'}>Average Taken Time</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl px-0 pb-0">
                <div>
                  {avgTime}
                  <span className="text-sm"> seconds</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="p-2 md:p-6">
        {quizData.map((quiz, qIndex) => {
          const userAnswer = answers[qIndex];
          const isCorrect = userAnswer === quiz.correctAnswer;

          return (
            <Card
              key={qIndex}
              className=" mt-4 md:mt-0 bg-gray-100 dark:bg-[#11182799] shadow-md rounded-lg text-[#ffffff] border border-indigo-500"
            >
              <CardHeader>
                <CardTitle className={'text-gray-800 dark:text-gray-100'}>
                  Question {qIndex + 1}: {quiz.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong className="text-gray-800 dark:text-gray-100">Your Answer : </strong>
                  <span
                    className={isCorrect ? "text-[#16a34a]" : "text-[#dc2626]"}
                  >
                    {userAnswer || "Not answered"}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-800 dark:text-gray-100">Correct Answer : </strong>
                  <span className="text-[#16a34a]">{quiz.correctAnswer}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-gray-800 dark:text-gray-100">Explanation : </strong> {quiz.explanation}
                </p>
                <p className="text-[#6b7280] text-sm">
                  Time spent : {timeSpent[qIndex]?.toFixed(2) || 0} sec
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSummary;
