// Birth places: latitude (+N), longitude (+E), IANA time zone.
// IANA zones let us apply historical offsets correctly (e.g. India's
// wartime +6:30 in 1942–45) via the browser's Intl time-zone database.

import { TN_PLACES } from './tnPlaces.js';

// Hand-picked places (major cities, rest of India, Tamil diaspora).
// Their `id` is the plain name, which keeps older saved profiles working.
const CURATED = [
  // Tamil Nadu & Puducherry
  { name: 'Chennai', region: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Coimbatore', region: 'Tamil Nadu', lat: 11.0168, lon: 76.9558, tz: 'Asia/Kolkata' },
  { name: 'Madurai', region: 'Tamil Nadu', lat: 9.9252, lon: 78.1198, tz: 'Asia/Kolkata' },
  { name: 'Tiruchirappalli', region: 'Tamil Nadu', lat: 10.7905, lon: 78.7047, tz: 'Asia/Kolkata' },
  { name: 'Salem', region: 'Tamil Nadu', lat: 11.6643, lon: 78.146, tz: 'Asia/Kolkata' },
  { name: 'Tirunelveli', region: 'Tamil Nadu', lat: 8.7139, lon: 77.7567, tz: 'Asia/Kolkata' },
  { name: 'Erode', region: 'Tamil Nadu', lat: 11.341, lon: 77.7172, tz: 'Asia/Kolkata' },
  { name: 'Vellore', region: 'Tamil Nadu', lat: 12.9165, lon: 79.1325, tz: 'Asia/Kolkata' },
  { name: 'Thoothukudi', region: 'Tamil Nadu', lat: 8.7642, lon: 78.1348, tz: 'Asia/Kolkata' },
  { name: 'Thanjavur', region: 'Tamil Nadu', lat: 10.787, lon: 79.1378, tz: 'Asia/Kolkata' },
  { name: 'Kumbakonam', region: 'Tamil Nadu', lat: 10.9617, lon: 79.3881, tz: 'Asia/Kolkata' },
  { name: 'Kanchipuram', region: 'Tamil Nadu', lat: 12.8342, lon: 79.7036, tz: 'Asia/Kolkata' },
  { name: 'Nagercoil', region: 'Tamil Nadu', lat: 8.1833, lon: 77.4119, tz: 'Asia/Kolkata' },
  { name: 'Dindigul', region: 'Tamil Nadu', lat: 10.3673, lon: 77.9803, tz: 'Asia/Kolkata' },
  { name: 'Karur', region: 'Tamil Nadu', lat: 10.9601, lon: 78.0766, tz: 'Asia/Kolkata' },
  { name: 'Tiruppur', region: 'Tamil Nadu', lat: 11.1085, lon: 77.3411, tz: 'Asia/Kolkata' },
  { name: 'Cuddalore', region: 'Tamil Nadu', lat: 11.748, lon: 79.7714, tz: 'Asia/Kolkata' },
  { name: 'Nagapattinam', region: 'Tamil Nadu', lat: 10.7672, lon: 79.8449, tz: 'Asia/Kolkata' },
  { name: 'Ramanathapuram', region: 'Tamil Nadu', lat: 9.3639, lon: 78.8395, tz: 'Asia/Kolkata' },
  { name: 'Hosur', region: 'Tamil Nadu', lat: 12.7409, lon: 77.8253, tz: 'Asia/Kolkata' },
  { name: 'Puducherry', region: 'Puducherry', lat: 11.9416, lon: 79.8083, tz: 'Asia/Kolkata' },
  // Rest of India
  { name: 'Bengaluru', region: 'Karnataka', lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Hyderabad', region: 'Telangana', lat: 17.385, lon: 78.4867, tz: 'Asia/Kolkata' },
  { name: 'Thiruvananthapuram', region: 'Kerala', lat: 8.5241, lon: 76.9366, tz: 'Asia/Kolkata' },
  { name: 'Kochi', region: 'Kerala', lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  { name: 'Tirupati', region: 'Andhra Pradesh', lat: 13.6288, lon: 79.4192, tz: 'Asia/Kolkata' },
  { name: 'Mumbai', region: 'Maharashtra', lat: 19.076, lon: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Delhi', region: 'Delhi', lat: 28.6139, lon: 77.209, tz: 'Asia/Kolkata' },
  { name: 'Kolkata', region: 'West Bengal', lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata' },
  // Tamil diaspora
  { name: 'Colombo', region: 'Sri Lanka', lat: 6.9271, lon: 79.8612, tz: 'Asia/Colombo' },
  { name: 'Jaffna', region: 'Sri Lanka', lat: 9.6615, lon: 80.0255, tz: 'Asia/Colombo' },
  { name: 'Batticaloa', region: 'Sri Lanka', lat: 7.7102, lon: 81.6924, tz: 'Asia/Colombo' },
  { name: 'Trincomalee', region: 'Sri Lanka', lat: 8.5874, lon: 81.2152, tz: 'Asia/Colombo' },
  { name: 'Singapore', region: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Kuala Lumpur', region: 'Malaysia', lat: 3.139, lon: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  { name: 'Penang', region: 'Malaysia', lat: 5.4141, lon: 100.3288, tz: 'Asia/Kuala_Lumpur' },
  { name: 'Dubai', region: 'UAE', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Doha', region: 'Qatar', lat: 25.2854, lon: 51.531, tz: 'Asia/Qatar' },
  { name: 'Muscat', region: 'Oman', lat: 23.588, lon: 58.3829, tz: 'Asia/Muscat' },
  { name: 'London', region: 'UK', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'Paris', region: 'France', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
  { name: 'Toronto', region: 'Canada', lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
  { name: 'New York', region: 'USA', lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
  { name: 'New Jersey (Edison)', region: 'USA', lat: 40.5187, lon: -74.4121, tz: 'America/New_York' },
  { name: 'Dallas', region: 'USA', lat: 32.7767, lon: -96.797, tz: 'America/Chicago' },
  { name: 'San Francisco', region: 'USA', lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles' },
  { name: 'Sydney', region: 'Australia', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Melbourne', region: 'Australia', lat: -37.8136, lon: 144.9631, tz: 'Australia/Melbourne' },
  { name: 'Auckland', region: 'New Zealand', lat: -36.8485, lon: 174.7633, tz: 'Pacific/Auckland' },
  { name: 'Mauritius (Port Louis)', region: 'Mauritius', lat: -20.1609, lon: 57.5012, tz: 'Indian/Mauritius' },
  { name: 'Durban', region: 'South Africa', lat: -29.8587, lon: 31.0218, tz: 'Africa/Johannesburg' },
].map((p) => ({ ...p, id: p.name, pop: Infinity }));

const curatedNames = new Set(CURATED.map((p) => p.name.toLowerCase()));

// Every Tamil Nadu & Puducherry town/village from GeoNames.
const TN = TN_PLACES
  .filter(([name]) => !curatedNames.has(name.toLowerCase()))
  .map(([name, district, lat, lon, pop]) => ({
    id: `${name}, ${district}`, name, region: district, lat, lon, tz: 'Asia/Kolkata', pop,
  }));

export const PLACES = [...CURATED, ...TN];
export const CURATED_PLACES = CURATED;
export const DEFAULT_PLACE = CURATED[0];

const byId = new Map(PLACES.map((p) => [p.id, p]));
export const findPlace = (id) => (id ? byId.get(id) ?? null : null);

// Common Tamil / old / short names → the name we store.
const ALIASES = {
  madras: 'chennai', trichy: 'tiruchirappalli', tiruchi: 'tiruchirappalli', kovai: 'coimbatore',
  nellai: 'tirunelveli', tuticorin: 'thoothukudi', thoothukkudi: 'thoothukudi', pondicherry: 'puducherry',
  pondy: 'puducherry', ooty: 'ooty', udhagamandalam: 'ooty', kanyakumari: 'kanniyakumari',
  kanchi: 'kanchipuram', kancheepuram: 'kanchipuram', tanjore: 'thanjavur', thanjai: 'thanjavur',
  bangalore: 'bengaluru', trivandrum: 'thiruvananthapuram', cochin: 'kochi', bombay: 'mumbai',
  calcutta: 'kolkata', tiruvannamalai: 'tiruvannamalai', thiruvannamalai: 'tiruvannamalai',
  rameshwaram: 'rameswaram', palani: 'palani', pazhani: 'palani', kodai: 'kodaikanal',
};

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');

/** Search places by name (and district). Returns the best `limit` matches. */
export function searchPlaces(query, limit = 8) {
  const raw = norm(query);
  if (!raw) return [];
  const q = norm(ALIASES[raw] ?? raw);
  const scored = [];
  for (const p of PLACES) {
    const n = norm(p.name);
    let score = -1;
    if (n === q || n === raw) score = 0;
    else if (n.startsWith(q) || n.startsWith(raw)) score = 1;
    else if (n.includes(q)) score = 2;
    else if (norm(p.region).startsWith(q)) score = 3;
    if (score >= 0) scored.push([score, -p.pop, p]);
  }
  scored.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return scored.slice(0, limit).map((s) => s[2]);
}

/** Display label: "Name, District" (district omitted if it repeats the name). */
export const placeLabel = (p) => (p.region && norm(p.region) !== norm(p.name) ? `${p.name}, ${p.region}` : p.name);
