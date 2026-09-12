import React, { useEffect, useState } from 'react';
import { Play, Sparkles, Compass, ShieldCheck, Settings, MousePointer, Tag, HelpCircle, GraduationCap, Swords } from 'lucide-react';
import { GameConfig, GameDifficulty, GameMode, GameSettings, getDefaultSettingsForDifficulty } from '../game/types';
import { soundManager } from '../utils/audio';

interface HomeScreenProps {
  language: 'en' | 'bn';
  onStartGame: (config: GameConfig) => void;
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  label,
  description,
  checked,
  onChange,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left bg-slate-700/60 border-slate-600/70 hover:bg-slate-700"
  >
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-emerald-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="font-bold text-sm text-slate-100">{label}</div>
        <div className="text-[11px] text-slate-400 leading-snug">{description}</div>
      </div>
    </div>
    <span
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-slate-600'
      }`}
      aria-hidden="true"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </span>
  </button>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onStartGame,
}) => {
  const [mode, setMode] = useState<GameMode>('competitive');
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [settings, setSettings] = useState<GameSettings>(() =>
    getDefaultSettingsForDifficulty('normal')
  );

  const effectiveDifficulty: GameDifficulty =
    mode === 'practice' ? 'relaxed' : difficulty;

  // Reset assist settings to the preset defaults for the chosen mode/difficulty
  useEffect(() => {
    setSettings(getDefaultSettingsForDifficulty(effectiveDifficulty));
  }, [mode, effectiveDifficulty]);

  const updateSetting = (key: keyof GameSettings) => {
    soundManager.playClick();
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStart = () => {
    soundManager.playClick();
    onStartGame({
      questionCount,
      difficulty: effectiveDifficulty,
      mode,
      settings,
    });
  };

  const countOptions = [10, 25, 50, 64];

  const modeCardClass = (active: boolean) =>
    `p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
      active
        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950'
        : 'bg-slate-700/60 border-slate-600/70 text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-in fade-in duration-200 overflow-x-hidden">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs font-semibold mb-6 shadow-sm max-w-full">
        <Sparkles size={13} className="text-emerald-400 shrink-0" />
        <span className="leading-snug text-center">
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
        {/* Game Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            {language === 'bn' ? 'খেলার ধরন' : 'Game Mode'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setMode('practice');
              }}
              className={modeCardClass(mode === 'practice')}
            >
              <GraduationCap size={22} className="shrink-0 mt-0.5" />
              <span>
                <span className="block font-bold text-sm">Practice</span>
                <span className="block text-[11px] mt-1 opacity-80 leading-snug">
                  {language === 'bn'
                    ? 'সময় নেই · সব সহায়তা চালু · শিখে নিন'
                    : 'No timer · all helps on · learn the map'}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setMode('competitive');
              }}
              className={modeCardClass(mode === 'competitive')}
            >
              <Swords size={22} className="shrink-0 mt-0.5" />
              <span>
                <span className="block font-bold text-sm">Competitive</span>
                <span className="block text-[11px] mt-1 opacity-80 leading-snug">
                  {language === 'bn'
                    ? 'টাইমার · স্কোর ও ধারাবাহিক বোনাস'
                    : 'Timed & scored · streak bonuses'}
                </span>
              </span>
            </button>
          </div>
        </div>

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

        {/* Difficulty — only applies in competitive mode */}
        {mode === 'competitive' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              {language === 'bn' ? 'কঠিনতার স্তর' : 'Difficulty'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'normal' as GameDifficulty,
                  labelEn: 'Normal',
                  labelBn: 'সাধারণ',
                  descEn: 'Standard 15s timer & streak bonuses',
                  descBn: '১৫ সে. টাইমার ও ধারাবাহিক বোনাস',
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
        )}

        {/* Helper Settings */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Settings size={13} className="text-emerald-400" />
              {language === 'bn' ? 'সহায়তা সেটিংস' : 'Helper Settings'}
            </label>
            <span className="text-[10px] text-slate-500">
              {language === 'bn'
                ? 'ডিফল্ট মোড অনুযায়ী সাজানো'
                : 'Defaults adapt to your mode'}
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            <ToggleRow
              icon={<MousePointer size={16} />}
              label={language === 'bn' ? 'হোভারে নাম দেখা' : 'Hover Names'}
              description={
                language === 'bn'
                  ? 'জেলার উপর মাউস রাখলে নাম দেখায়'
                  : 'Show district names on hover (great on PC)'
              }
              checked={settings.showHoverNames}
              onChange={() => updateSetting('showHoverNames')}
            />
            <ToggleRow
              icon={<Tag size={16} />}
              label={language === 'bn' ? 'নাম লেবেল' : 'District Labels'}
              description={
                language === 'bn'
                  ? 'মানচিত্রে প্রতিটি জেলার নাম দেখায়'
                  : 'Show permanent district labels on the map'
              }
              checked={settings.showLabels}
              onChange={() => updateSetting('showLabels')}
            />
            <ToggleRow
              icon={<HelpCircle size={16} />}
              label={language === 'bn' ? 'বিভাগ ইঙ্গিত' : 'Division Hint'}
              description={
                language === 'bn'
                  ? 'প্রশ্নের বিভাগ হাইলাইট করে দেখায়'
                  : 'Highlight the question division on the map'
              }
              checked={settings.showDivisionHint}
              onChange={() => updateSetting('showDivisionHint')}
            />
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