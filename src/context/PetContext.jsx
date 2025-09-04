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
            feed: [],
            play: [],
            walk: [],
            bath: []
        },
        attributes: {
            hunger: 50,     // will change automatically + with user actions
            happiness: 70,
            energy: 80,
            hygiene: 90
         }
    }})

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

    useEffect(() => {
    if (pet) {
    localStorage.setItem("SelectedPet", pet);
          setPetInfo((prev) => ({
        ...prev,
        basic: { ...prev.basic, type: pet },
      }));
    }
    }, [pet]);

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

