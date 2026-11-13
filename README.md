# Horoscopic ✨ — Tamil Jathagam

A Tamil **Jathagam** (ஜாதகம்) web app: Vedic birth chart, Panchangam and daily Rasi Palan, in Tamil and English. Built with React + Vite. All calculations run in the browser; no backend.

## Features
### இன்று · Today (daily calendar)
- **Nalla Neram:** good Gowri periods outside Rahu Kalam and Yamagandam, plus Abhijit Muhurtham
- **Times to avoid:** Rahu Kalam, Yamagandam, Kuligai, and Soolam with its parigaram
- **Gowri Panchangam (daytime):** weekday tables from the Pambu Panchangam (via Drik Panchang), with the running period highlighted
- **Panchangam:** Thithi and Natchathiram with end times, Yogam, Karanam, sunrise and sunset
- **Special days:** Pournami, Amavasai, Ekadasi, Pradosham, Sashti, Chathurthi, Sankatahara, Shivarathri, Karthigai, Thiruvonam, Ashtami and Navami
- **Personal guidance from your Jathagam:** Tara balam, Chandra balam, Chandrashtamam, running Dasa/Bhukti, a day verdict, the best time for important work, and remedies
- Move to the previous or next day; choose your current city
- Tested against Drik Panchang for New Delhi, 13 Nov 2026

### ஜாதகம் · Jathagam (birth chart)
- Birth details: name, date, time and place
  - **Search 1,100+ places:** every Tamil Nadu and Puducherry town and village from GeoNames, plus major Indian and Tamil-diaspora cities
  - Understands common names: Trichy, Kovai, Nellai, Madras, Pondy, Tanjore, Tuticorin…
  - Or enter coordinates by hand
- **Boundary warning:** shows when a few minutes of birth-time error (or a different town) would change the Lagnam or the birth star
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
    TodayView.jsx          today: nalla neram, rahu kalam, gowri, personal advice
    DailyPalan.jsx         daily rasi palan
    PlaceSearch.jsx        type-to-search place picker
  data/jathagam.js         rasis, planets, natchathirams, thithi, yogam, karanam (Tamil + English)
  data/places.js           curated places, place search and nicknames
  data/tnPlaces.js         Tamil Nadu & Puducherry places (generated from GeoNames)
  lib/astro.js             sidereal planet and Lagnam calculations
  lib/jathagam.js          chart assembly, panchangam, dasa, dosham
  data/daily.js            gowri, rahu kalam, soolam, tara and special-day tables
  lib/daily.js             daily calendar and personal guidance
  lib/time.js              local time to UTC
  lib/horoscope.js         daily palan text generator
tests/jathagam.test.js     checks against known dates (Tamil New Year, Pongal, eclipse…)
```

## Roadmap
- **Porutham:** 10-porutham marriage matching
- Search any place worldwide
- Printable / PDF Jathagam
- Night Gowri Panchangam and Hora timings
- Gochara palan: daily palan based on real planetary transits

## Credits
Place data © [GeoNames](https://www.geonames.org), licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
