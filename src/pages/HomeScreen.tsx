import React, { useState } from 'react';
import { Play, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { GameConfig, GameDifficulty } from '../game/types';
import { soundManager } from '../utils/audio';

interface HomeScreenProps {
  language: 'en' | 'bn';
  onStartGame: (config: GameConfig) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onStartGame,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');

  const handleStart = () => {
    soundManager.playClick();
    onStartGame({
      questionCount,
      difficulty,
    });
  };

  const countOptions = [10, 25, 50, 64];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-in fade-in duration-200">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
        <Sparkles size={14} className="text-emerald-400" />
        <span>
          {language === 'bn'
            ? '৬৪ জেলার মানচিত্র কুইজ'
            : '64 Districts Interactive Geography Quiz'}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
        Bangladesh 64
      </h1>
      <p className="text-2xl text-emerald-400 font-bold font-bangla mb-3">
        দেশ চেনা
      </p>
      <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-8">
        {language === 'bn'
          ? 'আপনি কি বাংলাদেশের সবগুলো ৬৪টি জেলা মানচিত্রে সঠিক স্থানে খুঁজে বের করতে পারেন?'
          : 'Can you pinpoint all 64 districts of Bangladesh on the map? Test your knowledge and learn along the way.'}
      </p>

      {/* Setup Options Card */}
      <div className="w-full bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl mb-8 text-left space-y-6">
        {/* Question Count */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            {language === 'bn' ? 'প্রশ্নের সংখ্যা' : 'Number of Questions'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {countOptions.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setQuestionCount(count);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all border ${
                  questionCount === count
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950'
                    : 'bg-slate-700/60 border-slate-600/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {count === 64 ? (language === 'bn' ? 'সব ৬৪' : 'All 64') : count}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            {language === 'bn' ? 'কঠিনতার স্তর' : 'Difficulty'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'relaxed' as GameDifficulty,
                labelEn: 'Relaxed',
                labelBn: 'সহজ',
                descEn: 'No timer rush, hints available',
                descBn: 'সময় চাপ নেই, ইঙ্গিত পাওয়া যাবে',
              },
              {
                id: 'normal' as GameDifficulty,
                labelEn: 'Normal',
                labelBn: 'সাধারণ',
                descEn: 'Standard timer & streak bonuses',
                descBn: 'টাইমার ও ধারাবাহিক বোনাস',
              },
              {
                id: 'hard' as GameDifficulty,
                labelEn: 'Hard',
                labelBn: 'কঠিন',
                descEn: '5-second pressure window',
                descBn: '৫ সেকেন্ডে দ্রুত উত্তর',
              },
            ].map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setDifficulty(diff.id);
                }}
                className={`p-3 rounded-xl text-left border transition-all ${
                  difficulty === diff.id
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950'
                    : 'bg-slate-700/60 border-slate-600/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <div className="font-bold text-sm">
                  {language === 'bn' ? diff.labelBn : diff.labelEn}
                </div>
                <div className="text-[11px] opacity-80 mt-1 line-clamp-2">
                  {language === 'bn' ? diff.descBn : diff.descEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full max-w-md py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg md:text-xl shadow-xl shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
      >
        <Play size={22} fill="currentColor" />
        <span>{language === 'bn' ? 'খেলা শুরু করুন' : 'PLAY NOW'}</span>
      </button>

      {/* Footer Info */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-emerald-500/80" />
          <span>8 Divisions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500/80" />
          <span>64 Official Districts</span>
        </div>
      </div>
    </div>
  );
};
