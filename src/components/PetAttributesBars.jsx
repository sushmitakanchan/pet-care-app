// src/components/PetAttributeBars.jsx
import React, { useContext } from "react";
import { PetContext, PetProvider } from "../context/PetContext";
import { useNavigate } from 'react-router-dom'
import BarIndicator from "./BarIndicator";

import energetic from '../assets/energetic.png'
import happiness from '../assets/happiness.png'
import hungry from '../assets/hungry.png'

const PetAttributeBars = () => {
  const { petInfo } = useContext(PetContext);
  const navigate = useNavigate()

  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    {/* Main content box */}
    <div className='bg-[#eaddc3] h-[40rem] w-[50rem] flex flex-col items-center justify-center p-[10px] rounded-lg shadow-lg'>
      <p className="text-[14px] font-bold mb-[2rem] uppercase">Level Up Your Pup!</p>
      {/* Attributes grid */}
      <div className="grid grid-cols-2 gap-6 p-6 w-full mb-[8rem]">
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
      <button className="bg-[#FFC832] w-[60px] h-[30px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mb-[2.5rem]" onClick={()=>navigate('/pet-care-zone')}>Next</button>
    </div>
  </div>
);
};

export default PetAttributeBars;
