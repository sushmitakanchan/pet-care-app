import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdditionalInfo = () => {
  const navigate = useNavigate()
  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#FF3232] h-[40rem] w-[50rem] mt-[3rem] mb-[3rem]'>
      <h2>Additional Info</h2>
      <p className='text-[10px] p-[10px]'>Please provide this information so we can send you fair reminders and provide valuable advice onhow to take care of dog to his maximum benefit and health. Your activity in the app will be tracked to adjust the settings to the real situation too</p>
      <div>
      <ul className = 'flex flex-col gap-[20px] text-[15px] mt-[7rem]'>
      <li onClick={() => navigate("/feed-schedule")} className='cursor-pointer'>How many times do you feed Ghost?</li>
      <li onClick={() => navigate("/walk-schedule")} className='cursor-pointer'>How many times do you take Ghost out for a walk?</li>
      <li onClick={() => navigate("/bath-schedule")} className='cursor-pointer'>When do you bath Ghost?</li>
      <li onClick={() => navigate("/play-schedule")} className='cursor-pointer'>When do you play with Ghost?</li>
      </ul>
      </div>
      <div className='flex gap-[20px] justify-center items-center mt-[10rem] cursor-pointer'>
            <button className="bg-[#8d8b91] w-[90px] h-[50px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]">BACK</button>
            <button className="bg-[#FFC832] w-[90px] h-[50px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={()=>navigate('/pet-care-zone')} >NEXT</button>
      </div>

      </div>
      </div>
  )
}

export default AdditionalInfo
