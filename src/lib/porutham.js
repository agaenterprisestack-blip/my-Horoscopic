// Thirumana Porutham (10-point marriage matching) and Santhana (children)
// indicators, from the bride's and groom's natchathiram and rasi.

import { RASIS } from '../data/jathagam.js';
import {
  GANA, GANA_NAMES, YONI, YONI_NAMES, YONI_ENEMIES, RAJJU, RAJJU_NAMES, RAJJU_EFFECT,
  VEDHAI_PAIRS, VASYA, FRIENDS, PORUTHAMS, BENEFICS, MALEFICS,
} from '../data/porutham.js';
import { houseFrom } from './jathagam.js';

const L = (ta, en) => ({ ta, en });

/** Rasi from natchathiram + padham (each rasi spans exactly 9 padhams). */
export const rasiFromStar = (starId, padham) => Math.floor((starId * 4 + (padham - 1)) / 9);

/** Count from a to b inclusive, around a cycle of n. */
const countFrom = (a, b, n) => ((b - a + n) % n) + 1;

/** Relationship of planet b as seen from planet a. */
function relation(a, b) {
  if (a === b) return 'same';
  if (FRIENDS[a].f.includes(b)) return 'friend';
  if (FRIENDS[a].e.includes(b)) return 'enemy';
  return 'neutral';
}

/**
 * Score the 10 poruthams.
 * @param {{star:number, rasi:number}} bride
 * @param {{star:number, rasi:number}} groom
 */
export function matchPoruthams(bride, groom) {
  const n = countFrom(bride.star, groom.star, 27); // girl's star → boy's star
  const r = countFrom(bride.rasi, groom.rasi, 12); // girl's rasi → boy's rasi
  const sameStar = bride.star === groom.star;
  const res = {};

  // 1. Dina: remainder of n/9 in {2,4,6,8,0}.
  const rem = n % 9;
  res.dina = sameStar
    ? { score: 0.5, note: L('ஒரே நட்சத்திரம் — பாதம் வேறுபட்டால் ஏற்கலாம்', 'Same star — acceptable if the padhams differ') }
    : [0, 2, 4, 6, 8].includes(rem)
      ? { score: 1, note: L(`எண்ணிக்கை ${n} — பொருத்தம் உண்டு`, `Count ${n} — agrees`) }
      : { score: 0, note: L(`எண்ணிக்கை ${n} — பொருத்தம் இல்லை`, `Count ${n} — does not agree`) };

  // 2. Gana.
  const gb = GANA[bride.star], gg = GANA[groom.star];
  const ganaText = L(`${GANA_NAMES[gb].ta} – ${GANA_NAMES[gg].ta}`, `${GANA_NAMES[gb].en} – ${GANA_NAMES[gg].en}`);
  let ganaScore = 0;
  if (gb === gg) ganaScore = 1;
  else if (gb === 'M' && gg === 'D') ganaScore = 1;
  else if (gb === 'D' && gg === 'M') ganaScore = 0.5;
  res.gana = { score: ganaScore, note: ganaText };

  // 3. Mahendra: n in 4, 7, 10 … 25.
  res.mahendra = [4, 7, 10, 13, 16, 19, 22, 25].includes(n)
    ? { score: 1, note: L(`எண்ணிக்கை ${n} — பொருத்தம் உண்டு`, `Count ${n} — agrees`) }
    : { score: 0, note: L(`எண்ணிக்கை ${n}`, `Count ${n}`) };

  // 4. Sthree Dheerga: n > 13 good, > 9 moderate.
  res.sthree = { score: n > 13 ? 1 : n > 9 ? 0.5 : 0, note: L(`எண்ணிக்கை ${n} (13க்கு மேல் உத்தமம்)`, `Count ${n} (above 13 is best)`) };

  // 5. Yoni.
  const yb = YONI[bride.star], yg = YONI[groom.star];
  const hostile = YONI_ENEMIES.some(([a, b]) => (a === yb && b === yg) || (a === yg && b === yb));
  res.yoni = {
    score: hostile ? 0 : 1,
    note: L(`${YONI_NAMES[yb].ta} – ${YONI_NAMES[yg].ta}${hostile ? ' (பகை)' : ''}`, `${YONI_NAMES[yb].en} – ${YONI_NAMES[yg].en}${hostile ? ' (hostile)' : ''}`),
  };

  // 6. Rasi: count girl → boy.
  const lordB = RASIS[bride.rasi].lord, lordG = RASIS[groom.rasi].lord;
  const lordsFriendly = lordB === lordG || (relation(lordB, lordG) === 'friend' && relation(lordG, lordB) === 'friend');
  let rasiScore;
  if (r === 1) rasiScore = sameStar ? 0.5 : 1;
  else if ([7, 9, 10, 11].includes(r)) rasiScore = 1;
  else if (r === 12) rasiScore = 0.5;
  else if (r === 6 || r === 8) rasiScore = lordsFriendly ? 0.5 : 0; // shashtashtakam
  else rasiScore = 0;
  res.rasi = { score: rasiScore, note: L(`பெண் ராசியிலிருந்து ${r}வது ராசி`, `Groom’s rasi is ${r} from the bride’s`) };

  // 7. Rasi Adhipathi: friendship of the two rasi lords.
  const rel1 = relation(lordB, lordG), rel2 = relation(lordG, lordB);
  let adhiScore;
  if (rel1 === 'same' || (rel1 === 'friend' && rel2 === 'friend')) adhiScore = 1;
  else if (rel1 === 'enemy' || rel2 === 'enemy') adhiScore = 0;
  else adhiScore = 0.5;
  res.rasiAdhipathi = { score: adhiScore, lords: [lordB, lordG], note: null };

  // 8. Vasya: either rasi attracts the other.
  res.vasya = { score: VASYA[bride.rasi].includes(groom.rasi) || VASYA[groom.rasi].includes(bride.rasi) ? 1 : 0, note: null };

  // 9. Rajju: must be different.
  const rb = RAJJU[bride.star], rg = RAJJU[groom.star];
  res.rajju = rb === rg
    ? { score: 0, note: L(`இருவரும் ${RAJJU_NAMES[rb].ta} — ${RAJJU_EFFECT[rb].ta}`, `Both ${RAJJU_NAMES[rb].en} — ${RAJJU_EFFECT[rb].en}`), rajju: rb }
    : { score: 1, note: L(`${RAJJU_NAMES[rb].ta} – ${RAJJU_NAMES[rg].ta}`, `${RAJJU_NAMES[rb].en} – ${RAJJU_NAMES[rg].en}`) };

  // 10. Vedhai.
  const vedhai = VEDHAI_PAIRS.some(([a, b]) => (a === bride.star && b === groom.star) || (a === groom.star && b === bride.star));
  res.vedhai = { score: vedhai ? 0 : 1, note: vedhai ? L('வேதை நட்சத்திரங்கள்', 'Stars afflict each other') : null };

  const items = PORUTHAMS.map((p) => ({ ...p, ...res[p.id] }));
  const total = items.reduce((s, i) => s + i.score, 0);
  return { items, total, starCount: n, rasiCount: r };
}

