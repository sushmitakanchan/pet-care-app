/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { usePetAttributes } from "../hooks/usePetAttributes";
import { useNotifications } from "../hooks/useNotifications";
import { useActivityHistory } from "../hooks/useActivityHistory";
import { clamp01_100, emptyDaily, getSlotsForToday, pickSlotToComplete, simulateToNow } from "../lib/petSim";
import { getOnboardingStatus } from "../lib/profile";

export const PetContext = createContext();

const LS_PETS_BY_ID = "PetHQ.petsById";
const LS_PET_ORDER = "PetHQ.petOrder";
const LS_ACTIVE_PET_ID = "PetHQ.activePetId";
const LS_DARK_MODE = "darkMode";
const LS_PENALTY_RESET_DATE = "penaltyResetDate";

const safeSetItem = (key, value, onError) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage.setItem failed for key "${key}":`, e);
    onError?.();
  }
};

const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizePetInfo = (raw) => {
  const today = new Date().toDateString();
  const base = raw && typeof raw === "object" ? raw : {};
  const daily = base.daily && base.daily.date === today ? base.daily : emptyDaily(today);
  return {
    basic: base.basic || { name: "", age: "", sex: "", breed: "", type: "" },
    additional: base.additional || { feed: {}, play: {}, walk: {}, bath: {} },
    attributes: base.attributes || { hunger: 70, happiness: 80, energy: 60, hygiene: 90 },
    attributesLastUpdatedAt: base.attributesLastUpdatedAt || null,
    daily: {
      ...emptyDaily(today),
      ...(daily || {}),
      date: daily?.date || today,
      completed: { ...emptyDaily(today).completed, ...(daily?.completed || {}) },
      missed: { ...emptyDaily(today).missed, ...(daily?.missed || {}) },
    },
    // Legacy fields (kept for backwards compatibility with older saved payloads).
    penalizedFeed: base.penalizedFeed || {},
    penalizedBath: base.penalizedBath || {},
    penalizedPlay: base.penalizedPlay || {},
    penalizedWalk: base.penalizedWalk || {},
  };
};

const newPetId = () => `pet_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;

const createProfile = (type) => {
  const id = newPetId();
  const nowIso = new Date().toISOString();
  const petInfo = normalizePetInfo({
    basic: { name: "", age: "", sex: "", breed: "", type: type || "" },
  });
  return { id, createdAt: nowIso, updatedAt: nowIso, petInfo };
};

const loadInitialMultiPetState = () => {
  const petsById = safeJsonParse(localStorage.getItem(LS_PETS_BY_ID), null);
  const petOrder = safeJsonParse(localStorage.getItem(LS_PET_ORDER), null);
  const activePetId = localStorage.getItem(LS_ACTIVE_PET_ID);

  if (petsById && typeof petsById === "object" && Array.isArray(petOrder)) {
    const nextActive = activePetId && petsById[activePetId] ? activePetId : (petOrder[0] || null);
    return { petsById, petOrder, activePetId: nextActive, migrated: false };
  }

  // Legacy migration (one-time): old single-profile keys.
  const legacyStored = localStorage.getItem("PetInfo");
  if (legacyStored) {
    const legacyPetInfo = normalizePetInfo(safeJsonParse(legacyStored, null));
    const legacyType = legacyPetInfo?.basic?.type || localStorage.getItem("SelectedPet") || "";
    const fixed = normalizePetInfo({ ...legacyPetInfo, basic: { ...(legacyPetInfo.basic || {}), type: legacyType } });
    const profile = createProfile(legacyType);
    profile.petInfo = fixed;
    return {
      petsById: { [profile.id]: profile },
      petOrder: [profile.id],
      activePetId: profile.id,
      migrated: true,
    };
  }

  return { petsById: {}, petOrder: [], activePetId: null, migrated: false };
};

