import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetContext } from "../context/PetContext";
import { Check } from 'lucide-react';

const schedules = [
  { key: 'feed', label: (name) => `How many times do you feed ${name}?`, route: '/feed-schedule', aria: 'Set feeding schedule' },
  { key: 'walk', label: (name) => `How many times do you take ${name} out for a walk?`, route: '/walk-schedule', aria: 'Set walk schedule' },
  { key: 'bath', label: (name) => `When do you bath ${name}?`, route: '/bath-schedule', aria: 'Set bath schedule' },
  { key: 'play', label: (name) => `When do you play with ${name}?`, route: '/play-schedule', aria: 'Set play schedule' },
];

const AdditionalInfo = () => {
  const { petInfo, setSchedulesReady } = useContext(PetContext);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const isDone = (key) => Object.values(petInfo.additional?.[key] || {}).length > 0;
  const allDone = schedules.every(s => isDone(s.key));

  useEffect(() => {
    if (!allDone) return;
    setShowToast(true);
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [allDone]);

  const handleNext = async () => {
    if (!allDone) return;
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification('PetHQ', { body: "You're all set! We'll remind you when it's time to care for your pet." });
      }
    }
    setSchedulesReady(true);
    navigate('/pet-care-zone');
  };

  return (
    <div className='bg-[#1b1a1a] min-h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#FF3232] dark:bg-[#2d0808] w-[90vw] max-w-[50rem] min-h-[80vh] my-4'>
        <h2 className='ml-[14rem] mt-[2rem] dark:text-white'>Additional Info</h2>
        <p className='text-[10px] p-[10px] mx-[3rem] dark:text-white'>Please provide this information so we can send you fair reminders and provide valuable advice on how to take care of your pet for maximum benefit and health.</p>

        <ul className='flex flex-col gap-[30px] text-[15px] mt-[2rem] mx-[2.5rem]' role="list">
          {schedules.map(({ key, label, route, aria }) => (
            <li
              key={key}
              role="button"
              tabIndex={0}
              aria-label={aria}
              onClick={() => navigate(route)}
              onKeyDown={e => e.key === 'Enter' && navigate(route)}
              className='flex items-center gap-6 cursor-pointer'
            >
              <div
                className={`w-11 h-11 rounded-full border-[3px] border-black dark:border-gray-400 shrink-0 flex items-center justify-center ${isDone(key) ? 'bg-[#FFC832]' : 'bg-transparent'}`}
              >
                {isDone(key) && <Check size={20} strokeWidth={4} className='text-black' />}
              </div>
              <span className='dark:text-white'>{label(petInfo.basic.name)}</span>
            </li>
          ))}
        </ul>

        {showToast && (
          <div className='absolute bottom-[5.5rem] left-0 right-0 flex justify-center z-50'>
            <div className='bg-[#1b1a1a] border-2 border-[#FFC832] shadow-[4px_4px_0_#FFC832] px-6 py-3 text-white text-[12px] font-bold whitespace-nowrap'>
              All schedules set — onboarding complete!
            </div>
          </div>
        )}

        <div className='absolute bottom-6 left-0 right-0 flex gap-[20px] justify-center items-center'>
          <button className="bg-[#8d8b91] w-[90px] h-[50px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c]" onClick={() => navigate('/basic-info')}>BACK</button>
          <button
            className={`w-[90px] h-[50px] shadow-[2px_6px_2px_#b91c1c] ${allDone ? 'bg-[#FFC832] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c]' : 'bg-[#8d8b91] opacity-50 cursor-not-allowed'}`}
            onClick={handleNext}
            disabled={!allDone}
            aria-disabled={!allDone}
          >
            {allDone ? 'GO!' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
