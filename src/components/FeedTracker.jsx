import React, { useContext } from 'react'
import { PetContext } from '../context/PetContext'
import dogfeed from '../assets/dogfeed.png'
import catfeed from '../assets/catfeed.png'
import ActivityTracker from './ActivityTracker'

const FeedTracker = () => {
  const { petType, completeActivity } = useContext(PetContext)
  const feedImage = petType === 'cat' ? catfeed : dogfeed

  const handleFeed = () => {
    completeActivity('feed')
  }

  return <ActivityTracker bgColor="bg-[#9664E1]" darkBgColor="dark:bg-[#2d1a50]" image={feedImage} imageClass="mt-[2rem] size-[12rem]" onDone={handleFeed} />
}

export default FeedTracker
