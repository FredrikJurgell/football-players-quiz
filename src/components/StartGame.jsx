import React from 'react';

/**
 * StartGame
 * En komponent som visar en startskärm för quizet och startar spelet vid knapptryck.
 *
 * Props:
 * - onStart: () => void — Callback som anropas när spelet ska startas
 */
export function StartGame({ onStart }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6">Välkommen till Quizet!</h1>
        <p className="text-lg text-gray-300 mb-8">
          Testa dina kunskaper och få poäng för varje rätt svar.
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition duration-200"
        >
          Starta quiz
        </button>
      </div>
    </div>
  );
}
