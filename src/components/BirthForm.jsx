import { useState } from 'react';
import { PLACES } from '../data/places.js';
import { useLang, nameOf } from '../lib/i18n.jsx';

const CUSTOM = '__custom__';
const T = {
  title: { ta: 'பிறப்பு விவரங்கள்', en: 'Birth details' },
  name: { ta: 'பெயர்', en: 'Name' },
  date: { ta: 'பிறந்த தேதி', en: 'Date of birth' },
  time: { ta: 'பிறந்த நேரம்', en: 'Time of birth' },
  place: { ta: 'பிறந்த ஊர்', en: 'Place of birth' },
  other: { ta: 'வேறு இடம் (அட்சரேகை/தீர்க்கரேகை)', en: 'Other place (enter coordinates)' },
  lat: { ta: 'அட்சரேகை', en: 'Latitude (+N)' },
  lon: { ta: 'தீர்க்கரேகை', en: 'Longitude (+E)' },
  offset: { ta: 'UTC நேர வித்தியாசம் (மணி)', en: 'UTC offset (hours)' },
  submit: { ta: 'ஜாதகம் கணி', en: 'Generate Jathagam' },
  hint: { ta: 'சரியான லக்னத்திற்கு பிறந்த நேரம் மிக முக்கியம்.', en: 'An accurate birth time matters most for the Lagnam.' },
  error: { ta: 'தயவுசெய்து அனைத்து விவரங்களையும் சரியாக நிரப்பவும்.', en: 'Please fill in all details correctly.' },
};

export default function BirthForm({ initial, onSubmit }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);

  const [name, setName] = useState(initial?.name ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [time, setTime] = useState(initial?.time ?? '');
  const [placeName, setPlaceName] = useState(initial?.placeName ?? 'Chennai');
  const [custom, setCustom] = useState(initial?.custom ?? { lat: '', lon: '', utcOffset: '5.5' });
  const [error, setError] = useState('');

  const regions = [...new Set(PLACES.map((p) => p.region))];

  const submit = (e) => {
    e.preventDefault();
    const isCustom = placeName === CUSTOM;
    const c = { lat: parseFloat(custom.lat), lon: parseFloat(custom.lon), utcOffset: parseFloat(custom.utcOffset) };
    const customOk = Math.abs(c.lat) <= 66 && Math.abs(c.lon) <= 180 && Math.abs(c.utcOffset) <= 14;
    if (!date || !time || (isCustom && !customOk)) {
      setError(t('error'));
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), date, time, placeName, custom: isCustom ? custom : undefined });
  };

  return (
    <form className="panel birth-form" onSubmit={submit}>
      <h2>{t('title')}</h2>
      <div className="form-grid">
        <label>
          <span>{t('name')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="—" maxLength={60} />
        </label>
        <label>
          <span>{t('date')}</span>
          <input type="date" required value={date} min="1900-01-01" max="2100-12-31" onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          <span>{t('time')}</span>
          <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label>
          <span>{t('place')}</span>
          <select value={placeName} onChange={(e) => setPlaceName(e.target.value)}>
            {regions.map((r) => (
              <optgroup key={r} label={r}>
                {PLACES.filter((p) => p.region === r).map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </optgroup>
            ))}
            <option value={CUSTOM}>{t('other')}</option>
          </select>
        </label>
        {placeName === CUSTOM && (
          <>
            <label>
              <span>{t('lat')}</span>
              <input type="number" step="any" value={custom.lat} placeholder="13.08" onChange={(e) => setCustom({ ...custom, lat: e.target.value })} />
            </label>
            <label>
              <span>{t('lon')}</span>
              <input type="number" step="any" value={custom.lon} placeholder="80.27" onChange={(e) => setCustom({ ...custom, lon: e.target.value })} />
            </label>
            <label>
              <span>{t('offset')}</span>
              <input type="number" step="0.25" value={custom.utcOffset} onChange={(e) => setCustom({ ...custom, utcOffset: e.target.value })} />
            </label>
          </>
        )}
      </div>
      <p className="hint">{t('hint')}</p>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" className="btn">{t('submit')}</button>
    </form>
  );
}
