// src/components/PetAttributeBars.jsx
import React, { useContext } from "react";
import { PetContext, PetProvider } from "../context/PetContext";
import BarIndicator from "./BarIndicator";

import energetic from '../assets/energetic.png'
import happiness from '../assets/happiness.png'
import hungry from '../assets/hungry.png'

const PetAttributeBars = () => {
  const { petInfo } = useContext(PetContext);

  return (
     <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='bg-[#eaddc3] h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'></div>
    <div className="fixed grid grid-cols-2 gap-6 p-6">
      <BarIndicator label="Hunger"
        value={petInfo.attributes?.hunger ?? 0}
        icon={hungry}
      />

      <BarIndicator label="Happiness"
        value={petInfo.attributes?.happiness ?? 0}
        icon={happiness}
       
      />
      <BarIndicator label="Energy"
        value={petInfo.attributes?.energy ?? 0}
        icon={energetic}
        
      />
      <BarIndicator label="Hygiene"
        value={petInfo.attributes?.hygiene ?? 0}
        icon={energetic}
        
      />
    </div>
    </div>
  );
};

export default PetAttributeBars;
