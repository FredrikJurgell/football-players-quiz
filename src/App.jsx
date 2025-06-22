// src/App.jsx
import React, { useState } from 'react';
import { usePlayers } from './hooks/usePlayers';
import { QuizCard } from './components/QuizCard';
import { QuizControls } from './components/QuizControls';
import { StartGame } from './components/StartGame';

export default function App() {
  const { players, sections, shuffledAll } = usePlayers();
  const [current, setCurrent] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [ended, setEnded] = useState(false);
  const [started, setStarted] = useState(false);
  const duration = 30;

  const nextQuestion = () => {
    if (current + 1 === players.length) {
      setEnded(true);
    } else {
      setCurrent(i => i + 1);
    }
  };

  const handleCorrect = pts => {
    setTotalScore(s => s + pts);
    nextQuestion();
  };

  const handleSkip = () => nextQuestion();

  const handleRestart = () => {
    setStarted(false);     // Gå till startsidan
    setEnded(false);       // Återställ quizstatus
    setCurrent(0);         // Börja från början
    setTotalScore(0);      // Återställ poäng
  };

  if (!started) {
    return <StartGame onStart={() => setStarted(true)} />;
  }

  if (!players.length || sections.length < players.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-300 animate-pulse">Laddar quiz…</p>
      </div>
    );
  }

  if (ended) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Quiz klart!</h1>
          <p className="text-xl text-white mb-6">
            Din totala poäng: <strong>{totalScore}</strong>
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
          >
            Spela igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        <div className="prose prose-white max-w-none bg-gray-800 p-6 rounded-2xl shadow-xl lg:col-span-2">
          <QuizCard
            html={sections[current].html}
            questionNumber={current + 1}
            total={players.length}
            duration={duration}
          />
        </div>
        <QuizControls
          section={sections[current]}
          total={players.length}
          currentIndex={current}
          onCorrect={handleCorrect}
          onSkip={handleSkip}
          onAbort={() => setEnded(true)} // 👈 Avbryt leder till resultatskärmen
          allPlayers={shuffledAll}
        />
      </div>
    </div>
  );
}
