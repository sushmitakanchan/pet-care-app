import React, { useContext } from "react";
import { PetContext } from "../context/PetContext";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BarIndicator from "./BarIndicator";

import energetic from '../assets/energetic.png';
import happiness from '../assets/happiness.png';
import hungry from '../assets/hungry.png';
import doghygiene from '../assets/doghygiene.png';

import catexcited from '../assets/catexcited.png';
import cathappiness from '../assets/cathappiness.png';
import cathungry from '../assets/cathungry.png';
import cathygiene from '../assets/cathygine.png';

const PetAttributeBars = () => {
  const { pet, petInfo } = useContext(PetContext);
  const navigate = useNavigate()

  const icons = pet === 'cat'
    ? { hunger: cathungry, happiness: cathappiness, energy: catexcited, hygiene: cathygiene }
    : { hunger: hungry, happiness: happiness, energy: energetic, hygiene: doghygiene }

  const heading = pet === 'cat' ? 'Level Up Your Cat!' : 'Level Up Your Pup!'

  return (
    <div className='bg-[#1b1a1a] min-h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#eaddc3] w-[90vw] max-w-[50rem] min-h-[80vh] my-4 flex flex-col items-center justify-center p-[10px] rounded-lg shadow-lg'>
        <button
          onClick={() => navigate('/pet-care-zone')}
          aria-label="Back to pet care zone"
          className="absolute top-8 left-8 bg-[#FFC832] w-[40px] h-[40px] flex items-center justify-center shadow-[3px_4px_0px_#4b2d8f] active:translate-y-1 active:shadow-[0_2px_0_#4b2d8f] border-none cursor-pointer z-10"
        >
          <ArrowLeft size={25} strokeWidth={4} className="text-black" />
        </button>
        <p className="text-[14px] font-bold mb-[2rem] mt-[4rem] uppercase">{heading}</p>
        <div className="grid grid-cols-2 gap-6 p-6 w-full mb-[8rem]">
          <BarIndicator label="Hunger" value={petInfo.attributes?.hunger ?? 0} icon={icons.hunger} pet={pet} />
          <BarIndicator label="Happiness" value={petInfo.attributes?.happiness ?? 0} icon={icons.happiness} pet={pet} />
          <BarIndicator label="Energy" value={petInfo.attributes?.energy ?? 0} icon={icons.energy} pet={pet} />
          <BarIndicator label="Hygiene" value={petInfo.attributes?.hygiene ?? 0} icon={icons.hygiene} pet={pet} />
        </div>
        <button className="bg-[#FFC832] w-[60px] h-[30px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mb-[2.5rem]" onClick={() => navigate('/pet-care-zone')}>OK</button>
      </div>
    </div>
  );
};

export default PetAttributeBars;
