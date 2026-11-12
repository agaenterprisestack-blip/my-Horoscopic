import { useEffect, useMemo, useState } from 'react';
import Starfield from './components/Starfield.jsx';
import BirthForm from './components/BirthForm.jsx';
import JathagamReport from './components/JathagamReport.jsx';
import DailyPalan from './components/DailyPalan.jsx';
import { findPlace, DEFAULT_PLACE } from './data/places.js';
import { computeJathagam } from './lib/jathagam.js';
import { localToUtc } from './lib/time.js';
import { LangContext, nameOf } from './lib/i18n.jsx';

const STORE = { profile: 'horoscopic:profile', lang: 'horoscopic:lang', rasi: 'horoscopic:rasi', tab: 'horoscopic:tab' };

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
};

/** Resolve a saved profile's place into {name, lat, lon, tz | utcOffset}. */
function resolvePlace(profile) {
  if (profile?.custom) {
    const c = profile.custom;
    return { name: `${(+c.lat).toFixed(2)}°, ${(+c.lon).toFixed(2)}°`, lat: +c.lat, lon: +c.lon, utcOffset: +c.utcOffset };
  }
  return findPlace(profile?.placeName) ?? DEFAULT_PLACE;
}

const TABS = [
  { id: 'jathagam', ta: 'ஜாதகம்', en: 'Jathagam' },
  { id: 'palan', ta: 'ராசி பலன்', en: 'Rasi Palan' },
];
const LANGS = [
  { id: 'both', label: 'தமிழ் + EN' },
  { id: 'ta', label: 'தமிழ்' },
  { id: 'en', label: 'English' },
];

export default function App() {
  const [lang, setLang] = useState(() => load(STORE.lang, 'both'));
  const [tab, setTab] = useState(() => load(STORE.tab, 'jathagam'));
  const [profile, setProfile] = useState(() => load(STORE.profile, null));
  const [editing, setEditing] = useState(() => !load(STORE.profile, null));
  const [rasiId, setRasiId] = useState(() => load(STORE.rasi, null));

  useEffect(() => save(STORE.lang, lang), [lang]);
  useEffect(() => save(STORE.tab, tab), [tab]);
  useEffect(() => { if (rasiId != null) save(STORE.rasi, rasiId); }, [rasiId]);

  const place = useMemo(() => resolvePlace(profile), [profile]);
  const jathagam = useMemo(() => {
    if (!profile) return null;
    const birth = localToUtc(profile.date, profile.time, place);
    return birth ? computeJathagam(birth, place) : null;
  }, [profile, place]);

  const handleSubmit = (p) => {
    setProfile(p);
    save(STORE.profile, p);
    setEditing(false);
    // Default the daily palan to the newly computed birth Rasi.
    const birth = localToUtc(p.date, p.time, resolvePlace(p));
    if (birth) setRasiId(computeJathagam(birth, resolvePlace(p)).rasi.id);
  };

  return (
    <LangContext.Provider value={lang}>
      <Starfield />
      <main className="container">
        <header className="hero">
          <h1>Horoscopic</h1>
          <p className="tagline" lang="ta">உங்கள் ஜாதகம் · பஞ்சாங்கம் · ராசி பலன்</p>
          <div className="toolbar">
            <nav className="tabs" role="tablist">
              {TABS.map((tb) => (
                <button key={tb.id} role="tab" aria-selected={tab === tb.id} className={tab === tb.id ? 'active' : ''} onClick={() => setTab(tb.id)}>
                  {nameOf(tb, lang)}
                </button>
              ))}
            </nav>
            <div className="lang-toggle" role="group" aria-label="Language">
              {LANGS.map((l) => (
                <button key={l.id} className={lang === l.id ? 'active' : ''} onClick={() => setLang(l.id)}>{l.label}</button>
              ))}
            </div>
          </div>
        </header>

        {tab === 'jathagam' &&
          (editing || !jathagam ? (
            <BirthForm initial={profile} onSubmit={handleSubmit} />
          ) : (
            <JathagamReport j={jathagam} profile={profile} onEdit={() => setEditing(true)} />
          ))}

        {tab === 'palan' && (
          <DailyPalan rasiId={rasiId} profileRasiId={jathagam?.rasi.id} onSelect={setRasiId} place={place} />
        )}

        <footer className="footer">
          {nameOf({ ta: 'லஹிரி அயனாம்சம் கொண்டு கணிக்கப்பட்டது. பொழுதுபோக்கு மற்றும் வழிகாட்டலுக்கு மட்டும்.', en: 'Calculated with Lahiri ayanamsa. For guidance and entertainment.' }, lang)}
        </footer>
      </main>
    </LangContext.Provider>
  );
}
