import RasiChart from './RasiChart.jsx';
import DasaTimeline from './DasaTimeline.jsx';
import { LAGNAM, getPlanet } from '../data/jathagam.js';
import { formatDegree } from '../lib/jathagam.js';
import { formatAtPlace, formatOffset, placeOffsetMinutes } from '../lib/time.js';
import { useLang, nameOf, N } from '../lib/i18n.jsx';

const T = {
  rasiChart: { ta: 'ராசி', en: 'Rasi' },
  navamsaChart: { ta: 'நவாம்சம்', en: 'Navamsam' },
  lagnam: { ta: 'லக்னம்', en: 'Lagnam' },
  rasi: { ta: 'ராசி', en: 'Rasi (Moon sign)' },
  star: { ta: 'நட்சத்திரம்', en: 'Natchathiram' },
  padham: { ta: 'பாதம்', en: 'Padham' },
  month: { ta: 'தமிழ் மாதம்', en: 'Tamil month' },
  day: { ta: 'கிழமை', en: 'Day' },
  thithi: { ta: 'திதி', en: 'Thithi' },
  yogam: { ta: 'யோகம்', en: 'Yogam' },
  karanam: { ta: 'கரணம்', en: 'Karanam' },
  planets: { ta: 'கிரக நிலை', en: 'Planet positions' },
  planet: { ta: 'கிரகம்', en: 'Planet' },
  degree: { ta: 'பாகை', en: 'Degree' },
  navamsa: { ta: 'நவாம்சம்', en: 'Navamsam' },
  retro: { ta: 'வ = வக்கிரம்', en: 'R = retrograde (vakram)' },
  dosham: { ta: 'செவ்வாய் தோஷம்', en: 'Chevvai dosham' },
  doshamYes: { ta: 'செவ்வாய் தோஷம் உள்ளது', en: 'Chevvai dosham present' },
  doshamNo: { ta: 'செவ்வாய் தோஷம் இல்லை', en: 'No Chevvai dosham' },
  fromLagnam: { ta: 'லக்னத்திலிருந்து', en: 'from Lagnam' },
  fromMoon: { ta: 'சந்திரனிலிருந்து', en: 'from Moon' },
  house: { ta: 'வீடு', en: 'House' },
  doshamNote: {
    ta: 'இது அடிப்படை கணிப்பு மட்டுமே. பல விதிவிலக்குகள் உள்ளன — திருமண முடிவுகளுக்கு ஜோதிடரை அணுகவும்.',
    en: 'This is a basic check only. Many exceptions (parikaram) apply — consult an astrologer before marriage decisions.',
  },
  ayanamsa: { ta: 'அயனாம்சம் (லஹிரி)', en: 'Ayanamsa (Lahiri)' },
  edit: { ta: 'விவரங்களை மாற்று', en: 'Edit details' },
};

const dms = (deg) => {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}°${m}'${s}"`;
};

export default function JathagamReport({ j, profile, onEdit }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);

  const rasiPlanets = j.planets.map((p) => ({ ...p, rasiId: p.rasi.id }));
  const navPlanets = j.planets.map((p) => ({ ...p, rasiId: p.navamsa.id }));
  const localBirth = formatAtPlace(j.birth, j.place, { dateStyle: 'full', timeStyle: 'short' });
  const offset = formatOffset(placeOffsetMinutes(j.place, j.birth));

  const summary = [
    ['lagnam', <N item={j.lagnam.rasi} />],
    ['rasi', <N item={j.rasi} />],
    ['star', <><N item={j.nakshatra} /> — {t('padham')} {j.padham}</>],
    ['month', <N item={j.tamilMonth} />],
    ['day', <N item={j.weekday} />],
    ['thithi', <><N item={j.paksha} /> <N item={j.thithi} /></>],
    ['yogam', <N item={j.yogam} />],
    ['karanam', <N item={j.karanam} />],
  ];

  const hasDosham = j.chevvai.lagnam || j.chevvai.moon;

  return (
    <div className="report">
      <section className="panel report-head">
        <div>
          <h2>{profile.name || nameOf({ ta: 'ஜாதகம்', en: 'Jathagam' }, lang)}</h2>
          <p className="muted">{localBirth} ({offset}) · {j.place.name}</p>
          <p className="muted small">
            {j.place.lat.toFixed(4)}°, {j.place.lon.toFixed(4)}° · {t('ayanamsa')}: {dms(j.ayanamsa)}
          </p>
        </div>
        <button className="btn ghost" onClick={onEdit}>{t('edit')}</button>
      </section>

      <section className="summary-grid">
        {summary.map(([k, v]) => (
          <div key={k} className="stat">
            <span className="label">{t(k)}</span>
            <span className="value">{v}</span>
          </div>
        ))}
      </section>

      <section className="charts">
        <RasiChart title={t('rasiChart')} lagnaRasi={j.lagnam.rasi.id} planets={rasiPlanets} />
        <RasiChart title={t('navamsaChart')} lagnaRasi={j.lagnam.navamsa.id} planets={navPlanets} />
      </section>
      <p className="muted small center">{t('retro')}</p>

      <section className="panel">
        <h3>{t('planets')}</h3>
        <div className="table-wrap">
          <table className="planet-table">
            <thead>
              <tr>
                <th>{t('planet')}</th><th>{t('rasiChart')}</th><th>{t('degree')}</th>
                <th>{t('star')}</th><th>{t('padham')}</th><th>{t('navamsa')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="lagna-row">
                <td><N item={LAGNAM} /></td>
                <td><N item={j.lagnam.rasi} /></td>
                <td>{formatDegree(j.lagnam.longitude)}</td>
                <td><N item={j.lagnam.nakshatra} /></td>
                <td>{j.lagnam.padham}</td>
                <td><N item={j.lagnam.navamsa} /></td>
              </tr>
              {j.planets.map((p) => (
                <tr key={p.id}>
                  <td><N item={getPlanet(p.id)} />{p.retro && p.id !== 'rahu' && p.id !== 'ketu' && <sup className="retro"> {lang === 'en' ? 'R' : 'வ'}</sup>}</td>
                  <td><N item={p.rasi} /></td>
                  <td>{formatDegree(p.longitude)}</td>
                  <td><N item={p.nakshatra} /></td>
                  <td>{p.padham}</td>
                  <td><N item={p.navamsa} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DasaTimeline dasa={j.dasa} />

      <section className={`panel dosham ${hasDosham ? 'warn' : 'ok'}`}>
        <h3>{t('dosham')}</h3>
        <p><strong>{t(hasDosham ? 'doshamYes' : 'doshamNo')}</strong></p>
        <p className="muted">
          <N item={getPlanet('mars')} />: {t('house')} {j.chevvai.fromLagnam} {t('fromLagnam')} ·{' '}
          {t('house')} {j.chevvai.fromMoon} {t('fromMoon')}
        </p>
        <p className="muted small">{t('doshamNote')}</p>
      </section>
    </div>
  );
}
