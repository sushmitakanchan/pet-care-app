import { useState } from 'react'
import "./index.css";
import { PetProvider } from './context/PetContext';
import ChooseYourPet from './components/ChooseYourPet'
import PetCareZone from './components/PetCareZone';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalkTracker from './components/WalkTracker';
import BathTracker from './components/BathTracker';
import FeedTracker from './components/FeedTracker';

function App() {
  

  return (
   <PetProvider>
    <Router>
      <Routes>
      <Route path='/' element={<ChooseYourPet/>}/>
      <Route path='/pet-care-zone' element={<PetCareZone/>}/>
      <Route path='/pet-walk' element={<WalkTracker/>}/>
      <Route path='/pet-bath' element={<BathTracker/>}/>
      <Route path='/pet-feed' element={<FeedTracker/>}/>
      <Route path='/pet-play' element={<PlayTracker/>}/>
      </Routes>
      </Router>
    </PetProvider>
  )
}

export default App
