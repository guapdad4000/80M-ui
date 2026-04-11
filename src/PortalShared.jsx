import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export { motion, AnimatePresence };

// =====================================================================
// FILM GRAIN CANVAS — canvas-based animated film grain overlay
// Fills ImageData pixels with random grayscale, regenerates every 3
// frames for analog-style flickering. 4% opacity, requestAnimationFrame.
// =====================================================================
export const NoiseOverlay = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      frameRef.current++;
      if (frameRef.current % 3 === 0) {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = Math.floor(0.04 * 255);
        }
        ctx.putImageData(imageData, 0, 0);
      }
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[150] pointer-events-none opacity-[0.4] mix-blend-overlay"
      aria-hidden="true"
    />
  );
};

// =====================================================================
// FLOATING PARTICLES — CSS-animated ambient particle layer
// Inline @keyframes per-particle with random trajectory, size, timing.
// =====================================================================
export const FloatingParticles = ({ count = 18 }) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 14,
      size: Math.random() * 3 + 1.5,
      color: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#38bdf8' : '#bae6fd',
    });
  }

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: '50%',
            left: `${p.left}%`,
            opacity: Math.random() * 0.4 + 0.2,
            animation: `floatParticle${i} ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
      <style>{particles.map((p, i) => `
        @keyframes floatParticle${i} {
          0%   { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.6; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
      `).join('\n')}</style>
    </div>
  );
};

export const PaperBackground = () => (
  <div aria-hidden="true">
    <div className="fixed inset-0 z-[-4] bg-[#eae7de]"></div>
    <div className="fixed inset-0 z-[-3] opacity-70 mix-blend-multiply overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#38bdf8] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-[#0ea5e9] rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute top-[30%] left-[50%] w-[50vw] h-[50vw] bg-[#22c55e] rounded-full blur-[120px] opacity-20"></div>
    </div>
    <div className="fixed inset-0 z-[-2] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
  </div>
);

export const QuizModal = ({ isOpen, questions, onComplete, courseLabel = 'C03', section }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);

  if (!isOpen || !questions) return null;

  const current = questions[step];
  const handleAnswer = (idx) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === current.correct) setScore(s => s + 1);
    const isLast = step + 1 >= questions.length;
    setTimeout(() => {
      if (isLast) {
        const finalScore = score + (idx === current.correct ? 1 : 0);
        onComplete && onComplete(finalScore, finalScore >= 2);
      } else {
        setStep(s => s + 1);
        setAnswered(null);
      }
    }, 2400);
  };

  const isCorrect = answered === current.correct;
  const showResult = answered !== null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#eae7de] border-[4px] border-[#111] shadow-[12px_12px_0_0_#111] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#555]">
            {courseLabel} · Section {section}
          </span>
          <div className="flex justify-between items-center mt-2">
            <h3 className="font-sans font-black text-2xl uppercase">{current.q}</h3>
            <span className="font-mono text-sm text-[#555]">{step + 1}/{questions.length}</span>
          </div>
        </div>
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            let cls = "border-[3px] border-[#111] p-4 font-serif text-lg cursor-pointer transition-all";
            if (showResult) {
              if (i === current.correct) cls += " bg-[#22c55e] border-[#22c55e] text-[#111]";
              else if (i === answered) cls += " bg-red-500 border-red-500 text-white";
              else cls += " opacity-40";
            } else {
              cls += " hover:bg-[#111] hover:text-[#eae7de] cursor-pointer";
            }
            return (
              <div key={i} onClick={() => handleAnswer(i)} className={cls}>
                <span className="font-black mr-3">{String.fromCharCode(65 + i)}.</span>{opt}
              </div>
            );
          })}
        </div>
        {showResult && (
          <div className={`mt-4 border-[3px] p-4 ${isCorrect ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-red-400 bg-red-50'}`}>
            <p className="font-sans font-black uppercase text-sm mb-1">
              {isCorrect ? '✓ Correct' : '✗ Wrong'}
            </p>
            <p className="font-serif text-[#333] text-base leading-relaxed">
              {current.explanation || (isCorrect
                ? "You got it. Moving on."
                : `The correct answer is ${String.fromCharCode(64 + current.correct + 1)}. ${current.options[current.correct]}`)}
            </p>
          </div>
        )}
        {!showResult && (
          <p className="mt-6 font-mono text-xs text-[#555] uppercase tracking-widest">Pick one. No Googling.</p>
        )}
      </div>
    </div>
  );
};

