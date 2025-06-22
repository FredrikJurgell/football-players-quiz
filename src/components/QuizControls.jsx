// src/components/QuizControls.jsx
import React, { useState, useRef, useEffect } from 'react';
import { normalize } from '../utils/normalize';

export function QuizControls({
  section,
  total,
  currentIndex,
  onCorrect,
  onSkip,
  onAbort, // 👈 Ny prop
  allPlayers = []
}) {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const inputRef = useRef(null);
  const duration = 30;

  useEffect(() => {
    setGuess('');
    setFeedback('');
    setStartTime(Date.now());
    inputRef.current?.focus();
  }, [currentIndex]);

  const safeGuess = normalize(guess);

  const suggestions = allPlayers.filter(player =>
    normalize(player.full_name ?? '').includes(safeGuess)
  );

  const handleGuess = () => {
    if (!guess.trim()) return;

    const correct = normalize(section.player.full_name ?? '');
    const attempt = safeGuess;

    if (attempt === correct) {
      const elapsed = Date.now() - startTime;
      const pts = Math.max(
        Math.ceil(((duration * 1000 - elapsed) / (duration * 1000)) * 100),
        20
      );
      setScore(s => s + pts);
      onCorrect(pts);
    } else {
      setFeedback('Fel, försök igen. Helständigt namn krävs.');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col space-y-6 lg:col-span-1">
      <h2 className="text-2xl font-bold text-white">
        Poäng: <span className="text-green-400">{score}</span> / {total}
      </h2>

      <label htmlFor="guess" className="block text-sm font-medium text-gray-200">
        Skriv hela spelarens namn:
      </label>

      <input
        id="guess"
        ref={inputRef}
        list="player-options"
        className="block w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 
                   focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 
                   focus:ring-offset-2 focus:ring-offset-gray-900 transition-shadow duration-200 py-2 px-4"
        type="text"
        value={guess}
        onChange={e => {
          setGuess(e.target.value);
          setFeedback('');
        }}
        onKeyDown={e => e.key === 'Enter' && handleGuess()}
        placeholder="Börja skriv namn..."
      />

      <datalist id="player-options">
        {suggestions.map(player => (
          <option key={player.id} value={player.full_name} />
        ))}
      </datalist>

      {feedback && <p className="text-red-400 text-sm italic">{feedback}</p>}

      <div className="flex flex-col space-y-3">
        <div className="flex space-x-4">
          <button
            onClick={handleGuess}
            disabled={!guess.trim()}
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition"
          >
            Gissa
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-white transition"
          >
            Nästa
          </button>
        </div>
        <button
          onClick={onAbort}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
