import { createContext, useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { usePetAttributes } from "../hooks/usePetAttributes";
import { useNotifications } from "../hooks/useNotifications";
import { useActivityHistory } from "../hooks/useActivityHistory";

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

  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const [schedulesReady, setSchedulesReady] = useState(() => {
    return sessionStorage.getItem("schedulesReady") === "true";
  });
  const [pet, setPet] = useState(()=>{
    const stored = localStorage.getItem("SelectedPet");
    return stored ? stored : "";
  });
  const [walkProgressCounter, setWalkProgressCounter] = useState(() => {
    return Number(localStorage.getItem("walkProgressCounter")) || 0;
  });
  const [walkLabel, setWalkLabel] = useState('');

  const [bathProgressCounter, setBathProgressCounter] = useState(() => {
    return Number(localStorage.getItem("bathProgressCounter")) || 0;
  });
  const [bathLabel, setBathLabel] = useState('');
  const [feedProgressCounter, setFeedProgressCounter] = useState(() => {
    return Number(localStorage.getItem("feedProgressCounter")) || 0;
  });
  const [feedLabel, setFeedLabel] = useState('');

  const [playProgressCounter, setPlayProgressCounter] = useState(() => {
    return Number(localStorage.getItem("playProgressCounter")) || 0;
  });
  const [playLabel, setPlayLabel] = useState('');

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

  const { recordActivity, clearHistory, lastCompleted, streak } = useActivityHistory();

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
    clearHistory();
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

  const totalWalks = petInfo?.additional?.walk ? Object.values(petInfo.additional.walk).length : 0;
  const totalMeals = petInfo?.additional?.feed ? Object.values(petInfo.additional.feed).length : 0;
  const totalBaths = petInfo?.additional?.bath ? Object.values(petInfo.additional.bath).length : 0;
  const totalPlays = petInfo?.additional?.play ? Object.values(petInfo.additional.play).length : 0;

  useEffect(()=>{
    safeSetItem("PetInfo", JSON.stringify(petInfo), onStorageError);
  }, [petInfo]);

  usePetAttributes(setPetInfo, schedulesReady);
  useNotifications(petInfo, schedulesReady, addToast);

  return (
    <>
    <button
      onClick={toggleDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed top-3 right-3 z-[100] bg-[#FFC832] w-[36px] h-[36px] flex items-center justify-center shadow-[2px_4px_0_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]"
    >
      {isDark ? <Sun size={16} className="text-black" /> : <Moon size={16} className="text-black" />}
    </button>
    {toasts.length > 0 && (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        {toasts.map(toast => (
          <div key={toast.id} className="bg-[#1b1a1a] border-2 border-[#FFC832] shadow-[4px_4px_0_#FFC832] px-6 py-4 text-white text-[12px] font-bold whitespace-nowrap">
            🐾 {toast.message}
          </div>
        ))}
      </div>
    )}
    {storageWarning && (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1b1a1a] text-white text-[11px] px-4 py-2 z-50 shadow-lg">
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
      recordActivity,
      lastCompleted,
      streak,
    }}>
      {children}
    </PetContext.Provider>
    </>
  );
};