export const MacWindow = ({ children, title = "terminal", className = "", contentClass = "", code = "" }) => {
  const [copied, setCopied] = useState(false);
  const contentRef = React.useRef(null);

  const handleCopy = () => {
    const text = code || contentRef.current?.innerText || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`relative border border-[#1a3a1a] bg-[#000000] rounded-lg overflow-hidden flex flex-col ${className}`} style={{ boxShadow: '0 0 20px rgba(34,197,94,0.15), 0 0 60px rgba(34,197,94,0.05), inset 0 0 60px rgba(0,0,0,0.5)' }}>
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,197,94,0.5) 2px, rgba(34,197,94,0.5) 4px)' }} />

      {/* Title bar */}
      <div className="relative bg-[#0a1a0a] px-3 py-2 flex items-center border-b border-[#1a3a1a] shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#cc3333] shadow-[0_0_4px_rgba(255,95,86,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#cc8800] shadow-[0_0_4px_rgba(255,189,46,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1a8a1a] shadow-[0_0_6px_rgba(39,201,63,0.7)]"></div>
        </div>
        <div className="flex-1 text-center text-[10px] font-mono font-bold text-[#2a7a2a] tracking-widest select-none uppercase">
          {title}
        </div>
        <button onClick={handleCopy} className="text-[10px] font-mono font-bold text-[#2a7a2a] hover:text-[#22c55e] transition-colors mr-2 uppercase tracking-widest">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Content area */}
      <div ref={contentRef} className={`relative flex-1 overflow-hidden ${contentClass}`}>
        {children}
      </div>
    </div>
  );
};

export const NeedBox = ({ title = "What you need before you start", items = [] }) => (
  <div className="border-[3px] border-[#111] bg-[#fdfaf6] p-5 md:p-6 mb-6 shadow-[6px_6px_0_0_#111]">
    <div className="font-mono text-xs uppercase tracking-widest font-bold text-[#555] mb-3">// {title}</div>
    <ul className="font-serif text-[#444] space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-[#22c55e] font-black leading-none mt-0.5">›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const ResourceList = ({ title = "Resources", items = [] }) => (
  <div className="mt-8 border-[2px] border-[#111] bg-white p-5 md:p-6 shadow-[4px_4px_0_0_#111]">
    <div className="font-mono text-xs uppercase tracking-widest font-bold text-[#555] mb-3">// {title}</div>
    <ul className="space-y-3 font-serif text-base">
      {items.map((item, i) => (
        <li key={i}>
          <a className="underline underline-offset-4 font-black" href={item.href} target={item.href?.startsWith('#') ? undefined : "_blank"} rel={item.href?.startsWith('#') ? undefined : "noreferrer"}>
            {item.label}
          </a>
          {item.note && <span className="text-[#555]"> — {item.note}</span>}
        </li>
      ))}
    </ul>
  </div>
);

export const GlossaryTooltip = ({ term, definition, href }) => (
  <a
    href={href}
    className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 font-semibold hover:text-[#22c55e] transition-colors"
    title={`${term}: ${definition} — Jump to dictionary`}
  >
    {term}
    <span className="text-[10px] font-mono border border-current px-1 leading-none">?</span>
  </a>
);

export const CourseBoostPanel = ({ title = "Quick Win Stack", checklist = [], prompts = [] }) => (
  <div className="mt-8 border-[3px] border-[#111] bg-[#fdfaf6] p-6 shadow-[6px_6px_0_0_#111]">
    <h3 className="font-sans font-black uppercase text-sm mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <ul className="font-serif text-sm text-[#333] space-y-2">
        {checklist.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#22c55e] font-black">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        {prompts.map((prompt, i) => (
          <p key={i} className="font-mono text-[11px] bg-white border-[2px] border-[#111] p-3">{prompt}</p>
        ))}
      </div>
    </div>
  </div>
);

export const SectionMeta = ({ minutes = "10 min", focus = "Execution" }) => (
  <div className="mb-4 inline-flex items-center gap-2 border-[2px] border-[#111] bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#444]">
    <span>⏱ {minutes}</span>
    <span className="text-[#aaa]">•</span>
    <span>{focus}</span>
  </div>
);

export const CopyBlock = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      setCopied(false);
    }
  };
  return (
    <div className="bg-[#fdfaf6] border-[2px] border-[#111] p-3">
      <button onClick={copy} className="mb-2 font-mono text-[10px] uppercase tracking-widest border border-[#111] px-2 py-1 bg-white">
        {copied ? "Copied" : "Copy"}
      </button>
      <p className="font-mono text-xs text-[#222]">{text}</p>
    </div>
  );
};

export const CheckpointCard = ({ title = "Section Checkpoint", pass = [], fail = [] }) => (
  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="border-[3px] border-[#22c55e] bg-[#f0fdf4] p-5">
      <h4 className="font-sans font-black uppercase text-sm mb-2">{title} — Pass</h4>
      <ul className="font-serif text-sm text-[#14532d] space-y-1">
        {pass.map((item, i) => <li key={i}>✓ {item}</li>)}
      </ul>
    </div>
    <div className="border-[3px] border-red-500 bg-red-50 p-5">
      <h4 className="font-sans font-black uppercase text-sm mb-2">Fail Signals</h4>
      <ul className="font-serif text-sm text-red-700 space-y-1">
        {fail.map((item, i) => <li key={i}>✗ {item}</li>)}
      </ul>
    </div>
  </div>
);

export const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b-[3px] border-[#111] overflow-hidden mix-blend-multiply bg-[#eae7de]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 md:py-8 flex justify-between items-center text-left hover:bg-black/5 transition-colors px-6 group"
      >
        <span className="font-sans font-black text-xl md:text-2xl text-[#111] pr-8">{question}</span>
        <span className="text-3xl font-mono font-light text-[#555] group-hover:text-[#111] transition-colors">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-8 text-lg md:text-xl text-[#444] font-serif leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
