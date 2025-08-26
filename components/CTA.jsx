"use client";

import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="relative  bg-gradient-to-r from-indigo-600 rounded-xl to-purple-600 py-20 px-6 text-center text-white w-full shadow-xl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Ready to Supercharge Your Learning?
        </h2>
        <p className="text-md md:text-lg text-indigo-100 mb-8">
          Join QuizForge AI today and start mastering concepts with interactive quizzes and AI-powered insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-white text-indigo-600 hover:bg-gray-200 font-semibold px-6 py-3 rounded-lg shadow-md">
            Get Started
          </Button>
          <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-6 py-3 rounded-lg shadow-md">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
