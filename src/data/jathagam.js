// Reference tables for Tamil Jathagam (Vedic / sidereal astrology).
// Every named item carries a Tamil (`ta`) and English (`en`) label.

// 12 Rasis (sidereal signs). `lord` is a planet id.
export const RASIS = [
  { id: 0, ta: 'மேஷம்', en: 'Mesham', west: 'Aries', short: { ta: 'மேஷ', en: 'Ari' }, lord: 'mars', element: 'Fire', symbol: '♈' },
  { id: 1, ta: 'ரிஷபம்', en: 'Rishabam', west: 'Taurus', short: { ta: 'ரிஷ', en: 'Tau' }, lord: 'venus', element: 'Earth', symbol: '♉' },
  { id: 2, ta: 'மிதுனம்', en: 'Mithunam', west: 'Gemini', short: { ta: 'மிது', en: 'Gem' }, lord: 'mercury', element: 'Air', symbol: '♊' },
  { id: 3, ta: 'கடகம்', en: 'Kadagam', west: 'Cancer', short: { ta: 'கட', en: 'Can' }, lord: 'moon', element: 'Water', symbol: '♋' },
  { id: 4, ta: 'சிம்மம்', en: 'Simmam', west: 'Leo', short: { ta: 'சிம்', en: 'Leo' }, lord: 'sun', element: 'Fire', symbol: '♌' },
  { id: 5, ta: 'கன்னி', en: 'Kanni', west: 'Virgo', short: { ta: 'கன்', en: 'Vir' }, lord: 'mercury', element: 'Earth', symbol: '♍' },
  { id: 6, ta: 'துலாம்', en: 'Thulam', west: 'Libra', short: { ta: 'துலா', en: 'Lib' }, lord: 'venus', element: 'Air', symbol: '♎' },
  { id: 7, ta: 'விருச்சிகம்', en: 'Viruchigam', west: 'Scorpio', short: { ta: 'விரு', en: 'Sco' }, lord: 'mars', element: 'Water', symbol: '♏' },
  { id: 8, ta: 'தனுசு', en: 'Dhanusu', west: 'Sagittarius', short: { ta: 'தனு', en: 'Sag' }, lord: 'jupiter', element: 'Fire', symbol: '♐' },
  { id: 9, ta: 'மகரம்', en: 'Magaram', west: 'Capricorn', short: { ta: 'மகர', en: 'Cap' }, lord: 'saturn', element: 'Earth', symbol: '♑' },
  { id: 10, ta: 'கும்பம்', en: 'Kumbam', west: 'Aquarius', short: { ta: 'கும்', en: 'Aqu' }, lord: 'saturn', element: 'Air', symbol: '♒' },
  { id: 11, ta: 'மீனம்', en: 'Meenam', west: 'Pisces', short: { ta: 'மீன', en: 'Pis' }, lord: 'jupiter', element: 'Water', symbol: '♓' },
];

// Navagraha — order used throughout the app.
export const PLANETS = [
  { id: 'sun', ta: 'சூரியன்', en: 'Suriyan (Sun)', short: { ta: 'சூ', en: 'Su' } },
  { id: 'moon', ta: 'சந்திரன்', en: 'Chandran (Moon)', short: { ta: 'சந்', en: 'Mo' } },
  { id: 'mars', ta: 'செவ்வாய்', en: 'Sevvai (Mars)', short: { ta: 'செவ்', en: 'Ma' } },
  { id: 'mercury', ta: 'புதன்', en: 'Budhan (Mercury)', short: { ta: 'பு', en: 'Me' } },
  { id: 'jupiter', ta: 'குரு', en: 'Guru (Jupiter)', short: { ta: 'குரு', en: 'Ju' } },
  { id: 'venus', ta: 'சுக்கிரன்', en: 'Sukkiran (Venus)', short: { ta: 'சுக்', en: 'Ve' } },
  { id: 'saturn', ta: 'சனி', en: 'Sani (Saturn)', short: { ta: 'சனி', en: 'Sa' } },
  { id: 'rahu', ta: 'ராகு', en: 'Rahu', short: { ta: 'ரா', en: 'Ra' } },
  { id: 'ketu', ta: 'கேது', en: 'Ketu', short: { ta: 'கே', en: 'Ke' } },
];

export const LAGNAM = { ta: 'லக்னம்', en: 'Lagnam (Ascendant)', short: { ta: 'ல', en: 'Asc' } };

// 27 Natchathirams. `lord` drives the Vimshottari dasa.
const NAK_LORDS = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury'];
export const NAKSHATRAS = [
  ['அசுவினி', 'Aswini'], ['பரணி', 'Bharani'], ['கார்த்திகை', 'Karthigai'],
  ['ரோகிணி', 'Rohini'], ['மிருகசீரிடம்', 'Mirugasirisham'], ['திருவாதிரை', 'Thiruvathirai'],
  ['புனர்பூசம்', 'Punarpoosam'], ['பூசம்', 'Poosam'], ['ஆயில்யம்', 'Ayilyam'],
  ['மகம்', 'Magam'], ['பூரம்', 'Pooram'], ['உத்திரம்', 'Uthiram'],
  ['அஸ்தம்', 'Hastham'], ['சித்திரை', 'Chithirai'], ['சுவாதி', 'Swathi'],
  ['விசாகம்', 'Visakam'], ['அனுஷம்', 'Anusham'], ['கேட்டை', 'Kettai'],
  ['மூலம்', 'Moolam'], ['பூராடம்', 'Pooradam'], ['உத்திராடம்', 'Uthiradam'],
  ['திருவோணம்', 'Thiruvonam'], ['அவிட்டம்', 'Avittam'], ['சதயம்', 'Sathayam'],
  ['பூரட்டாதி', 'Poorattathi'], ['உத்திரட்டாதி', 'Uthirattathi'], ['ரேவதி', 'Revathi'],
].map(([ta, en], id) => ({ id, ta, en, lord: NAK_LORDS[id % 9] }));

