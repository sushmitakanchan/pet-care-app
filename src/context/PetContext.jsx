import { Children, createContext, useContext, useState } from "react";

export const PetContext = createContext();
export const PetProvider = ({children})=>{
    const [pet, setPet] = useState('')
    
}

return (
    <PetProvider>
        {children}
    </PetProvider>
)