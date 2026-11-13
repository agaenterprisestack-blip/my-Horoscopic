// Tables for Thirumana Porutham (Tamil marriage matching).
// Natchathiram ids: 0 Aswini … 26 Revathi. Rasi ids: 0 Mesham … 11 Meenam.
// Rules and tables vary slightly between regional almanacs; these are the
// most common versions.

const L = (ta, en) => ({ ta, en });

/** Ganam per natchathiram: D = Deva, M = Manushya, R = Rakshasa. */
export const GANA = 'DMRMDMDDRRMMDRDRDRRMMDRRMMD'.split('');
export const GANA_NAMES = {
  D: L('தேவ கணம்', 'Deva'),
  M: L('மனுஷ்ய கணம்', 'Manushya'),
  R: L('ராட்சஸ கணம்', 'Rakshasa'),
};

/** Yoni animal per natchathiram. */
export const YONI = [
  'horse', 'elephant', 'goat', 'serpent', 'serpent', 'dog', 'cat', 'goat', 'cat',
  'rat', 'rat', 'cow', 'buffalo', 'tiger', 'buffalo', 'tiger', 'deer', 'deer',
  'dog', 'monkey', 'mongoose', 'monkey', 'lion', 'horse', 'lion', 'cow', 'elephant',
];
export const YONI_NAMES = {
  horse: L('குதிரை', 'Horse'), elephant: L('யானை', 'Elephant'), goat: L('ஆடு', 'Goat'),
  serpent: L('பாம்பு', 'Serpent'), dog: L('நாய்', 'Dog'), cat: L('பூனை', 'Cat'),
  rat: L('எலி', 'Rat'), cow: L('பசு', 'Cow'), buffalo: L('எருமை', 'Buffalo'),
  tiger: L('புலி', 'Tiger'), deer: L('மான்', 'Deer'), monkey: L('குரங்கு', 'Monkey'),
  mongoose: L('கீரி', 'Mongoose'), lion: L('சிங்கம்', 'Lion'),
};
/** Hostile yoni pairs. */
export const YONI_ENEMIES = [
  ['horse', 'buffalo'], ['elephant', 'lion'], ['goat', 'monkey'], ['serpent', 'mongoose'],
  ['dog', 'deer'], ['cat', 'rat'], ['cow', 'tiger'],
];

/** Rajju group per natchathiram (repeats every 9 stars). */
const RAJJU_CYCLE = ['pada', 'kati', 'udara', 'kanta', 'siro', 'kanta', 'udara', 'kati', 'pada'];
export const RAJJU = Array.from({ length: 27 }, (_, i) => RAJJU_CYCLE[i % 9]);
export const RAJJU_NAMES = {
  siro: L('சிரசு ரஜ்ஜு', 'Siro (head)'),
  kanta: L('கண்ட ரஜ்ஜு', 'Kanta (neck)'),
  udara: L('உதர ரஜ்ஜு', 'Udara (navel)'),
  kati: L('கடி ரஜ்ஜு', 'Kati (waist)'),
  pada: L('பாத ரஜ்ஜு', 'Pada (feet)'),
};
/** Traditional effect when both stars share a rajju. */
export const RAJJU_EFFECT = {
  siro: L('கணவரின் ஆயுளுக்கு கேடு என்பது ஐதீகம்', 'traditionally said to affect the husband’s longevity'),
  kanta: L('மனைவியின் ஆயுளுக்கு கேடு என்பது ஐதீகம்', 'traditionally said to affect the wife’s longevity'),
  udara: L('குழந்தை பாக்கியத்திற்கு தடை என்பது ஐதீகம்', 'traditionally said to affect children'),
  kati: L('வறுமை என்பது ஐதீகம்', 'traditionally said to bring poverty'),
  pada: L('அலைச்சல், பிரிவு என்பது ஐதீகம்', 'traditionally said to bring wandering and separation'),
};

/** Vedhai: pairs of stars that afflict each other. */
export const VEDHAI_PAIRS = [
  [0, 17], [1, 16], [2, 15], [3, 14], [5, 21], [6, 20], [7, 19], [8, 18],
  [9, 26], [10, 25], [11, 24], [12, 23], [4, 13], [4, 22], [13, 22],
];

/** Vasya: rasis attracted to each rasi. */
export const VASYA = {
  0: [4, 7], 1: [3, 6], 2: [5], 3: [7, 8], 4: [9], 5: [1, 11],
  6: [9], 7: [3, 5], 8: [11], 9: [0, 10], 10: [0], 11: [9],
};

/** Natural planetary friendships (naisargika maitri). */
export const FRIENDS = {
  sun: { f: ['moon', 'mars', 'jupiter'], e: ['venus', 'saturn'] },
  moon: { f: ['sun', 'mercury'], e: [] },
  mars: { f: ['sun', 'moon', 'jupiter'], e: ['mercury'] },
  mercury: { f: ['sun', 'venus'], e: ['moon'] },
  jupiter: { f: ['sun', 'moon', 'mars'], e: ['mercury', 'venus'] },
  venus: { f: ['mercury', 'saturn'], e: ['sun', 'moon'] },
  saturn: { f: ['mercury', 'venus'], e: ['sun', 'moon', 'mars'] },
};

/** The 10 poruthams in traditional order, with what each signifies. */
export const PORUTHAMS = [
  { id: 'dina', ...L('தின பொருத்தம்', 'Dina'), about: L('ஆரோக்கியம், நீண்ட ஆயுள்', 'Health and long life together') },
  { id: 'gana', ...L('கண பொருத்தம்', 'Gana'), about: L('குணம், மனப்பொருத்தம்', 'Temperament and harmony') },
  { id: 'mahendra', ...L('மகேந்திர பொருத்தம்', 'Mahendra'), about: L('குழந்தை பாக்கியம், செல்வம்', 'Children and prosperity') },
  { id: 'sthree', ...L('ஸ்திரீ தீர்க்க பொருத்தம்', 'Sthree Dheerga'), about: L('மனைவியின் நலம், செழிப்பு', 'Wife’s well-being and prosperity') },
  { id: 'yoni', ...L('யோனி பொருத்தம்', 'Yoni'), about: L('உடல் ஈர்ப்பு, தாம்பத்யம்', 'Physical and intimate compatibility') },
  { id: 'rasi', ...L('ராசி பொருத்தம்', 'Rasi'), about: L('வம்ச விருத்தி, ஒற்றுமை', 'Family growth and unity') },
  { id: 'rasiAdhipathi', ...L('ராசி அதிபதி பொருத்தம்', 'Rasi Adhipathi'), about: L('இரு குடும்ப ஒற்றுமை', 'Harmony between the families') },
  { id: 'vasya', ...L('வசிய பொருத்தம்', 'Vasya'), about: L('பரஸ்பர ஈர்ப்பு, அன்பு', 'Mutual attraction and affection') },
  { id: 'rajju', ...L('ரஜ்ஜு பொருத்தம்', 'Rajju'), about: L('மாங்கல்ய பலம் — மிக முக்கியம்', 'Strength of the marriage bond — most important'), critical: true },
  { id: 'vedhai', ...L('வேதை பொருத்தம்', 'Vedhai'), about: L('துன்பங்கள் இல்லாமை', 'Freedom from afflictions'), critical: true },
];

export const BENEFICS = ['jupiter', 'venus', 'mercury', 'moon'];
export const MALEFICS = ['saturn', 'mars', 'rahu', 'ketu', 'sun'];
