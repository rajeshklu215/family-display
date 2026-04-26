import React, { useState, useEffect } from 'react';

export default function Quote() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/quote').then(r => r.json()).then(setQuote).catch(() => {});
    load();
    const t = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  if (!quote) return null;

  return (
    <div className="widget quote">
      <div className="quote-text">"{quote.text}"</div>
      <div className="quote-author">— {quote.author}</div>
    </div>
  );
}
