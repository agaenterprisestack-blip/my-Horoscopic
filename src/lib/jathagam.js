// Builds a full Tamil Jathagam from a birth instant and place.

import {
  RASIS, PLANETS, NAKSHATRAS, DASA_ORDER, DASA_YEARS,
  THITHIS, POURNAMI, AMAVASAI, PAKSHAS, YOGAS,
  KARANAS_MOVABLE, KARANAS_FIXED, WEEKDAYS, TAMIL_MONTHS,
} from '../data/jathagam.js';
import { siderealLongitude, siderealAscendant, isRetrograde, previousSunrise, ayanamsa } from './astro.js';
import { placeOffsetMinutes } from './time.js';

const NAK_SPAN = 360 / 27; // 13°20'
const PADHAM_SPAN = NAK_SPAN / 4; // 3°20'
const YEAR_MS = 365.25 * 86400000;

export const rasiOf = (lon) => Math.floor(lon / 30);
export const navamsaOf = (lon) => Math.floor(lon / PADHAM_SPAN) % 12;

export function nakshatraOf(lon) {
  const idx = Math.floor(lon / NAK_SPAN);
  return {
    nakshatra: NAKSHATRAS[idx],
    padham: Math.floor((lon % NAK_SPAN) / PADHAM_SPAN) + 1,
    fraction: (lon % NAK_SPAN) / NAK_SPAN, // portion already traversed
  };
}

/** Degrees within the sign as  D°M'. */
export function formatDegree(lon) {
  const inSign = lon % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  return `${d}°${String(m).padStart(2, '0')}'`;
}

/** Placement details for one longitude. */
function placement(lon) {
  return { longitude: lon, rasi: RASIS[rasiOf(lon)], navamsa: RASIS[navamsaOf(lon)], ...nakshatraOf(lon) };
}

/** Thithi, Yogam, Karanam from sidereal Sun & Moon longitudes. */
export function panchangamElements(sunLon, moonLon) {
  const elong = (moonLon - sunLon + 360) % 360;
  const thithiNum = Math.floor(elong / 12) + 1; // 1..30
  const paksha = thithiNum <= 15 ? PAKSHAS[0] : PAKSHAS[1];
  const n = ((thithiNum - 1) % 15) + 1;
  const thithi = n === 15 ? (thithiNum === 15 ? POURNAMI : AMAVASAI) : THITHIS[n - 1];

  const yogam = YOGAS[Math.floor(((sunLon + moonLon) % 360) / NAK_SPAN)];

  const k = Math.floor(elong / 6); // 0..59 half-thithis
  const karanam =
    k === 0 ? KARANAS_FIXED.kimstughna
    : k === 57 ? KARANAS_FIXED.shakuni
    : k === 58 ? KARANAS_FIXED.chatushpada
    : k === 59 ? KARANAS_FIXED.naga
    : KARANAS_MOVABLE[(k - 1) % 7];

  return { thithiNum, thithi, paksha, yogam, karanam };
}

/** Vedic weekday: the day changes at sunrise, not midnight. */
function vedicWeekday(date, place) {
  const rise = previousSunrise(date, place.lat, place.lon) ?? date;
  const local = new Date(rise.getTime() + placeOffsetMinutes(place, rise) * 60000);
  return WEEKDAYS[local.getUTCDay()];
}

/** Vimshottari dasa periods with bhukti (sub-periods). */
export function vimshottari(birth, moonLon) {
  const { nakshatra, fraction } = nakshatraOf(moonLon);
  const startIdx = DASA_ORDER.indexOf(nakshatra.lord);
  // The first dasa began before birth: back-date it by the elapsed portion.
  let cursor = birth.getTime() - fraction * DASA_YEARS[nakshatra.lord] * YEAR_MS;

  const dasas = [];
  for (let i = 0; i < 9; i++) {
    const lord = DASA_ORDER[(startIdx + i) % 9];
    const years = DASA_YEARS[lord];
    const start = cursor;
    const end = start + years * YEAR_MS;

    const bhuktis = [];
    let b = start;
    for (let j = 0; j < 9; j++) {
      const sub = DASA_ORDER[(DASA_ORDER.indexOf(lord) + j) % 9];
      const len = ((years * DASA_YEARS[sub]) / 120) * YEAR_MS;
      bhuktis.push({ lord: sub, start: new Date(b), end: new Date(b + len) });
      b += len;
    }
    dasas.push({ lord, years, start: new Date(start), end: new Date(end), bhuktis });
    cursor = end;
  }

  const balanceYears = (1 - fraction) * DASA_YEARS[nakshatra.lord];
  return { dasas, balance: { lord: nakshatra.lord, ...splitYears(balanceYears) } };
}

export function splitYears(y) {
  const years = Math.floor(y);
  const monthsF = (y - years) * 12;
  const months = Math.floor(monthsF);
  const days = Math.floor((monthsF - months) * 30.4375);
  return { years, months, days };
}

