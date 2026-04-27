import React, { useState, useEffect } from 'react';

export default function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="widget clock-widget">
      <div className="wc-time">{timeStr}</div>
      <div className="wc-date">{dateStr}</div>
    </div>
  );
}
