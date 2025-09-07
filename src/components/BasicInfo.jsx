import React, { useContext, useState } from 'react'
import dog from '../assets/dog.png'
import { PetContext, PetProvider } from "../context/PetContext";
import { useNavigate } from 'react-router-dom'

const BasicInfo = () => {
  const {pet, setPetInfo} = useContext(PetContext)
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [sex, setSex] = useState("")
  const [breed, setBreed] = useState("")
  const navigate = useNavigate()
  
  const handleNext = (e)=>{
    e.preventDefault();
    const basicInfo = { name, age, sex, breed, type: pet };
    setPetInfo((prev) => ({
    ...prev,
    basic: basicInfo,
  }));

    navigate("/additional-info")
  }

  return (
<div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#FF3232] h-[40rem] w-[50rem] mt-[3rem] mb-[3rem]'>
        <form className='flex flex-col items-center justify-center mt-[0.5rem]'>
          <img src={dog} className='size-[8rem]'/>
            <h1 className='text-[20px] mt-[1rem]'>BASIC INFO</h1>
            <div className='flex flex-col gap-[5px] mt-[2rem]'>
            <input
            placeholder='Pet Name'
            value={name}
            onChange={e=>setName(e.target.value)}
            className='w-[25rem] p-[10px] mb-[4px] bg-transparent text-black font-bold placeholder-[#000000]  border-0 border-b-1 focus:border-b-2 focus:border-[#000000] outline-none'
             />
             <input
            placeholder='Age'
            value={age}
            onChange={e=>setAge(e.target.value)}
            className='w-[25rem] p-[10px] mb-[4px] bg-transparent text-black font-bold placeholder-[#000000]  border-0 border-b-1 focus:border-b-2 focus:border-[#000000] outline-none'
             />
             <input
            placeholder='Sex'
            value={sex}
            onChange={e=>setSex(e.target.value)}
            className='w-[25rem] p-[10px] mb-[4px] bg-transparent text-black font-bold placeholder-[#000000]  border-0 border-b-1 focus:border-b-2 focus:border-[#000000] outline-none'
             />
             <input
            placeholder='Breed'
            value={breed}
            onChange={e=>setBreed(e.target.value)}
            className='w-[25rem] p-[10px] mb-[4px] bg-transparent text-black font-bold placeholder-[#000000]  border-0 border-b-1 focus:border-b-2 focus:border-[#000000] outline-none'
             />
             </div>
            <button onClick={handleNext} className="bg-[#FFC832] text-black font-bold w-[80px] h-[50px] shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-[2px_2px_0_#000] mt-[30px]">NEXT</button>
        </form>
       </div>
    </div>
  )
}

export default BasicInfo
