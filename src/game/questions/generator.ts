import { District } from '../../data/types';
import { Question } from '../types';

/**
 * Deterministic PRNG (Mulberry32) for reproducible question ordering in tests.
 */
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle with optional PRNG.
 */
function shuffle<T>(array: T[], randomFn: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface GenerateQuestionsOptions {
  districts: District[];
  count: number;
  targetPool?: string[];
  seed?: number;
}

export function generateQuestions(options: GenerateQuestionsOptions): Question[] {
  const { districts, count, targetPool, seed } = options;

  let candidateDistricts = districts;
  if (targetPool && targetPool.length > 0) {
    const poolSet = new Set(targetPool);
    candidateDistricts = districts.filter((d) => poolSet.has(d.id));
  }

  if (candidateDistricts.length === 0) {
    return [];
  }

  const randomFn = seed !== undefined ? createPrng(seed) : Math.random;
  const shuffled = shuffle(candidateDistricts, randomFn);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((d) => ({
    id: `q-${d.id}`,
    targetId: d.id,
    name: d.name,
    nameBn: d.nameBn,
    divisionId: d.divisionId,
  }));
}
