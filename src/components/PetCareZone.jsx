import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dog from '../assets/dog.png'
import { PetContext } from '../context/PetContext'

const PetCareZone = () => {
    const [bathProgressCounter, setBathProgressCounter] = useState(0)
    const {dogInfo, walkProgressCounter, walkLabel} = useContext(PetContext)
    const navigate = useNavigate();

    const bath = ()=>{
        setBathProgressCounter(100)
        console.log(bathProgressCounter);
        
    }
  return (
    <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#FFC832] h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'>
        <div className='flex flex-col items-center mt-[20px]'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            <div className=" absolute left-0 top-0 h-full bg-[#3296FF] transition-all duration-500"
            style={{ width: `${(walkProgressCounter / 2) * 100}%` }}></div>
        </div>
         <p className="mt-2 text-black text-[10px]">{walkLabel}</p>
        </div>
        
        <div className='flex flex-col items-center mt-[20px]'>
        <div className='border border-black w-[20rem] h-[3rem] flex text-black justify-center items-center'></div>
         <p className="mt-2 text-black text-[10px]">{bathProgressCounter === 100? "1 day till the next bath":`${dogInfo.name} needs a shower`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className='border border-black w-[20rem] h-[3rem] flex text-black justify-center items-center'></div>
         <p className="mt-2 text-black text-[10px]">Label 3</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className='border border-black w-[20rem] h-[3rem] flex text-black justify-center items-center'></div>
         <p className="mt-2 text-black text-[10px]">Label 4</p>
        </div>
        </div>
        <img src={dog} className='absolute mt-[5rem]' />
        <div className='absolute flex gap-[20px] mt-[30rem]'>
        <button className="bg-[#64D264] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={()=>navigate('/pet-walk')}>WALK</button>
        <button className="bg-[#3296FF] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={bath}>BATH</button>
        <button className="bg-[#9664E1] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" >FEED</button>
        <button className="bg-[#E13296] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" >PLAY</button>
        </div>
    </div>
    
  )
}

export default PetCareZone
