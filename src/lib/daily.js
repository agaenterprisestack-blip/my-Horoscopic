// Daily Tamil calendar: Nalla Neram, Rahu Kalam, Gowri Panchangam,
// special days, and personal guidance from a Jathagam.

import * as A from 'astronomy-engine';
import { siderealLongitude } from './astro.js';
import { panchangamElements, nakshatraOf, rasiOf, houseFrom, currentPeriod } from './jathagam.js';
import { localToUtc } from './time.js';
import { RASIS, TAMIL_MONTHS, WEEKDAYS } from '../data/jathagam.js';
import {
  GOWRI, GOWRI_DAY, RAHU_SLOT, YAMA_SLOT, KULIGAI_SLOT, SOOLAM, WEEKDAY_WORSHIP,
  TARAS, CHANDRA_GOOD, CHANDRA_BAD, DASA_REMEDY, SPECIAL,
} from '../data/daily.js';

const HOUR = 3600000;

const thithiIndex = (d) => panchangamElements(siderealLongitude('sun', d), siderealLongitude('moon', d)).thithiNum;
const starIndex = (d) => nakshatraOf(siderealLongitude('moon', d)).nakshatra.id;

/** When does an integer-valued quantity next change after `from`? */
function nextChange(fn, from, maxHours = 40) {
  const v0 = fn(from);
  let lo = from.getTime();
  let hi = lo;
  for (let h = 1; h <= maxHours; h++) {
    hi = lo + HOUR;
    if (fn(new Date(hi)) !== v0) break;
    lo = hi;
  }
  if (fn(new Date(hi)) === v0) return null;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (fn(new Date(mid)) === v0) lo = mid; else hi = mid;
  }
  return new Date(hi);
}

/**
 * Everything for one local calendar day at a place.
 * @param {string} dateStr "YYYY-MM-DD" (local date at the place)
 */
export function computeDay(dateStr, place) {
  const midnight = localToUtc(dateStr, '00:00', place);
  const observer = new A.Observer(place.lat, place.lon, 0);
  const riseT = A.SearchRiseSet(A.Body.Sun, observer, +1, A.MakeTime(midnight), 1);
  if (!riseT) return null; // polar day / night
  const setT = A.SearchRiseSet(A.Body.Sun, observer, -1, riseT, 1);
  const sunrise = riseT.date;
  const sunset = setT.date;

  const [y, m, d] = dateStr.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();

  // Day divided into 8 equal parts.
  const part = (sunset - sunrise) / 8;
  const slot = (n) => ({ start: new Date(sunrise.getTime() + (n - 1) * part), end: new Date(sunrise.getTime() + n * part), n });

  const rahu = slot(RAHU_SLOT[wd]);
  const yama = slot(YAMA_SLOT[wd]);
  const kuligai = slot(KULIGAI_SLOT[wd]);

  const gowri = GOWRI_DAY[wd].map((key, i) => ({ key, ...GOWRI[key], ...slot(i + 1) }));
  // Nalla Neram: good Gowri periods that do not fall in Rahu Kalam or Yamagandam.
  const nallaNeram = gowri.filter((g) => g.quality !== 'bad' && g.n !== rahu.n && g.n !== yama.n);

  // Abhijit muhurtham: the 8th of 15 daytime muhurtams (not observed on Wednesdays).
  const muhurtam = (sunset - sunrise) / 15;
  const abhijit = wd === 3 ? null : {
    start: new Date(sunrise.getTime() + 7 * muhurtam),
    end: new Date(sunrise.getTime() + 8 * muhurtam),
  };

  // Panchangam as at sunrise, with end times.
  const sunLon = siderealLongitude('sun', sunrise);
  const moonLon = siderealLongitude('moon', sunrise);
  const p = panchangamElements(sunLon, moonLon);
  const star = nakshatraOf(moonLon);
  const thithiEnds = nextChange(thithiIndex, sunrise);
  const starEnds = nextChange(starIndex, sunrise);

  // Thithi after the current one ends (for display).
  const nextP = thithiEnds ? panchangamElements(siderealLongitude('sun', thithiEnds), siderealLongitude('moon', thithiEnds)) : null;
  const nextStar = starEnds ? nakshatraOf(siderealLongitude('moon', starEnds)) : null;

  // Special days: thithi at sunrise, Pradosham by thithi at sunset.
  const special = [];
  const t = p.thithiNum;
  const tSet = thithiIndex(sunset);
  if (t === 15) special.push(SPECIAL.pournami);
  if (t === 30) special.push(SPECIAL.amavasai);
  if (t === 11 || t === 26) special.push(SPECIAL.ekadasi);
  if (tSet === 13 || tSet === 28) special.push(SPECIAL.pradosham);
  if (t === 6 || t === 21) special.push(SPECIAL.sashti);
  if (t === 4) special.push(SPECIAL.chathurthi);
  if (t === 19) special.push(SPECIAL.sankatahara);
  if (t === 29) special.push(SPECIAL.shivarathri);
  if (t === 8 || t === 23) special.push(SPECIAL.ashtami);
  if (t === 9 || t === 24) special.push(SPECIAL.navami);
  if (star.nakshatra.id === 2) special.push(SPECIAL.karthigai);
  if (star.nakshatra.id === 21) special.push(SPECIAL.thiruvonam);

  return {
    dateStr, weekdayIdx: wd, weekday: WEEKDAYS[wd],
    sunrise, sunset,
    tamilMonth: TAMIL_MONTHS[rasiOf(sunLon)],
    ...p, thithiEnds, nextThithi: nextP && { thithi: nextP.thithi, paksha: nextP.paksha },
    nakshatra: star.nakshatra, starEnds, nextNakshatra: nextStar?.nakshatra,
    moonRasi: RASIS[rasiOf(moonLon)],
    rahu, yama, kuligai, gowri, nallaNeram, abhijit,
    soolam: SOOLAM[wd],
    worship: WEEKDAY_WORSHIP[wd],
    special,
  };
}

