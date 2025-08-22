import { useState } from 'react'
import ChooseYourPet from './components/ChooseYourPet'
import "./index.css";
import { PetProvider } from './context/PetContext';


function App() {
  

  return (
    <PetProvider>
      <ChooseYourPet/>
    </PetProvider>
  )
}

export default App
