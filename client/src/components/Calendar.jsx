import React, { useState, useEffect } from 'react';

function getUSHolidays(year) {
  const nthWeekday = (m, dow, n) => {
    const first = new Date(year, m, 1).getDay();
    let day = 1 + ((dow - first + 7) % 7) + (n - 1) * 7;
    return day;
  };
  const lastMonday = (m) => {
    const last = new Date(year, m + 1, 0);
    const day = last.getDate() - ((last.getDay() + 6) % 7);
    return day;
  };
  return [
    { month: 0, day: 1, name: "🎆 New Year's" },
    { month: 0, day: nthWeekday(0, 1, 3), name: '✊ MLK Day' },
    { month: 1, day: 14, name: '❤️ Valentine\'s' },
    { month: 1, day: nthWeekday(1, 1, 3), name: "🇺🇸 Presidents' Day" },
    { month: 2, day: 17, name: "☘️ St. Patrick's" },
    { month: 4, day: lastMonday(4), name: '🎖️ Memorial Day' },
    { month: 5, day: 19, name: '✊ Juneteenth' },
    { month: 6, day: 4, name: '🎇 4th of July' },
    { month: 8, day: nthWeekday(8, 1, 1), name: '👷 Labor Day' },
    { month: 9, day: nthWeekday(9, 1, 2), name: '🌎 Columbus Day' },
    { month: 9, day: 31, name: '🎃 Halloween' },
    { month: 10, day: 11, name: "🎖️ Veterans Day" },
    { month: 10, day: nthWeekday(10, 4, 4), name: '🦃 Thanksgiving' },
    { month: 11, day: 25, name: '🎄 Christmas' },
    { month: 11, day: 31, name: "🎉 New Year's Eve" },
  ];
}

export default function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = () => fetch('/api/calendar').then(r => r.json()).then(d => setEvents(d.events || [])).catch(() => {});
    load();
    const t = setInterval(load, 300000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Map day number to list of event names
  const eventsByDay = {};

  // Add US holidays
  getUSHolidays(year).forEach(h => {
    if (h.month === month) {
      if (!eventsByDay[h.day]) eventsByDay[h.day] = [];
      eventsByDay[h.day].push(h.name);
    }
  });

  // Add Google Calendar events
  events.forEach(ev => {
    const d = new Date(ev.start.dateTime || ev.start.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev.summary);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="cal-cell empty" />);
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today;
    const dayEvents = eventsByDay[d] || [];
    cells.push(
      <div key={d} className={`cal-cell${isToday ? ' today' : ''}`}>
        <span>{d}</span>
        {dayEvents.slice(0, 2).map((name, i) => (
          <div key={i} className="cal-event-name">{name}</div>
        ))}
        {dayEvents.length > 2 && <div className="cal-event-more">+{dayEvents.length - 2}</div>}
      </div>
    );
  }

  return (
    <div className="widget calendar">
      <h2>📅 {monthName}</h2>
      <div className="cal-header">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="cal-day-label">{d}</div>)}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  );
}
