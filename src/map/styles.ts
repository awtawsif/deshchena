import { DistrictVisualState } from './types';

export function getDistrictSvgClasses(
  state: DistrictVisualState = 'default',
  isDivisionHighlighted: boolean = false,
  isDisabled: boolean = false
): string {
  if (isDisabled) {
    return 'fill-slate-800/40 stroke-slate-700/40 cursor-not-allowed';
  }

  switch (state) {
    case 'correct':
      return 'fill-emerald-500 stroke-emerald-200 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse';
    case 'incorrect':
      return 'fill-rose-500 stroke-rose-200 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-bounce-short';
    case 'hint':
      return 'fill-amber-400 stroke-amber-200 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse';
    case 'active':
      return 'fill-teal-400 stroke-teal-100 filter drop-shadow-[0_0_6px_rgba(45,212,191,0.5)]';
    case 'hover':
      return 'fill-emerald-600 stroke-emerald-300 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]';
    case 'disabled':
      return 'fill-slate-800/40 stroke-slate-700/40 cursor-not-allowed';
    case 'default':
    default:
      if (isDivisionHighlighted) {
        return 'fill-slate-700 stroke-emerald-400/80 hover:fill-emerald-600/70 hover:stroke-emerald-300 cursor-pointer';
      }
      return 'fill-slate-800 stroke-slate-600/80 hover:fill-slate-700 hover:stroke-slate-400 cursor-pointer';
  }
}
