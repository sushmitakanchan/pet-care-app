import React, { useContext } from "react";
import { PetContext } from "../context/PetContext";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BarIndicator from "./BarIndicator";
import { formatLastCompleted } from "../hooks/useActivityHistory";
import ThemeToggle from "./ThemeToggle";

import energetic from '../assets/energetic.png';
import happiness from '../assets/happiness.png';
import hungry from '../assets/hungry.png';
import doghygiene from '../assets/doghygiene.png';

import catexcited from '../assets/catexcited.png';
import cathappiness from '../assets/cathappiness.png';
import cathungry from '../assets/cathungry.png';
import cathygiene from '../assets/cathygine.png';

const ACTIVITY_LABELS = {
  walk: 'Walk',
  feed: 'Feed',
  bath: 'Bath',
  play: 'Play',
};

const PetAttributeBars = () => {
  const { petType, petInfo, lastCompleted, streak } = useContext(PetContext);
  const navigate = useNavigate();

  const icons = petType === 'cat'
    ? { hunger: cathungry, happiness: cathappiness, energy: catexcited, hygiene: cathygiene }
    : { hunger: hungry, happiness: happiness, energy: energetic, hygiene: doghygiene };

  const heading = petType === 'cat' ? 'Level Up Your Cat!' : 'Level Up Your Pup!';

  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center overflow-hidden'>
      <div className='relative bg-[#eaddc3] dark:bg-[#2a2520] w-[90vw] max-w-[50rem] h-[80vh] flex flex-col items-center p-[10px] rounded-lg shadow-lg overflow-hidden'>
        <ThemeToggle />
        <button
          onClick={() => navigate('/pet-care-zone')}
          aria-label="Back to pet care zone"
          className="absolute top-8 left-8 bg-[#FFC832] w-[40px] h-[40px] flex items-center justify-center shadow-[3px_4px_0px_#4b2d8f] active:translate-y-1 active:shadow-[0_2px_0_#4b2d8f] border-none cursor-pointer z-10"
        >
          <ArrowLeft size={25} strokeWidth={4} className="text-black" />
        </button>

        <p className="text-[14px] font-bold mb-[1rem] mt-[4rem] uppercase dark:text-white">{heading}</p>

        {/* Streak */}
        <div className="mb-[1.5rem] text-center" aria-label={`Current streak: ${streak} days`}>
          {streak > 0 ? (
            <span className="text-[11px] font-bold text-[#FFC832]" style={{ textShadow: '1px 1px 0 #000' }}>
              🔥 {streak} DAY{streak !== 1 ? 'S' : ''} STREAK
            </span>
          ) : (
            <span className="text-[9px] text-gray-500 dark:text-gray-400">Complete all activities daily to build a streak</span>
          )}
        </div>

        {/* Attribute bars */}
        <div className="grid grid-cols-2 gap-6 p-6 w-full">
          <BarIndicator label="Hunger" value={petInfo.attributes?.hunger ?? 0} icon={icons.hunger} pet={petType} />
          <BarIndicator label="Happiness" value={petInfo.attributes?.happiness ?? 0} icon={icons.happiness} pet={petType} />
          <BarIndicator label="Energy" value={petInfo.attributes?.energy ?? 0} icon={icons.energy} pet={petType} />
          <BarIndicator label="Hygiene" value={petInfo.attributes?.hygiene ?? 0} icon={icons.hygiene} pet={petType} />
        </div>

        {/* Last activity history */}
        <div className="w-full px-6 mb-6" aria-label="Activity history">
          <p className="text-[9px] uppercase tracking-wider font-bold mb-3 dark:text-white">Last Activity</p>
          <div className="flex flex-col gap-2">
            {Object.entries(ACTIVITY_LABELS).map(([type, label]) => (
              <div key={type} className="flex justify-between items-center text-[8px]">
                <span className="font-bold dark:text-gray-300">{label}</span>
                <span className="text-gray-600 dark:text-gray-400">{formatLastCompleted(lastCompleted?.[type])}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="bg-[#FFC832] w-[60px] h-[30px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mb-[2.5rem]"
          onClick={() => navigate('/pet-care-zone')}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default PetAttributeBars;
