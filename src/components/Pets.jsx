import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { PetContext } from '../context/PetContext';
import dogImg from '../assets/dog.png';
import catImg from '../assets/cat2.png';
import logo from '../assets/logo.png';
import { getOnboardingStatus } from '../lib/profile';
import ThemeToggle from './ThemeToggle';

const Pets = () => {
  const navigate = useNavigate();
  const { petOrder, petsById, activePetId, addPet, setActivePetId, deletePet } = useContext(PetContext);
  const [error, setError] = useState('');

  const pets = useMemo(() => {
    const order = Array.isArray(petOrder) ? petOrder : [];
    return order.map(id => petsById?.[id]).filter(Boolean);
  }, [petOrder, petsById]);

  const openPet = (petId) => {
    const profile = petsById?.[petId];
    if (!profile) return;
    setActivePetId(petId);
    const status = getOnboardingStatus(profile.petInfo);
    if (status === 'needs_basic') return navigate('/basic-info');
    if (status === 'needs_schedules') return navigate('/additional-info');
    if (status === 'needs_type') return navigate('/');
    return navigate('/pet-care-zone');
  };

  const onAdd = (type) => {
    setError('');
    const id = addPet(type);
    if (!id) {
      setError('Could not create a new pet profile.');
      return;
    }
    navigate('/basic-info');
  };

  const onDelete = (petId) => {
    const profile = petsById?.[petId];
    const name = profile?.petInfo?.basic?.name || 'this pet';
    const ok = window.confirm(`Delete ${name}? This cannot be undone.`);
    if (!ok) return;
    deletePet(petId);
  };

  return (
    <div className='bg-[#1b1a1a] min-h-screen w-screen m-0 p-0 flex justify-center items-center'>
      <div className='relative bg-[#FF3232] dark:bg-[#2d0808] w-[90vw] max-w-[50rem] min-h-[80vh] my-4 flex flex-col items-center justify-start py-10 px-6'>
        <ThemeToggle />
        <img src={logo} alt="PetHQ" className='w-[110px] h-[90px]' />
        <h1 className='mt-4 text-center text-[20px] font-bold dark:text-white'>Your Pets</h1>
        <p className='mt-2 text-center text-[10px] dark:text-gray-200 opacity-90'>
          Add a pet, or switch between profiles.
        </p>

        <div className='w-full mt-8 flex flex-col gap-3'>
          {pets.length === 0 ? (
            <div className='bg-[#1b1a1a] border-2 border-[#FFC832] shadow-[4px_4px_0_#FFC832] px-6 py-5 text-white text-[11px] font-bold text-center'>
              No pets yet. Add your first pet below.
            </div>
          ) : (
            pets.map((p) => {
              const id = p.id;
              const type = p.petInfo?.basic?.type || 'dog';
              const name = p.petInfo?.basic?.name || (type === 'cat' ? 'Unnamed cat' : 'Unnamed pup');
              const status = getOnboardingStatus(p.petInfo);
              const statusLabel =
                status === 'complete' ? 'Ready' :
                status === 'needs_schedules' ? 'Needs schedules' :
                status === 'needs_basic' ? 'Needs basic info' :
                'Needs pet type';

              return (
                <div key={id} className='bg-[#1b1a1a] border-2 border-black dark:border-gray-500 shadow-[4px_4px_0_#000] px-4 py-3 flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <img src={type === 'cat' ? catImg : dogImg} alt={type} className='w-[48px] h-[48px]' />
                    <div className='flex flex-col'>
                      <span className='text-white text-[12px] font-bold'>
                        {name}{id === activePetId ? ' (Active)' : ''}
                      </span>
                      <span className='text-gray-300 text-[9px] uppercase tracking-wider'>
                        {type} • {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      className='bg-[#FFC832] px-4 py-2 text-[10px] font-bold shadow-[2px_4px_0_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c]'
                      onClick={() => openPet(id)}
                    >
                      Open
                    </button>
                    <button
                      aria-label={`Delete ${name}`}
                      className='bg-[#8d8b91] w-[38px] h-[34px] flex items-center justify-center shadow-[2px_4px_0_#4b4950] active:translate-y-1 active:shadow-[0_2px_0_#4b4950]'
                      onClick={() => onDelete(id)}
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className='w-full mt-10'>
          <h2 className='text-white text-[12px] font-bold uppercase tracking-widest'>Add a pet</h2>
          <div className='mt-4 flex gap-3 justify-center'>
            <button
              onClick={() => onAdd('dog')}
              className='bg-[#FFC832] w-[170px] h-[70px] shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-[2px_2px_0_#000] flex items-center justify-center gap-3'
            >
              <img src={dogImg} alt="dog" className='w-[44px] h-[44px]' />
              <span className='text-[12px] font-bold'>Dog</span>
            </button>
            <button
              onClick={() => onAdd('cat')}
              className='bg-[#FFC832] w-[170px] h-[70px] shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-[2px_2px_0_#000] flex items-center justify-center gap-3'
            >
              <img src={catImg} alt="cat" className='w-[44px] h-[44px]' />
              <span className='text-[12px] font-bold'>Cat</span>
            </button>
          </div>
          {error && <p className="text-white text-[11px] mt-4 font-bold text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Pets;
