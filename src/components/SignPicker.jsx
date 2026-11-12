import { useState } from 'react';
import { SIGNS, ELEMENT_COLORS } from '../data/signs.js';
import { signFromDateString, formatRange } from '../lib/zodiac.js';

export default function SignPicker({ selectedId, onSelect }) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleFind = (e) => {
    e.preventDefault();
    const sign = signFromDateString(birthDate);
    if (!sign) {
      setError('Please enter a valid birth date.');
      return;
    }
    setError('');
    onSelect(sign.id);
  };

  return (
    <section className="picker">
      <form className="birth-form" onSubmit={handleFind}>
        <label htmlFor="birth">Don’t know your sign? Enter your birthday</label>
        <div className="birth-row">
          <input id="birth" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          <button type="submit" className="btn">Find my sign</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </form>

      <div className="sign-grid" role="list">
        {SIGNS.map((s) => (
          <button
            key={s.id}
            role="listitem"
            className={`sign-card${s.id === selectedId ? ' active' : ''}`}
            style={{ '--accent': ELEMENT_COLORS[s.element] }}
            onClick={() => onSelect(s.id)}
            aria-pressed={s.id === selectedId}
          >
            <span className="sign-symbol">{s.symbol}</span>
            <span className="sign-name">{s.name}</span>
            <span className="sign-dates">{formatRange(s)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
