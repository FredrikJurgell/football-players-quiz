// src/App.jsx
import React, { useState } from 'react';
import { usePlayers }    from './hooks/usePlayers';
import { StartGame }     from './components/StartGame';
import { LoadingScreen } from './components/LoadingScreen';
import { QuizScreen }    from './components/QuizScreen';
import { EndScreen }     from './components/EndScreen';

export default function App() {
  const [difficulty, setDifficulty] = useState(1);
  const [reloadKey, setReloadKey]   = useState(0);
  const { players, sections, shuffledAll } = usePlayers(difficulty, reloadKey);

  const [started, setStarted]       = useState(false);
  const [current, setCurrent]       = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [ended, setEnded]           = useState(false);
  const [scores, setScores]         = useState([]);

  const duration = 30;

  const startGame = level => {
    setDifficulty(level);
    setReloadKey(k => k + 1);
    setStarted(true);
    setCurrent(0);
    setTotalScore(0);
    setScores([]);
    setEnded(false);
  };

  const nextQuestion = () => {
    if (current + 1 === sections.length) {
      setEnded(true);
    } else {
      setCurrent(i => i + 1);
    }
  };

  const handleCorrect = pts => {
    setScores(s => [...s, pts]);
    setTotalScore(s => s + pts);
    nextQuestion();
  };

  const handleSkip = () => {
    setScores(s => [...s, 0]);
    nextQuestion();
  };

  const handleRestart = () => {
    setStarted(false);
    setScores([]);
  };

  // 1) Not started yet
  if (!started) {
    return <StartGame onStart={startGame} />;
  }

  // 2) Still loading full quiz (players chosen + infoboxes fetched)
  if (!players.length || sections.length < players.length) {
    return <LoadingScreen />;
  }

  // 3) Finished all questions
  if (ended) {
    return (
      <EndScreen
        score={totalScore}
        sections={sections}
        scores={scores}
        onRestart={handleRestart}
      />
    );
  }

  // 4) Quiz in progress
  return (
    <QuizScreen
      section={sections[current]}
      total={sections.length}
      currentIndex={current}
      duration={duration}
      onCorrect={handleCorrect}
      onSkip={handleSkip}
      onAbort={() => setEnded(true)}
      shuffledAll={shuffledAll}
    />
  );
}
