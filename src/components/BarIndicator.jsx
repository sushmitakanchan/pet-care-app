// src/components/BarIndicator.jsx
import React from "react";

const BarIndicator = ({ label, value, icon }) => {
   const getBarColor = () => {
    if (value > 70) return "bg-[#22C55E]";
    if (value > 40) return "bg-[#F6E05E]";
    return "bg-[#EF4444]";
  };

    const getWarningMessage = () => {
    if (value < 20) {
      if (label.toLowerCase().includes("energy")) return "⚠️ Low energy, let your dog rest!";
      if (label.toLowerCase().includes("happiness")) return "⚠️ Your dog feels sad, play with it!";
      if (label.toLowerCase().includes("hygiene")) return "⚠️ Dog is dirty, give it a bath!";
    }
    if (value > 70){
      if (label.toLowerCase().includes("hunger")) return "⚠️ Your dog is very hungry!";
    }
    return null;
  };


 return (
    <div className="flex flex-col items-center gap-[1rem] w-full">
      {/* Dog face icon */}
      <img src={icon} alt={label} className="w-[10rem] h-[10rem]" />

      {/* Progress bar container */}
      <div className="relative w-[14rem] h-[2rem] border border-black bg-gray-300 rounded-lg overflow-hidden shadow">
        {/* Filled bar */}
        <div
          className={`h-full ${getBarColor()} transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>

        {/* Percentage text inside the bar */}
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
          {value}%
        </span>
      </div>

      {/* Label always below */}
      <p className="text-[10px] mb-[0.5rem] uppercase tracking-wider text-gray-700">{label}</p>

      {/* Warning if too low */}
      {getWarningMessage() && (
        <p className="text-xs text-red-500">{getWarningMessage()}</p>
      )}
    </div>
  );
};


export default BarIndicator;
