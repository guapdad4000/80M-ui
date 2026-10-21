import './artwork-window.css';

const CHROME = {
  black: { image: 'frame-flat-black.webp', width: 1672, height: 941, x: 21, y: 80, cropWidth: 1630, cropHeight: 94 },
  paper: { image: 'frame-flat-paper.webp', width: 1672, height: 941, x: 35, y: 85, cropWidth: 1602, cropHeight: 90 },
};

// The generated chrome is decorative. The real image sets the opening's shape,
// so portrait artwork and wide game screens never need an opaque letterbox.
export default function ArtworkWindow({ src, alt, width, height, variant = 'flat-black' }) {
  const paper = variant === 'flat-paper';
  const chrome = CHROME[paper ? 'paper' : 'black'];
  const tilt = variant === '4' ? 'left' : variant === '1' ? 'right' : 'flat';

  return (
    <div
      className={`artwork-window artwork-window--${paper ? 'paper' : 'black'} artwork-window--${tilt}`}
      style={{ '--artwork-aspect': width / height }}
      data-frame-variant={variant}
    >
      <div className="artwork-window__chrome" aria-hidden="true" style={{ aspectRatio: `${chrome.cropWidth} / ${chrome.cropHeight}` }}>
        <img
          src={`/brand/landing-art/${chrome.image}`}
          alt=""
          width={chrome.width}
          height={chrome.height}
          loading="lazy"
          decoding="async"
          style={{ width: `${chrome.width / chrome.cropWidth * 100}%`, left: `${-chrome.x / chrome.cropWidth * 100}%`, top: `${-chrome.y / chrome.cropHeight * 100}%` }}
        />
      </div>
      <div className="artwork-window__rim">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="artwork-window__image" />
      </div>
    </div>
  );
}
