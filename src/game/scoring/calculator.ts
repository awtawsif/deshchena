import { GameDifficulty } from '../types';

export interface ScoreCalculationParams {
  isCorrect: boolean;
  timeTakenMs: number;
  currentStreak: number;
  difficulty: GameDifficulty;
}

export interface ScoreBreakdown {
  basePoints: number;
  speedBonus: number;
  streakBonus: number;
  totalPoints: number;
}

export const BASE_CORRECT_POINTS = 100;
export const MAX_STREAK_BONUS = 50;

export function calculateLiveSpeedBonus(
  secondsElapsed: number,
  difficulty: GameDifficulty
): number {
  if (difficulty === 'relaxed') {
    return 25;
  } else if (difficulty === 'normal') {
    return Math.max(0, Math.min(50, Math.round(50 - secondsElapsed * 5)));
  } else if (difficulty === 'hard') {
    return Math.max(0, Math.min(75, Math.round(75 - secondsElapsed * 15)));
  }
  return 0;
}

export function calculateScore(params: ScoreCalculationParams): ScoreBreakdown {
  const { isCorrect, timeTakenMs, currentStreak, difficulty } = params;

  if (!isCorrect) {
    return {
      basePoints: 0,
      speedBonus: 0,
      streakBonus: 0,
      totalPoints: 0,
    };
  }

  const secondsElapsed = Math.max(0, timeTakenMs / 1000);
  const speedBonus = calculateLiveSpeedBonus(secondsElapsed, difficulty);

  // Streak Bonus: 10 points per streak level, capped at 50 points
  const streakBonus = Math.min(MAX_STREAK_BONUS, currentStreak * 10);

  const totalPoints = BASE_CORRECT_POINTS + speedBonus + streakBonus;

  return {
    basePoints: BASE_CORRECT_POINTS,
    speedBonus,
    streakBonus,
    totalPoints,
  };
}
