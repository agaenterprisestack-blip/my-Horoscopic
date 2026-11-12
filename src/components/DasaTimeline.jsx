import { useState } from 'react';
import { getPlanet } from '../data/jathagam.js';
import { currentPeriod } from '../lib/jathagam.js';
import { useLang, nameOf, N } from '../lib/i18n.jsx';

const fmt = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const T = {
  title: { ta: 'விம்சோத்தரி தசா புக்தி', en: 'Vimshottari Dasa / Bhukti' },
  balance: { ta: 'பிறப்பில் தசா இருப்பு', en: 'Dasa balance at birth' },
  current: { ta: 'தற்போது', en: 'Now running' },
  dasa: { ta: 'தசை', en: 'Dasa' },
  bhukti: { ta: 'புக்தி', en: 'Bhukti' },
  y: { ta: 'வருடம்', en: 'y' }, m: { ta: 'மாதம்', en: 'm' }, d: { ta: 'நாள்', en: 'd' },
};

export default function DasaTimeline({ dasa }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);
  const now = currentPeriod(dasa);
  const [open, setOpen] = useState(now.dasa?.lord ?? dasa.dasas[0].lord);
  const short = (k) => (lang === 'en' ? T[k].en : T[k].ta);
  const b = dasa.balance;

  return (
    <section className="panel">
      <h3>{t('title')}</h3>
      <p className="muted">
        {t('balance')}: <strong><N item={getPlanet(b.lord)} /></strong> — {b.years} {short('y')} {b.months} {short('m')} {b.days} {short('d')}
      </p>
      {now.dasa && (
        <p className="now-running">
          {t('current')}: <strong><N item={getPlanet(now.dasa.lord)} /></strong> {short('dasa')}
          {now.bhukti && <> / <strong><N item={getPlanet(now.bhukti.lord)} /></strong> {short('bhukti')}</>}
        </p>
      )}

      <ul className="dasa-list">
        {dasa.dasas.map((d) => {
          const isNow = d === now.dasa;
          return (
            <li key={d.lord} className={isNow ? 'current' : ''}>
              <button className="dasa-row" onClick={() => setOpen(open === d.lord ? null : d.lord)} aria-expanded={open === d.lord}>
                <span><N item={getPlanet(d.lord)} /> <span className="muted">({d.years}y)</span></span>
                <span className="muted">{fmt(d.start)} → {fmt(d.end)}</span>
              </button>
              {open === d.lord && (
                <table className="bhukti-table">
                  <tbody>
                    {d.bhuktis.map((bh) => (
                      <tr key={bh.lord} className={bh === now.bhukti ? 'current' : ''}>
                        <td><N item={getPlanet(bh.lord)} /></td>
                        <td>{fmt(bh.start)}</td>
                        <td>{fmt(bh.end)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
