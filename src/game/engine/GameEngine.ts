import { District } from '../../data/types';
import { DistrictVisualState } from '../../map/types';
import { calculateScore } from '../scoring/calculator';
import { generateQuestions } from '../questions/generator';
import {
  AnswerResult,
  GameConfig,
  GameState,
  QuestionHistoryItem,
} from '../types';

export class GameEngine {
  private districts: District[];
  private state: GameState;
  private listeners: Set<(state: GameState) => void> = new Set();

  constructor(districts: District[]) {
    this.districts = districts;
    this.state = this.getInitialState({
      questionCount: 10,
      difficulty: 'normal',
    });
  }

  private getInitialState(config: GameConfig): GameState {
    return {
      status: 'idle',
      config,
      questions: [],
      currentIndex: 0,
      currentQuestion: null,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      streak: 0,
      bestStreak: 0,
      mistakes: [],
      history: [],
      startTime: 0,
      questionStartTime: 0,
      totalTimeSeconds: 0,
      accuracyPercentage: 0,
      districtStates: {},
      lastAnswerResult: null,
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  public startGame(config: GameConfig): void {
    const questions = generateQuestions({
      districts: this.districts,
      count: config.questionCount,
      targetPool: config.targetPool,
      seed: config.seed,
    });

    if (questions.length === 0) {
      throw new Error('Cannot start game with 0 questions');
    }

    const now = Date.now();
    this.state = {
      ...this.getInitialState(config),
      status: 'in_progress',
      questions,
      currentIndex: 0,
      currentQuestion: questions[0],
      startTime: now,
      questionStartTime: now,
    };

    this.notify();
  }

  public submitAnswer(districtId: string, timestamp?: number): AnswerResult {
    if (this.state.status !== 'in_progress' || !this.state.currentQuestion) {
      throw new Error(
        `Cannot submit answer when game status is ${this.state.status}`
      );
    }

    const now = timestamp || Date.now();
    const timeTakenMs = Math.max(0, now - this.state.questionStartTime);
    const target = this.state.currentQuestion;
    const isCorrect = districtId === target.targetId;

    const scoreResult = calculateScore({
      isCorrect,
      timeTakenMs,
      currentStreak: this.state.streak,
      difficulty: this.state.config.difficulty,
    });

    const newScore = this.state.score + scoreResult.totalPoints;
    const newCorrect = this.state.correctAnswers + (isCorrect ? 1 : 0);
    const newIncorrect = this.state.incorrectAnswers + (isCorrect ? 0 : 1);
    const newStreak = isCorrect ? this.state.streak + 1 : 0;
    const newBestStreak = Math.max(this.state.bestStreak, newStreak);

    const updatedMistakes = [...this.state.mistakes];
    if (!isCorrect && !updatedMistakes.includes(target.targetId)) {
      updatedMistakes.push(target.targetId);
    }

    const historyItem: QuestionHistoryItem = {
      question: target,
      selectedId: districtId,
      isCorrect,
      timeTakenMs,
      pointsEarned: scoreResult.totalPoints,
    };

    const newDistrictStates: Record<string, DistrictVisualState> = {
      ...this.state.districtStates,
    };

    if (isCorrect) {
      newDistrictStates[districtId] = 'correct';
    } else {
      newDistrictStates[districtId] = 'incorrect';
      // Reveal the correct district so the player learns
      newDistrictStates[target.targetId] = 'hint';
    }

    const answerResult: AnswerResult = {
      isCorrect,
      selectedId: districtId,
      targetId: target.targetId,
      pointsEarned: scoreResult.totalPoints,
      speedBonus: scoreResult.speedBonus,
      streakBonus: scoreResult.streakBonus,
      revealedId: isCorrect ? undefined : target.targetId,
    };

    const totalAnswered = newCorrect + newIncorrect;
    const accuracy =
      totalAnswered > 0 ? Math.round((newCorrect / totalAnswered) * 100) : 0;

    this.state = {
      ...this.state,
      status: 'evaluating',
      score: newScore,
      correctAnswers: newCorrect,
      incorrectAnswers: newIncorrect,
      streak: newStreak,
      bestStreak: newBestStreak,
      mistakes: updatedMistakes,
      history: [...this.state.history, historyItem],
      accuracyPercentage: accuracy,
      districtStates: newDistrictStates,
      lastAnswerResult: answerResult,
    };

    this.notify();
    return answerResult;
  }

  public advanceQuestion(): void {
    if (this.state.status !== 'evaluating') {
      return;
    }

    const nextIndex = this.state.currentIndex + 1;
    const now = Date.now();

    if (nextIndex >= this.state.questions.length) {
      // Game completed
      const totalTimeSeconds = Math.max(
        1,
        Math.round((now - this.state.startTime) / 1000)
      );

      this.state = {
        ...this.state,
        status: 'completed',
        currentIndex: nextIndex,
        currentQuestion: null,
        endTime: now,
        totalTimeSeconds,
      };
      this.notify();
      return;
    }

    // Prepare for next question:
    // Persist already found 'correct' districts, clear temporary 'incorrect' and 'hint' states
    const cleanedDistrictStates: Record<string, DistrictVisualState> = {};
    for (const [id, state] of Object.entries(this.state.districtStates)) {
      if (state === 'correct') {
        cleanedDistrictStates[id] = 'correct';
      }
    }

    this.state = {
      ...this.state,
      status: 'in_progress',
      currentIndex: nextIndex,
      currentQuestion: this.state.questions[nextIndex],
      questionStartTime: now,
      districtStates: cleanedDistrictStates,
      lastAnswerResult: null,
    };

    this.notify();
  }

  public createPracticeSession(difficulty: GameConfig['difficulty'] = 'normal'): GameEngine {
    if (this.state.mistakes.length === 0) {
      throw new Error('No mistakes to practice!');
    }

    const practiceEngine = new GameEngine(this.districts);
    practiceEngine.startGame({
      questionCount: this.state.mistakes.length,
      difficulty,
      targetPool: this.state.mistakes,
    });
    return practiceEngine;
  }
}
