import React, { useContext, useEffect } from 'react'
import { PetContext } from '../context/PetContext'
import dogfeed from '../assets/dogfeed.png'
import catfeed from '../assets/catfeed.png'
import ActivityTracker from './ActivityTracker'

const FeedTracker = () => {
  const { pet, petInfo, setPetInfo, feedProgressCounter, setFeedProgressCounter, setFeedLabel, totalMeals, recordActivity } = useContext(PetContext)
  const feedImage = pet === 'cat' ? catfeed : dogfeed

  const handleFeed = () => {
    if (feedProgressCounter >= totalMeals) return
    setFeedProgressCounter(prev => prev + 1)
    recordActivity('feed')
    setPetInfo(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        hunger: Math.max(prev.attributes.hunger - 20, 0),
        energy: Math.min(prev.attributes.energy + 10, 100),
        happiness: Math.min(prev.attributes.happiness + 5, 100),
        hygiene: Math.max(prev.attributes.hygiene - 2, 0),
      }
    }))
  }

  useEffect(() => {
    const feedList = petInfo?.additional?.feed ? Object.values(petInfo.additional.feed) : []
    if (feedList.length === 0) { setFeedLabel('No meals scheduled'); return }
    if (feedProgressCounter < feedList.length) {
      setFeedLabel(`Next meal: ${feedList[feedProgressCounter]}`)
    } else {
      setFeedLabel('All meals done!')
    }
  }, [feedProgressCounter, petInfo, setFeedLabel])

  return <ActivityTracker bgColor="bg-[#9664E1]" darkBgColor="dark:bg-[#2d1a50]" image={feedImage} imageClass="mt-[2rem] size-[12rem]" onDone={handleFeed} />
}

export default FeedTracker
