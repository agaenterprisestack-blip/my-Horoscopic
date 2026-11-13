import { useEffect, useMemo, useState } from 'react';
import PlaceSearch from './PlaceSearch.jsx';
import { NAKSHATRAS, RASIS, getPlanet } from '../data/jathagam.js';
import { findPlace } from '../data/places.js';
import { computeJathagam } from '../lib/jathagam.js';
import { localToUtc } from '../lib/time.js';
import { matchPoruthams, marriageScore, rasiFromStar, santhanaIndicators, coupleSanthana } from '../lib/porutham.js';
import { useLang, nameOf, N } from '../lib/i18n.jsx';

const STORE = 'horoscopic:couple';

const T = {
  title: { ta: 'திருமண பொருத்தம்', en: 'Marriage Porutham' },
  bride: { ta: 'மணமகள்', en: 'Bride' },
  groom: { ta: 'மணமகன்', en: 'Groom' },
  name: { ta: 'பெயர்', en: 'Name' },
  byBirth: { ta: 'பிறப்பு விவரம்', en: 'Birth details' },
  byStar: { ta: 'நட்சத்திரம் மட்டும்', en: 'Star only' },
  date: { ta: 'பிறந்த தேதி', en: 'Date of birth' },
  time: { ta: 'பிறந்த நேரம்', en: 'Time of birth' },
  place: { ta: 'பிறந்த ஊர்', en: 'Place of birth' },
  star: { ta: 'நட்சத்திரம்', en: 'Natchathiram' },
  padham: { ta: 'பாதம்', en: 'Padham' },
  rasi: { ta: 'ராசி', en: 'Rasi' },
  useMine: { ta: 'என் ஜாதகத்தைப் பயன்படுத்து', en: 'Use my Jathagam' },
  fillBoth: { ta: 'பொருத்தம் பார்க்க இருவரின் விவரங்களையும் நிரப்பவும்.', en: 'Fill in both people’s details to see the match.' },
  match: { ta: 'திருமண பொருத்தம்', en: 'Marriage match' },
  of10: { ta: '10 பொருத்தங்களில்', en: 'of 10 poruthams' },
  excellent: { ta: 'உத்தமம் — மிகச் சிறந்த பொருத்தம்', en: 'Uthamam — excellent match' },
  good: { ta: 'மத்திமம் — நல்ல பொருத்தம்', en: 'Mathimam — good match' },
  average: { ta: 'சுமார் — பரிகாரங்களுடன் ஏற்கலாம்', en: 'Average — acceptable with remedies' },
  weak: { ta: 'அதமம் — பொருத்தம் குறைவு', en: 'Athamam — weak match' },
  notRecommended: { ta: 'பாரம்பரியமாக பரிந்துரைக்கப்படுவதில்லை', en: 'Traditionally not recommended' },
  porutham: { ta: 'பொருத்தம்', en: 'Porutham' },
  meaning: { ta: 'பொருள்', en: 'Signifies' },
  result: { ta: 'முடிவு', en: 'Result' },
  details: { ta: 'விவரம்', en: 'Details' },
  dosham: { ta: 'செவ்வாய் தோஷம்', en: 'Chevvai dosham' },
  doshamBoth: { ta: 'இருவருக்கும் உள்ளது — சமம் (பொருந்தும்)', en: 'Both have it — balanced (matches)' },
  doshamNone: { ta: 'இருவருக்கும் இல்லை — நல்லது', en: 'Neither has it — good' },
  doshamOne: { ta: 'ஒருவருக்கு மட்டும் உள்ளது — ஜோதிடரை அணுகவும்', en: 'Only one has it — consult an astrologer' },
  doshamNeedBirth: { ta: 'தோஷ ஒப்பீட்டிற்கு இருவரின் பிறப்பு விவரமும் தேவை.', en: 'Both birth details are needed to compare dosham.' },
  santhana: { ta: 'குழந்தை பாக்கியம் (சந்தான பாக்கியம்)', en: 'Children (Santhana Bhagyam)' },
  santhanaCouple: { ta: 'தம்பதியர் குறியீடு', en: 'Couple indicator' },
  santhanaPartial: { ta: 'நட்சத்திரம் மட்டும் கொடுக்கப்பட்டதால் பொருத்தங்களின் அடிப்படையில் மட்டும். முழு கணிப்பிற்கு இருவரின் பிறப்பு விவரமும் தேவை.', en: 'Based on the poruthams only, since only stars were given. Enter both birth details for the full reading.' },
  santhanaNote: {
    ta: 'இவை பாரம்பரிய ஜோதிட குறியீடுகள் மட்டுமே — உறுதியான கணிப்பு அல்ல. குழந்தைப் பேறு குறித்த மருத்துவ கேள்விகளுக்கு மருத்துவரை அணுகவும்.',
    en: 'These are traditional astrological indicators, not a prediction. For medical questions about having children, please consult a doctor.',
  },
  remedies: { ta: 'பாரம்பரிய பரிகாரம்', en: 'Traditional remedies' },
  remedyText: {
    ta: 'சந்தான கோபால மந்திரம், திருக்கருகாவூர் கர்ப்பரக்ஷாம்பிகை வழிபாடு, வியாழக்கிழமை குரு வழிபாடு.',
    en: 'Santhana Gopala mantra, worship at Thirukarugavur Garbharakshambigai temple, Thursday Guru worship.',
  },
  fifth: { ta: '5ஆம் வீடு', en: '5th house' },
  disclaimer: {
    ta: 'பொருத்தம் ஒரு வழிகாட்டி மட்டுமே. இருவரின் புரிதல், அன்பு, குடும்ப சம்மதம் ஆகியவையே திருமண வெற்றிக்கு அடிப்படை.',
    en: 'Porutham is a traditional guide only. Mutual understanding, love and family support matter most in a marriage.',
  },
  how: {
    ta: 'கணக்கீடு: 10 பொருத்தங்களில் கிடைத்த மதிப்பெண் (முழு = 1, பாதி = ½). ரஜ்ஜு அல்லது வேதை இல்லையெனில் அதிகபட்சம் 40%. செவ்வாய் தோஷம் ஒருவருக்கு மட்டும் இருந்தால் −10%.',
    en: 'How it’s scored: poruthams agreed out of 10 (full = 1, partial = ½). If Rajju or Vedhai fails, capped at 40%. Chevvai dosham on only one side: −10%.',
  },
};

