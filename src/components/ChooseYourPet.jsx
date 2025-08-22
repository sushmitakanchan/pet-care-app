import React from 'react'
import logo from '../assets/logo.png'
import dog from '../assets/dog.png'
import cat from '../assets/cat.png'

const ChooseYourPet = () => {
  return (
    // bg-[#FF3232]
    <div className='bg-[#FF3232] h-screen'>
      <div className='flex flex-col justify-center items-center'>
      <img src={logo} alt="logo" className='w-[100px] h-[80px] mt-[80px]' />
      <h1 className='mt-[50px]'>Choose your pet</h1>
      <div className='flex gap-[8px]'>
        <img src={dog} alt="dog" className='w-[120px] h-[120px] hover:border border-black hover:shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]'/>
        <img src={cat} alt="cat" className='w-[120px] h-[120px] hover:border border-black hover:shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]'/>
      </div>
        <button className="bg-[#FFC832] w-[60px] h-[30px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[20px]">Next</button>
      </div>
    </div>
  )
}

export default ChooseYourPet
