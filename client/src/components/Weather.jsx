import React, { useState, useEffect } from 'react';

export default function Weather({ city }) {
  const [data, setData] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const load = () => fetch('/api/weather').then(r => r.json()).then(setData).catch(() => {});
    load();
    const t = setInterval(load, 600000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (!data || data.error || !data.current) return (
    <div className="widget weather">
      <div className="wc-time">{timeStr}</div>
      <div className="wc-date">{dateStr}</div>
      <p style={{color:'var(--dim)'}}>Loading weather...</p>
    </div>
  );

  const { current, hourly, daily } = data;
  return (
    <div className="widget weather">
      <div className="wc-time">{timeStr}</div>
      <div className="wc-date">{dateStr}</div>
      <div className="weather-main">
        <img src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} alt="" />
        <div>
          <div className="temp">{Math.round(current.main.temp)}°F</div>
          <div className="desc">{current.weather[0].description}</div>
        </div>
      </div>
      {hourly && hourly.length > 0 && (
        <div className="hourly-forecast">
          {hourly.map((h, i) => (
            <div key={i} className="hourly-item">
              <div>{h.time}</div>
              <img src={`https://openweathermap.org/img/wn/${h.icon}.png`} alt="" />
              <div>{h.temp}°</div>
            </div>
          ))}
        </div>
      )}
      {daily && daily.length > 0 && (
        <div className="weekly-forecast">
          {daily.map((d, i) => (
            <div key={i} className="weekly-day">
              <span className="weekly-label">{d.day}</span>
              <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt="" />
              <span className="weekly-desc">{d.desc}</span>
              <span className="weekly-hi">{Math.round(d.high)}°</span>
              <span className="weekly-lo">{Math.round(d.low)}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
