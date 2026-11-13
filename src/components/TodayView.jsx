import { useEffect, useMemo, useState } from 'react';
import PlaceSearch from './PlaceSearch.jsx';
import { placeLabel } from '../data/places.js';
import { getPlanet } from '../data/jathagam.js';
import { computeDay, personalDay, runningPeriod } from '../lib/daily.js';
import { placeOffsetMinutes, formatAtPlace } from '../lib/time.js';
import { useLang, nameOf, N } from '../lib/i18n.jsx';

const T = {
  today: { ta: 'இன்று', en: 'Today' },
  prev: { ta: '← முந்தைய நாள்', en: '← Previous' },
  next: { ta: 'அடுத்த நாள் →', en: 'Next →' },
  place: { ta: 'இடம்', en: 'Place' },
  nalla: { ta: 'நல்ல நேரம்', en: 'Nalla Neram (good time)' },
  abhijit: { ta: 'அபிஜித் முகூர்த்தம்', en: 'Abhijit Muhurtham' },
  avoid: { ta: 'தவிர்க்க வேண்டிய நேரம்', en: 'Times to avoid' },
  rahu: { ta: 'ராகு காலம்', en: 'Rahu Kalam' },
  yama: { ta: 'எமகண்டம்', en: 'Yamagandam' },
  kuligai: { ta: 'குளிகை', en: 'Kuligai' },
  soolam: { ta: 'சூலம்', en: 'Soolam' },
  parigaram: { ta: 'பரிகாரம்', en: 'Parigaram' },
  panchangam: { ta: 'பஞ்சாங்கம்', en: 'Panchangam' },
  thithi: { ta: 'திதி', en: 'Thithi' },
  star: { ta: 'நட்சத்திரம்', en: 'Natchathiram' },
  yogam: { ta: 'யோகம்', en: 'Yogam' },
  karanam: { ta: 'கரணம்', en: 'Karanam' },
  moon: { ta: 'சந்திரன்', en: 'Moon in' },
  sunrise: { ta: 'சூரிய உதயம்', en: 'Sunrise' },
  sunset: { ta: 'சூரிய அஸ்தமனம்', en: 'Sunset' },
  then: { ta: 'பிறகு', en: 'then' },
  gowri: { ta: 'கௌரி பஞ்சாங்கம் (பகல்)', en: 'Gowri Panchangam (daytime)' },
  now: { ta: 'இப்போது', en: 'Now' },
  forYou: { ta: 'உங்களுக்கு இன்று', en: 'Your day' },
  noProfile: { ta: 'உங்கள் ஜாதகத்தை உருவாக்கினால், உங்கள் நட்சத்திரத்தின் அடிப்படையில் தனிப்பட்ட ஆலோசனை கிடைக்கும்.', en: 'Create your Jathagam to get personal advice based on your birth star.' },
  makeJathagam: { ta: 'ஜாதகம் உருவாக்கு', en: 'Create Jathagam' },
  tara: { ta: 'தாரா பலம்', en: 'Tara balam' },
  chandra: { ta: 'சந்திர பலம்', en: 'Chandra balam' },
  house: { ta: 'வீடு', en: 'House' },
  dasa: { ta: 'நடப்பு தசை / புக்தி', en: 'Running Dasa / Bhukti' },
  advice: { ta: 'இன்றைய ஆலோசனை', en: 'Advice for today' },
  good: { ta: 'பலம் உண்டு', en: 'Strong' },
  bad: { ta: 'பலம் இல்லை', en: 'Weak' },
  neutral: { ta: 'சுமார்', en: 'Average' },
  excellent: { ta: 'மிகச் சிறந்த நாள்', en: 'Excellent day' },
  goodDay: { ta: 'நல்ல நாள்', en: 'Good day' },
  mixed: { ta: 'சாதாரண நாள்', en: 'Mixed day' },
  careful: { ta: 'கவனமாக இருக்க வேண்டிய நாள்', en: 'Be careful today' },
  special: { ta: 'இன்றைய சிறப்பு', en: 'Special today' },
  polar: { ta: 'இந்த இடத்தில் இன்று சூரிய உதயம் இல்லை.', en: 'No sunrise at this place today.' },
};