/** Which period is running at `at` (or null). */
export const runningPeriod = (periods, at) => periods.find((p) => at >= p.start && at < p.end) ?? null;

/**
 * Personal guidance for the day from a Jathagam.
 * Uses the Moon's position at sunrise (as Tamil calendars do).
 */
export function personalDay(day, j) {
  const taraNum = ((day.nakshatra.id - j.nakshatra.id + 27) % 27) % 9; // 0 = Janma
  const tara = { ...TARAS[taraNum], num: taraNum + 1 };

  const house = houseFrom(j.rasi.id, day.moonRasi.id);
  const chandra = CHANDRA_GOOD.includes(house) ? 'good' : CHANDRA_BAD.includes(house) ? 'bad' : 'neutral';
  const chandrashtamam = house === 8;

  const period = currentPeriod(j.dasa, day.sunrise);

  // Overall verdict for the day.
  let score = 0;
  if (tara.good === true) score += 1;
  if (tara.good === false) score -= 1;
  if (chandra === 'good') score += 1;
  if (chandra === 'bad') score -= 1;
  if (chandrashtamam) score -= 2;
  const verdict = score >= 2 ? 'excellent' : score >= 1 ? 'good' : score === 0 ? 'mixed' : 'careful';

  // Advice list, most important first.
  const advice = [];
  if (chandrashtamam) {
    advice.push({ kind: 'warn', ta: 'இன்று சந்திராஷ்டமம் — புதிய முயற்சிகள், பயணம், வாக்குவாதம் தவிர்க்கவும். அமைதியாக இருங்கள்.', en: 'Chandrashtamam today — avoid new ventures, travel and arguments. Stay calm.' });
  }
  if (tara.good === false) {
    advice.push({ kind: 'warn', ta: `${tara.ta}: ${tara.note.ta}. முக்கிய காரியங்களை ஒத்திவையுங்கள்.`, en: `${tara.en} tara: ${tara.note.en}. Postpone important matters if you can.` });
  } else if (tara.good) {
    advice.push({ kind: 'good', ta: `${tara.ta}: ${tara.note.ta}. நல்ல நேரத்தில் முக்கிய காரியங்களைச் செய்யுங்கள்.`, en: `${tara.en} tara: ${tara.note.en}. Do important work during Nalla Neram.` });
  } else {
    advice.push({ kind: 'info', ta: 'ஜென்ம நட்சத்திர நாள் — உடல்நலம் கவனியுங்கள், இறை வழிபாடு செய்யுங்கள்.', en: 'Your birth-star day — mind your health and spend time in prayer.' });
  }
  if (chandra === 'good' && !chandrashtamam) {
    advice.push({ kind: 'good', ta: 'சந்திர பலம் உள்ளது — மனம் தெளிவாக இருக்கும்; பேச்சுவார்த்தைகளுக்கு ஏற்ற நாள்.', en: 'Chandra balam is strong — clear mind; good for talks and negotiations.' });
  } else if (chandra === 'bad' && !chandrashtamam) {
    advice.push({ kind: 'warn', ta: 'சந்திர பலம் குறைவு — உணர்ச்சிவசப்பட்டு முடிவெடுக்க வேண்டாம்.', en: 'Chandra balam is weak — don’t make emotional decisions.' });
  }
  const best = day.nallaNeram.find((g) => g.key === 'amirdha') ?? day.nallaNeram[0];
  if (best) advice.push({ kind: 'time', best, ta: 'முக்கிய காரியங்களுக்கு சிறந்த நேரம்', en: 'Best time for important work' });
  advice.push({ kind: 'info', ta: `ராகு காலத்தில் புதிய காரியங்களைத் தொடங்க வேண்டாம்; ${day.soolam.dir.ta} திசை பயணம் தவிர்க்கவும் (பரிகாரம்: ${day.soolam.remedy.ta}).`, en: `Don’t start new work in Rahu Kalam; avoid travel to the ${day.soolam.dir.en} (parigaram: ${day.soolam.remedy.en}).` });
  if (period.dasa) {
    const r = DASA_REMEDY[period.dasa.lord];
    advice.push({ kind: 'info', dasa: period, ta: `தசா பரிகாரம்: ${r.ta}`, en: `Dasa remedy: ${r.en}` });
  }
  advice.push({ kind: 'info', ta: day.worship.ta, en: day.worship.en });

  return { tara, house, chandra, chandrashtamam, period, verdict, advice };
}
