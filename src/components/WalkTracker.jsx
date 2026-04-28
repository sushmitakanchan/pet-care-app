import React, { useContext } from 'react'
import dogwalk from '../assets/dog-walk.png'
import catwalk from '../assets/catwalk.png'
import { PetContext } from '../context/PetContext'
import ActivityTracker from './ActivityTracker'

const WalkTracker = () => {
  const { petType, completeActivity } = useContext(PetContext)
  const walkImage = petType === 'cat' ? catwalk : dogwalk

  const handleWalk = () => {
    completeActivity('walk')
  }

  return <ActivityTracker bgColor="bg-[#64D264]" darkBgColor="dark:bg-[#1a3d1a]" image={walkImage} imageClass="mt-[5rem] size-[12rem]" onDone={handleWalk} />
}

export default WalkTracker
