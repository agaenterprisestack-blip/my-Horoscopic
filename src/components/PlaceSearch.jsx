import { useId, useState } from 'react';
import { searchPlaces, placeLabel } from '../data/places.js';

/**
 * Type-to-search place picker (combobox).
 * @param {object|null} value     selected place
 * @param {(place) => void} onChange
 */
export default function PlaceSearch({ value, onChange, placeholder, inputId }) {
  const [text, setText] = useState(value ? placeLabel(value) : '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  const results = open ? searchPlaces(text) : [];

  const choose = (p) => {
    onChange(p);
    setText(placeLabel(p));
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % results.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="place-search">
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        onChange={(e) => { setText(e.target.value); setOpen(true); setActive(0); }}
        onFocus={(e) => { e.target.select(); setOpen(true); }}
        onBlur={() => setTimeout(() => { setOpen(false); if (value) setText(placeLabel(value)); }, 150)}
        onKeyDown={onKeyDown}
      />
      {results.length > 0 && (
        <ul id={listId} role="listbox" className="place-results">
          {results.map((p, i) => (
            <li
              key={p.id}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : ''}
              onMouseDown={(e) => { e.preventDefault(); choose(p); }}
              onMouseEnter={() => setActive(i)}
            >
              <span>{p.name}</span>
              <span className="muted small">{p.region}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
