import { useEffect, useRef, useState } from 'react';
import Starfield from './components/Starfield.jsx';
import SignPicker from './components/SignPicker.jsx';
import DailyReading from './components/DailyReading.jsx';
import SignProfile from './components/SignProfile.jsx';
import { getSign } from './data/signs.js';

const STORAGE_KEY = 'horoscopic:sign';

function loadSavedSign() {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return getSign(id) ? id : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [signId, setSignId] = useState(loadSavedSign);
  const readingRef = useRef(null);
  const sign = getSign(signId);

  useEffect(() => {
    try {
      if (signId) localStorage.setItem(STORAGE_KEY, signId);
    } catch {
      /* storage unavailable — ignore */
    }
  }, [signId]);

  const selectSign = (id) => {
    setSignId(id);
    requestAnimationFrame(() => readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <>
      <Starfield />
      <main className="container">
        <header className="hero">
          <h1>Horoscopic</h1>
          <p className="tagline">Your daily guide written in the stars</p>
        </header>

        <SignPicker selectedId={signId} onSelect={selectSign} />

        <div ref={readingRef} className="results">
          {sign ? (
            <>
              <DailyReading sign={sign} onPickSign={selectSign} />
              <SignProfile sign={sign} />
            </>
          ) : (
            <p className="empty">Choose your sign above to reveal today’s horoscope ✨</p>
          )}
        </div>

        <footer className="footer">
          Horoscopic is for entertainment. The stars guide; you decide.
        </footer>
      </main>
    </>
  );
}
