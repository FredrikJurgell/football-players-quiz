import React, { useState } from 'react';

export function StartGame({ onStart }) {
  const [difficulty, setDifficulty] = useState(1);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="text-center w-full max-w-sm sm:max-w-md">
        <h1 className="text-4xl font-extrabold text-white mb-6">
          Welcome to the Quiz!
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Choose a difficulty level!
        </p>

        <div className="mb-6 text-center">
          <label htmlFor="difficulty" className="block mb-2 text-white font-medium">
            Difficulty Level:
          </label>
          <ul className="flex flex-col items-center space-y-2">
            {[
              { value: 1, label: 'Easy' },
              { value: 2, label: 'Medium' },
              { value: 3, label: 'Hard' },
              { value: 4, label: 'Extreme' },
            ].map(opt => (
              <li
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={`w-40 text-center text-sm px-3 py-1.5 rounded-md cursor-pointer transition 
                  border border-gray-600 text-white bg-gray-800 hover:bg-gray-700
                  ${difficulty === opt.value ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onStart(difficulty)}
          className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold rounded-2xl shadow-lg transition duration-200 mt-4"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
