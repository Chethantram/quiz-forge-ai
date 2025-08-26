// pages/about-us.jsx or app/about-us/page.tsx (Next.js 13+ app router)
import React from 'react';

export default function AboutUs() {
  return (
    <main className="max-w-4xl mx-auto mt-8 lg:p-8">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-500">About Us</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          We aim to revolutionize learning and assessment by providing an AI-powered personalized question bank that adapts to every user's unique needs. 
          Our platform enables students, educators, and professionals to generate tailored questions effortlessly, helping them prepare better and smarter.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We Do</h2>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          Our AI-driven question bank uses cutting-edge artificial intelligence to generate high-quality, customizable questions across diverse subjects and difficulty levels. 
          Users can create personalized quizzes and exams, receive instant feedback, and track their learning progress—all within a seamless Next.js application.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-400">
          <li>AI-generated questions tailored to your selected subjects and difficulty.</li>
          <li>Personalized quizzes that adapt to your learning goals and pace.</li>
          <li>Instant scoring and detailed progress insights.</li>
          <li>Secure and user-friendly interface built with Next.js for a fast experience.</li>
          <li>Customizable question formats including multiple choice, descriptive, and more.</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          We envision a future where education and skill assessment are democratized through AI technologies. 
          By harnessing the power of AI in a scalable web application, we strive to make personalized learning accessible to learners worldwide.
        </p>
      </section>
    </main>
  );
}
