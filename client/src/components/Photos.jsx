import React, { useState, useEffect } from 'react';

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PhotoWidget({ interval }) {
  const [photos, setPhotos] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch('/api/photos').then(r => r.json()).then(d => setPhotos(d.photos || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setIdx(i => (i + 1) % photos.length), (interval || 60) * 1000);
    return () => clearInterval(t);
  }, [photos, interval]);

  if (!photos.length) return <div className="photo-widget"><span className="pw-empty">📸 Add photos via #settings</span></div>;

  return (
    <div className="photo-widget">
      {photos.map((p, i) => (
        <div key={p.id || i} className={`pw-frame ${i === idx ? 'visible' : 'hidden'}`}>
          <img className="pw-main" src={p.url} alt="" />
          {p.dateTaken && <div className="pw-date">{formatDate(p.dateTaken)}</div>}
        </div>
      ))}
    </div>
  );
}
