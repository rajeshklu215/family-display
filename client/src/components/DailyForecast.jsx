import React, { useState, useEffect } from 'react';

export default function DailyForecast() {
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    const load = () => fetch('/api/weather').then(r => r.json()).then(d => setDaily(d.daily || [])).catch(() => {});
    load();
    const t = setInterval(load, 600000);
    return () => clearInterval(t);
  }, []);

  if (!daily.length) return null;

  return (
    <div className="widget forecast">
      <h2>📊 Forecast</h2>
      <div className="weekly-forecast">
        {daily.map((d, i) => (
          <div key={i} className="weekly-day">
            <span className="weekly-label">{d.day}</span>
            <span className="weekly-sep" />
            <img src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`} alt="" />
            <span className="weekly-sep" />
            <span className="weekly-temps">
              <span className="weekly-hi">{Math.round(d.high)}°</span>
              <span className="weekly-lo">{Math.round(d.low)}°</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
