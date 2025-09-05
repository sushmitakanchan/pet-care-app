// src/components/BarIndicator.jsx
import React from "react";

const BarIndicator = ({ value, max = 5, label }) => {
  return (
    <div className="flex flex-col items-center w-48">
      <div className="flex">
        {[...Array(max)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 mx-1 rounded-full ${
              i < value ? "bg-orange-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-700">{label}</p>
    </div>
  );
};

export default BarIndicator;
