// src/components/AnswerList.jsx
import React, { useState } from 'react';

export function AnswerList({ sections = [], scores = [] }) {
  // track which question is currently expanded (or null)
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = idx => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6 mb-8">
      <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2">
        Correct Answers
      </h2>

      {sections.map((section, idx) => {
        const name = section.player.full_name;
        const pts  = scores[idx] ?? 0;
        const isOpen = openIndex === idx;

        return (
          <div key={idx} className="space-y-2">
            {/* clickable header */}
            <button
              onClick={() => handleToggle(idx)}
              className="w-full flex justify-between items-center text-gray-200 hover:text-white focus:outline-none"
            >
              <span>
                Question {idx + 1}:{' '}
                <span className="font-medium text-white">{name}</span>
              </span>
              <span className="font-semibold text-green-400">{pts} pts</span>
            </button>

            {/* only the open one renders its infobox */}
            {isOpen && (
              <div
                className="text-white p-4 rounded-lg overflow-auto prose prose-white max-h-80"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
