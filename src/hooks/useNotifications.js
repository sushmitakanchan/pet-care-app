import { useEffect, useRef } from 'react';

const MESSAGES = {
  feed: 'Time to feed your pet!',
  walk: 'Time to take your pet for a walk!',
  bath: 'Time to bathe your pet!',
  play: 'Time to play with your pet!',
};

function parseScheduledTime(timeStr) {
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
}

export function useNotifications(petInfo, schedulesReady, addToast) {
  const timersRef = useRef([]);
  const additionalJson = JSON.stringify(petInfo?.additional);

  useEffect(() => {
    if (!schedulesReady) return;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const now = Date.now();
    const additional = petInfo?.additional || {};

    Object.entries(MESSAGES).forEach(([type, message]) => {
      Object.values(additional[type] || {}).forEach(timeStr => {
        const target = parseScheduledTime(timeStr);
        if (!target) { console.log('[PetHQ] Could not parse time:', timeStr); return; }
        const delay = target.getTime() - now;
        if (delay <= 0) { console.log('[PetHQ] Skipping past time:', timeStr); return; }
        console.log(`[PetHQ] Scheduling "${type}" notification for ${timeStr} (in ${Math.round(delay / 1000)}s)`);
        const id = setTimeout(() => {
          console.log('[PetHQ] Firing notification:', message);
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('PetHQ', { body: message, icon: '/favicon.ico' });
          }
          addToast?.(message);
        }, delay);
        timersRef.current.push(id);
      });
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedulesReady, additionalJson]);
}
