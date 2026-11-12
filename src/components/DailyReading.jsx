import { useMemo } from 'react';
import { getDailyHoroscope } from '../lib/horoscope.js';

function Stars({ value }) {
  return (
    <span className="rating" aria-label={`${value} out of 5`}>
      {'★'.repeat(value)}
      <span className="dim">{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export default function DailyReading({ sign, onPickSign }) {
  const h = useMemo(() => getDailyHoroscope(sign.id), [sign.id]);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <article className="panel reading">
      <header className="reading-head">
        <span className="big-symbol">{sign.symbol}</span>
        <div>
          <h2>{sign.name}</h2>
          <p className="muted">{today}</p>
        </div>
      </header>

      <p className="reading-text">{h.text}</p>
      <blockquote className="advice">“{h.advice}”</blockquote>

      <div className="stats">
        <div className="stat"><span className="label">Mood</span><span className="value">{h.mood}</span></div>
        <div className="stat"><span className="label">Lucky number</span><span className="value">{h.luckyNumber}</span></div>
        <div className="stat">
          <span className="label">Lucky color</span>
          <span className="value"><i className="swatch" style={{ background: h.luckyColor.hex }} />{h.luckyColor.name}</span>
        </div>
        <div className="stat"><span className="label">Lucky time</span><span className="value">{h.luckyTime}</span></div>
        <div className="stat">
          <span className="label">Best match today</span>
          <button className="value link" onClick={() => onPickSign(h.compatibility.id)}>
            {h.compatibility.symbol} {h.compatibility.name}
          </button>
        </div>
      </div>

      <div className="ratings">
        <div><span>Love</span><Stars value={h.ratings.love} /></div>
        <div><span>Career</span><Stars value={h.ratings.career} /></div>
        <div><span>Wellness</span><Stars value={h.ratings.wellness} /></div>
      </div>
    </article>
  );
}
