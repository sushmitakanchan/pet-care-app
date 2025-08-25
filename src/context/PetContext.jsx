import { Children, createContext, useContext, useState } from "react";

export const PetContext = createContext();
export const PetProvider = ({children})=>{
    const [pet, setPet] = useState('')
    const [walkProgressCounter, setWalkProgressCounter] = useState(0)
    const [walkLabel, setWalkLabel] = useState('')
    const [bathProgressCounter, setBathProgressCounter] = useState(0)
    const [bathLabel, setBathLabel] = useState('')
    const [feedProgressCounter, setFeedProgressCounter] = useState(0)
    const [feedLabel, setFeedLabel] = useState('')
    const [dogInfo, setDogInfo] = useState({
        name:"Bruno",
        sex: "M",
        bath: 1,
        feed: {
          morning: "9:00 AM",
          afternoon: "1:00 PM",
          snack: "5:00 PM",
          dinner: "10:00 PM" 
        },
        walk: {
            morning:"8:00 AM",
            evening:"6:00 PM"
        },
        play:{
            morning:"10:00 AM",
            evening:"8:00 PM"
        }
    })

    return (
    <PetContext.Provider value={{
        pet, 
        setPet, 
        dogInfo, 
        setDogInfo, 
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
        }}>
        {children}
    </PetContext.Provider>
)
}