// Vimshottari dasa: sequence and years.
export const DASA_ORDER = NAK_LORDS;
export const DASA_YEARS = { ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7, rahu: 18, jupiter: 16, saturn: 19, mercury: 17 };

export const PAKSHAS = [
  { ta: 'வளர்பிறை', en: 'Valarpirai (Waxing)' },
  { ta: 'தேய்பிறை', en: 'Theipirai (Waning)' },
];

// Thithi names 1–14; 15 is Pournami (waxing) or Amavasai (waning).
export const THITHIS = [
  ['பிரதமை', 'Prathamai'], ['துவிதியை', 'Dwitiyai'], ['திருதியை', 'Tritiyai'],
  ['சதுர்த்தி', 'Chathurthi'], ['பஞ்சமி', 'Panchami'], ['சஷ்டி', 'Sashti'],
  ['சப்தமி', 'Sapthami'], ['அஷ்டமி', 'Ashtami'], ['நவமி', 'Navami'],
  ['தசமி', 'Dasami'], ['ஏகாதசி', 'Ekadasi'], ['துவாதசி', 'Dwadasi'],
  ['திரயோதசி', 'Thrayodasi'], ['சதுர்த்தசி', 'Chathurdasi'],
].map(([ta, en]) => ({ ta, en }));
export const POURNAMI = { ta: 'பௌர்ணமி', en: 'Pournami (Full Moon)' };
export const AMAVASAI = { ta: 'அமாவாசை', en: 'Amavasai (New Moon)' };

export const YOGAS = [
  ['விஷ்கம்பம்', 'Vishkambam'], ['ப்ரீதி', 'Preethi'], ['ஆயுஷ்மான்', 'Ayushman'],
  ['சௌபாக்கியம்', 'Saubhagyam'], ['சோபனம்', 'Sobhanam'], ['அதிகண்டம்', 'Athigandam'],
  ['சுகர்மம்', 'Sukarmam'], ['திருதி', 'Dhruthi'], ['சூலம்', 'Soolam'],
  ['கண்டம்', 'Gandam'], ['விருத்தி', 'Vruddhi'], ['துருவம்', 'Dhruvam'],
  ['வியாகாதம்', 'Vyaghatham'], ['ஹர்ஷணம்', 'Harshanam'], ['வஜ்ரம்', 'Vajram'],
  ['சித்தி', 'Siddhi'], ['வியதீபாதம்', 'Vyatheepatham'], ['வரீயான்', 'Variyan'],
  ['பரிகம்', 'Parigam'], ['சிவம்', 'Sivam'], ['சித்தம்', 'Siddham'],
  ['சாத்தியம்', 'Sadhyam'], ['சுபம்', 'Subham'], ['சுப்பிரம்', 'Subhram'],
  ['பிராம்மியம்', 'Brahmam'], ['ஐந்திரம்', 'Aindhram'], ['வைதிருதி', 'Vaidhruthi'],
].map(([ta, en]) => ({ ta, en }));

// Karanams: 7 repeating + 4 fixed.
export const KARANAS_MOVABLE = [
  ['பவம்', 'Bavam'], ['பாலவம்', 'Balavam'], ['கௌலவம்', 'Kaulavam'], ['தைதுலம்', 'Thaithulam'],
  ['கரசை', 'Garasai'], ['வணிசை', 'Vanisai'], ['பத்திரை', 'Bhaththirai (Vishti)'],
].map(([ta, en]) => ({ ta, en }));
export const KARANAS_FIXED = {
  kimstughna: { ta: 'கிம்ஸ்துக்னம்', en: 'Kimstughnam' },
  shakuni: { ta: 'சகுனி', en: 'Sakuni' },
  chatushpada: { ta: 'சதுஷ்பாதம்', en: 'Chathushpadham' },
  naga: { ta: 'நாகவம்', en: 'Nagavam' },
};

export const WEEKDAYS = [
  ['ஞாயிறு', 'Nyayiru (Sunday)'], ['திங்கள்', 'Thingal (Monday)'], ['செவ்வாய்', 'Sevvai (Tuesday)'],
  ['புதன்', 'Budhan (Wednesday)'], ['வியாழன்', 'Vyazhan (Thursday)'], ['வெள்ளி', 'Velli (Friday)'],
  ['சனி', 'Sani (Saturday)'],
].map(([ta, en]) => ({ ta, en }));

// Tamil solar months — the Sun's sidereal rasi (Mesham → Chithirai).
export const TAMIL_MONTHS = [
  ['சித்திரை', 'Chithirai'], ['வைகாசி', 'Vaikasi'], ['ஆனி', 'Aani'], ['ஆடி', 'Aadi'],
  ['ஆவணி', 'Aavani'], ['புரட்டாசி', 'Purattasi'], ['ஐப்பசி', 'Aippasi'], ['கார்த்திகை', 'Karthigai'],
  ['மார்கழி', 'Margazhi'], ['தை', 'Thai'], ['மாசி', 'Maasi'], ['பங்குனி', 'Panguni'],
].map(([ta, en]) => ({ ta, en }));

export const getPlanet = (id) => PLANETS.find((p) => p.id === id);

export const ELEMENT_COLORS = {
  Fire: '#ff8a5c',
  Earth: '#9ccc65',
  Air: '#7ec8ff',
  Water: '#b39dff',
};
