import React, { useContext } from 'react'
import { PetContext } from '../context/PetContext'
import { useNavigate } from 'react-router-dom'

const ActivityTracker = ({ bgColor, image, imageClass, onDone }) => {
  const {
    petInfo,
    walkProgressCounter, walkLabel, totalWalks,
    bathProgressCounter, bathLabel, totalBaths,
    feedProgressCounter, feedLabel, totalMeals,
    playProgressCounter, playLabel, totalPlays,
  } = useContext(PetContext)
  const navigate = useNavigate()
  const name = petInfo?.basic?.name || 'your pet'

  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className={`relative ${bgColor} h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center`}>
        <div className='flex flex-col items-center mt-[20px]'>
          <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            {walkProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#64D264] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalWalks > 0 ? (walkProgressCounter / totalWalks) * 100 : 0}%` }}>
                {totalWalks > 0 && `+${Math.round((walkProgressCounter / totalWalks) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black text-[10px]">{walkLabel || `Take ${name} for a walk!`}</p>
        </div>

        <div className='flex flex-col items-center mt-[20px]'>
          <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            {bathProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#0678f1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalBaths > 0 ? (bathProgressCounter / totalBaths) * 100 : 0}%` }}>
                {totalBaths > 0 && `+${Math.round((bathProgressCounter / totalBaths) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black text-[10px]">{bathLabel || `${name} is waiting for a shower!`}</p>
        </div>

        <div className='flex flex-col items-center'>
          <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            {feedProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#7e3ce1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalMeals > 0 ? (feedProgressCounter / totalMeals) * 100 : 0}%` }}>
                {totalMeals > 0 && `+${Math.round((feedProgressCounter / totalMeals) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black text-[10px]">{feedLabel || `${name} is hungrryyyyy`}</p>
        </div>

        <div className='flex flex-col items-center'>
          <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            {playProgressCounter > 0 && (
              <div className="absolute left-0 top-0 h-full bg-[#d80b7f] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
                style={{ width: `${totalPlays > 0 ? (playProgressCounter / totalPlays) * 100 : 0}%` }}>
                {totalPlays > 0 && `+${Math.round((playProgressCounter / totalPlays) * 100)}%`}
              </div>
            )}
          </div>
          <p className="mt-2 text-black text-[10px]">{playLabel || `${name} needs your attention`}</p>
        </div>

        <img src={image} className={`absolute ${imageClass}`} />
        <div className='absolute flex gap-[20px] mt-[30rem]'>
          <button className="bg-[#FFC832] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={() => navigate('/pet-care-zone')}>BACK</button>
          <button className="bg-[#8d8b91] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={onDone}>DONE</button>
        </div>
      </div>
    </div>
  )
}

export default ActivityTracker