/**
 * Overall marriage match percentage.
 * - Base: poruthams agreed out of 10.
 * - Rajju or Vedhai failing caps the result at 40% (traditionally not recommended).
 * - Chevvai dosham on only one side: −10 points.
 */
export function marriageScore(match, doshams) {
  let pct = (match.total / 10) * 100;
  const rajjuFail = match.items.find((i) => i.id === 'rajju').score === 0;
  const vedhaiFail = match.items.find((i) => i.id === 'vedhai').score === 0;
  const notes = [];

  let doshamStatus = null;
  if (doshams) {
    const [b, g] = doshams;
    doshamStatus = b === g ? (b ? 'both' : 'none') : 'one';
    if (doshamStatus === 'one') {
      pct -= 10;
      notes.push(L('செவ்வாய் தோஷம் ஒருவருக்கு மட்டும் உள்ளது (−10%)', 'Chevvai dosham on only one side (−10%)'));
    }
  }
  if (rajjuFail || vedhaiFail) {
    pct = Math.min(pct, 40);
    notes.push(rajjuFail
      ? L('ரஜ்ஜு பொருத்தம் இல்லை — பாரம்பரியமாக பரிந்துரைக்கப்படுவதில்லை', 'Rajju does not agree — traditionally not recommended')
      : L('வேதை உள்ளது — பாரம்பரியமாக பரிந்துரைக்கப்படுவதில்லை', 'Vedhai present — traditionally not recommended'));
  }
  pct = Math.max(0, Math.round(pct));

  const verdict = rajjuFail || vedhaiFail ? 'notRecommended'
    : pct >= 75 ? 'excellent'
    : pct >= 60 ? 'good'
    : pct >= 50 ? 'average'
    : 'weak';
  return { percent: pct, verdict, notes, doshamStatus, rajjuFail, vedhaiFail };
}

/**
 * Santhana (children) indicators from one Jathagam — traditional factors only.
 * Looks at Jupiter (putra karaka), the 5th house and its lord.
 */
