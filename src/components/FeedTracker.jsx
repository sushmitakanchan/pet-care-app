import React , {useContext, useEffect} from 'react'
import { PetContext } from '../context/PetContext'
import { useNavigate } from 'react-router-dom'
import dogfeed from '../assets/dogfeed.png'

const FeedTracker = () => {
    const {dogInfo, walkProgressCounter, walkLabel, bathProgressCounter, bathLabel, feedProgressCounter, setFeedProgressCounter, feedLabel, setFeedLabel} = useContext(PetContext)
    const navigate = useNavigate()
    const handleFeed = ()=>{
        if(feedProgressCounter>=4) return;
        setFeedProgressCounter(feedProgressCounter+1)
    }

    useEffect(()=>{
        if(feedProgressCounter === 0){
            setFeedLabel(`Next meal: Morning at ${dogInfo.feed.morning}`)
        } else if(feedProgressCounter === 1){
            setFeedLabel(`Next meal: Afternoon at ${dogInfo.feed.afternoon}`)
        }else if(feedProgressCounter === 2){
            setFeedLabel(`Next meal: Snack at ${dogInfo.feed.snack}`)
        }
        else if(feedProgressCounter === 3){
            setFeedLabel(`Next meal: Dinner at ${dogInfo.feed.dinner}`)
        }else{
            setFeedLabel(`All meals done!`)
        }
    }, [feedProgressCounter,dogInfo.feed, setFeedLabel])
  return (
 <div className='bg-[#1b1a1a] h-screen w-screen m-0 p-0 flex justify-center items-center'>
    <div className='relative bg-[#9664E1] h-[40rem] w-[50rem] grid grid-cols-2 grid-rows-6 gap-[10px] p-[10px] place-items-center'>
        <div className='flex flex-col items-center mt-[20px]'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            <div className=" absolute left-0 top-0 h-full bg-[#64D264] transition-all duration-500 p-[10px] text-[10px] items-center"
            style={{ width: `${(walkProgressCounter / 2) * 100}%` }}>{`+${(walkProgressCounter / 2) * 100}%`}</div>
        </div>
         <p className="mt-2 text-black text-[10px]">{walkLabel ? walkLabel: `Take ${dogInfo.name} for a walk!`}</p>
        </div>
        
        <div className='flex flex-col items-center mt-[20px]'>
        <div className='relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            <div className=" absolute left-0 top-0 h-full bg-[#0678f1] transition-all duration-500 p-[10px] text-[10px] items-center"
            style={{ width: `${bathProgressCounter}%` }}>{`+${bathProgressCounter}%`}</div>
        </div>
         <p className="mt-2 text-black text-[10px]">{bathLabel ? bathLabel: `${dogInfo.name} is waiting for a shower!`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className=' relative border border-black w-[20rem] h-[3rem] overflow-hidden'>
            <div className=" absolute left-0 top-0 h-full bg-[#7e3ce1] transition-all duration-500 p-[10px] text-[10px] items-center"
            style={{ width: `${(feedProgressCounter / 4) * 100}%` }}>{`${(feedProgressCounter / 4) * 100}%`}</div>
        </div>
        <p className="mt-2 text-black text-[10px]">{feedLabel ? feedLabel : `${dogInfo.name} is hungrryyyyy`}</p>
        </div>

        <div className='flex flex-col items-center'>
        <div className='border border-black w-[20rem] h-[3rem] flex text-black justify-center items-center'></div>
         <p className="mt-2 text-black text-[10px]">Label 4</p>
        </div>
        <img src={dogfeed} className='absolute mt-[2rem] size-[20rem]' />
        <div className='absolute flex gap-[20px] mt-[30rem]'>
            <button className="bg-[#FFC832] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={()=>navigate('/pet-care-zone')}>CANCEL</button>
            <button className="bg-[#8d8b91] w-[80px] h-[60px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px]" onClick={handleFeed} >DONE</button>
        </div>
        </div>
    </div>
  )
}

export default FeedTracker
