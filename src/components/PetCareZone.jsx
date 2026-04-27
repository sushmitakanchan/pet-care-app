import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import dog from '../assets/dog.png';
import cat from '../assets/cat2.png';
import { PetContext } from "../context/PetContext";

const STRUGGLE_MAP = [
  { key: 'hunger',    check: v => v === 0, toast: name => `🍖 ${name} is STARVING — FEED NOW!!` },
  { key: 'happiness', check: v => v === 0, toast: name => `💔 ${name} is MISERABLE — GO PLAY!!` },
  { key: 'energy',    check: v => v === 0, toast: name => `😴 ${name} is DRAINED — GO WALK!!` },
  { key: 'hygiene',   check: v => v === 0, toast: name => `🚿 ${name} is GROSS — GIVE A BATH!!` },
];

const PetCareZone = () => {
  const { pet, petInfo, walkProgressCounter, walkLabel, bathProgressCounter, bathLabel, feedProgressCounter, feedLabel, playProgressCounter, playLabel, totalWalks, totalMeals, totalPlays, totalBaths, addToast } = useContext(PetContext);
  const petImage = pet === 'cat' ? cat : dog;
  const navigate = useNavigate();
  const name = petInfo?.basic?.name || 'your pet';

  const attrs = petInfo?.attributes ?? {};
  const isStruggling = STRUGGLE_MAP.some(({ key, check }) => check(attrs[key] ?? -1));

  // Fire a toast once per attribute when it drops to 0; re-arm when it recovers
  const alerted = useRef(new Set());
  useEffect(() => {
    for (const { key, check, toast } of STRUGGLE_MAP) {
      const val = attrs[key] ?? -1;
      if (check(val) && !alerted.current.has(key)) {
        alerted.current.add(key);
        addToast(toast(name), { urgent: true });
      } else if (!check(val)) {
        alerted.current.delete(key);
      }
    }
  }, [attrs.hunger, attrs.happiness, attrs.energy, attrs.hygiene]);

  return (
    <div className='bg-[#1b1a1a] min-h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#FFC832] dark:bg-[#2d2500] w-[90vw] max-w-[50rem] min-h-[80vh] my-4 grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'>
        <button
          onClick={() => navigate('/additional-info')}
          aria-label="Back to additional info"
          className="absolute top-8 left-8 bg-[#FFC832] dark:bg-[#FFC832] w-[40px] h-[40px] flex items-center justify-center shadow-[3px_4px_0px_#4b2d8f] active:translate-y-1 active:shadow-[0_2px_0_#4b2d8f] border-none cursor-pointer z-10"
        >
          <ArrowLeft size={25} strokeWidth={4} className="text-black" />
        </button>

        <div className='flex flex-col items-center mt-[6rem]'>
          <div role="progressbar" aria-label="Walk progress" aria-valuenow={totalWalks > 0 ? Math.round((walkProgressCounter / totalWalks) * 100) : 0} aria-valuemin={0} aria-valuemax={100} className='relative border border-black dark:border-gray-500 w-[20rem] h-[3rem] overflow-hidden'>
            {walkProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#64D264] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalWalks > 0 ? (walkProgressCounter / totalWalks) * 100 : 0}%` }}>
                {totalWalks > 0 && `+${Math.round((walkProgressCounter / totalWalks) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black dark:text-white text-[10px]">{walkLabel ? walkLabel : `Take ${name} for a walk!`}</p>
        </div>

        <div className='flex flex-col items-center mt-[6rem]'>
          <div role="progressbar" aria-label="Bath progress" aria-valuenow={totalBaths > 0 ? Math.round((bathProgressCounter / totalBaths) * 100) : 0} aria-valuemin={0} aria-valuemax={100} className='relative border border-black dark:border-gray-500 w-[20rem] h-[3rem] overflow-hidden'>
            {bathProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#0678f1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalBaths > 0 ? (bathProgressCounter / totalBaths) * 100 : 0}%` }}>
                {totalBaths > 0 && `+${Math.round((bathProgressCounter / totalBaths) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black dark:text-white text-[10px]">{bathLabel ? bathLabel : `${name} is waiting for a shower!`}</p>
        </div>

        <div className='flex flex-col items-center'>
          <div role="progressbar" aria-label="Feed progress" aria-valuenow={totalMeals > 0 ? Math.round((feedProgressCounter / totalMeals) * 100) : 0} aria-valuemin={0} aria-valuemax={100} className='relative border border-black dark:border-gray-500 w-[20rem] h-[3rem] overflow-hidden'>
            {feedProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#7e3ce1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalMeals > 0 ? (feedProgressCounter / totalMeals) * 100 : 0}%` }}>
                {totalMeals > 0 && `+${Math.round((feedProgressCounter / totalMeals) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black dark:text-white text-[10px]">{feedLabel ? feedLabel : `${name} is hungrryyyyy`}</p>
        </div>

        <div className='flex flex-col items-center'>
          <div role="progressbar" aria-label="Play progress" aria-valuenow={totalPlays > 0 ? Math.round((playProgressCounter / totalPlays) * 100) : 0} aria-valuemin={0} aria-valuemax={100} className='relative border border-black dark:border-gray-500 w-[20rem] h-[3rem] overflow-hidden'>
            {playProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#d80b7f] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalPlays > 0 ? (playProgressCounter / totalPlays) * 100 : 0}%` }}>
                {totalPlays > 0 && `+${Math.round((playProgressCounter / totalPlays) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black dark:text-white text-[10px]">{playLabel ? playLabel : `${name} needs your attention`}</p>
        </div>
      </div>

      <div className='absolute mt-[5rem] flex flex-col items-center gap-1'>
        <button
          onClick={() => navigate('/pet-care-zone/pet-moods')}
          aria-label="View pet stats"
          className='bg-transparent border-none p-0 cursor-pointer'
        >
          <img
            src={petImage}
            alt={pet === 'cat' ? 'Your cat' : 'Your dog'}
            className={`w-[180px] h-[180px] hover:border border-black mb-[20px] hover:shadow-[2px_6px_2px_#6b7280] active:translate-y-1 active:shadow-[0_2px_0_#6b7280] ${isStruggling ? 'animate-pulse' : ''}`}
          />
        </button>
        <span className='text-black dark:text-white text-[11px] font-bold'>How's {petInfo?.basic?.name || (pet === 'cat' ? 'your cat' : 'your pup')} feeling?</span>
      </div>

      <div className='absolute flex gap-[20px] mt-[30rem]'>
        <button className="bg-[#64D264] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={() => navigate('/pet-walk')}>WALK</button>
        <button className="bg-[#3296FF] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={() => navigate('/pet-bath')}>BATH</button>
        <button className="bg-[#9664E1] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={() => navigate('/pet-feed')}>FEED</button>
        <button className="bg-[#E13296] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={() => navigate('/pet-play')}>PLAY</button>
      </div>
    </div>
  );
};

export default PetCareZone;
