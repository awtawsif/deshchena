import { DistrictVisualState } from '../map/types';

export type GameDifficulty = 'relaxed' | 'normal' | 'hard';
export type GameModeType = 'find-district';

export interface Question {
  id: string;
  targetId: string;
  name: string;
  nameBn: string;
  divisionId: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  selectedId: string;
  targetId: string;
  pointsEarned: number;
  speedBonus: number;
  streakBonus: number;
  revealedId?: string;
  isTimeout?: boolean;
}

export interface QuestionHistoryItem {
  question: Question;
  selectedId: string;
  isCorrect: boolean;
  timeTakenMs: number;
  pointsEarned: number;
}

export interface GameSettings {
  // Show district name tooltip at the bottom while hovering a district (PC)
  showHoverNames: boolean;
  // Render permanent district name labels on the map
  showLabels: boolean;
  // Auto-highlight the question's division on the map
  showDivisionHint: boolean;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  showHoverNames: true,
  showLabels: false,
  showDivisionHint: true,
};

export interface GameConfig {
  questionCount: number; // 10, 25, 50, or 64
  difficulty: GameDifficulty;
  targetPool?: string[]; // Optional specific district IDs (for practice mistakes mode)
  seed?: number; // Optional seed for deterministic question order
  settings?: Partial<GameSettings>; // Optional UI/UX preferences
}

export type GameStatus = 'idle' | 'in_progress' | 'evaluating' | 'completed';

export interface GameState {
  status: GameStatus;
  config: GameConfig;
  questions: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  bestStreak: number;
  mistakes: string[]; // List of district IDs answered incorrectly
  history: QuestionHistoryItem[];
  startTime: number;
  questionStartTime: number;
  endTime?: number;
  totalTimeSeconds: number;
  accuracyPercentage: number;
  districtStates: Record<string, DistrictVisualState>;
  lastAnswerResult: AnswerResult | null;
}
