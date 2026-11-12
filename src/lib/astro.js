// Astronomical core: sidereal (Lahiri / Chitrapaksha) positions of the
// Navagraha and the Lagnam, computed with astronomy-engine.

import * as A from 'astronomy-engine';

const norm = (deg) => ((deg % 360) + 360) % 360;
const RAD = Math.PI / 180;

/** Julian centuries (TT) since J2000 for an AstroTime. */
const centuries = (t) => t.tt / 36525;

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees — the Indian government standard.
 * 23°51'25.5" at J2000, advancing with general precession in longitude.
 */
export function ayanamsa(date) {
  const T = centuries(A.MakeTime(date));
  return 23.857092 + (5029.0966 * T + 1.11113 * T * T) / 3600;
}

/** Tropical ecliptic longitude (true equinox of date) of a body. */
function tropicalLongitude(id, t) {
  switch (id) {
    case 'sun':
      return A.SunPosition(t).elon;
    case 'moon':
      return A.EclipticGeoMoon(t).lon;
    case 'rahu':
    case 'ketu': {
      // Mean lunar node (Meeus, ch. 47) — the convention most Tamil panchangams use.
      const T = centuries(t);
      const node = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441 - (T ** 4) / 60616000;
      return norm(id === 'rahu' ? node : node + 180);
    }
    default: {
      const body = { mars: A.Body.Mars, mercury: A.Body.Mercury, jupiter: A.Body.Jupiter, venus: A.Body.Venus, saturn: A.Body.Saturn }[id];
      return A.Ecliptic(A.GeoVector(body, t, true)).elon;
    }
  }
}

/** Sidereal longitude (0–360°) of a planet id at a JS Date. */
export function siderealLongitude(id, date) {
  return norm(tropicalLongitude(id, A.MakeTime(date)) - ayanamsa(date));
}

/** True if the planet is moving backwards (vakram) at this instant. */
export function isRetrograde(id, date) {
  if (id === 'sun' || id === 'moon') return false;
  if (id === 'rahu' || id === 'ketu') return true; // nodes always move backwards
  const t = A.MakeTime(date);
  const before = tropicalLongitude(id, t.AddDays(-0.5));
  const after = tropicalLongitude(id, t.AddDays(0.5));
  return norm(after - before + 180) - 180 < 0;
}

/** Sidereal Lagnam (ascendant) longitude for a place. */
export function siderealAscendant(date, lat, lon) {
  const t = A.MakeTime(date);
  const T = centuries(t);
  const ramc = norm(A.SiderealTime(t) * 15 + lon) * RAD;
  const eps = (23.4392911 - 0.0130042 * T) * RAD;
  const phi = lat * RAD;
  const asc = Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)));
  return norm(asc / RAD - ayanamsa(date));
}

/** Most recent sunrise at or before `date` (null in polar day/night). */
export function previousSunrise(date, lat, lon) {
  const observer = new A.Observer(lat, lon, 0);
  let rise = A.SearchRiseSet(A.Body.Sun, observer, +1, A.MakeTime(new Date(date.getTime() - 1.5 * 86400000)), 1.5);
  if (!rise) return null;
  for (;;) {
    const next = A.SearchRiseSet(A.Body.Sun, observer, +1, rise.AddDays(0.01), 1.2);
    if (!next || next.date > date) return rise.date;
    rise = next;
  }
}

/** Sunrise and sunset on the local day containing `date`. */
export function sunTimes(date, lat, lon) {
  const observer = new A.Observer(lat, lon, 0);
  const rise = previousSunrise(date, lat, lon);
  if (!rise) return null;
  const set = A.SearchRiseSet(A.Body.Sun, observer, -1, A.MakeTime(rise), 1);
  return { sunrise: rise, sunset: set?.date ?? null };
}
