import React, { useState, useMemo } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { districts } from './data';
import { GameEngine } from './game/engine/GameEngine';
import { GameConfig } from './game/types';
import { Header } from './components/Header';
import { HomeScreen } from './pages/HomeScreen';
import { GameScreen } from './pages/GameScreen';
import { ResultsScreen } from './pages/ResultsScreen';

type ScreenState = 'home' | 'game' | 'results';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [language, setLanguage] = useState<'en' | 'bn'>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('deshchena_lang');
        if (saved === 'en' || saved === 'bn') return saved;
      }
    } catch {
      // Ignore
    }
    return 'en';
  });

  const [lastConfig, setLastConfig] = useState<GameConfig>({
    questionCount: 25,
    difficulty: 'normal',
  });

  // Keep a reference to the active engine instance
  const [engine, setEngine] = useState<GameEngine>(() => new GameEngine(districts));

  const handleToggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('deshchena_lang', next);
      }
    } catch {
      // Ignore
    }
  };

  const handleStartGame = (config: GameConfig) => {
    setLastConfig(config);
    const newEngine = new GameEngine(districts);
    newEngine.startGame(config);
    setEngine(newEngine);
    setScreen('game');
  };

  const handlePlayAgain = () => {
    const newEngine = new GameEngine(districts);
    newEngine.startGame(lastConfig);
    setEngine(newEngine);
    setScreen('game');
  };

  const handlePracticeMistakes = () => {
    try {
      const practiceEngine = engine.createPracticeSession(lastConfig.difficulty);
      setEngine(practiceEngine);
      setScreen('game');
    } catch (e) {
      console.error(e);
    }
  };

  const currentGameState = useMemo(() => engine.getState(), [engine, screen]);

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white overflow-hidden">
      {/* Universal Header */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onHomeClick={() => setScreen('home')}
      />

      {/* Screen Routing */}
      <main
        className={`flex-1 flex flex-col min-h-0 ${
          screen === 'game'
            ? 'overflow-hidden px-2 py-1 sm:px-4 sm:py-2 justify-center'
            : 'overflow-y-auto px-4 py-4 sm:py-6 justify-start'
        }`}
      >
        {screen === 'home' && (
          <HomeScreen
            language={language}
            onStartGame={handleStartGame}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            key={engine.getState().startTime}
            engine={engine}
            language={language}
            onGameOver={() => setScreen('results')}
            onExitToHome={() => setScreen('home')}
          />
        )}

        {screen === 'results' && (
          <ResultsScreen
            state={currentGameState}
            language={language}
            onPlayAgain={handlePlayAgain}
            onPracticeMistakes={handlePracticeMistakes}
            onHome={() => setScreen('home')}
          />
        )}
      </main>
      <Analytics />
    </div>
  );
};
