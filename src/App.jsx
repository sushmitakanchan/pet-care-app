import { useState } from 'react'
import "./index.css";
import { PetProvider } from './context/PetContext';
import ChooseYourPet from './components/ChooseYourPet'
import PetCareZone from './components/PetCareZone';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalkTracker from './components/WalkTracker';

function App() {
  

  return (
   <PetProvider>
    <Router>
      <Routes>
      <Route path='/' element={<ChooseYourPet/>}/>
      <Route path='/pet-care-zone' element={<PetCareZone/>}/>
      <Route path='/pet-walk' element={<WalkTracker/>}/>
      </Routes>
      </Router>
    </PetProvider>
  )
}

export default App
