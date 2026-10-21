import { useState } from 'react';

export default function PopsicleCompare({ label, before, after, width = 533 }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      type="button"
      className="audit-popsicle"
      aria-label={`Compare ${label.toLowerCase()}`}
      aria-describedby="audit-interaction-hint"
      aria-pressed={revealed}
      data-revealed={revealed}
      onClick={() => setRevealed((value) => !value)}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setRevealed(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setRevealed(false); }}
    >
      <span className="audit-popsicle__art">
        <img src={before} alt="" width={width} height="800" className="audit-popsicle__before" draggable="false" />
        <img src={after} alt="" width={width} height="800" className="audit-popsicle__after" draggable="false" />
      </span>
      <span className="audit-popsicle__label">{label}<small>{revealed ? 'After' : 'Before'} <span aria-hidden="true">↔</span></small></span>
    </button>
  );
}