export const PetProvider = ({ children }) => {
  const [storageWarning, setStorageWarning] = useState(false);
  const onStorageError = useCallback(() => setStorageWarning(true), []);

  const [isDark, setIsDark] = useState(() => localStorage.getItem(LS_DARK_MODE) === "true");
  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      safeSetItem(LS_DARK_MODE, String(next), onStorageError);
      return next;
    });
  }, [onStorageError]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, { urgent = false } = {}) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, urgent }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), urgent ? 5000 : 3500);
  }, []);

  const initial = useMemo(() => loadInitialMultiPetState(), []);
  const [petsById, setPetsById] = useState(() => initial.petsById);
  const [petOrder, setPetOrder] = useState(() => initial.petOrder);
  const [activePetId, setActivePetId] = useState(() => initial.activePetId);
  const [migratedFromLegacy, setMigratedFromLegacy] = useState(() => initial.migrated);

  const activeProfile = activePetId ? petsById?.[activePetId] : null;
  const petInfo = activeProfile?.petInfo || normalizePetInfo(null);
  const petType = petInfo?.basic?.type || "";

  const { recordActivity, clearHistory, lastCompleted, streak } = useActivityHistory(activePetId);

  const addPet = useCallback((type) => {
    const profile = createProfile(type);
    setPetsById((prev) => ({ ...(prev || {}), [profile.id]: profile }));
    setPetOrder((prev) => [profile.id, ...((Array.isArray(prev) ? prev : []).filter((id) => id !== profile.id))]);
    setActivePetId(profile.id);
    return profile.id;
  }, []);

  const deletePet = useCallback(
    (petId) => {
      setPetsById((prev) => {
        const next = { ...(prev || {}) };
        delete next[petId];
        return next;
      });
      setPetOrder((prev) => (Array.isArray(prev) ? prev.filter((id) => id !== petId) : []));
      setActivePetId((prevActive) => {
        if (prevActive !== petId) return prevActive;
        const remaining = (Array.isArray(petOrder) ? petOrder : []).filter((id) => id !== petId);
        return remaining.length > 0 ? remaining[0] : null;
      });
      try {
        localStorage.removeItem(`activityHistory:${petId}`);
      } catch {
        // ignore storage failures (private mode / full quota)
      }
    },
    [petOrder]
  );

  const setPetInfo = useCallback(
    (updater) => {
      if (!activePetId) return;
      const nowIso = new Date().toISOString();
      setPetsById((prev) => {
        const current = prev?.[activePetId];
        if (!current) return prev;
        const prevInfo = current.petInfo;
        const nextInfo = typeof updater === "function" ? updater(prevInfo) : updater;
        const normalized = normalizePetInfo(nextInfo);
        return { ...(prev || {}), [activePetId]: { ...current, petInfo: normalized, updatedAt: nowIso } };
      });
    },
    [activePetId]
  );

  // Daily reset: refresh each pet's `daily` bucket once per day.
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem(LS_PENALTY_RESET_DATE);
    if (lastReset === today) return;

    setPetsById((prev) => {
      const next = { ...(prev || {}) };
      for (const id of Object.keys(next)) {
        const profile = next[id];
        const info = normalizePetInfo(profile?.petInfo);
        next[id] = {
          ...profile,
          updatedAt: new Date().toISOString(),
          petInfo: { ...info, daily: emptyDaily(today) },
        };
      }
      return next;
    });

    safeSetItem(LS_PENALTY_RESET_DATE, today, onStorageError);
  }, [onStorageError]);

  const totalWalks = petInfo?.additional?.walk ? Object.values(petInfo.additional.walk).length : 0;
  const totalMeals = petInfo?.additional?.feed ? Object.values(petInfo.additional.feed).length : 0;
  const totalBaths = petInfo?.additional?.bath ? Object.values(petInfo.additional.bath).length : 0;
  const totalPlays = petInfo?.additional?.play ? Object.values(petInfo.additional.play).length : 0;

  const todayStr = new Date().toDateString();
  const dailyToday = petInfo?.daily?.date === todayStr ? petInfo.daily : emptyDaily(todayStr);

  const walkProgressCounter = Object.keys(dailyToday.completed.walk || {}).length;
  const bathProgressCounter = Object.keys(dailyToday.completed.bath || {}).length;
  const feedProgressCounter = Object.keys(dailyToday.completed.feed || {}).length;
  const playProgressCounter = Object.keys(dailyToday.completed.play || {}).length;

  const baseDate = new Date();
  const walkSlots = getSlotsForToday("walk", petInfo?.additional?.walk, baseDate);
  const bathSlots = getSlotsForToday("bath", petInfo?.additional?.bath, baseDate);
  const feedSlots = getSlotsForToday("feed", petInfo?.additional?.feed, baseDate);
  const playSlots = getSlotsForToday("play", petInfo?.additional?.play, baseDate);

  const walkLabel =
    walkSlots.length === 0
      ? "No walks scheduled!"
      : walkProgressCounter < walkSlots.length
        ? `Next walk: ${walkSlots[walkProgressCounter].timeStr}`
        : "All walks done!";
  const bathLabel =
    bathSlots.length === 0
      ? "No baths scheduled!"
      : bathProgressCounter < bathSlots.length
        ? `Next bath: ${bathSlots[bathProgressCounter].timeStr}`
        : "Shower done!";
  const feedLabel =
    feedSlots.length === 0
      ? "No meals scheduled"
      : feedProgressCounter < feedSlots.length
        ? `Next meal: ${feedSlots[feedProgressCounter].timeStr}`
        : "All meals done!";
  const playLabel =
    playSlots.length === 0
      ? "No plays scheduled!"
      : playProgressCounter < playSlots.length
        ? `Next play: ${playSlots[playProgressCounter].timeStr}`
        : "Playing done!";

  const onboardingStatus = getOnboardingStatus(petInfo);
  const isCareEnabled = onboardingStatus === "complete";

  const completeActivity = useCallback(
    (type) => {
      if (!activePetId) return;
      if (!petInfo?.basic?.name) return;
      recordActivity(type);
      const now = new Date();
      setPetInfo((prev) => {
        let next = simulateToNow(prev, now);
        const daily = next.daily?.date === now.toDateString() ? next.daily : emptyDaily(now.toDateString());
        const slot = pickSlotToComplete({ ...next, daily }, type, now);
        if (!slot) return { ...next, daily };

        const nextCompletedForType = { ...(daily.completed?.[type] || {}), [slot.slotId]: now.toISOString() };
        const nextDaily = { ...daily, completed: { ...(daily.completed || {}), [type]: nextCompletedForType } };

        const attrs = { ...(next.attributes || {}) };
        if (type === "feed") {
          attrs.hunger = clamp01_100((attrs.hunger ?? 0) - 20);
          attrs.energy = clamp01_100((attrs.energy ?? 0) + 10);
          attrs.happiness = clamp01_100((attrs.happiness ?? 0) + 5);
          attrs.hygiene = clamp01_100((attrs.hygiene ?? 0) - 2);
        }
        if (type === "play") {
          attrs.happiness = clamp01_100((attrs.happiness ?? 0) + 20);
          attrs.energy = clamp01_100((attrs.energy ?? 0) - 15);
          attrs.hunger = clamp01_100((attrs.hunger ?? 0) + 10);
          attrs.hygiene = clamp01_100((attrs.hygiene ?? 0) - 3);
        }
        if (type === "walk") {
          attrs.hunger = clamp01_100((attrs.hunger ?? 0) + 10);
          attrs.energy = clamp01_100((attrs.energy ?? 0) - 10);
          attrs.happiness = clamp01_100((attrs.happiness ?? 0) + 15);
          attrs.hygiene = clamp01_100((attrs.hygiene ?? 0) - 5);
        }
        if (type === "bath") {
          attrs.hygiene = clamp01_100((attrs.hygiene ?? 0) + 20);
          attrs.energy = clamp01_100((attrs.energy ?? 0) - 5);
          attrs.happiness = clamp01_100((attrs.happiness ?? 0) - 5);
        }

        return { ...next, attributes: attrs, daily: nextDaily };
      });
    },
    [activePetId, petInfo?.basic?.name, recordActivity, setPetInfo]
  );

  // Persist multi-pet state.
  useEffect(() => {
    safeSetItem(LS_PETS_BY_ID, JSON.stringify(petsById || {}), onStorageError);
    safeSetItem(LS_PET_ORDER, JSON.stringify(petOrder || []), onStorageError);
    safeSetItem(LS_ACTIVE_PET_ID, activePetId || "", onStorageError);
  }, [activePetId, onStorageError, petOrder, petsById]);

  // Legacy cleanup (after migration is persisted at least once).
  useEffect(() => {
    if (!migratedFromLegacy) return;
    try {
      localStorage.removeItem("PetInfo");
      localStorage.removeItem("SelectedPet");
      sessionStorage.removeItem("schedulesReady");
    } catch {
      // ignore
    }
    setMigratedFromLegacy(false);
  }, [migratedFromLegacy]);

  usePetAttributes(setPetInfo, isCareEnabled);
  useNotifications(petInfo, isCareEnabled, addToast);

  return (
    <>
      {toasts.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
          {toasts.map((toast) =>
            toast.urgent ? (
              <div
                key={toast.id}
                className="bg-[#FF3232] border-2 border-[#FFC832] shadow-[4px_4px_0_#000] px-6 py-4 text-white text-[12px] font-bold whitespace-nowrap animate-pulse tracking-widest uppercase"
              >
                {toast.message}
              </div>
            ) : (
              <div
                key={toast.id}
                className="bg-[#1b1a1a] border-2 border-[#FFC832] shadow-[4px_4px_0_#FFC832] px-6 py-4 text-white text-[12px] font-bold whitespace-nowrap"
              >
                🐾 {toast.message}
              </div>
            )
          )}
        </div>
      )}

      {storageWarning && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1b1a1a] text-white text-[11px] px-4 py-2 z-50 shadow-lg">
          ⚠ Could not save data — storage may be full.{" "}
          <button
            onClick={() => setStorageWarning(false)}
            className="underline ml-2 bg-transparent border-none text-white cursor-pointer text-[11px]"
          >
            dismiss
          </button>
        </div>
      )}

      <PetContext.Provider
        value={{
          petsById,
          petOrder,
          activePetId,
          setActivePetId,
          addPet,
          deletePet,

          petInfo,
          setPetInfo,
          petType,
          isDark,
          toggleDark,

          walkProgressCounter,
          walkLabel,
          totalWalks,
          bathProgressCounter,
          bathLabel,
          totalBaths,
          feedProgressCounter,
          feedLabel,
          totalMeals,
          playProgressCounter,
          playLabel,
          totalPlays,

          completeActivity,
          recordActivity,
          clearHistory,
          lastCompleted,
          streak,
          addToast,
        }}
      >
        {children}
      </PetContext.Provider>
    </>
  );
};
