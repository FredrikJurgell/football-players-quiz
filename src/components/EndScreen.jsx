import React from 'react';
import { AnswerList } from './AnswerList';

export function EndScreen({ score, sections, scores = [], onRestart }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 p-4">
      {/* One dark panel containing everything */}
      <div className="w-full max-w-2xl h-full bg-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header stays fixed */}
        <header className="px-6 py-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white text-center">Quiz finished!</h1>
          <p className="text-lg text-gray-300 text-center mt-1">
            Your total score: <span className="text-white font-semibold">{score}</span>
          </p>
        </header>

        {/* Scrollable list */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <AnswerList sections={sections} scores={scores} />
        </div>

        {/* Footer stays fixed */}
        <footer className="px-6 py-4 border-t border-gray-700 text-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition"
          >
            Play again
          </button>
        </footer>
      </div>
    </div>
  );
}
