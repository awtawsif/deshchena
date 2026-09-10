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

  // Speed Bonus calculation based on difficulty
  let speedBonus = 0;
  if (difficulty === 'relaxed') {
    speedBonus = 25; // Constant friendly bonus, no decay
  } else if (difficulty === 'normal') {
    // Up to 50 points, decays at 5 points per second
    speedBonus = Math.max(0, Math.min(50, Math.round(50 - secondsElapsed * 5)));
  } else if (difficulty === 'hard') {
    // Up to 75 points, decays rapidly at 15 points per second (0 after 5 seconds)
    speedBonus = Math.max(0, Math.min(75, Math.round(75 - secondsElapsed * 15)));
  }

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
