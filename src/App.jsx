import { useState } from 'react'
import "./index.css";
import { PetProvider } from './context/PetContext';
import ChooseYourPet from './components/ChooseYourPet'
import PetCareZone from './components/PetCareZone';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalkTracker from './components/WalkTracker';
import BathTracker from './components/BathTracker';
import FeedTracker from './components/FeedTracker';
import PlayTracker from './components/PlayTracker';
import BasicInfo from './components/BasicInfo';
import AdditionalInfo from './components/AdditionalInfo';
import WalkSchedule from './components/WalkSchedule';
import BathSchedule from './components/BathSchedule';
import FeedSchedule from './components/FeedSchedule';
import PlaySchedule from './components/PlaySchedule';
import PetAttributeBars from './components/PetAttributesBars';

function App() {
  

  return (
   <PetProvider>
    <Router>
      <Routes>
      <Route path='/' element={<ChooseYourPet/>}/>
      <Route path='/basic-info' element={<BasicInfo/>}/>
      <Route path='/additional-info' element={<AdditionalInfo/>}/>
      <Route path='/pet-care-zone' element={<PetCareZone/>}/>
      <Route path='/pet-walk' element={<WalkTracker/>}/>
      <Route path='/pet-bath' element={<BathTracker/>}/>
      <Route path='/pet-feed' element={<FeedTracker/>}/>
      <Route path='/pet-play' element={<PlayTracker/>}/>
      <Route path='/walk-schedule' element={<WalkSchedule/>}/>
      <Route path='/bath-schedule' element={<BathSchedule/>}/>
      <Route path='/feed-schedule' element={<FeedSchedule/>}/>
      <Route path='/play-schedule' element={<PlaySchedule/>}/>
      <Route path='/pet-care-zone/pet-moods' element={<PetAttributeBars/>}/>
      </Routes>
      </Router>
    </PetProvider>
  )
}

export default App
