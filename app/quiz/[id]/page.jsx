"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import QuizSummary from "../_components/QuizSummary";

const QuizPage = ({ params }) => {
  const id = params?.id;
  const [quizData, setQuizData] = useState([]);
  const [language, setLanguage] = useState("English");
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [retakesLeft, setRetakesLeft] = useState(2); // Initialize with 2 retakes

  // Track timing
  const [timeSpent, setTimeSpent] = useState([]); // per question
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/quiz/get', JSON.stringify({ id }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      if (data?.success && data?.data?.questions) {
        setLanguage(data?.data?.language)
        setQuizData(data.data.questions);
      } else {
        setError(data?.error || 'Failed to fetch quiz data');
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setError(error?.response?.data?.error || error.message || 'Failed to fetch quiz');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleAnswerSelect = (answer) => {
  //   setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  // };

  const handleNext = () => {
    const now = Date.now();
    const timeTaken = (now - questionStartTime) / 1000; // seconds
    const updatedTimeSpent = [...timeSpent];
    updatedTimeSpent[currentIndex] = (updatedTimeSpent[currentIndex] || 0) + timeTaken;
    setTimeSpent(updatedTimeSpent);
    
    // Save current state to localStorage
    const quizState = {
      answers,
      timeSpent: updatedTimeSpent,
      lastQuestionIndex: currentIndex
    };
    localStorage.setItem(`quiz-${id}-state`, JSON.stringify(quizState));

    if (currentIndex < quizData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      handleCompletion();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleRetake = () => {
    if (retakesLeft > 0) {
      // Reset quiz state
      setAnswers({});
      setTimeSpent([]);
      setCurrentIndex(0);
      setShowSummary(false);
      setQuestionStartTime(Date.now());
      setRetakesLeft(prev => prev - 1);
      
      // Update localStorage
      localStorage.removeItem(`quiz-${id}-completed`);
      localStorage.removeItem(`quiz-${id}-state`);
      localStorage.setItem(`quiz-${id}-retakes`, retakesLeft - 1);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuizData();
      
      // Check localStorage for quiz state, completion, and retakes
      const isCompleted = localStorage.getItem(`quiz-${id}-completed`);
      const savedState = localStorage.getItem(`quiz-${id}-state`);
      const savedRetakes = localStorage.getItem(`quiz-${id}-retakes`);
      
      if (savedRetakes !== null) {
        setRetakesLeft(parseInt(savedRetakes));
      }
      
      if (isCompleted) {
        setShowSummary(true);
        if (savedState) {
          const state = JSON.parse(savedState);
          setAnswers(state.answers || {});
          setTimeSpent(state.timeSpent || []);
        }
      } else if (savedState) {
        // Restore in-progress quiz state
        const state = JSON.parse(savedState);
        setAnswers(state.answers || {});
        setTimeSpent(state.timeSpent || []);
        setCurrentIndex(state.lastQuestionIndex || 0);
      }
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 p-4">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={fetchQuizData} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="text-center mt-10 p-4">
        <p className="mb-4">No questions found for this quiz.</p>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Normal quiz view
  const quiz = quizData[currentIndex];
  const selectedAnswer = answers[currentIndex];

  // Store completion status when quiz is finished
  const handleAnswerSelect = (answer) => {
    const updatedAnswers = { ...answers, [currentIndex]: answer };
    setAnswers(updatedAnswers);
    
    // Save current state to localStorage
    const quizState = {
      answers: updatedAnswers,
      timeSpent,
      lastQuestionIndex: currentIndex
    };
    localStorage.setItem(`quiz-${id}-state`, JSON.stringify(quizState));
  };

  const handleCompletion = () => {
    // Save final state
    const finalState = {
      answers,
      timeSpent,
      lastQuestionIndex: currentIndex
    };
    localStorage.setItem(`quiz-${id}-state`, JSON.stringify(finalState));
    localStorage.setItem(`quiz-${id}-completed`, 'true');
    setShowSummary(true);
  };

  return (
    <div className="container mx-auto md:p-4 w-full mt-8 md:mt-8 lg:mt-14">
      {showSummary ? (
        <QuizSummary
          quizData={quizData}
          answers={answers}
          timeSpent={timeSpent}
          retakesLeft={retakesLeft}
          onRetake={handleRetake}
          id={id}
        />
      ) : (
        <>
        <div className="flex justify-between items-center mb-6 text-md md:text-lg font-semibold">
        <span className="text-gray-800 dark:text-gray-100">
          Question {currentIndex + 1} of {quizData.length}
        </span>
        <span className="text-gray-800 dark:text-gray-100">
          Answered: {Object.keys(answers).length} / {quizData.length}
        </span>
        </div>

        <Card className={'border border-indigo-500 bg-gray-100 dark:bg-gray-900/70'}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
          <Badge
          className={`${quiz.difficulty === 'easy' ? "bg-green-500" : quiz.difficulty === "medium" ? "bg-orange-500":"bg-red-500"} text-white`}
          >
            {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
          </Badge>
          <Badge className={'bg-indigo-500 text-white'} variant="default">{language.charAt(0).toUpperCase() + language.slice(1)}</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">
          Question {currentIndex + 1}: {quiz.question}
          </h1>
          {quiz?.options?.map((option, index) => (
          <Button
            key={index}
            variant={'outline'}
            className={`${selectedAnswer === option ? "bg-indigo-400 hover:bg-indigo-400 text-white hover:text-white dark:bg-indigo-400 dark:hover:bg-indigo-400" : ""} w-full text-left justify-start cursor-pointer`}
            onClick={() => handleAnswerSelect(option)}
          >
            {option}
          </Button>
          ))}
        </CardContent>
        </Card>
        </>)}
        
        {!showSummary && (
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentIndex === 0}
              className={'border border-gray-800/50 dark:border-white/50 dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-indigo-100'}
            >
              ← Previous
            </Button>
            <Button onClick={handleNext} variant="secondary" className={`${currentIndex === quizData.length - 1 ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700":"hover:bg-indigo-100 dark:hover:bg-gray-800 dark:bg-gray-900"} border border-gray-800/50 dark:border-white/50   `}>
              {currentIndex === quizData.length - 1 ? "Finish Quiz" : "Next →"}
            </Button>
          </div>
        )}
      </div>
    );
};

export default QuizPage;
