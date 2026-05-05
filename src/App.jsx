import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import FuzzyText from './FuzzyText';
import DecryptedText from './DecryptedText';
import { NoiseOverlay, FloatingParticles } from './PortalShared';

// --- Custom Components & Styles ---

// NoiseOverlay and FloatingParticles are imported from PortalShared
// for consistent canvas grain and particle effects across all pages.

const LANDING_BACKGROUND_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/80m-background.mp4";
const LANDING_BACKGROUND_VIDEO = "/media/80m-background-h264.mp4";
const LANDING_IDLE_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/0504(1).mp4";
const LANDING_IDLE_VIDEO = "/media/80m-hero-idle-h264.mp4";
const PORTFOLIO_INTRO_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/202605050146.mp4";
const PORTFOLIO_INTRO_VIDEO = "/media/80m-portfolio-intro.mp4";
const PORTFOLIO_IDLE_VIDEO = LANDING_IDLE_VIDEO;
const PORTFOLIO_IDLE_SOURCE_VIDEO = LANDING_IDLE_SOURCE_VIDEO;
const BACKGROUND_VIDEO_SMOOTHING = 0.16;
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
  const handsProgress = getLandingElementProgress(stage, stageRect, maxScroll, '[data-landing-video-beat="hands"]');
  const pricingProgress = getLandingElementProgress(stage, stageRect, maxScroll, '[data-landing-video-beat="pricing"]');

  if (handsProgress == null || pricingProgress == null) return LANDING_VIDEO_BEATS;

  return [
    { scroll: 0, video: 0 },
    { scroll: Math.max(0.08, handsProgress - 0.19), video: 0.16 },
    { scroll: Math.max(0.14, handsProgress - 0.09), video: 0.26 },
    { scroll: Math.max(0, handsProgress - 0.025), video: 0.34 },
    { scroll: Math.max(handsProgress + 0.035, pricingProgress - 0.02), video: 0.365 },
    { scroll: pricingProgress, video: 0.5 },
    { scroll: Math.min(0.82, pricingProgress + 0.061), video: 0.57 },
    { scroll: Math.min(0.88, pricingProgress + 0.191), video: 0.72 },
    { scroll: Math.min(0.94, pricingProgress + 0.371), video: 0.81 },
    { scroll: 0.94, video: 0.92 },
    { scroll: 1, video: 0.998 },
  ].sort((a, b) => a.scroll - b.scroll);
}

const ScrubbablePaperBackground = ({ stageRef }) => {
  const videoRef = useRef(null);
  const requestRef = useRef(0);
  const targetProgress = useRef(0);
  const videoProgress = useRef(0);
  const durationRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY: pageScrollY } = useScroll();
  const idleOpacity = useTransform(pageScrollY, [0, 160, 480], [1, 0.35, 0], { clamp: true });
  const idleScale = useTransform(pageScrollY, [0, 480], [1, 1.04], { clamp: true });
  const scrubOpacity = useTransform(pageScrollY, [0, 160, 480], [0, 0.8, 1], { clamp: true });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = true;
    video.playsInline = true;
    video.disableRemotePlayback = true;
    video.preload = "auto";
    video.pause();
    video.load();

    const updateTarget = () => {
      const stage = stageRef?.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const maxScroll = stage.offsetHeight - window.innerHeight;
        const rawProgress = maxScroll > 0 ? clamp(-rect.top / maxScroll) : 0;
        targetProgress.current = mapLandingVideoProgress(rawProgress, buildLandingVideoBeats(stage, maxScroll, rect));
        return;
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0;
      targetProgress.current = mapLandingVideoProgress(rawProgress);
    };

    const onLoadedMetadata = () => {
      durationRef.current = Number.isFinite(video.duration) ? video.duration : 0;
      try {
        video.currentTime = 0;
      } catch {
        // The RAF loop will retry once the browser allows seeking.
      }
    };

    const animate = () => {
      updateTarget();
      videoProgress.current += (targetProgress.current - videoProgress.current) * BACKGROUND_VIDEO_SMOOTHING;

      if (!prefersReducedMotion && durationRef.current > 0 && video.readyState >= 2) {
        if (!video.paused) video.pause();
        const nextTime = clamp(videoProgress.current) * Math.max(0, durationRef.current - 0.016);
        if (Math.abs(video.currentTime - nextTime) > 0.025) {
          try {
            video.currentTime = nextTime;
          } catch {
            // Keep the loop alive if the browser temporarily blocks seeking.
          }
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("durationchange", onLoadedMetadata);
    window.addEventListener("resize", updateTarget, { passive: true });
    window.addEventListener("scroll", updateTarget, { passive: true });
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("durationchange", onLoadedMetadata);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget);
    };
  }, [prefersReducedMotion, stageRef]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <motion.video
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-100 saturate-[1.12] contrast-[1.06]"
        style={{ opacity: idleOpacity, scale: idleScale }}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        disablePictureInPicture
      >
        <source src={LANDING_IDLE_VIDEO} type="video/mp4" />
        <source src={LANDING_IDLE_SOURCE_VIDEO} type="video/mp4" />
      </motion.video>
      <motion.video
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
      </motion.video>
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(234,231,222,0.16),transparent_30%),linear-gradient(90deg,rgba(234,231,222,0.18),rgba(234,231,222,0.04)_48%,rgba(5,5,5,0.24))]" />
      <div className="absolute inset-0 z-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-25 mix-blend-overlay" />
    </div>
  );
};

const MacWindow = ({ children, title = "80m_Agent.app", className = "", contentClass = "bg-[#111]" }) => (
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

// A single character cell that flickers at its own random speed and density bias
const AsciiCell = ({ bias = 0.5, color, vertical = false }) => {
  const [char, setChar] = useState(() => {
    const idx = Math.floor(Math.random() * DENSITY.length);
    return DENSITY[idx];
  });

  useEffect(() => {
    // bias 1 = heavy (near element), 0 = light (far from element)
    const biasedDensity = DENSITY.filter((_, i) =>
      Math.random() < bias + 0.1 ? i >= Math.floor((1 - bias) * 5) : true
    );
    const speed = 200 + Math.random() * 700; // each cell ticks at its own rate
    const randomOffset = Math.random() * speed;

    const tick = () => {
      const pool = biasedDensity.length > 0 ? biasedDensity : DENSITY;
      setChar(pool[Math.floor(Math.random() * pool.length)]);
    };

    const id = setTimeout(function repeat() {
      tick();
      setTimeout(repeat, 200 + Math.random() * 700);
    }, randomOffset);

    return () => clearTimeout(id);
  }, [bias]);

  return (
    <span style={{
      color,
      fontFamily: 'monospace',
      display: vertical ? 'block' : 'inline-block',
      lineHeight: 1.1,
      userSelect: 'none',
    }}>
      {char}
    </span>
  );
};

const AsciiShadow = ({ children, size = 'lg', className = '', color = '#111', rotate = '0deg' }) => {
  const offset = size === 'sm' ? 12 : 16;
  const charW = size === 'sm' ? 6 : 7.5;   // approximate monospace char width at given font size
  const charH = size === 'sm' ? 10 : 12;
  const fontSize = size === 'sm' ? 9 : 11;

  // How many cells fit in the strip — we generate lots, clip via overflow:hidden
  const hCount = 120; // plenty for any width, clipped
  const vCount = 60;  // plenty for any height, clipped

  // Corner flicker — separate slow beat
  const [cornerChar, setCornerChar] = useState('╝');
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setCornerChar(CORNER_CHARS[i % CORNER_CHARS.length]);
      i++;
    }, 400 + Math.random() * 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
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
        {Array.from({ length: hCount }).map((_, i) => (
          // bias: cells closer to left edge (near element body) are heavier
          <AsciiCell key={i} bias={0.9 - (i / hCount) * 0.45} color={color} />
        ))}
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
        {Array.from({ length: vCount }).map((_, i) => (
          // bias: cells from top (near element body) are heavier
          <AsciiCell key={i} bias={0.9 - (i / vCount) * 0.45} color={color} vertical />
        ))}
      </div>

      {/* Corner */}
      <div
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
        {cornerChar}
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
    <motion.div ref={ref} style={{ y }} className={`relative flex justify-center ${className}`}>
       <img src={src} alt={alt} className={`mix-blend-multiply ${imgClassName}`} />
    </motion.div>
  );
};

// --- Terminal CRT Node Component ---
const TerminalNode = ({ title, desc, index = 0, isLast = false }) => (
  <motion.div variants={fadeUp} className="relative mt-8 lg:mt-0 pt-6 md:pt-14 pl-6 lg:pl-0 h-full group z-20">

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
  </motion.div>
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
const AtmScrollbar = ({ scrollRef: externalScrollRef, zIndexClass = 'z-[100]' }) => {
  const internalScrollRef = useRef(null);
  const scrollRef = externalScrollRef || internalScrollRef;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDir, setScrollDir] = useState('down');
  const lastScrollY = useRef(0);
  const rafRef = useRef(null);

  const isElementMode = !!externalScrollRef;

  const getScrollInfo = () => {
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
  };

  const scrollBy = (deltaY) => {
    if (isElementMode) {
      const el = scrollRef.current;
      if (el) el.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
    } else {
      window.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
    }
  };

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

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight, maxScroll } = getScrollInfo();
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      setScrollProgress(progress);
      setIsAtBottom(progress >= 0.98);

      if (scrollTop > lastScrollY.current) {
        setScrollDir('down');
      } else if (scrollTop < lastScrollY.current) {
        setScrollDir('up');
      }
      lastScrollY.current = scrollTop;
    };

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);

      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    if (isElementMode) {
      const el = scrollRef.current;
      if (el) {
        el.addEventListener('scroll', handleScroll, { passive: true });
        updateProgress();
        return () => {
          el.removeEventListener('scroll', handleScroll);
          clearTimeout(scrollTimeout);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
      }
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('scroll', handleScroll, { passive: true });
      updateProgress();
      return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [isElementMode]);

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
        className={`fixed right-2 top-4 bottom-4 w-16 ${zIndexClass} pointer-events-none flex justify-center`}
        style={{ pointerEvents: 'none' }}
        onWheel={(e) => {
          e.stopPropagation();
          scrollBy(e.deltaY);
        }}
      >
        <div className={`absolute bottom-0 w-12 h-6 transition-all duration-500 ease-out ${isAtBottom ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-50'}`}>
           <div className="absolute bottom-0 w-full h-2 bg-green-500 border border-green-700 rounded-sm rotate-2 shadow-sm"></div>
           <div className="absolute bottom-1 w-full h-2 bg-green-600 border border-green-800 rounded-sm -rotate-3 shadow-sm left-0.5"></div>
           <div className="absolute bottom-2 w-11 h-2 bg-green-500 border border-green-700 rounded-sm rotate-1 shadow-sm right-0.5"></div>
           <div className="absolute bottom-3 w-10 h-2 bg-green-400 border border-green-600 rounded-sm -rotate-2 shadow-sm left-1"></div>
        </div>
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            const target = e.currentTarget;
            target.setPointerCapture(e.pointerId);

            let startY = e.clientY;
            const { scrollTop: startScrollTop, maxScroll } = getScrollInfo();

            const handlePointerMove = (moveEvent) => {
              const deltaY = moveEvent.clientY - startY;
              if (maxScroll <= 0) return;
              const trackHeight = window.innerHeight - 128;
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
          onWheel={(e) => {
            e.stopPropagation();
            scrollBy(e.deltaY);
          }}
          className={`absolute w-14 h-32 flex flex-col items-center transition-transform duration-75 ease-out origin-center scale-75 cursor-grab active:cursor-grabbing pointer-events-auto touch-none ${isScrolling && !isAtBottom ? 'rotate-1' : 'rotate-0'}`}
          style={{ top: `calc(${scrollProgress * 100}% - ${16 + scrollProgress * 96}px)` }}
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

// Formspree endpoint — replace with your actual form ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
const DESKTOP_HARNESS_URL = 'https://github.com/guapdad4000/80m-agent-desktop-v3/releases/latest';

// Shared pill-select component for dark + cream slides
const PillSelect = ({ options, value, onChange, multi = false, accent = '#22c55e', textColor = '#eae7de', borderColor = 'rgba(34,197,94,0.4)', activeBg = 'rgba(34,197,94,0.2)' }) => (
  <div className="flex flex-wrap gap-3 justify-center">
    {options.map(opt => {
      const isActive = multi ? (value || []).includes(opt) : value === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => {
            if (multi) {
              const curr = value || [];
              onChange(isActive ? curr.filter(v => v !== opt) : [...curr, opt]);
            } else {
              onChange(isActive ? '' : opt);
            }
          }}
          style={{
            borderColor: isActive ? accent : borderColor,
            backgroundColor: isActive ? activeBg : 'transparent',
            color: isActive ? accent : textColor,
          }}
          className="min-h-[64px] px-5 py-4 rounded-[20px] border-2 font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer inline-flex items-center justify-center text-center shadow-[0_10px_24px_rgba(0,0,0,0.08)]"
        >
          {isActive ? '✓ ' : ''}{opt}
        </button>
      );
    })}
  </div>
);

// Input styling helpers
const darkInput = "w-full bg-[#1a1a1a] border border-[#333] text-[#eae7de] font-sans text-base px-5 py-4 rounded-lg placeholder-[#555] focus:outline-none focus:border-[#22c55e] transition-colors";
const creamInput = "w-full bg-white/70 border border-[#bbb] text-[#111] font-sans text-base px-5 py-4 rounded-lg placeholder-[#999] focus:outline-none focus:border-[#0ea5e9] transition-colors";

