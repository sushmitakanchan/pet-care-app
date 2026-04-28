const TYPES = ['walk', 'feed', 'bath', 'play'];

export const driftConfig = {
  // Very slow "living pet" drift.
  // Rates are per minute; keep these conservative to avoid feeling punitive.
  // Tune here to change the whole game's feel.
  perMinute: {
    hunger: +1 / 60,      // +1 per hour
    energy: -0.5 / 60,    // -0.5 per hour
    happiness: -0.5 / 60, // -0.5 per hour
    hygiene: -0.5 / 60,   // -0.5 per hour
  },
};

export function clamp01_100(n) {
  if (Number.isNaN(n)) return 0;
  const clamped = Math.max(0, Math.min(100, n));
  return Math.round(clamped);
}

export function parseTimeToToday(timeStr, baseDate) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    0,
    0
  );
}

export function getSlotsForToday(type, additionalForType, baseDate) {
  const obj = additionalForType && typeof additionalForType === 'object' ? additionalForType : {};
  const slots = Object.entries(obj)
    .map(([slotId, timeStr]) => {
      const dueAt = parseTimeToToday(timeStr, baseDate);
      if (!dueAt) return null;
      return { type, slotId: String(slotId), dueAt, timeStr };
    })
    .filter(Boolean)
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
  return slots;
}

export function emptyDaily(dateStr) {
  return {
    date: dateStr,
    completed: { feed: {}, walk: {}, bath: {}, play: {} },
    missed: { feed: {}, walk: {}, bath: {}, play: {} },
  };
}

export function ensureDaily(petInfo, now) {
  const today = now.toDateString();
  if (petInfo?.daily?.date === today) return petInfo;
  return { ...petInfo, daily: emptyDaily(today) };
}

export function applyDrift(attributes, dtMinutes, cfg = driftConfig) {
  const a = { ...(attributes || {}) };
  const r = cfg.perMinute || {};
  a.hunger = clamp01_100((a.hunger ?? 0) + (r.hunger ?? 0) * dtMinutes);
  a.energy = clamp01_100((a.energy ?? 0) + (r.energy ?? 0) * dtMinutes);
  a.happiness = clamp01_100((a.happiness ?? 0) + (r.happiness ?? 0) * dtMinutes);
  a.hygiene = clamp01_100((a.hygiene ?? 0) + (r.hygiene ?? 0) * dtMinutes);
  return a;
}

export function applyMissedPenalties(petInfo, now) {
  const daily = petInfo.daily;
  if (!daily) return petInfo;

  let attributes = petInfo.attributes;
  const nextMissed = { ...(daily.missed || {}) };
  const baseDate = now;

  for (const type of TYPES) {
    const slots = getSlotsForToday(type, petInfo.additional?.[type], baseDate);
    for (const slot of slots) {
      if (slot.dueAt.getTime() > now.getTime()) continue;

      const completed = daily.completed?.[type] || {};
      const missedForType = nextMissed[type] || {};
      const isCompleted = Boolean(completed[slot.slotId]);
      const isMissed = Boolean(missedForType[slot.slotId]);
      if (isCompleted || isMissed) continue;

      // One-time penalty per missed slot.
      attributes = { ...(attributes || {}) };
      if (type === 'feed') attributes.hunger = clamp01_100((attributes.hunger ?? 0) + 5);
      if (type === 'bath') attributes.hygiene = clamp01_100((attributes.hygiene ?? 0) - 5);
      if (type === 'play') attributes.happiness = clamp01_100((attributes.happiness ?? 0) - 5);
      if (type === 'walk') attributes.energy = clamp01_100((attributes.energy ?? 0) - 5);

      nextMissed[type] = { ...missedForType, [slot.slotId]: true };
    }
  }

  return {
    ...petInfo,
    attributes,
    daily: { ...daily, missed: nextMissed },
  };
}

export function simulateToNow(petInfo, now, cfg = driftConfig) {
  if (!petInfo) return petInfo;
  let next = ensureDaily(petInfo, now);

  const lastIso = next.attributesLastUpdatedAt;
  if (!lastIso) {
    // First run: set a baseline timestamp so we don't "jump" stats,
    // but still apply any one-time missed-slot penalties for today.
    next = { ...next, attributesLastUpdatedAt: now.toISOString() };
    next = ensureDaily(next, now);
    next = applyMissedPenalties(next, now);
    return next;
  }

  const last = new Date(lastIso);
  const dtMs = now.getTime() - last.getTime();
  if (!Number.isFinite(dtMs) || dtMs <= 0) return next;

  const dtMinutes = dtMs / 60000;
  const drifted = applyDrift(next.attributes, dtMinutes, cfg);
  next = { ...next, attributes: drifted, attributesLastUpdatedAt: now.toISOString() };
  next = ensureDaily(next, now);
  next = applyMissedPenalties(next, now);
  return next;
}

export function pickSlotToComplete(petInfo, type, now) {
  const baseDate = now;
  const slots = getSlotsForToday(type, petInfo?.additional?.[type], baseDate);
  const completed = petInfo?.daily?.completed?.[type] || {};
  const uncompleted = slots.filter(s => !completed[s.slotId]);
  if (uncompleted.length === 0) return null;

  // Plan rule: earliest uncompleted overdue slot; else next upcoming slot.
  const overdue = uncompleted.filter(s => s.dueAt.getTime() <= now.getTime());
  if (overdue.length > 0) return overdue[0];
  return uncompleted[0];
}
