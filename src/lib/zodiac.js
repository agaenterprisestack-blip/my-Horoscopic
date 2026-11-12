import { SIGNS } from '../data/signs.js';

/** Return the zodiac sign for a given month (1-12) and day. */
export function signFromMonthDay(month, day) {
  const md = month * 100 + day;
  return SIGNS.find(({ start, end }) => {
    const s = start[0] * 100 + start[1];
    const e = end[0] * 100 + end[1];
    // Capricorn wraps around the new year.
    return s <= e ? md >= s && md <= e : md >= s || md <= e;
  });
}

/** Parse a "YYYY-MM-DD" string (from <input type="date">) to a sign. */
export function signFromDateString(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!m) return null;
  return signFromMonthDay(Number(m[2]), Number(m[3])) ?? null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatRange = ({ start, end }) =>
  `${MONTHS[start[0] - 1]} ${start[1]} – ${MONTHS[end[0] - 1]} ${end[1]}`;
