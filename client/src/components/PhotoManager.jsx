import React, { useState, useEffect, useRef } from 'react';

export default function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = () => fetch('/api/photos').then(r => r.json()).then(d => setPhotos(d.photos || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    const form = new FormData();
    Array.from(files).forEach(f => form.append('photos', f));
    await fetch('/api/photos/upload', { method: 'POST', body: form });
    setUploading(false);
    load();
  };

  const remove = async (name) => {
    await fetch(`/api/photos/${encodeURIComponent(name)}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="photo-manager">
      <h2>📸 Manage Photos</h2>
      <p className="pm-hint">Upload photos from your phone's gallery. They'll appear as the dashboard background.</p>
      <button className="pm-upload-btn" onClick={() => fileRef.current.click()}>
        {uploading ? 'Uploading...' : '+ Add Photos'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={upload} style={{display:'none'}} />
      <div className="pm-grid">
        {photos.map(p => (
          <div key={p.id} className="pm-thumb">
            <img src={p.url} alt="" />
            <button className="pm-remove" onClick={() => remove(p.id)}>✕</button>
          </div>
        ))}
      </div>
      {photos.length === 0 && !uploading && <p className="pm-empty">No photos yet. Tap the button above to add some!</p>}
      <a href="#" className="pm-back">← Back to dashboard</a>
    </div>
  );
}
