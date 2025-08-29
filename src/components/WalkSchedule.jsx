import React from 'react'
import ActivityManager from './ActivityManager'

const WalkSchedule = () => {
  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#64D264] h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'>
        <h3 className='ml-[25rem]'>WALKS</h3>
        <div className='mt-[10rem] mr-[20rem]'>
        <ActivityManager type="walk" label="Walk"/>
        </div>
    </div>
    </div>
  )
}

export default WalkSchedule
