import { DEFAULT_GAME_SETTINGS, GameSettings } from '../game/types';

const STORAGE_KEY = 'deshchena_settings';

export function loadSettings(): GameSettings {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_GAME_SETTINGS, ...parsed };
        }
      }
    }
  } catch {
    // Ignore if localStorage is unavailable or corrupt
  }
  return { ...DEFAULT_GAME_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  } catch {
    // Ignore if localStorage is unavailable
  }
}