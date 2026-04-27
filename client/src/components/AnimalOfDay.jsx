import React, { useState, useEffect } from 'react';

export default function AnimalOfDay() {
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    fetch('/api/animal').then(r => r.json()).then(setAnimal).catch(() => {});
  }, []);

  if (!animal) return null;

  return (
    <div className="widget animal-of-day">
      <h2>🐾 Animal of the Day</h2>
      {animal.image && <img className="aod-image" src={animal.image} alt={animal.name} />}
      <div className="aod-name">{animal.name}</div>
      <div className="aod-fact">{animal.fact}</div>
    </div>
  );
}
