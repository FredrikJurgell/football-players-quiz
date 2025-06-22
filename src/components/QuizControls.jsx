import React, { useState, useRef, useEffect } from 'react';
import { normalize } from '../utils/normalize';

export function QuizControls({
  section,
  total,
  currentIndex,
  onCorrect,
  onSkip,
  onAbort,
  allPlayers = [],
}) {
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const duration = 30;

  useEffect(() => {
    setGuess('');
    setFeedback('');
    setStartTime(Date.now());
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [currentIndex]);

  const safeGuess = normalize(guess);
  const suggestions = allPlayers
    .filter(player => normalize(player.full_name ?? '').includes(safeGuess))
    .slice(0, 10);

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
      setFeedback('Wrong, try again!');
    }
  };

  const handleKeyDown = e => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[highlightedIndex];
      if (selected) {
        setGuess(selected.full_name);
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col space-y-6 lg:col-span-1">
      <h2 className="text-2xl font-bold text-white">
        Score: <span className="text-green-400">{score}</span> / {total}
      </h2>

      <label htmlFor="guess" className="block text-sm font-medium text-gray-200">
        Enter full name of the player:
      </label>

      <div className="relative">
        <input
          id="guess"
          ref={inputRef}
          className="block w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 
                     focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 
                     focus:ring-offset-2 focus:ring-offset-gray-900 transition-shadow duration-200 py-2 px-4"
          type="text"
          value={guess}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={e => {
            setGuess(e.target.value);
            setFeedback('');
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Start typing a name..."
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="relative mt-1 w-full max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg shadow-md"
          >
            {suggestions.map((player, i) => (
              <li
                key={player.id}
                onMouseDown={() => {
                  setGuess(player.full_name);
                  setShowSuggestions(false);
                }}
                className={`px-4 py-2 text-white cursor-pointer transition ${
                  i === highlightedIndex ? 'bg-indigo-600' : 'hover:bg-gray-700'
                }`}
              >
                {player.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {feedback && <p className="text-red-400 text-sm italic">{feedback}</p>}

      <div className="flex flex-col space-y-3 pt-2">
        <div className="flex space-x-4">
          <button
            onClick={handleGuess}
            disabled={!guess.trim()}
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition"
          >
            Guess
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-white transition"
          >
            Next
          </button>
        </div>
        <button
          onClick={onAbort}
          className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
