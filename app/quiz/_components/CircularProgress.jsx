"use client";
import React from "react";

export default function CircularProgress({ percentage }) {
  const radius = 45; // circle radius
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg
        className="w-44 h-44 transform -rotate-90"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          className="dark:text-gray-800 text-gray-800"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={`${percentage >=80 ? "text-green-500" : percentage >=60 ? "text-orange-500" : percentage>=40 ? "text-yellow-400" : "text-red-500"}  transition-all duration-500 ease-in-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Percentage text */}
      <span className="absolute text-white text-2xl font-bold">
        {percentage}%
      </span>
    </div>
  );
}
