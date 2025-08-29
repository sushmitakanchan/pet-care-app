import { Children, createContext, useContext, useState, useEffect } from "react";

export const PetContext = createContext();
export const PetProvider = ({children})=>{
    const [pet, setPet] = useState(()=>{
        const stored = localStorage.getItem("PetInfo");
        return stored ? JSON.parse(stored) : { basic: {}, additional: {} };
    })
    const [walkProgressCounter, setWalkProgressCounter] = useState(0)
    const [walkLabel, setWalkLabel] = useState('')
    const [bathProgressCounter, setBathProgressCounter] = useState(0)
    const [bathLabel, setBathLabel] = useState('')
    const [feedProgressCounter, setFeedProgressCounter] = useState(0)
    const [feedLabel, setFeedLabel] = useState('')
    const [playProgressCounter, setPlayProgressCounter] = useState(0)
    const [playLabel, setPlayLabel] = useState('')
    const [petInfo, setPetInfo] = useState({
        basic:{
            name:"",
            age:"",
            sex:"",
            breed: "",
            type: pet
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
    })
    useEffect(() => {
    if (petInfo) {
    localStorage.setItem("PetInfo", JSON.stringify(petInfo));
    }
    }, [petInfo]);
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
        bathProgressCounter,
        setBathProgressCounter,
        bathLabel,
        setBathLabel,
        feedProgressCounter,
        setFeedProgressCounter,
        feedLabel,
        setFeedLabel,
        playProgressCounter,
        setPlayProgressCounter,
        playLabel,
        setPlayLabel
        }}>
        {children}
    </PetContext.Provider>
)
}

