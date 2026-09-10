import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoring/calculator';
import { generateQuestions } from './questions/generator';
import { GameEngine } from './engine/GameEngine';
import { districts } from '../data';

describe('Scoring Calculator', () => {
  it('returns 0 for incorrect answers and resets streak', () => {
    const result = calculateScore({
      isCorrect: false,
      timeTakenMs: 1000,
      currentStreak: 5,
      difficulty: 'normal',
    });
    expect(result.totalPoints).toBe(0);
    expect(result.basePoints).toBe(0);
    expect(result.speedBonus).toBe(0);
    expect(result.streakBonus).toBe(0);
  });

  it('calculates score with speed and streak bonus for correct answers', () => {
    // 2 seconds elapsed = 50 - 10 = 40 speed bonus. Streak of 3 = 30 streak bonus.
    const result = calculateScore({
      isCorrect: true,
      timeTakenMs: 2000,
      currentStreak: 3,
      difficulty: 'normal',
    });
    expect(result.basePoints).toBe(100);
    expect(result.speedBonus).toBe(40);
    expect(result.streakBonus).toBe(30);
    expect(result.totalPoints).toBe(170);
  });

  it('caps streak bonus at 50 points', () => {
    const result = calculateScore({
      isCorrect: true,
      timeTakenMs: 1000,
      currentStreak: 8, // 8 * 10 = 80 -> capped at 50
      difficulty: 'normal',
    });
    expect(result.streakBonus).toBe(50);
  });

  it('provides constant bonus in relaxed mode', () => {
    const fast = calculateScore({
      isCorrect: true,
      timeTakenMs: 500,
      currentStreak: 0,
      difficulty: 'relaxed',
    });
    const slow = calculateScore({
      isCorrect: true,
      timeTakenMs: 15000,
      currentStreak: 0,
      difficulty: 'relaxed',
    });
    expect(fast.speedBonus).toBe(25);
    expect(slow.speedBonus).toBe(25);
  });
});

describe('Question Generator', () => {
  it('generates the specified number of questions without duplicates', () => {
    const questions = generateQuestions({
      districts,
      count: 25,
    });
    expect(questions).toHaveLength(25);
    const targetIds = new Set(questions.map((q) => q.targetId));
    expect(targetIds.size).toBe(25);
  });

  it('generates identical sequence when using the same seed', () => {
    const run1 = generateQuestions({ districts, count: 15, seed: 12345 });
    const run2 = generateQuestions({ districts, count: 15, seed: 12345 });
    expect(run1.map((q) => q.targetId)).toEqual(run2.map((q) => q.targetId));
  });

  it('filters questions strictly by targetPool', () => {
    const pool = ['BD-DHK', 'BD-GAZ', 'BD-CTG'];
    const questions = generateQuestions({
      districts,
      count: 10,
      targetPool: pool,
    });
    expect(questions).toHaveLength(3);
    for (const q of questions) {
      expect(pool).toContain(q.targetId);
    }
  });
});

describe('GameEngine State Machine', () => {
  it('runs a full 3-question game session and records accuracy and mistakes', () => {
    const engine = new GameEngine(districts);
    const pool = ['BD-DHK', 'BD-GAZ', 'BD-CTG'];

    engine.startGame({
      questionCount: 3,
      difficulty: 'normal',
      targetPool: pool,
      seed: 42,
    });

    let state = engine.getState();
    expect(state.status).toBe('in_progress');
    expect(state.questions).toHaveLength(3);
    expect(state.currentIndex).toBe(0);

    const q1 = state.currentQuestion!;
    // Q1: Correct answer
    const res1 = engine.submitAnswer(q1.targetId, Date.now() + 1000);
    expect(res1.isCorrect).toBe(true);
    expect(res1.streakBonus).toBe(10);
    expect(res1.pointsEarned).toBeGreaterThan(100);

    state = engine.getState();
    expect(state.status).toBe('evaluating');
    expect(state.correctAnswers).toBe(1);
    expect(state.streak).toBe(1);
    expect(state.districtStates[q1.targetId]).toBe('correct');

    engine.advanceQuestion();
    state = engine.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.status).toBe('in_progress');

    // Q2: Incorrect answer
    const q2 = state.currentQuestion!;
    const wrongDistrictId = q2.targetId === 'BD-DHK' ? 'BD-GAZ' : 'BD-DHK';
    const res2 = engine.submitAnswer(wrongDistrictId, Date.now() + 1000);
    expect(res2.isCorrect).toBe(false);
    expect(res2.pointsEarned).toBe(0);

    state = engine.getState();
    expect(state.incorrectAnswers).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.mistakes).toContain(q2.targetId);
    expect(state.districtStates[wrongDistrictId]).toBe('incorrect');
    expect(state.districtStates[q2.targetId]).toBe('hint');

    engine.advanceQuestion();
    state = engine.getState();
    expect(state.currentIndex).toBe(2);

    // Q3: Correct answer
    const q3 = state.currentQuestion!;
    engine.submitAnswer(q3.targetId, Date.now() + 1000);
    engine.advanceQuestion();

    // Game should now be completed
    state = engine.getState();
    expect(state.status).toBe('completed');
    expect(state.correctAnswers).toBe(2);
    expect(state.incorrectAnswers).toBe(1);
    expect(state.accuracyPercentage).toBe(67); // 2/3 = 67%
    expect(state.mistakes).toHaveLength(1);
    expect(state.mistakes[0]).toBe(q2.targetId);

    // Practice mistakes session
    const practiceEngine = engine.createPracticeSession('normal');
    const practiceState = practiceEngine.getState();
    expect(practiceState.status).toBe('in_progress');
    expect(practiceState.questions).toHaveLength(1);
    expect(practiceState.questions[0].targetId).toBe(q2.targetId);
  });

  it('handles question timeout correctly via submitTimeout', () => {
    const engine = new GameEngine(districts);
    engine.startGame({
      questionCount: 3,
      difficulty: 'hard',
      seed: 99,
    });

    let state = engine.getState();
    const q1 = state.currentQuestion!;

    const result = engine.submitTimeout();
    expect(result.isCorrect).toBe(false);
    expect(result.isTimeout).toBe(true);
    expect(result.pointsEarned).toBe(0);
    expect(result.selectedId).toBe('TIMEOUT');
    expect(result.targetId).toBe(q1.targetId);

    state = engine.getState();
    expect(state.status).toBe('evaluating');
    expect(state.incorrectAnswers).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.mistakes).toContain(q1.targetId);
    expect(state.districtStates[q1.targetId]).toBe('hint');
  });
});
