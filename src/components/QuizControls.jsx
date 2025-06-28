// src/components/QuizControls.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [score, setScore]                     = useState(0);
  const [startTime, setStartTime]             = useState(Date.now());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [result, setResult]                   = useState(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const duration = 30;

  // Reset per question
  useEffect(() => {
    setGuess('');
    setStartTime(Date.now());
    setHighlightedIndex(-1);
    setResult(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // autofocus on desktop only
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      inputRef.current?.focus();
    }
  }, [currentIndex]);

  // Build & sort suggestions
  const safeGuess = normalize(guess);
  const tokens    = safeGuess.split(/\s+/).filter(Boolean);
  const suggestions = allPlayers
    .filter(p => tokens.every(tok => normalize(p.full_name ?? '').includes(tok)))
    .sort((a, b) => Number(b.overall_rating) - Number(a.overall_rating))
    .slice(0, 10);

  // Handle “Guess”
  function handleGuess() {
    if (!guess.trim()) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const correctKey = normalize(section.player.full_name);
    if (safeGuess === correctKey) {
      const elapsed = Date.now() - startTime;
      const pts = Math.max(
        Math.ceil(((duration * 1000 - elapsed) / (duration * 1000)) * 100),
        20
      );
      setScore(s => s + pts);
      setResult({ type: 'success', text: `✔️ Correct! +${pts} pts` });
      timeoutRef.current = setTimeout(() => {
        setResult(null);
        onCorrect(pts);
        timeoutRef.current = null;
      }, 2000);
    } else {
      setResult({ type: 'error', text: '❌ Wrong, try again!' });
      timeoutRef.current = setTimeout(() => {
        setResult(null);
        timeoutRef.current = null;
      }, 2000);
    }
  }

  // Handle “Next”
  function handleNext() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setResult({ type: 'info', text: `ℹ️ Answer: ${section.player.full_name}` });
    timeoutRef.current = setTimeout(() => {
      setResult(null);
      onSkip();
      timeoutRef.current = null;
    }, 2000);
  }

  // Keyboard & navigation
  function handleKeyDown(e) {
    if (showSuggestions && suggestions.length) {
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
        setGuess(suggestions[highlightedIndex].full_name);
        setShowSuggestions(false);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          setGuess(suggestions[highlightedIndex].full_name);
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
  }

  // Anim + border style
  const shakeAnim   = result?.type === 'error'   ? { x: [0, -5, 5, -5, 5, 0] } : {};
  const borderClass = result?.type === 'success' ? 'ring-2 ring-green-400' : '';

  return (
    <div className="bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-xl flex flex-col">
      {/* Top half: score, input, suggestions */}
      <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
        <h2 className="text-2xl font-bold text-white">
          Score: <span className="text-green-400">{score}</span>
        </h2>

        <label htmlFor="guess" className="text-sm text-gray-200">
          Enter full name of the player:
        </label>

        <motion.input
          animate={shakeAnim}
          transition={{ duration: 0.4 }}
          id="guess"
          ref={inputRef}
          type="text"
          value={guess}
          placeholder="Start typing a name..."
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={e => {
            setGuess(e.target.value);
            setHighlightedIndex(-1);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          className={`
            block w-full rounded-lg bg-gray-700 placeholder-gray-400
            border border-gray-600 focus:outline-none focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
            text-white py-2 px-4 transition ${borderClass}
          `}
        />

        {/* Suggestions placeholder: always 32 units tall */}
        <div className="relative h-32">
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute inset-0 w-full overflow-y-auto
                           bg-gray-800 border border-gray-600 rounded-lg shadow-md">
              {suggestions.map((p, i) => (
                <li
                  key={`${p.id}-${i}`}
                  onMouseDown={() => {
                    setGuess(p.full_name);
                    setShowSuggestions(false);
                  }}
                  className={`
                    px-4 py-2 cursor-pointer text-white transition
                    ${i === highlightedIndex ? 'bg-indigo-600' : 'hover:bg-gray-700'}
                  `}
                >
                  {p.full_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Feedback badge directly under suggestions */}
        <div className="min-h-[1.5rem]">
          {result && (
            <p className={`text-sm ${
              result.type === 'success' ? 'text-green-400' :
              result.type === 'error'   ? 'text-red-400'   :
                                           'text-gray-300'
            }`}>
              {result.text}
            </p>
          )}
        </div>
      </div>

      {/* Bottom: Guess / Next / Cancel */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={handleGuess}
            disabled={!guess.trim()}
            className="w-full sm:w-2/3 py-2 bg-indigo-600 hover:bg-indigo-700
                       rounded-lg font-semibold text-white transition"
          >
            Guess
          </button>
          <button
            onClick={handleNext}
            className="w-full sm:w-1/3 py-2 bg-gray-600 hover:bg-gray-700
                       rounded-lg font-semibold text-white transition"
          >
            Next
          </button>
        </div>
        <button
          onClick={onAbort}
          className="w-full py-2 bg-red-600 hover:bg-red-700
                     rounded-lg font-semibold text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
