import { useEffect } from 'react';
import { simulateToNow } from '../lib/petSim';

const areSchedulesComplete = (additional) =>
  additional.feed && Object.values(additional.feed).length > 0 &&
  additional.play && Object.values(additional.play).length > 0 &&
  additional.walk && Object.values(additional.walk).length > 0 &&
  additional.bath && Object.values(additional.bath).length > 0;

export function usePetAttributes(setPetInfo, schedulesReady) {
  useEffect(() => {
    if (!schedulesReady) return;

    const tick = () => {
      if (document.visibilityState === 'hidden') return;
      const now = new Date();
      setPetInfo((prev) => {
        if (!prev.basic?.name) return prev;
        if (!areSchedulesComplete(prev.additional)) return prev;
        return simulateToNow(prev, now);
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };

    tick(); // catch up on mount
    document.addEventListener('visibilitychange', onVisibility);
    const interval = setInterval(tick, 60000); // gentle UI refresh while visible

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
    };
  }, [schedulesReady, setPetInfo]);
}
