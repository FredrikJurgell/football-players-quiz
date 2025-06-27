// src/components/Rules.jsx
import React from 'react';

export function Rules() {
  return (
    <div className="mb-6 bg-gray-800 p-4 pb-0 rounded-lg text-gray-300">
      <h2 className="text-xl font-semibold text-white mb-2">How to Play</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>You have <strong>30 seconds</strong> to guess each player.</li>
        <li>Type the player’s <em>full name</em> exactly as it appears on Wikipedia.</li>
        <li>Correct answers earn up to <strong>100 points</strong>, decreasing over time.</li>
        <li>Wrong guesses let you try again until time runs out.</li>
        <li>Click “Next” to skip and see the correct answer (no points awarded).</li>
        <li>At the end, your total score and the full list of correct answers are revealed.</li>
      </ul>
    </div>
  );
}
