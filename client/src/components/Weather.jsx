import React, { useState, useEffect } from 'react';
import DressUpKid from './DressUpKid';

export default function Weather({ city }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/weather').then(r => r.json()).then(setData).catch(() => {});
    load();
    const t = setInterval(load, 600000);
    return () => clearInterval(t);
  }, []);

  if (!data || data.error || !data.current) return (
    <div className="widget weather">
      <p style={{color:'var(--dim)'}}>Loading weather...</p>
    </div>
  );

  const { current, hourly, daily } = data;
  const temp = Math.round(current.main.temp);
  const code = current.weather[0].id;
  const dressUp = () => {
    const rain = code >= 200 && code < 600;
    const snow = code >= 600 && code < 700;
    if (snow) return 'Snow gear & boots';
    if (rain && temp < 50) return 'Rain jacket & boots';
    if (rain) return 'Umbrella & rain boots';
    if (temp < 32) return 'Heavy coat & gloves';
    if (temp < 45) return 'Winter coat';
    if (temp < 55) return 'Jacket & long pants';
    if (temp < 65) return 'Light jacket';
    if (temp < 75) return 'T-shirt weather!';
    return 'Shorts & sunscreen!';
  };

  return (
    <div className="widget weather">
      <div className="weather-row">
        <div className="weather-main">
          <img src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} alt="" />
          <div>
            <div className="temp">{temp}°F</div>
            <div className="desc">{current.weather[0].description}</div>
          </div>
        </div>
        <div className="dress-up">
          <DressUpKid weatherCode={code} temp={temp} />
          <span className="dress-tip">{dressUp()}</span>
        </div>
      </div>
    </div>
  );
}