const VERDICT_COLOR = { excellent: '#7ee081', good: '#b5e07e', average: '#f5c542', weak: '#ff9a5c', notRecommended: '#ff6b6b' };
const EMPTY = { name: '', mode: 'star', date: '', time: '', placeId: 'Chennai', star: '', padham: '1' };

function loadCouple() {
  try {
    const v = JSON.parse(localStorage.getItem(STORE));
    if (v?.bride && v?.groom) return v;
  } catch { /* ignore */ }
  return { bride: { ...EMPTY }, groom: { ...EMPTY } };
}

/** Resolve one person's inputs to {star, rasi, j?}. */
function resolve(p) {
  if (p.mode === 'birth') {
    const place = findPlace(p.placeId);
    if (!p.date || !p.time || !place) return null;
    const birth = localToUtc(p.date, p.time, place);
    if (!birth) return null;
    const j = computeJathagam(birth, place);
    return { star: j.nakshatra.id, rasi: j.rasi.id, padham: j.padham, j };
  }
  if (p.star === '') return null;
  const star = Number(p.star), padham = Number(p.padham);
  return { star, rasi: rasiFromStar(star, padham), padham };
}

function Gauge({ percent, color, label, size = 'big' }) {
  return (
    <div className={`gauge gauge-${size}`} style={{ '--pct': percent, '--col': color }} role="img" aria-label={`${percent}%`}>
      <div className="gauge-inner">
        <span className="gauge-num">{percent}%</span>
        {label && <span className="gauge-label">{label}</span>}
      </div>
    </div>
  );
}

