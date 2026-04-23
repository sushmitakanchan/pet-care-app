import React, { useContext, useEffect } from 'react'
import { PetContext } from '../context/PetContext'
import dogbath from '../assets/dog-bath.png'
import catbath from '../assets/catbath.png'
import ActivityTracker from './ActivityTracker'

const BathTracker = () => {
  const { pet, petInfo, setPetInfo, bathProgressCounter, setBathProgressCounter, setBathLabel, totalBaths } = useContext(PetContext)
  const bathImage = pet === 'cat' ? catbath : dogbath

  const handleBath = () => {
    if (bathProgressCounter >= totalBaths) return
    setBathProgressCounter(prev => prev + 1)
    setPetInfo(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        hygiene: Math.min(prev.attributes.hygiene + 20, 100),
        energy: Math.max(prev.attributes.energy - 5, 0),
        happiness: Math.max(prev.attributes.happiness - 5, 0),
      }
    }))
  }

  useEffect(() => {
    const bathList = petInfo?.additional?.bath ? Object.values(petInfo.additional.bath) : []
    if (bathList.length === 0) { setBathLabel('No baths scheduled!'); return }
    if (bathProgressCounter < bathList.length) {
      setBathLabel(`Next bath: ${bathList[bathProgressCounter]}`)
    } else {
      setBathLabel('Shower done!')
    }
  }, [bathProgressCounter, petInfo, setBathLabel])

  return <ActivityTracker bgColor="bg-[#3296FF]" image={bathImage} imageClass="mt-[2rem] size-[12rem]" onDone={handleBath} />
}

export default BathTracker