export function santhanaIndicators(j) {
  const lagna = j.lagnam.rasi.id;
  const byId = Object.fromEntries(j.planets.map((p) => [p.id, p]));
  const houseOf = (id) => houseFrom(lagna, byId[id].rasi.id);
  const fifthRasi = (lagna + 4) % 12;
  const fifthLord = RASIS[fifthRasi].lord;
  const factors = [];
  let raw = 0;

  const jup = houseOf('jupiter');
  const jupFromMoon = houseFrom(j.rasi.id, byId.jupiter.rasi.id);
  if ([1, 4, 5, 7, 9, 10, 11].includes(jup)) { raw += 2; factors.push({ good: true, ...L(`குரு ${jup}ஆம் வீட்டில் — பலம்`, `Jupiter in house ${jup} — strong`) }); }
  else if ([2, 3].includes(jup)) { raw += 1; factors.push({ good: null, ...L(`குரு ${jup}ஆம் வீட்டில் — சுமார்`, `Jupiter in house ${jup} — moderate`) }); }
  else factors.push({ good: false, ...L(`குரு ${jup}ஆம் வீட்டில் (மறைவு ஸ்தானம்)`, `Jupiter in house ${jup} (a hidden house)`) });

  if ([1, 5, 9].includes(jupFromMoon) || [4, 7, 10].includes(jupFromMoon)) { raw += 1; factors.push({ good: true, ...L('சந்திரனிலிருந்து குரு கேந்திர/திரிகோணத்தில்', 'Jupiter well placed from the Moon') }); }

  const lordHouse = houseOf(fifthLord);
  if ([1, 4, 5, 7, 9, 10].includes(lordHouse)) { raw += 2; factors.push({ good: true, ...L(`5ஆம் அதிபதி ${lordHouse}ஆம் வீட்டில் — பலம்`, `5th lord in house ${lordHouse} — strong`) }); }
  else if ([2, 3, 11].includes(lordHouse)) { raw += 1; factors.push({ good: null, ...L(`5ஆம் அதிபதி ${lordHouse}ஆம் வீட்டில் — சுமார்`, `5th lord in house ${lordHouse} — moderate`) }); }
  else factors.push({ good: false, ...L(`5ஆம் அதிபதி ${lordHouse}ஆம் வீட்டில் (மறைவு ஸ்தானம்)`, `5th lord in house ${lordHouse} (a hidden house)`) });

  // Jupiter and the 5th lord are already scored above; count the others in the 5th.
  const inFifth = j.planets.filter((p) => p.rasi.id === fifthRasi && p.id !== fifthLord && p.id !== 'jupiter');
  let occ = 0;
  for (const p of inFifth) {
    if (BENEFICS.includes(p.id)) { occ += 1; factors.push({ good: true, planet: p.id, ...L('சுப கிரகம் 5ஆம் வீட்டில்', 'Benefic in the 5th house') }); }
    else if (MALEFICS.includes(p.id)) { occ -= 1; factors.push({ good: false, planet: p.id, ...L('பாப கிரகம் 5ஆம் வீட்டில்', 'Malefic in the 5th house') }); }
  }
  raw += Math.max(-2, Math.min(2, occ));

  // raw ranges −2 … 7 → 20 … 95%. Never shown as 0: these are tendencies, not verdicts.
  const percent = Math.round(20 + ((raw + 2) / 9) * 75);
  return { percent, factors, fifthRasi: RASIS[fifthRasi], fifthLord };
}

/** Couple-level santhana factors from the poruthams. */
export function coupleSanthana(match, brideInd, groomInd) {
  const get = (id) => match.items.find((i) => i.id === id);
  const factors = [];
  let couple = 0;
  if (get('mahendra').score) { couple += 40; factors.push({ good: true, ...L('மகேந்திர பொருத்தம் உண்டு — புத்திர பாக்கியம்', 'Mahendra agrees — blessed with children') }); }
  else factors.push({ good: false, ...L('மகேந்திர பொருத்தம் இல்லை', 'Mahendra does not agree') });
  if (get('yoni').score) { couple += 30; factors.push({ good: true, ...L('யோனி பொருத்தம் உண்டு', 'Yoni agrees') }); }
  else factors.push({ good: false, ...L('யோனி பகை', 'Yoni hostile') });
  const rajju = get('rajju');
  if (rajju.score) { couple += 30; }
  else if (rajju.rajju === 'udara') factors.push({ good: false, ...L('இருவரும் உதர ரஜ்ஜு — குழந்தை பாக்கியத்திற்கு பரிகாரம் தேவை', 'Both Udara rajju — remedies traditionally advised for children') });
  else couple += 15;

  const percent = brideInd && groomInd
    ? Math.round(0.35 * brideInd.percent + 0.35 * groomInd.percent + 0.3 * couple)
    : Math.round(30 + couple * 0.5); // star-only: couple factors alone, kept within 30–80%
  return { percent, factors, partial: !(brideInd && groomInd) };
}
