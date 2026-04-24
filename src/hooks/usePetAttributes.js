import { useEffect } from 'react';

function isTaskMissed(timeString) {
  if (!timeString || typeof timeString !== 'string') return false;
  const match = timeString.match(/(\d+):(\d+) (\w+)/);
  if (!match) return false;
  const [, hours, minutes, period] = match;
  let hours24 = parseInt(hours);
  if (period === 'PM' && hours24 !== 12) hours24 += 12;
  if (period === 'AM' && hours24 === 12) hours24 = 0;
  const now = new Date();
  const taskTime = new Date();
  taskTime.setHours(hours24, parseInt(minutes), 0, 0);
  return now > taskTime;
}

const areSchedulesComplete = (additional) =>
  additional.feed && Object.values(additional.feed).length > 0 &&
  additional.play && Object.values(additional.play).length > 0 &&
  additional.walk && Object.values(additional.walk).length > 0 &&
  additional.bath && Object.values(additional.bath).length > 0;

export function usePetAttributes(setPetInfo, schedulesReady) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'hidden') return;

      setPetInfo((prev) => {
        if (!prev.basic.name) return prev;
        if (!schedulesReady || !areSchedulesComplete(prev.additional)) return prev;

        let { hunger, happiness, energy, hygiene } = prev.attributes;

        hunger = Math.round(Math.min(hunger + 1, 100));
        energy = Math.round(Math.max(energy - 1, 0));
        happiness = Math.round(Math.max(happiness - 1, 0));
        hygiene = Math.round(Math.max(hygiene - 1, 0));

        let penalizedFeed = { ...prev.penalizedFeed };
        let penalizedBath = { ...prev.penalizedBath };
        let penalizedPlay = { ...prev.penalizedPlay };
        let penalizedWalk = { ...prev.penalizedWalk };

        Object.entries(prev.additional.feed || {}).forEach(([key, time]) => {
          if (isTaskMissed(time) && !penalizedFeed[key]) {
            hunger = Math.min(hunger + 5, 100);
            penalizedFeed[key] = true;
          }
        });

        Object.entries(prev.additional.bath || {}).forEach(([key, time]) => {
          if (isTaskMissed(time) && !penalizedBath[key]) {
            hygiene = Math.max(hygiene - 5, 0);
            penalizedBath[key] = true;
          }
        });

        Object.entries(prev.additional.play || {}).forEach(([key, time]) => {
          if (isTaskMissed(time) && !penalizedPlay[key]) {
            happiness = Math.max(happiness - 5, 0);
            penalizedPlay[key] = true;
          }
        });

        Object.entries(prev.additional.walk || {}).forEach(([key, time]) => {
          if (isTaskMissed(time) && !penalizedWalk[key]) {
            energy = Math.max(energy - 5, 0);
            penalizedWalk[key] = true;
          }
        });

        return {
          ...prev,
          attributes: { hunger, happiness, energy, hygiene },
          penalizedFeed,
          penalizedBath,
          penalizedPlay,
          penalizedWalk,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [schedulesReady, setPetInfo]);
}
