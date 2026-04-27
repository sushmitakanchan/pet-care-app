import React, { useContext, useEffect } from 'react'
import dogwalk from '../assets/dog-walk.png'
import catwalk from '../assets/catwalk.png'
import { PetContext } from '../context/PetContext'
import ActivityTracker from './ActivityTracker'

const WalkTracker = () => {
  const { pet, petInfo, setPetInfo, walkProgressCounter, setWalkProgressCounter, setWalkLabel, totalWalks, recordActivity } = useContext(PetContext)
  const walkImage = pet === 'cat' ? catwalk : dogwalk

  const handleWalk = () => {
    if (walkProgressCounter >= totalWalks) return
    setWalkProgressCounter(prev => prev + 1)
    recordActivity('walk')
    setPetInfo(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        hunger: Math.min(prev.attributes.hunger + 10, 100),
        energy: Math.max(prev.attributes.energy - 10, 0),
        happiness: Math.min(prev.attributes.happiness + 15, 100),
        hygiene: Math.max(prev.attributes.hygiene - 5, 0),
      }
    }))
  }

  useEffect(() => {
    const walkList = petInfo?.additional?.walk ? Object.values(petInfo.additional.walk) : []
    if (walkList.length === 0) { setWalkLabel('No walks scheduled!'); return }
    if (walkProgressCounter < walkList.length) {
      setWalkLabel(`Next walk: ${walkList[walkProgressCounter]}`)
    } else {
      setWalkLabel('All walks done!')
    }
  }, [walkProgressCounter, petInfo, setWalkLabel])

  return <ActivityTracker bgColor="bg-[#64D264]" darkBgColor="dark:bg-[#1a3d1a]" image={walkImage} imageClass="mt-[5rem] size-[12rem]" onDone={handleWalk} />
}

export default WalkTracker
