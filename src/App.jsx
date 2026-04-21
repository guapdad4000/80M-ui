import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import FuzzyText from './FuzzyText';
import DecryptedText from './DecryptedText';
import { NoiseOverlay, FloatingParticles } from './PortalShared';

// --- Custom Components & Styles ---

// NoiseOverlay and FloatingParticles are imported from PortalShared
// for consistent canvas grain and particle effects across all pages.

const PaperBackground = () => (
  <div aria-hidden="true">
    <div className="fixed inset-0 z-[-4] bg-[#eae7de]"></div>
    <div className="fixed inset-0 z-[-3] opacity-70 mix-blend-multiply overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#38bdf8] rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-[#0ea5e9] rounded-full blur-[150px] opacity-40"></div>
      <div className="absolute top-[30%] left-[50%] w-[50vw] h-[50vw] bg-[#bae6fd] rounded-full blur-[100px] opacity-60"></div>
    </div>
    <div className="fixed inset-0 z-[-2] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-40 mix-blend-multiply pointer-events-none"></div>
  </div>
);

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
    <motion.div ref={ref} style={{ y }} className={`flex justify-center ${className}`}>
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
const STRIPE_URL = 'https://buy.stripe.com/eVqcN5dVL06z0N1gFGgjC05';

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

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b-2 border-[#111] overflow-hidden mix-blend-multiply">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-6 md:py-8 flex justify-between items-center text-left hover:bg-black/5 transition-colors px-4 group"
      >
        <span className="font-sans font-bold text-xl md:text-2xl text-[#111] pr-8">{question}</span>
        <span className="text-3xl font-mono font-light text-[#555] group-hover:text-[#111] transition-colors">
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
            <p className="px-4 pb-8 text-lg md:text-xl text-[#333] font-serif leading-relaxed">
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
  const totalSteps = 10;
  const [isCompiling, setIsCompiling] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => { setStep(1); setIsCompiling(false); }, 500);
    }
    document.body.style.overflow = isVisible ? 'hidden' : 'unset';
  }, [isVisible]);

  // Compiling effect on step 9
  useEffect(() => {
    if (step === 9) {
      setIsCompiling(true);
      const timer = setTimeout(() => setIsCompiling(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

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
      className="w-full text-left font-sans font-bold text-base md:text-xl p-4 md:p-6 bg-white border-[3px] border-[#111] shadow-[4px_4px_0_0_#111] md:shadow-[6px_6px_0_0_#111] hover:shadow-[6px_6px_0_0_#22c55e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#22c55e] rounded-sm"
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
            className="relative w-full max-w-5xl bg-[#eae7de] border-[3px] md:border-[4px] border-[#111] shadow-[12px_12px_0_0_#111] md:shadow-[20px_20px_0_0_#111] flex flex-col h-[90vh] md:h-[85vh] max-h-[850px] z-10 rounded-lg overflow-hidden"
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
              <div className="w-full md:w-[55%] h-[55vh] md:h-full overflow-y-auto relative flex flex-col bg-transparent">
                <div className="min-h-full flex flex-col justify-center p-6 md:p-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="w-full max-w-2xl mx-auto my-auto"
                    >
                      {/* STEP 1 */}
                      {step === 1 && (
                        <div className="text-center py-4">
                          <p className="font-mono text-xs md:text-sm uppercase tracking-widest font-bold text-[#555] mb-4">System Initialization</p>
                          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter mb-6">Ready to automate your chaos?</h2>
                          <p className="font-sans text-lg md:text-xl text-[#333] mb-10 max-w-lg mx-auto">80m builds done-for-you AI systems for brands, creators, and businesses that want more output with less friction. Let's configure your agent.</p>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextStep} className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#22c55e] text-[#111] rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-2 border-transparent hover:border-[#111] hover:-translate-y-1 hover:scale-105 transition-all">Begin Setup →</motion.button>
                        </div>
                      )}

                      {/* STEP 2 */}
                      {step === 2 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">What feels heaviest right now?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn>A. Admin & Data Entry</OptionBtn>
                            <OptionBtn>B. Content Creation & Strategy</OptionBtn>
                            <OptionBtn>C. Customer Support & Inboxes</OptionBtn>
                            <OptionBtn>D. I just need a clone of myself.</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 3 */}
                      {step === 3 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">How does your brand feel right now?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn>A. Completely inconsistent.</OptionBtn>
                            <OptionBtn>B. Looking outdated and tired.</OptionBtn>
                            <OptionBtn>C. We don't really have one.</OptionBtn>
                            <OptionBtn>D. Solid, we just need the tech.</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 4 */}
                      {step === 4 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">Tired of fighting for consistency online?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn>A. Yes, we post way too sporadically.</OptionBtn>
                            <OptionBtn>B. It's a ghost town over here.</OptionBtn>
                            <OptionBtn>C. We're active, but it takes hours.</OptionBtn>
                            <OptionBtn>D. We've delegated it, but quality is low.</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 5 */}
                      {step === 5 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">How much of your week gets eaten by admin & marketing?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <OptionBtn>0 - 5 Hours</OptionBtn>
                            <OptionBtn>5 - 10 Hours</OptionBtn>
                            <OptionBtn>10 - 20 Hours</OptionBtn>
                            <OptionBtn>20+ Hours</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 6 */}
                      {step === 6 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">What's your primary revenue engine?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn>A. E-Commerce / Physical Goods</OptionBtn>
                            <OptionBtn>B. Agency / Client Services</OptionBtn>
                            <OptionBtn>C. Digital Products / Courses</OptionBtn>
                            <OptionBtn>D. SaaS / Tech</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 7 */}
                      {step === 7 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-8">Where does your business live online?</h2>
                          <motion.div variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3 md:gap-4">
                            <OptionBtn>A. Shopify</OptionBtn>
                            <OptionBtn>B. WordPress / Webflow</OptionBtn>
                            <OptionBtn>C. Custom Stack (React/Node/etc)</OptionBtn>
                            <OptionBtn>D. Mostly Social Media / DMs</OptionBtn>
                          </motion.div>
                        </div>
                      )}

                      {/* STEP 8 */}
                      {step === 8 && (
                        <div className="py-4">
                          <h2 className="font-serif text-3xl md:text-5xl tracking-tight leading-[0.95] mb-6">If an agent could take ONE thing off your plate today, what is it?</h2>
                          <motion.textarea
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="w-full h-40 md:h-48 bg-white border-[3px] border-[#111] p-4 md:p-6 font-sans text-lg md:text-xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#22c55e] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.2)] transition-all resize-none rounded-sm"
                            placeholder="e.g. Stop me from spending 3 hours writing Instagram captions..."
                          />
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={nextStep} className="mt-6 md:mt-8 w-full md:w-auto font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#111] text-[#eae7de] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-transparent hover:border-[#22c55e] hover:-translate-y-1 hover:scale-105 transition-all">Compile Agent →</motion.button>
                        </div>
                      )}

                      {/* STEP 9 */}
                      {step === 9 && (
                        <div className="bg-[#111] p-6 md:p-12 text-[#22c55e] font-mono border-[3px] border-[#333] shadow-[inset_0_0_40px_rgba(0,0,0,1)] rounded-md relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[length:100%_4px] pointer-events-none z-10"></div>
                          <div className="relative z-20">
                            <p className="text-xs md:text-sm mb-6 flex items-center gap-2">
                              <span className={isCompiling ? 'animate-spin' : ''}>&gt;</span>
                              {isCompiling ? 'Compiling Architecture...' : 'Process Complete.'}
                            </p>
                            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-3 md:space-y-4 text-xs md:text-base mb-10">
                              {["Selected LLM Model Core", "Allocated Dedicated Hardware", "Generated Custom Brand Strategy", "Built Web Infrastructure Protocol", "Configured Social Automation Deck"].map((task, i) => (
                                <motion.li key={i} variants={itemVariants} className="flex gap-3 items-start">
                                  <span className="text-white/50">[{i+1}/5]</span>
                                  <span className="text-[#34d399] drop-shadow-[0_0_5px_#34d399]">{task} ... OK</span>
                                </motion.li>
                              ))}
                            </motion.ul>
                            <AnimatePresence>
                              {!isCompiling && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-t-2 border-[#333] pt-8">
                                  <h3 className="text-white font-sans font-black text-2xl md:text-4xl mb-3 tracking-tight">Architecture Validated.</h3>
                                  <p className="text-[#aaa] font-sans text-sm md:text-base mb-8 leading-relaxed">Your bespoke machine is ready for deployment. Claiming a Launch Special spot guarantees immediate hardware allocation.</p>
                                  <button onClick={nextStep} className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#22c55e] text-[#111] rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-2 border-transparent hover:border-[#111] hover:-translate-y-1 hover:scale-105 transition-all w-full">Finalize Configuration →</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}

                      {/* STEP 10 */}
                      {step === 10 && (
                        <div className="text-center py-6">
                          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter mb-6">Claim Your Spot.</h2>
                          <p className="font-sans text-lg md:text-xl text-[#555] mb-10 max-w-lg mx-auto">Enter your primary email. We'll reach out within 24 hours to secure your $1,000 setup rate.</p>
                          <div className="flex flex-col gap-4 max-w-md mx-auto">
                            <input type="email" placeholder="your@email.com" className="w-full bg-white border-[3px] border-[#111] p-4 md:p-5 font-sans font-bold text-lg md:text-xl text-center focus:outline-none focus:border-[#22c55e] focus:shadow-[0_0_0_4px_rgba(34,197,94,0.2)] transition-all rounded-sm shadow-inner" />
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={async () => {
                              try {
                                await fetch(FORMSPREE_ENDPOINT, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                  body: JSON.stringify({ source: 'onboarding_wizard', step: 10 }),
                                });
                              } catch (_) {}
                              window.open(STRIPE_URL, '_blank', 'noopener,noreferrer');
                              onClose();
                            }} className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#22c55e] text-[#111] rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-2 border-transparent hover:border-[#111] hover:-translate-y-1 hover:scale-105 transition-all w-full">Submit Application</motion.button>
                          </div>
                          <p className="font-mono text-[10px] md:text-xs mt-8 text-[#777] uppercase font-bold tracking-widest border-t border-black/10 pt-6 inline-block">Only 5 spots available at current tier.</p>
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
                className={`font-mono font-bold text-xs md:text-sm uppercase tracking-widest text-[#555] hover:text-[#111] transition-colors ${step === 1 || step === 10 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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

const GiantAtmPortfolio = ({ isOpen, onClose }) => {
  const [slide, setSlide] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);

  useEffect(() => {
    if (isOpen || isEnlarged) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, isEnlarged]);

  const next = (e) => { e?.stopPropagation(); setSlide((s) => (s + 1) % portfolioSlides.length); };
  const prev = (e) => { e?.stopPropagation(); setSlide((s) => (s - 1 + portfolioSlides.length) % portfolioSlides.length); };

  return (
    <>
      <AnimatePresence>
        {isOpen && !isEnlarged && (
          <div className="fixed inset-0 z-[200] flex justify-center items-end pb-0">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="absolute top-8 right-8 md:top-12 md:right-12 flex flex-col items-center gap-2 z-[250]"
            >
              <button
                onClick={onClose}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[2px] border-white/40 flex items-center justify-center text-white/50 hover:text-white hover:border-white hover:bg-white/10 transition-all shadow-lg active:scale-95"
                aria-label="Close Portfolio"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v10M18.36 6.64a9 9 0 1 1-12.72 0" />
                </svg>
              </button>
              <span className="font-mono text-[9px] md:text-[10px] font-bold text-white/50 tracking-widest uppercase">Close</span>
            </motion.div>

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative h-[85vh] md:h-[95vh] inline-block z-10 origin-bottom flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="https://i.postimg.cc/d18ByxQX/Beige-ATM-with-transparent-screen.png"
                alt="80m ATM Portfolio"
                className="h-full w-auto object-contain relative z-10 pointer-events-none drop-shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
              />

              <div
                className="absolute z-0 bg-[#050505] rounded-sm overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,1)]"
                style={{ top: "29.5%", bottom: "28%", left: "16.5%", right: "36.5%" }}
              >
                <div className="w-full h-full relative cursor-zoom-in group" onClick={() => setIsEnlarged(true)}>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-6"
                    >
                      <img
                        src={portfolioSlides[slide].img}
                        alt={portfolioSlides[slide].title}
                        className="w-full h-full object-contain filter grayscale-[0.2] contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3))] bg-[length:100%_4px] pointer-events-none z-10"></div>
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,1)] pointer-events-none z-20"></div>

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <div className="bg-black/80 border border-white/20 px-4 md:px-6 py-1 md:py-2 rounded-full backdrop-blur-md">
                      <span className="font-mono text-white/90 text-[8px] md:text-[10px] tracking-[0.2em] font-bold">CLICK TO ENLARGE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute flex gap-4 md:gap-8 items-center z-30 -translate-x-1/2"
                style={{ bottom: "16.5%", left: "40%" }}
              >
                <button
                  onClick={prev}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-[8px] md:rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.8)] active:scale-90 active:translate-y-1"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="font-mono text-white/30 text-[8px] md:text-[10px] tracking-[0.3em] font-bold">
                  {slide + 1} / {portfolioSlides.length}
                </div>

                <button
                  onClick={next}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-[8px] md:rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/10 hover:border-white/30 flex items-center justify-center text-white/50 hover:text-white transition-all shadow-[0_5px_15px_rgba(0,0,0,0.8)] active:scale-90 active:translate-y-1"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#050505] flex items-center justify-center cursor-zoom-out"
            onClick={() => setIsEnlarged(false)}
          >
            <button onClick={() => setIsEnlarged(false)} className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full border-[2px] border-white/40 flex items-center justify-center text-white/50 hover:text-white hover:border-white hover:bg-white/10 transition-colors z-50">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              src={portfolioSlides[slide].img}
              className="w-full max-w-[90vw] h-auto max-h-[90vh] object-contain shadow-2xl"
              alt="Enlarged Portfolio"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const portfolioSlides = [
  { img: "/portfolio/hyphyburger.png", title: "HyphyBurger.com", desc: "RESTAURANT WEBSITE", subtitle: "Menu-first site with appetite-heavy visuals and strong local conversion." },
  { img: "/portfolio/tagesplan.png", title: "Tagesplan Forma", desc: "PROJECT WEBSITE", subtitle: "Editorial project world with clean storytelling and premium motion." },
  { img: "/portfolio/hustlin-usa.png", title: "Hustlin USA", desc: "BRAND REBRAND", subtitle: "Brand refresh with sharper type, systemized assets, and bold retail energy." },
  { img: "/portfolio/80m.png", title: "80M", desc: "BRAND IDENTITY", subtitle: "A full-machine brand language built to feel like money moving." },
  { img: "/portfolio/life-os.png", title: "Life OS Dashboard", desc: "FULL DASHBOARD APP", subtitle: "Dense product UI organized into a clean command center experience." },
  { img: "/portfolio/cortex-mobile.png", title: "Cortex Mobile", desc: "MOBILE APP", subtitle: "Mobile-first agent interface with glassy motion and compact interactions." },
];

// Re-export AtmScrollbar so PortalPage can use the same component
export { AtmScrollbar };

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { scrollY, scrollYProgress: mainScroll } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
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
    offset: ["center 40%", "end top"]
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
    <div className="min-h-screen text-[#111] font-sans selection:bg-[#111] selection:text-[#eae7de] relative">
      <AnimatePresence>{showOnboarding && <OnboardingPopup isVisible={showOnboarding} onClose={() => setShowOnboarding(false)} />}</AnimatePresence>
      {showPortfolio && <GiantAtmPortfolio isOpen={showPortfolio} onClose={() => setShowPortfolio(false)} />}
      <NoiseOverlay />
      <FloatingParticles />
      <PaperBackground />

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
                !isScrolled ? 'bg-transparent px-4 py-2' : ''
              }`}
            >
              <a href="#audit" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Audit</a>
              <a href="#poster" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Manifesto</a>
              <a href="#services" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Services</a>
              <a href="#pricing" className="hover:text-[#0ea5e9] transition-colors" onClick={() => setIsNavOpen(false)}>Pricing</a>
              <a href="#portfolio" className="hover:text-[#22c55e] transition-colors" onClick={(e) => { e.preventDefault(); setShowPortfolio(true); setIsNavOpen(false); }}>Portfolio</a>
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

      <main className="pb-32 px-4 md:px-8 max-w-[1200px] mx-auto overflow-x-hidden">


        {/* Editorial Hero Section */}
        <section className="relative h-[100vh] w-full flex flex-col justify-center pt-24 md:pt-0">

          {/* Centered Typography & CTA */}
          <motion.div
            className="absolute top-[100px] md:top-[120px] left-1/2 -translate-x-1/2 z-[55] max-w-[90vw] md:max-w-[400px] text-center pointer-events-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={fadeUp} className="font-serif text-xl md:text-3xl leading-snug tracking-tight text-white mb-5 drop-shadow-[2px_2px_0_rgba(17,17,17,1)]">
              We install your AI.<br/>
              <span className="italic">We run your social.</span><br/>
              $200/mo. That's it.
            </motion.h1>

            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.05, backgroundColor: '#333' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
              href="#"
              className="font-sans font-black text-sm md:text-base px-6 py-3 bg-[#22c55e] text-[#111] rounded-full inline-block text-center tracking-wider uppercase border-[3px] border-[#111] shadow-[4px_4px_0_0_#111]"
            >
              Book Your Install
            </motion.a>
            <div className="block w-full text-center">
              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.preventDefault(); document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="mt-3 font-sans font-bold text-sm md:text-base px-6 py-3 text-white rounded-full border-2 border-white/40 hover:border-white hover:-translate-y-0.5 transition-all tracking-wider uppercase"
              >
                See the Courses →
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Windows Area */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">

            {/* Icon overlay */}
            <motion.div
              className="absolute inset-0 z-0 flex items-center justify-center mix-blend-multiply opacity-50 pointer-events-none"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="https://i.postimg.cc/nLtSqBSh/icon.png" alt="" className="w-[70%] md:w-[50%] max-w-[600px] object-contain filter contrast-[1.5] brightness-[1.2] grayscale" />
            </motion.div>

            {/* Desktop: side-by-side offset layout. Mobile: stacked centered */}
            <div className="relative w-full h-full flex items-center justify-center">

              {/* Window 1 — top-left offset on desktop */}
              <motion.div
                className="absolute w-[90vw] md:w-[600px] lg:w-[680px] left-1/2 -translate-x-1/2 top-[40%] md:top-[42%] md:-translate-x-[65%] z-40 pointer-events-auto"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))' }}
                animate={{ y: [0, -35, 0], rotate: [0, -1.5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <MacWindow title="System_Warning.log" contentClass="bg-[#eae7de] relative flex flex-col justify-center items-center text-center overflow-hidden min-h-[240px] md:min-h-[300px]">
                  <img src="https://i.postimg.cc/kGcbGVY2/moving-fast.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply pointer-events-none" />
                  <div className="relative z-10 p-6 md:p-12 w-full h-full flex flex-col justify-center items-center">
                    <motion.p variants={fadeUp} initial="hidden" animate="visible" className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight text-[#111] mb-3 mix-blend-multiply">AI moves fast.</motion.p>
                    <motion.p variants={fadeUp} initial="hidden" animate="visible" className="font-sans font-medium text-lg md:text-2xl text-[#555] mix-blend-multiply">Can't keep up with the times?</motion.p>
                  </div>
                </MacWindow>
              </motion.div>

              {/* Window 2 — bottom-right offset on desktop */}
              <motion.div
                className="absolute w-[90vw] md:w-[680px] lg:w-[760px] left-1/2 -translate-x-1/2 bottom-[15%] md:bottom-[5%] md:translate-x-[-35%] z-30 pointer-events-auto"
                style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.7))' }}
                animate={{ y: [0, 35, 0], rotate: [1, 2.5, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <MacWindow title="80m_Core_Agent.exe" contentClass="bg-[#111] relative flex flex-col justify-center items-center text-center overflow-hidden min-h-[240px] md:min-h-[300px]">
                  <img src="https://i.postimg.cc/fTG8hYNp/hero-overlay.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen filter brightness-110 contrast-150 pointer-events-none" />
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 p-6 md:p-12 w-full h-full flex flex-col justify-center items-center">
                    <motion.p variants={fadeUp} className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tighter text-[#eae7de] italic mb-4">Let us do the work for you.</motion.p>
                    <motion.div variants={fadeUp} className="w-16 h-1.5 bg-[#27C93F] mt-2 opacity-80"></motion.div>
                  </motion.div>
                </MacWindow>
              </motion.div>

            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-center font-mono text-[10px] md:text-base font-bold uppercase tracking-[0.2em] mix-blend-multiply flex justify-center items-center gap-3 z-30 whitespace-nowrap"
          >
            <span className="w-8 h-px bg-[#111]" aria-hidden="true"></span>
            <h2>does your branding suck Richard?</h2>
            <span className="w-8 h-px bg-[#111]" aria-hidden="true"></span>
          </motion.div>
        </section>

        {/* --- DOES YOUR WEBSITE SUCK RICHARD? (Audit Grid - U-Curve Rainbow with Scrolling Digitize effect) --- */}
        <section id="audit" ref={auditRef} className="relative pt-4 pb-4 px-4 md:px-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="relative z-10 w-full flex flex-col items-center overflow-visible">

            {/* Massive Overlapping Image Header */}
            <motion.div variants={fadeUp} className="w-full mb-8 flex justify-center" style={{ maxWidth: '1152px', margin: '0 auto' }}>
              <img
                src="https://i.postimg.cc/zGT0D3zP/does-your-website-suck-richards.png"
                alt="Does your website suck Richard?"
                className="w-full h-auto object-contain mix-blend-multiply filter contrast-125"
              />
            </motion.div>

            {/* Transparent U-Curve Image Grid */}
            <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-center gap-6 md:gap-4 lg:gap-12 z-20" style={{ maxWidth: '1152px', margin: '0 auto' }}>

              {/* Image 1 - Bad Graphic Design + Hover */}
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                style={{ x: suckX1, y: suckY1, rotate: suckRotate1, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter }}
                className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[3/4] z-[150] cursor-pointer group"
              >
                <img src="https://i.postimg.cc/bNKHDn37/bad-graphic-design.png" alt="Bad graphic design" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                <img src="https://i.postimg.cc/R0VsyTc2/bad-graphic-design-hover.png" alt="Bad branding fix" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Image 2 - Old Webpage (Center) + Hover */}
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                style={{ x: suckX2, y: suckY2, rotate: suckRotate2, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter }}
                className="relative w-full max-w-[320px] md:max-w-[380px] aspect-[3/4] z-[150] cursor-pointer group"
              >
                <img src="https://i.postimg.cc/jdGQwfZB/old-webpage.png" alt="Old webpage" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                <img src="https://i.postimg.cc/MGKPNYyh/old-webpage-hover.png" alt="Webpage fix" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* Image 3 - Chat GPT + Hover */}
              <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                style={{ x: suckX3, y: suckY3, rotate: suckRotate3, scale: suckScale, opacity: digitizeOpacity, filter: digitizeFilter3 }}
                className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[3/4] z-[150] cursor-pointer group"
              >
                <img src="https://i.postimg.cc/dtzmkC5M/chat-gpt.png" alt="Chat GPT" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                <img src="https://i.postimg.cc/KYvqw5n6/chat-gpt-hover.png" alt="Chat GPT branding fix" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-[8px_8px_16px_rgba(0,0,0,0.3)] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* --- BIG HORIZONTAL SECTION (Tired of fighting...) --- */}
        <section className="mt-4 px-4 md:px-8 relative py-8 flex items-center" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div className="w-full" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-1 text-center md:text-left z-20 relative">
                <motion.h3 variants={fadeUp} className="font-serif text-5xl md:text-7xl lg:text-[6vw] leading-[0.85] tracking-tighter mix-blend-multiply text-[#111]">
                  <motion.span variants={fadeUp} className="block">Tired of fighting</motion.span>
                  <motion.span variants={fadeUp} className="italic block">with the algorithm?</motion.span>
                </motion.h3>
              </div>
              <div className="flex-1 w-full relative z-10 pointer-events-none flex justify-center md:justify-end">
                <ParallaxImage
                  src="https://i.postimg.cc/528n9j4K/why-battle-with-computers.png"
                  alt="Battle with computers graphic"
                  className="w-full"
                  imgClassName="w-[140%] max-w-none md:w-[160%] scale-110 origin-center md:origin-right filter contrast-125"
                  offset={40}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- THE INTERNET IS HARD (Vertical Poster Stack in MacWindows) --- */}
        <section id="poster" className="mt-4 px-4 md:px-8 text-center" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>

            <header className="mb-8">
              <motion.h2 variants={fadeUp} className="font-serif text-[12vw] md:text-[9vw] uppercase leading-[0.85] tracking-tighter mix-blend-multiply text-[#111]">
                <motion.span variants={fadeUp} className="block">THE INTERNET</motion.span>
                <motion.span variants={fadeUp} className="italic block">IS HARD!</motion.span>
              </motion.h2>
            </header>

            {/* Vertical Stack with Fake Windows */}
            <div className="flex flex-col items-center gap-6 md:gap-10 mb-4 max-w-4xl mx-auto">

              <motion.div variants={fadeUp} className="w-full max-w-[600px]">
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

              <motion.div variants={fadeUp} className="w-full py-4 px-4">
                <motion.h3 variants={fadeUp} className="font-serif italic text-4xl md:text-6xl lg:text-[5vw] leading-[0.9] tracking-tighter mix-blend-multiply text-[#111]">
                  Are your hands tied with real life sh*t?
                </motion.h3>
              </motion.div>

              <motion.div variants={fadeUp} className="w-full max-w-[600px]">
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
        </section>

        {/* --- BIG HORIZONTAL SECTION + SERVICES WIRE CONNECTION --- */}
        <div className="relative w-full z-10">
          {/* Main Computer PC Section - Needs lower z-index than Services to allow the terminal to receive the line correctly */}
          <section className="mt-8 px-4 md:px-8 relative py-8 flex items-center z-10" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div className="w-full" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
              <div className="flex flex-col md:flex-row items-center gap-6 relative">
                
                {/* The Happy PC Image */}
                <div className="flex-1 w-full relative z-20 order-2 md:order-1 pointer-events-none flex justify-center md:justify-start">
                  <ParallaxImage
                    src="https://i.postimg.cc/t4F2R7q2/bottom-of-funnel-happy-customer.png"
                    alt="Happy Customer Face"
                    className="w-full relative z-20"
                    imgClassName="w-[140%] max-w-none md:w-[160%] scale-110 origin-center md:origin-left filter sepia-[0.4] contrast-125 relative z-20"
                    offset={40}
                  />
                  
                  {/* The Origin Wire - drops straight down through the center of the viewport onto the horizontal Node bus below */}
                  <div className="absolute top-[80%] left-[8%] md:left-1/2 w-[2px] h-[350px] lg:h-[480px] data-line-glow -translate-x-1/2 z-0" />
                </div>
                
                <div className="flex-1 text-center md:text-left order-1 md:order-2 z-20 relative md:pl-16">
                  <motion.h3 variants={fadeUp} className="font-serif text-5xl md:text-7xl lg:text-[6vw] leading-[0.9] tracking-tighter mix-blend-multiply text-[#111]">
                    <motion.span variants={fadeUp} className="block">Let us.</motion.span>
                    <motion.span variants={fadeUp} className="italic block">Do the work.</motion.span>
                  </motion.h3>
                  <motion.p variants={fadeUp} className="font-sans text-xl md:text-3xl mt-4 text-[#333] leading-snug mix-blend-multiply font-medium">
                    So you can go see that movie you always wanted to.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Services - Animated CRT Machine Layout */}
          <section id="services" className="mt-32 md:mt-56 px-4 md:px-8 relative z-20" aria-labelledby="services-heading" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-20">
              
              {/* Editorial Header */}
              <motion.header variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-[#111] pb-6 mb-16 gap-6 relative z-30 bg-[#eae7de] p-6 lg:p-8 rounded-[4px] shadow-sm">
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

              {/* Terminal Hierarchy Container */}
              <div className="relative mt-8 md:mt-24 w-full z-10">
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

        {/* Pricing / Investment */}
        {/* ── PRICING SECTION ── */}
        <section id="pricing" className="mt-32 px-4 md:px-8 relative" aria-labelledby="pricing-heading" style={{ maxWidth: '1200px', margin: '0 auto' }}>
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
    <motion.p variants={fadeUp} className="font-mono uppercase tracking-[0.25em] mb-4 text-xs font-bold text-center mix-blend-multiply text-[#555]">// investment</motion.p>
    <motion.h2 id="pricing-heading" variants={fadeUp} className="font-serif text-5xl md:text-7xl leading-[0.9] tracking-tight mb-4 mix-blend-multiply text-center">
      We come to you.
    </motion.h2>
    <motion.p variants={fadeUp} className="font-sans text-lg md:text-xl text-[#555] text-center mb-16 mix-blend-multiply font-medium">In-person install. Monthly maintenance. Courses to learn on your own.</motion.p>

    {/* 3 Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

      {/* Card 1 — In-Person Install */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative">
        {/* Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 font-mono text-[9px] uppercase tracking-[0.25em] bg-[#22c55e] text-[#111] px-4 py-1.5 rounded-full font-black">First 5 Get $1K Off</div>
        <AsciiShadow size="lg" rotate="-0.5deg">
          <MacWindow title="01_In_Person_Install.exe" contentClass="bg-[#111] p-8 text-[#eae7de]">
            <div className="border-b-2 border-[#333] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#22c55e] mb-3">// the main offer</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">In-Person Install</h3>
              <p className="font-sans text-sm text-[#888] italic">We show up. Set it up. Leave when it's running.</p>
            </div>

            {/* Pricing block */}
            <div className="mb-6">
              <div className="flex items-end gap-3">
                <p className="font-serif text-5xl font-black tracking-tighter leading-none text-[#eae7de]">$1,000</p>
                <p className="font-serif text-2xl font-black tracking-tighter leading-none text-[#555] line-through mb-1">$2,000</p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mt-1">founding member price</p>
            </div>

            {/* Spots remaining */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex gap-1">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="w-4 h-4 rounded-full border border-[#333] bg-[#22c55e]/20 border-[#22c55e]/40" />
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#22c55e] uppercase tracking-widest font-bold">5 spots left</span>
            </div>

            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "Full AI system installed on-site",
                "80m Agent Chat UI included free",
                "Social posts created & delivered monthly",
                "Brand assets designed for you",
                "System maintained — we handle updates",
                "You own everything. We just keep it running.",
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
              Claim Your Spot →
            </motion.button>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

      {/* Card 2 — Monthly Maintenance */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative">
        <AsciiShadow size="md" rotate="0.5deg">
          <MacWindow title="02_Monthly_Maintenance.exe" contentClass="bg-[#eae7de] p-8 text-[#111]">
            <div className="border-b-2 border-[#111] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555] mb-3">// ongoing</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">Monthly Maintenance</h3>
              <p className="font-sans text-sm text-[#555] italic">We do the work. You run the business.</p>
            </div>
            <div className="mb-8">
              <p className="font-serif text-5xl font-black tracking-tighter leading-none">$200</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mt-1">per month — cancel anytime</p>
            </div>
            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "Social posts designed + written + delivered",
                "Brand assets refreshed monthly",
                "System updates & maintenance handled",
                "80m Agent Chat UI running 24/7",
                "Support when you need it",
                "No meetings. Just delivery.",
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
              Get Started →
            </motion.button>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

      {/* Card 3 — Courses */}
      <motion.div variants={fadeUp} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="relative">
        <AsciiShadow size="md" rotate="0.5deg">
          <MacWindow title="03_The_Courses.exe" contentClass="bg-[#eae7de] p-8 text-[#111]">
            <div className="border-b-2 border-[#111] pb-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555] mb-3">// learn it yourself</p>
              <h3 className="font-serif text-2xl md:text-3xl font-black leading-tight mb-1">The Courses</h3>
              <p className="font-sans text-sm text-[#555] italic">Free with any install. Or buy standalone.</p>
            </div>
            <div className="mb-8">
              <p className="font-serif text-5xl font-black tracking-tighter leading-none">$247</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mt-1">one-time — yours forever</p>
            </div>
            <ul className="space-y-3 font-sans text-sm mb-8">
              {[
                "7 video classes covering the full system",
                "Install, prompting, hosting, content, intel",
                "Downloadable config templates",
                "Lifetime access + future updates",
                "Included free with any install purchase",
                "Private community access",
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
              className="w-full font-sans font-black text-base py-4 bg-[#111] text-[#eae7de] rounded-full shadow-[0_6px_0_0_rgba(0,0,0,0.5)] hover:shadow-[0_10px_0_0_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all border-2 border-[#111]"
            >
              See the Curriculum →
            </motion.button>
          </MacWindow>
        </AsciiShadow>
      </motion.div>

    </div>
  </motion.div>
</section>

        {/* ── COURSE SECTION ── */}
        <section id="course" className="mt-40 px-4 md:px-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}>

            {/* HERO */}
            <motion.div variants={fadeUp} className="text-center mb-24">
              <p className="font-mono uppercase tracking-[0.2em] mb-6 text-sm mix-blend-multiply font-bold text-center text-[#555]">// the curriculum</p>
              <h2 className="font-serif text-6xl md:text-8xl lg:text-[7vw] leading-[0.85] tracking-tighter mix-blend-multiply text-[#111] mb-8">
                Own Your AI Stack.<br/><span className="italic">Class by Class.</span>
              </h2>
              {/* Meta Row — boxed pills with hard shadows */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-[#111] mix-blend-multiply">
                <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">3 Video Classes</span>
                <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">~4 Hours</span>
                <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">Lifetime Access</span>
                <span className="border-2 border-[#111] px-4 py-2 bg-[#eae7de] shadow-[4px_4px_0_0_#111]">Private Discord</span>
              </motion.div>
            </motion.div>

            {/* OUTCOMES GRID — editorial with ✓ checkmarks */}
            <div className="mb-32">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 text-center mix-blend-multiply tracking-tight">What you walk away with:</motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {[
                  "A fully voice-controlled local agent.",
                  "Automated delegation workflows.",
                  "Private, self-hosted infrastructure.",
                  "Custom skills built for your exact needs.",
                  "Reliable cron jobs running 24/7.",
                  "100% ownership of your code and data."
                ].map((outcome, idx) => (
                  <motion.div variants={fadeUp} key={idx} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111] flex items-start gap-4 hover:-translate-y-1 transition-transform">
                    <span className="font-serif text-3xl font-black text-[#22c55e]">✓</span>
                    <p className="font-sans text-xl font-bold text-[#111] leading-tight mt-1">{outcome}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* THE 3 CLASSES — horizontal stacked, inside MacWindows */}
            <div className="max-w-5xl mx-auto space-y-8 mb-32">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 text-center mix-blend-multiply tracking-tight">The Roadmap</motion.h3>

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
              <motion.blockquote variants={fadeUp} className="border-l-8 border-[#111] pl-8 py-4 mix-blend-multiply">
                <p className="font-serif text-2xl md:text-3xl italic text-[#111] leading-snug mb-6">"I spent two weeks fumbling through docs before this. Class 1 alone saved me that much time. By Class 3 I had everything deployed on my own server."</p>
                <footer className="font-mono text-sm font-bold uppercase tracking-widest text-[#555]">— Early Access Member · Indie Maker</footer>
              </motion.blockquote>
              <motion.blockquote variants={fadeUp} className="border-l-8 border-[#111] pl-8 py-4 mix-blend-multiply">
                <p className="font-serif text-2xl md:text-3xl italic text-[#111] leading-snug mb-6">"The prompting section in Class 2 is worth the price alone. I went from getting useless responses to actually delegating my morning emails."</p>
                <footer className="font-mono text-sm font-bold uppercase tracking-widest text-[#555]">— Early Access Member · Founder, 2-person SaaS</footer>
              </motion.blockquote>
            </div>

            {/* INCLUDED — numbered circles grid */}
            <div className="mb-32 max-w-6xl mx-auto">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 text-center mix-blend-multiply tracking-tight">Inside the Portal</motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "3 Video Classes", desc: "~4 hours, HD, step-by-step technical walk-throughs." },
                  { title: "Config Templates", desc: "Copy-paste YAML and JSON files to eliminate setup errors." },
                  { title: "Private Discord", desc: "Direct access to the community and technical QA." },
                  { title: "Lifetime Access", desc: "One payment. No recurring fees. All future updates." }
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
            <div className="max-w-4xl mx-auto mb-32 border-t-2 border-[#111]">
              <motion.h3 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12 mt-12 text-center mix-blend-multiply tracking-tight">Frequently Asked</motion.h3>
              {[
                { q: "Do I need to be a developer to take this?", a: "Basic terminal knowledge helps speed things up, but it is not strictly required. We walk through every step of the installation and configuration process on-screen." },
                { q: "How much time will this take?", a: "There are roughly 4 hours of dense video content. Depending on your experience, expect to spend another 3-6 hours pausing, implementing, and configuring the system." },
                { q: "What is the refund policy?", a: "We offer a 14-day money-back guarantee. If you go through the classes, do the work, and find the system doesn't deliver the infrastructure we promised, we'll refund you." },
                { q: "Do I need a powerful computer?", a: "To run the LLMs entirely locally, we recommend at least 16GB of Unified Memory/RAM (like an M-series Mac or equivalent PC). If your hardware is older, the course shows you how to hook the same infrastructure into cloud APIs (OpenAI/Anthropic) instead." },
                { q: "How does this differ from the Full System offering?", a: "The Launch Special (Full System) is a done-for-you service where we ship you a configured Mini PC and manage the agent for you monthly. The Course is a one-time purchase teaching you exactly how to build and maintain the stack yourself." },
                { q: "What kind of support is included?", a: "You get lifetime access to our private Discord server where you can ask questions, debug errors with the community, and get feedback on your setup." },
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
                onClick={() => window.open(STRIPE_URL, '_blank', 'noopener,noreferrer')}
                className="font-sans font-black text-xl md:text-2xl px-12 py-6 bg-[#22c55e] text-[#111] border-[3px] border-transparent hover:border-[#eae7de] shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 hover:scale-105 transition-all w-full md:w-auto"
              >
                Enroll Now — $2,000
              </button>
            </motion.div>

          </motion.div>
        </section>

          {/* ── FOOTER CTA SECTION ── */}
        <section id="contact" className="mt-24 px-4 md:px-8 max-w-3xl mx-auto text-center relative z-20" aria-label="Contact and Application">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="font-serif text-7xl md:text-[8rem] leading-[0.8] tracking-tight mb-8 mix-blend-multiply">
              <motion.span variants={fadeUp} className="block">5 spots.</motion.span>
              <motion.span variants={fadeUp} className="italic block">$1K each.</motion.span>
            </motion.h2>

            <motion.p variants={fadeUp} className="font-sans text-xl md:text-2xl text-[#333] mb-12 mix-blend-multiply font-medium">
              $1,000 setup + $0/mo (first year).<br/>
              Hardware ships in 48 hours.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                className="font-sans font-bold text-lg md:text-2xl px-16 py-6 bg-[#111] text-[#eae7de] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-2 border-transparent hover:border-[#eae7de] transition-all"
              >
                Apply for Access
              </motion.button>
              <motion.a variants={fadeUp} href="mailto:contact@80m.ai" className="font-mono text-sm uppercase tracking-widest hover:underline underline-offset-8 mix-blend-multiply font-black">
                contact@80m.ai — response within 48 hours
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="mt-48 md:mt-64 px-4 md:px-8 pb-16 text-center relative z-20" style={{ maxWidth: '768px', margin: '0 auto' }}>
          <div className="flex flex-col items-center justify-center gap-6 mix-blend-multiply opacity-80 border-t-2 border-[#111] pt-12">
            <div className="flex items-center gap-3">
              <img src="https://i.postimg.cc/P5W3dKTx/logo.png" alt="80m Logo" className="h-10 md:h-12 w-auto" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest font-bold">© 2026 80m SYSTEMS. All rights reserved.</span>
            <a href="mailto:contact@80m.ai" className="font-mono text-xs uppercase tracking-widest hover:underline underline-offset-8 font-black">contact@80m.ai</a>
          </div>
        </footer>

      </main>
    </div>
  );
}
