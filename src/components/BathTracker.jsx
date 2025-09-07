import React , {useContext, useEffect} from 'react'
import { PetContext, PetProvider } from "../context/PetContext";
import dogbath from '../assets/dog-bath.png'
import { useNavigate } from 'react-router-dom'

const BathTracker = () => {
const {petInfo, walkProgressCounter,walkLabel, bathProgressCounter, setBathProgressCounter, bathLabel, setBathLabel, feedProgressCounter, feedLabel, playProgressCounter, playLabel, totalWalks, totalMeals, totalPlays, totalBaths} = useContext(PetContext)
const navigate = useNavigate()

  useEffect(() => {
    const savedProgress = localStorage.getItem("bathProgressCounter");
    if (savedProgress) {
      setBathProgressCounter(Number(savedProgress));
    } else {
      setBathProgressCounter(0);
    }
  }, [setBathProgressCounter]);

    useEffect(() => {
      localStorage.setItem("bathProgressCounter", bathProgressCounter);
    }, [bathProgressCounter]);

    const handleBath = () =>{
        if (bathProgressCounter >= totalBaths) return;
        setBathProgressCounter(bathProgressCounter + 1);
        }

    useEffect(() => {
        const bathList = petInfo?.additional?.bath
        ? Object.values(petInfo.additional.bath)
        : [];
    
        if (bathList.length === 0) {
        setBathLabel("No baths scheduled!");
        return;
        }
    
        if (bathProgressCounter < bathList.length) {
        setBathLabel(`Next bath: ${bathList[bathProgressCounter]}`);
      } else {
        setBathLabel("Shower done!");
      }
      }, [bathProgressCounter, petInfo, setBathLabel]);
    
  return (
 <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#3296FF] h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'>
        <div className='flex flex-col items-center mt-[20px]'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
           {walkProgressCounter > 0 && (
            <div className=" absolute left-0 top-0 h-full bg-[#64D264] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${totalWalks > 0 ? (walkProgressCounter / totalWalks) * 100 : 0}%` }}>{totalWalks > 0 && `+${Math.round((walkProgressCounter / totalWalks) * 100)}%`}
            </div>)}
        </div>
         <p className="mt-2 text-black text-[10px]">{walkLabel ? walkLabel: `Take ${petInfo.basic.name} for a walk!`}</p>
        </div>
        
        <div className='flex flex-col items-center mt-[20px]'>
        <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
           {bathProgressCounter > 0 && (
            <div className=" absolute left-0 top-0 h-full bg-[#0678f1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${totalBaths > 0 ? (bathProgressCounter/totalBaths)*100 : 0}%` }}>{totalBaths > 0 && `+${Math.round((bathProgressCounter / totalBaths) * 100)}%`}
            </div>)}
        </div>
         <p className="mt-2 text-black text-[10px]">{bathLabel ? bathLabel: `${petInfo.basic.name} is waiting for a shower!`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
           {feedProgressCounter > 0 && (
             <div className=" absolute left-0 top-0 h-full bg-[#7e3ce1] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${totalMeals > 0 ? (feedProgressCounter / totalMeals) * 100 : 0}%` }}>{totalMeals > 0 && `+${Math.round((feedProgressCounter / totalMeals) * 100)}%`}
            </div>)}
        </div>
        <p className="mt-2 text-black text-[10px]">{feedLabel ? feedLabel : `${petInfo.basic.name} is hungrryyyyy`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            {playProgressCounter > 0 && (
                <div className=" absolute left-0 top-0 h-full bg-[#d80b7f] transition-all duration-500 p-[10px] text-[10px] items-center text-[#FFFFFF]"
            style={{ width: `${(playProgressCounter / 2) * 100}%` }}>{`+${(playProgressCounter / 2) * 100}%`}
            </div>)}
        </div>
         <p className="mt-2 text-black text-[10px]">{playLabel ? playLabel: `${petInfo.basic.name} needs your attention`}</p>
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
