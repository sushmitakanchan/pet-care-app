import React, { useContext, useState } from 'react';
import logo from '../assets/logo.png';
import dog from '../assets/dog.png';
import cat from '../assets/cat2.png';
import { PetContext } from "../context/PetContext";
import { useNavigate } from 'react-router-dom';

const ChooseYourPet = () => {
  const { pet, setPet } = useContext(PetContext)
  const navigate = useNavigate();
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!pet) { setError('Please choose your pet first'); return }
    navigate('/basic-info')
  }

  return (
    <div className='bg-[#1b1a1a] min-h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#FF3232] w-[90vw] max-w-[50rem] min-h-[80vh] my-4 flex flex-col items-center justify-center'>
        <img src={logo} alt="logo" className='w-[100px] h-[80px]' />
        <h1 className='mt-8 text-center'>{pet ? `Your selected pet: ${pet}` : "Choose your pet"}</h1>
        <div className='flex gap-[8px] mt-6'>
          <img src={dog} alt="dog" role="button" tabIndex={0} aria-pressed={pet === 'dog'} onClick={() => { setPet("dog"); setError('') }} onKeyDown={e => e.key === 'Enter' && (setPet("dog"), setError(''))} className='w-[120px] h-[120px] hover:border border-black hover:shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]' />
          <img src={cat} alt="cat" role="button" tabIndex={0} aria-pressed={pet === 'cat'} onClick={() => { setPet("cat"); setError('') }} onKeyDown={e => e.key === 'Enter' && (setPet("cat"), setError(''))} className='w-[120px] h-[120px] hover:border border-black hover:shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]' />
        </div>
        {error && <p className="text-white text-[12px] mt-2 font-bold">{error}</p>}
        <button className="bg-[#FFC832] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-8 px-[24px] py-[12px]" onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}

export default ChooseYourPet
