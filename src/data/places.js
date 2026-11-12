// Built-in birth places: latitude (+N), longitude (+E), IANA time zone.
// IANA zones let us apply historical offsets correctly (e.g. India's
// wartime +6:30 in 1942–45) via the browser's Intl time-zone database.

export const PLACES = [
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
  { name: 'Bengaluru', region: 'India', lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'Hyderabad', region: 'India', lat: 17.385, lon: 78.4867, tz: 'Asia/Kolkata' },
  { name: 'Thiruvananthapuram', region: 'India', lat: 8.5241, lon: 76.9366, tz: 'Asia/Kolkata' },
  { name: 'Kochi', region: 'India', lat: 9.9312, lon: 76.2673, tz: 'Asia/Kolkata' },
  { name: 'Mumbai', region: 'India', lat: 19.076, lon: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Delhi', region: 'India', lat: 28.6139, lon: 77.209, tz: 'Asia/Kolkata' },
  { name: 'Kolkata', region: 'India', lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata' },
  // Tamil diaspora
  { name: 'Colombo', region: 'Sri Lanka', lat: 6.9271, lon: 79.8612, tz: 'Asia/Colombo' },
  { name: 'Jaffna', region: 'Sri Lanka', lat: 9.6615, lon: 80.0255, tz: 'Asia/Colombo' },
  { name: 'Singapore', region: 'World', lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore' },
  { name: 'Kuala Lumpur', region: 'World', lat: 3.139, lon: 101.6869, tz: 'Asia/Kuala_Lumpur' },
  { name: 'Dubai', region: 'World', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
  { name: 'London', region: 'World', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'Toronto', region: 'World', lat: 43.6532, lon: -79.3832, tz: 'America/Toronto' },
  { name: 'New York', region: 'World', lat: 40.7128, lon: -74.006, tz: 'America/New_York' },
  { name: 'San Francisco', region: 'World', lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles' },
  { name: 'Sydney', region: 'World', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
];

export const DEFAULT_PLACE = PLACES[0];
export const findPlace = (name) => PLACES.find((p) => p.name === name);
