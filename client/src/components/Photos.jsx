import React, { useState, useEffect } from 'react';

export default function PhotoWidget({ interval }) {
  const [photos, setPhotos] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch('/api/photos').then(r => r.json()).then(d => setPhotos(d.photos || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % photos.length), (interval || 30) * 1000);
    return () => clearInterval(t);
  }, [photos, interval]);

  if (!photos.length) return <div className="photo-widget"><span className="pw-empty">📸 Add photos via #settings</span></div>;

  return (
    <div className="photo-widget">
      {photos.map((p, i) => (
        <div key={p.id || i} className={`pw-frame ${i === idx ? 'visible' : 'hidden'}`}>
          <img className="pw-blur" src={p.url} alt="" />
          <img className="pw-main" src={p.url} alt="" />
        </div>
      ))}
    </div>
  );
}
