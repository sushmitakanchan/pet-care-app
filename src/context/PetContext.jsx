import { createContext, useState, useEffect, useCallback } from "react";

export const PetContext = createContext();

const safeSetItem = (key, value, onError) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage.setItem failed for key "${key}":`, e);
    onError?.();
  }
};

export const PetProvider = ({children})=>{
  const [storageWarning, setStorageWarning] = useState(false);
  const onStorageError = useCallback(() => setStorageWarning(true), []);
    const [schedulesReady, setSchedulesReady] = useState(() => {
        return sessionStorage.getItem("schedulesReady") === "true";
    });
    const [pet, setPet] = useState(()=>{
        const stored = localStorage.getItem("SelectedPet");
        return stored ? stored : "";
    })
    const [walkProgressCounter, setWalkProgressCounter] = useState(() => {
    return Number(localStorage.getItem("walkProgressCounter")) || 0;
  })
    const [walkLabel, setWalkLabel] = useState('')

    const [bathProgressCounter, setBathProgressCounter] = useState(() => {
    return Number(localStorage.getItem("bathProgressCounter")) || 0;
  })
    const [bathLabel, setBathLabel] = useState('')
    const [feedProgressCounter, setFeedProgressCounter] = useState(() => {
    return Number(localStorage.getItem("feedProgressCounter")) || 0;
  })
    const [feedLabel, setFeedLabel] = useState('')

    const [playProgressCounter, setPlayProgressCounter] = useState(() => {
    return Number(localStorage.getItem("playProgressCounter")) || 0;
  })
    const [playLabel, setPlayLabel] = useState('')

  const [petInfo, setPetInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("PetInfo");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("PetInfo in localStorage is corrupted, resetting:", e);
    }
    return {
      basic: { name: "", age: "", sex: "", breed: "", type: "" },
      additional: { feed: {}, play: {}, walk: {}, bath: {} },
      attributes: { hunger: 70, happiness: 80, energy: 60, hygiene: 90 },
      penalizedFeed: {},
      penalizedBath: {},
      penalizedPlay: {},
      penalizedWalk: {},
    };
  });

  const emptyPetInfo = {
    basic: { name: "", age: "", sex: "", breed: "", type: "" },
    additional: { feed: {}, play: {}, walk: {}, bath: {} },
    attributes: { hunger: 70, happiness: 80, energy: 60, hygiene: 90 },
    penalizedFeed: {},
    penalizedBath: {},
    penalizedPlay: {},
    penalizedWalk: {},
  };

  const resetPetInfo = () => {
    localStorage.removeItem("PetInfo");
    localStorage.removeItem("walkProgressCounter");
    localStorage.removeItem("feedProgressCounter");
    localStorage.removeItem("bathProgressCounter");
    localStorage.removeItem("playProgressCounter");
    localStorage.removeItem("penaltyResetDate");
    sessionStorage.removeItem("schedulesReady");
    setPetInfo(emptyPetInfo);
    setWalkProgressCounter(0);
    setFeedProgressCounter(0);
    setBathProgressCounter(0);
    setPlayProgressCounter(0);
    setSchedulesReady(false);
  };

  // Reset on new browser session
  useEffect(() => {
    const sessionAlive = sessionStorage.getItem("sessionAlive");
    if (!sessionAlive) {
      resetPetInfo();
      sessionStorage.setItem("sessionAlive", "true");
    }
  }, []);

  // Reset daily penalties and progress counters at the start of each new day
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("penaltyResetDate");
    if (lastReset !== today) {
      setPetInfo(prev => ({
        ...prev,
        penalizedFeed: {},
        penalizedBath: {},
        penalizedPlay: {},
        penalizedWalk: {},
      }));
      setWalkProgressCounter(0);
      setBathProgressCounter(0);
      setFeedProgressCounter(0);
      setPlayProgressCounter(0);
      safeSetItem("penaltyResetDate", today, onStorageError);
    }
  }, []);

  // Persist schedulesReady across refreshes within the same session
  useEffect(() => {
    sessionStorage.setItem("schedulesReady", schedulesReady);
  }, [schedulesReady]);

  // Save counters whenever they change
  useEffect(() => {
    safeSetItem("feedProgressCounter", feedProgressCounter, onStorageError);
  }, [feedProgressCounter, onStorageError]);

  useEffect(() => {
    safeSetItem("walkProgressCounter", walkProgressCounter, onStorageError);
  }, [walkProgressCounter, onStorageError]);

  useEffect(() => {
    safeSetItem("bathProgressCounter", bathProgressCounter, onStorageError);
  }, [bathProgressCounter, onStorageError]);

  useEffect(() => {
    safeSetItem("playProgressCounter", playProgressCounter, onStorageError);
  }, [playProgressCounter, onStorageError]);

    const totalWalks = petInfo?.additional?.walk ? Object.values(petInfo.additional.walk).length: 0;
    const totalMeals = petInfo?.additional?.feed ? Object.values(petInfo.additional.feed).length: 0;
    const totalBaths = petInfo?.additional?.bath ? Object.values(petInfo.additional.bath).length: 0;
    const totalPlays = petInfo?.additional?.play ? Object.values(petInfo.additional.play).length: 0;

    useEffect(()=>{
        safeSetItem("PetInfo", JSON.stringify(petInfo), onStorageError);
    }, [petInfo])

const areSchedulesComplete = (additional) => {
  return (
    additional.feed && Object.values(additional.feed).length > 0 &&
    additional.play && Object.values(additional.play).length > 0 &&
    additional.walk && Object.values(additional.walk).length > 0 &&
    additional.bath && Object.values(additional.bath).length > 0
  );
};

// Runs every 5 seconds to update pet's attributes
useEffect(() => {
  const interval = setInterval(() => {
    setPetInfo((prevPetInfo) => {
      if (!prevPetInfo.basic.name) return prevPetInfo;

      if (!schedulesReady || !areSchedulesComplete(prevPetInfo.additional)) {
        return prevPetInfo;
      }

      let { hunger, happiness, energy, hygiene } = prevPetInfo.attributes;

      hunger = Math.round(Math.min(hunger + 1, 100));
      energy = Math.round(Math.max(energy - 1, 0));
      happiness = Math.round(Math.max(happiness - 1, 0));
      hygiene = Math.round(Math.max(hygiene - 1, 0));

      let penalizedFeed = { ...prevPetInfo.penalizedFeed };
      let penalizedBath = { ...prevPetInfo.penalizedBath };
      let penalizedPlay = { ...prevPetInfo.penalizedPlay };
      let penalizedWalk = { ...prevPetInfo.penalizedWalk };

      Object.entries(prevPetInfo.additional.feed || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedFeed[key]) {
            hunger = Math.min(hunger + 5, 100);
            penalizedFeed[key] = true;
        }
      });

      Object.entries(prevPetInfo.additional.bath || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedBath[key]) {
          hygiene = Math.max(hygiene - 5, 0);
          penalizedBath[key] = true;
        }
      });

      Object.entries(prevPetInfo.additional.play || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedPlay[key]) {
          happiness = Math.max(happiness - 5, 0);
          penalizedPlay[key] = true;
        }
      });

      Object.entries(prevPetInfo.additional.walk || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedWalk[key]) {
          energy = Math.max(energy - 5, 0);
          penalizedWalk[key] = true;
        }
      });

      return {
        ...prevPetInfo,
        attributes: { hunger, happiness, energy, hygiene },
        penalizedFeed,
        penalizedBath,
        penalizedPlay,
        penalizedWalk
      };
    });
  }, 5000);

  return () => clearInterval(interval);
}, [schedulesReady]);

function isTaskMissed(timeString) {
  if (!timeString || typeof timeString !== "string") return false;
  const match = timeString.match(/(\d+):(\d+) (\w+)/);
  if (!match) return false;
  const [_, hours, minutes, period] = match;
  let hours24 = parseInt(hours);
  if (period === "PM" && hours24 !== 12) hours24 += 12;
  if (period === "AM" && hours24 === 12) hours24 = 0;

  const now = new Date();
  const taskTime = new Date();
  taskTime.setHours(hours24, parseInt(minutes), 0, 0);
  return now > taskTime;
}

    return (
    <>
    {storageWarning && (
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1b1a1a] text-white text-[11px] px-4 py-2 z-50 shadow-lg"
      >
        ⚠ Could not save data — storage may be full.{' '}
        <button onClick={() => setStorageWarning(false)} className="underline ml-2 bg-transparent border-none text-white cursor-pointer text-[11px]">dismiss</button>
      </div>
    )}
    <PetContext.Provider value={{
        pet,
        setPet,
        petInfo,
        setPetInfo,
        walkProgressCounter,
        setWalkProgressCounter,
        walkLabel,
        setWalkLabel,
        totalWalks,
        bathProgressCounter,
        setBathProgressCounter,
        bathLabel,
        setBathLabel,
        totalBaths,
        feedProgressCounter,
        setFeedProgressCounter,
        feedLabel,
        setFeedLabel,
        totalMeals,
        playProgressCounter,
        setPlayProgressCounter,
        playLabel,
        setPlayLabel,
        totalPlays,
        schedulesReady,
        setSchedulesReady,
        resetPetInfo,
        }}>
        {children}
    </PetContext.Provider>
    </>
)
}
