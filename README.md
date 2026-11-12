# Horoscopic ✨ — Tamil Jathagam

A Tamil **Jathagam** (ஜாதகம்) web app: Vedic birth chart, Panchangam and daily Rasi Palan, in Tamil and English. Built with React + Vite. All calculations run in the browser; no backend.

## Features
### ஜாதகம் · Jathagam (birth chart)
- Birth details: name, date, time, place (Tamil Nadu cities, India, diaspora cities, or custom coordinates)
- **Rasi chart** and **Navamsam chart** in the South Indian style
- **Lagnam**, **Rasi** (Moon sign), **Natchathiram + Padham**
- Birth Panchangam: Tamil month, day (counted from sunrise), Thithi, Yogam, Karanam
- Planet table for the Navagraha: rasi, degree, natchathiram, padham, navamsam and vakram (retrograde)
- **Vimshottari Dasa / Bhukti**: balance at birth, full 120-year timeline, current period highlighted
- Basic **Chevvai dosham** check, from Lagnam and from the Moon

### ராசி பலன் · Daily Rasi Palan
- Today's Panchangam for your place, with sunrise and sunset
- Daily palan for your Rasi: deity, lucky direction, number and colour, favourable rasi
- **Chandrashtamam** alert

### Other
- Language toggle: தமிழ் + English, தமிழ் only, or English only
- Remembers your birth details, Rasi and language (localStorage)

## How it calculates
- Planet positions come from [astronomy-engine](https://github.com/cosinekitty/astronomy).
- Sidereal positions use the **Lahiri (Chitrapaksha) ayanamsa**.
- Rahu and Ketu use the mean lunar node.
- Lagnam uses local sidereal time and the birth latitude.
- Birth times are converted to UTC with IANA time zones, so historical offsets such as India's +6:30 in 1942–45 are handled.

## Run it
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # calculation tests (node:test)
npm run build    # production build in dist/
```

## Project layout
```
src/
  App.jsx                  tabs, language, saved profile
  components/
    BirthForm.jsx          birth details input
    JathagamReport.jsx     summary, charts, planet table, dosham
    RasiChart.jsx          South Indian chart grid
    DasaTimeline.jsx       Vimshottari dasa / bhukti
    DailyPalan.jsx         today's panchangam + rasi palan
  data/jathagam.js         rasis, planets, natchathirams, thithi, yogam, karanam (Tamil + English)
  data/places.js           birth places with coordinates and time zones
  lib/astro.js             sidereal planet and Lagnam calculations
  lib/jathagam.js          chart assembly, panchangam, dasa, dosham
  lib/time.js              local time to UTC
  lib/horoscope.js         daily palan text generator
tests/jathagam.test.js     checks against known dates (Tamil New Year, Pongal, eclipse…)
```

## Roadmap
- **Porutham:** 10-porutham marriage matching
- Search any place worldwide
- Printable / PDF Jathagam
- Rahu Kalam, Yamagandam and Nalla Neram in the daily panchangam
- Gochara palan: daily palan based on real planetary transits