const VERDICT_KEY = { excellent: 'excellent', good: 'goodDay', mixed: 'mixed', careful: 'careful' };

/** Local "YYYY-MM-DD" at a place. */
function localDateStr(place, at = new Date()) {
  const d = new Date(at.getTime() + placeOffsetMinutes(place, at) * 60000);
  return d.toISOString().slice(0, 10);
}
function shiftDate(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function TodayView({ jathagam, homePlace, onPlaceChange, onCreateJathagam }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const todayStr = localDateStr(homePlace, now);
  const [dateStr, setDateStr] = useState(todayStr);
  const isToday = dateStr === todayStr;

  const day = useMemo(() => computeDay(dateStr, homePlace), [dateStr, homePlace]);
  const mine = useMemo(() => (day && jathagam ? personalDay(day, jathagam) : null), [day, jathagam]);

  // Times rounded to the nearest minute, as printed calendars do.
  const tm = (d) => (d ? formatAtPlace(new Date(d.getTime() + 30000), homePlace, { hour: 'numeric', minute: '2-digit', hour12: true }) : '—');
  const range = (p) => `${tm(p.start)} – ${tm(p.end)}`;
  const until = (d) => (lang === 'en' ? `until ${tm(d)}` : `${tm(d)} வரை`);
  const nowGowri = isToday && day ? runningPeriod(day.gowri, now) : null;

  const dateLabel = new Date(`${dateStr}T12:00:00Z`).toLocaleDateString(lang === 'ta' ? 'ta-IN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="today">
      <section className="panel today-head">
        <div className="date-nav">
          <button className="btn ghost" onClick={() => setDateStr(shiftDate(dateStr, -1))}>{t('prev')}</button>
          {!isToday && <button className="btn" onClick={() => setDateStr(todayStr)}>{t('today')}</button>}
          <button className="btn ghost" onClick={() => setDateStr(shiftDate(dateStr, 1))}>{t('next')}</button>
        </div>
        <h2>{dateLabel}</h2>
        {day && (
          <p className="today-line">
            <N item={day.tamilMonth} /> · <N item={day.weekday} /> · <N item={day.paksha} /> <N item={day.thithi} />
          </p>
        )}
        <div className="place-pick">
          <span>{t('place')}</span>
          <PlaceSearch key={homePlace.id ?? homePlace.name} value={homePlace} onChange={(p) => onPlaceChange(p.id)} />
        </div>
        {day?.special.length > 0 && (
          <div className="special">
            <span className="label">{t('special')}</span>
            {day.special.map((s) => <span key={s.en} className="chip-special"><N item={s} /></span>)}
          </div>
        )}
      </section>

      {!day ? (
        <p className="empty">{t('polar')}</p>
      ) : (
        <>
          <div className="time-cards">
            <section className="panel good-card">
              <h3>✅ {t('nalla')}</h3>
              <ul className="time-list">
                {day.nallaNeram.map((g) => (
                  <li key={g.n} className={nowGowri?.n === g.n ? 'running' : ''}>
                    <span className="time">{range(g)}</span>
                    <span className={`q q-${g.quality}`}><N item={g} /></span>
                  </li>
                ))}
                {day.abhijit && (
                  <li className={isToday && runningPeriod([day.abhijit], now) ? 'running' : ''}>
                    <span className="time">{range(day.abhijit)}</span>
                    <span className="q q-best">{t('abhijit')}</span>
                  </li>
                )}
              </ul>
            </section>

            <section className="panel bad-card">
              <h3>⛔ {t('avoid')}</h3>
              <ul className="time-list">
                {['rahu', 'yama', 'kuligai'].map((k) => (
                  <li key={k} className={isToday && runningPeriod([day[k]], now) ? 'running' : ''}>
                    <span className="time">{range(day[k])}</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
                <li>
                  <span className="time"><N item={day.soolam.dir} /></span>
                  <span>{t('soolam')} · {t('parigaram')}: <N item={day.soolam.remedy} /></span>
                </li>
              </ul>
            </section>
          </div>

          {/* Personal guidance */}
          <section className="panel personal">
            <h3>🔮 {t('forYou')}</h3>
            {mine ? (
              <>
                <p className={`verdict v-${mine.verdict}`}>{t(VERDICT_KEY[mine.verdict])}</p>
                <div className="summary-grid">
                  <div className="stat">
                    <span className="label">{t('tara')}</span>
                    <span className="value"><N item={mine.tara} /> ({mine.tara.num})</span>
                    <span className="muted small"><N item={mine.tara.note} /></span>
                  </div>
                  <div className="stat">
                    <span className="label">{t('chandra')}</span>
                    <span className="value">{t(mine.chandra)}</span>
                    <span className="muted small">{t('moon')} <N item={day.moonRasi} /> · {t('house')} {mine.house}</span>
                  </div>
                  {mine.period.dasa && (
                    <div className="stat">
                      <span className="label">{t('dasa')}</span>
                      <span className="value">
                        <N item={getPlanet(mine.period.dasa.lord)} />
                      </span>
                      {mine.period.bhukti && <span className="muted small"><N item={getPlanet(mine.period.bhukti.lord)} /></span>}
                    </div>
                  )}
                </div>
                <h4>{t('advice')}</h4>
                <ul className="advice-list">
                  {mine.advice.map((a, i) => (
                    <li key={i} className={`adv adv-${a.kind}`}>
                      {a.kind === 'time' ? (
                        <><strong>{nameOf(a, lang)}:</strong> {range(a.best)} (<N item={a.best} />)</>
                      ) : (
                        lang === 'both' ? <>{a.ta}<br /><span className="en-sub">{a.en}</span></> : nameOf(a, lang)
                      )}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="muted">{t('noProfile')}</p>
                <button className="btn" onClick={onCreateJathagam}>{t('makeJathagam')}</button>
              </>
            )}
          </section>

          <div className="time-cards">
            <section className="panel">
              <h3>📜 {t('panchangam')}</h3>
              <dl className="panchang-list">
                <div><dt>{t('sunrise')} / {t('sunset')}</dt><dd>{tm(day.sunrise)} / {tm(day.sunset)}</dd></div>
                <div>
                  <dt>{t('thithi')}</dt>
                  <dd>
                    <N item={day.paksha} /> <N item={day.thithi} /> {day.thithiEnds && <>— {until(day.thithiEnds)}</>}
                    {day.nextThithi && <span className="muted small"> · {t('then')} <N item={day.nextThithi.thithi} /></span>}
                  </dd>
                </div>
                <div>
                  <dt>{t('star')}</dt>
                  <dd>
                    <N item={day.nakshatra} /> {day.starEnds && <>— {until(day.starEnds)}</>}
                    {day.nextNakshatra && <span className="muted small"> · {t('then')} <N item={day.nextNakshatra} /></span>}
                  </dd>
                </div>
                <div><dt>{t('yogam')}</dt><dd><N item={day.yogam} /></dd></div>
                <div><dt>{t('karanam')}</dt><dd><N item={day.karanam} /></dd></div>
                <div><dt>{t('moon')}</dt><dd><N item={day.moonRasi} /></dd></div>
              </dl>
            </section>

            <section className="panel">
              <h3>🕉 {t('gowri')}</h3>
              <ul className="time-list gowri">
                {day.gowri.map((g) => (
                  <li key={g.n} className={nowGowri?.n === g.n ? 'running' : ''}>
                    <span className="time">{range(g)}</span>
                    <span className={`q q-${g.quality}`}><N item={g} /></span>
                    {nowGowri?.n === g.n && <span className="now-tag">{t('now')}</span>}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className="muted small center">
            {formatAtPlace(now, homePlace, { hour: 'numeric', minute: '2-digit', hour12: true })} · {placeLabel(homePlace)}
          </p>
        </>
      )}
    </div>
  );
}
