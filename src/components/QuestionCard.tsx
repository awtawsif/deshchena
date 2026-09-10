import React from 'react';
import { Question } from '../game/types';
import { getDivisionById } from '../data';
import { calculateLiveSpeedBonus } from '../game/scoring/calculator';
import { MapPin, HelpCircle, Timer } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  language?: 'en' | 'bn';
  showDivisionHint?: boolean;
  onToggleDivisionHint?: () => void;
  isHintActive?: boolean;
  isTimed?: boolean;
  maxTimeMs?: number;
  timeRemainingMs?: number;
  difficulty?: 'relaxed' | 'normal' | 'hard';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  language = 'en',
  showDivisionHint = false,
  onToggleDivisionHint,
  isHintActive = false,
  isTimed = false,
  maxTimeMs = 15000,
  timeRemainingMs = 15000,
  difficulty = 'normal',
}) => {
  const division = getDivisionById(question.divisionId);

  const mainName = language === 'bn' ? question.nameBn : question.name;
  const secondaryName = language === 'bn' ? question.name : question.nameBn;
  const divisionName =
    language === 'bn' ? division?.nameBn : division?.name;

  const secondsLeft = Math.max(0, timeRemainingMs / 1000);
  const timePercent = Math.min(100, Math.max(0, (timeRemainingMs / maxTimeMs) * 100));

  const secondsElapsed = Math.max(0, (maxTimeMs - timeRemainingMs) / 1000);
  const liveSpeedBonus = isTimed ? calculateLiveSpeedBonus(secondsElapsed, difficulty) : 0;

  const dangerThreshold = maxTimeMs <= 5000 ? 1.5 : 3.0;
  const warningThreshold = maxTimeMs <= 5000 ? 3.0 : 7.0;

  const timerColorClass =
    secondsLeft <= dangerThreshold
      ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
      : secondsLeft <= warningThreshold
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
      : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2">
      <div className="bg-slate-800/95 border border-slate-700/80 backdrop-blur-md rounded-2xl p-4 shadow-xl text-center relative overflow-hidden">
        {/* Top bar: Timed mode progress bar or subtle accent bar */}
        {isTimed ? (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900 overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ease-linear ${timerColorClass}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
        ) : (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
        )}

        <div className="flex items-center justify-between gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 px-1">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{language === 'bn' ? 'খুঁজে বের করুন' : 'Find the District'}</span>
          </div>

          {isTimed && (
            <div className="flex items-center gap-1.5">
              {liveSpeedBonus > 0 && (
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/60">
                  +{liveSpeedBonus} speed
                </span>
              )}
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs font-extrabold transition-colors ${
                  secondsLeft <= dangerThreshold
                    ? 'bg-rose-950/90 text-rose-300 border border-rose-500/80 animate-pulse'
                    : secondsLeft <= warningThreshold
                    ? 'bg-amber-950/90 text-amber-300 border border-amber-500/80'
                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/80'
                }`}
              >
                <Timer size={12} />
                <span>{secondsLeft.toFixed(1)}s</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {mainName}
          </h2>
          <span className="text-sm md:text-base font-semibold text-slate-400 font-bangla mt-0.5">
            {secondaryName}
          </span>
        </div>

        {/* Division Badge & Optional Hint Button */}
        <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/80 text-slate-300 border border-slate-600/70">
            {divisionName}{' '}
            {language === 'bn' ? 'বিভাগ' : 'Division'}
          </span>

          {showDivisionHint && onToggleDivisionHint && (
            <button
              onClick={onToggleDivisionHint}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isHintActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white'
              }`}
              title="Highlight division borders on map"
            >
              <HelpCircle size={13} />
              <span>{language === 'bn' ? 'বিভাগ ইঙ্গিত' : 'Division Hint'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
