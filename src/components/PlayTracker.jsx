import React, { useContext } from 'react'
import { PetContext } from '../context/PetContext'
import dogplay from '../assets/dogplay.png'
import catplay from '../assets/catplay.png'
import ActivityTracker from './ActivityTracker'

const PlayTracker = () => {
  const { petType, completeActivity } = useContext(PetContext)
  const playImage = petType === 'cat' ? catplay : dogplay

  const handlePlay = () => {
    completeActivity('play')
  }

  return <ActivityTracker bgColor="bg-[#E13296]" darkBgColor="dark:bg-[#4d0a30]" image={playImage} imageClass="mt-[5rem] h-[15rem] w-[20rem]" onDone={handlePlay} />
}

export default PlayTracker
