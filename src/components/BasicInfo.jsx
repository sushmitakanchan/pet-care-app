import React, { useContext, useState } from 'react';
import dog from '../assets/dog.png';
import cat from '../assets/cat2.png';
import { PetContext } from "../context/PetContext";
import { useNavigate } from 'react-router-dom';

const BasicInfo = () => {
  const { pet, setPetInfo } = useContext(PetContext)
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [sex, setSex] = useState("")
  const [breed, setBreed] = useState("")
  const [error, setError] = useState("")
  const [ageError, setAgeError] = useState("")
  const navigate = useNavigate()

  const handleAgeChange = (e) => {
    const val = e.target.value;
    setAge(val);
    if (val && (!/^\d+$/.test(val) || parseInt(val, 10) <= 0)) {
      setAgeError("Age must be a positive number");
    } else {
      setAgeError("");
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!name.trim() || !age.trim() || !sex.trim() || !breed.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^\d+$/.test(age) || parseInt(age, 10) <= 0) {
      setAgeError("Age must be a positive number");
      return;
    }
    setError("");
    setPetInfo((prev) => ({
      ...prev,
      basic: { name: name.trim(), age: age.trim(), sex: sex.trim(), breed: breed.trim(), type: pet },
    }));
    navigate("/additional-info")
  }

  const inputClass = 'w-[25rem] p-[10px] mb-[4px] bg-transparent text-black text-[10px] font-bold placeholder-[#000000] border-0 border-b-1 focus:border-b-2 focus:border-[#000000] outline-none'

  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#FF3232] h-[40rem] w-[50rem] mt-[3rem] mb-[3rem]'>
        <form className='flex flex-col items-center justify-center mt-[0.5rem]'>
          <img src={pet === 'cat' ? cat : dog} className='size-[8rem]' alt={pet} />
          <h1 className='text-[20px] mt-[1rem]'>BASIC INFO</h1>
          <div className='flex flex-col gap-[5px] mt-[2rem]'>
            <input aria-label="Pet Name" placeholder='Pet Name' value={name} onChange={e => setName(e.target.value)} className={inputClass} />
            <div>
              <input aria-label="Age" placeholder='Age (in years)' value={age} onChange={handleAgeChange} className={inputClass} />
              {ageError && <p className="text-white text-[10px] font-bold ml-[10px]">{ageError}</p>}
            </div>
            <input aria-label="Sex" placeholder='Sex (M/F)' value={sex} onChange={e => setSex(e.target.value)} className={inputClass} />
            <input aria-label="Breed" placeholder='Breed' value={breed} onChange={e => setBreed(e.target.value)} className={inputClass} />
          </div>
          {error && <p className="text-white text-[12px] mt-2 font-bold">{error}</p>}
          <button onClick={handleNext} className="bg-[#FFC832] text-black font-bold w-[80px] h-[50px] shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-[2px_2px_0_#000] mt-[20px]">NEXT</button>
        </form>
      </div>
    </div>
  )
}

export default BasicInfo
