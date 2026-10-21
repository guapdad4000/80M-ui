// Presentation bounds remove empty margins without changing the supplied artwork.
const BOUNDS = {
  'too-much-brain-fog': [0, 23, 1680, 861],
  'start-project': [17, 32, 1793, 834],
  'portfolio-title': [12, 54, 1928, 765],
  'hero-ideas': [0, 148, 1448, 942],
  'rough-drafts': [21, 58, 1430, 1032],
  'internet-hard': [18, 36, 1427, 1069],
  'hands-tied': [34, 28, 1431, 1068],
  'take-it-from-here': [26, 58, 1426, 1046],
  'four-ways': [20, 24, 1435, 1056],
  'next-version': [35, 63, 1416, 1048],
  'make-real': [16, 64, 1437, 1071],
  'starting-point': [20, 32, 1431, 1077],
  'learn-to-build': [21, 34, 1437, 1071],
  'from-idea': [18, 63, 1428, 1051],
  'do-the-work': [23, 24, 1424, 1071],
  'how-we-work': [19, 107, 2153, 605],
  'feeding-the-algorithm': [25, 71, 1423, 1034],
};

const SOURCE_SIZES = {
  'too-much-brain-fog': [1681, 936],
  'start-project': [1817, 866],
  'portfolio-title': [1942, 809],
  'how-we-work': [2172, 724],
};

export default function CollageArt({ name, text, eager = false }) {
  const [left, top, right, bottom] = BOUNDS[name];
  const [sourceWidth, sourceHeight] = SOURCE_SIZES[name] || [1448, 1086];
  const width = right - left;
  const height = bottom - top;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="collage-art" aria-hidden="true" style={{ aspectRatio: `${width} / ${height}` }}>
        <img
          src={`/brand/landing-art/${name}.webp`}
          alt=""
          width={sourceWidth}
          height={sourceHeight}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          style={{ width: `${sourceWidth / width * 100}%`, left: `${-left / width * 100}%`, top: `${-top / height * 100}%` }}
        />
      </span>
    </>
  );
}
