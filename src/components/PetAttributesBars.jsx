// src/components/PetAttributeBars.jsx
import React, { useContext } from "react";
import { PetContext } from "../context/PetContext";
import BarIndicator from "./BarIndicator";

const PetAttributeBars = () => {
  const { petInfo } = useContext(PetContext);

  // Convert % (0–100) into 0–5 rating
  const getRating = (val) => Math.round((val / 100) * 5);

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <BarIndicator value={getRating(petInfo.attributes.hunger)} label="Hunger" />
      <BarIndicator value={getRating(petInfo.attributes.happiness)} label="Happiness" />
      <BarIndicator value={getRating(petInfo.attributes.energy)} label="Energy" />
      <BarIndicator value={getRating(petInfo.attributes.hygiene)} label="Hygiene" />
    </div>
  );
};

export default PetAttributeBars;
