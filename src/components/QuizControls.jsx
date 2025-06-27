// src/components/QuizControls.jsx
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
  const [guess, setGuess]                     = useState('');
  const [feedback, setFeedback]               = useState('');
  const [score, setScore]                     = useState(0);
  const [startTime, setStartTime]             = useState(Date.now());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const duration = 30;

  useEffect(() => {
    setGuess('');
    setFeedback('');
    setStartTime(Date.now());
    setHighlightedIndex(-1);

    const ua = navigator.userAgent || navigator.vendor || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [currentIndex]);

  const safeGuess = normalize(guess);
  const tokens = safeGuess.split(/\s+/).filter(Boolean);

  const suggestions = allPlayers
    .filter(player => {
      const name = normalize(player.full_name ?? '');
      return tokens.every(tok => name.includes(tok));
    })
    .sort((a, b) => {
      const aR = parseInt(a.overall_rating || '0', 10);
      const bR = parseInt(b.overall_rating || '0', 10);
      return bR - aR;
    })
    .slice(0, 10);

  const handleGuess = () => {
    if (!guess.trim()) return;
    const correct = normalize(section.player.full_name);
    if (safeGuess === correct) {
      const elapsed = Date.now() - startTime;
      const pts = Math.max(
        Math.ceil(((duration * 1000 - elapsed) / (duration * 1000)) * 100),
        20
      );
      setScore(prev => prev + pts);
      onCorrect(pts);
    } else {
      setFeedback('Wrong, try again!');
    }
  };

  const handleKeyDown = e => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(i => (i + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(i => (i - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab' && highlightedIndex >= 0) {
        e.preventDefault();
        const sel = suggestions[highlightedIndex].full_name;
        setGuess(sel);
        setShowSuggestions(false);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const sel = suggestions[highlightedIndex].full_name;
          setGuess(sel);
          setShowSuggestions(false);
        } else {
          handleGuess();
        }
        return;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleGuess();
    }
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-xl flex flex-col space-y-4 sm:space-y-6 lg:col-span-1">
      <h2 className="text-2xl font-bold text-white">
        Score: <span className="text-green-400">{score}</span> / {total}
      </h2>

      <label htmlFor="guess" className="block text-sm font-medium text-gray-200">
        Enter full name of the player:
      </label>

      <div>
        <input
          id="guess"
          ref={inputRef}
          type="text"
          value={guess}
          placeholder="Start typing a name..."
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={e => {
            const v = e.target.value;
            setGuess(v);
            setFeedback('');
            setHighlightedIndex(-1);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          className="
            block w-full rounded-lg bg-gray-700 text-white placeholder-gray-400
            border border-gray-600 focus:outline-none focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
            transition-shadow duration-200 py-2 px-4
          "
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="mt-1 w-full max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg shadow-md">
            {suggestions.map((player, i) => (
              <li
                key={`${player.id}-${i}`}
                onMouseDown={() => {
                  setGuess(player.full_name);
                  setShowSuggestions(false);
                }}
                className={`
                  px-4 py-2 text-white cursor-pointer transition
                  ${i === highlightedIndex ? 'bg-indigo-600' : 'hover:bg-gray-700'}
                `}
              >
                {player.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {feedback && <p className="text-red-400 text-sm italic">{feedback}</p>}

      <div className="flex flex-col space-y-2 pt-2">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={handleGuess}
            disabled={!guess.trim()}
            className="
              w-full sm:flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700
              rounded-lg font-semibold text-white transition
            "
          >
            Guess
          </button>
          <button
            onClick={onSkip}
            className="
              w-full sm:flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700
              rounded-lg font-semibold text-white transition
            "
          >
            Next
          </button>
        </div>
        <button
          onClick={onAbort}
          className="
            w-full py-2 px-4 bg-red-600 hover:bg-red-700
            rounded-lg font-semibold text-white transition
          "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
