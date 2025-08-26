"use client";

import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

const loadingTexts = [
  "Analyzing your file...",
  "Extracting key concepts...",
  "Generating questions...",
  "Creating answer options...",
  "Adding helpful hints...",
  "Writing explanations...",
  "Almost ready...",
  "Finalizing your quiz...",
];

export default function GenerateQuizLoader() {
  const [currentText, setCurrentText] = useState(loadingTexts[0]);

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % loadingTexts.length;
      setCurrentText(loadingTexts[currentIndex]);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full mx-4 flex flex-col items-center space-y-6">
        <div className="relative">
          <Loader className="w-24 h-24 animate-spin text-indigo-600" />
          <p>Generating......</p>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gradient-to-t from-white dark:from-gray-800 to-transparent" />
        </div>
        
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Generating Your Quiz
          </h3>
          <p className="text-gray-600 dark:text-gray-300 min-h-[24px] transition-all duration-300">
            {currentText}
          </p>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
          <div className="bg-indigo-600 h-1.5 rounded-full animate-[loading_2s_ease-in-out_infinite]" />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
