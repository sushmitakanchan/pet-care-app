import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { PetContext } from "../context/PetContext";

const AdditionalInfo = () => {
  const { petInfo, setSchedulesReady } = useContext(PetContext)
  const navigate = useNavigate()

  const handleNext = () => {
    setSchedulesReady(true);
    navigate('/pet-care-zone')
  }

  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#FF3232] h-[40rem] w-[50rem] mt-[3rem] mb-[3rem]'>
        <h2 className='ml-[14rem] mt-[2rem]'>Additional Info</h2>
        <p className='text-[10px] p-[10px] mx-[3rem]'>Please provide this information so we can send you fair reminders and provide valuable advice on how to take care of your pet for maximum benefit and health.</p>
        <div>
          <ul className='flex flex-col gap-[20px] text-[15px] mt-[2rem] mx-[2rem]' role="list">
            <li role="button" tabIndex={0} aria-label="Set feeding schedule" onClick={() => navigate("/feed-schedule")} onKeyDown={e => e.key === 'Enter' && navigate("/feed-schedule")} className='cursor-pointer'>How many times do you feed {petInfo.basic.name}?</li>
            <li role="button" tabIndex={0} aria-label="Set walk schedule" onClick={() => navigate("/walk-schedule")} onKeyDown={e => e.key === 'Enter' && navigate("/walk-schedule")} className='cursor-pointer'>How many times do you take {petInfo.basic.name} out for a walk?</li>
            <li role="button" tabIndex={0} aria-label="Set bath schedule" onClick={() => navigate("/bath-schedule")} onKeyDown={e => e.key === 'Enter' && navigate("/bath-schedule")} className='cursor-pointer'>When do you bath {petInfo.basic.name}?</li>
            <li role="button" tabIndex={0} aria-label="Set play schedule" onClick={() => navigate("/play-schedule")} onKeyDown={e => e.key === 'Enter' && navigate("/play-schedule")} className='cursor-pointer'>When do you play with {petInfo.basic.name}?</li>
          </ul>
        </div>
        <div className='flex gap-[20px] justify-center items-center mt-[10rem] cursor-pointer'>
          <button className="bg-[#8d8b91] w-[90px] h-[50px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={() => navigate('/basic-info')}>BACK</button>
          <button className="bg-[#FFC832] w-[90px] h-[50px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={handleNext}>NEXT</button>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfo
