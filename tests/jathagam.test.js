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

// ---------- Daily calendar (verified against drikpanchang.com, New Delhi, 13 Nov 2026) ----------
import { computeDay, personalDay } from '../src/lib/daily.js';

const DELHI = { name: 'New Delhi', lat: 28.6139, lon: 77.209, tz: 'Asia/Kolkata' };

test('Daily calendar matches Drik Panchang (New Delhi, 13 Nov 2026)', () => {
  const d = computeDay('2026-11-13', DELHI);
  assert.equal(d.weekday.en, 'Velli (Friday)');
  assert.ok(minutesApart(d.sunrise, new Date('2026-11-13T06:42+05:30')) <= 1.5);
  assert.ok(minutesApart(d.sunset, new Date('2026-11-13T17:28+05:30')) <= 1.5);
  assert.deepEqual(d.gowri.map((g) => g.key), ['sugam', 'soram', 'uthi', 'visham', 'amirdha', 'rogam', 'laabam', 'dhanam']);
  assert.ok(minutesApart(d.rahu.start, new Date('2026-11-13T10:44+05:30')) <= 1.5);
  assert.ok(minutesApart(d.yama.start, new Date('2026-11-13T14:47+05:30')) <= 1.5);
  assert.ok(minutesApart(d.kuligai.start, new Date('2026-11-13T08:03+05:30')) <= 1.5);
  assert.equal(d.thithi.en, 'Chathurthi');
  assert.ok(minutesApart(d.thithiEnds, new Date('2026-11-13T20:42+05:30')) <= 1.5);
  assert.equal(d.nakshatra.en, 'Moolam');
  assert.ok(minutesApart(d.starEnds, new Date('2026-11-13T17:17+05:30')) <= 1.5);
  assert.equal(d.yogam.en, 'Dhruthi');
  // Nalla Neram excludes Rahu Kalam and Yamagandam slots.
  assert.ok(d.nallaNeram.every((g) => g.quality !== 'bad' && g.n !== d.rahu.n && g.n !== d.yama.n));
});

test('Personal day: Chandrashtamam and tara counting', () => {
  const d = computeDay('2026-11-13', DELHI); // Moon in Dhanusu, star Moolam
  const fake = (rasiId, starId) => ({
    rasi: { id: rasiId }, nakshatra: { id: starId },
    dasa: { dasas: [] },
  });
  // Moon in Dhanusu (8) is the 8th from Rishabam (1).
  assert.ok(personalDay(d, fake(1, 3)).chandrashtamam);
  assert.equal(personalDay(d, fake(8, 18)).tara.en, 'Janma'); // born in Moolam
  assert.equal(personalDay(d, fake(8, 17)).tara.en, 'Sampat'); // born in Kettai
});

// ---------- Places & boundary warnings ----------
import { searchPlaces, findPlace, PLACES } from '../src/data/places.js';
import { boundaryCheck } from '../src/lib/jathagam.js';

test('Place search: names, nicknames and districts', () => {
  assert.ok(PLACES.length > 1000);
  assert.equal(searchPlaces('Trichy')[0].name, 'Tiruchirappalli');
  assert.equal(searchPlaces('kovai')[0].name, 'Coimbatore');
  assert.equal(searchPlaces('Pondicherry')[0].name, 'Puducherry');
  assert.equal(searchPlaces('ooty')[0].name, 'Ooty');
  assert.equal(searchPlaces('kodaik')[0].name, 'Kodaikanal');
  assert.ok(searchPlaces('Rameswaram')[0].region === 'Ramanathapuram');
  assert.equal(findPlace('Chennai').name, 'Chennai'); // old saved profiles still resolve
  assert.equal(searchPlaces('').length, 0);
});

test('Boundary check flags a Lagnam about to change', () => {
  const chennai = findPlace('Chennai');
  // Far from any boundary: Simmam ~12°.
  assert.equal(boundaryCheck(localToUtc('1995-08-15', '07:00', chennai), chennai).lagnam, null);
  // Find an instant just after Lagnam changes, then confirm it is flagged.
  const t0 = localToUtc('1995-08-15', '06:00', chennai);
  const changeAt = crossing(t0, new Date(t0.getTime() + 3 * 3600e3), (d) => Math.floor(siderealAscendant(d, chennai.lat, chennai.lon) / 30) === 4);
  const b = boundaryCheck(new Date(changeAt.getTime() + 2 * 60000), chennai);
  assert.ok(b.lagnam?.earlier && b.lagnam.earlier.minutes <= 3);
  assert.equal(b.lagnam.earlier.rasi.en, 'Kadagam');
});

// ---------- Porutham ----------
import { matchPoruthams, marriageScore, rasiFromStar, santhanaIndicators, coupleSanthana } from '../src/lib/porutham.js';
import { RAJJU, GANA, VEDHAI_PAIRS } from '../src/data/porutham.js';
import { NAKSHATRAS } from '../src/data/jathagam.js';

const star = (en) => NAKSHATRAS.findIndex((n) => n.en === en);
const person = (en, padham = 1) => ({ star: star(en), rasi: rasiFromStar(star(en), padham) });

test('Rajju groups match the published table', () => {
  const group = (names) => names.map((n) => RAJJU[star(n)]);
  assert.deepEqual(new Set(group(['Mirugasirisham', 'Chithirai', 'Avittam'])), new Set(['siro']));
  assert.deepEqual(new Set(group(['Rohini', 'Thiruvathirai', 'Hastham', 'Swathi', 'Thiruvonam', 'Sathayam'])), new Set(['kanta']));
  assert.deepEqual(new Set(group(['Karthigai', 'Punarpoosam', 'Uthiram', 'Visakam', 'Uthiradam', 'Poorattathi'])), new Set(['udara']));
  assert.deepEqual(new Set(group(['Bharani', 'Poosam', 'Pooram', 'Anusham', 'Pooradam', 'Uthirattathi'])), new Set(['kati']));
  assert.deepEqual(new Set(group(['Aswini', 'Ayilyam', 'Magam', 'Kettai', 'Moolam', 'Revathi'])), new Set(['pada']));
});

test('Gana: 9 stars in each group', () => {
  for (const g of ['D', 'M', 'R']) assert.equal(GANA.filter((x) => x === g).length, 9);
  assert.equal(VEDHAI_PAIRS.length, 15);
});

test('Rasi from star + padham', () => {
  assert.equal(rasiFromStar(star('Aswini'), 1), 0);
  assert.equal(rasiFromStar(star('Karthigai'), 1), 0); // Karthigai 1 → Mesham
  assert.equal(rasiFromStar(star('Karthigai'), 2), 1); // Karthigai 2–4 → Rishabam
  assert.equal(rasiFromStar(star('Revathi'), 4), 11);
});

test('Rajju failure caps the match and is not recommended', () => {
  const m = matchPoruthams(person('Aswini'), person('Magam')); // both Pada rajju
  const s = marriageScore(m);
  assert.equal(m.items.find((i) => i.id === 'rajju').score, 0);
  assert.ok(s.percent <= 40);
  assert.equal(s.verdict, 'notRecommended');
});

test('Vedhai pair is detected both ways', () => {
  for (const [b, g] of [['Aswini', 'Kettai'], ['Kettai', 'Aswini']]) {
    assert.equal(matchPoruthams(person(b), person(g)).items.find((i) => i.id === 'vedhai').score, 0);
  }
});

test('Mahendra and Dina counts', () => {
  const m = matchPoruthams(person('Aswini'), person('Rohini')); // count 4
  assert.equal(m.starCount, 4);
  assert.equal(m.items.find((i) => i.id === 'mahendra').score, 1);
  assert.equal(m.items.find((i) => i.id === 'dina').score, 1); // 4 % 9 = 4
});

test('Percent and santhana are bounded', () => {
  const birthB = computeJathagam(localToUtc('1996-03-10', '09:15', CHENNAI), CHENNAI);
  const birthG = computeJathagam(localToUtc('1992-11-02', '18:40', CHENNAI), CHENNAI);
  const m = matchPoruthams({ star: birthB.nakshatra.id, rasi: birthB.rasi.id }, { star: birthG.nakshatra.id, rasi: birthG.rasi.id });
  const s = marriageScore(m, [birthB.chevvai.lagnam || birthB.chevvai.moon, birthG.chevvai.lagnam || birthG.chevvai.moon]);
  assert.ok(s.percent >= 0 && s.percent <= 100);
  const sb = santhanaIndicators(birthB), sg = santhanaIndicators(birthG);
  for (const x of [sb, sg]) assert.ok(x.percent >= 20 && x.percent <= 95);
  const c = coupleSanthana(m, sb, sg);
  assert.ok(c.percent >= 0 && c.percent <= 100 && !c.partial);
});

test('Star-only santhana stays within 30–80%', () => {
  for (const [b, g] of [['Rohini', 'Magam'], ['Aswini', 'Magam'], ['Aswini', 'Rohini']]) {
    const c = coupleSanthana(matchPoruthams(person(b), person(g)), null, null);
    assert.ok(c.partial && c.percent >= 30 && c.percent <= 80, `${b}-${g}: ${c.percent}`);
  }
});
