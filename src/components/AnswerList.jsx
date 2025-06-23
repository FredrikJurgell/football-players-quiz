import React from 'react';

export function AnswerList({ sections, scores = [] }) {
  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4 mb-8">
      <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
        Correct Answers
      </h2>
      {sections.map((section, idx) => {
        // Extract the player name and make sure it's a string
        const name = section.player?.full_name ?? 'Unknown';
        const pts  = scores[idx] ?? 0;
        return (
          <div
            key={idx}
            className="flex justify-between items-center text-gray-200"
          >
            <div>
              <span className="mr-2">Question {idx + 1}:</span>
              <span className="font-medium text-white">{name}</span>
            </div>
            <span className="font-semibold text-green-400">{pts} pts</span>
          </div>
        );
      })}
    </div>
  );
}
