# Horoscopic ✨

A daily horoscope web app built with React + Vite.

## Features (Phase 1)
- Pick your zodiac sign, or find it from your birth date
- Daily horoscope: reading, advice, mood, lucky number/color/time, best match, love/career/wellness ratings
- Sign profile: element, modality, ruling planet, traits, strengths & weaknesses
- Remembers your sign (localStorage)
- Readings are deterministic per sign + day — stable all day, fresh tomorrow, no backend

## Run it
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Project layout
```
src/
  App.jsx                 app shell + saved sign
  components/             Starfield, SignPicker, DailyReading, SignProfile
  data/signs.js           zodiac reference data
  lib/zodiac.js           birth date -> sign
  lib/horoscope.js        seeded daily reading generator
```

## Roadmap
- **Phase 2:** compatibility checker, weekly/monthly readings, birth chart, AI-generated readings
- **Phase 3:** PWA + notifications, shareable reading cards
