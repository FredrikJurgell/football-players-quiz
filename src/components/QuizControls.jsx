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
  const [guess, setGuess]                       = useState('');
  const [score, setScore]                       = useState(0);
  const [startTime, setStartTime]               = useState(Date.now());
  const [showSuggestions, setShowSuggestions]   = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [result, setResult]                     = useState(null); // { type: 'success'|'error'|'info', text }
  const inputRef = useRef(null);
  const duration = 30;

  // Reset on question change, autofocus on desktop
  useEffect(() => {
    setGuess('');
    setStartTime(Date.now());
    setHighlightedIndex(-1);
    setResult(null);

    const ua = navigator.userAgent || navigator.vendor || '';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [currentIndex]);

  // Build suggestions list
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

  // Handle a guess attempt
  const handleGuess = () => {
    if (!guess.trim()) return;
    const correctName = normalize(section.player.full_name);
    if (safeGuess === correctName) {
      const elapsed = Date.now() - startTime;
      const pts = Math.max(
        Math.ceil(((duration * 1000 - elapsed) / (duration * 1000)) * 100),
        20
      );
      setScore(prev => prev + pts);
      setResult({ type: 'success', text: `✔️ Correct! +${pts} pts` });
      setTimeout(() => {
        setResult(null);
        onCorrect(pts);
      }, 2000);
    } else {
      setResult({ type: 'error', text: '❌ Wrong, try again!' });
      setTimeout(() => setResult(null), 2000);
    }
  };

  // Handle pressing Next: show correct answer then advance
  const handleNext = () => {
    setResult({ type: 'info', text: `Correct answer: ${section.player.full_name}` });
    setTimeout(() => {
      setResult(null);
      onSkip();
    }, 2000);
  };

  // Keyboard navigation & Enter/Tab behavior
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
  };

  // Animation on error; green ring on success
  const shakeAnim = result?.type === 'error' ? { x: [0, -8, 8, -8, 8, 0] } : {};
  const borderClass = result?.type === 'success' ? 'ring-2 ring-green-400' : '';

  return (
    <div className="bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-xl flex flex-col space-y-4 sm:space-y-6 lg:col-span-1">
      <h2 className="text-2xl font-bold text-white">
        Score: <span className="text-green-400">{score}</span>
      </h2>

      <label htmlFor="guess" className="block text-sm font-medium text-gray-200">
        Enter full name of the player:
      </label>

      <motion.div animate={shakeAnim} transition={{ duration: 0.5 }}>
        <input
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
            block w-full rounded-lg bg-gray-700 text-white placeholder-gray-400
            border border-gray-600 focus:outline-none focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
            transition-shadow duration-200 py-2 px-4 ${borderClass}
          `}
        />
      </motion.div>

      {result && (
        <div className={`
          text-sm italic 
          ${result.type === 'error' ? 'text-red-400' :
            result.type === 'success' ? 'text-green-400' : 'text-gray-300'}
        `}>
          {result.text}
        </div>
      )}

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

      <div className="flex flex-col space-y-2 pt-2">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          {/* Guess = 2/3 width on desktop */}
          <button
            onClick={handleGuess}
            disabled={!guess.trim()}
            className="w-full sm:flex-[2] py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-white transition"
          >
            Guess
          </button>
          {/* Next = 1/3 width on desktop */}
          <button
            onClick={handleNext}
            className="w-full sm:flex-[1] py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold text-white transition"
          >
            Next
          </button>
        </div>
        <button
          onClick={onAbort}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
