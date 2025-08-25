import React , {useContext, useEffect} from 'react'
import { PetContext } from '../context/PetContext'
import dogbath from '../assets/dog-bath.png'
import { useNavigate } from 'react-router-dom'

const BathTracker = () => {
const {dogInfo, walkProgressCounter,walkLabel, bathProgressCounter, setBathProgressCounter, bathLabel, setBathLabel, feedProgressCounter, feedLabel, playProgressCounter, playLabel} = useContext(PetContext)
const navigate = useNavigate()
const handleBath = () =>{
    setBathProgressCounter(100)
}
useEffect(()=>{
    if(bathProgressCounter === 0){
        setBathLabel(`${dogInfo.name} needs a shower`)
    } else if(bathProgressCounter === 100){
        setBathLabel(`Next bath: In 24 hours`)
    }
}, [bathProgressCounter, setBathLabel])
  return (
 <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#3296FF] h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'>
        <div className='flex flex-col items-center mt-[20px]'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
           {walkProgressCounter > 0 && (
            <div className=" absolute left-0 top-0 h-full bg-[#64D264] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${(walkProgressCounter / 2) * 100}%` }}>{walkProgressCounter > 0 && `+${(walkProgressCounter / 2) * 100}%`}
            </div>)}
        </div>
         <p className="mt-2 text-black text-[10px]">{walkLabel ? walkLabel: `Take ${dogInfo.name} for a walk!`}</p>
        </div>
        
        <div className='flex flex-col items-center mt-[20px]'>
        <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
           {bathProgressCounter > 0 && (
            <div className=" absolute left-0 top-0 h-full bg-[#0678f1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${bathProgressCounter}%` }}>{`+${bathProgressCounter}%`}
            </div>)}
        </div>
         <p className="mt-2 text-black text-[10px]">{bathLabel ? bathLabel: `${dogInfo.name} is waiting for a shower!`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
           {feedProgressCounter > 0 && (
             <div className=" absolute left-0 top-0 h-full bg-[#7e3ce1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${(feedProgressCounter / 4) * 100}%` }}>{`${(feedProgressCounter / 4) * 100}%`}
            </div>)}
        </div>
        <p className="mt-2 text-black text-[10px]">{feedLabel ? feedLabel : `${dogInfo.name} is hungrryyyyy`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            {playProgressCounter > 0 && (
                <div className=" absolute left-0 top-0 h-full bg-[#d80b7f] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${(playProgressCounter / 2) * 100}%` }}>{`+${(playProgressCounter / 2) * 100}%`}
            </div>)}
        </div>
         <p className="mt-2 text-black text-[10px]">{playLabel ? playLabel: `${dogInfo.name} needs your attention`}</p>
        </div>
        <img src={dogbath} className='absolute mt-[2rem] size-[25rem]' />
        <div className='absolute flex gap-[20px] mt-[30rem]'>
            <button className="bg-[#FFC832] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={()=>navigate('/pet-care-zone')}>CANCEL</button>
            <button className="bg-[#8d8b91] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={handleBath} >DONE</button>
        </div>
        </div>
    </div>
  )
}

export default BathTracker