/** Current dasa & bhukti for a given moment. */
export function currentPeriod(dasaInfo, at = new Date()) {
  const dasa = dasaInfo.dasas.find((d) => at >= d.start && at < d.end);
  const bhukti = dasa?.bhuktis.find((b) => at >= b.start && at < b.end);
  return { dasa, bhukti };
}

/** House number (1–12) of a rasi counted from a reference rasi. */
export const houseFrom = (fromRasi, rasi) => ((rasi - fromRasi + 12) % 12) + 1;

/** Basic Chevvai (Mars) dosham check: Mars in 2, 4, 7, 8 or 12 from Lagnam or Moon. */
function chevvaiDosham(lagnaRasi, moonRasi, marsRasi) {
  const DOSHA_HOUSES = [2, 4, 7, 8, 12];
  const fromLagnam = houseFrom(lagnaRasi, marsRasi);
  const fromMoon = houseFrom(moonRasi, marsRasi);
  return {
    fromLagnam, fromMoon,
    lagnam: DOSHA_HOUSES.includes(fromLagnam),
    moon: DOSHA_HOUSES.includes(fromMoon),
  };
}

/**
 * Compute a full Jathagam.
 * @param {Date} birth   birth instant (UTC)
 * @param {{lat:number, lon:number, tz?:string, utcOffset?:number}} place
 */
export function computeJathagam(birth, place) {
  const planets = PLANETS.map((p) => {
    const lon = siderealLongitude(p.id, birth);
    return { ...p, ...placement(lon), retro: isRetrograde(p.id, birth) };
  });
  const byId = Object.fromEntries(planets.map((p) => [p.id, p]));

  const lagnam = placement(siderealAscendant(birth, place.lat, place.lon));
  const moon = byId.moon;
  const sun = byId.sun;

  return {
    birth,
    place,
    ayanamsa: ayanamsa(birth),
    lagnam,
    planets,
    rasi: moon.rasi,
    nakshatra: moon.nakshatra,
    padham: moon.padham,
    tamilMonth: TAMIL_MONTHS[sun.rasi.id],
    weekday: vedicWeekday(birth, place),
    ...panchangamElements(sun.longitude, moon.longitude),
    dasa: vimshottari(birth, moon.longitude),
    chevvai: chevvaiDosham(lagnam.rasi.id, moon.rasi.id, byId.mars.rasi.id),
  };
}

/** Today's panchangam & Moon transit (for daily palan). */
export function todayAt(place, date = new Date()) {
  const sunLon = siderealLongitude('sun', date);
  const moonLon = siderealLongitude('moon', date);
  return {
    moonRasi: RASIS[rasiOf(moonLon)],
    ...nakshatraOf(moonLon),
    tamilMonth: TAMIL_MONTHS[rasiOf(sunLon)],
    weekday: vedicWeekday(date, place),
    ...panchangamElements(sunLon, moonLon),
  };
}

/**
 * Chandrashtamam: the Moon transiting the 8th rasi from one's birth rasi —
 * traditionally a day to avoid new ventures.
 */
export const isChandrashtamam = (birthRasiId, moonRasiId) => houseFrom(birthRasiId, moonRasiId) === 8;

/**
 * How close is the chart to a boundary? Checks whether the Lagnam rasi or the
 * Moon's natchathiram would change if the birth time were a little earlier or
 * later (birth-time error, or a different birth town, has the same effect).
 * Returns null for each item that is safe within the window.
 */
export function boundaryCheck(birth, place) {
  const scan = (valueAt, maxMin, step) => {
    const now = valueAt(birth);
    const find = (dir) => {
      for (let m = step; m <= maxMin; m += step) {
        const v = valueAt(new Date(birth.getTime() + dir * m * 60000));
        if (v !== now) return { minutes: m, value: v };
      }
      return null;
    };
    const earlier = find(-1);
    const later = find(+1);
    return earlier || later ? { earlier, later } : null;
  };

  const lagna = scan((d) => rasiOf(siderealAscendant(d, place.lat, place.lon)), 15, 1);
  const star = scan((d) => nakshatraOf(siderealLongitude('moon', d)).nakshatra.id, 60, 5);
  return {
    lagnam: lagna && {
      earlier: lagna.earlier && { minutes: lagna.earlier.minutes, rasi: RASIS[lagna.earlier.value] },
      later: lagna.later && { minutes: lagna.later.minutes, rasi: RASIS[lagna.later.value] },
    },
    nakshatra: star && {
      earlier: star.earlier && { minutes: star.earlier.minutes, nakshatra: NAKSHATRAS[star.earlier.value] },
      later: star.later && { minutes: star.later.minutes, nakshatra: NAKSHATRAS[star.later.value] },
    },
  };
}
