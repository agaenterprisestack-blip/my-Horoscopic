import { createContext, useContext } from 'react';

// lang: 'both' | 'ta' | 'en'
export const LangContext = createContext('both');
export const useLang = () => useContext(LangContext);

/** Display a {ta, en} item in the current language. */
export function nameOf(item, lang) {
  if (!item) return '';
  if (lang === 'ta') return item.ta;
  if (lang === 'en') return item.en;
  return `${item.ta} · ${item.en}`;
}

/** <N item={...} /> — renders a bilingual name; in 'both' mode English is subdued. */
export function N({ item }) {
  const lang = useLang();
  if (!item) return null;
  if (lang !== 'both') return <>{nameOf(item, lang)}</>;
  return (
    <>
      <span lang="ta">{item.ta}</span> <span className="en-sub">{item.en}</span>
    </>
  );
}

/** Short label (chart cells). */
export const shortOf = (item, lang) => (lang === 'en' ? item.short.en : item.short.ta);
