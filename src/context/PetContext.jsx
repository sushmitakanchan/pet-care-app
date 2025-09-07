import { children, createContext, useContext, useState, useEffect } from "react";

export const PetContext = createContext();
export const PetProvider = ({children})=>{
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
    
    const [petInfo, setPetInfo] = useState(()=>{
        const stored = localStorage.getItem("PetInfo");
        return stored ? JSON.parse(stored) : {
        basic:{
            name:"",
            age:"",
            sex:"",
            breed: "",
            type: ""
        },
        additional: {
            feed: {},
            play: {},
            walk: {},
            bath: {}
        },
        attributes: {
          hunger: 70,
          happiness: 80,
          energy: 60,
          hygiene: 90,
         }
         
         
    }
    
  })


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

// Runs every 2 seconds to update pet's attributes
useEffect(() => {
  const interval = setInterval(() => {
    setPetInfo((prevPetInfo) => {
      // Copy current attributes
      let { hunger, happiness, energy, hygiene } = prevPetInfo.attributes;

      // 🕒 Natural changes over time
      hunger = Math.round(Math.min(hunger + 1, 100));  // hunger slowly goes UP
      energy = Math.round(Math.max(energy - 1, 0));    // energy slowly goes DOWN
      happiness = Math.round(Math.max(happiness - 1, 0)); // happiness slowly goes DOWN
      hygiene = Math.round(Math.max(hygiene - 1, 0));     // hygiene slowly goes DOWN

      // 🕒 Check schedules and apply penalties if missed
      // FEED
      Object.entries(prevPetInfo.additional.feed || {}).forEach(([key, time]) => {
        // if the feeding time has passed AND we didn’t feed yet
        if (isTaskMissed(time) && feedProgressCounter < Number(key)) {
          hunger = Math.min(hunger + 1, 100); // pet gets hungrier
        }
      });

      // BATH
      Object.entries(prevPetInfo.additional.bath || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && bathProgressCounter < Number(key)) {
          hygiene = Math.max(hygiene - 1, 0); // pet gets dirtier
        }
      });

      // PLAY
      Object.entries(prevPetInfo.additional.play || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && playProgressCounter < Number(key)) {
          happiness = Math.max(happiness - 1, 0); // pet gets sadder
        }
      });

      // WALK
      Object.entries(prevPetInfo.additional.walk || {}).forEach(([key, time]) => {
        if (isTaskMissed(time) && walkProgressCounter < Number(key)) {
          energy = Math.max(energy - 1, 0); // pet loses more energy
        }
      });

      // Return updated pet info
      return {
        ...prevPetInfo,
        attributes: { hunger, happiness, energy, hygiene }
      };
    });
  }, 2000); // every 5 minutes

  // cleanup: stop interval when component is removed
  return () => clearInterval(interval);
}, [feedProgressCounter, bathProgressCounter, playProgressCounter, walkProgressCounter]);


// Helper function: checks if a time has already passed today
function isTaskMissed(timeString) {
  const now = new Date();
  const [hours, minutes, period] = timeString.match(/(\d+):(\d+) (\w+)/).slice(1);

  // Convert 12-hour format to 24-hour
  let hours24 = parseInt(hours);
  if (period === "PM" && hours24 !== 12) hours24 += 12;
  if (period === "AM" && hours24 === 12) hours24 = 0;

  const taskTime = new Date();
  taskTime.setHours(hours24, parseInt(minutes), 0, 0);

  return now > taskTime; // true if current time has passed scheduled time
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
        totalPlays
        }}>
        {children}
    </PetContext.Provider>
)
}

