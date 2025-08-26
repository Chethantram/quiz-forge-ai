"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import NavigationLoader from "@/components/navigation-loader";


export default function QuizList({params}) {
    const quizId = params?.quizId;
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quiz, setQuiz] = useState({});
  const [quizData,setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
   const fetchQuiz = async() =>{
    try {
        const res = await axios.post('/api/quiz/get',{id:quizId});
        if(res?.data?.success)
        {
            setQuiz(res?.data?.data)
            setQuizData(res?.data?.data?.questions);

        }else{
            toast.error("something is wrong");
        }
        
    } catch (error) {
        console.log(error);
    }
    setLoading(false);
   }
   fetchQuiz();
  }, []);

  if(loading)
  {
    return <NavigationLoader/>
  }
  return (
    <div className="max-w-2xl mx-auto md:p-6 space-y-4 mt-5 md:mt-8 lg-mt-0">
      {quizData.map((quiz,index) => (
        <Card
          key={quiz.id}
          className="shadow-sm rounded-2xl border border-indigo-500 dark:border-indigo-400 bg-gray-100 dark:bg-gray-900 hover:shadow-lg transition dark:hover:shadow-white/20"
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {index+1} . {quiz.question}
              <Button
                variant="outline"
                className={'cursor-pointer'}
                onClick={() =>
                  setActiveQuiz(activeQuiz === quiz._id ? null : quiz._id)
                }
              >
                {activeQuiz === quiz._id ? "Hide" : "View"}
              </Button>
            </CardTitle>
          </CardHeader>

          {activeQuiz === quiz._id && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {quiz.options.map((option, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border ${
                      option === quiz.correctAnswer
                        ? "bg-green-100 dark:bg-gray-800 dark:text-green-500  border-green-500"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-gray-800 border border-blue-200">
                <p className="font-semibold">Explanation:</p>
                <p className="text-sm">{quiz.explanation}</p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
