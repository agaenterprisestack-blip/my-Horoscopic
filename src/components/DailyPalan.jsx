import { useMemo } from 'react';
import { RASIS, ELEMENT_COLORS } from '../data/jathagam.js';
import { getDailyPalan } from '../lib/horoscope.js';
import { todayAt, isChandrashtamam, houseFrom } from '../lib/jathagam.js';
import { sunTimes } from '../lib/astro.js';
import { formatAtPlace } from '../lib/time.js';
import { useLang, nameOf, N } from '../lib/i18n.jsx';

const T = {
  pick: { ta: 'உங்கள் ராசியைத் தேர்ந்தெடுக்கவும்', en: 'Choose your Rasi (Moon sign)' },
  fromJathagam: { ta: 'உங்கள் ஜாதகத்திலிருந்து', en: 'from your Jathagam' },
  today: { ta: 'இன்றைய பஞ்சாங்கம்', en: 'Today’s Panchangam' },
  palan: { ta: 'இன்றைய ராசி பலன்', en: 'Today’s Rasi Palan' },
  chandrashtamam: { ta: 'இன்று சந்திராஷ்டமம்! புதிய முயற்சிகளைத் தவிர்க்கவும்.', en: 'Chandrashtamam today! Avoid starting new ventures.' },
  moonIn: { ta: 'சந்திரன் உங்கள் ராசியிலிருந்து', en: 'Moon is in house' },
  moonInSuffix: { ta: 'ஆம் வீட்டில்', en: 'from your Rasi' },
  star: { ta: 'நட்சத்திரம்', en: 'Natchathiram' },
  thithi: { ta: 'திதி', en: 'Thithi' },
  yogam: { ta: 'யோகம்', en: 'Yogam' },
  karanam: { ta: 'கரணம்', en: 'Karanam' },
  moonRasi: { ta: 'சந்திரன்', en: 'Moon in' },
  month: { ta: 'மாதம்', en: 'Month' },
  day: { ta: 'கிழமை', en: 'Day' },
  sunrise: { ta: 'சூரிய உதயம்', en: 'Sunrise' },
  sunset: { ta: 'சூரிய அஸ்தமனம்', en: 'Sunset' },
  deity: { ta: 'வழிபட வேண்டிய தெய்வம்', en: 'Deity to worship' },
  direction: { ta: 'அதிர்ஷ்ட திசை', en: 'Lucky direction' },
  number: { ta: 'அதிர்ஷ்ட எண்', en: 'Lucky number' },
  color: { ta: 'அதிர்ஷ்ட நிறம்', en: 'Lucky color' },
  favorable: { ta: 'சாதகமான ராசி', en: 'Favorable Rasi' },
  family: { ta: 'குடும்பம்', en: 'Family' },
  work: { ta: 'தொழில்', en: 'Work' },
  health: { ta: 'ஆரோக்கியம்', en: 'Health' },
  at: { ta: 'இடம்', en: 'at' },
};

function Stars({ value }) {
  return (
    <span className="rating" aria-label={`${value} / 5`}>
      {'★'.repeat(value)}<span className="dim">{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export default function DailyPalan({ rasiId, profileRasiId, onSelect, place }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);

  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => todayAt(place, now), [place, now]);
  const sun = useMemo(() => sunTimes(now, place.lat, place.lon), [place, now]);
  const rasi = rasiId != null ? RASIS[rasiId] : null;
  const palan = useMemo(() => (rasi ? getDailyPalan(rasi.id, now) : null), [rasi, now]);
  const time = (d) => (d ? formatAtPlace(d, place, { timeStyle: 'short' }) : '—');

  const panchangam = [
    ['month', <N item={today.tamilMonth} />],
    ['day', <N item={today.weekday} />],
    ['thithi', <><N item={today.paksha} /> <N item={today.thithi} /></>],
    ['star', <N item={today.nakshatra} />],
    ['yogam', <N item={today.yogam} />],
    ['karanam', <N item={today.karanam} />],
    ['moonRasi', <N item={today.moonRasi} />],
    ['sunrise', time(sun?.sunrise)],
    ['sunset', time(sun?.sunset)],
  ];

  return (
    <div className="daily">
      <section className="panel">
        <h3>{t('today')} <span className="muted small">— {now.toLocaleDateString('en-GB', { dateStyle: 'long' })}, {place.name}</span></h3>
        <div className="summary-grid">
          {panchangam.map(([k, v]) => (
            <div key={k} className="stat"><span className="label">{t(k)}</span><span className="value">{v}</span></div>
          ))}
        </div>
      </section>

      <h3 className="section-title">{t('pick')}</h3>
      <div className="sign-grid">
        {RASIS.map((r) => (
          <button
            key={r.id}
            className={`sign-card${r.id === rasiId ? ' active' : ''}`}
            style={{ '--accent': ELEMENT_COLORS[r.element] }}
            onClick={() => onSelect(r.id)}
            aria-pressed={r.id === rasiId}
          >
            <span className="sign-symbol">{r.symbol}</span>
            <span className="sign-name" lang="ta">{r.ta}</span>
            <span className="sign-dates">{r.en} · {r.west}</span>
            {r.id === profileRasiId && <span className="badge">{t('fromJathagam')}</span>}
          </button>
        ))}
      </div>

      {rasi && palan && (
        <article className="panel reading">
          <header className="reading-head">
            <span className="big-symbol">{rasi.symbol}</span>
            <div>
              <h2>{t('palan')}</h2>
              <p className="muted"><N item={rasi} /></p>
            </div>
          </header>

          {isChandrashtamam(rasi.id, today.moonRasi.id) && (
            <p className="alert" role="alert">⚠ {t('chandrashtamam')}</p>
          )}
          <p className="muted small">
            {t('moonIn')} {houseFrom(rasi.id, today.moonRasi.id)} {t('moonInSuffix')}
          </p>

          {lang !== 'en' && <p className="reading-text" lang="ta">{palan.text.ta}</p>}
          {lang !== 'ta' && <p className={lang === 'both' ? 'reading-text en-sub' : 'reading-text'}>{palan.text.en}</p>}

          <div className="summary-grid">
            <div className="stat"><span className="label">{t('deity')}</span><span className="value"><N item={palan.deity} /></span></div>
            <div className="stat"><span className="label">{t('direction')}</span><span className="value"><N item={palan.direction} /></span></div>
            <div className="stat"><span className="label">{t('number')}</span><span className="value">{palan.luckyNumber}</span></div>
            <div className="stat">
              <span className="label">{t('color')}</span>
              <span className="value"><i className="swatch" style={{ background: palan.luckyColor.hex }} /><N item={palan.luckyColor} /></span>
            </div>
            <div className="stat">
              <span className="label">{t('favorable')}</span>
              <button className="value link" onClick={() => onSelect(palan.favorable.id)}><N item={palan.favorable} /></button>
            </div>
          </div>

          <div className="ratings">
            {['family', 'work', 'health'].map((k) => (
              <div key={k}><span>{t(k)}</span><Stars value={palan.ratings[k]} /></div>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
