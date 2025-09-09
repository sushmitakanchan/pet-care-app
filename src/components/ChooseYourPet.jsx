import React, { useContext } from 'react'
import logo from '../assets/logo.png'
import dog from '../assets/dog.png'
import cat from '../assets/cat.png'
import { PetContext, PetProvider } from "../context/PetContext";
import { useNavigate } from 'react-router-dom'

const ChooseYourPet = () => {
  const {pet, setPet} = useContext(PetContext)
  const navigate = useNavigate();
  const handleNext =(e)=>{
    if(!pet){
      alert("Please choose your pet first");
      return
    }
    navigate('/basic-info')
  } 
  return (
    // bg-[#FF3232]
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#FF3232] h-[40rem] w-[50rem] mt-[3rem] mb-[3rem]'>
      <div className='flex flex-col justify-center items-center'>
      <img src={logo} alt="logo" className='w-[100px] h-[80px] mt-[90px]' />
      <h1 className='mt-[50px]'>{pet ? `Your selected pet:${pet}`: "Choose your pet" }</h1>
      <div className='flex gap-[8px]'>
        <img src={dog} alt="dog"   onClick={()=>setPet("dog")} className='w-[120px] h-[120px] hover:border border-black hover:shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]'/>
        <img src={cat} alt="cat" onClick={()=>setPet("cat")} className='w-[120px] h-[120px] hover:border border-black hover:shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]'/>
      </div> 
        <button className="bg-[#FFC832] w-[60px] h-[30px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={handleNext}>Next</button>
      </div>
    </div>
    </div>
  )
}

export default ChooseYourPet
