import React, { useState, useEffect } from 'react';

export default function Greeting({ familyName }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();
  const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="widget greeting">
      <div className="greeting-time">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
      <div className="greeting-date">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
      <div className="greeting-hello">{greeting}, {familyName} Family</div>
    </div>
  );
}
