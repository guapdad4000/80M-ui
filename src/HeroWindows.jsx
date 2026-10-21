import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.div;
const WINDOWS = [
  { name: 'ai', label: 'AI', rotation: -5, duration: 8, sizes: '(min-width: 600px) and (max-height: 550px) 22vw, (min-width: 1200px) 410px, (min-width: 768px) 36vw, calc(43vw - 35px)' },
  { name: 'taste', label: 'TASTE', rotation: 4, duration: 9, sizes: '(min-width: 600px) and (max-height: 550px) 22vw, (min-width: 1200px) 400px, (min-width: 768px) 35vw, calc(43vw - 35px)' },
  { name: 'design', label: 'DESIGN', rotation: -2, duration: 8.5, sizes: '(min-width: 600px) and (max-height: 550px) 30vw, (min-width: 1200px) 560px, (min-width: 768px) 49vw, calc(57vw - 47px)' },
];

export default function HeroWindows() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="hero-art-visuals" role="group" aria-label="AI, design, and taste">
      {WINDOWS.map(({ name, label, rotation, duration, sizes }, index) => (
        <MotionDiv
          key={name}
          className={`hero-art-window hero-art-window--${name}`}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: reduceMotion ? 0 : [0, -4, 0], rotate: reduceMotion ? rotation : [rotation, rotation + 1, rotation] }}
          transition={{
            opacity: { duration: .6, delay: index * .08 },
            y: { duration, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' },
            rotate: { duration, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' },
          }}
        >
          <img
            src={`/brand/landing-art/hero-window-${name}-480.webp`}
            srcSet={[320, 480, 960, 1280].map(width => `/brand/landing-art/hero-window-${name}-${width}.webp ${width}w`).concat(`/brand/landing-art/hero-window-${name}.webp 1774w`).join(', ')}
            sizes={sizes}
            alt={label}
            width="1774"
            height="887"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </MotionDiv>
      ))}
    </div>
  );
}
