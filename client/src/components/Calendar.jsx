import React, { useState, useEffect } from 'react';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [setup, setSetup] = useState(false);

  useEffect(() => {
    const load = () => fetch('/api/calendar').then(r => r.json()).then(d => {
      setEvents((d.events || []).slice(0, 4));
      setSetup(!!d.setup);
    }).catch(() => {});
    load();
    const t = setInterval(load, 300000);
    return () => clearInterval(t);
  }, []);

  const fmtDateTime = (ev) => {
    if (ev.start.date) {
      const d = new Date(ev.start.date + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' · All day';
    }
    const d = new Date(ev.start.dateTime);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="widget calendar">
      <h2>📅 Calendar</h2>
      {setup && <p className="cal-empty">Set up Google Calendar credentials</p>}
      {!setup && events.length === 0 && <p className="cal-empty">No upcoming events</p>}
      {events.map((ev, i) => (
        <div key={i} className="cal-event">
          <span className="cal-time">{fmtDateTime(ev)}</span>
          <span>{ev.summary}</span>
        </div>
      ))}
    </div>
  );
}
