import React, { useContext, useState } from 'react';
import { PetContext } from "../context/PetContext";
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const validate = (hours, minutes, ampm) => {
  if (!hours && !minutes && !ampm) return null;
  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  const p = ampm.toLowerCase();
  if (!hours || isNaN(h) || h < 1 || h > 12) return "Hours must be 1–12";
  if (!minutes || isNaN(m) || m < 0 || m > 59) return "Minutes must be 00–59";
  if (p !== 'am' && p !== 'pm') return "Must be AM or PM";
  return null;
};

const ActivityManager = ({ type, label }) => {
  const { petInfo, setPetInfo } = useContext(PetContext);
  const navigate = useNavigate();

  const [entries, setEntries] = useState(() => {
    const existing = petInfo?.additional?.[type];
    if (existing && Object.keys(existing).length > 0) {
      return Object.entries(existing).map(([id, time]) => {
        const [hours, rest] = time.split(':');
        const [minutes, ampm] = rest ? rest.split(' ') : ['', ''];
        return { id: Number(id), hours, minutes, ampm: ampm || '', error: null };
      });
    }
    return [{ id: 1, hours: '', minutes: '', ampm: '', error: null }];
  });

  const [nextId, setNextId] = useState(() => {
    const existing = petInfo?.additional?.[type];
    if (existing && Object.keys(existing).length > 0) {
      return Math.max(...Object.keys(existing).map(Number)) + 1;
    }
    return 2;
  });

  const getOrdinal = (n) => {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
  };

  const handleAdd = () => {
    setEntries(prev => [...prev, { id: nextId, hours: '', minutes: '', ampm: '', error: null }]);
    setNextId(prev => prev + 1);
  };

  const handleDelete = (id) => {
    if (entries.length === 1) {
      setEntries([{ id: 1, hours: '', minutes: '', ampm: '', error: null }]);
      setNextId(2);
      setPetInfo(prev => ({
        ...prev,
        additional: { ...prev.additional, [type]: {} },
      }));
      return;
    }
    setEntries(prev => prev.filter(e => e.id !== id));
    setPetInfo(prev => {
      const updated = { ...prev.additional?.[type] };
      delete updated[id];
      return { ...prev, additional: { ...prev.additional, [type]: updated } };
    });
  };

  const handleTimeChange = (id, field, value) => {
    setEntries(prev => {
      const updatedEntries = prev.map(entry => {
        if (entry.id !== id) return entry;
        const updated = { ...entry, [field]: value };
        return { ...updated, error: validate(updated.hours, updated.minutes, updated.ampm) };
      });

      const entry = updatedEntries.find(e => e.id === id);
      if (!entry.error && (entry.hours || entry.minutes || entry.ampm)) {
        setPetInfo(p => ({
          ...p,
          additional: {
            ...p.additional,
            [type]: {
              ...p.additional?.[type],
              [id]: `${entry.hours}:${entry.minutes.padStart(2, '0')} ${entry.ampm.toUpperCase()}`,
            },
          },
        }));
      }

      return updatedEntries;
    });
  };

  const handleOk = () => {
    const errors = entries.map(e => validate(e.hours, e.minutes, e.ampm));
    if (errors.some(err => err !== null)) {
      setEntries(prev => prev.map((e, i) => ({ ...e, error: errors[i] })));
      return;
    }
    navigate('/additional-info');
  };

  return (
    <div className='w-full mt-6 sm:h-[30rem] sm:w-[40rem] sm:mt-[25rem]'>
      {/* Column headers */}
      <div className="flex mb-[4px] sm:ml-[4rem]">
        <span className="w-32 shrink-0 sm:w-[20rem]" />
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wide opacity-60">
          <label className="w-[2ch] text-center">HH</label>
          <span>:</span>
          <label className="w-[2ch] text-center">MM</label>
          <label className="w-[7ch] text-center">AM/PM</label>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-[1rem]">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex flex-col sm:ml-[4rem]">
            <div className="flex items-center">
              <span className="w-32 shrink-0 font-medium text-[10px] sm:w-[20rem]">
                {getOrdinal(index + 1)} {label}
              </span>
              <div className='flex items-center gap-2'>
                <input
                  type="text"
                  maxLength={2}
                  placeholder='00'
                  value={entry.hours}
                  onChange={(e) => handleTimeChange(entry.id, 'hours', e.target.value)}
                  className="bg-transparent border-none outline-none text-center placeholder-[#040404] w-[2ch] text-[10px]"
                />
                <span className="text-[10px]">:</span>
                <input
                  type="text"
                  maxLength={2}
                  placeholder='00'
                  value={entry.minutes}
                  onChange={(e) => handleTimeChange(entry.id, 'minutes', e.target.value)}
                  className="bg-transparent border-none outline-none text-center placeholder-[#040404] w-[2ch] text-[10px]"
                />
                <input
                  type="text"
                  maxLength={2}
                  placeholder="am/pm"
                  value={entry.ampm}
                  onChange={(e) => handleTimeChange(entry.id, 'ampm', e.target.value)}
                  className="bg-transparent border-none outline-none text-center uppercase placeholder-[#040404] w-[7ch] text-[10px]"
                />
                <button
                  onClick={() => handleDelete(entry.id)}
                  aria-label="Delete entry"
                  className="bg-[#8d8b91] w-[28px] h-[24px] text-white text-[11px] font-extrabold shadow-[2px_4px_0px_#4b4950] active:translate-y-1 active:shadow-[0_2px_0_#4b4950] border-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            {entry.error && (
              <p role="alert" className="text-red-600 text-[9px] mt-[2px] sm:ml-[20rem]">{entry.error}</p>
            )}
          </div>
        ))}
      </div>

      {/* Add + OK — + above OK on desktop, row on mobile */}
      <div className="flex justify-between items-center mt-8 sm:flex sm:flex-col sm:items-start">
        <button
          onClick={handleAdd}
          aria-label={`Add another ${label}`}
          className="bg-transparent border-none sm:ml-[30rem]"
        >
          <Plus className='size-[2rem]' />
        </button>
        <button
          className="bg-[#FFC832] w-[80px] h-[40px] shadow-[2px_6px_2px_#b91c1c] active:translate-y-1 active:shadow-[0_3px_0_#b91c1c] sm:mt-[10px] sm:ml-[15rem]"
          onClick={handleOk}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ActivityManager;
