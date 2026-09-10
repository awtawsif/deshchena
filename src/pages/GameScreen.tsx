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
  const [timeRemainingMs, setTimeRemainingMs] = useState(5000);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isTimed = state.config.difficulty === 'normal' || state.config.difficulty === 'hard';
  const maxTimeMs = state.config.difficulty === 'hard' ? 5000 : 15000;
  const isHardMode = state.config.difficulty === 'hard';
  const effectiveShowLabels = isHardMode ? false : showLabels;

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

  // Question timer effect for timed modes (Normal: 15s, Hard: 5s)
  useEffect(() => {
    if (!isTimed || state.status !== 'in_progress' || !state.currentQuestion) {
      return;
    }

    const startTime = state.questionStartTime;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, maxTimeMs - elapsed);
      setTimeRemainingMs(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        clearAdvanceTimer();
        engine.submitTimeout();
        soundManager.playIncorrect();

        // Reveal missed district and auto-advance after 1.8 seconds
        advanceTimerRef.current = setTimeout(() => {
          engine.advanceQuestion();
        }, 1800);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isTimed, maxTimeMs, state.status, state.currentIndex, state.questionStartTime, engine]);

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
    <div className="w-full h-full flex flex-col landscape:flex-row items-center justify-between max-w-5xl mx-auto animate-in fade-in duration-150 overflow-hidden px-2 sm:px-4">
      {/* Controls column — full-width in portrait, fixed-width sidebar in landscape */}
      <div className="w-full landscape:w-80 landscape:min-w-[240px] shrink-0 landscape:h-full landscape:flex landscape:flex-col landscape:justify-between landscape:max-h-[calc(100vh-7.5rem)] [@media(max-height:500px)_and_(orientation:landscape)]:max-h-[calc(100vh-1.5rem)]">
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
              isTimed={isTimed}
              maxTimeMs={maxTimeMs}
              timeRemainingMs={timeRemainingMs}
              difficulty={state.config.difficulty}
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

        {/* Bottom Controls Toolbar */}
        <footer className="w-full px-3 py-2 shrink-0 flex items-center justify-between border-t border-slate-800/60 text-xs text-slate-400 mt-2 landscape:mt-auto">
          {!isHardMode ? (
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Toggle district name labels on the map"
            >
              {showLabels ? <EyeOff size={13} /> : <Eye size={13} />}
              <span className="hidden sm:inline landscape:hidden">
                {language === 'bn'
                  ? showLabels
                    ? 'লেবেল লুকান'
                    : 'লেবেল দেখান'
                  : showLabels
                  ? 'Hide Labels'
                  : 'Show Labels'}
              </span>
              <span className="sm:hidden landscape:inline">
                {showLabels ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'দেখান' : 'Labels')}
              </span>
            </button>
          ) : (
            <div
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-900/60 text-slate-600 border border-slate-800 cursor-not-allowed text-[11px]"
              title="Labels are disabled in Hard mode"
            >
              <EyeOff size={13} />
              <span>{language === 'bn' ? 'লেবেল নিষ্ক্রিয়' : 'Labels Off (Hard)'}</span>
            </div>
          )}

          <button
            onClick={handleExit}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-800 text-slate-400 border border-slate-700 transition-colors"
            title="Exit game session"
          >
            <X size={13} />
            <span className="hidden sm:inline landscape:hidden">{language === 'bn' ? 'খেলা বন্ধ করুন' : 'Exit Game'}</span>
            <span className="sm:hidden landscape:inline">{language === 'bn' ? 'বন্ধ' : 'Exit'}</span>
          </button>
        </footer>
      </div>

      {/* Map column — flex-1 in landscape takes remaining width */}
      <main className="w-full flex-1 h-full min-h-0 min-w-0 flex items-center justify-center py-1">
        <BangladeshMap
          districtStates={state.districtStates}
          highlightDivisionId={activeDivisionId}
          onDistrictClick={handleDistrictClick}
          showLabels={effectiveShowLabels}
          language={language}
          disabled={state.status === 'evaluating' || state.status === 'completed'}
          className="w-full h-full max-h-[50vh] sm:max-h-[58vh] md:max-h-[64vh] landscape:max-h-[calc(100vh-7.5rem)] [@media(max-height:500px)_and_(orientation:landscape)]:max-h-[calc(100vh-1.5rem)]"
        />
      </main>
    </div>
  );
};
