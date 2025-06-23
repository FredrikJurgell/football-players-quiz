import React from 'react';
import { AnswerList } from './AnswerList';

export function EndScreen({ score, sections, scores = [], onRestart }) {
  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gray-900 px-4 py-8 overflow-y-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Quiz finished!</h1>
        <p className="text-xl text-white">
          Your total score: <strong>{score}</strong>
        </p>
      </div>

      <AnswerList sections={sections} scores={scores} />

      <button
        onClick={onRestart}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
      >
        Play again
      </button>
    </div>
  );
}
