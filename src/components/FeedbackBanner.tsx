import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { AnswerResult } from '../game/types';
import { getDistrictById } from '../data';

interface FeedbackBannerProps {
  result: AnswerResult;
  language?: 'en' | 'bn';
  maxTimeMs?: number;
  onAdvance: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  result,
  language = 'en',
  maxTimeMs = 5000,
  onAdvance,
}) => {
  const selectedDistrict = getDistrictById(result.selectedId);
  const targetDistrict = getDistrictById(result.targetId);

  const selectedName =
    language === 'bn' ? selectedDistrict?.nameBn : selectedDistrict?.name;
  const targetName =
    language === 'bn' ? targetDistrict?.nameBn : targetDistrict?.name;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
      <div
        className={`rounded-xl p-3.5 border shadow-lg flex items-center justify-between gap-3 ${
          result.isCorrect
            ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-100'
            : 'bg-rose-950/90 border-rose-500/80 text-rose-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {result.isCorrect ? (
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
          ) : (
            <XCircle size={24} className="text-rose-400 shrink-0" />
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm md:text-base">
                {result.isCorrect
                  ? language === 'bn'
                    ? '✓ সঠিক উত্তর!'
                    : '✓ Correct!'
                  : result.isTimeout
                  ? language === 'bn'
                    ? '⏱ সময় শেষ!'
                    : "⏱ Time's Up!"
                  : language === 'bn'
                  ? '✕ ভুল উত্তর!'
                  : '✕ Incorrect!'}
              </span>
              {result.isCorrect && (
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-800 text-emerald-200 border border-emerald-600">
                  +{result.pointsEarned} pts
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-0.5">
              {result.isCorrect ? (
                <span>
                  {result.speedBonus > 0 && `+${result.speedBonus} speed `}
                  {result.streakBonus > 0 && `+${result.streakBonus} streak`}
                </span>
              ) : result.isTimeout ? (
                <span>
                  {language === 'bn'
                    ? `${Math.round(maxTimeMs / 1000)} সেকেন্ডের সময় শেষ হয়ে গেছে! সঠিক জেলা ছিল ${targetName}।`
                    : `${Math.round(maxTimeMs / 1000)}-second window expired! Correct was ${targetName}.`}
                </span>
              ) : (
                <span>
                  {language === 'bn'
                    ? `আপনি বেছে নিয়েছেন ${selectedName}। সঠিক জেলা ছিল ${targetName}।`
                    : `You picked ${selectedName}. Correct was ${targetName}.`}
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={onAdvance}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600 shadow transition-all shrink-0 hover:border-slate-500"
          title="Advance to next question"
        >
          <span>{language === 'bn' ? 'পরবর্তী' : 'Next'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
