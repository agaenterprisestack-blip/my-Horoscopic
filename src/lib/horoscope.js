// Deterministic daily Rasi Palan generator.
// The same rasi + date always produces the same reading, so a user sees a
// stable palan all day and a fresh one tomorrow — no backend needed.

import { RASIS } from '../data/jathagam.js';

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

const L = (ta, en) => ({ ta, en });

const OPENERS = [
  L('இன்று கிரகங்கள் உங்களுக்கு சாதகமாக உள்ளன.', 'The planets favor you today.'),
  L('சிந்தித்து செயல்பட வேண்டிய நாள்.', 'A day to think before you act.'),
  L('புதிய வாய்ப்புகள் உங்கள் கதவைத் தட்டும்.', 'New opportunities will knock at your door.'),
  L('மனதில் அமைதியும் தெளிவும் கூடும்.', 'Peace and clarity grow within you.'),
  L('எதிர்பாராத நல்ல செய்தி வரலாம்.', 'Unexpected good news may arrive.'),
  L('பொறுமையே இன்றைய வெற்றியின் ரகசியம்.', 'Patience is the secret of today’s success.'),
];

const LOVE = [
  L('குடும்பத்தில் மகிழ்ச்சி நிலவும்.', 'Happiness will prevail in the family.'),
  L('வாழ்க்கைத் துணையுடன் அன்பான உரையாடல் நெருக்கத்தை கூட்டும்.', 'A warm talk with your partner deepens your bond.'),
  L('உறவினர்களிடம் பொறுமையாக பேசுங்கள்.', 'Speak patiently with relatives.'),
  L('நண்பர்களின் ஆதரவு கிடைக்கும்.', 'Friends will offer their support.'),
];

const CAREER = [
  L('தொழிலில் முன்னேற்றம் காண்பீர்கள்.', 'You will see progress at work.'),
  L('பண வரவு திருப்திகரமாக இருக்கும்.', 'Income will be satisfying.'),
  L('புதிய முயற்சிகளை கவனமாக திட்டமிடுங்கள்.', 'Plan new ventures carefully.'),
  L('மேலதிகாரிகளின் பாராட்டு கிடைக்கும்.', 'Superiors will appreciate your work.'),
  L('தேவையற்ற செலவுகளைத் தவிர்க்கவும்.', 'Avoid unnecessary expenses.'),
];

const HEALTH = [
  L('உடல் நலனில் கவனம் தேவை.', 'Take care of your health.'),
  L('ஓய்வு எடுத்து மனதை புத்துணர்ச்சி பெறச் செய்யுங்கள்.', 'Rest and refresh your mind.'),
  L('ஆரோக்கியம் சிறப்பாக இருக்கும்.', 'Your health will be good.'),
  L('தியானம் மன அமைதி தரும்.', 'Meditation will bring peace of mind.'),
];

const DEITIES = [
  L('விநாயகர்', 'Lord Vinayagar'), L('முருகன்', 'Lord Murugan'), L('சிவபெருமான்', 'Lord Shiva'),
  L('பெருமாள்', 'Lord Perumal'), L('அம்மன்', 'Amman'), L('ஆஞ்சநேயர்', 'Lord Anjaneyar'),
  L('தட்சிணாமூர்த்தி', 'Dakshinamurthy'), L('மகாலட்சுமி', 'Goddess Mahalakshmi'),
];

const DIRECTIONS = [L('கிழக்கு', 'East'), L('மேற்கு', 'West'), L('வடக்கு', 'North'), L('தெற்கு', 'South')];

const COLORS = [
  { ta: 'மஞ்சள்', en: 'Yellow', hex: '#f5c542' },
  { ta: 'பச்சை', en: 'Green', hex: '#2ecc71' },
  { ta: 'நீலம்', en: 'Blue', hex: '#3f7bff' },
  { ta: 'சிவப்பு', en: 'Red', hex: '#e63950' },
  { ta: 'வெள்ளை', en: 'White', hex: '#f2f2f2' },
  { ta: 'ஆரஞ்சு', en: 'Orange', hex: '#ff7f50' },
  { ta: 'ரோஜா', en: 'Pink', hex: '#ff6fa3' },
];

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const rating = (rand) => 2 + Math.floor(rand() * 4); // 2–5 stars

export function getDailyPalan(rasiId, date = new Date()) {
  const rand = mulberry32(hashString(`${rasiId}|${dateKey(date)}`));
  const parts = [pick(rand, OPENERS), pick(rand, LOVE), pick(rand, CAREER), pick(rand, HEALTH)];
  return {
    text: { ta: parts.map((p) => p.ta).join(' '), en: parts.map((p) => p.en).join(' ') },
    deity: pick(rand, DEITIES),
    direction: pick(rand, DIRECTIONS),
    luckyNumber: 1 + Math.floor(rand() * 9),
    luckyColor: pick(rand, COLORS),
    favorable: pick(rand, RASIS.filter((r) => r.id !== rasiId)),
    ratings: { family: rating(rand), work: rating(rand), health: rating(rand) },
  };
}
