import { RASIS, LAGNAM } from '../data/jathagam.js';
import { useLang, shortOf } from '../lib/i18n.jsx';

// South Indian chart: rasis sit in fixed boxes, clockwise from Meenam (top-left).
// [row, col] for rasi ids 0 (Mesham) … 11 (Meenam).
const CELL = [
  [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3],
  [3, 2], [3, 1], [3, 0], [2, 0], [1, 0], [0, 0],
];

/**
 * @param {string} title
 * @param {number} lagnaRasi  rasi id holding the Lagnam
 * @param {{id:string, short:{ta,en}, retro:boolean, rasiId:number}[]} planets
 */
export default function RasiChart({ title, lagnaRasi, planets }) {
  const lang = useLang();

  return (
    <div className="rasi-chart" role="img" aria-label={title}>
      {RASIS.map((r) => {
        const [row, col] = CELL[r.id];
        const here = planets.filter((p) => p.rasiId === r.id);
        return (
          <div
            key={r.id}
            className={`cell${r.id === lagnaRasi ? ' lagna' : ''}`}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
            title={`${r.ta} · ${r.en}`}
          >
            <span className="cell-name">{shortOf(r, lang)}</span>
            <div className="cell-planets">
              {r.id === lagnaRasi && <span className="lagna-mark">{shortOf(LAGNAM, lang)}</span>}
              {here.map((p) => (
                <span key={p.id} className={`pl pl-${p.id}`}>
                  {shortOf(p, lang)}
                  {p.retro && p.id !== 'rahu' && p.id !== 'ketu' && <sup>{lang === 'en' ? 'R' : 'வ'}</sup>}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      <div className="chart-center">{title}</div>
    </div>
  );
}
