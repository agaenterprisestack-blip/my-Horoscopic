// Reference tables for the daily Tamil calendar (நாள் காட்டி).
// Weekday index: 0 = Sunday … 6 = Saturday.

const L = (ta, en) => ({ ta, en });

/** Gowri Panchangam period names and their nature. */
export const GOWRI = {
  amirdha: { ...L('அமிர்தம்', 'Amirdham'), quality: 'best' },
  uthi: { ...L('உத்தி', 'Uthi'), quality: 'good' },
  laabam: { ...L('லாபம்', 'Laabam'), quality: 'good' },
  dhanam: { ...L('தனம்', 'Dhanam'), quality: 'good' },
  sugam: { ...L('சுகம்', 'Sugam'), quality: 'good' },
  rogam: { ...L('ரோகம்', 'Rogam'), quality: 'bad' },
  soram: { ...L('சோரம்', 'Soram'), quality: 'bad' },
  visham: { ...L('விஷம்', 'Visham'), quality: 'bad' },
};

/**
 * Daytime Gowri sequence (sunrise → sunset, 8 equal parts) per weekday.
 * Source: Pambu Panchangam table as published by Drik Panchang
 * (verified against drikpanchang.com for 8–14 Nov 2026).
 */
export const GOWRI_DAY = [
  ['uthi', 'amirdha', 'rogam', 'laabam', 'dhanam', 'sugam', 'soram', 'visham'], // Sun
  ['amirdha', 'visham', 'rogam', 'laabam', 'dhanam', 'sugam', 'soram', 'uthi'], // Mon
  ['rogam', 'laabam', 'dhanam', 'sugam', 'soram', 'uthi', 'visham', 'amirdha'], // Tue
  ['laabam', 'dhanam', 'sugam', 'soram', 'visham', 'uthi', 'amirdha', 'rogam'], // Wed
  ['dhanam', 'sugam', 'soram', 'uthi', 'amirdha', 'visham', 'rogam', 'laabam'], // Thu
  ['sugam', 'soram', 'uthi', 'visham', 'amirdha', 'rogam', 'laabam', 'dhanam'], // Fri
  ['soram', 'uthi', 'visham', 'amirdha', 'rogam', 'laabam', 'dhanam', 'sugam'], // Sat
];

/** Which eighth of the daytime (1–8) is Rahu Kalam / Yamagandam / Kuligai. */
export const RAHU_SLOT = [8, 2, 7, 5, 6, 4, 3];
export const YAMA_SLOT = [5, 4, 3, 2, 1, 7, 6];
export const KULIGAI_SLOT = [7, 6, 5, 4, 3, 2, 1];

/** Soolam — direction to avoid travelling, and its parigaram (remedy). */
export const SOOLAM = [
  { dir: L('மேற்கு', 'West'), remedy: L('வெல்லம்', 'Jaggery') },
  { dir: L('கிழக்கு', 'East'), remedy: L('தயிர்', 'Curd') },
  { dir: L('வடக்கு', 'North'), remedy: L('பால்', 'Milk') },
  { dir: L('வடக்கு', 'North'), remedy: L('பால்', 'Milk') },
  { dir: L('தெற்கு', 'South'), remedy: L('தைலம்', 'Oil') },
  { dir: L('மேற்கு', 'West'), remedy: L('வெல்லம்', 'Jaggery') },
  { dir: L('கிழக்கு', 'East'), remedy: L('தைலம்', 'Oil') },
];

/** Weekday ruling planet and traditional worship. */
export const WEEKDAY_WORSHIP = [
  L('சூரிய நமஸ்காரம் செய்யுங்கள்', 'Offer Surya Namaskaram to the Sun'),
  L('சிவபெருமானை வழிபடுங்கள்', 'Worship Lord Shiva'),
  L('முருகனை வழிபடுங்கள்', 'Worship Lord Murugan'),
  L('பெருமாளை வழிபடுங்கள்', 'Worship Lord Perumal'),
  L('குரு பகவான் / தட்சிணாமூர்த்தியை வழிபடுங்கள்', 'Worship Guru / Dakshinamurthy'),
  L('மகாலட்சுமி / அம்மனை வழிபடுங்கள்', 'Worship Mahalakshmi / Amman'),
  L('சனி பகவானுக்கு எள் தீபம் ஏற்றுங்கள்', 'Light a sesame-oil lamp for Sani Bhagavan'),
];

