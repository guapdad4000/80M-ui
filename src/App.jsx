import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import FuzzyText from './FuzzyText';
import DecryptedText from './DecryptedText';

// --- Custom Components & Styles ---

const NoiseOverlay = () => (
  <svg className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.4] mix-blend-overlay" aria-hidden="true">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

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
const AtmScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDir, setScrollDir] = useState('down');
  const lastScrollY = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let scrollTimeout;

    const updateProgress = () => {
      const scrollTop = window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      const maxScroll = scrollHeight - clientHeight;
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
      // Cancel any pending RAF and schedule a new one for smooth tracking
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);

      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also listen on document for scroll events that may fire there
    document.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { width: 0px; background: transparent; }
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
        className="fixed right-2 top-4 bottom-4 w-16 z-[100] pointer-events-none flex justify-center"
        style={{ pointerEvents: 'none' }}
        onWheel={(e) => {
          // Wheel scroll anywhere in the scrollbar strip scrolls the page
          window.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
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
            let startScrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            
            // Disable scroll behavior smooth temporarily by setting an inline style on html
            const docEl = document.documentElement;
            const originalScrollBehavior = docEl.style.scrollBehavior;
            docEl.style.scrollBehavior = 'auto';

            const handlePointerMove = (moveEvent) => {
              const deltaY = moveEvent.clientY - startY;
              const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
              if (maxScroll <= 0) return;
              
              // The thumb travels from top = -16px to top = (innerHeight - 144)px
              // The total interactive track height is innerHeight - 128px
              const trackHeight = window.innerHeight - 128;
              const progressDelta = deltaY / trackHeight;
              
              const targetScrollY = startScrollY + (progressDelta * maxScroll);
              window.scrollTo({ top: targetScrollY, behavior: 'instant' });
            };

            const handlePointerUp = (upEvent) => {
              docEl.style.scrollBehavior = originalScrollBehavior;
              target.releasePointerCapture(upEvent.pointerId);
              target.removeEventListener('pointermove', handlePointerMove);
              target.removeEventListener('pointerup', handlePointerUp);
            };

            target.addEventListener('pointermove', handlePointerMove);
            target.addEventListener('pointerup', handlePointerUp);
          }}
          onWheel={(e) => {
            // Forward wheel events on the thumb directly to page scroll
            e.stopPropagation();
            window.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
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
          className="px-5 py-2.5 rounded-full border font-mono text-sm uppercase tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer"
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

const OnboardingPopup = ({ onClose }) => {
  const [slide, setSlide] = useState(0);
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    // Slide 1
    firstName: '',
    businessName: '',
    // Slide 2
    industry: '',
    painPoints: [],
    // Slide 3
    brandingIssues: [],
    logoUrl: '',
    // Slide 4
    platforms: [],
    followerRange: '',
    postingFrequency: '',
    // Slide 5
    hoursPerWeek: '',
    automate: [],
    // Slide 6
    goals: [],
    // Slide 7
    voiceSample: '',
    contentTypes: [],
    // Slide 8
    adminTasks: [],
    researchAreas: [],
    // Slide 9
    startDate: '',
    // Slide 10
    email: '',
    phone: '',
    referral: '',
  });

  const update = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  // Validation: which fields are required per slide (0-indexed)
  const requiredBySlide = {
    0: [],          // welcome — no required fields, just a CTA
    1: [],          // problem reveal
    2: [],          // branding roast
    3: [],          // algorithm
    4: [],          // real life
    5: ['goals'],   // goal selection — pick at least one
    6: ['voiceSample'], // brand voice
    7: [],          // ops
    8: ['startDate'],   // timeline
    9: ['email'],   // contact
  };

  const validate = () => {
    const required = requiredBySlide[slide] || [];
    for (const field of required) {
      const val = formData[field];
      if (!val || (Array.isArray(val) && val.length === 0)) return false;
    }
    return true;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const nextSlide = () => {
    if (!validate()) { triggerShake(); return; }
    if (slide < 9) setSlide(s => s + 1);
  };

  const prevSlide = () => {
    if (slide > 0) setSlide(s => s - 1);
  };

  const handleFinalSubmit = async () => {
    if (!validate()) { triggerShake(); return; }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        ...formData,
        painPoints: (formData.painPoints || []).join(', '),
        brandingIssues: (formData.brandingIssues || []).join(', '),
        platforms: (formData.platforms || []).join(', '),
        automate: (formData.automate || []).join(', '),
        goals: (formData.goals || []).join(', '),
        contentTypes: (formData.contentTypes || []).join(', '),
        adminTasks: (formData.adminTasks || []).join(', '),
        researchAreas: (formData.researchAreas || []).join(', '),
      };
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) {
      // Don't block the user if Formspree fails — just proceed to Stripe
    } finally {
      setIsSubmitting(false);
      window.open(STRIPE_URL, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  const shakeStyle = shake ? {
    animation: 'onboardingShake 0.45s ease-in-out',
  } : {};

  // --- SLIDE DEFINITIONS ---
  const slides = [

    /* ── SLIDE 1 ── Welcome + Name */
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-10 bg-[#111] overflow-y-auto">
      <div className="mb-2">
        <FuzzyText 
          baseIntensity={0.2} 
          hoverIntensity={0.5} 
          enableHover 
          fontSize="clamp(3rem, 8vw, 6rem)" 
          fontWeight={900} 
          fontFamily="serif"
          color="#eae7de"
        >
          80m SYSTEMS
        </FuzzyText>
      </div>
      <h3 className="font-serif text-3xl md:text-5xl text-[#eae7de] italic mb-3">
        <DecryptedText text="THE MACHINE" animateOn="hover" />
      </h3>
      <p className="font-sans text-base text-[#888] font-medium leading-relaxed max-w-md mb-8">
        Started by tech-advanced people...<br/>
        <span className="italic text-[#aaa]">to catch your technologically challenged ass up.</span>
      </p>

      <div className="w-full max-w-md flex flex-col gap-6 mb-10">
        <div>
          <label className="block text-left font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Your Name *</label>
          <input
            id="ob-firstName"
            className={darkInput}
            placeholder="Richard"
            value={formData.firstName}
            onChange={e => update('firstName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-left font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Business Name</label>
          <input
            id="ob-businessName"
            className={darkInput}
            placeholder="Richard's Emporium"
            value={formData.businessName}
            onChange={e => update('businessName', e.target.value)}
          />
        </div>
      </div>

      <button
        id="ob-slide1-next"
        onClick={nextSlide}
        className="font-sans font-black text-base px-10 py-4 bg-[#eae7de] text-[#111] rounded-full uppercase tracking-wider hover:scale-105 transition-transform"
      >
        Apply for Access &rarr;
      </button>

      <p className="mt-6 text-[#555] font-mono text-[10px] uppercase tracking-widest">contact@80m.ai</p>
    </div>,

    /* ── SLIDE 2 ── Industry + Pain Points */
    <div className="relative flex flex-col justify-center items-center h-full text-center px-8 py-10 bg-[#eae7de] overflow-y-auto">
      <img src="https://i.postimg.cc/kGcbGVY2/moving-fast.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-multiply pointer-events-none" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <p className="font-serif text-4xl md:text-6xl leading-[0.9] tracking-tight text-[#111] mb-3 mix-blend-multiply font-black">AI MOVES FAST AS FUCK.</p>
        <p className="font-sans font-medium text-lg text-[#555] mix-blend-multiply mb-8">What's your world? Let's place you in it.</p>

        <div className="w-full max-w-md mb-8 text-left">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Your Industry</label>
          <select
            id="ob-industry"
            className={creamInput + " cursor-pointer"}
            value={formData.industry}
            onChange={e => update('industry', e.target.value)}
          >
            <option value="">— Pick one —</option>
            {['E-commerce', 'Real Estate', 'Fitness & Wellness', 'Food & Bev', 'Beauty & Fashion', 'Music & Entertainment', 'Coaching & Consulting', 'Tech / SaaS', 'Local Services', 'Content Creator', 'Non-Profit', 'Other'].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="w-full max-w-md text-left">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-3">What's killing you right now? (pick all that apply)</label>
          <PillSelect
            options={['No time', 'No content ideas', 'Bad branding', 'Algorithm hates me', 'Zero leads', 'Admin overload', 'Can\'t afford a team', 'AI confusion']}
            value={formData.painPoints}
            onChange={v => update('painPoints', v)}
            multi
            accent="#0ea5e9"
            textColor="#111"
            borderColor="rgba(14,165,233,0.4)"
            activeBg="rgba(14,165,233,0.15)"
          />
        </div>
      </div>
    </div>,

    /* ── SLIDE 3 ── Branding Audit */
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 bg-[#111] text-[#eae7de] overflow-y-auto">
      <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tighter mb-2 italic text-[#FF5F56] text-center">Does your branding suck, Richard?</h2>
      <p className="font-sans text-base mb-6 font-medium text-[#888] text-center">(Yes. It does. Let's figure out how bad.)</p>

      <div className="w-full max-w-md flex flex-col gap-8">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">What sucks most? (be honest)</label>
          <PillSelect
            options={['The logo', 'The colors', 'The fonts', 'The vibe', 'The website', 'Everything. It all sucks.']}
            value={formData.brandingIssues}
            onChange={v => update('brandingIssues', v)}
            multi
            accent="#FF5F56"
            textColor="#eae7de"
            borderColor="rgba(255,95,86,0.4)"
            activeBg="rgba(255,95,86,0.15)"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Drop your current website or socials URL</label>
          <input
            id="ob-logoUrl"
            className={darkInput}
            placeholder="https://richard-in-ms-paint.com"
            value={formData.logoUrl}
            onChange={e => update('logoUrl', e.target.value)}
          />
          <p className="font-mono text-[9px] text-[#555] mt-1">// So we can cringe at it properly before fixing it.</p>
        </div>
      </div>

      <p className="font-serif text-xl font-black italic text-center mt-8 text-[#eae7de]">We see you. We judge you. Then we fix it.</p>
    </div>,

    /* ── SLIDE 4 ── Social Media Situation */
    <div className="relative flex flex-col justify-center items-center h-full px-8 py-10 bg-[#eae7de] overflow-y-auto">
      <div className="absolute inset-0 z-0 flex justify-center items-center opacity-15 mix-blend-multiply pointer-events-none">
        <img src="https://i.postimg.cc/Gmvq39LX/internet-is-hard.png" alt="" className="w-full h-full object-cover filter grayscale contrast-150" />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <p className="font-serif text-3xl md:text-4xl italic text-[#111] mb-2 font-black text-center">Tired of fighting with the algorithm?</p>
        <h2 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#111] mb-6 text-center">THE INTERNET IS HARD!</h2>

        <div className="w-full max-w-md flex flex-col gap-8">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Where are you posting? (pick all)</label>
            <PillSelect
              options={['Instagram', 'TikTok', 'X / Twitter', 'LinkedIn', 'YouTube', 'Facebook', 'Threads', 'Pinterest', 'Nowhere lol']}
              value={formData.platforms}
              onChange={v => update('platforms', v)}
              multi
              accent="#0ea5e9"
              textColor="#111"
              borderColor="rgba(14,165,233,0.4)"
              activeBg="rgba(14,165,233,0.15)"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Followers (total)</label>
              <select className={creamInput + " cursor-pointer"} value={formData.followerRange} onChange={e => update('followerRange', e.target.value)}>
                <option value="">— Range —</option>
                {['0–500', '500–2K', '2K–10K', '10K–50K', '50K+', 'I don\'t know'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">How often you post</label>
              <select className={creamInput + " cursor-pointer"} value={formData.postingFrequency} onChange={e => update('postingFrequency', e.target.value)}>
                <option value="">— Frequency —</option>
                {['Daily', '3–5x/week', '1–2x/week', 'Whenever I remember', 'Never'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>,

    /* ── SLIDE 5 ── Capacity Survey */
    <div className="relative flex flex-col justify-center items-center h-full px-8 py-10 bg-[#111] text-[#eae7de] overflow-y-auto">
      <div className="absolute inset-0 z-0 flex justify-center items-center opacity-10 pointer-events-none">
        <img src="https://i.postimg.cc/K8tJc4GN/hand-tied-with-real-life-sh-t.png" alt="" className="w-full h-full object-cover filter grayscale" />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tighter mb-2 text-[#FFBD2E] text-center">Are your hands tied with real life shit?</h2>
        <p className="font-sans text-base text-[#888] font-medium text-center mb-8">Kids screaming. Boss emailing. Tell us how buried you are.</p>

        <div className="w-full max-w-md flex flex-col gap-8">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Hours/week spent on digital marketing & admin</label>
            <select className={darkInput + " cursor-pointer"} value={formData.hoursPerWeek} onChange={e => update('hoursPerWeek', e.target.value)}>
              <option value="">— Be honest —</option>
              {['0–2 hrs', '2–5 hrs', '5–10 hrs', '10–20 hrs', '20+ hrs (send help)'].map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">What do you wish someone else would just DO for you?</label>
            <PillSelect
              options={['Post for me', 'Write captions', 'Reply to DMs', 'Send invoices', 'Answer emails', 'Track analytics', 'Schedule everything', 'Research competitors']}
              value={formData.automate}
              onChange={v => update('automate', v)}
              multi
              accent="#FFBD2E"
              textColor="#eae7de"
              borderColor="rgba(251,191,36,0.4)"
              activeBg="rgba(251,191,36,0.15)"
            />
          </div>
        </div>

        <p className="font-serif text-2xl italic font-black text-[#eae7de] mt-8 text-center">Let us. Do. The. Work.</p>
      </div>
    </div>,

    /* ── SLIDE 6 ── Goals — which services they want */
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 bg-[#060606] text-[#22c55e] overflow-y-auto">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="relative z-10 w-full flex flex-col items-center">
        <p className="font-serif italic text-lg text-[#22c55e] opacity-70 mb-2">After years of manual labor...</p>
        <h2 className="font-serif text-4xl md:text-6xl font-black text-[#22c55e] uppercase tracking-tighter mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] text-center">
          <DecryptedText 
            text={"THE MACHINE\nTAKES OVER."} 
            animateOn="view" 
            sequential={true} 
            revealDirection="start" 
            speed={40} 
            className="text-[#22c55e]" 
            encryptedClassName="text-[#22c55e]/40" 
          />
        </h2>
        <p className="font-mono text-xs uppercase tracking-widest text-[#22c55e] opacity-60 mb-8">By 80m Systems</p>

        <div className="w-full max-w-md">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#22c55e]/60 mb-3 text-center">
            What do you want The Machine to handle? *<br/>
            <span className="normal-case not-italic text-[9px] text-[#22c55e]/40">(select at least one)</span>
          </label>
          <PillSelect
            options={['Social Management', 'Content Creation', 'Operations & Admin', 'Market Intelligence', 'All of the above (obviously)']}
            value={formData.goals}
            onChange={v => update('goals', v)}
            multi
          />
        </div>

        <div className="mt-10 border border-[#22c55e]/20 bg-[#22c55e]/5 p-6 max-w-md w-full shadow-[0_0_15px_rgba(34,197,94,0.08)]">
          <p className="font-mono text-xs text-[#22c55e] opacity-70 text-center leading-relaxed">
            Your own dedicated AI agent.<br/>Running 24/7 just for you.<br/>
            <span className="opacity-50">// Like a quiet, competent roommate who actually gets shit done.</span>
          </p>
        </div>
      </div>
    </div>,

    /* ── SLIDE 7 ── Content Preferences */
    <div className="flex flex-col h-full bg-[#060606] px-8 py-10 text-[#22c55e] overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center gap-8 md:max-w-md mx-auto w-full">
        <div className="border border-[#22c55e]/30 bg-[#22c55e]/10 p-8 relative">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-[#22c55e]/30"></div>
          <h3 className="font-mono font-bold text-base uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="animate-pulse">█</span> Social Mgmt + Content Forge
          </h3>
          <p className="font-mono text-xs opacity-70 italic mb-4">// It writes like you, not like ChatGPT on Xanax.</p>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#22c55e]/50 mb-1">Describe your brand voice in 1–2 sentences *</label>
              <textarea
                id="ob-voiceSample"
                className="w-full bg-[#0a0a0a] border border-[#22c55e]/30 text-[#22c55e] font-sans text-base px-5 py-4 rounded placeholder-[#22c55e]/30 focus:outline-none focus:border-[#22c55e] transition-colors resize-none"
                rows={3}
                placeholder="e.g. Loud, sarcastic, no-BS. Like a finance bro who hates BS."
                value={formData.voiceSample}
                onChange={e => update('voiceSample', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-[#22c55e]/50 mb-2">Content types you need</label>
              <PillSelect
                options={['Captions', 'Scripts', 'Blogs', 'Email sequences', 'Short-form video', 'Carousels', 'Stories', 'Roasts']}
                value={formData.contentTypes}
                onChange={v => update('contentTypes', v)}
                multi
              />
            </div>
          </div>
        </div>
      </div>
    </div>,

    /* ── SLIDE 8 ── Operations + Intelligence Scope */
    <div className="flex flex-col h-full bg-[#060606] px-8 py-10 text-[#22c55e] overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center gap-8 md:max-w-md mx-auto w-full">
        <div className="border border-[#22c55e]/30 bg-[#22c55e]/10 p-8 relative">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-[#22c55e]/30"></div>
          <h3 className="font-mono font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="animate-pulse">█</span> Operations
          </h3>
          <p className="font-mono text-xs opacity-50 italic mb-3">// All the soul-crushing admin handled silently.</p>
          <PillSelect
            options={['Inbox management', 'Invoice follow-ups', 'Scheduling', 'Customer replies', 'Payment reminders', 'CRM updates']}
            value={formData.adminTasks}
            onChange={v => update('adminTasks', v)}
            multi
          />
        </div>

        <div className="border border-[#22c55e]/30 bg-[#22c55e]/10 p-8 relative">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-[#22c55e]/30"></div>
          <h3 className="font-mono font-bold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="animate-pulse">█</span> Intelligence
          </h3>
          <p className="font-mono text-xs opacity-50 italic mb-3">// It watches the entire internet so you don't have to.</p>
          <PillSelect
            options={['Competitor tracking', 'Trend forecasting', 'Market research', 'Keyword monitoring', 'Industry news digests']}
            value={formData.researchAreas}
            onChange={v => update('researchAreas', v)}
            multi
          />
        </div>
      </div>
    </div>,

    /* ── SLIDE 9 ── Pricing + Timeline */
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-10 bg-[#eae7de] overflow-y-auto">
      <p className="font-mono uppercase tracking-[0.2em] mb-2 text-xs font-bold text-[#555]">// THE DEAL</p>
      <h2 className="font-serif text-4xl md:text-5xl font-black text-[#111] mb-6 leading-none">Simple math.<br/><span className="italic">Real leverage.</span></h2>

      <div className="border-4 border-[#111] p-8 w-full max-w-md mb-8 bg-[#111] text-[#eae7de]">
        <h3 className="font-mono uppercase tracking-widest text-[#27C93F] text-xs font-bold mb-3">Early Access — The Machine</h3>
        <p className="font-serif text-4xl font-black mb-3">Setup: $1,000</p>
        <div className="h-[2px] bg-[#333] w-full my-3"></div>
        <p className="font-sans font-medium text-base text-[#FFBD2E]">First 5 clients get lifetime access.</p>
        <p className="font-sans text-xs text-[#888] mt-1">After that, access continues as normal.</p>
      </div>

      <div className="w-full max-w-md text-left">
        <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">When do you want to start? *</label>
        <select
          id="ob-startDate"
          className={creamInput + " cursor-pointer"}
          value={formData.startDate}
          onChange={e => update('startDate', e.target.value)}
        >
          <option value="">— Pick a window —</option>
          {['ASAP — I\'m ready now', 'This month', 'Next month', 'Within 3 months', 'Just exploring'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>,

    /* ── SLIDE 10 ── Contact + Submit */
    <div className="flex flex-col items-center justify-center h-full px-8 py-10 bg-[#111] text-[#eae7de] overflow-y-auto">
      <h2 className="font-serif text-4xl md:text-6xl font-black mb-2 leading-none text-center">Get The Machine</h2>
      <span className="font-serif italic text-3xl md:text-5xl text-[#27C93F] mb-8 block text-center">$1,000</span>

      <div className="w-full max-w-md flex flex-col gap-6 mb-8">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Email Address *</label>
          <input
            id="ob-email"
            type="email"
            className={darkInput}
            placeholder="richard@doingbetter.com"
            value={formData.email}
            onChange={e => update('email', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">Phone (optional)</label>
          <input
            id="ob-phone"
            type="tel"
            className={darkInput}
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={e => update('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-[#555] mb-1">How did you find us?</label>
          <select className={darkInput + " cursor-pointer"} value={formData.referral} onChange={e => update('referral', e.target.value)}>
            <option value="">— Optional —</option>
            {['Instagram', 'TikTok', 'Word of mouth', 'Google', 'LinkedIn', 'X / Twitter', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {submitError && (
        <p className="font-mono text-[10px] text-[#FF5F56] mb-3 text-center">{submitError}</p>
      )}

      <button
        id="ob-submit"
        onClick={handleFinalSubmit}
        disabled={isSubmitting}
        className={`font-sans font-black text-lg px-12 py-5 bg-[#eae7de] text-[#111] rounded-full uppercase tracking-wider transition-all mb-4 ${isSubmitting ? 'opacity-60 cursor-wait' : 'hover:scale-105'}`}
      >
        {isSubmitting ? 'Sending...' : 'Apply for Access →'}
      </button>

      <p className="font-mono text-xs tracking-widest text-[#555] text-center">contact@80m.ai — response in 48 hrs or less</p>

      <div className="mt-6 w-full text-center opacity-50">
        <p className="font-mono text-[9px] uppercase tracking-widest">© 2026 80m SYSTEMS. All rights reserved.</p>
        <p className="font-serif italic text-xs mt-1">(We own your excuses now.)</p>
      </div>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <style>{`
        @keyframes onboardingShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
      <NoiseOverlay />

      <div className="relative z-10 w-full max-w-[700px] h-[90vh] min-h-[500px] max-h-[900px] flex flex-col" style={shakeStyle}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-sm text-white hover:text-[#0ea5e9] flex items-center gap-2 transition-colors"
        >
          [CLOSE]
        </button>

        <AsciiShadow size="lg" className="w-full h-full">
          <MacWindow
            title={`80m_Onboarding_Sequence.exe [${slide + 1}/10]`}
            contentClass="flex-1 bg-[#111] relative overflow-hidden flex flex-col"
            className="w-full h-full"
          >
            <div className="w-full h-full overflow-hidden relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {slides[slide]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav Controls */}
            <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex justify-between items-center z-50 pointer-events-none bg-gradient-to-t from-black/60 to-transparent">
              <button
                onClick={prevSlide}
                disabled={slide === 0}
                className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center bg-[#111]/90 text-white border border-white/20 backdrop-blur-md transition-all text-lg ${slide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-[#222]'}`}
              >
                &larr;
              </button>

              <div className="flex gap-2 items-center">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-[#22c55e]' : 'w-2 h-2 bg-white/20'}`}
                  />
                ))}
              </div>

              {slide < 9 ? (
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center bg-[#111]/90 text-white border border-white/20 backdrop-blur-md hover:bg-[#222] transition-all text-lg"
                >
                  &rarr;
                </button>
              ) : (
                <div className="w-12 h-12" />
              )}
            </div>
          </MacWindow>
        </AsciiShadow>
      </div>
    </div>
  );
};


export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

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
      {showOnboarding && <OnboardingPopup onClose={() => setShowOnboarding(false)} />}
      <NoiseOverlay />
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

      <main className="pb-16 overflow-x-hidden">


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
              80m was started by<br/>
              <span className="italic">tech-advanced people</span><br/>
              to catch you up.
            </motion.h1>

            <motion.a
              variants={fadeUp}
              whileHover={{ scale: 1.05, backgroundColor: '#333' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
              href="#"
              className="font-sans font-black text-sm md:text-base px-6 py-3 bg-[#111] text-[#eae7de] rounded-full inline-block text-center tracking-wider uppercase"
            >
              Apply for Access
            </motion.a>
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
          <section id="services" className="mt-20 md:mt-40 px-4 md:px-8 relative z-20" aria-labelledby="services-heading" style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
        <section id="pricing" className="mt-24 px-4 md:px-8 relative" aria-labelledby="pricing-heading" style={{ maxWidth: '1024px', margin: '0 auto' }}>
          {/* Background icon header container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[400px] -mt-32 pointer-events-none z-0 opacity-30 mix-blend-multiply flex justify-center">
             <img src="https://i.postimg.cc/nLtSqBSh/icon.png" alt="80m Background Detail" className="w-full h-full object-contain filter contrast-125 sepia-[0.3]" />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 flex flex-col items-center w-full">
            <motion.p variants={fadeUp} className="font-mono uppercase tracking-[0.2em] mb-4 text-sm mix-blend-multiply font-bold text-center" aria-hidden="true">// investment</motion.p>
            <motion.h2 id="pricing-heading" variants={fadeUp} className="font-serif text-5xl md:text-7xl leading-[0.9] tracking-tight mb-12 mix-blend-multiply text-center">
              <motion.span variants={fadeUp} className="block">Simple math.</motion.span>
              <motion.span variants={fadeUp} className="italic block">Real leverage.</motion.span>
            </motion.h2>

            <motion.div variants={fadeUp} whileHover={{ rotate: 0, scale: 1.01 }} transition={{ duration: 0.3 }} className="mx-auto w-full max-w-sm md:max-w-md">
              <AsciiShadow size="lg" rotate="-1deg">
              <MacWindow 
                title="80m_Investment_Portal.exe" 
                className="transition-transform"
                contentClass="bg-[#eae7de] p-8 md:p-12 text-[#111]"
              >
                <header className="border-b-4 border-[#111] pb-6 mb-10">
                  <motion.h3 variants={fadeUp} className="font-mono uppercase tracking-widest text-xs font-bold mb-4 inline-block bg-[#111] text-[#eae7de] px-3 py-1">Early Access — The Machine</motion.h3>
                  <motion.p variants={fadeUp} className="font-serif text-5xl md:text-6xl tracking-tighter leading-none mb-2 mt-4">
                    Setup: $1,000
                  </motion.p>
                  <motion.p variants={fadeUp} className="font-sans text-xl italic text-[#555] font-medium">— No Hardware. Just Service.</motion.p>
                </header>

                <div className="mb-12">
                  <motion.p variants={fadeUp} className="font-serif text-4xl md:text-5xl tracking-tighter mb-2">Lifetime Access</motion.p>
                  <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest text-[#555] font-bold">For the first 5 clients only.</motion.p>
                </div>

                <ul className="space-y-4 font-sans text-base md:text-lg text-[#111] mb-12 font-medium" aria-label="Included Features">
                  {[
                    "Dedicated AI agent running 24/7",
                    "Social media management",
                    "Content creation & scheduling",
                    "Email & operations handling",
                    "Research & intelligence",
                    "Simple client dashboard"
                  ].map((item, i) => (
                    <motion.li variants={fadeUp} key={i} className="flex items-start gap-4">
                      <span className="text-xl leading-none mt-1 font-black" aria-hidden="true">+</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.footer variants={fadeUp} className="bg-[#111] text-[#eae7de] p-5 font-mono text-[10px] uppercase tracking-wider leading-relaxed">
                  <strong>Note:</strong> First 5 clients get lifetime access hook. After that, access continues as normal.
                </motion.footer>
                <div className="mt-8 flex flex-col gap-4">
                  <motion.button
                    variants={fadeUp}
                    onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                    className="font-sans font-bold text-lg px-8 py-4 bg-[#111] text-[#eae7de] rounded-full text-center hover:scale-105 transition-transform w-full"
                  >
                    Apply for Access
                  </motion.button>
                </div>
              </MacWindow>
              </AsciiShadow>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer Call to Action */}
        <section id="contact" className="mt-48 md:mt-64 px-4 md:px-8 text-center relative z-20" aria-label="Contact and Application" style={{ maxWidth: '768px', margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="font-serif text-7xl md:text-[8rem] leading-[0.8] tracking-tight mb-8 mix-blend-multiply">
              <motion.span variants={fadeUp} className="block">5 spots.</motion.span>
              <motion.span variants={fadeUp} className="italic block">$1K each.</motion.span>
            </motion.h2>

            <motion.p variants={fadeUp} className="font-sans text-xl md:text-2xl text-[#333] mb-12 mix-blend-multiply font-medium">
              $1,000 setup.<br/>
              First 5 clients get lifetime access.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-8">
              <motion.a
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.preventDefault(); setShowOnboarding(true); }}
                href="#"
                className="font-sans font-black text-base md:text-xl px-12 py-5 md:px-20 md:py-7 bg-[#111] text-[#eae7de] rounded-full shadow-[0_8px_0_0_rgba(0,0,0,0.4)] border-2 border-[#111] hover:shadow-[0_12px_0_0_rgba(0,0,0,0.3)] transition-all inline-block text-center tracking-wide uppercase"
              >
                Apply for Access
              </motion.a>
              <motion.a variants={fadeUp} href="mailto:contact@80m.ai" className="font-mono text-sm uppercase tracking-widest hover:underline underline-offset-8 mix-blend-multiply font-black">
                contact@80m.ai — response within 48 hours
              </motion.a>
            </motion.div>

            <motion.footer variants={fadeUp} className="mt-32 flex flex-col items-center justify-center gap-6 mix-blend-multiply opacity-80 border-t-2 border-[#111] pt-16 relative">
              {/* Decorative Vertical Stamp positioned on the right */}
              <motion.div variants={fadeUp} className="absolute -right-8 md:-right-24 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                 <img src="https://i.postimg.cc/g2Ft91FR/80m-vertical.png" alt="80m Vertical Stamp" className="w-10 md:w-16 h-auto" />
              </motion.div>
              <motion.div variants={fadeUp} className="font-serif font-black text-2xl tracking-tighter flex items-center gap-2">
                <img src="https://i.postimg.cc/P5W3dKTx/logo.png" alt="80m Logo" className="h-8 md:h-12 w-auto" />
              </motion.div>
              <motion.span variants={fadeUp} className="font-mono text-xs uppercase tracking-widest font-bold">© 2026 80m SYSTEMS. All rights reserved.</motion.span>
            </motion.footer>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
