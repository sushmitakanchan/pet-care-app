import { useState, useCallback, useMemo } from 'react';

const TYPES = ['walk', 'feed', 'bath', 'play'];
const empty = () => ({ walk: [], feed: [], bath: [], play: [] });

const load = (storageKey) => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore corrupted storage
  }
  return empty();
};

const save = (storageKey, history) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(history));
  } catch {
    // ignore storage failures (private mode / full quota)
  }
};

const toDateStr = (iso) => new Date(iso).toDateString();

const calcStreak = (history) => {
  const daysByType = {};
  for (const type of TYPES) {
    daysByType[type] = new Set((history[type] || []).map(toDateStr));
  }

  const allDoneOnDay = (dateStr) => TYPES.every(t => daysByType[t].has(dateStr));

  const today = new Date();
  const todayStr = today.toDateString();
  // If today isn't complete yet, start counting from yesterday so the streak doesn't drop mid-day
  const startOffset = allDoneOnDay(todayStr) ? 0 : 1;

  let streak = 0;
  for (let i = startOffset; ; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (allDoneOnDay(d.toDateString())) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const formatLastCompleted = (iso) => {
  if (!iso) return 'Never';
  const date = new Date(iso);
  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 864e5).toDateString();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === todayStr) return `Today ${timeStr}`;
  if (date.toDateString() === yesterdayStr) return `Yesterday ${timeStr}`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + timeStr;
};

export function useActivityHistory(petId) {
  const storageKey = useMemo(() => `activityHistory:${petId || 'unknown'}`, [petId]);
  const [history, setHistory] = useState(() => load(storageKey));

  const recordActivity = useCallback((type) => {
    setHistory(prev => {
      const next = { ...prev, [type]: [...(prev[type] || []), new Date().toISOString()] };
      save(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const clearHistory = useCallback(() => {
    const e = empty();
    save(storageKey, e);
    setHistory(e);
  }, [storageKey]);

  const lastCompleted = {};
  for (const type of TYPES) {
    const entries = history[type] || [];
    lastCompleted[type] = entries.length > 0 ? entries[entries.length - 1] : null;
  }

  return { recordActivity, clearHistory, lastCompleted, streak: calcStreak(history) };
}
