import React, { useState, useEffect, useCallback } from 'react';

export default function PhotoWidget({ interval, onOrientationChange }) {
  const [photos, setPhotos] = useState([]);
  const [idx, setIdx] = useState(0);
  const [orientations, setOrientations] = useState({});

  useEffect(() => {
    fetch('/api/photos').then(r => r.json()).then(d => {
      const items = d.photos || [];
      items.forEach(p => {
        const img = new Image();
        img.onload = () => {
          setOrientations(prev => {
            const next = { ...prev, [p.id]: img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape' };
            return next;
          });
        };
        img.src = p.url;
      });
      setPhotos(items);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % photos.length), (interval || 30) * 1000);
    return () => clearInterval(t);
  }, [photos, interval]);

  const current = photos[idx];
  const orientation = current ? (orientations[current.id] || 'landscape') : 'landscape';

  useEffect(() => {
    if (onOrientationChange) onOrientationChange(orientation);
  }, [orientation, onOrientationChange]);

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