function PersonPanel({ role, value, onChange, profile }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);
  const set = (patch) => onChange({ ...value, ...patch });
  const resolved = useMemo(() => resolve(value), [value]);

  // Padhams that keep the star inside a valid rasi are all 1–4; show the resulting rasi.
  return (
    <section className={`panel person person-${role}`}>
      <h3>{role === 'bride' ? '👰' : '🤵'} {t(role)}</h3>
      <div className="form-grid">
        <label>
          <span>{t('name')}</span>
          <input value={value.name} maxLength={60} onChange={(e) => set({ name: e.target.value })} />
        </label>
      </div>

      <div className="mode-toggle" role="group">
        {['star', 'birth'].map((m) => (
          <button key={m} type="button" className={value.mode === m ? 'active' : ''} onClick={() => set({ mode: m })}>
            {t(m === 'star' ? 'byStar' : 'byBirth')}
          </button>
        ))}
      </div>

      {value.mode === 'star' ? (
        <div className="form-grid">
          <label>
            <span>{t('star')}</span>
            <select value={value.star} onChange={(e) => set({ star: e.target.value })}>
              <option value="">—</option>
              {NAKSHATRAS.map((n) => <option key={n.id} value={n.id}>{nameOf(n, lang)}</option>)}
            </select>
          </label>
          <label>
            <span>{t('padham')}</span>
            <select value={value.padham} onChange={(e) => set({ padham: e.target.value })}>
              {[1, 2, 3, 4].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
        </div>
      ) : (
        <div className="form-grid">
          <label>
            <span>{t('date')}</span>
            <input type="date" value={value.date} min="1900-01-01" max="2100-12-31" onChange={(e) => set({ date: e.target.value })} />
          </label>
          <label>
            <span>{t('time')}</span>
            <input type="time" value={value.time} onChange={(e) => set({ time: e.target.value })} />
          </label>
          <div className="field">
            <label>{t('place')}</label>
            <PlaceSearch value={findPlace(value.placeId)} onChange={(p) => set({ placeId: p.id })} />
          </div>
        </div>
      )}

      {profile && !profile.custom && (
        <button
          type="button"
          className="text-btn"
          onClick={() => onChange({ ...value, mode: 'birth', name: profile.name || value.name, date: profile.date, time: profile.time, placeId: profile.placeName })}
        >
          {t('useMine')}
        </button>
      )}

      {resolved && (
        <p className="person-summary">
          <N item={NAKSHATRAS[resolved.star]} /> {resolved.padham && <>· {t('padham')} {resolved.padham}</>} · <N item={RASIS[resolved.rasi]} />
        </p>
      )}
    </section>
  );
}

