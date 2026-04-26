import React, { useState, useEffect } from 'react';
import PhotoWidget from './components/Photos';
import Weather from './components/Weather';
import Calendar from './components/Calendar';
import Todoist from './components/Todoist';
import Quote from './components/Quote';
import WordOfDay from './components/WordOfDay';
import PhotoManager from './components/PhotoManager';
import './App.css';

function Dashboard({ config }) {
  return (
    <div className="dashboard">
      <PhotoWidget interval={config.photoInterval} />
      <Weather city={config.weatherCity} />
      <Calendar />
      <WordOfDay />
      <Todoist />
      <Quote />
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [page, setPage] = useState(window.location.hash === '#settings' ? 'settings' : 'dashboard');

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(setConfig).catch(() => {});
    const onHash = () => setPage(window.location.hash === '#settings' ? 'settings' : 'dashboard');
    window.addEventListener('hashchange', onHash);
    // Auto-refresh daily at 3 AM to prevent stale state
    const refresh = setInterval(() => {
      if (new Date().getHours() === 3) location.reload();
    }, 3600000);
    return () => { window.removeEventListener('hashchange', onHash); clearInterval(refresh); };
  }, []);

  if (!config) return <div className="loading">Loading...</div>;
  if (page === 'settings') return <PhotoManager />;
  return <Dashboard config={config} />;
}
