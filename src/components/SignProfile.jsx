import { ELEMENT_COLORS } from '../data/signs.js';
import { formatRange } from '../lib/zodiac.js';

export default function SignProfile({ sign }) {
  return (
    <article className="panel profile" style={{ '--accent': ELEMENT_COLORS[sign.element] }}>
      <h3>About {sign.name}</h3>
      <p>{sign.summary}</p>

      <dl className="facts">
        <div><dt>Dates</dt><dd>{formatRange(sign)}</dd></div>
        <div><dt>Element</dt><dd className="accent">{sign.element}</dd></div>
        <div><dt>Modality</dt><dd>{sign.modality}</dd></div>
        <div><dt>Ruling planet</dt><dd>{sign.ruler}</dd></div>
      </dl>

      <ul className="chips">
        {sign.traits.map((t) => <li key={t}>{t}</li>)}
      </ul>

      <h4>Strengths</h4>
      <p className="muted">{sign.strengths}</p>
      <h4>Weaknesses</h4>
      <p className="muted">{sign.weaknesses}</p>
    </article>
  );
}
