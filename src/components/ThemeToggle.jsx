import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { PetContext } from '../context/PetContext';

const ThemeToggle = ({ inline = false, className = '' } = {}) => {
  const { isDark, toggleDark } = useContext(PetContext);
  return (
    <button
      onClick={toggleDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`${inline ? '' : 'absolute top-3 right-3'} z-[100] bg-[#FFC832] w-[36px] h-[36px] flex items-center justify-center shadow-[2px_4px_0_#b91c1c] active:translate-y-1 active:shadow-[0_2px_0_#b91c1c] ${className}`}
    >
      {isDark ? <Sun size={16} className="text-black" /> : <Moon size={16} className="text-black" />}
    </button>
  );
};

export default ThemeToggle;
