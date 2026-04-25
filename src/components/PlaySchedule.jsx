import React from 'react'
import ActivityManager from './ActivityManager'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const PlaySchedule = () => {
  const navigate = useNavigate()
  return (
    <div className='bg-[#1b1a1a] min-h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#E13296] dark:bg-[#4d0a30] w-[90vw] min-h-[500px] my-4 flex flex-col px-4 py-6 sm:min-h-0 sm:my-0 sm:h-[40rem] sm:w-[50rem] sm:grid sm:grid-cols-2 sm:grid-rows-6 sm:gap-[10px] sm:p-[10px] sm:place-items-center'>
        <button
          onClick={() => navigate('/additional-info')}
          aria-label="Back to additional info"
          className="absolute top-8 left-8 bg-[#FFC832] w-[40px] h-[40px] flex items-center justify-center shadow-[3px_4px_0px_#4b2d8f] active:translate-y-1 active:shadow-[0_2px_0_#4b2d8f] border-none cursor-pointer z-10"
        >
          <ArrowLeft size={25} strokeWidth={4} className="text-black" />
        </button>
        <h3 className='text-center mb-4 mt-20 sm:ml-[25rem] sm:mb-0 dark:text-white'>PLAY</h3>
        <div className='w-full sm:w-auto sm:mt-[15rem] sm:mr-[20rem]'>
          <ActivityManager type="play" label="Play"/>
        </div>
      </div>
    </div>
  )
}

export default PlaySchedule
