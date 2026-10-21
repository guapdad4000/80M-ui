import { useLayoutEffect, useRef } from 'react';
import './perspective-window.css';

const CONTENT_WIDTH = 1000;
const CONTENT_HEIGHT = 600;
const FRAME_WIDTH = 1672;
const FRAMES = {
  1: { height: 941, corners: [[159, 120], [1579, 428], [1627, 869], [112, 673]] },
  2: { height: 941, corners: [[195, 158], [1519, 354], [1592, 833], [137, 656]] },
  4: { height: 940, corners: [[152, 178], [1589, 384], [1613, 824], [102, 645]] },
  5: { height: 941, corners: [[232, 130], [1542, 348], [1580, 839], [168, 695]] },
  'flat-black': { height: 941, corners: [[67, 181], [1605, 181], [1605, 796], [67, 796]] },
  'flat-paper': { height: 941, corners: [[76, 184], [1596, 184], [1596, 800], [76, 800]] },
  'flat-tall': { width: 1610, height: 977, corners: [[83, 131], [1530, 131], [1530, 882], [83, 882]] },
};

function projectContent(corners, width, sourceWidth, contentHeight) {
  const scale = width / sourceWidth;
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = corners.map(([x, y]) => [x * scale, y * scale]);
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = (dx1 * dy3 - dx3 * dy1) / determinant;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;

  // CSS matrices are column-major. The fourth row supplies perspective division.
  return `matrix3d(${[
    a / CONTENT_WIDTH, d / CONTENT_WIDTH, 0, g / CONTENT_WIDTH,
    b / contentHeight, e / contentHeight, 0, h / contentHeight,
    0, 0, 1, 0,
    x0, y0, 0, 1,
  ].join(',')})`;
}

export default function PerspectiveWindow({ src, alt, variant = '1', className = '', eager = false, objectPosition = 'center', fit = 'cover' }) {
  const variantId = Object.hasOwn(FRAMES, variant) ? variant : '1';
  const frame = FRAMES[variantId];
  // Flat frames use the screen's actual proportions, keeping game UI undistorted.
  const contentHeight = String(variantId).startsWith('flat-')
    ? CONTENT_WIDTH * (frame.corners[3][1] - frame.corners[0][1]) / (frame.corners[1][0] - frame.corners[0][0])
    : CONTENT_HEIGHT;
  const wrapperRef = useRef(null);
  const screenRef = useRef(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const screen = screenRef.current;
    if (!wrapper || !screen) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width <= 0) return;
      screen.style.transform = projectContent(frame.corners, width, frame.width || FRAME_WIDTH, contentHeight);
      screen.style.visibility = 'visible';
    });
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
      screen.style.visibility = 'hidden';
    };
  }, [frame, contentHeight]);

  return (
    <div
      ref={wrapperRef}
      className={`perspective-window ${className}`.trim()}
      style={{ aspectRatio: `${frame.width || FRAME_WIDTH} / ${frame.height}` }}
      data-frame-variant={variantId}
    >
      <img
        className="perspective-window__frame"
        src={`/brand/landing-art/frame-${variantId}.webp`}
        alt=""
        aria-hidden="true"
        width={frame.width || FRAME_WIDTH}
        height={frame.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
      />
      <div ref={screenRef} className="perspective-window__screen" style={{ height: contentHeight }}>
        <img
          className="perspective-window__image"
          src={src}
          alt={alt}
          width={CONTENT_WIDTH}
          height={Math.round(contentHeight)}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          style={{ objectPosition, objectFit: fit }}
        />
      </div>
    </div>
  );
}