const getPortfolioThumb = (src) => src?.replace('/portfolio/', '/portfolio/thumbs/').replace(/\.(png|jpe?g|webp)$/i, '.webp') || src;

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b-2 mp4-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 md:py-8 flex justify-between items-center text-left hover:bg-white/5 transition-colors px-4 group"
      >
        <span className="font-sans font-bold text-xl md:text-2xl mp4-ink pr-8">{question}</span>
        <span className="text-3xl font-mono font-light mp4-muted group-hover:text-white transition-colors">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-8 text-lg md:text-xl mp4-muted font-serif leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AtmMascot = ({ step, isCompiling }) => {

  const getAnimClass = () => {
    switch(step) {
      case 1: return 'anim-sleep';
      case 2: return 'anim-searching';
      case 3: return 'anim-error';
      case 4: return 'anim-typing';
      case 5: return 'anim-processing';
      case 6: return 'anim-jump';
      case 7: return 'anim-lobster';
      case 8: return 'anim-urgent';
      case 9: return isCompiling ? 'anim-processing' : 'anim-job-done';
      case 10: return 'anim-jackpot';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-[400px] aspect-[9/11] relative mascot-container">
      <style>{`
        /* Master Hover (Whole ATM floating) */
        @keyframes master-hover {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        .atm-character { animation: master-hover 4s ease-in-out infinite; }

        /* Shadow Pulse */
        @keyframes shadow-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.9); opacity: 0.6; }
        }
        .atm-shadow { transform-origin: 400px 920px; animation: shadow-pulse 4s ease-in-out infinite; }

        /* Wing Fluttering */
        @keyframes flutter-left { 0% { transform: rotate(0deg) translateY(0); } 100% { transform: rotate(-20deg) translateY(15px); } }
        @keyframes flutter-right { 0% { transform: rotate(0deg) translateY(0); } 100% { transform: rotate(20deg) translateY(15px); } }
        .wing-left-container { transform-origin: 220px 450px; animation: flutter-left 0.4s ease-in-out infinite alternate; }
        .wing-right-container { transform-origin: 580px 450px; animation: flutter-right 0.4s ease-in-out infinite alternate; }

        /* Screen Pulsing Glow */
        @keyframes screen-glow { 0%, 100% { filter: brightness(1) contrast(1); } 50% { filter: brightness(1.1) contrast(1.05); } }
        .screen-surface { animation: screen-glow 3s infinite ease-in-out; }

        /* Eye Blinking */
        @keyframes blink { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.1); } }
        .eye { transform-origin: 50% 50%; transform-box: fill-box; animation: blink 4.5s infinite; }

        /* Cheek Blushing */
        @keyframes blush { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.1); } }
        .cheek { transform-origin: 50% 50%; transform-box: fill-box; animation: blush 4s infinite ease-in-out; }

        /* Dollar Bill Fluttering */
        @keyframes bill-flutter { 0% { transform: skewX(0deg) translateY(0) rotate(0deg); } 50% { transform: skewX(3deg) translateY(4px) rotate(1deg); } 100% { transform: skewX(0deg) translateY(0) rotate(0deg); } }
        .dollar-bill { transform-origin: 400px 730px; animation: bill-flutter 1.5s ease-in-out infinite alternate; }

        /* Top Light Blink */
        @keyframes light-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .top-light-glow { animation: light-blink 2s infinite ease-in-out; }

        /* 80M Text Hover */
        @keyframes text-float { 0%, 100% { transform: translateY(0); filter: brightness(1); } 50% { transform: translateY(-2px); filter: brightness(1.1); } }
        .text-80m-group { animation: text-float 4s ease-in-out infinite; }

        /* Default Overlays hidden */
        .overlay-state { opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .face-state { opacity: 0; transition: opacity 0.2s; }
        .face-default { opacity: 1; }

        /* STATE 1: Jackpot */
        @keyframes bill-rain { 0% { transform: translateY(-20px) skewX(0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(180px) skewX(5deg); opacity: 0; } }
        @keyframes flash-gold { 0%, 100% { opacity: 0; } 50% { opacity: 0.5; } }
        .anim-jackpot .face-default { opacity: 0; }
        .anim-jackpot .face-happy { opacity: 1; }
        .anim-jackpot .dollar-bill { animation: bill-rain 0.3s linear infinite; }
        .anim-jackpot .overlay-jackpot { animation: flash-gold 0.3s infinite; }
        .anim-jackpot .wing-left-container, .anim-jackpot .wing-right-container { animation-duration: 0.1s; }

        /* STATE 2: Jump */
        @keyframes jump-anim { 0%, 100% { transform: translateY(0) scale(1, 1); } 20% { transform: translateY(30px) scale(1.1, 0.9); } 50% { transform: translateY(-250px) scale(0.9, 1.1); } 80% { transform: translateY(0) scale(1.05, 0.95); } }
        @keyframes shadow-jump { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.5); opacity: 0.2; } }
        .anim-jump .atm-character { animation: jump-anim 1.5s cubic-bezier(0.28, 0.84, 0.42, 1) infinite; }
        .anim-jump .face-default { opacity: 0; }
        .anim-jump .face-happy { opacity: 1; }
        .anim-jump .atm-shadow { animation: shadow-jump 1.5s ease-in-out infinite; }

        /* STATE 3: Error */
        @keyframes shake-anim { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-15px) rotate(-2deg); } 75% { transform: translateX(15px) rotate(2deg); } }
        .anim-error .atm-character { animation: shake-anim 0.2s infinite; }
        .anim-error .face-default { opacity: 0; }
        .anim-error .face-error { opacity: 1; }
        .anim-error .overlay-error { opacity: 0.7; }
        .anim-error .top-light-glow { fill: #ef4444; animation-duration: 0.15s; filter: drop-shadow(0 0 10px #ef4444); }

        /* STATE 4: Sleep */
        @keyframes zzz-float { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-100px) scale(1.5); opacity: 0; } }
        .anim-sleep .atm-character { animation: master-hover 8s ease-in-out infinite; }
        .anim-sleep .face-default { opacity: 0; }
        .anim-sleep .face-sleep { opacity: 1; }
        .anim-sleep .overlay-sleep { opacity: 0.7; }
        .anim-sleep .sleep-zzzs { opacity: 1; }
        .anim-sleep .sleep-zzz-1 { animation: zzz-float 3s linear infinite; }
        .anim-sleep .sleep-zzz-2 { animation: zzz-float 3s linear infinite 1s; }
        .anim-sleep .sleep-zzz-3 { animation: zzz-float 3s linear infinite 2s; }
        .anim-sleep .dollar-bill { transform: translateY(-40px); opacity: 0; animation: none; }
        .anim-sleep .wing-left-container, .anim-sleep .wing-right-container { animation-duration: 3s; }
        .anim-sleep .top-light-glow { animation: light-blink 6s infinite ease-in-out; }

        /* STATE 5: Processing */
        @keyframes look-around { 0%, 100% { transform: translateX(0); } 20%, 40% { transform: translateX(-20px); } 60%, 80% { transform: translateX(20px); } }
        .anim-processing .face-default .eye { animation: look-around 2s ease-in-out infinite; }
        .anim-processing .top-light-glow { fill: #3b82f6; filter: drop-shadow(0 0 10px #3b82f6); animation: flash-gold 0.4s infinite alternate; }

        /* STATE 6: Searching */
        @keyframes scan-line-anim { 0% { transform: translateY(0); } 100% { transform: translateY(200px); } }
        .anim-searching .face-default { opacity: 0; }
        .anim-searching .face-searching { opacity: 1; }
        .anim-searching .overlay-searching { opacity: 0.5; }
        .anim-searching .search-elements { opacity: 1; }
        .anim-searching .scan-line { animation: scan-line-anim 1.5s linear infinite alternate; }

        /* STATE 7: Job Done */
        @keyframes happy-spin { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
        .anim-job-done .atm-character { animation: happy-spin 0.6s ease-in-out infinite; }
        .anim-job-done .face-default { opacity: 0; }
        .anim-job-done .face-job-done { opacity: 1; }
        .anim-job-done .overlay-job-done { opacity: 0.6; }
        .anim-job-done .top-light-glow { fill: #22c55e; filter: drop-shadow(0 0 10px #22c55e); }

        /* STATE 8: Typing */
        @keyframes typing-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        @keyframes key-flash { 0%, 100% { opacity: 0; } 50% { opacity: 0.9; } }
        .anim-typing .atm-character { animation: typing-bounce 0.15s infinite; }
        .anim-typing .face-default { opacity: 0; }
        .anim-typing .face-typing { opacity: 1; }
        .anim-typing .typing-glows { opacity: 1; }
        .anim-typing .tg-1 { animation: key-flash 0.15s infinite; }
        .anim-typing .tg-2 { animation: key-flash 0.2s infinite 0.1s; }
        .anim-typing .tg-3 { animation: key-flash 0.18s infinite 0.05s; }
        .anim-typing .tg-4 { animation: key-flash 0.22s infinite 0.15s; }

        /* STATE 9: Urgent */
        @keyframes fast-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px) rotate(-1deg); } 75% { transform: translateX(8px) rotate(1deg); } }
        .anim-urgent .atm-character { animation: fast-shake 0.1s infinite; }
        .anim-urgent .face-default { opacity: 0; }
        .anim-urgent .face-urgent { opacity: 1; }
        .anim-urgent .overlay-urgent { opacity: 0.6; }
        .anim-urgent .top-light-glow { fill: #f97316; filter: drop-shadow(0 0 15px #f97316); animation: flash-gold 0.1s infinite; }
        .anim-urgent .wing-left-container, .anim-urgent .wing-right-container { animation-duration: 0.05s; }

        /* STATE 10: Lobster */
        @keyframes claw-snap { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(25deg); } }
        @keyframes lobster-wobble { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02, 0.98); } }
        .anim-lobster .atm-character { animation: lobster-wobble 0.5s infinite; }
        .anim-lobster .face-default { opacity: 0; }
        .anim-lobster .face-lobster { opacity: 1; }
        .anim-lobster .overlay-lobster { opacity: 0.8; }
        .anim-lobster .lobster-claws-container { opacity: 1; }
        .anim-lobster .pincer-move { animation: claw-snap 0.2s infinite; }
        .anim-lobster .wing-left-container, .anim-lobster .wing-right-container { opacity: 0; }
      `}</style>

      <svg viewBox="-50 -50 900 1100" width="100%" height="100%" className={getAnimClass()} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="5" dy="15" stdDeviation="15" floodColor="#000000" floodOpacity="0.3" />
            </filter>
            <filter id="light-shadow">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.2" />
            </filter>
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Standard blurs for cross-browser React SVG compat */}
            <filter id="blur1"><feGaussianBlur stdDeviation="1"/></filter>
            <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
            <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
            <filter id="blur5"><feGaussianBlur stdDeviation="5"/></filter>
            <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>

            <linearGradient id="metalBody" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="15%" stopColor="#f8fafc" />
                <stop offset="45%" stopColor="#94a3b8" />
                <stop offset="85%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="metalBottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </linearGradient>

            <linearGradient id="metalBezel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <radialGradient id="screenGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="30%" stopColor="#ffeb3b" />
                <stop offset="70%" stopColor="#ffb300" />
                <stop offset="100%" stopColor="#f57c00" />
            </radialGradient>

            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#ff8787" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffc9c9" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff3e0" />
                <stop offset="100%" stopColor="#ff9800" />
            </linearGradient>

            <linearGradient id="keyGrayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="keyRedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="keyYellowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="keyGreenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="keyBlueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <clipPath id="screen-clip">
                <rect x="235" y="255" width="330" height="200" rx="12" />
            </clipPath>

            <g id="feather-wing">
                <path d="M 0,0 C 70,-70 150,-90 220,-110 C 240,-80 210,-40 180,-10 C 220,-5 220,30 180,40 C 210,60 190,90 150,80 C 160,110 130,140 90,120 C 110,150 70,170 30,130 C 20,110 10,60 0,0 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" filter="url(#light-shadow)" />
                <path d="M 20,-10 C 80,-40 130,-50 180,-60" fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"/>
                <path d="M 15,-5 C 60,-20 110,-20 140,-10" fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"/>
                <path d="M 10,5 C 50,10 90,20 120,30" fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"/>
                <path d="M 5,15 C 40,30 60,50 90,60" fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"/>
                <path d="M 5,25 C 20,40 40,70 50,90" fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round"/>
            </g>

            <g id="key-gray">
                <rect x="0" y="0" width="36" height="24" rx="4" fill="#64748b" />
                <rect x="2" y="2" width="32" height="18" rx="3" fill="url(#keyGrayGrad)" />
            </g>
            <g id="key-red">
                <rect x="0" y="0" width="36" height="24" rx="4" fill="#991b1b" />
                <rect x="2" y="2" width="32" height="18" rx="3" fill="url(#keyRedGrad)" />
            </g>
            <g id="key-yellow">
                <rect x="0" y="0" width="36" height="24" rx="4" fill="#a16207" />
                <rect x="2" y="2" width="32" height="18" rx="3" fill="url(#keyYellowGrad)" />
            </g>
            <g id="key-green">
                <rect x="0" y="0" width="36" height="24" rx="4" fill="#166534" />
                <rect x="2" y="2" width="32" height="18" rx="3" fill="url(#keyGreenGrad)" />
            </g>
            <g id="key-blue">
                <rect x="0" y="0" width="36" height="24" rx="4" fill="#1e3a8a" />
                <rect x="2" y="2" width="32" height="18" rx="3" fill="url(#keyBlueGrad)" />
            </g>
        </defs>

        <g className="atm-shadow">
            <ellipse cx="400" cy="920" rx="320" ry="40" fill="rgba(0,0,0,0.15)" filter="url(#blur8)" />
        </g>

        <g className="atm-character">
          <g className="lobster-claws-container" opacity="0">
              <g transform="translate(130, 480)">
                  <path d="M 0 0 Q -50 -20 -80 20" fill="none" stroke="#dc2626" strokeWidth="24" strokeLinecap="round"/>
                  <path d="M -80 20 C -120 -20 -160 30 -100 80 C -80 90 -60 60 -80 20" fill="#ef4444" stroke="#991b1b" strokeWidth="4"/>
                  <g transform="translate(-100, 80)" className="pincer-move">
                      <path d="M 0 0 C -20 30 -60 20 -40 -10 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="4"/>
                  </g>
              </g>
              <g transform="translate(670, 480) scale(-1, 1)">
                  <path d="M 0 0 Q -50 -20 -80 20" fill="none" stroke="#dc2626" strokeWidth="24" strokeLinecap="round"/>
                  <path d="M -80 20 C -120 -20 -160 30 -100 80 C -80 90 -60 60 -80 20" fill="#ef4444" stroke="#991b1b" strokeWidth="4"/>
                  <g transform="translate(-100, 80)" className="pincer-move">
                      <path d="M 0 0 C -20 30 -60 20 -40 -10 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="4"/>
                  </g>
              </g>
          </g>

          <g className="wing-left-container">
              <use href="#feather-wing" transform="translate(190, 420) scale(-1, 1) rotate(15)" />
          </g>
          <g className="wing-right-container">
              <use href="#feather-wing" transform="translate(610, 420) scale(1, 1) rotate(-15)" />
          </g>

          <g filter="url(#drop-shadow)">
              <rect x="180" y="150" width="440" height="730" rx="50" fill="url(#metalBody)" />
              <rect x="180" y="550" width="440" height="330" rx="50" fill="url(#metalBottom)" />
              <path d="M 180 200 Q 180 150 230 150 L 620 150 C 600 200 550 280 180 320 Z" fill="rgba(255,255,255,0.2)" />
              <line x1="180" y1="500" x2="620" y2="500" stroke="#334155" strokeWidth="3" />
              <line x1="180" y1="503" x2="620" y2="503" stroke="#f8fafc" strokeWidth="1.5" opacity="0.6" />
              <line x1="180" y1="650" x2="620" y2="650" stroke="#334155" strokeWidth="3" />
              <line x1="180" y1="653" x2="620" y2="653" stroke="#f8fafc" strokeWidth="1.5" opacity="0.6" />
          </g>

          <g transform="translate(230, 530)">
              <rect x="0" y="0" width="100" height="40" rx="8" fill="#475569" filter="url(#light-shadow)" />
              <rect x="10" y="15" width="80" height="10" rx="4" fill="#020617" />
              <polygon points="50,5 45,12 55,12" fill="#94a3b8" />
          </g>

          <g transform="translate(400, 520)" filter="url(#light-shadow)">
              <use href="#key-gray" x="0" y="0" />
              <use href="#key-gray" x="42" y="0" />
              <use href="#key-gray" x="84" y="0" />
              <use href="#key-red" x="126" y="0" />
              <use href="#key-gray" x="0" y="30" />
              <use href="#key-gray" x="42" y="30" />
              <use href="#key-gray" x="84" y="30" />
              <use href="#key-yellow" x="126" y="30" />
              <use href="#key-gray" x="0" y="60" />
              <use href="#key-gray" x="42" y="60" />
              <use href="#key-gray" x="84" y="60" />
              <use href="#key-green" x="126" y="60" />
              <use href="#key-gray" x="0" y="90" />
              <use href="#key-gray" x="42" y="90" />
              <use href="#key-gray" x="84" y="90" />
              <use href="#key-blue" x="126" y="90" />
          </g>

          <g transform="translate(400, 520)" className="typing-glows" opacity="0">
              <rect x="0" y="0" width="36" height="24" rx="4" fill="#ffffff" className="tg-1" />
              <rect x="84" y="30" width="36" height="24" rx="4" fill="#ffffff" className="tg-2" />
              <rect x="42" y="60" width="36" height="24" rx="4" fill="#ffffff" className="tg-3" />
              <rect x="126" y="90" width="36" height="24" rx="4" fill="#ffffff" className="tg-4" />
              <rect x="0" y="60" width="36" height="24" rx="4" fill="#ffffff" className="tg-2" />
              <rect x="84" y="90" width="36" height="24" rx="4" fill="#ffffff" className="tg-1" />
          </g>

          <g transform="translate(0, 0)">
              <rect x="250" y="690" width="300" height="70" rx="12" fill="#475569" filter="url(#light-shadow)"/>
              <rect x="265" y="705" width="270" height="40" rx="6" fill="#020617" />
              <g className="dollar-bill">
                  <path d="M 280 720 L 520 720 L 530 810 Q 400 830 270 810 Z" fill="#dcfce7" stroke="#22c55e" strokeWidth="3" />
                  <path d="M 290 730 L 510 730 L 515 795 Q 400 815 285 795 Z" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <circle cx="400" cy="765" r="22" fill="#bbf7d0" stroke="#4ade80" strokeWidth="2" />
                  <text x="400" y="777" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="32" fill="#16a34a" textAnchor="middle">$</text>
                  <path d="M 310 745 Q 330 750 315 770" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <path d="M 490 745 Q 470 750 485 770" fill="none" stroke="#4ade80" strokeWidth="2" />
              </g>
              <rect x="265" y="705" width="270" height="15" rx="4" fill="#0f172a" />
          </g>

          <rect x="210" y="230" width="380" height="250" rx="25" fill="#334155" />
          <rect x="215" y="235" width="370" height="240" rx="20" fill="#94a3b8" />
          <rect x="225" y="245" width="350" height="220" rx="15" fill="#0f172a" />

          <rect x="235" y="255" width="330" height="200" rx="12" fill="url(#screenGrad)" className="screen-surface" />

          <rect x="235" y="255" width="330" height="200" rx="12" fill="#ef4444" className="overlay-state overlay-error" style={{ mixBlendMode: 'multiply' }} />
          <rect x="235" y="255" width="330" height="200" rx="12" fill="#0f172a" className="overlay-state overlay-sleep" style={{ mixBlendMode: 'multiply' }} />
          <rect x="235" y="255" width="330" height="200" rx="12" fill="#ffffff" className="overlay-state overlay-jackpot" style={{ mixBlendMode: 'overlay' }} />
          <rect x="235" y="255" width="330" height="200" rx="12" fill="#10b981" className="overlay-state overlay-searching" style={{ mixBlendMode: 'overlay' }} />
          <rect x="235" y="255" width="330" height="200" rx="12" fill="#22c55e" className="overlay-state overlay-job-done" style={{ mixBlendMode: 'multiply' }} />
          <rect x="235" y="255" width="330" height="200" rx="12" fill="#f97316" className="overlay-state overlay-urgent" style={{ mixBlendMode: 'multiply' }} />
          <rect x="235" y="255" width="330" height="200" rx="12" fill="#ef4444" className="overlay-state overlay-lobster" style={{ mixBlendMode: 'multiply' }} />

          <g className="search-elements" opacity="0" clipPath="url(#screen-clip)">
              <line x1="235" y1="255" x2="565" y2="255" stroke="#4ade80" strokeWidth="6" className="scan-line" filter="url(#glow-orange)" />
          </g>

          <g opacity="0.6">
              <circle cx="280" cy="280" r="4" fill="#ffffff" filter="url(#blur1)"/>
              <circle cx="500" cy="290" r="6" fill="#ffffff" filter="url(#blur2)"/>
              <circle cx="350" cy="420" r="5" fill="#ffffff" filter="url(#blur1)"/>
              <circle cx="470" cy="400" r="3" fill="#ffffff" filter="url(#blur1)"/>
              <circle cx="320" cy="350" r="10" fill="#ffe066" filter="url(#blur4)"/>
              <circle cx="490" cy="360" r="12" fill="#ffe066" filter="url(#blur5)"/>
          </g>

          <g transform="translate(400, 355)">
              <ellipse cx="-100" cy="25" rx="45" ry="32" fill="url(#blushGrad)" className="cheek" />
              <ellipse cx="100" cy="25" rx="45" ry="32" fill="url(#blushGrad)" className="cheek" />

              <g className="face-state face-default">
                  <g transform="translate(-70, -5)">
                      <g className="eye">
                          <ellipse cx="0" cy="0" rx="16" ry="24" fill="#241400" />
                          <ellipse cx="-5" cy="-8" rx="6" ry="10" fill="#ffffff" transform="rotate(-25, -5, -8)" />
                          <circle cx="6" cy="10" r="3.5" fill="#ffffff" opacity="0.8" />
                      </g>
                  </g>
                  <g transform="translate(70, -5)">
                      <g className="eye">
                          <ellipse cx="0" cy="0" rx="16" ry="24" fill="#241400" />
                          <ellipse cx="-5" cy="-8" rx="6" ry="10" fill="#ffffff" transform="rotate(-25, -5, -8)" />
                          <circle cx="6" cy="10" r="3.5" fill="#ffffff" opacity="0.8" />
                      </g>
                  </g>
                  <path d="M -28 15 C -15 42, 15 42, 28 15" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
              </g>

              <g className="face-state face-happy">
                  <path d="M -90 0 Q -70 -20 -50 0 Q -70 -10 -90 0" fill="none" stroke="#241400" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M 50 0 Q 70 -20 90 0 Q 70 -10 50 0" fill="none" stroke="#241400" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M -20 15 Q 0 50 20 15 Z" fill="#241400" />
                  <path d="M -10 25 Q 0 40 10 25 Z" fill="#ef4444" />
              </g>

              <g className="face-state face-error">
                  <path d="M -90 -10 L -50 10 M -90 10 L -50 -10" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 50 10 L 90 -10 M 50 -10 L 90 10" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
                  <path d="M -20 30 L -10 20 L 0 30 L 10 20 L 20 30" fill="none" stroke="#241400" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              <g className="face-state face-sleep">
                  <line x1="-85" y1="5" x2="-55" y2="5" stroke="#241400" strokeWidth="8" strokeLinecap="round" />
                  <line x1="55" y1="5" x2="85" y2="5" stroke="#241400" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="0" cy="25" r="8" fill="none" stroke="#241400" strokeWidth="6" />
              </g>

              <g className="face-state face-searching">
                  <circle cx="-40" cy="-5" r="18" fill="none" stroke="#241400" strokeWidth="6" />
                  <circle cx="40" cy="-5" r="18" fill="none" stroke="#241400" strokeWidth="6" />
                  <line x1="-22" y1="-5" x2="22" y2="-5" stroke="#241400" strokeWidth="6" />
                  <circle cx="-48" cy="-5" r="5" fill="#241400" />
                  <circle cx="32" cy="-5" r="5" fill="#241400" />
                  <path d="M -15 25 Q 0 35 15 25" fill="none" stroke="#241400" strokeWidth="6" strokeLinecap="round" />
              </g>

              <g className="face-state face-job-done">
                  <path d="M -70 5 Q -45 -20 -20 5" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 20 5 Q 45 -20 70 5" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
                  <path d="M -25 15 Q 0 60 25 15 Z" fill="#241400" />
                  <path d="M -12 30 Q 0 45 12 30 Z" fill="#ef4444" />
              </g>

              <g className="face-state face-typing">
                  <ellipse cx="-40" cy="5" rx="14" ry="20" fill="#241400" />
                  <circle cx="-35" cy="12" r="4" fill="#ffffff" />
                  <ellipse cx="40" cy="5" rx="14" ry="20" fill="#241400" />
                  <circle cx="45" cy="12" r="4" fill="#ffffff" />
                  <line x1="-15" y1="30" x2="15" y2="30" stroke="#241400" strokeWidth="7" strokeLinecap="round" />
              </g>

              <g className="face-state face-urgent">
                  <path d="M -70 -10 L -25 5" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
                  <path d="M 70 -10 L 25 5" fill="none" stroke="#241400" strokeWidth="9" strokeLinecap="round" />
                  <circle cx="-45" cy="10" r="8" fill="#241400" />
                  <circle cx="45" cy="10" r="8" fill="#241400" />
                  <path d="M -25 30 L -12 40 L 0 30 L 12 40 L 25 30" fill="none" stroke="#241400" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M -75 -40 Q -65 -65 -55 -40 A 10 10 0 0 1 -75 -40 Z" fill="#22d3ee" />
              </g>

              <g className="face-state face-lobster">
                  <path d="M -30 -50 Q -50 -90 -80 -70" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 30 -50 Q 50 -90 80 -70" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="-80" cy="-70" r="6" fill="#ef4444" />
                  <circle cx="80" cy="-70" r="6" fill="#ef4444" />
                  <path d="M -60 -5 L -20 10" fill="none" stroke="#241400" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 60 -5 L 20 10" fill="none" stroke="#241400" strokeWidth="10" strokeLinecap="round" />
                  <circle cx="-40" cy="5" r="10" fill="#241400" />
                  <circle cx="40" cy="5" r="10" fill="#241400" />
                  <path d="M -10 30 Q 0 20 10 30" fill="none" stroke="#241400" strokeWidth="6" strokeLinecap="round" />
              </g>
          </g>

          <g className="sleep-zzzs" opacity="0">
              <text x="500" y="200" fontSize="50" fontFamily="Arial Rounded MT Bold, sans-serif" fill="#cbd5e1" className="sleep-zzz-1">Z</text>
              <text x="540" y="150" fontSize="40" fontFamily="Arial Rounded MT Bold, sans-serif" fill="#94a3b8" className="sleep-zzz-2">z</text>
              <text x="570" y="110" fontSize="30" fontFamily="Arial Rounded MT Bold, sans-serif" fill="#64748b" className="sleep-zzz-3">z</text>
          </g>

          <g transform="translate(400, 190)">
              <rect x="-45" y="0" width="90" height="12" rx="6" fill="#1e293b" />
              <rect x="-42" y="2" width="84" height="8" rx="4" fill="url(#lightGrad)" className="top-light-glow" filter="url(#glow-orange)" />
          </g>

          <g transform="translate(600, 210)">
              <g className="text-80m-group">
                  <text x="3" y="4" fontWeight="900" fontSize="46" fill="#1e293b" textAnchor="end" letterSpacing="2">80m</text>
                  <text x="2" y="3" fontWeight="900" fontSize="46" fill="#475569" textAnchor="end" letterSpacing="2">80m</text>
                  <text x="1" y="2" fontWeight="900" fontSize="46" fill="#94a3b8" textAnchor="end" letterSpacing="2">80m</text>
                  <text x="0" y="0" fontWeight="900" fontSize="46" fill="#ffffff" textAnchor="end" letterSpacing="2">80m</text>
              </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

const OnboardingPopup = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [isCompiling, setIsCompiling] = useState(false);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');

  // Reset on close
  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => { setStep(1); setIsCompiling(false); setAnswers({}); setEmail(''); }, 500);
    }
    document.body.style.overflow = isVisible ? 'hidden' : 'unset';
  }, [isVisible]);

  // Compiling effect on the brief step.
  useEffect(() => {
    if (step === 6) {
      setIsCompiling(true);
      const timer = setTimeout(() => setIsCompiling(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    nextStep();
  };
  const planLines = [
    `Package: ${answers.package || 'Not selected yet'}`,
    `Hardware: ${answers.hardware || 'Not selected yet'}`,
    `First workflow: ${answers.workflow || 'Not selected yet'}`,
    `Brief: ${answers.brief || 'Not provided yet'}`,
    `Email: ${email || 'Not provided yet'}`,
  ];
  const submitOnboarding = async () => {
    const payload = { source: 'onboarding_wizard', ...answers, email };
    try {
      if (!FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
        await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (_) {}

    window.location.href = `mailto:contact@80m.ai?subject=${encodeURIComponent('80m install brief')}&body=${encodeURIComponent(planLines.join('\n'))}`;
    onClose();
  };

  const slideVariants = {
    enter: { opacity: 0, x: 50, scale: 0.95 },
    center: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.2 } }
  };
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Hard-shadow option button (chunky, editorial)
  const OptionBtn = ({ children, onClick }) => (
    <motion.button
      variants={itemVariants}
      onClick={onClick || nextStep}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
	      className="w-full text-left font-sans font-bold text-base md:text-xl p-4 md:p-5 bg-white border-[3px] border-[#111] shadow-[4px_4px_0_0_#111] md:shadow-[6px_6px_0_0_#111] hover:shadow-[6px_6px_0_0_#22c55e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] rounded-sm"
    >
      {children}
    </motion.button>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex justify-center items-center p-2 md:p-4 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
	            className="relative w-full max-w-5xl bg-[#eae7de] border-[3px] md:border-[4px] border-[#111] shadow-[12px_12px_0_0_#111] md:shadow-[20px_20px_0_0_#111] flex flex-col h-[94vh] md:h-[90vh] max-h-[900px] z-10 rounded-lg overflow-hidden"
          >
            {/* OS Header */}
            <div className="bg-[#111] text-white p-3 md:p-4 flex justify-between items-center border-b-[3px] md:border-b-[4px] border-[#111] shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <span className="font-mono text-[10px] md:text-sm font-bold tracking-widest text-[#22c55e] ml-2">80M_SYS_INSTALLER.exe</span>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-[#ff4d4d] transition-colors" aria-label="Close">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Split: Mascot Left / Form Right */}
            <div className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply flex flex-col md:flex-row">

              {/* Mascot Section */}
              <div className="w-full md:w-[45%] h-[35vh] md:h-full bg-[#eae7de] border-b-[3px] md:border-b-0 md:border-r-[4px] border-[#111] flex items-center justify-center p-4 relative overflow-hidden shrink-0 z-10">
                 <AtmMascot step={step} isCompiling={isCompiling} />
              </div>

              {/* Form Section */}
	              <div className="w-full md:w-[55%] h-[55vh] md:h-full overflow-y-auto relative flex flex-col bg-transparent text-[#111]">
	                <div className="min-h-full flex flex-col justify-start p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
	                      className="w-full max-w-2xl mx-auto"
                    >
                      {/* STEP 1 */}
                      {step === 1 && (
                        <div className="text-center py-4">
                          <p className="font-mono text-xs md:text-sm uppercase tracking-widest font-bold text-[#555] mb-4">Install Brief</p>
                          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter mb-6">What should 80m build for you?</h2>
                          <p className="font-sans text-lg md:text-xl text-[#333] mb-10 max-w-lg mx-auto">Pick the lane first. We can install a personal 24/7 agent, source the machine, build the brand/web layer, or hand you the course portal.</p>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextStep} className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#22c55e] text-[#111] rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-2 border-transparent hover:border-[#111] hover:-translate-y-1 hover:scale-105 transition-all">Start Brief →</motion.button>
                        </div>
                      )}

                      {/* STEP 2 */}
                      {step === 2 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">Choose your lane.</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn onClick={() => setAnswer('package', 'Personal 24/7 Agent - $2,000 setup')}>A. Personal 24/7 Agent <span className="block pt-1 font-mono text-xs uppercase tracking-widest text-[#555]">$2,000 setup when you already have the computer.</span></OptionBtn>
                            <OptionBtn onClick={() => setAnswer('package', 'Sourced Mac mini / Mini PC build - $3,500-$4,500')}>B. Source the machine for me <span className="block pt-1 font-mono text-xs uppercase tracking-widest text-[#555]">$3,500-$4,500 depending on hardware.</span></OptionBtn>
                            <OptionBtn onClick={() => setAnswer('package', 'Website + logo build - $2,000 plus $200/mo management')}>C. Website, logo, social, or webstore <span className="block pt-1 font-mono text-xs uppercase tracking-widest text-[#555]">$2,000 build, then $200/mo if we manage it.</span></OptionBtn>
                            <OptionBtn onClick={() => setAnswer('package', '80m Portal Courses - $100 lifetime')}>D. Courses only <span className="block pt-1 font-mono text-xs uppercase tracking-widest text-[#555]">$100 one time. Lifetime access.</span></OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 3 */}
                      {step === 3 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">What are we installing on?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn onClick={() => setAnswer('hardware', 'I already have a Mac mini / Mini PC')}>A. I already have a Mac mini or Mini PC.</OptionBtn>
                            <OptionBtn onClick={() => setAnswer('hardware', 'I need 80m to source the hardware')}>B. Source the hardware for me.</OptionBtn>
                            <OptionBtn onClick={() => setAnswer('hardware', 'Tell me what to buy first')}>C. Tell me what to buy first.</OptionBtn>
                            <OptionBtn onClick={() => setAnswer('hardware', 'Courses only / no hardware install')}>D. No hardware. I just want the portal.</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 4 */}
                      {step === 4 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">What should it handle first?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn onClick={() => setAnswer('workflow', 'Personal operations and 24/7 assistant work')}>A. Personal operations and 24/7 assistant work.</OptionBtn>
                            <OptionBtn onClick={() => setAnswer('workflow', 'Social media content and posting')}>B. Social media content and posting.</OptionBtn>
                            <OptionBtn onClick={() => setAnswer('workflow', 'Webstore or storefront management')}>C. Webstore, inventory, orders, and product copy.</OptionBtn>
                            <OptionBtn onClick={() => setAnswer('workflow', 'Website, logo, and brand system')}>D. Website, logo, and brand system.</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 5 */}
                      {step === 5 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-6">What would make this feel worth it immediately?</h2>
                          <motion.textarea
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            value={answers.brief || ''}
                            onChange={(event) => setAnswers(prev => ({ ...prev, brief: event.target.value }))}
                            className="w-full h-40 md:h-48 bg-white border-[3px] border-[#111] p-4 md:p-6 font-sans text-lg md:text-xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#22c55e] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.2)] transition-all resize-none rounded-sm"
                            placeholder="e.g. I want my agent to manage listings, write captions, remember clients, and hand me a weekly plan..."
                          />
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextStep} className="mt-6 md:mt-8 w-full md:w-auto font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#111] text-[#eae7de] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-transparent hover:border-[#22c55e] hover:-translate-y-1 hover:scale-105 transition-all">Compile Brief →</motion.button>
                        </div>
                      )}

                      {/* STEP 6 */}
                      {step === 6 && (
                        <div className="bg-[#111] p-6 md:p-12 text-[#22c55e] font-mono border-[3px] border-[#333] shadow-[inset_0_0_40px_rgba(0,0,0,1)] rounded-md relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[length:100%_4px] pointer-events-none z-10"></div>
                          <div className="relative z-20">
                            <p className="text-xs md:text-sm mb-6 flex items-center gap-2">
                              <span className={isCompiling ? 'animate-spin' : ''}>&gt;</span>
                              {isCompiling ? 'Compiling Architecture...' : 'Process Complete.'}
                            </p>
                            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-3 md:space-y-4 text-xs md:text-base mb-10">
                              {[
                                answers.package || "Selected offer lane",
                                answers.hardware || "Marked hardware status",
                                answers.workflow || "Chose first workflow",
                                "Attached portal access",
                                "Prepared install call brief"
                              ].map((task, i) => (
                                <motion.li key={i} variants={itemVariants} className="flex gap-3 items-start">
                                  <span className="text-white/50">[{i+1}/5]</span>
                                  <span className="text-[#34d399] drop-shadow-[0_0_5px_#34d399]">{task} ... OK</span>
                                </motion.li>
                              ))}
                            </motion.ul>
                            <AnimatePresence>
                              {!isCompiling && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t-2 border-[#333] pt-8">
                                  <h3 className="text-white font-sans font-black text-2xl md:text-4xl mb-3 tracking-tight">Install Brief Ready.</h3>
                                  <p className="text-[#aaa] font-sans text-sm md:text-base mb-8 leading-relaxed">Next step is simple: send the brief, then we confirm whether this is a $2K personal build, a sourced hardware build, course access, or brand/web work.</p>
                                  <button onClick={nextStep} className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#22c55e] text-[#111] rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-2 border-transparent hover:border-[#111] hover:-translate-y-1 hover:scale-105 transition-all w-full">Finalize Brief →</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* STEP 7 */}
                      {step === 7 && (
                        <div className="text-center py-6">
                          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter mb-6">Send the brief.</h2>
                          <p className="font-sans text-lg md:text-xl text-[#555] mb-8 max-w-lg mx-auto">We will reply with the right next step: install call, hardware quote, course checkout, or website/social plan.</p>
                          <div className="mb-6 max-w-md mx-auto text-left bg-white border-[3px] border-[#111] p-4 shadow-[5px_5px_0_0_#111] font-mono text-xs uppercase tracking-wider text-[#555] space-y-2">
                            {planLines.slice(0, 4).map((line) => <p key={line}>{line}</p>)}
                          </div>
                          <div className="flex flex-col gap-4 max-w-md mx-auto">
                            <input
                              type="email"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              placeholder="your@email.com"
                              className="w-full bg-white border-[3px] border-[#111] p-4 md:p-5 font-sans font-bold text-lg md:text-xl text-center focus:outline-none focus:border-[#22c55e] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.2)] transition-all rounded-sm shadow-inner"
                            />
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={submitOnboarding} className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#22c55e] text-[#111] rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-2 border-transparent hover:border-[#111] hover:-translate-y-1 hover:scale-105 transition-all w-full">Submit Brief</motion.button>
                            <motion.a href={DESKTOP_HARNESS_URL} target="_blank" rel="noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="font-sans font-black text-base px-8 py-4 bg-[#111] text-[#eae7de] rounded-full border-2 border-[#111] hover:border-[#22c55e] transition-all w-full text-center">
                              Download Desktop Harness
                            </motion.a>
                          </div>
                          <p className="font-mono text-[10px] md:text-xs mt-8 text-[#777] uppercase font-bold tracking-widest border-t border-black/10 pt-6 inline-block">$2K personal agent setup. $3.5K-$4.5K sourced hardware builds.</p>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer / Progress Bar */}
            <div className="border-t-[3px] md:border-t-[4px] border-[#111] p-4 md:p-6 bg-white flex justify-between items-center gap-4 md:gap-8 shrink-0">
              <button
                onClick={prevStep}
                className={`font-mono font-bold text-xs md:text-sm uppercase tracking-widest text-[#555] hover:text-[#111] transition-colors ${step === 1 || step === 7 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                ← Back
              </button>
              <div className="flex-1 max-w-sm bg-[#eae7de] h-3 md:h-5 border-[2px] md:border-[3px] border-[#111] rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                <motion.div
                  className="h-full bg-[#22c55e] border-r-[2px] md:border-r-[3px] border-[#111]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
              <span className="font-mono font-bold text-xs md:text-sm text-[#111]">{step} / {totalSteps}</span>
            </div>

          </motion.div>
        </div>
    </AnimatePresence>
  );
};

const PortfolioThreeRibbon = ({ projects, scrollOffset, onSelect }) => {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollOffset);
  const selectRef = useRef(onSelect);

  useEffect(() => {
    scrollRef.current = scrollOffset;
  }, [scrollOffset]);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 3.4, -3.4, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const buildCurve = (aspect) => {
      const horizontal = 5.8 * aspect;
      const left = -horizontal;
      const right = horizontal;
      const top = 3.4;
      const bottom = -3.4;
      const point = (x, y) => new THREE.Vector3(
        THREE.MathUtils.lerp(left, right, x),
        THREE.MathUtils.lerp(top, bottom, y),
        0
      );

      return new THREE.CatmullRomCurve3([
        point(-0.08, 1.18),
        point(0.03, 1.04),
        point(0.15, 0.88),
        point(0.27, 0.72),
        point(0.4, 0.34),
        point(0.53, 0.48),
        point(0.64, 0.33),
        point(0.73, 0.49),
        point(0.79, 0.54),
        point(0.815, 0.545),
      ]);
    };

    let curve = buildCurve(16 / 9);

    const textureLoader = new THREE.TextureLoader();
    const meshes = projects.map((project, index) => {
      const geometry = new THREE.PlaneGeometry(2.25, 1.36, 12, 7);
      const positions = geometry.attributes.position.array;
      geometry.userData.original = Float32Array.from(positions);
      const texture = textureLoader.load(getPortfolioThumb(project.img));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 1;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.index = index;
      mesh.userData.base = index / projects.length;
      scene.add(mesh);
      return mesh;
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits[0]) {
        const project = projects[hits[0].object.userData.index];
        selectRef.current?.(project);
      }
    };

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      const aspect = width / height;
      camera.left = -5.8 * aspect;
      camera.right = 5.8 * aspect;
      camera.top = 3.4;
      camera.bottom = -3.4;
      camera.updateProjectionMatrix();
      curve = buildCurve(aspect);
    };

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();

      meshes.forEach((mesh, index) => {
        const t = (mesh.userData.base + scrollRef.current + elapsed * 0.018) % 1;
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        const pull = Math.pow(t, 1.8);
        const scale = THREE.MathUtils.lerp(1.25, 0.18, pull);
        const flutter = Math.sin(elapsed * 1.8 + index) * 0.1;

        mesh.position.set(point.x, point.y + flutter, 1.2 - t);
        mesh.scale.set(scale, scale, scale);
        mesh.rotation.z = Math.atan2(tangent.y, tangent.x) + Math.sin(elapsed + index) * 0.12;
        mesh.rotation.y = Math.sin(elapsed * 0.7 + index * 1.4) * 0.22;
        mesh.material.opacity = t > 0.9 ? THREE.MathUtils.clamp((1 - t) / 0.1, 0.08, 0.9) : 0.92;

        const position = mesh.geometry.attributes.position;
        const original = mesh.geometry.userData.original;
        for (let i = 0; i < position.array.length; i += 3) {
          const x = original[i];
          const y = original[i + 1];
          position.array[i] = x + Math.sin(y * 6 + elapsed * 2 + index) * 0.055;
          position.array[i + 1] = y + Math.sin(x * 4 + elapsed * 1.6 + index) * 0.045;
          position.array[i + 2] = original[i + 2] + Math.sin((x + y) * 4 + elapsed * 2.2 + index) * 0.16 * (1 - pull);
        }
        position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', resize);
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.map?.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [projects]);

  return <div ref={mountRef} className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing" aria-hidden="true" />;
};

const PortfolioAtmScrollRail = () => (
  <div className="pointer-events-none absolute right-4 top-14 z-40 hidden h-24 w-12 md:block" aria-hidden="true">
    <style>{`
      @keyframes portfolioAtmBlink {
        0%, 92%, 100% { transform: scaleY(1); }
        96% { transform: scaleY(0.12); }
      }
      @keyframes portfolioBillSuck {
        0% { transform: translate3d(var(--bill-x), calc(100vh + 2rem), 0) rotate(var(--bill-rotate)) scale(0.82); opacity: 0; }
        12% { opacity: 1; }
        78% { opacity: 1; }
        100% { transform: translate3d(0, 1.5rem, 0) rotate(4deg) scale(0.36); opacity: 0; }
      }
      .portfolio-atm-eye { transform-origin: center; animation: portfolioAtmBlink 4s infinite; }
      .portfolio-bill-suck { animation: portfolioBillSuck 1.8s linear infinite; }
    `}</style>
    <div className="absolute right-0 top-0 h-24 w-12">
      {[0, 1, 2, 3].map((bill) => (
        <span
          key={bill}
          className="portfolio-bill-suck absolute bottom-1 right-3 h-2 w-6 rounded-sm border border-green-800 bg-green-500 shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
          style={{
            animationDelay: `${bill * -0.42}s`,
            '--bill-x': `${(bill - 1.5) * 1.15}rem`,
            '--bill-rotate': `${bill % 2 ? -18 : 16}deg`,
          }}
        />
      ))}
      <div className="relative z-10 flex h-full w-full flex-col items-center rounded-[4px] border-b-4 border-r-[3px] border-[#b5b3a3] bg-[#dfddd0]/95 p-1 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
        <div className="mt-0.5 flex h-8 w-10 items-center justify-center rounded-[3px] border-[1.5px] border-[#1f1e1c] bg-[#2e2d2b] p-[2px] shadow-inner">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2px] bg-[#facc15]">
            <div className="absolute inset-0 rounded-[2px] bg-gradient-to-br from-white/25 to-transparent" />
            <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-sm">
              <circle className="portfolio-atm-eye" cx="7" cy="9" r="2" fill="#111" />
              <circle className="portfolio-atm-eye" cx="17" cy="9" r="2" fill="#111" />
              <path d="M6 13.5c2.5 3.5 7.5 3.5 12 0" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>
        <div className="mt-1 flex w-10 items-center justify-between px-0.5">
          <div className="flex gap-[1px]">
            {[...Array(6)].map((_, index) => <span key={index} className="h-1.5 w-[1px] bg-black/20" />)}
          </div>
          <span className="h-1 w-1.5 rounded-[0.5px] bg-black" />
        </div>
        <div className="mt-1.5 w-8 rounded-[2px] border-l border-t border-black/10 bg-[#cbc9ba] p-1 shadow-inner">
          <div className="grid grid-cols-3 gap-[1.5px]">
            {[...Array(12)].map((_, index) => <span key={index} className="h-[2px] rounded-[0.5px] bg-[#444] shadow-sm" />)}
          </div>
        </div>
        <div className="mt-2 flex w-full justify-end px-2">
          <div className="flex flex-col items-center gap-[1px]">
            <span className="h-[1.5px] w-3 rounded-full bg-zinc-800 shadow-inner" />
            <span className="h-[2px] w-[2px] rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]" />
          </div>
        </div>
        <div className="mb-1 mt-auto flex h-2 w-9 items-center justify-center rounded-sm border-[1px] border-zinc-500 bg-zinc-400 shadow-inner">
          <span className="h-[1.5px] w-6 rounded-full bg-zinc-900" />
        </div>
      </div>
    </div>
  </div>
);

const HeroPortfolioExperience = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('intro');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedProject, setSelectedProject] = useState(portfolioSlides[0]);
  const [selectedShotIndex, setSelectedShotIndex] = useState(0);
  const touchRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    setPhase('intro');
    setSelectedProject(portfolioSlides[0]);
    setSelectedShotIndex(0);
    setScrollOffset(0);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const nudge = (delta) => {
    setScrollOffset((value) => {
      const next = (value + delta) % 1;
      return next < 0 ? next + 1 : next;
    });
  };

  const handleWheel = (event) => {
    event.preventDefault();
    nudge((event.deltaY + event.deltaX) * 0.0007);
  };

  const handleTouchStart = (event) => {
    touchRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event) => {
    if (touchRef.current == null) return;
    const nextX = event.touches[0]?.clientX ?? touchRef.current;
    nudge((touchRef.current - nextX) * 0.002);
    touchRef.current = nextX;
  };

  const selectedIndex = Math.max(0, portfolioSlides.findIndex((project) => project.title === selectedProject?.title));
  const selectedProjectSafe = portfolioSlides[selectedIndex] || selectedProject || portfolioSlides[0];
  const selectedShots = selectedProjectSafe.shots?.length ? selectedProjectSafe.shots : [selectedProjectSafe.img];
  const selectedShot = selectedShots[selectedShotIndex % selectedShots.length] || selectedProjectSafe.img;
  const selectedShotPreview = getPortfolioThumb(selectedShot);
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedShotIndex(0);
  };
  const goToProject = (step) => {
    const nextIndex = (selectedIndex + step + portfolioSlides.length) % portfolioSlides.length;
    setSelectedProject(portfolioSlides[nextIndex]);
    setSelectedShotIndex(step < 0 ? ((portfolioSlides[nextIndex].shots?.length || 1) - 1) : 0);
    setScrollOffset((0.88 - nextIndex / portfolioSlides.length + 1) % 1);
  };
  const goToShot = (step) => {
    const nextShot = selectedShotIndex + step;
    if (nextShot < 0) {
      goToProject(-1);
      return;
    }
    if (nextShot >= selectedShots.length) {
      goToProject(1);
      return;
    }
    setSelectedShotIndex(nextShot);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
          className="fixed inset-0 z-[240] overflow-hidden bg-[#020617] text-white"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-[80] font-mono text-xs md:text-sm uppercase tracking-widest text-[#d9ff48] hover:text-white transition-colors"
          >
            Back Button
          </button>

          {phase === 'intro' && (
            <motion.div
              key="portfolio-intro"
              className="absolute inset-0 z-50 bg-black"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <video
                className="h-full w-full object-cover"
                autoPlay
                playsInline
                muted
                preload="auto"
                onEnded={() => setPhase('gallery')}
                onError={() => setPhase('gallery')}
              >
                <source src={PORTFOLIO_INTRO_VIDEO} type="video/mp4" />
                <source src={PORTFOLIO_INTRO_SOURCE_VIDEO} type="video/mp4" />
              </video>
              <div className="absolute bottom-6 left-6 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-white/60 md:left-10">
                Loading portfolio film
              </div>
            </motion.div>
          )}

          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: phase === 'gallery' ? 1 : 0 }}
            transition={{ duration: 0 }}
          >
            <video
              className="absolute inset-0 z-0 h-full w-full object-cover saturate-[1.18] contrast-[1.08]"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src={PORTFOLIO_IDLE_VIDEO} type="video/mp4" />
              <source src={PORTFOLIO_IDLE_SOURCE_VIDEO} type="video/mp4" />
            </video>
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_82%_55%,transparent_0,rgba(0,0,0,0.04)_34%,rgba(0,0,0,0.34)_88%),linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.2)_86%)]" />
            <PortfolioThreeRibbon projects={portfolioSlides} scrollOffset={scrollOffset} onSelect={handleSelectProject} />
            <PortfolioAtmScrollRail />

            <div className="absolute left-4 top-[13.5rem] z-40 max-w-[330px] md:left-10 md:top-[15.5rem]">
              <p className="font-serif text-2xl font-black leading-none text-white drop-shadow-[2px_2px_0_rgba(17,17,17,0.82)] md:text-4xl">80m Portfolio</p>
              <p className="mt-5 font-mono text-[10px] font-black uppercase leading-relaxed tracking-[0.16em] text-[#d9ff48] md:text-xs">
                Scroll sideways. Click a floating screen for project details. The papers ride the wave into the singularity.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {selectedProjectSafe && (
                <motion.div
                  key={selectedProjectSafe.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 18 }}
                  className="absolute bottom-4 left-1/2 z-50 flex w-[min(92vw,900px)] -translate-x-1/2 flex-col gap-3 md:bottom-5 md:flex-row md:items-stretch"
                >
                  <div className="relative min-h-[150px] flex-[1.16] overflow-hidden border-2 border-[#111]/75 bg-[#eae7de]/36 p-2 shadow-[5px_5px_0_0_rgba(17,17,17,0.48)] backdrop-blur-md md:min-h-[198px]">
                    <img
                      src={selectedShotPreview}
                      data-fallback={selectedShot}
                      alt=""
                      className="h-full w-full bg-[#f5f1e8]/35 object-contain opacity-80"
                      onError={(event) => {
                        const fallback = event.currentTarget.dataset.fallback;
                        if (!fallback) return;
                        event.currentTarget.src = fallback;
                        event.currentTarget.dataset.fallback = '';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => goToShot(-1)}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#22c55e] bg-[#04130a]/70 font-mono text-2xl font-black leading-none text-[#d9ff48] shadow-[0_0_18px_rgba(34,197,94,0.8)] transition-transform hover:scale-110"
                      aria-label="Previous project"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => goToShot(1)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#22c55e] bg-[#04130a]/70 font-mono text-2xl font-black leading-none text-[#d9ff48] shadow-[0_0_18px_rgba(34,197,94,0.8)] transition-transform hover:scale-110"
                      aria-label="Next project"
                    >
                      ›
                    </button>
                  </div>
                  <div className="flex flex-[0.54] flex-col justify-between border-2 border-[#111]/75 bg-[#eae7de]/34 p-3 text-[#111] shadow-[5px_5px_0_0_rgba(17,17,17,0.48)] backdrop-blur-md md:p-4">
                    <div>
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.23em] text-[#222]">{selectedProjectSafe.desc}</p>
                      <h2 className="mt-2 font-serif text-2xl font-black leading-none md:text-3xl">{selectedProjectSafe.title}</h2>
                      <p className="mt-3 font-sans text-xs font-bold leading-snug text-[#1d1d1d] md:text-sm">{selectedProjectSafe.subtitle}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {selectedProjectSafe.url && (
                        <a href={selectedProjectSafe.url} target="_blank" rel="noreferrer" className="font-sans text-xs font-black uppercase tracking-wider underline underline-offset-4">
                          Project Link
                        </a>
                      )}
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#333]">
                        shot {selectedShotIndex + 1} / {selectedShots.length} / project {selectedIndex + 1} / {portfolioSlides.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const portfolioSlides = [
  {
    img: "/portfolio/hyphyburger.png",
    shots: ["/portfolio/hyphyburger.png", "/portfolio/hyphyburger-game.png", "/portfolio/hyphyburger-menu.png"],
    title: "HyphyBurger.com",
    desc: "RESTAURANT WEBSITE",
    subtitle: "Menu-first site with appetite-heavy visuals, a mini-game moment, local conversion, and franchise-ready brand energy.",
    url: "https://hyphyburger.com",
  },
  {
    img: "/portfolio/highroller-home.png",
    shots: ["/portfolio/highroller-home.png", "/portfolio/highroller-products.png", "/portfolio/highroller-minimal.png"],
    title: "High Roller",
    desc: "CANNABIS SHOP",
    subtitle: "Cannabis retail concept with slot-machine energy, bold product storytelling, and a premium shop direction.",
    url: "https://highrollershop.com",
  },
  {
    img: "/portfolio/caviarbutter-home.png",
    shots: ["/portfolio/caviarbutter-home.png", "/portfolio/caviarbutter-products.png", "/portfolio/caviarbutter-alt.png"],
    title: "Caviar Butter LA",
    desc: "BEAUTY STORE",
    subtitle: "Body-butter storefront system with luxury product framing, education copy, and clean ecommerce sections.",
    url: "https://caviarbutterla.com",
  },
  {
    img: "/portfolio/gurag-product-32.png",
    shots: ["/portfolio/gurag-product-32.png", "/portfolio/gurag-product-34.png", "/portfolio/gurag-packaging.png", "/portfolio/gurag-brand-sheet.png", "/portfolio/gurag-fabric-swatches.png", "/portfolio/gurag-durag-mockup.png"],
    title: "GURAG",
    desc: "DURAG BRAND",
    subtitle: "Durag brand identity with product mockups, fabric systems, packaging, pattern language, and preorder-ready assets.",
  },
  {
    img: "/portfolio/tagesplan.png",
    shots: ["/portfolio/tagesplan.png", "/portfolio/tagesplan-planner.png", "/portfolio/tagesplan-editor.png"],
    title: "Tagesplan Forma",
    desc: "PROJECT WEBSITE",
    subtitle: "Editorial planner world with clean storytelling, premium motion, and a polished daily-use interface.",
  },
  {
    img: "/portfolio/hustlin-usa.png",
    shots: ["/portfolio/hustlin-usa.png", "/portfolio/hustlin-usa-shop.png"],
    title: "Hustlin USA",
    desc: "BRAND + STORE SYSTEM",
    subtitle: "Shopify-ready storefront/admin split, inventory language, and sharper retail identity.",
    url: "https://hustlinusa.com",
  },
  {
    img: "/portfolio/80m.png",
    shots: ["/portfolio/80m.png", "/portfolio/80m-portal.png", "/portfolio/80m-pricing.png"],
    title: "80M",
    desc: "BRAND + COURSE SYSTEM",
    subtitle: "A full-machine brand language built to feel like money moving through agents, software, courses, and onboarding.",
    url: "https://80m.guru",
  },
  {
    img: "/portfolio/80m-agent-desktop.png",
    shots: ["/portfolio/80m-agent-desktop.png"],
    title: "80M Agent Desktop",
    desc: "DESKTOP AGENT HARNESS",
    subtitle: "Packaged command center for local sessions, skills, tools, gateway controls, and live workspace preview.",
    url: "https://github.com/guapdad4000/80m-agent-desktop-v3/releases/latest",
  },
  {
    img: "/portfolio/life-os.png",
    shots: ["/portfolio/life-os.png", "/portfolio/life-os-workspace.png"],
    title: "Life OS Dashboard",
    desc: "FULL DASHBOARD APP",
    subtitle: "Dense product UI organized into a clean command center for tasks, memory, and local-first operations.",
  },
  {
    img: "/portfolio/cortex-mobile.png",
    shots: ["/portfolio/cortex-mobile.png", "/portfolio/cortex-mobile-lower.png"],
    title: "Cortex Mobile",
    desc: "MOBILE AGENT APP",
    subtitle: "Mobile-first agent interface with local LifeOS data, glassy motion, and compact daily workflows.",
  },
];

// Re-export AtmScrollbar so PortalPage can use the same component
export { AtmScrollbar };

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const landingRef = useRef(null);
  const { scrollY, scrollYProgress: mainScroll } = useScroll();

  const openPortfolio = (event) => {
    event?.preventDefault();
    setIsNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowPortfolio(true);
  };

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 100 && !isScrolled) {
        setIsScrolled(true);
        setIsNavOpen(false);
      } else if (latest <= 100 && isScrolled) {
        setIsScrolled(false);
        setIsNavOpen(false);
      }
    });
    return () => unsubscribe();
  }, [scrollY, isScrolled]);

  const isFloating = isScrolled && !isNavOpen;
  const isExpandedMenu = isScrolled && isNavOpen;

  // --- Scroll animations for the "Giant Cursor" Logo mapping ---
  const cursorX = useTransform(mainScroll,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["0vw", "15vw", "5vw", "20vw", "10vw", "25vw"]
  );

  // --- Scroll animations for "Digitizing" the U-Curve Images ---
  const auditRef = useRef(null);
  const { scrollYProgress: auditProgress } = useScroll({
    target: auditRef,
    offset: ["start start", "end top"]
  });

  const suckX1 = useTransform(auditProgress, [0, 0.6, 1], ["0vw", "0vw", "60vw"]);
  const suckY1 = useTransform(auditProgress, [0, 0.6, 1], ["-32px", "-32px", "35vh"]);
  const suckRotate1 = useTransform(auditProgress, [0, 0.6, 1], [-12, -12, 180]);
  const suckX2 = useTransform(auditProgress, [0, 0.6, 1], ["0vw", "0vw", "45vw"]);
  const suckY2 = useTransform(auditProgress, [0, 0.6, 1], ["48px", "48px", "35vh"]);
  const suckRotate2 = useTransform(auditProgress, [0, 0.6, 1], [0, 0, 180]);
  const suckX3 = useTransform(auditProgress, [0, 0.6, 1], ["0vw", "0vw", "30vw"]);
  const suckY3 = useTransform(auditProgress, [0, 0.6, 1], ["-32px", "-32px", "35vh"]);
  const suckRotate3 = useTransform(auditProgress, [0, 0.6, 1], [12, 12, 180]);
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
      <AnimatePresence>{showOnboarding && <OnboardingPopup isVisible={showOnboarding} onClose={() => setShowOnboarding(false)} />}</AnimatePresence>
      <HeroPortfolioExperience isOpen={showPortfolio} onClose={() => setShowPortfolio(false)} />
      <ScrubbablePaperBackground stageRef={landingRef} />
      <NoiseOverlay />
      <FloatingParticles />

      <AtmScrollbar />

      {/* Dynamic Animated Navigation — CENTERED at top */}
      <motion.nav
        layout
        style={{ x: isFloating ? cursorX : 0 }}
        className={`fixed z-[60] flex pointer-events-none transition-colors duration-500 ${
          isFloating
            ? 'top-6 left-6 w-16 h-16 md:w-24 md:h-24 items-center justify-center cursor-pointer shadow-none'
            : isExpandedMenu
            ? 'top-6 left-6 flex-col md:flex-row items-center gap-6 origin-top-left bg-[#eae7de] p-4 md:px-8 rounded-2xl border-[3px] border-[#111] pointer-events-auto shadow-none'
            : 'top-0 left-0 w-full px-6 py-6 flex-col md:flex-row items-center justify-center bg-transparent gap-2 md:gap-0'
        }`}
        onClick={() => isFloating && setIsNavOpen(true)}
        aria-label="Main Navigation"
      >
        {/* LOGO (Solid Black, Transparent Background when unscrolled/floating) */}
        <motion.div
           layout
           className={`flex items-center justify-center z-10 pointer-events-auto bg-transparent transform transition-transform ${
             isFloating
               ? 'w-full h-full hover:scale-110 cursor-pointer'
               : 'p-2 md:p-3 hover:scale-105'
           }`}
        >
          <motion.img
            layout
            src="https://i.postimg.cc/P5W3dKTx/logo.png"
            alt="80m Logo"
            className={`transition-all duration-500 w-auto filter brightness-0 ${
              isFloating ? 'h-10 md:h-16' : 'h-8 md:h-12'
            }`}
          />
        </motion.div>

        {/* LINKS & CTA — centered when not scrolled */}
        <AnimatePresence>
          {(!isScrolled || isNavOpen) && (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.3 }}
              className={`flex flex-row flex-wrap justify-center md:flex-row gap-x-4 gap-y-2 md:gap-6 font-mono text-[9px] md:text-xs uppercase tracking-widest font-bold items-center pointer-events-auto max-w-[250px] md:max-w-none ${
                !isScrolled ? 'bg-transparent px-4 py-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]' : ''
              } ${
                isExpandedMenu ? 'text-[#111]' : ''
              }`}
            >
              <a href="#audit" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Audit</a>
              <a href="#poster" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Manifesto</a>
              <a href="#pricing" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Pricing</a>
              <a href="#services" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Services</a>
              <a href="#portfolio" className="hover:text-[#22c55e] transition-colors" onClick={openPortfolio}>Portfolio</a>
              <Link to="/portal" className="hover:text-[#22c55e] transition-colors" onClick={() => setIsNavOpen(false)}>Portal</Link>

              {isExpandedMenu && (
                <a
                  onClick={(e) => { e.preventDefault(); setShowOnboarding(true); setIsNavOpen(false); }}
                  href="#"
                  className="font-sans font-black text-sm px-6 py-2.5 bg-[#111] text-[#eae7de] hover:scale-105 transition-transform whitespace-nowrap ml-0 md:ml-4 rounded-full inline-block text-center mt-2 md:mt-0"
                >
                  Apply for Access
                </a>
              )}

              {/* Close button for expanded menu */}
              {isExpandedMenu && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsNavOpen(false); }}
                  className="ml-2 mt-2 md:mt-0 text-[#111] hover:text-[#0ea5e9] transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main ref={landingRef} className="relative z-10 pb-32 px-4 md:px-8 max-w-[1200px] mx-auto">


        {/* Editorial Hero Section */}
        <section className="relative min-h-[300vh] md:min-h-[320vh] w-full overflow-visible">
          <div className="sticky top-0 h-screen w-full pt-24 md:pt-0 overflow-hidden">
            <motion.div
              className="absolute left-0 top-[21vh] z-30 w-[68vw] max-w-[360px] md:left-[1vw] md:top-[18vh] md:w-[45vw] md:max-w-[540px] lg:max-w-[600px] pointer-events-auto"
              style={{ filter: 'drop-shadow(0 24px 38px rgba(0,0,0,0.44))' }}
              initial={{ opacity: 0, y: 28, rotate: -4 }}
              animate={{ opacity: 1, y: [0, -18, 0], rotate: [-3, -4.5, -3] }}
              transition={{ opacity: { duration: 0.7 }, y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
            >
              <MacWindow title="Reference_Board.mov" contentClass="bg-[#d8d2c8] relative overflow-hidden min-h-[150px] md:min-h-[225px]">
                <img src="https://i.postimg.cc/kGcbGVY2/moving-fast.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-multiply pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(17,17,17,0.1)_1px,transparent_1px)] bg-[size:34px_34px] opacity-60" />
              </MacWindow>
            </motion.div>

            <motion.div
              className="absolute left-2 top-[45vh] z-20 w-[62vw] max-w-[320px] md:left-[2vw] md:top-[52vh] md:w-[40vw] md:max-w-[500px] lg:max-w-[560px] pointer-events-auto"
              style={{ filter: 'drop-shadow(0 28px 46px rgba(0,0,0,0.68))' }}
              initial={{ opacity: 0, y: 32, rotate: 5 }}
              animate={{ opacity: 1, y: [0, 18, 0], rotate: [4, 5.5, 4] }}
              transition={{ opacity: { duration: 0.8, delay: 0.1 }, y: { duration: 8.5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8.5, repeat: Infinity, ease: "easeInOut" } }}
            >
              <MacWindow title="Signal_Monitor.log" contentClass="bg-[#080808] relative overflow-hidden min-h-[118px] md:min-h-[190px]">
                <img src="https://i.postimg.cc/fTG8hYNp/hero-overlay.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 mix-blend-screen filter brightness-125 contrast-150 pointer-events-none" />
              </MacWindow>
            </motion.div>

            <motion.div
              className="absolute left-[24vw] top-[32vh] z-50 w-[46vw] max-w-[270px] text-left md:left-auto md:right-[-3vw] md:top-[36vh] md:w-[300px] md:max-w-none lg:top-[37vh] pointer-events-auto"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={fadeUp} className="font-serif text-[clamp(1.05rem,4vw,1.7rem)] md:text-3xl leading-[1.02] tracking-tight text-white mb-4 drop-shadow-[2px_2px_0_rgba(17,17,17,0.95)]">
                We install your AI.<br/>
                <span className="italic">We run your social.</span><br/>
                Builds start at $2K.
              </motion.h1>

              <motion.a
                variants={fadeUp}
                whileHover={{ scale: 1.05, backgroundColor: '#333' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                href="#"
                className="font-sans font-black text-[10px] md:text-sm px-4 py-2.5 md:px-5 md:py-3 bg-[#22c55e] text-[#111] rounded-full inline-block text-center tracking-wider uppercase border-[3px] border-[#111] shadow-[4px_4px_0_0_#111]"
              >
                Book Your Install
              </motion.a>
              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.preventDefault(); document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="mt-3 block font-sans font-bold text-[10px] md:text-xs px-4 py-2 text-white rounded-full border-2 border-white/40 hover:border-white hover:-translate-y-0.5 transition-all tracking-wider uppercase"
              >
                See Courses
              </motion.button>
            </motion.div>

            <motion.div
              className="absolute right-0 top-[15vh] z-40 w-[42vw] max-w-[230px] text-right md:right-[4vw] md:top-[18vh] md:w-[280px]"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={fadeUp} className="font-serif text-2xl md:text-4xl leading-[0.9] tracking-tight text-white drop-shadow-[2px_2px_0_rgba(17,17,17,0.8)]">
                AI moves fast.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-2 font-sans text-xs md:text-sm font-semibold leading-tight text-white/90 drop-shadow-[1px_1px_0_rgba(17,17,17,0.8)]">
                Can't keep up with the times?
              </motion.p>
            </motion.div>

            <motion.p
              className="absolute right-0 bottom-[13vh] z-40 w-[48vw] max-w-[360px] text-right font-serif text-2xl italic leading-[0.95] tracking-tight text-white drop-shadow-[2px_2px_0_rgba(17,17,17,0.85)] md:right-[4vw] md:bottom-[14vh] md:text-4xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Let us do the work for you.
            </motion.p>
          </div>
        </section>

        {/* --- DOES YOUR BRANDING SUCK RICHARD? (Popsicle audit grid) --- */}
        <section id="audit" ref={auditRef} className="relative min-h-[360vh] md:min-h-[400vh] scroll-mt-0 px-4 md:px-8 mx-auto" style={{ maxWidth: '1400px' }}>
          <div className="sticky top-0 z-10 h-screen overflow-hidden py-16 md:py-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={staggerContainer} className="relative z-10 h-full w-full overflow-visible">
              <motion.h2 variants={fadeUp} className="absolute left-0 top-[12vh] z-[160] max-w-[440px] font-serif text-[13vw] sm:text-[10vw] md:text-[5.7vw] lg:text-[4.8vw] uppercase leading-[0.82] tracking-tight text-white drop-shadow-[3px_3px_0_rgba(17,17,17,0.78)]">
                <motion.span variants={fadeUp} className="block">Does your</motion.span>
                <motion.span variants={fadeUp} className="block italic">branding suck</motion.span>
                <motion.span variants={fadeUp} className="block">Richard?</motion.span>
              </motion.h2>

              <motion.div
                className="absolute right-[-10vw] top-[20vh] z-[80] hidden w-[34vw] max-w-[360px] opacity-80 mix-blend-multiply md:block"
                initial={{ opacity: 0, x: 50, rotate: 8 }}
                whileInView={{ opacity: 0.82, x: 0, rotate: 5 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.75, delay: 0.2 }}
              >
                <img src="https://i.postimg.cc/nLtSqBSh/icon.png" alt="" className="h-auto w-full object-contain filter contrast-125 brightness-110" />
              </motion.div>

              <div className="absolute left-[5vw] top-[40vh] z-[150] h-[42vh] w-[86vw] max-w-[820px] md:left-[18vw] md:top-[26vh] md:h-[58vh] md:w-[58vw]">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{ x: suckX1, y: suckY1, rotate: suckRotate1, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter }}
                  className="absolute left-[16%] top-[9%] w-[28vw] max-w-[132px] md:left-[12%] md:top-[8%] md:w-[18vw] md:max-w-[230px] aspect-[3/4] shrink-0 cursor-pointer group"
                >
                  <img src="https://i.postimg.cc/bNKHDn37/bad-graphic-design.png" alt="Bad graphic design" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                  <img src="https://i.postimg.cc/R0VsyTc2/bad-graphic-design-hover.png" alt="Bad branding fix" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{ x: suckX2, y: suckY2, rotate: suckRotate2, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter }}
                  className="absolute left-[34%] bottom-[0%] w-[31vw] max-w-[150px] md:left-[31%] md:bottom-[3%] md:w-[21vw] md:max-w-[290px] aspect-[3/4] shrink-0 cursor-pointer group"
                >
                  <img src="https://i.postimg.cc/jdGQwfZB/old-webpage.png" alt="Old webpage" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                  <img src="https://i.postimg.cc/MGKPNYyh/old-webpage-hover.png" alt="Webpage fix" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{ x: suckX3, y: suckY3, rotate: suckRotate3, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter3 }}
                  className="absolute right-[6%] top-[6%] w-[28vw] max-w-[132px] md:right-[8%] md:top-[4%] md:w-[18vw] md:max-w-[230px] aspect-[3/4] shrink-0 cursor-pointer group"
                >
                  <img src="https://i.postimg.cc/dtzmkC5M/chat-gpt.png" alt="Chat GPT" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                  <img src="https://i.postimg.cc/KYvqw5n6/chat-gpt-hover.png" alt="Chat GPT branding fix" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- BIG HORIZONTAL SECTION (Tired of fighting...) --- */}
        <section className="mt-12 md:mt-20 px-4 md:px-8 relative min-h-[290vh] md:min-h-[320vh] mx-auto" style={{ maxWidth: '1400px' }}>
          <div className="sticky top-0 h-screen overflow-hidden py-16 md:py-20">
            <motion.div className="relative h-full w-full" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
              <div className="absolute left-0 top-[21vh] z-30 max-w-[520px] md:left-[6vw] md:top-[24vh]">
                <motion.h3 variants={fadeUp} className="font-serif text-[13vw] sm:text-[10vw] md:text-[6vw] lg:text-[5.2vw] leading-[0.82] tracking-tight text-white drop-shadow-[3px_3px_0_rgba(17,17,17,0.8)]">
                  <motion.span variants={fadeUp} className="block">Tired of</motion.span>
                  <motion.span variants={fadeUp} className="block">fighting</motion.span>
                  <motion.span variants={fadeUp} className="italic block">with the</motion.span>
                  <motion.span variants={fadeUp} className="block">algorithm?</motion.span>
                </motion.h3>
              </div>
              <motion.div
                className="absolute right-[-30vw] top-[27vh] z-20 w-[92vw] max-w-[620px] md:right-[-5vw] md:top-[18vh] md:w-[58vw] md:max-w-[760px] pointer-events-none"
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
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- THE INTERNET IS HARD (Split poster beats) --- */}
        <section id="poster" className="scroll-mt-0 mt-20 md:mt-28 px-4 md:px-8 text-center mx-auto relative" style={{ maxWidth: '1100px' }}>
          <div className="relative min-h-[260vh] md:min-h-[300vh]">
            <div className="sticky top-0 min-h-screen flex items-center justify-center py-14 md:py-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={staggerContainer} className="w-full">
                <motion.h2 variants={fadeUp} className="font-serif text-[11.5vw] md:text-[8vw] lg:text-[7.4vw] uppercase leading-[0.85] tracking-tighter mp4-ink">
                  <motion.span variants={fadeUp} className="block">THE INTERNET</motion.span>
                  <motion.span variants={fadeUp} className="italic block">IS HARD!</motion.span>
                </motion.h2>
              </motion.div>
            </div>
          </div>

          <div className="h-[42vh] md:h-[58vh]" aria-hidden="true" />

          <div className="relative min-h-[250vh] md:min-h-[290vh]">
            <div className="sticky top-0 min-h-screen flex items-center py-14 md:py-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer} className="w-full">
                <motion.h3 data-landing-video-beat="hands" variants={fadeUp} className="font-serif italic text-5xl md:text-7xl lg:text-[5.2vw] leading-[0.9] tracking-tighter mp4-ink max-w-4xl mx-auto mb-10 md:mb-14">
                  Are your hands tied with real life sh*t?
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-7 md:gap-12 max-w-5xl mx-auto">
                  <motion.div variants={fadeUp} className="w-full max-w-[330px] sm:max-w-[390px] md:max-w-none mx-auto md:-translate-y-8">
                    <AsciiShadow size="sm" rotate="1.5deg">
                    <MacWindow title="internet_is_hard.png" contentClass="bg-[#eae7de]">
                      <img
                        src="https://i.postimg.cc/Gmvq39LX/internet-is-hard.png"
                        alt="Internet is hard poster"
                        className="w-full h-auto object-cover filter grayscale contrast-[1.5] brightness-[0.9] mix-blend-multiply hover:mix-blend-normal transition-all duration-500"
                        loading="lazy"
                      />
                    </MacWindow>
                    </AsciiShadow>
                  </motion.div>

                  <motion.div variants={fadeUp} className="w-full max-w-[330px] sm:max-w-[390px] md:max-w-none mx-auto md:translate-y-8">
                    <AsciiShadow size="sm" rotate="-1.5deg">
                    <MacWindow title="real_life.jpg" contentClass="bg-[#eae7de]">
                      <img
                        src="https://i.postimg.cc/K8tJc4GN/hand-tied-with-real-life-sh-t.png"
                        alt="Hand tied by real life"
                        className="w-full h-auto object-cover filter grayscale contrast-[1.5] brightness-[0.9] mix-blend-multiply hover:mix-blend-normal transition-all duration-500"
                        loading="lazy"
                      />
                    </MacWindow>
                    </AsciiShadow>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing / Investment */}
        {/* ── PRICING SECTION ── */}
        <section id="pricing" className="scroll-mt-0 mt-72 md:mt-[28rem] px-4 md:px-8 relative mx-auto" aria-labelledby="pricing-heading" style={{ maxWidth: '1200px' }}>
          <div className="relative h-[580vh] md:h-[660vh]">
            <div className="sticky top-0 z-10 flex h-screen items-center justify-center text-center pointer-events-none">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.65 }} variants={staggerContainer} className="max-w-5xl px-2">
              <motion.p variants={fadeUp} className="font-mono uppercase tracking-[0.25em] mb-6 text-xs md:text-sm font-bold mp4-muted">// ways in</motion.p>
              <motion.h2 id="pricing-heading" data-landing-video-beat="pricing" variants={fadeUp} className="font-serif text-6xl md:text-8xl lg:text-[8vw] leading-[0.86] tracking-tight mb-6 mp4-ink">
                We come to you.
              </motion.h2>
              <motion.p variants={fadeUp} className="font-sans text-lg md:text-2xl mp4-muted font-medium max-w-2xl mx-auto">
                Personal agents, sourced machines, websites, logos, socials, webstores, and the course portal.
              </motion.p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={staggerContainer}
            className="relative z-20 mt-[28vh] md:mt-[36vh] pb-40 md:pb-56"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[0.42fr_0.58fr] gap-12 lg:gap-16 xl:gap-20 items-start">
              <motion.div variants={fadeUp} className="lg:sticky lg:top-24 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                <p className="font-mono uppercase tracking-[0.25em] mb-4 text-xs font-bold mp4-muted">// offer stack</p>
                <h3 className="font-serif text-5xl md:text-7xl lg:text-6xl leading-[0.9] tracking-tight mb-5 mp4-ink">
                  Choose the way in.
                </h3>
                <p className="font-sans text-lg md:text-xl mp4-muted font-medium leading-snug">
                  Start with the installed agent, add hardware if you need it, or split off into brand/web work. The portal comes free with any build.
                </p>
                <motion.a
                  variants={fadeUp}
                  href={DESKTOP_HARNESS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex font-sans font-black text-sm px-5 py-3 bg-[#22c55e] text-[#111] border-[3px] border-[#111] shadow-[5px_5px_0_0_#111] hover:-translate-y-0.5 transition-all"
                >
                  Download Desktop Harness
                </motion.a>
              </motion.div>

              {/* 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-10 md:gap-y-20 items-start">

      {/* Card 1 — Personal Agent */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative w-full max-w-[430px] mx-auto md:mx-0 md:justify-self-start">
        {/* Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 font-mono text-[9px] uppercase tracking-[0.25em] bg-[#22c55e] text-[#111] px-4 py-1.5 rounded-full font-black">Core Build</div>
        <AsciiShadow size="lg" rotate="-0.5deg">
          <MacWindow title="01_In_Person_Install.exe" contentClass="bg-[#111] p-8 text-[#eae7de]">
            <div className="border-b-2 border-[#333] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#22c55e] mb-3">// the main offer</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">Personal 24/7 Agent</h3>
              <p className="font-sans text-sm text-[#888] italic">We install the desktop harness, wire the agent, and leave you with a working machine.</p>
            </div>

            {/* Pricing block */}
            <div className="mb-6">
              <div className="flex items-end gap-3">
                <p className="font-serif text-5xl font-black tracking-tighter leading-none text-[#eae7de]">$2,000</p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mt-1">one-time setup fee</p>
            </div>

            {/* Spots remaining */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-4 h-4 rounded-full border border-[#333] bg-[#22c55e]/20 border-[#22c55e]/40" />
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#22c55e] uppercase tracking-widest font-bold">bring your own Mac mini or mini PC</span>
            </div>

            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "80m desktop harness installed from GitHub",
                "Personal agent configured for your life and work",
                "Local files, memory, and tool access wired up",
                "Portal courses included free",
                "Handoff call so you know how to use it",
                "You own the machine, accounts, files, and data.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#22c55e] leading-none mt-0.5 font-black">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </ul>
            {/* HARD SHADOW CTA button */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
              className="w-full font-sans font-black text-base py-4 bg-[#22c55e] text-[#111] border-[3px] border-[#111] shadow-[6px_6px_0_0_#111] hover:shadow-[8px_8px_0_0_#111] hover:-translate-y-0.5 transition-all"
            >
              Start Personal Build →
            </motion.button>
            <motion.a
              href={DESKTOP_HARNESS_URL}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 block w-full text-center font-sans font-black text-sm py-3 border-2 border-[#eae7de]/40 text-[#eae7de] hover:border-[#22c55e] transition-all"
            >
              Download Harness From GitHub
            </motion.a>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

      {/* Card 2 — Sourced Hardware */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative w-full max-w-[430px] mx-auto md:mt-28 md:justify-self-end">
        <AsciiShadow size="md" rotate="0.5deg">
          <MacWindow title="02_Sourced_Hardware.exe" contentClass="bg-[#eae7de] p-8 text-[#111]">
            <div className="border-b-2 border-[#111] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555] mb-3">// turnkey hardware</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">Sourced Machine Build</h3>
              <p className="font-sans text-sm text-[#555] italic">No computer yet? We source the Mac mini or Mini PC and ship it ready.</p>
            </div>
            <div className="mb-8">
              <p className="font-serif text-5xl font-black tracking-tighter leading-none">$3.5K-$4.5K</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mt-1">setup + hardware sourcing</p>
            </div>
            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "Mac mini or Mini PC recommendation and sourcing",
                "OS, desktop harness, and agent stack installed",
                "Accounts, keys, and local folders connected",
                "Portal courses included free",
                "Shipping or in-person handoff coordinated",
                "Best when you want the cleanest turnkey setup.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-black text-[#22c55e] leading-none mt-0.5">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
              className="w-full font-sans font-black text-base py-4 bg-[#111] text-[#eae7de] rounded-full shadow-[0_6px_0_0_rgba(0,0,0,0.5)] hover:shadow-[0_10px_0_0_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all border-2 border-[#111]"
            >
              Quote My Hardware →
            </motion.button>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

      {/* Card 3 — Brand + Web */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative w-full max-w-[430px] mx-auto md:justify-self-start">
        <AsciiShadow size="md" rotate="0.5deg">
          <MacWindow title="03_Brand_Web.exe" contentClass="bg-[#eae7de] p-8 text-[#111]">
            <div className="border-b-2 border-[#111] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555] mb-3">// brand layer</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">Website + Logo</h3>
              <p className="font-sans text-sm text-[#555] italic">For brands that need the outside to match the machine inside.</p>
            </div>
            <div className="mb-8">
              <p className="font-serif text-5xl font-black tracking-tighter leading-none">$2,000</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mt-1">one-time design/build</p>
            </div>
            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "Logo direction and visual identity system",
                "Landing page, website, or webstore build",
                "Copy tuned to your offer and audience",
                "Optional webstore/social management",
                "$200/mo to manage socials or a webstore",
                "Pairs cleanly with the personal agent install.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#22c55e] leading-none mt-0.5 font-black">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
              className="w-full font-sans font-black text-base py-4 bg-[#111] text-[#eae7de] rounded-full shadow-[0_6px_0_0_rgba(0,0,0,0.5)] hover:shadow-[0_10px_0_0_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all border-2 border-[#111]"
            >
              Build My Brand Layer →
            </motion.button>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

      {/* Card 4 — Courses */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative w-full max-w-[430px] mx-auto md:mt-28 md:justify-self-end">
        <AsciiShadow size="md" rotate="-0.5deg">
          <MacWindow title="04_80m_Portal.exe" contentClass="bg-[#111] p-8 text-[#eae7de]">
            <div className="border-b-2 border-[#333] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#22c55e] mb-3">// learn it yourself</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">80m Portal Courses</h3>
              <p className="font-sans text-sm text-[#888] italic">Free with any build. Standalone if you want to learn first.</p>
            </div>
            <div className="mb-8">
              <p className="font-serif text-5xl font-black tracking-tighter leading-none text-[#eae7de]">$100</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#777] mt-1">one-time lifetime access</p>
            </div>
            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "80m portal courses included",
                "Bi-weekly use cases and tutorials",
                "Private monthly Zoom calls",
                "Templates, prompts, and setup walkthroughs",
                "Free with any personal, hardware, or brand build",
                "Lifetime access after the one-time fee.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#22c55e] leading-none mt-0.5 font-black">+</span>
                  <span>{item}</span>
                </div>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.preventDefault(); document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="w-full font-sans font-black text-base py-4 bg-[#22c55e] text-[#111] border-[3px] border-[#111] shadow-[6px_6px_0_0_#111] hover:shadow-[8px_8px_0_0_#111] hover:-translate-y-0.5 transition-all"
            >
              See the Portal →
            </motion.button>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

              </div>
            </div>
          </motion.div>
        </section>

        {/* --- BIG HORIZONTAL SECTION + SERVICES WIRE CONNECTION --- */}
        <div className="relative w-full z-10">
          {/* Main Computer PC Section - Needs lower z-index than Services to allow the terminal to receive the line correctly */}
          <section className="mt-20 md:mt-28 px-4 md:px-8 relative z-10 min-h-[320vh] md:min-h-[360vh] mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="sticky top-0 h-screen overflow-hidden py-16 md:py-20">
            <motion.div className="relative h-full w-full" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer}>
              <motion.div className="absolute left-0 top-[18vh] z-40 max-w-[470px] md:left-[6vw] md:top-[21vh]" variants={staggerContainer}>
                <motion.h3 variants={fadeUp} className="font-serif text-[17vw] sm:text-[13vw] md:text-[7vw] lg:text-[6.3vw] leading-[0.74] tracking-tight text-white [text-shadow:3px_3px_0_rgba(17,17,17,0.86)]">
                  <motion.span variants={fadeUp} className="block">Let us.</motion.span>
                  <motion.span variants={fadeUp} className="italic block">Do the</motion.span>
                  <motion.span variants={fadeUp} className="block">work.</motion.span>
                </motion.h3>
                <motion.p variants={fadeUp} className="mt-4 max-w-[280px] font-sans text-sm font-semibold leading-tight text-white [text-shadow:2px_2px_0_rgba(17,17,17,0.86)] md:max-w-[340px] md:text-lg">
                  So you can go see that movie<br className="hidden sm:block" /> you always wanted to,
                </motion.p>
              </motion.div>

              <motion.div
                className="absolute left-[42vw] top-[39vh] z-50 w-[31vw] max-w-[145px] md:left-[32vw] md:top-[40vh] md:w-[16vw] md:max-w-[190px] pointer-events-none"
                animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }}
                transition={{ y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" } }}
                style={{ filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.4))' }}
              >
                <img src="https://i.postimg.cc/t4F2R7q2/bottom-of-funnel-happy-customer.png" alt="" className="h-auto w-full object-contain filter contrast-125 saturate-110" />
              </motion.div>

              <motion.div
                className="absolute left-[41vw] top-[54vh] z-20 h-[35vh] w-px bg-[#22c55e]/75 shadow-[0_0_18px_rgba(34,197,94,0.7)] md:left-[37vw] md:top-[52vh] md:h-[38vh]"
              />
            </motion.div>
            </div>
          </section>

          {/* Services - Animated CRT Machine Layout */}
          <section id="services" className="scroll-mt-0 mt-44 md:mt-72 px-4 md:px-8 relative z-20 mx-auto" aria-labelledby="services-heading" style={{ maxWidth: '1400px' }}>
            <div className="relative h-[260vh] md:h-[300vh]">
              <div className="sticky top-0 z-20 min-h-screen flex items-center py-16 md:py-20">
              {/* Editorial Header */}
              <motion.header initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={staggerContainer} className="w-full flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#111] pb-6 gap-6 relative z-30 bg-[#eae7de] p-6 lg:p-8 rounded-[4px] shadow-sm">
                <div>
                  <motion.h2 variants={fadeUp} id="services-heading" className="font-serif text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-4 text-[#111]">
                    The Machine<br/>
                    <span className="italic font-normal text-5xl md:text-7xl">of 80m</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} className="font-mono text-sm uppercase tracking-widest font-bold px-2 py-1 bg-[#111] text-[#eae7de] inline-block">By 80m Systems</motion.p>
                </div>
                <motion.div variants={fadeUp} className="font-serif text-xl md:text-2xl italic text-[#333] max-w-sm text-left md:text-right leading-snug border-l-4 md:border-l-0 md:border-r-4 border-[#111] pl-4 md:pl-0 md:pr-4">
                  After years of manual labor, the machine takes over. Automated Transactions.
                </motion.div>
              </motion.header>
              </div>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer} className="relative z-20 pb-32 md:pb-48">

              {/* Terminal Hierarchy Container */}
              <div className="relative mt-0 md:mt-8 w-full z-10">
                {/* Terminals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 relative z-20">
                  <TerminalNode
                    index={0}
                    title="Social Mgmt"
                    desc="Your agent posts, replies, schedules, and engages across all platforms while you sleep. It learns your voice, your brand, your audience. Consistent presence across all platforms without you lifting a finger."
                  />
                  <TerminalNode
                    index={1}
                    title="Content Forge"
                    desc="Captions, scripts, copy, blog posts. Your agent learns your voice and generates content that sounds like you — not a robot. Tell your agent what you need, it writes, revises, and delivers."
                  />
                  <TerminalNode
                    index={2}
                    title="Operations"
                    desc="Emails, scheduling, reminders, payments, customer service. The boring stuff that eats your day — handled silently in the background. It keeps your calendar organized and follows up on payments."
                  />
                  <TerminalNode
                    index={3}
                    title="Intelligence"
                    isLast={true}
                    desc="Research, market analysis, competitor tracking, trend forecasting. Your agent watches everything so you can focus on creating. It scours the internet and runs deep analysis so you don't have to."
                  />
                </div>
              </div>

            </motion.div>
          </section>
        </div>

        {/* ── COURSE SECTION ── */}
        <section id="course" className="scroll-mt-0 mt-72 md:mt-[30rem] px-4 md:px-8 mx-auto" style={{ maxWidth: '1400px' }}>
          <div className="relative h-[260vh] md:h-[300vh]">
            <div className="sticky top-0 z-10 min-h-screen flex items-center justify-center py-16 md:py-20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={staggerContainer} className="w-full text-center">
                <motion.p variants={fadeUp} className="font-mono uppercase tracking-[0.2em] mb-6 text-sm font-bold text-center mp4-muted">// the curriculum</motion.p>
                <motion.h2 variants={fadeUp} className="font-serif text-6xl md:text-8xl lg:text-[7vw] leading-[0.85] tracking-tighter mp4-ink mb-8">
                  Learn the stack.<br/><span className="italic">Keep leveling up.</span>
                </motion.h2>
                {/* Meta Row — boxed pills with hard shadows */}
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-[#111] mix-blend-multiply">
                  <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">7 Portal Courses</span>
                  <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">$100 Lifetime</span>
                  <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">Lifetime Access</span>
                  <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">Monthly Zoom Calls</span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={staggerContainer} className="relative z-20 pb-32 md:pb-48">

            {/* OUTCOMES GRID — editorial with ✓ checkmarks */}
            <div className="mb-32">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 text-center mp4-ink tracking-tight">What you walk away with:</motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {[
                  "A working mental model for your 80m agent.",
                  "Bi-weekly use cases you can copy into real life.",
                  "Private, self-hosted infrastructure explained plainly.",
                  "Templates for skills, prompts, and repeatable workflows.",
                  "Monthly Zoom calls for questions and live walkthroughs.",
                  "Free access when you buy any 80m build."
                ].map((outcome, idx) => (
                  <motion.div variants={fadeUp} key={idx} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111] flex items-start gap-4 hover:-translate-y-1 transition-transform">
                    <span className="font-serif text-3xl font-black text-[#22c55e]">✓</span>
                    <p className="font-sans text-xl font-bold text-[#111] leading-tight mt-1">{outcome}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CORE ROADMAP — horizontal stacked, inside MacWindows */}
            <div className="max-w-5xl mx-auto space-y-8 mb-32">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 text-center mp4-ink tracking-tight">Core Roadmap</motion.h3>

              {/* Class 01 */}
                <MacWindow title="Class_01_Install_The_Stack.exe" contentClass="bg-[#eae7de] p-8 md:p-12 text-[#111] border-[3px] border-[#111]">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="font-mono text-5xl font-black text-[#111] opacity-30 w-24 flex-none tracking-tighter">01</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h4 className="font-sans text-3xl md:text-4xl font-black uppercase tracking-tight">Install the Stack</h4>
                        <span className="font-mono text-xs font-bold border-2 border-[#111] px-2 py-1 bg-white shadow-[2px_2px_0_0_#111]">~75 MIN</span>
                      </div>
                      <p className="font-serif text-xl md:text-2xl text-[#444] leading-relaxed mb-6">Get the base system running locally on your hardware. We strip away the unnecessary bloat and configure the raw engines. No cloud dependencies required.</p>
                      <div className="border-t-2 border-[#ccc] pt-5 space-y-2">
                        {["OpenClaw and Hermes installed from scratch", "Voice interface — your first real conversation", "Agent council wired up and working", "Background daemon running 24/7"].map((l, i) => (
                          <div key={i} className="flex items-start gap-3 font-mono text-sm text-[#555]">
                            <span className="text-[#22c55e] font-black leading-none mt-0.5">›</span><span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MacWindow>

              {/* Class 02 — dark featured */}
                <MacWindow title="Class_02_Talk_To_It_Properly.exe" contentClass="bg-[#111] p-8 md:p-12 text-[#eae7de] border-[3px] border-[#333]">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="font-mono text-5xl font-black text-[#eae7de] opacity-30 w-24 flex-none tracking-tighter">02</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h4 className="font-sans text-3xl md:text-4xl font-black uppercase tracking-tight">Talk to It Properly</h4>
                        <span className="font-mono text-xs font-bold border-2 border-[#eae7de] px-2 py-1 bg-transparent text-[#eae7de] shadow-[2px_2px_0_0_#22c55e]">~80 MIN</span>
                      </div>
                      <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed mb-6">Master the LLM context window. Learn to write prompts that don't suck, inject your brand's true voice, and structure outputs for perfect automation pipelines.</p>
                      <div className="border-t-2 border-[#333] pt-5 space-y-2">
                        {["Prompting for results, not just responses", "Delegating to the right agent in the council", "Memory, fabric, and the skills system — explained", "Your first automated morning brief"].map((l, i) => (
                          <div key={i} className="flex items-start gap-3 font-mono text-sm text-[#888]">
                            <span className="text-[#22c55e] font-black leading-none mt-0.5">›</span><span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MacWindow>

              {/* Class 03 */}
                <MacWindow title="Class_03_Own_The_Infrastructure.exe" contentClass="bg-[#eae7de] p-8 md:p-12 text-[#111] border-[3px] border-[#111]">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="font-mono text-5xl font-black text-[#111] opacity-30 w-24 flex-none tracking-tighter">03</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h4 className="font-sans text-3xl md:text-4xl font-black uppercase tracking-tight">Own the Infrastructure</h4>
                        <span className="font-mono text-xs font-bold border-2 border-[#111] px-2 py-1 bg-white shadow-[2px_2px_0_0_#111]">~90 MIN</span>
                      </div>
                      <p className="font-serif text-xl md:text-2xl text-[#444] leading-relaxed mb-6">Deploy to a production environment. Secure your endpoints, configure automated cron jobs, and build the scaffolding to let the machine run while you sleep.</p>
                      <div className="border-t-2 border-[#ccc] pt-5 space-y-2">
                        {["DNS, domains, and what they actually do", "nginx reverse proxy — the right way", "Cloudflare tunnels for secure remote access", "Securing your stack — firewall and access control"].map((l, i) => (
                          <div key={i} className="flex items-start gap-3 font-mono text-sm text-[#555]">
                            <span className="text-[#22c55e] font-black leading-none mt-0.5">›</span><span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MacWindow>
            </div>

            {/* TESTIMONIALS — blockquote style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
              <motion.blockquote variants={fadeUp} className="border-l-8 mp4-border pl-8 py-4">
                <p className="font-serif text-2xl md:text-3xl italic mp4-ink leading-snug mb-6">"I spent two weeks fumbling through docs before this. Class 1 alone saved me that much time. By Class 3 I had everything deployed on my own server."</p>
                <footer className="font-mono text-sm font-bold uppercase tracking-widest mp4-muted">— Early Access Member · Indie Maker</footer>
              </motion.blockquote>
              <motion.blockquote variants={fadeUp} className="border-l-8 mp4-border pl-8 py-4">
                <p className="font-serif text-2xl md:text-3xl italic mp4-ink leading-snug mb-6">"The prompting section in Class 2 is worth the price alone. I went from getting useless responses to actually delegating my morning emails."</p>
                <footer className="font-mono text-sm font-bold uppercase tracking-widest mp4-muted">— Early Access Member · Founder, 2-person SaaS</footer>
              </motion.blockquote>
            </div>

            {/* INCLUDED — numbered circles grid */}
            <div className="mb-32 max-w-6xl mx-auto">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 text-center mp4-ink tracking-tight">Inside the Portal</motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
	                  { title: "7 Portal Courses", desc: "The complete agent, infrastructure, content, and income roadmap." },
	                  { title: "Bi-weekly Tutorials", desc: "Fresh use cases and walkthroughs twice a month." },
	                  { title: "Monthly Zoom Calls", desc: "Private group calls for questions, demos, and debugging." },
	                  { title: "Lifetime Access", desc: "$100 one time. No recurring course fee. Future updates included." }
                ].map((item, idx) => (
                  <motion.div variants={fadeUp} key={idx} className="bg-[#eae7de] border-2 border-[#111] p-6 shadow-[6px_6px_0_0_#111] text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#111] text-white flex items-center justify-center font-serif text-2xl italic mb-6">{idx + 1}</div>
                    <h4 className="font-sans font-black text-xl uppercase mb-2 text-[#111]">{item.title}</h4>
                    <p className="font-serif text-base text-[#555]">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ — uses FAQItem component */}
            <div className="max-w-4xl mx-auto mb-32 border-t-2 mp4-border">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 mt-12 text-center mp4-ink tracking-tight">Frequently Asked</motion.h3>
              {[
                { q: "Do I need to be a developer to take this?", a: "Basic terminal knowledge helps speed things up, but it is not strictly required. We walk through every step of the installation and configuration process on-screen." },
	                { q: "How much time will this take?", a: "The portal is designed to be worked through in passes. Start with the core install and prompting classes, then use the bi-weekly tutorials as new use cases drop." },
                { q: "What is the refund policy?", a: "We offer a 14-day money-back guarantee. If you go through the classes, do the work, and find the system doesn't deliver the infrastructure we promised, we'll refund you." },
                { q: "Do I need a powerful computer?", a: "To run the LLMs entirely locally, we recommend at least 16GB of Unified Memory/RAM (like an M-series Mac or equivalent PC). If your hardware is older, the course shows you how to hook the same infrastructure into cloud APIs (OpenAI/Anthropic) instead." },
	                { q: "How does this differ from the installed build?", a: "The installed build is done-for-you: we configure the agent, hardware, desktop harness, and handoff. The portal is the learn-it-yourself path, and it comes free with any build." },
	                { q: "What kind of support is included?", a: "Standalone course access includes private monthly Zoom calls plus ongoing bi-weekly use cases and tutorials. Builds also include a direct handoff around your installed system." },
              ].map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
            </div>

            {/* GUARANTEE + CTA — ATM exact version */}
            <motion.div variants={fadeUp} className="max-w-4xl mx-auto bg-[#111] text-[#eae7de] p-12 md:p-20 text-center border-[4px] border-[#333] shadow-[20px_20px_0_0_#22c55e]">
              <p className="font-mono text-sm md:text-base font-bold uppercase tracking-widest text-[#22c55e] mb-4">14-Day Money-Back Guarantee</p>
              <h3 className="font-serif text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8">
                Not sure yet? <br className="hidden md:block"/><span className="italic font-normal">Start the course.</span>
              </h3>
              <p className="font-serif text-xl md:text-2xl text-[#aaa] max-w-2xl mx-auto mb-12">
                Get inside. Watch the first class. If you don't feel dramatically more capable of owning your AI infrastructure, email us within 14 days for a full refund.
              </p>
              <button
                onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                className="font-sans font-black text-xl md:text-2xl px-12 py-6 bg-[#22c55e] text-[#111] border-[3px] border-transparent hover:border-[#eae7de] shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 hover:scale-105 transition-all w-full md:w-auto"
              >
                Request Course Access — $100
              </button>
            </motion.div>

          </motion.div>
        </section>

          {/* ── FOOTER CTA SECTION ── */}
        <section id="contact" className="scroll-mt-0 mt-56 md:mt-80 px-4 md:px-8 max-w-3xl mx-auto text-center relative z-20 min-h-[260vh] md:min-h-[300vh]" aria-label="Contact and Application">
          <div className="sticky top-0 min-h-screen flex items-center justify-center py-16 md:py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={staggerContainer} className="w-full">
	            <motion.h2 variants={fadeUp} className="font-serif text-7xl md:text-[8rem] leading-[0.8] tracking-tight mb-8 mp4-ink">
	              <motion.span variants={fadeUp} className="block">Pick your build.</motion.span>
	              <motion.span variants={fadeUp} className="italic block">We wire it.</motion.span>
	            </motion.h2>

	            <motion.p variants={fadeUp} className="font-sans text-xl md:text-2xl mp4-muted mb-12 font-medium">
	              $2,000 personal agent setup.<br/>
	              $3,500-$4,500 if we source the machine.
	            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#111] text-[#eae7de] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-transparent hover:border-[#eae7de] transition-all"
	              >
	                Build My Brief
	              </motion.button>
              <motion.a variants={fadeUp} href="mailto:contact@80m.ai" className="font-mono text-sm uppercase tracking-widest hover:underline underline-offset-8 mp4-ink font-black">
                contact@80m.ai — response within 48 hours
              </motion.a>
            </motion.div>
          </motion.div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-28 md:mt-40 px-4 md:px-8 pb-12 text-center relative z-20 mx-auto" style={{ maxWidth: '1100px' }}>
          <div className="grid gap-8 border-t-2 mp4-border pt-10 text-left md:grid-cols-[0.9fr_1.2fr_0.9fr] md:items-start">
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <img src="https://i.postimg.cc/P5W3dKTx/logo.png" alt="80m Logo" className="h-10 md:h-12 w-auto" />
              <p className="font-serif text-3xl leading-none mp4-ink">80m Systems</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] font-black mp4-muted">Installed agents, hardware, web, and portal.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Personal Agent", "$2K setup"],
                ["Sourced Machine", "$3.5K-$4.5K"],
                ["Portal", "$100 lifetime"],
              ].map(([label, value]) => (
                <div key={label} className="border-2 mp4-border bg-[#eae7de]/75 p-4 text-center shadow-[4px_4px_0_0_rgba(17,17,17,0.75)]">
                  <p className="font-sans text-sm font-black uppercase leading-tight text-[#111]">{label}</p>
                  <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#555]">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
              <button
                onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                className="font-sans font-black text-sm px-5 py-3 bg-[#22c55e] text-[#111] border-[3px] border-[#111] shadow-[5px_5px_0_0_#111] hover:-translate-y-0.5 transition-all"
              >
                Build My Brief
              </button>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] font-black mp4-ink md:justify-end">
                <button onClick={openPortfolio} className="hover:underline underline-offset-4">Portfolio</button>
                <Link to="/portal" className="hover:underline underline-offset-4">Portal</Link>
                <a href="mailto:contact@80m.ai" className="hover:underline underline-offset-4">Contact</a>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-bold mp4-muted">© 2026 80m SYSTEMS.</span>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
