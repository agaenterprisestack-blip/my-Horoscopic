// Deterministic daily horoscope generator.
// The same sign + date always produces the same reading, so a user sees a
// stable horoscope all day and a fresh one tomorrow — no backend needed.

import { SIGNS } from '../data/signs.js';

/** Small, fast seeded PRNG (mulberry32). */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const OPENERS = [
  'The stars align in your favor today.',
  'A subtle shift in planetary energy invites reflection.',
  'The Moon’s glow illuminates a path you’ve overlooked.',
  'Cosmic currents are stirring something new within you.',
  'Today carries a quiet but powerful momentum.',
  'An unexpected planetary aspect brings fresh perspective.',
  'The universe is nudging you gently toward balance.',
  'Celestial winds blow warm and encouraging today.',
];

const FOCUS = {
  love: [
    'In matters of the heart, honesty opens doors that charm alone cannot.',
    'A meaningful conversation could deepen a bond you treasure.',
    'Let someone see a softer side of you — vulnerability is your strength today.',
    'Romance favors spontaneity; say yes to a small adventure.',
    'Old feelings may resurface — greet them with kindness, not judgment.',
    'Give your affection freely, and it returns to you multiplied.',
  ],
  career: [
    'At work, a bold idea deserves to be spoken aloud.',
    'Patience with a slow-moving project will pay off sooner than you think.',
    'Collaboration beats competition today — seek an ally.',
    'Your attention to detail catches something others missed.',
    'A small risk in your professional life could lead to big rewards.',
    'Organize before you act; clarity will multiply your efforts.',
  ],
  wellness: [
    'Make time to rest — your energy is a resource worth protecting.',
    'Movement clears your mind; a walk could spark inspiration.',
    'Hydrate, breathe deeply, and let go of what you can’t control.',
    'Your intuition is especially sharp — trust your gut.',
    'Creative expression will restore your spirit tonight.',
    'Step away from screens for a while and reconnect with yourself.',
  ],
};

const ADVICE = [
  'Trust the timing of your life.',
  'Small steps still move you forward.',
  'Say what you mean, gently.',
  'Let curiosity lead the way.',
  'Protect your peace without apology.',
  'Celebrate a win, however small.',
  'Listen more than you speak today.',
  'Release what no longer serves you.',
];

const MOODS = ['Inspired', 'Calm', 'Playful', 'Focused', 'Romantic', 'Reflective', 'Confident', 'Adventurous', 'Grateful'];

const COLORS = [
  { name: 'Gold', hex: '#f5c542' },
  { name: 'Emerald', hex: '#2ecc71' },
  { name: 'Sapphire', hex: '#3f7bff' },
  { name: 'Rose', hex: '#ff6fa3' },
  { name: 'Amethyst', hex: '#a46bff' },
  { name: 'Coral', hex: '#ff7f50' },
  { name: 'Silver', hex: '#c9d1d9' },
  { name: 'Turquoise', hex: '#30d5c8' },
  { name: 'Crimson', hex: '#e63950' },
];

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const rating = (rand) => 2 + Math.floor(rand() * 4); // 2–5 stars

export function getDailyHoroscope(signId, date = new Date()) {
  const key = dateKey(date);
  const rand = mulberry32(hashString(`${signId}|${key}`));

  const others = SIGNS.filter((s) => s.id !== signId);

  return {
    date: key,
    text: [pick(rand, OPENERS), pick(rand, FOCUS.love), pick(rand, FOCUS.career), pick(rand, FOCUS.wellness)].join(' '),
    advice: pick(rand, ADVICE),
    mood: pick(rand, MOODS),
    luckyNumber: 1 + Math.floor(rand() * 99),
    luckyColor: pick(rand, COLORS),
    luckyTime: `${1 + Math.floor(rand() * 12)}:${pick(rand, ['00', '15', '30', '45'])} ${rand() < 0.5 ? 'AM' : 'PM'}`,
    compatibility: pick(rand, others),
    ratings: { love: rating(rand), career: rating(rand), wellness: rating(rand) },
  };
}
