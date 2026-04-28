import React, { useContext } from 'react'
import { PetContext } from '../context/PetContext'
import dogbath from '../assets/dog-bath.png'
import catbath from '../assets/catbath.png'
import ActivityTracker from './ActivityTracker'

const BathTracker = () => {
  const { petType, completeActivity } = useContext(PetContext)
  const bathImage = petType === 'cat' ? catbath : dogbath

  const handleBath = () => {
    completeActivity('bath')
  }

  return <ActivityTracker bgColor="bg-[#3296FF]" darkBgColor="dark:bg-[#0a2050]" image={bathImage} imageClass="mt-[2rem] size-[12rem]" onDone={handleBath} />
}

export default BathTracker
