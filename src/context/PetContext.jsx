import { children, createContext, useContext, useState, useEffect } from "react";

export const PetContext = createContext();
export const PetProvider = ({children})=>{
    const [schedulesReady, setSchedulesReady] = useState(false);
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
    const stored = localStorage.getItem("PetInfo");
    if (stored) {
      return JSON.parse(stored);
    }
    // Default if no saved pet
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

  const resetPetInfo = () => {
    localStorage.removeItem("PetInfo");
    localStorage.removeItem("walkProgressCounter");
    localStorage.removeItem("feedProgressCounter");
    localStorage.removeItem("bathProgressCounter");
    localStorage.removeItem("playProgressCounter");
    setPetInfo({
      basic: { name: "", age: "", sex: "", breed: "", type: "" },
      additional: { feed: {}, play: {}, walk: {}, bath: {} },
      attributes: { hunger: 70, happiness: 80, energy: 60, hygiene: 90 },
    });

      setWalkProgressCounter(0);
      setFeedProgressCounter(0);
      setBathProgressCounter(0);
      setPlayProgressCounter(0);
  };

  // 🆕 Handle session reset only on full browser restart
  useEffect(() => {
    const sessionAlive = sessionStorage.getItem("sessionAlive");
    if (!sessionAlive) {
      // new browser session → reset
      resetPetInfo();
      sessionStorage.setItem("sessionAlive", "true");
    }
  }, []);

  // Save counters whenever they change
  useEffect(() => {
    localStorage.setItem("feedProgressCounter", feedProgressCounter);
  }, [feedProgressCounter]);

  useEffect(() => {
    localStorage.setItem("walkProgressCounter", walkProgressCounter);
  }, [walkProgressCounter]);

  useEffect(() => {
    localStorage.setItem("bathProgressCounter", bathProgressCounter);
  }, [bathProgressCounter]);

  useEffect(() => {
    localStorage.setItem("playProgressCounter", playProgressCounter);
  }, [playProgressCounter]);


    const totalWalks = petInfo?.additional?.walk ? Object.values(petInfo.additional.walk).length: 0;
    const totalMeals = petInfo?.additional?.feed ? Object.values(petInfo.additional.feed).length: 0;
    const totalBaths = petInfo?.additional?.bath ? Object.values(petInfo.additional.bath).length: 0;
    const totalPlays = petInfo?.additional?.play ? Object.values(petInfo.additional.play).length: 0;

    useEffect(()=>{
        localStorage.setItem("PetInfo", JSON.stringify(petInfo));
    }, [petInfo])

const areSchedulesComplete = (additional) => {
  return (
    additional.feed && Object.values(additional.feed).length > 0 &&
    additional.play && Object.values(additional.play).length > 0 &&
    additional.walk && Object.values(additional.walk).length > 0 &&
    additional.bath && Object.values(additional.bath).length > 0
  );
};
// Runs every 2 seconds to update pet's attributes
useEffect(() => {
  const interval = setInterval(() => {
    setPetInfo((prevPetInfo) => {
      // Copy current attributes
      if (!prevPetInfo.basic.name) {
        return prevPetInfo;
      }

      if (!schedulesReady || !areSchedulesComplete(prevPetInfo.additional)) {
        // Don't update attributes yet until all schedules are set
        return prevPetInfo;
      }

      let { hunger, happiness, energy, hygiene } = prevPetInfo.attributes;

      // 🕒 Natural changes over time
      hunger = Math.round(Math.min(hunger + 1, 100));  // hunger slowly goes UP
      energy = Math.round(Math.max(energy - 1, 0));    // energy slowly goes DOWN
      happiness = Math.round(Math.max(happiness - 1, 0)); // happiness slowly goes DOWN
      hygiene = Math.round(Math.max(hygiene - 1, 0));     // hygiene slowly goes DOWN

      let penalizedFeed = { ...prevPetInfo.penalizedFeed };
      let penalizedBath = { ...prevPetInfo.penalizedBath };
      let penalizedPlay = { ...prevPetInfo.penalizedPlay };
      let penalizedWalk = { ...prevPetInfo.penalizedWalk };

      // 🕒 Check schedules and apply penalties if missed
      // FEED
      Object.entries(prevPetInfo.additional.feed || {}).forEach(([key, time]) => {
        // if the feeding time has passed AND we didn’t feed yet
        if (isTaskMissed(time) && !penalizedFeed[key]) {
            hunger = Math.min(hunger + 5, 100); 
            penalizedFeed[key] = true;
        }
      });

      // BATH
      Object.entries(prevPetInfo.additional.bath || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedBath[key]) {
          hygiene = Math.max(hygiene - 5, 0); // pet gets dirtier
          penalizedBath[key] = true;
        }
      });

      // PLAY
      Object.entries(prevPetInfo.additional.play || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedPlay[key]) {
          happiness = Math.max(happiness - 5, 0); // pet gets sadder
          penalizedPlay[key] = true;
        }
      });

      // WALK
      Object.entries(prevPetInfo.additional.walk || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && !penalizedWalk[key]) {
          energy = Math.max(energy - 5, 0); // pet loses more energy
          penalizedWalk[key] = true;
        }
      });

      // Return updated pet info
      return {
        ...prevPetInfo,
        attributes: { hunger, happiness, energy, hygiene },
        penalizedFeed,
        penalizedBath,
        penalizedPlay,
        penalizedWalk
      };
    });
  }, 5000); // every 5 minutes

  // cleanup: stop interval when component is removed
  return () => clearInterval(interval);
}, [schedulesReady]);


// Helper function: checks if a time has already passed today
function isTaskMissed(timeString) {
 if (!timeString || typeof timeString !== "string") return false;
  const match = timeString.match(/(\d+):(\d+) (\w+)/);
  if (!match) {
    console.log("Time format not matched:", timeString);
    return false;
  }
  const [_, hours, minutes, period] = match;
  // Convert 12-hour format to 24-hour
  let hours24 = parseInt(hours);
  if (period === "PM" && hours24 !== 12) hours24 += 12;
  if (period === "AM" && hours24 === 12) hours24 = 0;

  const now = new Date();
  const taskTime = new Date();
  taskTime.setHours(hours24, parseInt(minutes), 0, 0);

  console.log("Task time:", taskTime, "Now:", now, "Missed?", now > taskTime);
  return now > taskTime;
}

    return (
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
        schedulesReady, setSchedulesReady
        }}>
        {children}
    </PetContext.Provider>
)
}

