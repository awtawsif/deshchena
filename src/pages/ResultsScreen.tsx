import React, { useEffect } from 'react';
import { Trophy, Flame, RotateCcw, Home, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';
import { GameState } from '../game/types';
import { getDistrictById, getDivisionById } from '../data';
import { soundManager } from '../utils/audio';

interface ResultsScreenProps {
  state: GameState;
  language?: 'en' | 'bn';
  onPlayAgain: () => void;
  onPracticeMistakes: () => void;
  onHome: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  state,
  language = 'en',
  onPlayAgain,
  onPracticeMistakes,
  onHome,
}) => {
  useEffect(() => {
    soundManager.playVictory();
  }, []);

  const { score, correctAnswers, incorrectAnswers, bestStreak, totalTimeSeconds, accuracyPercentage, mistakes } =
    state;
  const totalQuestions = correctAnswers + incorrectAnswers;

  const hasMistakes = mistakes.length > 0;
  const isPractice =
    state.config.mode === 'practice' || state.config.difficulty === 'relaxed';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center text-center animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-4 shadow-sm">
        <Trophy size={15} className="text-emerald-400" />
        <span>
          {accuracyPercentage === 100
            ? isPractice
              ? language === 'bn'
                ? 'নিখুঁত অনুশীলন!'
                : 'PERFECT PRACTICE!'
              : language === 'bn'
              ? 'নিখুঁত ফলাফল!'
              : 'PERFECT GAME!'
            : isPractice
            ? language === 'bn'
              ? 'অনুশীলন সমাপ্ত!'
              : 'PRACTICE COMPLETE!'
            : language === 'bn'
            ? 'খেলা সমাপ্ত!'
            : 'GAME COMPLETE!'}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
        {accuracyPercentage >= 90
          ? language === 'bn'
            ? 'চমৎকার পারফরম্যান্স!'
            : 'Outstanding Job!'
          : accuracyPercentage >= 70
          ? language === 'bn'
            ? 'ভালো খেলেছেন!'
            : 'Well Done!'
          : language === 'bn'
          ? 'অনুশীলন চালিয়ে যান!'
          : 'Keep Practicing!'}
      </h1>

      {/* Accuracy Gauge & Score */}
      <div className="w-full bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl my-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Accuracy circle display */}
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl font-black text-emerald-400 tracking-tight">
              {accuracyPercentage}%
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              {language === 'bn' ? 'সঠিকতা' : 'Accuracy'}
            </span>
          </div>

          <div className="h-px md:h-16 w-full md:w-px bg-slate-700" />

          {/* Final Stat — Score in competitive, Correct count in practice */}
          <div className="flex flex-col items-center">
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {isPractice
                ? `${correctAnswers}`
                : score.toLocaleString()}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              {isPractice
                ? language === 'bn'
                  ? `সঠিক (${correctAnswers}/${totalQuestions})`
                  : `Correct (${correctAnswers}/${totalQuestions})`
                : language === 'bn'
                ? 'মোট স্কোর'
                : 'Total Score'}
            </span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className={`grid gap-3 mt-6 pt-6 border-t border-slate-700/80 ${isPractice ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1 font-bold">
              <CheckCircle2 size={14} />
              <span>{language === 'bn' ? 'সঠিক' : 'Correct'}</span>
            </div>
            <div className="text-xl font-black text-white">
              {correctAnswers} / {totalQuestions}
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-center gap-1 text-rose-400 text-xs mb-1 font-bold">
              <XCircle size={14} />
              <span>{language === 'bn' ? 'ভুল' : 'Incorrect'}</span>
            </div>
            <div className="text-xl font-black text-white">
              {incorrectAnswers}
            </div>
          </div>

          {!isPractice && (
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1 font-bold">
                <Flame size={14} />
                <span>{language === 'bn' ? 'সেরা ধারাবাহিক' : 'Best Streak'}</span>
              </div>
              <div className="text-xl font-black text-white">
                {bestStreak}
              </div>
            </div>
          )}

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-center gap-1 text-teal-400 text-xs mb-1 font-bold">
              <Clock size={14} />
              <span>{language === 'bn' ? 'সময়' : 'Time'}</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {formatTime(totalTimeSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Missed Districts Section */}
      <div className="w-full bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-5 shadow-xl mb-6 text-left">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-400" />
          <span>
            {hasMistakes
              ? language === 'bn'
                ? `যে জেলাগুলোতে ভুল হয়েছে (${mistakes.length})`
                : `Districts Missed (${mistakes.length})`
              : language === 'bn'
              ? 'কোনো ভুল হয়নি!'
              : 'Zero Mistakes!'}
          </span>
        </h3>

        {hasMistakes ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {mistakes.map((distId) => {
              const district = getDistrictById(distId);
              const division = district
                ? getDivisionById(district.divisionId)
                : null;
              return (
                <div
                  key={distId}
                  className="bg-slate-900/70 border border-slate-700/70 p-2.5 rounded-xl flex flex-col"
                >
                  <span className="font-bold text-white text-sm">
                    {language === 'bn' ? district?.nameBn : district?.name}
                  </span>
                  <span className="text-xs text-slate-400 font-bangla">
                    {language === 'bn' ? district?.name : district?.nameBn}
                  </span>
                  <span className="text-[11px] text-emerald-400/80 mt-1">
                    {language === 'bn' ? division?.nameBn : division?.name}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-emerald-300 text-sm py-2">
            {language === 'bn'
              ? 'অভিনন্দন! আপনি সবগুলো প্রশ্ন নির্ভুলভাবে সমাধান করেছেন।'
              : 'Incredible! You answered every question correctly.'}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        {hasMistakes && (
          <button
            onClick={() => {
              soundManager.playClick();
              onPracticeMistakes();
            }}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            <span>
              {language === 'bn'
                ? `ভুলগুলো অনুশীলন করুন (${mistakes.length})`
                : `Practice Mistakes (${mistakes.length})`}
            </span>
          </button>
        )}

        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          <span>{language === 'bn' ? 'আবার খেলুন' : 'Play Again'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onHome();
          }}
          className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Home size={16} />
          <span>{language === 'bn' ? 'হোমে ফিরুন' : 'Home'}</span>
        </button>
      </div>
    </div>
  );
};
