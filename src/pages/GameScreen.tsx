import React, { useEffect, useState, useRef } from 'react';
import { GameEngine } from '../game/engine/GameEngine';
import { GameState } from '../game/types';
import { BangladeshMap } from '../map/BangladeshMap';
import { ScoreBoard } from '../components/ScoreBoard';
import { QuestionCard } from '../components/QuestionCard';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { soundManager } from '../utils/audio';
import { Eye, EyeOff, X } from 'lucide-react';

interface GameScreenProps {
  engine: GameEngine;
  language: 'en' | 'bn';
  onGameOver: () => void;
  onExitToHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  engine,
  language,
  onGameOver,
  onExitToHome,
}) => {
  const [state, setState] = useState<GameState>(engine.getState());
  const [showLabels, setShowLabels] = useState(false);
  const [showDivisionHint, setShowDivisionHint] = useState(
    state.config.difficulty === 'relaxed'
  );
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to engine state
  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
      if (newState.status === 'completed') {
        onGameOver();
      }
    });
    return () => {
      unsubscribe();
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, [engine, onGameOver]);

  const clearAdvanceTimer = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  const handleDistrictClick = (districtId: string) => {
    if (state.status !== 'in_progress') return;

    clearAdvanceTimer();
    const result = engine.submitAnswer(districtId);

    if (result.isCorrect) {
      soundManager.playCorrect();
      // Brief advance delay for seamless gameplay
      advanceTimerRef.current = setTimeout(() => {
        engine.advanceQuestion();
      }, 700);
    } else {
      soundManager.playIncorrect();
      // Longer delay on mistake so user sees the revealed target district
      advanceTimerRef.current = setTimeout(() => {
        engine.advanceQuestion();
      }, 1800);
    }
  };

  const handleManualAdvance = () => {
    clearAdvanceTimer();
    engine.advanceQuestion();
  };

  const handleExit = () => {
    clearAdvanceTimer();
    onExitToHome();
  };

  const activeDivisionId =
    showDivisionHint && state.currentQuestion
      ? state.currentQuestion.divisionId
      : null;

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-5xl mx-auto animate-in fade-in duration-150">
      {/* Top Section: Scoreboard & Question Card */}
      <div className="w-full shrink-0">
        <ScoreBoard
          currentIndex={state.currentIndex}
          totalQuestions={state.questions.length}
          score={state.score}
          streak={state.streak}
          startTime={state.startTime}
          isPaused={state.status === 'completed'}
          language={language}
        />

        {state.currentQuestion && (
          <QuestionCard
            question={state.currentQuestion}
            language={language}
            showDivisionHint={state.config.difficulty === 'relaxed'}
            isHintActive={showDivisionHint}
            onToggleDivisionHint={() => setShowDivisionHint(!showDivisionHint)}
          />
        )}

        {/* Instant Answer Feedback Banner */}
        {state.lastAnswerResult && (
          <FeedbackBanner
            result={state.lastAnswerResult}
            language={language}
            onAdvance={handleManualAdvance}
          />
        )}
      </div>

      {/* Center Section: Interactive SVG Map */}
      <main className="w-full flex-1 flex items-center justify-center py-2 min-h-[360px] md:min-h-[500px]">
        <BangladeshMap
          districtStates={state.districtStates}
          highlightDivisionId={activeDivisionId}
          onDistrictClick={handleDistrictClick}
          showLabels={showLabels}
          language={language}
          disabled={state.status === 'evaluating' || state.status === 'completed'}
          className="max-h-[60vh] md:max-h-[70vh]"
        />
      </main>

      {/* Bottom Controls Toolbar */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-2 shrink-0 flex items-center justify-between border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Toggle district name labels on the map"
          >
            {showLabels ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>
              {language === 'bn'
                ? showLabels
                  ? 'লেবেল লুকান'
                  : 'লেবেল দেখান'
                : showLabels
                ? 'Hide Labels'
                : 'Show Labels'}
            </span>
          </button>
        </div>

        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-800 text-slate-400 border border-slate-700 transition-colors"
          title="Exit game session"
        >
          <X size={14} />
          <span>{language === 'bn' ? 'খেলা বন্ধ করুন' : 'Exit Game'}</span>
        </button>
      </footer>
    </div>
  );
};