export default function PoruthamView({ profile }) {
  const lang = useLang();
  const t = (k) => nameOf(T[k], lang);
  const [couple, setCouple] = useState(loadCouple);

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(couple)); } catch { /* ignore */ }
  }, [couple]);

  const b = useMemo(() => resolve(couple.bride), [couple.bride]);
  const g = useMemo(() => resolve(couple.groom), [couple.groom]);

  const result = useMemo(() => {
    if (!b || !g) return null;
    const match = matchPoruthams(b, g);
    const doshams = b.j && g.j
      ? [b.j.chevvai.lagnam || b.j.chevvai.moon, g.j.chevvai.lagnam || g.j.chevvai.moon]
      : null;
    const score = marriageScore(match, doshams);
    const sb = b.j ? santhanaIndicators(b.j) : null;
    const sg = g.j ? santhanaIndicators(g.j) : null;
    const santhana = coupleSanthana(match, sb, sg);
    return { match, score, sb, sg, santhana };
  }, [b, g]);

  const fmtTotal = (x) => (Number.isInteger(x) ? String(x) : `${Math.floor(x)}½`);
  const mark = (s) => (s === 1 ? '✓' : s === 0.5 ? '½' : '✗');
  const bName = couple.bride.name || t('bride');
  const gName = couple.groom.name || t('groom');

  return (
    <div className="porutham">
      <div className="couple-grid">
        <PersonPanel role="bride" value={couple.bride} onChange={(v) => setCouple((c) => ({ ...c, bride: v }))} profile={profile} />
        <PersonPanel role="groom" value={couple.groom} onChange={(v) => setCouple((c) => ({ ...c, groom: v }))} profile={profile} />
      </div>

      {!result ? (
        <p className="empty">{t('fillBoth')}</p>
      ) : (
        <>
          <section className="panel match-head">
            <Gauge percent={result.score.percent} color={VERDICT_COLOR[result.score.verdict]} label={t('match')} />
            <div className="match-text">
              <h2>{bName} 💍 {gName}</h2>
              <p className="verdict-big" style={{ color: VERDICT_COLOR[result.score.verdict] }}>{t(result.score.verdict)}</p>
              <p className="muted">
                <strong>{fmtTotal(result.match.total)}</strong> {t('of10')}
              </p>
              {result.score.notes.map((n, i) => <p key={i} className="alert small">⚠ <N item={n} /></p>)}
              <p className="muted small">{t('how')}</p>
            </div>
          </section>

          <section className="panel">
            <h3>{t('title')}</h3>
            <div className="table-wrap">
              <table className="porutham-table">
                <thead>
                  <tr><th>{t('porutham')}</th><th>{t('result')}</th><th>{t('details')}</th></tr>
                </thead>
                <tbody>
                  {result.match.items.map((p) => (
                    <tr key={p.id} className={p.critical && p.score === 0 ? 'critical' : ''}>
                      <td>
                        <strong><N item={p} /></strong>{p.critical && ' ★'}
                        <div className="muted small"><N item={p.about} /></div>
                      </td>
                      <td><span className={`mark mark-${p.score === 1 ? 'yes' : p.score === 0.5 ? 'half' : 'no'}`}>{mark(p.score)}</span></td>
                      <td className="small">
                        {p.note && <N item={p.note} />}
                        {p.lords && <><N item={getPlanet(p.lords[0])} /> – <N item={getPlanet(p.lords[1])} /></>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 className="sub">{t('dosham')}</h4>
            <p>
              {result.score.doshamStatus
                ? t({ both: 'doshamBoth', none: 'doshamNone', one: 'doshamOne' }[result.score.doshamStatus])
                : <span className="muted">{t('doshamNeedBirth')}</span>}
            </p>
          </section>

          <section className="panel santhana">
            <h3>👶 {t('santhana')}</h3>
            <div className="santhana-row">
              <Gauge percent={result.santhana.percent} color="#b39dff" label={t('santhanaCouple')} size="small" />
              {result.sb && result.sg && (
                <div className="santhana-people">
                  {[[bName, result.sb], [gName, result.sg]].map(([nm, s]) => (
                    <div key={nm} className="stat">
                      <span className="label">{nm}</span>
                      <span className="value">{s.percent}%</span>
                      <span className="muted small">{t('fifth')}: <N item={s.fifthRasi} /> · <N item={getPlanet(s.fifthLord)} /></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {result.santhana.partial && <p className="muted small">{t('santhanaPartial')}</p>}

            <ul className="factor-list">
              {result.santhana.factors.map((f, i) => (
                <li key={`c${i}`} className={f.good ? 'f-good' : f.good === false ? 'f-bad' : ''}><N item={f} /></li>
              ))}
              {[[bName, result.sb], [gName, result.sg]].filter(([, s]) => s).map(([nm, s]) =>
                s.factors.map((f, i) => (
                  <li key={`${nm}${i}`} className={f.good ? 'f-good' : f.good === false ? 'f-bad' : ''}>
                    <strong>{nm}:</strong> <N item={f} />{f.planet && <> (<N item={getPlanet(f.planet)} />)</>}
                  </li>
                )),
              )}
            </ul>

            <h4 className="sub">{t('remedies')}</h4>
            <p className="small">{t('remedyText')}</p>
            <p className="muted small">{t('santhanaNote')}</p>
          </section>

          <p className="muted small center">{t('disclaimer')}</p>
        </>
      )}
    </div>
  );
}
