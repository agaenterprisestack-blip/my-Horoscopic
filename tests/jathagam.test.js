// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siderealLongitude, siderealAscendant, previousSunrise } from '../src/lib/astro.js';
import { computeJathagam, panchangamElements, nakshatraOf, navamsaOf, vimshottari, isChandrashtamam } from '../src/lib/jathagam.js';
import { localToUtc } from '../src/lib/time.js';

const CHENNAI = { name: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata' };

/** Bisection: first instant in [a, b] where pred becomes true. */
function crossing(a, b, pred) {
  let lo = a.getTime(), hi = b.getTime();
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (pred(new Date(mid))) hi = mid; else lo = mid;
  }
  return new Date(hi);
}
const minutesApart = (a, b) => Math.abs(a - b) / 60000;

test('Sun enters Mesham on Tamil New Year (14 Apr 2026, ~09:39 IST)', () => {
  const t = crossing(new Date('2026-04-10'), new Date('2026-04-18'), (d) => siderealLongitude('sun', d) < 30);
  assert.ok(minutesApart(t, new Date('2026-04-14T09:39+05:30')) < 30, t.toISOString());
});

test('Sun enters Magaram on Thai Pongal (14 Jan 2026)', () => {
  const t = crossing(new Date('2026-01-10'), new Date('2026-01-18'), (d) => siderealLongitude('sun', d) >= 270);
  assert.equal(new Date(t.getTime() + 5.5 * 3600e3).toISOString().slice(0, 10), '2026-01-14');
});

test('Full moon of 3 Mar 2026 eclipse is a Pournami', () => {
  const d = new Date('2026-03-03T11:33Z');
  const p = panchangamElements(siderealLongitude('sun', d), siderealLongitude('moon', d));
  assert.ok(p.thithiNum === 15 || p.thithiNum === 16);
});

test('Lagnam at sunrise is close to the Sun', () => {
  const rise = previousSunrise(new Date('2026-11-12T12:00Z'), CHENNAI.lat, CHENNAI.lon);
  const diff = Math.abs(siderealAscendant(rise, CHENNAI.lat, CHENNAI.lon) - siderealLongitude('sun', rise));
  assert.ok(diff < 2, `diff ${diff}`);
});

test('Rahu and Ketu are always opposite', () => {
  const d = new Date('1990-05-05T05:00Z');
  const diff = (siderealLongitude('ketu', d) - siderealLongitude('rahu', d) + 360) % 360;
  assert.ok(Math.abs(diff - 180) < 1e-6);
});

test('Nakshatra, padham and navamsa boundaries', () => {
  assert.equal(nakshatraOf(0).nakshatra.en, 'Aswini');
  assert.equal(nakshatraOf(0).padham, 1);
  assert.equal(nakshatraOf(13.34).nakshatra.en, 'Bharani');
  assert.equal(nakshatraOf(359.9).nakshatra.en, 'Revathi');
  assert.equal(nakshatraOf(359.9).padham, 4);
  assert.equal(navamsaOf(0), 0); // Mesham starts in Mesham
  assert.equal(navamsaOf(30), 9); // Rishabam starts in Magaram
  assert.equal(navamsaOf(359.9), 11); // Meenam ends in Meenam
});

test('Vimshottari dasas span exactly 120 years', () => {
  const birth = new Date('2000-01-01T00:00Z');
  const { dasas } = vimshottari(birth, 100);
  const years = (dasas[8].end - dasas[0].start) / (365.25 * 86400000);
  assert.ok(Math.abs(years - 120) < 1e-6);
  assert.ok(dasas[0].start <= birth && dasas[0].end > birth);
  // Bhuktis tile each dasa exactly.
  for (const d of dasas) assert.ok(Math.abs(d.bhuktis[8].end - d.end) < 1000);
});

test('Local time conversion honours historical IST (+6:30 in 1944)', () => {
  assert.equal(localToUtc('1944-06-01', '10:00', { tz: 'Asia/Kolkata' }).toISOString(), '1944-06-01T03:30:00.000Z');
  assert.equal(localToUtc('2000-01-01', '05:30', { tz: 'Asia/Kolkata' }).toISOString(), '2000-01-01T00:00:00.000Z');
  assert.equal(localToUtc('2000-01-01', '05:30', { utcOffset: 5.5 }).toISOString(), '2000-01-01T00:00:00.000Z');
});

test('Chandrashtamam is the 8th rasi', () => {
  assert.ok(isChandrashtamam(0, 7));
  assert.ok(isChandrashtamam(11, 6));
  assert.ok(!isChandrashtamam(0, 6));
});

test('Full Jathagam computes every field', () => {
  const birth = localToUtc('1995-08-15', '06:30', CHENNAI);
  const j = computeJathagam(birth, CHENNAI);
  assert.equal(j.planets.length, 9);
  for (const k of ['lagnam', 'rasi', 'nakshatra', 'thithi', 'yogam', 'karanam', 'weekday', 'tamilMonth']) assert.ok(j[k], k);
  assert.equal(j.tamilMonth.en, 'Aadi'); // Sun in sidereal Kadagam in mid-August
  assert.equal(j.weekday.en, 'Sevvai (Tuesday)'); // 15 Aug 1995 was a Tuesday, born after sunrise
});
