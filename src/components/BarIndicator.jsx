// src/components/BarIndicator.jsx
import React from "react";

const BarIndicator = ({ label, value, icon, pet }) => {
  const p = pet === 'cat' ? 'cat' : 'dog'
   const isHunger = label.toLowerCase().includes("hunger");
  const isEnergy = label.toLowerCase().includes("energy");
  const isHappiness = label.toLowerCase().includes("happiness");
  const isHygiene = label.toLowerCase().includes("hygiene");

  const getBarColor = () => {
if (isHunger) {
    if (value >= 100) return "bg-[#E53935] animate-pulse"; // maxed out (alert)
    if (value <= 10) return "bg-[#E53935]"; // show red for very low values (≤10)
    if (value > 50) return "bg-[#22C55E]";
    return "bg-[#48BB78]";
  } else {
    if (value <= 10) return "bg-[#E53935]";
    if (value > 70) return "bg-[#22C55E]";
    if (value > 40) return "bg-[#F6E05E]";
    return "bg-[#F6E05E]";
  }
  };

  const getWarningMessage = () => {
    if (isHunger) {
      if (value > 70 && value < 100) return `Your ${p} is very hungry!`;
      if (value >= 100) return "Hunger maxed out, feed immediately!";
    } else {
      if (value < 20) {
        if (isEnergy) return `Low energy, let your ${p} rest!`;
        if (isHappiness) return `Your ${p} feels sad, play with it!`;
        if (isHygiene) return `${p === 'cat' ? 'Cat' : 'Dog'} is dirty, give it a bath!`;
      }
    }
    return null;
  };

  const getPositiveMessage = () => {
    if (isHunger && value <= 70) return `Your ${p} is full and happy!`;
    if (isEnergy && value >= 20) return `Your ${p} is active!`;
    if (isHappiness && value >= 20) return `Your ${p} is happy!`;
    if (isHygiene && value >= 20) return `${p === 'cat' ? 'Cat' : 'Dog'} is clean!`;
    return null;
  };

  const warning = getWarningMessage();
  const positive = getPositiveMessage();

  return (
    
    <div className="flex flex-col items-center w-full">
      <img src={icon} alt={label} className="w-[9rem] h-[7rem] mb-0" />
      <p className="text-[10px] mt-[0] uppercase tracking-wider text-gray-700">{label}</p>
      <div className="relative w-[12rem] h-[1.4rem] border border-black bg-gray-300 rounded-lg overflow-hidden shadow">
        <div
          className={`h-full ${getBarColor()} transition-all duration-500`}
          style={{ width: value === 0 ? "8px" : `${value}%` }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-[#FFFFFF] text-[10px] pointer-events-none select-none">
          {value}%
        </span>
      </div>
      {/* Message - warning or positive */}
      {warning ? (
        <p className="text-[8px] text-[#EF4444] mt-1">{warning}</p>
      ) : (
        <p className="text-[8px] text-[#22C55E] mt-1">{positive}</p>
      )}
    </div>
  );
};


export default BarIndicator;
