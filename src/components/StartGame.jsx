// src/components/StartGame.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Rules } from './Rules';

export function StartGame({ onStart }) {
  const [difficulty, setDifficulty] = useState(1);
  const [showRules, setShowRules]   = useState(false);
  const buttonRef = useRef(null);
  const panelRef  = useRef(null);

  // Only attach outside‐click handler on desktop
  useEffect(() => {
    const onClickOutside = e => {
      if (
        buttonRef.current?.contains(e.target) ||
        panelRef.current?.contains(e.target)
      ) return;
      setShowRules(false);
    };

    // Desktop = width ≥ 768px
    if (showRules && window.innerWidth >= 768) {
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }
  }, [showRules]);

  const levels = [
    { value: 1, label: 'Easy' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'Hard' },
    { value: 4, label: 'Extreme' },
  ];

  return (
    <div className="h-screen relative flex flex-col items-center justify-center bg-gray-900 px-4">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
        Welcome to the Quiz!
      </h1>

      {/* Difficulty & Start */}
      <div className="w-full max-w-sm sm:max-w-md text-center">
        <p className="text-lg text-gray-300 mb-4">Choose a difficulty level!</p>
        <ul className="flex flex-col items-center space-y-4 mb-6">
          {levels.map(opt => (
            <li
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`
                w-40 text-center text-sm px-3 py-1.5 rounded-md cursor-pointer transition
                border border-gray-600 text-white bg-gray-800 hover:bg-gray-700
                ${difficulty === opt.value ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}
              `}
            >
              {opt.label}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onStart(difficulty)}
          className="
            w-full px-6 py-3 sm:px-8 sm:py-4
            bg-blue-600 hover:bg-blue-700 text-white font-semibold
            rounded-2xl shadow-lg transition duration-200
          "
        >
          Start Quiz
        </button>
      </div>

      {/* Single “?” help button */}
      <button
        ref={buttonRef}
        onClick={() => setShowRules(r => !r)}
        className="
          absolute top-4 right-4
          md:bottom-8 md:right-8 md:top-auto
          w-10 h-10 bg-gray-700 hover:bg-gray-600
          text-white rounded-full shadow-lg
          flex items-center justify-center z-20
        "
      >
        ?
      </button>

      {/* Rules panel */}
      {showRules && (
        <>
          {/* Mobile: full‐screen modal */}
          {window.innerWidth < 768 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
              <div
                ref={panelRef}
                className="bg-gray-800 w-full mx-4 max-h-[80vh] overflow-auto p-4 rounded-lg"
              >
                <Rules />
                <button
                  onClick={() => setShowRules(false)}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Desktop: upward‐expanding dropdown */}
          {window.innerWidth >= 768 && (
            <div
              ref={panelRef}
              className="
                absolute bottom-20 right-8
                w-64 bg-gray-800 rounded-lg shadow-lg
                max-h-[70vh] overflow-auto z-20
              "
            >
              <div className="p-2">
                <Rules />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
