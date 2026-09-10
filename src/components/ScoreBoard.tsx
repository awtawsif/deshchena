import React, { useEffect, useState } from 'react';
import { Flame, Clock, Trophy } from 'lucide-react';

interface ScoreBoardProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  startTime: number;
  isPaused?: boolean;
  language?: 'en' | 'bn';
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  currentIndex,
  totalQuestions,
  score,
  streak,
  startTime,
  isPaused = false,
  language = 'en',
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (isPaused || !startTime) return;

    const interval = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  const progressPercent = Math.min(100, Math.round((currentIndex / totalQuestions) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      {/* Top row of stats */}
      <div className="flex items-center justify-between gap-2 text-xs md:text-sm font-semibold text-slate-300">
        {/* Question Counter */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="text-slate-400">
            {language === 'bn' ? 'প্রশ্ন' : 'Question'}:
          </span>
          <span className="text-white font-bold">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-sm text-slate-200">
          <Clock size={15} className="text-teal-400" />
          <span className="font-mono">{formatTime(elapsed)}</span>
        </div>

        {/* Streak */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 shadow-sm ${
            streak > 2
              ? 'bg-amber-950/70 border-amber-600/80 text-amber-300 animate-pulse'
              : 'bg-slate-800/90 border-slate-700/80 text-slate-300'
          }`}
        >
          <Flame
            size={16}
            className={streak > 2 ? 'text-amber-400' : 'text-slate-500'}
          />
          <span>
            {language === 'bn' ? 'ধারাবাহিক' : 'Streak'}:{' '}
            <strong className="text-white">{streak}</strong>
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-lg shadow-sm text-emerald-400">
          <Trophy size={15} className="text-emerald-400" />
          <span className="font-bold text-white">{score.toLocaleString()}</span>
          <span className="text-xs text-slate-400">pts</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-700/50">
        <div
          className="bg-emerald-500 h-1.5 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
