import { useState, useCallback } from 'react';

const STORAGE_KEY = 'activityHistory';
const TYPES = ['walk', 'feed', 'bath', 'play'];
const empty = () => ({ walk: [], feed: [], bath: [], play: [] });

const load = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return empty();
};

const save = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {}
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

export function useActivityHistory() {
  const [history, setHistory] = useState(load);

  const recordActivity = useCallback((type) => {
    setHistory(prev => {
      const next = { ...prev, [type]: [...(prev[type] || []), new Date().toISOString()] };
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    const e = empty();
    save(e);
    setHistory(e);
  }, []);

  const lastCompleted = {};
  for (const type of TYPES) {
    const entries = history[type] || [];
    lastCompleted[type] = entries.length > 0 ? entries[entries.length - 1] : null;
  }

  return { recordActivity, clearHistory, lastCompleted, streak: calcStreak(history) };
}
