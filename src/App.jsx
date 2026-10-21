import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion as Motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FuzzyText from './FuzzyText';
import DecryptedText from './DecryptedText';
import { NoiseOverlay, FloatingParticles } from './PortalShared';
import HeroPortfolioExperience from './HeroPortfolioExperience';
import CollageArt from './CollageArt';
import HeroWindows from './HeroWindows';
import PerspectiveWindow from './PerspectiveWindow';
import './landing-art.css';
import FeaturedProject from './FeaturedProject';
import { featuredProjects } from './portfolioProjects';
import SiteNavigation, { StudioLink } from './SiteNavigation';
import { exploreLinks, primaryLinks } from './studioNavigation';
import PortfolioButton from './PortfolioButton';
import PopsicleCompare from './PopsicleCompare';
import BrainFogIdle from './brain-fog/BrainFogIdle';
import useBrainFogIdle from './brain-fog/useBrainFogIdle';

// --- Custom Components & Styles ---

// NoiseOverlay and FloatingParticles are imported from PortalShared
// for consistent canvas grain and particle effects across all pages.

const LANDING_BACKGROUND_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/80m-background.mp4";
const LANDING_BACKGROUND_VIDEO = "/media/80m-background-scrub.mp4";
const LANDING_IDLE_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/0504(1).mp4";
const LANDING_IDLE_VIDEO = "/media/80m-hero-idle-h264.mp4";
const BRAND_MARK_BLACK = "/brand/80m-mark-black.svg";
const BACKGROUND_VIDEO_FRAME_SECONDS = 1 / 30;
const LANDING_VIDEO_BEATS = [
  { scroll: 0, video: 0 },
  { scroll: 0.08, video: 0.16 },
  { scroll: 0.18, video: 0.26 },
  { scroll: 0.29, video: 0.34 },
  { scroll: 0.37, video: 0.365 },
  { scroll: 0.389, video: 0.5 },
  { scroll: 0.45, video: 0.57 },
  { scroll: 0.58, video: 0.72 },
  { scroll: 0.76, video: 0.81 },
  { scroll: 0.94, video: 0.92 },
  { scroll: 1, video: 0.998 },
];

function clamp(value, min = 0, max = 1) {
  const number = Number.isFinite(Number(value)) ? Number(value) : min;
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(number, low), high);
}

function mapLandingVideoProgress(rawProgress, beats = LANDING_VIDEO_BEATS) {
  const progress = clamp(rawProgress);
  let previous = beats[0];

  for (let index = 1; index < beats.length; index += 1) {
    const next = beats[index];
    if (progress <= next.scroll) {
      const span = Math.max(0.0001, next.scroll - previous.scroll);
      const local = clamp((progress - previous.scroll) / span);
      return previous.video + (next.video - previous.video) * local;
    }
    previous = next;
  }

  return beats[beats.length - 1].video;
}

function getLandingElementProgress(stage, stageRect, maxScroll, selector) {
  const element = stage?.querySelector?.(selector);
  if (!element || maxScroll <= 0) return null;

  let offset = 0;
  let node = element;
  while (node && node !== stage) {
    offset += node.offsetTop || 0;
    node = node.offsetParent;
  }

  if (node === stage) {
    return clamp(offset / maxScroll);
  }

  const rect = element.getBoundingClientRect();
  return clamp((rect.top - stageRect.top) / maxScroll);
}

function buildLandingVideoBeats(stage, maxScroll, stageRect) {
  // Scene-relative cues preserve the film's pauses when copy or card heights change.
  // The opening cues retain the measured desktop/mobile choreography of the original.
  const desktop = window.matchMedia('(min-width: 768px)').matches;
  const at = (name, fraction = 0) => {
    const selector = `[data-landing-video-beat="${name}"]`;
    const start = getLandingElementProgress(stage, stageRect, maxScroll, selector);
    if (start == null) return null;
    return clamp(start + (stage.querySelector(selector).offsetHeight * fraction) / maxScroll);
  };
  const beats = [
    { scroll: 0, video: 0 },
    { scroll: desktop ? at('social', 0.3545) : at('audit', 0.8752), video: 0.16 },
    { scroll: at('internet', desktop ? 0.3489 : 0.0504), video: 0.26 },
    { scroll: desktop ? at('breath', 0.26) : at('internet', 0.9586), video: 0.34 },
    { scroll: at('hands-resolve'), video: 0.365 },
    { scroll: at('pricing'), video: 0.5 },
    { scroll: at('offer-hold', desktop ? 0.6422 : 0.8163), video: 0.57 },
    { scroll: at('handoff'), video: 0.64 },
    { scroll: at('process'), video: 0.68 },
    { scroll: at('work'), video: 0.72 },
    { scroll: at('work-reveal'), video: 0.81 },
    { scroll: at('learn'), video: 0.86 },
    { scroll: at('canairy'), video: 0.9 },
    { scroll: at('contact'), video: 0.91 },
    { scroll: at('contact-resolve'), video: 0.92 },
    { scroll: 1, video: 0.998 },
  ];
  // Missing or reordered markers are a layout error, not permission to reverse the film.
  const valid = beats.every((beat, index) => beat.scroll != null &&
    (index === 0 || (beat.scroll > beats[index - 1].scroll && beat.video >= beats[index - 1].video)));
  if (!valid) {
    console.warn('Landing video cues are missing or out of order; using fallback timing.');
    return LANDING_VIDEO_BEATS;
  }
  return beats;
}

const ScrubbablePaperBackground = ({ stageRef }) => {
  const videoRef = useRef(null);
  const idleVideoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY: pageScrollY } = useScroll();
  const idleOpacity = useTransform(pageScrollY, [0, 160, 480], [1, 0.35, 0], { clamp: true });
  const idleScale = useTransform(pageScrollY, [0, 480], [1, 1.04], { clamp: true });
  const scrubOpacity = useTransform(pageScrollY, [0, 160, 480], [0, 0.8, 1], { clamp: true });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let rafId = 0;
    let measureId = 0;
    let disposed = false;
    let stageTop = 0;
    let maxScroll = 0;
    let beats = LANDING_VIDEO_BEATS;
    let target = 0;
    let progress = 0;
    let lastFrame = 0;

    const schedule = () => {
      if (!rafId && !disposed && !document.hidden && !prefersReducedMotion) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const updateIdlePlayback = () => {
      const idleVideo = idleVideoRef.current;
      if (!idleVideo) return;
      if (window.scrollY >= 480 || document.hidden || prefersReducedMotion) {
        idleVideo.pause();
      } else if (idleVideo.paused) {
        idleVideo.play().catch(() => {});
      }
    };

    const updateTarget = () => {
      target = mapLandingVideoProgress(maxScroll > 0 ? (window.scrollY - stageTop) / maxScroll : 0, beats);
      updateIdlePlayback();
      schedule();
    };

    // Measure only when the layout changes, never in the scroll/frame loop.
    const measure = () => {
      measureId = 0;
      if (disposed) return;
      const stage = stageRef?.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        stageTop = rect.top + window.scrollY;
        maxScroll = stage.offsetHeight - window.innerHeight;
        beats = buildLandingVideoBeats(stage, maxScroll, rect);
      } else {
        stageTop = 0;
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      }
      updateTarget();
    };

    const queueMeasure = () => {
      if (!measureId && !disposed) measureId = requestAnimationFrame(measure);
    };

    function animate(now) {
      rafId = 0;
      if (disposed || document.hidden || prefersReducedMotion || !Number.isFinite(video.duration) || video.readyState < 2) return;
      // Finish the current decode before seeking again. seeked wakes the loop.
      if (video.seeking) return;
      const elapsed = lastFrame ? Math.min(now - lastFrame, 64) : 16;
      lastFrame = now;
      progress += (target - progress) * (1 - Math.exp(-elapsed / 60));
      const duration = Math.max(0, video.duration - BACKGROUND_VIDEO_FRAME_SECONDS);
      const nextTime = Math.min(duration, Math.round(progress * duration / BACKGROUND_VIDEO_FRAME_SECONDS) * BACKGROUND_VIDEO_FRAME_SECONDS);
      if (Math.abs(video.currentTime - nextTime) >= BACKGROUND_VIDEO_FRAME_SECONDS / 2) {
        video.currentTime = nextTime;
        return;
      }
      if (Math.abs(target - progress) * duration > BACKGROUND_VIDEO_FRAME_SECONDS / 2) schedule();
    }

    const onVisibilityChange = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastFrame = 0;
      updateTarget();
    };

    const resizeObserver = new ResizeObserver(queueMeasure);
    resizeObserver.observe(stageRef?.current || document.documentElement);
    video.addEventListener("loadeddata", schedule);
    video.addEventListener("seeked", schedule);
    window.addEventListener("resize", queueMeasure, { passive: true });
    window.addEventListener("scroll", updateTarget, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.fonts.ready.then(queueMeasure);
    measure();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(measureId);
      resizeObserver.disconnect();
      video.removeEventListener("loadeddata", schedule);
      video.removeEventListener("seeked", schedule);
      window.removeEventListener("resize", queueMeasure);
      window.removeEventListener("scroll", updateTarget);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [prefersReducedMotion, stageRef]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#137eb6]">
      <Motion.video
        ref={idleVideoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-100 saturate-[1.12] contrast-[1.06]"
        style={{ opacity: idleOpacity, scale: idleScale }}
        muted
        playsInline
        autoPlay={!prefersReducedMotion}
        loop
        preload="auto"
        disablePictureInPicture
      >
        <source src={LANDING_IDLE_VIDEO} type="video/mp4" />
        <source src={LANDING_IDLE_SOURCE_VIDEO} type="video/mp4" />
      </Motion.video>
      <Motion.video
        ref={videoRef}
        className="absolute inset-0 z-10 h-full w-full object-cover saturate-[1.15] contrast-[1.08]"
        style={{ opacity: scrubOpacity }}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      >
        <source src={LANDING_BACKGROUND_VIDEO} type="video/mp4" />
        <source src={LANDING_BACKGROUND_SOURCE_VIDEO} type="video/mp4" />
      </Motion.video>
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(234,231,222,0.16),transparent_30%),linear-gradient(90deg,rgba(234,231,222,0.18),rgba(234,231,222,0.04)_48%,rgba(4,60,95,0.08))]" />
      <div className="absolute inset-0 z-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-25 mix-blend-overlay" />
    </div>
  );
};

