import React from 'react';
import { QuizCard }     from './QuizCard';
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
  return (
    <div className="min-h-screen bg-gray-900 py-4 px-0 sm:py-12 sm:px-6 text-white">
      <div className="max-w-full sm:max-w-4xl lg:max-w-7xl mx-auto 
                      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        <div className="prose prose-white max-w-none bg-gray-800 p-0 rounded-2xl lg:col-span-2">
          <QuizCard
            html={section.html}
            questionNumber={currentIndex + 1}
            total={total}
            duration={duration}
          />
        </div>
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
  );
}
