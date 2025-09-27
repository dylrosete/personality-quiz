import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Personality Quiz!</h1>
      <p className="mb-6 text-lg text-gray-700">
        Answer the quiz and see your results.
      </p>
      <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
        Start Quiz
      </button>
    </div>
  );
}