const MacWindow = ({ children, title = "80m_Studio.app", className = "", contentClass = "bg-[#111]" }) => (
  <div className={`border border-[#111] bg-[#1a1a1a] rounded-lg overflow-hidden flex flex-col ${className}`}>
    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center border-b border-[#111] shrink-0">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
      </div>
      <div className="flex-1 text-center text-[10px] font-sans text-[#a0a0a0] tracking-wide select-none">
        {title}
      </div>
    </div>
    <div className={`relative flex-1 overflow-hidden ${contentClass}`}>
      {children}
    </div>
  </div>
);

// --- ASCII Shadow Component ---
// Each character cell randomly flickers through block density chars independently —
// like living CRT static. Heavy chars (█▓) near the element edge, lighter (░ ) further out.
const DENSITY = [
  ' ', ' ', ' ',
  '.', ',', ':', ';', '!', '|', '-', '+', '=', '*', '#', '@', '%', '$', '&',
  '░', '░', '▒', '▒', '▓', '█', '▓', '▒', '░',
  '┼', '┤', '├', '┬', '┴', '╋', '╂', '┃', '━', '╾', '╼',
  '▪', '▫', '◆', '◇', '○', '●', '◉', '◎', '◈',
  '⌂', '⌘', '⌛', '⊕', '⊗', '⊞', '⊟', '⊠',
  '‡', '†', '§', '¶', '©', '®', '™',
];
const CORNER_CHARS = ['╝', '╗', '╬', '▓', '█', '╋', '┼', '◆', '⊕', '▓', '╬', '╝', '◉', '⊞', '┃'];

const AsciiShadow = ({ children, size = 'lg', className = '', color = '#111', rotate = '0deg' }) => {
  const rootRef = useRef(null);
  const bottomRef = useRef(null);
  const rightRef = useRef(null);
  const cornerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const offset = size === 'sm' ? 12 : 16;
  const fontSize = size === 'sm' ? 9 : 11;

  // One clock and three text nodes per visible shadow, rather than a timer
  // and React state update for every character (including offscreen cells).
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    let timer;
    let disposed = false;
    let visible = false;
    let corner = 0;
    const bottom = Array.from({ length: 120 }, () => DENSITY[Math.floor(Math.random() * DENSITY.length)]);
    const right = Array.from({ length: 60 }, () => DENSITY[Math.floor(Math.random() * DENSITY.length)]);

    const tick = () => {
      if (disposed || !bottomRef.current || !rightRef.current || !cornerRef.current) return;
      for (const strip of [bottom, right]) {
        for (let index = 0; index < strip.length; index++) {
          if (Math.random() < 0.25) strip[index] = DENSITY[Math.floor(Math.random() * DENSITY.length)];
        }
      }
      bottomRef.current.textContent = bottom.join('');
      rightRef.current.textContent = right.join('\n');
      cornerRef.current.textContent = CORNER_CHARS[corner++ % CORNER_CHARS.length];
    };
    const update = () => {
      clearInterval(timer);
      if (!disposed && visible && !document.hidden) {
        tick();
        timer = setInterval(tick, 240);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { rootMargin: '100px' });
    observer.observe(rootRef.current);
    document.addEventListener('visibilitychange', update);
    return () => {
      disposed = true;
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      style={{ transform: rotate !== '0deg' ? `rotate(${rotate})` : undefined }}
    >
      {/* Content on top */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Bottom strip */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -offset,
          left: offset,
          right: 0,
          height: offset,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          fontSize,
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        <span ref={bottomRef} style={{ color, fontFamily: 'monospace', whiteSpace: 'pre', userSelect: 'none' }}>{'▓▒░╂━ ▒░┼ '.repeat(12)}</span>
      </div>

      {/* Right strip */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -offset,
          top: offset,
          bottom: 0,
          width: offset,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize,
          lineHeight: 1.1,
          letterSpacing: 0,
        }}
      >
        <span ref={rightRef} style={{ color, fontFamily: 'monospace', whiteSpace: 'pre', userSelect: 'none' }}>{'▓\n▒\n░\n╂\n━\n '.repeat(10)}</span>
      </div>

      {/* Corner */}
      <div
        ref={cornerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -offset,
          right: -offset,
          width: offset,
          height: offset,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize,
          color,
          userSelect: 'none',
        }}
      >
        ╝
      </div>
    </div>
  );
};

// Parallax Image Component for massive scrolling elements
const ParallaxImage = ({ src, alt, className = "", imgClassName = "", offset = 100 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <Motion.div ref={ref} style={{ y }} className={`relative flex justify-center ${className}`}>
       <img src={src} alt={alt} className={`mix-blend-multiply ${imgClassName}`} />
    </Motion.div>
  );
};

// --- Terminal CRT Node Component ---
const TerminalNode = ({ title, desc, index = 0, isLast = false }) => (
  <Motion.div variants={fadeUp} className="relative mt-8 lg:mt-0 pt-6 md:pt-14 pl-6 lg:pl-0 h-full group z-20">

    {/* --- DESKTOP WIRING (lg+) --- */}
    {/* Horizontal bus segment spanning to the next node's center (gap is lg:gap-12 = 3rem) */}
    {!isLast && <div className="hidden lg:block absolute top-[28px] left-1/2 w-[calc(100%+3rem)] h-[2px] data-line-glow z-0" />}

    {/* Vertical stem dropping from the bus down TO the terminal border (56px) */}
    <div className="hidden lg:block absolute top-[28px] left-1/2 w-[2px] h-[28px] data-line-glow -translate-x-1/2 z-0" />

    {/* Junction connection dot (top of stem) */}
    <div className="hidden lg:block absolute top-[28px] left-1/2 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e,0_0_20px_#22c55e] -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-[#111]" />

    {/* Port Connection block (docking to the top border of the terminal) */}
    <div className="hidden lg:block absolute top-[56px] left-1/2 w-5 h-[3px] bg-green-500 shadow-[0_0_10px_#22c55e] -translate-x-1/2 -translate-y-full z-10" />

    {/* Desktop: The Central Injection Join from the PC */}
    {index === 1 && (
      <div className="hidden lg:block absolute top-[28px] -right-[1.5rem] w-4 h-4 rounded-full bg-[#fbbf24] shadow-[0_0_15px_#fbbf24,0_0_30px_#fbbf24] -translate-y-1/2 translate-x-1/2 z-20 border-2 border-[#111] animate-pulse" />
    )}


    {/* --- MOBILE / TABLET WIRING (<lg) --- */}
    {/* Vertical left trunk passing by */}
    <div className="block lg:hidden absolute top-0 bottom-[-2rem] left-0 w-[2px] data-line-glow z-0" />

    {/* Horizontal tap into the node (node pt-6 is 24px, tap at 40px) */}
    <div className="block lg:hidden absolute top-[40px] left-0 w-6 h-[2px] data-line-glow z-0" />

    {/* Interface tap connection dot at border (pl-6 is 24px) */}
    <div className="block lg:hidden absolute top-[40px] left-[24px] w-[3px] h-5 bg-green-500 shadow-[0_0_8px_#22c55e] -translate-y-1/2 z-10 -ml-[2px]" />


    <div className="crt-terminal w-full h-auto min-h-[300px] relative flex flex-col pb-6 border-[3px] border-green-500/80 bg-[#060606] text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 z-20">
      {/* Decorative header - in normal flow */}
      <div className="w-full h-8 bg-green-500/10 border-b-2 border-green-500/30 flex items-center px-4 z-30 shrink-0">
        <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#22c55e] font-bold opacity-90 drop-shadow-[0_0_2px_#22c55e] pb-[1px]">SYS.NODE_{title.replace(' ', '_').toUpperCase()}</span>
      </div>

      <div className="relative z-20 px-6 pt-4 font-mono flex-1 flex flex-col">
        <h4 className="font-bold text-xl uppercase tracking-widest mb-4 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"><span className="animate-pulse mr-2 text-green-400">█</span>{title}</h4>
        <p className="text-sm leading-relaxed text-[#22c55e] opacity-90 mix-blend-screen h-auto overflow-visible">{desc}</p>
      </div>
    </div>
  </Motion.div>
);

// --- Framer Motion Variants ---

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- ATM Scrollbar Component ---
// Accepts optional scrollRef — if provided, scrolls that element instead of window
const AtmScrollbar = ({ scrollRef: externalScrollRef, zIndexClass = 'z-[100]', topInset = 16 }) => {
  const internalScrollRef = useRef(null);
  const scrollRef = externalScrollRef || internalScrollRef;
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const thumbTravelRef = useRef(1);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDir, setScrollDir] = useState('down');
  const lastScrollY = useRef(0);
  const rafRef = useRef(null);

  const isElementMode = !!externalScrollRef;

  const getScrollInfo = useCallback(() => {
    if (isElementMode) {
      const el = scrollRef.current;
      if (!el) return { scrollTop: 0, scrollHeight: 0, clientHeight: 0, maxScroll: 0 };
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      return { scrollTop, scrollHeight, clientHeight, maxScroll };
    } else {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;
      return { scrollTop, scrollHeight, clientHeight, maxScroll };
    }
  }, [isElementMode, scrollRef]);

  const scrollTo = (scrollTop) => {
    if (isElementMode) {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: scrollTop, behavior: 'instant' });
    } else {
      window.scrollTo({ top: scrollTop, behavior: 'instant' });
    }
  };

  useEffect(() => {
    let scrollTimeout;

    const measureTrack = () => {
      if (!trackRef.current) return;
      let top = topInset;
      let bottom = 16;
      if (isElementMode && scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        top = Math.max(top, rect.top + 16);
        bottom = Math.max(bottom, window.innerHeight - rect.bottom + 16);
      }
      trackRef.current.style.top = `${top}px`;
      trackRef.current.style.bottom = `${bottom}px`;
      thumbTravelRef.current = Math.max(1, window.innerHeight - top - bottom - 96);
    };

    const updateProgress = () => {
      rafRef.current = null;
      // A route change can detach the thumb before effect cleanup cancels a frame.
      if (!thumbRef.current) return;
      const { scrollTop, maxScroll } = getScrollInfo();
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      // The independent translate property keeps this compositor-only and
      // prevents the thumb's 75% scale from shrinking its travel distance.
      thumbRef.current.style.translate = `0 ${progress * thumbTravelRef.current}px`;
      setIsAtBottom(progress >= 0.98);

      if (scrollTop > lastScrollY.current) {
        setScrollDir('down');
      } else if (scrollTop < lastScrollY.current) {
        setScrollDir('up');
      }
      lastScrollY.current = scrollTop;
    };

    const handleScroll = () => {
      if (!thumbRef.current) return;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(updateProgress);

      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    const thumb = thumbRef.current;
    const handleResize = () => {
      measureTrack();
      handleScroll();
    };
    const handleWheel = (event) => {
      const el = scrollRef.current;
      if (!el) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientHeight : 1;
      el.scrollBy({ top: event.deltaY * unit, behavior: 'instant' });
    };
    measureTrack();

    if (isElementMode) {
      const el = scrollRef.current;
      if (el) {
        el.addEventListener('scroll', handleScroll, { passive: true });
        thumb?.addEventListener('wheel', handleWheel, { passive: false });
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(el);
        window.addEventListener('resize', handleResize, { passive: true });
        updateProgress();
        return () => {
          el.removeEventListener('scroll', handleScroll);
          thumb?.removeEventListener('wheel', handleWheel);
          resizeObserver.disconnect();
          window.removeEventListener('resize', handleResize);
          clearTimeout(scrollTimeout);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
      }
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize, { passive: true });
      updateProgress();
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        clearTimeout(scrollTimeout);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [getScrollInfo, isElementMode, scrollRef, topInset]);

  return (
    <>
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: scaleX(1) scaleY(1); opacity: 0.9; }
          25% { transform: scaleX(1.1) scaleY(1.2); opacity: 1; }
          50% { transform: scaleX(0.9) scaleY(0.8); opacity: 0.8; }
          75% { transform: scaleX(1.15) scaleY(1.1); opacity: 0.95; }
        }
        .flame-base { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); transform-origin: bottom center; }
        .flame-1 { animation: flameFlicker 0.4s infinite alternate; }
        .flame-2 { animation: flameFlicker 0.3s infinite alternate-reverse delay-100; clip-path: polygon(50% 0%, 15% 100%, 85% 100%); }
        .flame-3 { animation: flameFlicker 0.5s infinite alternate delay-75; clip-path: polygon(50% 0%, 25% 100%, 75% 100%); }
        @keyframes dropMoney {
          0% { transform: translateY(0px) scale(0.5) rotate(0deg); opacity: 0; }
          15% { opacity: 1; transform: translateY(10px) scale(0.7) rotate(5deg); }
          85% { opacity: 1; }
          100% { transform: translateY(140px) scale(1) rotate(20deg); opacity: 0; }
        }
        @keyframes dropMoneyAlt {
          0% { transform: translateY(0px) scale(0.5) rotate(0deg); opacity: 0; }
          15% { opacity: 1; transform: translateY(10px) scale(0.7) rotate(-5deg); }
          85% { opacity: 1; }
          100% { transform: translateY(140px) scale(1) rotate(-20deg); opacity: 0; }
        }
        @keyframes suckMoney {
          0% { transform: translateY(140px) scale(1) rotate(20deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; transform: translateY(10px) scale(0.7) rotate(5deg); }
          100% { transform: translateY(0px) scale(0.5) rotate(0deg); opacity: 0; }
        }
        @keyframes suckMoneyAlt {
          0% { transform: translateY(140px) scale(1) rotate(-20deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; transform: translateY(10px) scale(0.7) rotate(-5deg); }
          100% { transform: translateY(0px) scale(0.5) rotate(0deg); opacity: 0; }
        }
        .money-drop { animation: dropMoney 0.6s infinite linear; }
        .money-drop-alt { animation: dropMoneyAlt 0.6s infinite linear; }
        .money-suck { animation: suckMoney 0.6s infinite linear; }
        .money-suck-alt { animation: suckMoneyAlt 0.6s infinite linear; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        @keyframes flashVintageYellow { 0%, 100% { background-color: #facc15; } 50% { background-color: #eab308; } }
        .screen-flash { animation: flashVintageYellow 1s infinite; }
      `}</style>
      <div
        ref={trackRef}
        className={`fixed right-2 top-4 bottom-4 w-16 ${zIndexClass} pointer-events-none flex justify-center`}
        style={{ pointerEvents: 'none', top: topInset }}
      >
        <div className={`absolute bottom-0 w-12 h-6 transition-all duration-500 ease-out ${isAtBottom ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-50'}`}>
           <div className="absolute bottom-0 w-full h-2 bg-green-500 border border-green-700 rounded-sm rotate-2 shadow-sm"></div>
           <div className="absolute bottom-1 w-full h-2 bg-green-600 border border-green-800 rounded-sm -rotate-3 shadow-sm left-0.5"></div>
           <div className="absolute bottom-2 w-11 h-2 bg-green-500 border border-green-700 rounded-sm rotate-1 shadow-sm right-0.5"></div>
           <div className="absolute bottom-3 w-10 h-2 bg-green-400 border border-green-600 rounded-sm -rotate-2 shadow-sm left-1"></div>
        </div>
        <div
          ref={thumbRef}
          onPointerDown={(e) => {
            e.preventDefault();
            const target = e.currentTarget;
            target.setPointerCapture(e.pointerId);

            let startY = e.clientY;
            const { scrollTop: startScrollTop, maxScroll } = getScrollInfo();

            const handlePointerMove = (moveEvent) => {
              const deltaY = moveEvent.clientY - startY;
              if (maxScroll <= 0) return;
              const trackHeight = thumbTravelRef.current;
              const progressDelta = deltaY / trackHeight;
              const targetScrollTop = startScrollTop + (progressDelta * maxScroll);
              scrollTo(Math.max(0, Math.min(maxScroll, targetScrollTop)));
            };

            const handlePointerUp = (upEvent) => {
              target.releasePointerCapture(upEvent.pointerId);
              target.removeEventListener('pointermove', handlePointerMove);
              target.removeEventListener('pointerup', handlePointerUp);
            };

            target.addEventListener('pointermove', handlePointerMove);
            target.addEventListener('pointerup', handlePointerUp);
          }}
          className={`absolute w-14 h-32 flex flex-col items-center transition-transform duration-75 ease-out origin-top scale-75 cursor-grab active:cursor-grabbing pointer-events-auto touch-none ${isScrolling && !isAtBottom ? 'rotate-1' : 'rotate-0'}`}
          style={{ top: 0 }}
        >
          <div className={`absolute -top-12 w-full h-14 flex justify-center items-end z-[-1] transition-opacity duration-300 ${isScrolling && !isAtBottom ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`absolute bottom-0 w-full h-full flex justify-center items-end transition-transform duration-300 origin-bottom ${isScrolling && !isAtBottom ? 'scale-y-100' : 'scale-y-0'}`}>
              <div className="flame-base flame-1 absolute w-8 h-12 bg-orange-600 mix-blend-multiply opacity-90 -ml-4"></div>
              <div className="flame-base flame-2 absolute w-7 h-14 bg-yellow-400 opacity-100 ml-1"></div>
              <div className="flame-base flame-3 absolute w-9 h-10 bg-orange-500 mix-blend-multiply opacity-90 ml-4"></div>
            </div>
          </div>
          <div className="w-14 h-32 bg-[#dfddd0] rounded-[4px] shadow-lg border-b-4 border-r-[3px] border-[#b5b3a3] relative p-1 flex flex-col items-center z-10">
            <div className="w-12 h-10 bg-[#2e2d2b] rounded-[3px] border-[1.5px] border-[#1f1e1c] flex items-center justify-center p-[2px] shadow-inner mt-0.5">
              <div className={`w-full h-full rounded-[2px] overflow-hidden flex flex-col items-center justify-center transition-colors duration-200 relative ${isAtBottom ? 'bg-[#facc15]' : 'bg-[#111111]'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2px]"></div>
                {isAtBottom ? (
                  <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-sm">
                    <circle cx="7" cy="9" r="2" fill="#111" />
                    <circle cx="17" cy="9" r="2" fill="#111" />
                    <path d="M6 13.5c2.5 3.5 7.5 3.5 12 0" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                ) : (
                  <span className="text-[5px] text-emerald-500 font-mono opacity-60">ATM</span>
                )}
              </div>
            </div>
            <div className="w-12 flex justify-between items-center mt-1 px-0.5">
              <div className="flex gap-[1px]">
                {[...Array(6)].map((_, i) => <div key={i} className="w-[1px] h-1.5 bg-black/20"></div>)}
              </div>
              <div className="w-1.5 h-1 bg-black rounded-[0.5px]"></div>
            </div>
            <div className="w-10 mt-2.5 bg-[#cbc9ba] p-1 rounded-[2px] shadow-inner border-t border-l border-black/10">
              <div className="grid grid-cols-3 gap-[1.5px]">
                {[...Array(12)].map((_, i) => <div key={i} className="h-[2px] bg-[#444] rounded-[0.5px] shadow-sm"></div>)}
              </div>
            </div>
            <div className="w-full flex justify-end px-2 mt-2">
              <div className="flex flex-col items-center gap-[1px]">
                <div className="w-3 h-[1.5px] bg-zinc-800 shadow-inner rounded-full"></div>
                <div className="w-[2px] h-[2px] rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></div>
              </div>
            </div>
            <div className="mt-auto mb-1 w-11 h-2.5 relative flex items-center justify-center">
              <div className={`absolute top-0 left-0 w-full h-full flex justify-center z-0 transition-opacity duration-200 ${isScrolling && !isAtBottom ? 'opacity-100' : 'opacity-0'}`}>
                {isScrolling && !isAtBottom && scrollDir === 'down' && (
                  <>
                    <div className="money-drop absolute w-6 h-3 bg-green-500 border border-green-700 shadow-sm top-1"></div>
                    <div className="money-drop-alt delay-1 absolute w-5 h-2.5 bg-green-600 border border-green-800 shadow-sm top-1 right-0"></div>
                    <div className="money-drop delay-2 absolute w-6 h-3 bg-green-500 border border-green-700 shadow-sm top-1 left-0"></div>
                  </>
                )}
                {isScrolling && !isAtBottom && scrollDir === 'up' && (
                  <>
                    <div className="money-suck absolute w-6 h-3 bg-green-500 border border-green-700 shadow-sm top-1"></div>
                    <div className="money-suck-alt delay-1 absolute w-5 h-2.5 bg-green-600 border border-green-800 shadow-sm top-1 right-0"></div>
                    <div className="money-suck delay-2 absolute w-6 h-3 bg-green-500 border border-green-700 shadow-sm top-1 left-0"></div>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-zinc-400 rounded-sm border-[1px] border-zinc-500 flex items-center justify-center shadow-inner z-10">
                 <div className="w-8 h-[1.5px] bg-zinc-900 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


// --- Main App Component ---

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b-2 mp4-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full py-6 md:py-8 flex justify-between items-center text-left hover:bg-white/5 transition-colors px-4 group"
      >
        <span className="font-sans font-bold text-xl md:text-2xl mp4-ink pr-8">{question}</span>
        <span className="text-3xl font-mono font-light mp4-muted group-hover:text-white transition-colors">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-8 text-lg md:text-xl mp4-muted font-serif leading-relaxed">
              {answer}
            </p>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Re-export AtmScrollbar so PortalPage can use the same component
export { AtmScrollbar };

export default function App() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const brainFog = useBrainFogIdle({ disabled: showPortfolio });

  const landingRef = useRef(null);
  const portfolioTriggerRef = useRef(null);
  const portfolioScrollRef = useRef(0);

  const openPortfolio = (event) => {
    event?.preventDefault();
    portfolioTriggerRef.current = event?.currentTarget || document.activeElement;
    portfolioScrollRef.current = window.scrollY;
    setShowPortfolio(true);
  };

  const closePortfolio = () => {
    setShowPortfolio(false);
    requestAnimationFrame(() => {
      window.scrollTo({ top: portfolioScrollRef.current, behavior: 'instant' });
      portfolioTriggerRef.current?.focus({ preventScroll: true });
    });
  };

  // --- Scroll animations for "Digitizing" the U-Curve Images ---
  const handsRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: handsProgress } = useScroll({ target: handsRef, offset: ["start start", "end start"] });
  // Function transforms keep these on the measured scene progress. A native
  // ViewTimeline exit range covers only the final viewport of this tall hold.
  const handsResolveOpacity = useTransform(() => clamp((handsProgress.get() - 0.53) / 0.09));
  const handsResolveY = useTransform(() => 16 * (1 - clamp((handsProgress.get() - 0.53) / 0.09)));
  const handsQuestionOpacity = useTransform(() => 1 - clamp((handsProgress.get() - 0.45) / 0.05));
  const auditRef = useRef(null);
  const { scrollYProgress: auditProgress } = useScroll({
    target: auditRef,
    offset: ["start start", "end top"]
  });

  const suckX1 = useTransform(auditProgress, [0, 0.6, 1], ["0vw", "0vw", "60vw"]);
  const suckY1 = useTransform(auditProgress, [0, 0.6, 1], ["0vh", "0vh", "35vh"]);
  const suckRotate1 = useTransform(auditProgress, [0, 0.6, 1], [-4, -4, 180]);
  const suckX2 = useTransform(auditProgress, [0, 0.6, 1], ["0vw", "0vw", "45vw"]);
  const suckY2 = useTransform(auditProgress, [0, 0.6, 1], ["0vh", "0vh", "35vh"]);
  const suckRotate2 = useTransform(auditProgress, [0, 0.6, 1], [0, 0, 180]);
  const suckX3 = useTransform(auditProgress, [0, 0.6, 1], ["0vw", "0vw", "30vw"]);
  const suckY3 = useTransform(auditProgress, [0, 0.6, 1], ["0vh", "0vh", "35vh"]);
  const suckRotate3 = useTransform(auditProgress, [0, 0.6, 1], [4, 4, 180]);
  const suckScale = useTransform(auditProgress, [0, 0.6, 0.95], [1, 1, 0]);
  const digitizeOpacity = useTransform(auditProgress, [0.7, 0.95], [1, 0]);

  const digitizeFilter = useTransform(
    auditProgress,
    [0, 0.5, 1],
    [
      "contrast(1.25) sepia(0) hue-rotate(0deg) blur(0px) brightness(1)",
      "contrast(2) sepia(1) hue-rotate(90deg) blur(2px) brightness(1.2)",
      "contrast(3) sepia(1) hue-rotate(180deg) blur(5px) brightness(1.5)"
    ]
  );

  const digitizeFilter3 = useTransform(
    auditProgress,
    [0, 0.5, 1],
    [
      "contrast(1.25) sepia(0.3) hue-rotate(0deg) blur(0px) brightness(1)",
      "contrast(2) sepia(1) hue-rotate(90deg) blur(2px) brightness(1.2)",
      "contrast(3) sepia(1) hue-rotate(180deg) blur(5px) brightness(1.5)"
    ]
  );

  return (
    <div className="min-h-screen text-white font-sans selection:bg-[#111] selection:text-[#eae7de] relative isolate">
      <HeroPortfolioExperience isOpen={showPortfolio} onClose={closePortfolio} />
      {brainFog.phase !== 'idle' && <BrainFogIdle {...brainFog} />}
      <div className="contents" inert={showPortfolio || brainFog.phase === 'open'}>
      <ScrubbablePaperBackground stageRef={landingRef} />
      <NoiseOverlay />
      <FloatingParticles />

      <AtmScrollbar topInset={112} />

      <SiteNavigation onOpenPortfolio={openPortfolio} />

      <main id="top" tabIndex={-1} ref={landingRef} className="landing-nav-target relative z-10 pb-32 pl-4 pr-14 md:px-8 max-w-[1200px] mx-auto">


        {/* Editorial Hero Section */}
        <section className="hero-art-scene relative min-h-[300vh] md:min-h-[320vh] w-full overflow-visible">
          <div className="sticky top-0 h-screen w-full pt-24 md:pt-0 overflow-visible">
            <HeroWindows />

            <Motion.div
              className="hero-art-copy"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <Motion.div className="hero-art-services" variants={fadeUp}>
                <p>Apps. Websites. Content.</p>
                <p>Built with taste. Made to work.</p>
              </Motion.div>
              <Motion.h1 variants={fadeUp} className="hero-art-heading">
                <CollageArt name="hero-ideas" text="You’ve got ideas. Let’s make them real." eager />
              </Motion.h1>

              <Motion.div variants={fadeUp} className="hero-art-actions">
                <Link to="/book" className="hero-project-link">Start a project <span aria-hidden="true">↗</span></Link>
                <PortfolioButton onClick={openPortfolio} />
              </Motion.div>
              <Motion.p variants={fadeUp} className="hero-art-invitation">
                Bring the idea. The rough draft. The thing you almost finished.
              </Motion.p>
            </Motion.div>
          </div>
        </section>

        {/* --- DOES YOUR BRANDING SUCK RICHARD? (Popsicle audit grid) --- */}
        <section id="audit" data-landing-video-beat="audit" ref={auditRef} className="relative min-h-[360vh] md:min-h-[400vh] scroll-mt-0 px-4 md:px-8 mx-auto" style={{ maxWidth: '1400px' }}>
          <div className="audit-art-hold sticky top-0 z-10 h-screen overflow-hidden">
            <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={staggerContainer} className="audit-art-scene relative z-10 h-full w-full">
              <div className="audit-art-copy">
                <Motion.h2 variants={fadeUp} className="audit-art-heading">
                  <CollageArt name="rough-drafts" text="Bad website? Weird AI art? Half-built app?" />
                </Motion.h2>
                <Motion.div inherit={false} style={{ opacity: digitizeOpacity }} className="audit-art-invitation">
                  <p id="audit-interaction-hint">
                    <span className="audit-hint-mouse">Hover or click a popsicle.</span>
                    <span className="audit-hint-touch">Tap a popsicle.</span>
                    <strong>See the rework. <span aria-hidden="true">↗</span></strong>
                  </p>
                  <span className="audit-art-sticker" aria-hidden="true">
                    <img src="https://i.postimg.cc/nLtSqBSh/icon.png" alt="" width="1280" height="723" />
                  </span>
                </Motion.div>
              </div>

              <div className="audit-art-popsicles" role="group" aria-label="Before and after reworks">
                <Motion.div
                  style={{ x: suckX1, y: suckY1, rotate: suckRotate1, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter }}
                  className="audit-art-popsicle"
                >
                  <PopsicleCompare label="Rough graphics" before="https://i.postimg.cc/bNKHDn37/bad-graphic-design.png" after="https://i.postimg.cc/R0VsyTc2/bad-graphic-design-hover.png" width={537} />
                </Motion.div>

                <Motion.div
                  style={{ x: suckX2, y: suckY2, rotate: suckRotate2, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter }}
                  className="audit-art-popsicle"
                >
                  <PopsicleCompare label="Old websites" before="https://i.postimg.cc/jdGQwfZB/old-webpage.png" after="https://i.postimg.cc/MGKPNYyh/old-webpage-hover.png" />
                </Motion.div>

                <Motion.div
                  style={{ x: suckX3, y: suckY3, rotate: suckRotate3, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter3 }}
                  className="audit-art-popsicle"
                >
                  <PopsicleCompare label="AI drafts" before="https://i.postimg.cc/dtzmkC5M/chat-gpt.png" after="https://i.postimg.cc/KYvqw5n6/chat-gpt-hover.png" />
                </Motion.div>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* --- SOCIAL CONTENT (Tired of feeding the algorithm?) --- */}
        <section data-landing-video-beat="social" className="mt-12 md:mt-20 px-4 md:px-8 relative min-h-[290vh] md:min-h-[320vh] mx-auto" style={{ maxWidth: '1400px' }}>
          <div className="sticky top-0 h-screen overflow-hidden py-16 md:py-20">
            <Motion.div className="relative h-full w-full" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
              <div className="social-art-copy">
                <Motion.h3 variants={fadeUp}>
                  <CollageArt name="feeding-the-algorithm" text="Tired of feeding the algorithm?" />
                </Motion.h3>
                <Motion.p variants={fadeUp} className="mt-6 max-w-[260px] md:max-w-sm font-sans text-base md:text-xl leading-snug text-white drop-shadow-[2px_2px_0_#111]">Social visuals, launch content, and a look people recognize.</Motion.p>
              </div>
              <Motion.div
                className="social-art-illustration absolute right-[-30vw] z-20 w-[92vw] max-w-[620px] md:right-[-5vw] md:w-[58vw] md:max-w-[760px] pointer-events-none"
                variants={fadeUp}
                style={{ filter: 'drop-shadow(0 28px 48px rgba(0,0,0,0.36))' }}
              >
                <ParallaxImage
                  src="https://i.postimg.cc/528n9j4K/why-battle-with-computers.png"
                  alt="Battle with computers graphic"
                  className="w-full"
                  imgClassName="w-full max-w-none origin-center filter contrast-125 saturate-110"
                  offset={34}
                />
              </Motion.div>
            </Motion.div>
          </div>
        </section>

        {/* --- THE INTERNET IS HARD (Split poster beats) --- */}
        <section id="poster" className="scroll-mt-0 mt-20 md:mt-28 px-4 md:px-8 text-center mx-auto relative" style={{ maxWidth: '1100px' }}>
          <div data-landing-video-beat="internet" className="relative min-h-[260vh] md:min-h-[300vh]">
            <div className="sticky top-0 min-h-screen flex items-center justify-center py-14 md:py-20">
              <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={staggerContainer} className="w-full">
                <Motion.h2 variants={fadeUp} className="scene-art-heading scene-art-heading--poster">
                  <CollageArt name="internet-hard" text="The internet is hard!" />
                </Motion.h2>
              </Motion.div>
            </div>
          </div>

          <div data-landing-video-beat="breath" className="h-[42vh] md:h-[58vh]" aria-hidden="true" />

          <div ref={handsRef} className="relative min-h-[250vh] md:min-h-[290vh]">
            <span data-landing-video-beat="hands-resolve" className="pointer-events-none absolute top-[66.1%] h-px w-px" aria-hidden="true" />
            <span data-landing-video-beat="hands" className="pointer-events-none absolute left-0 top-[38vh] h-px w-px opacity-0" aria-hidden="true" />
            <div className="sticky top-0 min-h-screen flex items-center py-14 md:py-20">
              <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer} className="w-full">
                <div className="hands-art-stage">
                  <Motion.h3 inherit={false} style={{ opacity: prefersReducedMotion ? 0 : handsQuestionOpacity }} className="hands-art-question">
                    <CollageArt name="hands-tied" text="Are your hands tied with real life sh*t?" />
                  </Motion.h3>
                  <Motion.p inherit={false} style={{ opacity: prefersReducedMotion ? 1 : handsResolveOpacity, y: prefersReducedMotion ? 0 : handsResolveY }} className="hands-art-answer">
                    <CollageArt name="take-it-from-here" text="We can take it from here." />
                  </Motion.p>
                </div>
                <div className="hands-art-windows">
                  <Motion.div variants={fadeUp}>
                    <PerspectiveWindow variant="2" src="https://i.postimg.cc/Gmvq39LX/internet-is-hard.png" alt="Internet is hard poster" />
                  </Motion.div>
                  <Motion.div variants={fadeUp}>
                    <PerspectiveWindow variant="5" src="https://i.postimg.cc/K8tJc4GN/hand-tied-with-real-life-sh-t.png" alt="Hand tied by real life" />
                  </Motion.div>
                </div>
              </Motion.div>
            </div>
          </div>
        </section>

        {/* ── WAYS IN SECTION ── */}
        <section id="ways-in" className="scroll-mt-0 mt-32 md:mt-44 px-4 md:px-8 relative mx-auto" aria-labelledby="ways-in-heading" style={{ maxWidth: '1400px' }}>
          <span data-landing-video-beat="pricing" className="pointer-events-none absolute left-0 top-[28vh] h-px w-px opacity-0" aria-hidden="true" />
          <div data-landing-video-beat="offer-hold" className="relative h-[190vh] md:h-[220vh]">
            <div className="sticky top-0 z-10 flex h-screen items-center justify-center text-center pointer-events-none">
              <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.55 }} variants={staggerContainer} className="ways-art-intro max-w-5xl px-2">
                <Motion.p variants={fadeUp} className="font-mono uppercase tracking-[0.25em] mb-6 text-xs md:text-sm font-bold mp4-muted">// ways in</Motion.p>
                <Motion.h2 id="ways-in-heading" variants={fadeUp} className="scene-art-heading scene-art-heading--ways">
                  <CollageArt name="four-ways" text="One studio. Four ways forward." />
                </Motion.h2>
                <Motion.p variants={fadeUp} className="ways-art-summary font-sans text-lg md:text-2xl mp4-muted font-medium max-w-2xl mx-auto">
                  Custom builds, project rescue, sharper visuals, and the skills to do it yourself.
                </Motion.p>
                <Motion.div variants={fadeUp} className="ways-art-options mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 pointer-events-auto">
                  {['Build it', 'Fix it', 'Make it look right', 'Learn it'].map((label) => (
                    <span key={label} className="border-[2px] border-[#111] bg-[#eae7de]/80 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-[#111] shadow-[4px_4px_0_0_#111]">
                      {label}
                    </span>
                  ))}
                </Motion.div>
              </Motion.div>
            </div>
          </div>

          <Motion.div
            id="services"
            tabIndex={-1}
            role="region"
            aria-label="Services"
            data-landing-video-beat="pricing-release"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
            className="landing-nav-target relative z-20 mt-8 pb-28 md:pb-36"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 items-start">
              <Motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-4 border-[3px] border-[#111] bg-[#eae7de]/90 p-5 md:p-6 shadow-[6px_6px_0_0_#111]">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                <p className="font-mono uppercase tracking-[0.25em] mb-3 text-xs font-bold text-[#444]">// creative studio</p>
                <h3 className="font-serif text-5xl md:text-7xl leading-[0.88] tracking-tight mb-3 text-[#111]">
                  Start with what you need now.
                </h3>
                <p className="font-sans text-sm md:text-lg text-[#444] font-medium leading-snug max-w-3xl">
                  A new idea, an outdated website, a rough AI draft, or a skill you want to learn. There’s a way in.
                </p>
                  </div>
                  <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  to="/book"
                  className="inline-flex font-sans font-black text-sm px-5 py-3 bg-[#111] text-[#eae7de] border-[3px] border-[#111] shadow-[5px_5px_0_0_#22c55e] hover:-translate-y-0.5 transition-all"
                >
                  Tell Us About It
                </Link>
                <PortfolioButton onClick={openPortfolio} />
                  </div>
                </div>
              </Motion.div>

              {/* 4 Cards */}
              <div className="contents">

                {[
                  { id: 'build', title: 'Build it.', file: '01_Build_It.app', label: 'from idea to launch', headline: 'Made for your idea.', dark: true,
                    description: 'Custom websites, apps, stores, and tools built around what you need to do.',
                    items: ['Websites with a point of view', 'Custom apps and business tools', 'Online stores and product experiences', 'Design, development, and handoff'], cta: 'Start a Build' },
                  { id: 'fix', title: 'Fix it.', file: '02_Fix_It.app', label: 'rescue + rebuild', headline: 'Almost isn’t finished.',
                    description: 'Outgrown your website? Vibe-coded yourself into a corner? Bring us what you have.',
                    items: ['Website redesigns and mobile fixes', 'Broken flows and unfinished AI code', 'Review auth, permissions, and exposed keys', 'Scope the fixes and check the result'], cta: 'Show Us the Problem' },
                  { id: 'create', title: 'Make it look right.', file: '03_Make_It_Yours.app', label: 'art + social content', headline: 'Make it feel like you.',
                    description: 'Turn rough ChatGPT art into deliberate visuals. Give your brand and social content a clear voice.',
                    items: ['AI-art refinement and art direction', 'Brand assets and campaign graphics', 'Social visuals and short-form content', 'Product demos and launch content'], cta: 'Make Something Better' },
                  { id: 'learn', title: 'Learn it.', file: '04_Learn_It.app', label: 'build it yourself', headline: 'Your idea. Your skills.', dark: true,
                    description: 'Learn to vibe-code with a real project, and understand what you’re making along the way.',
                    items: ['Turn an idea into a clear plan', 'Prompt, build, and revise', 'Debug and check your work', 'Publish and keep improving'], cta: 'Plan a Learning Session' },
                ].map((service) => (
                  <Motion.div key={service.id} variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative w-full min-w-0">
                    <AsciiShadow size="md" rotate={service.dark ? '-0.5deg' : '0.5deg'}>
                      <MacWindow title={service.file} contentClass={`${service.dark ? 'bg-[#111] text-[#eae7de]' : 'bg-[#eae7de] text-[#111]'} p-5 flex flex-col`}>
                        <p className={`font-mono text-[10px] uppercase tracking-[0.15em] mb-3 ${service.dark ? 'text-[#22c55e]' : 'text-[#555]'}`}>// {service.label}</p>
                        <h3 className="font-serif text-3xl leading-none mb-3">{service.title}</h3>
                        <p className={`font-sans text-sm leading-relaxed mb-5 ${service.dark ? 'text-[#bbb]' : 'text-[#444]'}`}>{service.description}</p>
                        <p className="font-serif text-2xl leading-tight mb-4">{service.headline}</p>
                        <ul className="space-y-3 font-sans text-sm mb-6">
                          {service.items.map(item => <li key={item} className="flex items-start gap-2"><span aria-hidden="true" className="font-black text-[#168a3e]">+</span><span>{item}</span></li>)}
                        </ul>
                        <Link to={`/book?service=${service.id}`} className={`mt-auto block text-center font-sans font-black text-sm px-3 py-3 border-[3px] border-[#111] shadow-[4px_4px_0_0_#555] hover:-translate-y-1 transition-transform ${service.dark ? 'bg-[#22c55e] text-[#111]' : 'bg-[#111] text-[#eae7de]'}`}>
                          {service.cta} →
                        </Link>
                      </MacWindow>
                    </AsciiShadow>
                  </Motion.div>
                ))}

              </div>
            </div>
          </Motion.div>
        </section>

        {/* --- BIG HORIZONTAL SECTION + SERVICES WIRE CONNECTION --- */}
        <div className="relative w-full z-10">
          {/* Main Computer PC Section - Needs lower z-index than Services to allow the terminal to receive the line correctly */}
          <section data-landing-video-beat="handoff" className="mt-20 md:mt-28 px-4 md:px-8 relative z-10 min-h-screen mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="relative h-screen overflow-hidden py-16 md:py-20">
            <Motion.div className="relative h-full w-full" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
              <Motion.div className="handoff-art-copy" variants={staggerContainer}>
                <Motion.h3 variants={fadeUp} className="handoff-art-heading">
                  <CollageArt name="do-the-work" text="Let us. Do the work." />
                </Motion.h3>
                <Motion.p variants={fadeUp} className="handoff-art-support font-sans text-sm font-semibold leading-tight text-white [text-shadow:2px_2px_0_rgba(17,17,17,0.86)] md:text-lg">
                  <span className="block">You bring the direction.</span>
                  <span className="block">We handle the design, build, and handoff.</span>
                </Motion.p>
              </Motion.div>

              <Motion.div
                className="handoff-art-customer"
                animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }}
                transition={{ y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" } }}
                style={{ filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.4))' }}
              >
                <img src="https://i.postimg.cc/t4F2R7q2/bottom-of-funnel-happy-customer.png" alt="" className="h-auto w-full object-contain filter contrast-125 saturate-110" />
              </Motion.div>

              <Motion.div
                className="handoff-art-wire w-px bg-[#22c55e]/75 shadow-[0_0_18px_rgba(34,197,94,0.7)]"
              />
            </Motion.div>
            </div>
          </section>

          {/* Services - Animated CRT Machine Layout */}
          <section id="process" tabIndex={-1} data-landing-video-beat="process" className="landing-nav-target mt-28 md:mt-36 px-4 md:px-8 relative z-20 mx-auto" aria-labelledby="process-heading" style={{ maxWidth: '1400px' }}>
            <div className="relative grid min-h-screen content-center py-16 md:py-20">
              <div className="z-20 flex items-center">
              {/* Editorial Header */}
              <Motion.header initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={staggerContainer} className="process-art-header">
                <div className="process-art-titles">
                  <Motion.h2 variants={fadeUp} id="process-heading" className="process-art-heading">
                    <CollageArt name="from-idea" text="From idea to out there." />
                  </Motion.h2>
                  <Motion.p variants={fadeUp} className="process-art-label"><CollageArt name="how-we-work" text="How we work" /></Motion.p>
                </div>
                <Motion.p variants={fadeUp} className="process-art-summary font-serif text-xl md:text-2xl italic mp4-muted leading-snug">
                  A clear scope, room for feedback, and a handoff you can actually use.
                </Motion.p>
              </Motion.header>
              </div>
            </div>

            <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer} className="relative z-20 pb-32 md:pb-48">

              {/* Terminal Hierarchy Container */}
              <div className="relative mt-0 md:mt-8 w-full z-10">
                {/* Terminals Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 relative z-20">
                  <TerminalNode
                    index={0}
                    title="Shape it"
                    desc="Show us the idea, the rough draft, or what’s broken. We agree on the outcome, scope, and next steps before the work starts."
                  />
                  <TerminalNode
                    index={1}
                    title="Build it"
                    desc="Design, code, or create. You see the work as it takes shape, with space to give feedback and refine the details."
                  />
                  <TerminalNode
                    index={2}
                    title="Check it"
                    desc="Check the agreed flows, mobile layouts, and deliverables. For project rescue, review the scoped security issues and verify the fixes."
                  />
                  <TerminalNode
                    index={3}
                    title="Hand it over"
                    isLast={true}
                    desc="Get the finished files or project, a walkthrough, and clear next steps. Know what you have and how to keep using it."
                  />
                </div>
              </div>

              <div className="portfolio-invite">
                <p>See where a good idea can go.</p>
                <PortfolioButton onClick={openPortfolio} />
              </div>

            </Motion.div>
          </section>
        </div>

        {/* The rebuild in the film introduces actual finished work. */}
        <section id="work-story" className="relative scroll-mt-24 mt-24 px-4 md:px-8 mx-auto" aria-labelledby="work-heading">
          <div data-landing-video-beat="work" className="relative min-h-[190vh] md:min-h-[220vh]">
            <div className="sticky top-0 min-h-screen flex items-center justify-center py-20 text-center">
              <Motion.div className="work-art-intro" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={staggerContainer}>
                <Motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] mp4-muted mb-6">// the portfolio</Motion.p>
                <Motion.h2 id="work-heading" variants={fadeUp} className="scene-art-heading scene-art-heading--work"><CollageArt name="next-version" text="Your next version starts here." /></Motion.h2>
                <Motion.p variants={fadeUp} className="font-sans text-lg md:text-xl max-w-xl mx-auto mt-6 mp4-muted">Websites, brand worlds, and tools made to be used.</Motion.p>
                <Motion.div variants={fadeUp} className="portfolio-work-invite"><PortfolioButton onClick={openPortfolio} /></Motion.div>
              </Motion.div>
            </div>
          </div>
          <div id="work" tabIndex={-1} role="region" aria-label="Selected work" data-landing-video-beat="work-reveal" className="landing-nav-target relative grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            {featuredProjects.map(project => <FeaturedProject key={project.id} project={project} />)}
          </div>
          <div className="text-center pb-16">
            <PortfolioButton onClick={openPortfolio}>See the full portfolio</PortfolioButton>
          </div>
        </section>

        <section id="course" data-landing-video-beat="learn" className="relative scroll-mt-24 mt-32 md:mt-44 px-4 md:px-8 mx-auto" aria-labelledby="learn-heading">
          <div className="relative min-h-[150vh] md:min-h-[170vh]">
            <div className="sticky top-0 min-h-screen flex items-center justify-center py-20 text-center">
              <Motion.div className="learn-art-intro" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={staggerContainer}>
                <Motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] mp4-muted mb-6">// learn with 80m</Motion.p>
                <Motion.h2 id="learn-heading" variants={fadeUp} className="scene-art-heading scene-art-heading--learn"><CollageArt name="learn-to-build" text="Want to build it yourself? We teach that too." /></Motion.h2>
                <Motion.p variants={fadeUp} className="font-sans text-lg md:text-xl mp4-muted max-w-2xl mx-auto mt-8">Bring a real idea. Learn to plan it, prompt it, debug it, and put it out into the world.</Motion.p>
              </Motion.div>
            </div>
          </div>
          <div id="learn" tabIndex={-1} role="region" aria-label="Learn with 80M" className="landing-nav-target grid grid-cols-1 md:grid-cols-2 gap-8">
            <MacWindow title="Your_Next_Skill.app" contentClass="bg-[#111] text-[#eae7de] p-6 md:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#22c55e] mb-4">// hands-on help</p>
              <h3 className="font-serif text-4xl leading-none mb-5">Learn by making<br/>something yours.</h3>
              <p className="font-sans text-base leading-relaxed text-[#bbb] mb-6">Practical vibe-coding guidance around your project. Work through the decisions, understand the errors, and learn how to check what AI gives you.</p>
              <Link to="/book?service=learn" className="inline-block font-sans font-black px-5 py-3 bg-[#22c55e] text-[#111] border-2 border-[#22c55e] hover:-translate-y-1 transition-transform">Plan a Learning Session →</Link>
              <Link to="/portal" className="block mt-5 font-mono text-sm text-[#eae7de] underline underline-offset-4">Explore the course portal</Link>
              <div className="portfolio-learn-invite"><PortfolioButton onClick={openPortfolio} /></div>
            </MacWindow>
            <div id="canairy" data-landing-video-beat="canairy" className="relative">
              <MacWindow title="Canairy_Field_Notes.md" contentClass="bg-[#eae7de] text-[#111] p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-[#555]">// free field notebook</p>
                  <span className="landing-canairy-emblem"><img src="/brand/landing-art/canairy-emblem.webp" alt="" width="1298" height="1212" loading="lazy" decoding="async" /></span>
                </div>
                <h3 className="font-serif text-4xl leading-none mb-5">Follow the build.<br/>See the receipts.</h3>
                <p className="font-sans text-base leading-relaxed text-[#444] mb-6">Canairy is our public experiment in building an AI-run business from $150. Read the chapters, follow the ledger, and see what we learn as we go.</p>
                <Link to="/canairy" className="inline-block font-sans font-black px-5 py-3 bg-[#111] text-[#eae7de] border-2 border-[#111] hover:-translate-y-1 transition-transform">Read Canairy →</Link>
                <Link to="/canairy/ledger" className="block mt-5 font-mono text-sm underline underline-offset-4">Open the public ledger</Link>
              </MacWindow>
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-24 border-t-2 mp4-border">
            <h3 className="font-serif text-4xl md:text-5xl my-10 text-center mp4-ink">Before we start.</h3>
            {[
              { q: 'Can you work with something I already started?', a: 'Yes. Send the existing website, project, or rough artwork with a description of what needs to change. We’ll review the starting point and agree on a scope.' },
              { q: 'Can you check my vibe-coded app?', a: 'We can review the project for broken flows and security issues such as authentication, permissions, and exposed keys. We’ll agree on what to check, explain what we find, and scope the fixes.' },
              { q: 'Can I hire you for art or social content only?', a: 'Yes. AI-art refinement, brand visuals, campaign graphics, product demos, and social content can be their own project.' },
              { q: 'Do I need coding experience to learn?', a: 'You can start with an idea and your current experience level. We’ll shape the session around what you want to build and where you need help.' },
              { q: 'How do pricing and timing work?', a: 'Share your goal, what already exists, and any budget or deadline. We’ll use that to work out the scope and quote before the project starts.' },
            ].map(faq => <FAQItem key={faq.q} question={faq.q} answer={faq.a} />)}
          </div>
        </section>

          {/* ── FOOTER CTA SECTION ── */}
        <section id="contact" data-landing-video-beat="contact" className="scroll-mt-0 mt-56 md:mt-80 px-4 md:px-8 max-w-3xl mx-auto text-center relative z-20 min-h-[260vh] md:min-h-[300vh]" aria-label="Start a project">
          <span data-landing-video-beat="contact-resolve" className="pointer-events-none absolute top-[20%] h-px w-px" aria-hidden="true" />
          <div className="sticky top-0 min-h-screen flex items-center justify-center py-16 md:py-20">
          <Motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={staggerContainer} className="contact-art-layout w-full">
            <Motion.h2 variants={fadeUp} className="contact-art-heading">
              <CollageArt name="make-real" text="Got something you want to make real?" />
            </Motion.h2>
            <Motion.p variants={fadeUp} className="contact-art-support">
              <CollageArt name="starting-point" text="Show us where you’re starting." />
            </Motion.p>

            <Motion.div variants={fadeUp} className="contact-actions">
              <PortfolioButton onClick={openPortfolio}>Portfolio</PortfolioButton>
              <Link to="/book" className="contact-project-link">Start a project ↗</Link>
              <Motion.a variants={fadeUp} href="mailto:contact@80m.ai" className="contact-actions__email">
                contact@80m.ai
              </Motion.a>
            </Motion.div>
          </Motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-28 md:mt-40 px-4 md:px-8 pb-12 text-center relative z-20 mx-auto" style={{ maxWidth: '1100px' }}>
          <div className="studio-footer text-left">
            <div className="studio-footer__top">
              <div className="studio-footer__intro">
                <StudioLink item={{ href: '#top', label: '80M home' }} className="studio-footer__brand">
                  <img src={BRAND_MARK_BLACK} alt="80M home" width="78" height="48" />
                </StudioLink>
                <p>Apps, websites, visuals, and the skills to make them yours.</p>
                <div className="studio-footer__portfolio"><PortfolioButton onClick={openPortfolio}>Portfolio</PortfolioButton></div>
              </div>
              <nav aria-label="Footer navigation" className="studio-footer__links">
                <div>
                  <p>Make something</p>
                  {primaryLinks.map((item) => <StudioLink key={item.href} item={item} />)}
                </div>
                <div>
                  <p>Around the studio</p>
                  {exploreLinks.map((item) => <StudioLink key={item.href} item={item} />)}
                </div>
              </nav>
            </div>
            <div className="studio-footer__bottom">
              <span>© 2026 80m Systems.</span>
              <Link to="/book" className="contact-project-link">Start a project <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </footer>

      </main>
      </div>
    </div>
  );
}
