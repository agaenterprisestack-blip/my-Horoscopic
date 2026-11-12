// Converting a local birth date/time at a place into a UTC instant.

/** Offset (minutes, east positive) of an IANA zone at a given instant. */
export function tzOffsetMinutes(timeZone, date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = Object.fromEntries(fmt.formatToParts(date).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/**
 * Local wall-clock time → UTC Date.
 * @param {string} dateStr  "YYYY-MM-DD"
 * @param {string} timeStr  "HH:MM"
 * @param {{tz?: string, utcOffset?: number}} zone  IANA zone, or fixed offset in hours
 */
export function localToUtc(dateStr, timeStr, zone) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  if (!Number.isFinite(wall)) return null;

  if (zone.tz) {
    // Two passes handle instants near DST/offset changes.
    let utc = wall - tzOffsetMinutes(zone.tz, new Date(wall)) * 60000;
    utc = wall - tzOffsetMinutes(zone.tz, new Date(utc)) * 60000;
    return new Date(utc);
  }
  return new Date(wall - (zone.utcOffset ?? 0) * 3600000);
}

/** Offset in minutes for a place at a given instant. */
export const placeOffsetMinutes = (place, date) =>
  place.tz ? tzOffsetMinutes(place.tz, date) : Math.round((place.utcOffset ?? 0) * 60);

/** Format a UTC instant as local wall time at a place (for display). */
export function formatAtPlace(date, place, opts = {}) {
  const shifted = new Date(date.getTime() + placeOffsetMinutes(place, date) * 60000);
  return shifted.toLocaleString('en-IN', { timeZone: 'UTC', ...opts });
}

export const formatOffset = (minutes) => {
  const sign = minutes < 0 ? '-' : '+';
  const a = Math.abs(minutes);
  return `UTC${sign}${Math.floor(a / 60)}:${String(a % 60).padStart(2, '0')}`;
};
