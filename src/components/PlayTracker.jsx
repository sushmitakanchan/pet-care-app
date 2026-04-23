import React, { useContext, useEffect } from 'react'
import { PetContext } from '../context/PetContext'
import dogplay from '../assets/dogplay.png'
import catplay from '../assets/catplay.png'
import ActivityTracker from './ActivityTracker'

const PlayTracker = () => {
  const { pet, petInfo, setPetInfo, playProgressCounter, setPlayProgressCounter, setPlayLabel, totalPlays } = useContext(PetContext)
  const playImage = pet === 'cat' ? catplay : dogplay

  const handlePlay = () => {
    if (playProgressCounter >= totalPlays) return
    setPlayProgressCounter(prev => prev + 1)
    setPetInfo(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        happiness: Math.min(prev.attributes.happiness + 20, 100),
        energy: Math.max(prev.attributes.energy - 15, 0),
        hunger: Math.min(prev.attributes.hunger + 10, 100),
        hygiene: Math.max(prev.attributes.hygiene - 3, 0),
      }
    }))
  }

  useEffect(() => {
    const playList = petInfo?.additional?.play ? Object.values(petInfo.additional.play) : []
    if (playList.length === 0) { setPlayLabel('No plays scheduled!'); return }
    if (playProgressCounter < playList.length) {
      setPlayLabel(`Next play: ${playList[playProgressCounter]}`)
    } else {
      setPlayLabel('Playing done!')
    }
  }, [playProgressCounter, petInfo, setPlayLabel])

  return <ActivityTracker bgColor="bg-[#E13296]" image={playImage} imageClass="mt-[5rem] h-[15rem] w-[20rem]" onDone={handlePlay} />
}

export default PlayTracker
