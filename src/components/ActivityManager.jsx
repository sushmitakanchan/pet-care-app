import React, { useContext, useState } from 'react'
import { PetContext } from '../context/PetContext'
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActivityManager = ({type, label}) => {
    const {petInfo, setPetInfo} = useContext(PetContext)
    const [entries, setEntries] = useState([{ id: 1, time: "" }]);
    const navigate = useNavigate()

    const getOrdinal = (n) => {
        if (n === 1) return "1st";
        if (n === 2) return "2nd";
        if (n === 3) return "3rd";
        return `${n}th`;
        };

    const handleAdd = () => {
    const newEntry = { id: entries.length + 1, hours: "", minutes: "", ampm: "" };
    setEntries([...entries, newEntry]);
  };

  const handleTimeChange = (id, updatedEntry) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? updatedEntry  : entry
    );
    setEntries(updatedEntries);

    // update petInfo dynamically
    setPetInfo((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [type]: {
          ...prev.additional[type],
          [id]: `${updatedEntry.hours}:${updatedEntry.minutes} ${updatedEntry.ampm}`,
        },
      },
    }));
  };

  return (
    <div className='h-[30rem] w-[40rem] mt-[25rem]'>
      {/* <h2 className="text-lg font-bold mb-4">{label}s</h2> */}
      <div className="space-y-[1rem]">
        {entries.map((entry) => (
          <div key={entry.id} className="flex ml-[4rem]">
            <span className="w-[20rem] font-medium">
              {getOrdinal(entry.id)} {label}
            </span>
            <div className='flex items-center'>
              <input 
              type="text"
              maxLength={2}
              placeholder='00'
              value={entry.hours || ""}
              onChange={(e)=>
                handleTimeChange(entry.id, {...entry, hours: e.target.value})
              } className="bg-[transparent] border-none outline-none text-center placeholder-[#040404] w-[2ch]"
              />
              <span className="placeholder-[#040404]">:</span>
              <input 
              type="text"
              maxLength={2}
              placeholder='00'
              value={entry.minutes || ""}
              onChange={(e)=>
                handleTimeChange(entry.id, {...entry, minutes: e.target.value})
              } className="bg-[transparent] border-none outline-none text-center placeholder-[#040404] w-[2ch]" />

              <input
              type="text"
              maxLength={2}
              placeholder="am/pm"
              value={entry.ampm || ""}
              onChange={(e) =>
            handleTimeChange(entry.id, {
              ...entry,
              ampm: e.target.value,
            })
          }
          className=" bg-transparent border-none outline-none text-center uppercase text-white placeholder-[#040404] w-[7ch]"
        />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="bg-[transparent] border-none shadow-[10px] ml-[30rem] mt-[2rem]"
      ><Plus onClick={handleAdd} className='size-[2rem]'/>
      </button>

      <button className="bg-[#FFC832] w-[80px] h-[40px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] mt-[30px] ml-[15rem]" onClick={()=>navigate('/additional-info')} >OK</button>
    </div>
  )
}



export default ActivityManager
