// src/components/QuizScreen.jsx
import React, { useEffect } from 'react';
import { QuizCard } from './QuizCard';
import { QuizControls } from './QuizControls';

export function QuizScreen({
  section,
  total,
  currentIndex,
  duration,
  onCorrect,
  onSkip,
  onAbort,
  shuffledAll,
}) {
  useEffect(() => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gray-900 py-4 px-1 sm:py-12 sm:px-6 text-white">
      <div className="max-w-full sm:max-w-4xl lg:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 items-start">
        <div className="prose prose-white max-w-none bg-gray-800 p-1 rounded-2xl shadow-xl lg:col-span-2">
          <QuizCard
            html={section.html}
            questionNumber={currentIndex + 1}
            total={total}
            duration={duration}
          />
        </div>
        <div className="lg:col-span-1 h-[calc(100vh-4rem)] overflow-y-auto">
          <QuizControls
            section={section}
            total={total}
            currentIndex={currentIndex}
            onCorrect={onCorrect}
            onSkip={onSkip}
            onAbort={onAbort}
            allPlayers={shuffledAll}
          />
        </div>
      </div>
    </div>
  );
}