/** Tara balam: count from birth star to today's star (1–9 cycle). */
export const TARAS = [
  { ...L('ஜென்ம தாரை', 'Janma'), good: null, note: L('கவனமாக இருங்கள்', 'Be careful; go steady') },
  { ...L('சம்பத் தாரை', 'Sampat'), good: true, note: L('செல்வம், வெற்றி', 'Wealth and success') },
  { ...L('விபத் தாரை', 'Vipat'), good: false, note: L('தடைகள் வரலாம்', 'Obstacles possible') },
  { ...L('க்ஷேம தாரை', 'Kshema'), good: true, note: L('நலம், பாதுகாப்பு', 'Well-being and safety') },
  { ...L('பிரத்யக் தாரை', 'Pratyak'), good: false, note: L('எதிர்ப்புகள் வரலாம்', 'Opposition possible') },
  { ...L('சாதக தாரை', 'Sadhana'), good: true, note: L('முயற்சிகள் வெற்றி பெறும்', 'Efforts succeed') },
  { ...L('நைதன தாரை', 'Naidhana'), good: false, note: L('முக்கிய முடிவுகளைத் தவிர்க்கவும்', 'Avoid major decisions') },
  { ...L('மித்ர தாரை', 'Mitra'), good: true, note: L('நண்பர்கள் உதவுவார்கள்', 'Friends help you') },
  { ...L('பரம மித்ர தாரை', 'Parama Mitra'), good: true, note: L('மிகவும் சாதகம்', 'Very favourable') },
];

/** Chandra balam: Moon's house from birth rasi. */
export const CHANDRA_GOOD = [1, 3, 6, 7, 10, 11];
export const CHANDRA_BAD = [4, 8, 12];

/** Remedy for the running Mahadasa lord. */
export const DASA_REMEDY = {
  sun: L('ஞாயிறு அன்று சூரிய நமஸ்காரம்; ஆதித்ய ஹ்ருதயம் படியுங்கள்', 'Sunday Surya Namaskaram; recite Aditya Hrudayam'),
  moon: L('திங்கள் அன்று சிவன் / அம்மன் வழிபாடு', 'Monday worship of Shiva or Amman'),
  mars: L('செவ்வாய் அன்று முருகன் வழிபாடு', 'Tuesday worship of Lord Murugan'),
  mercury: L('புதன் அன்று பெருமாள் வழிபாடு', 'Wednesday worship of Lord Perumal'),
  jupiter: L('வியாழன் அன்று தட்சிணாமூர்த்தி வழிபாடு', 'Thursday worship of Dakshinamurthy'),
  venus: L('வெள்ளி அன்று மகாலட்சுமி வழிபாடு', 'Friday worship of Mahalakshmi'),
  saturn: L('சனி அன்று எள் தீபம்; ஆஞ்சநேயர் வழிபாடு', 'Saturday sesame lamp; worship Anjaneyar'),
  rahu: L('ராகு காலத்தில் துர்க்கை வழிபாடு', 'Worship Durga during Rahu Kalam'),
  ketu: L('விநாயகர் வழிபாடு', 'Worship Lord Vinayagar'),
};

/** Special days, keyed by what triggers them. */
export const SPECIAL = {
  pournami: L('பௌர்ணமி — கிரிவலம், சத்யநாராயண பூஜை', 'Pournami — Girivalam, Satyanarayana puja'),
  amavasai: L('அமாவாசை — முன்னோர் வழிபாடு (தர்ப்பணம்)', 'Amavasai — ancestor worship (tharpanam)'),
  ekadasi: L('ஏகாதசி — பெருமாள் விரதம்', 'Ekadasi — fast for Lord Perumal'),
  pradosham: L('பிரதோஷம் — மாலை சிவன் வழிபாடு', 'Pradosham — evening Shiva worship'),
  sashti: L('சஷ்டி — முருகன் விரதம்', 'Sashti — fast for Lord Murugan'),
  sankatahara: L('சங்கடஹர சதுர்த்தி — விநாயகர் விரதம்', 'Sankatahara Chathurthi — fast for Vinayagar'),
  chathurthi: L('சதுர்த்தி — விநாயகர் வழிபாடு', 'Chathurthi — Vinayagar worship'),
  shivarathri: L('மாத சிவராத்திரி', 'Masa Shivarathri'),
  karthigai: L('கார்த்திகை நட்சத்திரம் — முருகன் வழிபாடு', 'Karthigai star — Murugan worship'),
  thiruvonam: L('திருவோணம் — பெருமாள் வழிபாடு', 'Thiruvonam star — Perumal worship'),
  ashtami: L('அஷ்டமி — புதிய காரியங்கள் தொடங்க வேண்டாம்', 'Ashtami — avoid starting new work'),
  navami: L('நவமி — புதிய காரியங்கள் தொடங்க வேண்டாம்', 'Navami — avoid starting new work'),
};
