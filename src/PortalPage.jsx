import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- Lesson ATM Scrollbar ---
const LessonAtmScrollbar = ({ scrollRef, zIndexClass = 'z-[130]' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return undefined;

    let scrollTimeout;

    const updateProgress = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, el.scrollTop / maxScroll)) : 0;
      setScrollProgress(progress);
      setIsAtBottom(progress >= 0.98);
    };

    const handleScroll = () => {
      updateProgress();
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      el.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [scrollRef]);

  const scrollByDelta = (deltaY) => {
    const el = scrollRef?.current;
    if (!el) return;
    el.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
  };

  const scrollToProgress = (progress) => {
    const el = scrollRef?.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: Math.max(0, Math.min(maxScroll, progress * maxScroll)), behavior: 'auto' });
  };

  return (
    <div className={`fixed right-2 top-4 bottom-4 w-16 ${zIndexClass} pointer-events-none flex justify-center`}>
      <div
        className={`absolute w-14 h-32 flex flex-col items-center transition-transform duration-75 ease-out origin-center scale-75 cursor-grab active:cursor-grabbing pointer-events-auto touch-none ${isScrolling && !isAtBottom ? 'rotate-1' : 'rotate-0'}`}
        style={{ top: `calc(${scrollProgress * 100}% - ${16 + scrollProgress * 96}px)` }}
        onPointerDown={(e) => {
          e.preventDefault();
          const target = e.currentTarget;
          target.setPointerCapture(e.pointerId);

          const startY = e.clientY;
          const startProgress = scrollProgress;

          const handlePointerMove = (moveEvent) => {
            const trackHeight = window.innerHeight - 128;
            if (trackHeight <= 0) return;
            const progressDelta = (moveEvent.clientY - startY) / trackHeight;
            scrollToProgress(startProgress + progressDelta);
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
          scrollByDelta(e.deltaY);
        }}
      >
        <div className={`absolute bottom-0 w-12 h-6 transition-all duration-500 ease-out ${isAtBottom ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-50'}`}>
          <div className="absolute bottom-0 w-full h-2 bg-green-500 border border-green-700 rounded-sm rotate-2 shadow-sm"></div>
          <div className="absolute bottom-1 w-full h-2 bg-green-600 border border-green-800 rounded-sm -rotate-3 shadow-sm left-0.5"></div>
          <div className="absolute bottom-2 w-11 h-2 bg-green-500 border border-green-700 rounded-sm rotate-1 shadow-sm right-0.5"></div>
          <div className="absolute bottom-3 w-10 h-2 bg-green-400 border border-green-600 rounded-sm -rotate-2 shadow-sm left-1"></div>
        </div>

        <div className="w-14 h-32 bg-[#dfddd0] rounded-[4px] shadow-lg border-b-4 border-r-[3px] border-[#b5b3a3] relative p-1 flex flex-col items-center z-10">
          <div className={`w-12 h-10 rounded-[3px] border-[1.5px] border-[#1f1e1c] flex items-center justify-center p-[2px] shadow-inner mt-0.5 transition-colors duration-200 ${isAtBottom ? 'bg-[#facc15]' : 'bg-[#2e2d2b]'}`}>
            <div className="w-full h-full rounded-[2px] bg-black/50"></div>
          </div>
          <div className="mt-1 w-12 h-[68px] bg-[#d3d1c4] border border-[#b8b6a8] rounded-[2px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"></div>
          </div>
          <div className="mt-1 w-8 h-2 bg-[#b8b6a8] rounded-full border border-[#9b998d]"></div>
        </div>
      </div>
    </div>
  );
};

// --- Shared UI Components ---

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
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#38bdf8] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-[#0ea5e9] rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute top-[30%] left-[50%] w-[50vw] h-[50vw] bg-[#22c55e] rounded-full blur-[120px] opacity-20"></div>
    </div>
    <div className="fixed inset-0 z-[-2] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
  </div>
);


const QuizModal = ({ isOpen, questions, onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);

  if (!isOpen || !questions) return null;

  const current = questions[step];
  const handleAnswer = (idx) => {
    if (answered !== null) return;
    setAnswered(idx);
    if (idx === current.correct) setScore(s => s + 1);
    setTimeout(() => {
      if (step + 1 >= questions.length) {
        setStep(0); setScore(0); setAnswered(null);
        onComplete && onComplete(score + (idx === current.correct ? 1 : 0));
      } else {
        setStep(s => s + 1);
        setAnswered(null);
      }
    }, 1600);
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const snark = pct === 100 ? "Perfect. You actually read this."
    : pct >= 80 ? "Not bad. Almost competent."
    : pct >= 60 ? "You skimmed it. We can tell."
    : "Maybe read Section 4 again.";

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#eae7de] border-[4px] border-[#111] shadow-[12px_12px_0_0_#111] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#555]">Quiz</span>
          <div className="flex justify-between items-center mt-2">
            <h3 className="font-sans font-black text-2xl uppercase">{current.q}</h3>
            <span className="font-mono text-sm text-[#555]">{step + 1}/{questions.length}</span>
          </div>
        </div>
        <div className="space-y-3">
          {current.options.map((opt, i) => {
            let cls = "border-[3px] border-[#111] p-4 font-serif text-lg cursor-pointer transition-all hover:bg-[#111] hover:text-[#eae7de]";
            if (answered !== null) {
              if (i === current.correct) cls += " bg-[#22c55e] border-[#22c55e] text-[#111]";
              else if (i === answered) cls += " bg-red-500 border-red-500 text-white";
              else cls += " opacity-50";
            }
            return (
              <div key={i} onClick={() => handleAnswer(i)} className={cls}>
                <span className="font-black mr-3">{String.fromCharCode(65 + i)}.</span>{opt}
              </div>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-xs text-[#555] uppercase tracking-widest">Pick one. No Googling.</p>
      </div>
    </div>
  );
};

const MacWindow = ({ children, title = "terminal", className = "", contentClass = "bg-[#eae7de]", code = "" }) => {
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
    <div className={`border-[3px] border-[#111] bg-[#1a1a1a] rounded-md overflow-hidden flex flex-col shadow-[8px_8px_0_0_#111] ${className}`}>
      <div className="bg-[#111] px-3 py-2 flex items-center border-b-[3px] border-[#111] shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
        </div>
        <div className="flex-1 text-center text-xs font-mono font-bold text-[#eae7de] tracking-widest select-none uppercase">
          {title}
        </div>
        <button onClick={handleCopy} className="text-xs font-mono font-bold text-[#22c55e] hover:text-white transition-colors mr-2 uppercase">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div ref={contentRef} className={`relative flex-1 overflow-hidden ${contentClass}`}>
        {children}
      </div>
    </div>
  );
};

const NeedBox = ({ title = "What you need before you start", items = [] }) => (
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

const ResourceList = ({ title = "Resources", items = [] }) => (
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

const FAQItem = ({ question, answer }) => {
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

// --- Course Content Pages ---

const CourseOneContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const [subMonths, setSubMonths] = useState(1);
  const [errorVisible, setErrorVisible] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);

  const sections = [
    { id: 's0', label: 'Intro: Why We\'re Doing This' },
    { id: 's1', label: '1. The Terminal Protocol' },
    { id: 's2', label: '2. The Agent Council' },
    { id: 's3', label: '3. The Hardware Reality Check' },
    { id: 's4', label: '4. Why Docker?' },
    { id: 's5', label: '5. Troubleshooting Guide' },
    { id: 's6', label: '6. Localhost vs The World' },
    { id: 's7', label: '7. Keeping the Monster Alive' },
    { id: 's8', label: '8. The Zero-Code Playbook' },
    { id: 's9', label: '9. Dictionary' },
    { id: 's10', label: '10. Resource Locker' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const terminalLogs = [
    "[SYSTEM] Initiating 80m Lazy-Install Protocol...",
    "[NETWORK] Bypassing unnecessary nerd-shit...",
    "[NETWORK] Fetching OpenClaw dependencies...",
    "[NETWORK] Fetching Hermes core logic...",
    "[DOCKER] Building containers (this is where the magic happens)...",
    "[PROCESS] Unpacking brain.tar.gz...",
    "✔ Hermes successfully linked.",
    "✔ OpenClaw successfully linked.",
    "✔ Local Database instantiated.",
    "✔ Agent Council instantiated.",
    "✔ Bullsh*t filters applied.",
    "[SUCCESS] The monster is alive. Awaiting your command."
  ];

  const handleRunInstall = () => {
    if (terminalStep > 0) return;
    setTerminalStep(1);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setTerminalStep(step);
      if (step > terminalLogs.length) { clearInterval(interval); }
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col"
    >
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 01</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Install the Stack</h2>
        </div>
        <button onClick={onClose} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class ✕
        </button>
      </div>

      <div ref={lessonScrollRef} className="lesson-scroll-pane flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Section Progress Tracker */}
        <div className="mb-8 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]">
          <div className="bg-[#111] px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 01 Progress</span>
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSection(s.id)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${completedSections.includes(s.id) ? 'text-[#22c55e]' : 'text-[#555]'}`}
              >
                <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                  {completedSections.includes(s.id) && <span className="block w-2 h-2 bg-current"></span>}
                </span>
                <span className="text-left leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intro */}
        <div id="c1-intro" className="mb-24">
          <NeedBox
            items={[
              "A laptop or mini‑PC with 16GB+ RAM (yes, that matters).",
              "Stable internet (you can’t download the brain over dial‑up).",
              "Docker Desktop installed.",
              "One model provider account (OpenAI or Anthropic).",
              "Your API key copied somewhere safe (not in a tweet).",
              "Discord access for support + updates."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            From Zero to <br/><span className="italic text-[#22c55e]">Alive.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
            Welcome to Class 01. The biggest barrier to AI is "Installation Hell." Most people download a file, get a red error message they don't understand, and go back to watching Netflix. We are skipping the hell.
          </p>
        </div>

        {/* Section 1: Money */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">0. Why are we doing this?</h2>
          <div className="bg-[#111] border-[4px] border-[#22c55e] p-8 md:p-10 shadow-[12px_12px_0_0_#22c55e] text-[#eae7de]">
            <h3 className="font-mono text-[#22c55e] font-bold uppercase tracking-widest mb-4">The Anti-SaaS Bleed Calculator</h3>
            <p className="font-serif text-lg mb-8 text-[#aaa]">Stop funding other people's yachts. Use the slider to see how much you've rented your brain for.</p>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <input type="range" min="1" max="60" value={subMonths} onChange={(e) => setSubMonths(parseInt(e.target.value))} className="w-full md:w-1/2 accent-[#22c55e] cursor-pointer" />
              <div className="flex-1 text-center md:text-left">
                <div className="font-mono text-sm uppercase text-[#aaa] mb-2">{subMonths} Months = </div>
                <div className="font-sans font-black text-6xl md:text-7xl text-[#22c55e] tracking-tighter">${subMonths * 60}</div>
                <div className="font-serif text-sm mt-2 text-[#aaa]">Wasted on subscriptions you don't own.</div>
              </div>
            </div>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(1); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 1
            </button>
          </div>


        {/* Section 2: Terminal */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Terminal app open (Mac: Terminal, Windows: PowerShell).",
              "Your lazy‑install command ready to paste.",
              "Permission to run a script (yes, click Allow).",
              "The mental stability to watch a fake progress log."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. The Terminal Protocol</h2>
          <MacWindow title="your_computer_terminal.exe" contentClass="bg-[#111] p-6 h-96 overflow-y-auto font-mono text-sm text-[#eae7de]">
            <p className="text-[#555] mb-4">Last login: {new Date().toDateString()} on ttys001</p>
            <p className="text-[#38bdf8] mb-4">lazy_user@macbook-pro ~ % <span className="text-[#eae7de]">_</span></p>

            {terminalStep === 0 && (
              <div className="mt-8 border-[2px] border-[#333] p-6 bg-[#1a1a1a] text-center max-w-lg mx-auto">
                <p className="mb-4 text-[#aaa]">Don't type. Just Paste. That is the 80m secret.</p>
                <button onClick={handleRunInstall} className="font-sans font-black text-lg px-8 py-4 bg-[#22c55e] text-[#111] hover:bg-[#4ade80] transition-colors w-full shadow-[4px_4px_0_0_#111]">
                  Paste the 80m Setup Script
                </button>
              </div>
            )}
            {terminalStep > 0 && (
              <div className="space-y-2">
                <p className="text-[#38bdf8]">lazy_user@macbook-pro ~ % <span className="text-[#eae7de]">curl -sL https://80m.ai/lazy-install.sh | bash</span></p>
                {terminalLogs.slice(0, terminalStep).map((log, idx) => (
                  <p key={idx} className={log.includes('[SUCCESS]') || log.includes('✔') ? 'text-[#22c55e]' : 'text-[#aaa]'}>{log}</p>
                ))}
                {terminalStep <= terminalLogs.length && <p className="animate-pulse text-[#eae7de]">_</p>}
              </div>
            )}
          </MacWindow>
        </div>

        {/* Section 3: The Council */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "At least one connected tool (Gmail or Calendar).",
              "A single task list you actually use.",
              "A decision on your agent names (yes, naming them helps)."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Agent Council</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You don't have one AI. You have a team. Each agent specializes in one thing — writing, research, scheduling, coding — and they check each other's work before anything reaches you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Hermes", role: "Chief of Staff", desc: "Coordinates the council. Takes your input and distributes work." },
              { name: "Prawnius", role: "Quick Task Agent", desc: "Fast one-off commands. Research, copy, code snippets." },
              { name: "Claudnelius", role: "Code & Design", desc: "Technical architecture, UI, debugging. The builder." },
              { name: "Knaight", role: "Intelligence", desc: "Research, memory, knowledge graphs. The brain." },
              { name: "Clawdette", role: "Operations", desc: "Scheduling, delegation, follow-ups. The executor." },
              { name: "Sir Clawthchilds", role: "Finance", desc: "Budgets, spreadsheets, ROI analysis. The numbers." },
            ].map((agent) => (
              <div key={agent.name} className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
                <span className="font-mono text-[#22c55e] text-xs font-bold uppercase">{agent.role}</span>
                <h4 className="font-serif text-2xl font-black mt-1 mb-2">{agent.name}</h4>
                <p className="font-serif text-[#555]">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Hardware Checklist */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. The Hardware Reality Check</h2>
          <div className="bg-[#111] border-[4px] border-[#111] p-8 text-[#eae7de]">
            <p className="font-serif text-lg mb-8 text-[#aaa]">Before you install anything, make sure your machine can handle it. The 80m stack is designed to run on:</p>
            <div className="space-y-4">
              {[
                { req: "16GB+ RAM / Unified Memory", note: "M-series Mac or equivalent PC. This is the floor." },
                { req: "10GB+ available storage", note: "SSD preferred. The models are heavy." },
                { req: "Internet connection", note: "Needed for the install. After that, works offline." },
                { req: "Docker Desktop", note: "Free. Installs in 2 minutes. We walk through it." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 border-b border-[#333] pb-4">
                  <span className="text-[#22c55e] font-black text-xl mt-0.5">›</span>
                  <div>
                    <p className="font-mono text-white font-bold">{item.req}</p>
                    <p className="font-serif text-[#aaa] text-sm">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Docker Explained */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Why Docker? (The Shipping Container Metaphor)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Docker is like a shipping container for software. Everything your AI needs — the brain, the memory, the tools — gets packed into one box. That box runs the same on your laptop as it does on a server. No "works on my machine" problems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-white">
              <h4 className="font-sans font-black uppercase mb-3 text-[#111]">Without Docker</h4>
              <p className="font-serif text-[#555]">"It works on my machine." Install 47 dependencies. Fight with version conflicts. Spend 3 days debugging a Python path issue.</p>
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#f0fdf4] shadow-[6px_6px_0_0_#111]">
              <h4 className="font-sans font-black uppercase mb-3 text-[#111]">With Docker</h4>
              <p className="font-serif text-[#555]">"It works everywhere." One command. Everything included. Updates don't break existing stuff. Roll back in one click if something goes wrong.</p>
            </div>
          </div>
        </div>

        {/* Section 6: Troubleshooting */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. The "Holy S*it, It's Red" Guide</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Eventually, your terminal will spit out red text. To a nerd, this is a roadmap. To you, it looks like your computer is about to explode. It isn't.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-10 shadow-[8px_8px_0_0_#111]">
            <button
              onClick={() => setErrorVisible(!errorVisible)}
              className="mb-6 font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 bg-red-500 text-white"
            >
              {errorVisible ? "Hide Error" : "Generate Fake Red Error"}
            </button>
            <AnimatePresence>
              {errorVisible && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="bg-[#1a1a1a] p-4 font-mono text-xs text-red-500 mb-6 border-l-4 border-red-500">
                    ERROR: Failed to connect to port 11434. Connection refused.<br/>
                    Is Ollama running? Check your daemon status.
                  </div>
                  <div className="bg-[#f0fdf4] p-6 border-2 border-[#22c55e]">
                    <h4 className="font-sans font-black uppercase text-sm mb-2 text-[#111]">80m Translation:</h4>
                    <p className="font-serif text-lg text-[#333]">"I'm trying to talk to the Brain, but the Brain isn't awake yet. Open the Ollama app and try again."</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section 7: Localhost vs The World */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. 127.0.0.1: Your Home Address</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            When you see <code className="bg-[#111] text-[#22c55e] px-2 py-1 text-sm font-mono">localhost</code> or <code className="bg-[#111] text-[#22c55e] px-2 py-1 text-sm font-mono">127.0.0.1</code>, that is computer-speak for "This house."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border-[3px] border-[#111] p-6">
              <h4 className="font-sans font-black uppercase mb-2">Local Access</h4>
              <p className="font-serif text-[#555]">Accessing your bot while sitting at the same computer. It's like talking to someone in the same room. Fast, easy, and impossible for hackers to hear.</p>
            </div>
            <div className="bg-[#111] text-[#eae7de] p-6 border-[3px] border-[#111] shadow-[8px_8px_0_0_#22c55e]">
              <h4 className="font-sans font-black uppercase mb-2 text-[#22c55e]">Remote Access</h4>
              <p className="font-serif text-[#aaa]">Accessing your bot from your phone at the gym. This requires the "Secret Tunnel" we build in Class 3. This is how you actually become productive.</p>
            </div>
          </div>
        </div>

        {/* Section 8: The Update Loop */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. Keeping the Monster Alive</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            AI moves fast. Yesterday's model is today's trash. We've built an auto-update protocol so your stack doesn't rot.
          </p>
          <div className="bg-yellow-50 border-[3px] border-[#111] p-8 border-l-[12px] border-l-[#111]">
            <h3 className="font-sans font-black text-2xl uppercase mb-4 italic">The "Lazy Update" Rule:</h3>
            <p className="font-serif text-lg leading-relaxed mb-6">
              Once a week, just run <code className="bg-white px-2 font-mono text-sm border">docker-compose pull</code>. It fetches the latest improvements while you sleep. If it isn't broken, don't touch it. If it is broken, we'll fix it in the Discord before you even wake up.
            </p>
          </div>
        </div>

        {/* Section 9: The Zero‑Code Playbook */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Zero‑Code Playbook (For People With Better Things to Do)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You’re not here to learn computer science. You’re here to stop drowning in busywork. This is the exact path to get OpenClaw behaving like a real assistant — without coding, without nerd rituals, and without pretending you care about “frameworks.”
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
              <h4 className="font-sans font-black uppercase mb-3">The 7‑Step Adulting Protocol</h4>
              <ol className="list-decimal list-inside font-serif text-[#444] space-y-3">
                <li>Install OpenClaw. Don’t customize anything yet.</li>
                <li>Open your workspace folder. Yes, it exists. No, it’s not scary.</li>
                <li>Fill out AGENTS.md like a boss: what to do, what not to do.</li>
                <li>Fill out USER.md + IDENTITY.md so it knows who you are.</li>
                <li>Connect Gmail + Calendar. If it can’t read your day, it can’t help your day.</li>
                <li>Create ONE canonical tasks file. Stop the chaos.</li>
                <li>Add a daily heartbeat so it checks in without you babysitting it.</li>
              </ol>
            </div>
            <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e]">
              <h4 className="font-sans font-black uppercase mb-3 text-[#22c55e]">Common Dumb Mistakes (Don’t Do These)</h4>
              <ul className="font-serif text-[#aaa] space-y-3">
                <li>Installing OpenClaw but never touching AGENTS.md.</li>
                <li>Letting 4 different task lists fight each other.</li>
                <li>Not telling it how you want to be contacted.</li>
                <li>Assuming it “just knows” your business context.</li>
                <li>Skipping the calendar connection, then blaming it for bad scheduling.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 9: The Dumb‑Proof Dictionary */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Your workspace folder open (~/clawd or wherever you installed).",
              "A text editor (VS Code, Notepad, literally anything).",
              "Two minutes to read file names without panicking."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. The Dumb‑Proof Dictionary</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You’ll see these words everywhere. Here’s what they actually mean in human language.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { term: "Workspace", def: "Your agent’s home folder. If it’s not in here, it doesn’t exist." },
              { term: "AGENTS.md", def: "The rulebook. The first thing OpenClaw reads. Your assistant’s job description." },
              { term: "SOUL.md", def: "Personality + boundaries. The difference between ‘helpful’ and ‘annoying.’" },
              { term: "HEARTBEAT", def: "A scheduled check‑in. This is how your assistant becomes proactive." },
              { term: "Skills", def: "Reusable workflows. Teach it one good process and it runs it forever." },
              { term: "Memory", def: "Durable context files. It remembers your world across sessions." },
              { term: "Tools", def: "External services it can use (email, calendar, docs)." },
              { term: "Cron", def: "Timers. This is how the agent wakes itself up." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#444]">{item.def}</p>
              </div>
            ))}
          </div>
          <ResourceList
            title="Dictionary Resources"
            items={[
              { label: "OpenClaw Course Anatomy (local) ", href: "#", note: "File: /home/falcon/Documents/openclaw course Anatomy.txt" },
              { label: "ClawChief Repo", href: "https://github.com/snarktank/clawchief", note: "See a real workspace structure." }
            ]}
          />
        </div>

        {/* Section 11: Resource Locker */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A model provider account (OpenAI or Anthropic).",
              "Access to your Gmail + Calendar credentials.",
              "Discord installed for support.",
              "GitHub account (for grabbing templates).",
              "Know this: a Dev Console is just the website where you create API keys. That’s it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. Resource Locker (Read This, Win Faster)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            These are the exact references we use to turn OpenClaw into a real assistant. No fluff. All leverage.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <ul className="space-y-4 font-serif text-lg">
              <li>
                <a className="underline underline-offset-4 font-black" href="https://platform.openai.com" target="_blank" rel="noreferrer">OpenAI Dev Console</a>
                <span className="text-[#555]"> — Create API keys here. Keep them secret.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://console.anthropic.com" target="_blank" rel="noreferrer">Anthropic Console</a>
                <span className="text-[#555]"> — Alternative provider. Same secret‑key rule.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://discord.com/app" target="_blank" rel="noreferrer">Discord App</a>
                <span className="text-[#555]"> — Support + announcements.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://github.com/snarktank/clawchief" target="_blank" rel="noreferrer">ClawChief Repo</a>
                <span className="text-[#555]"> — Templates + workflows you can steal.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://www.youtube.com/watch?v=9ZbbxSgrjhw&t=3847s" target="_blank" rel="noreferrer">OpenClaw Inspiration Talk</a>
                <span className="text-[#555]"> — The origin story behind priority maps.</span>
              </li>
            </ul>
            <div className="mt-8 border-t-2 border-[#111] pt-6 text-sm font-mono text-[#555]">
              Local docs: /home/falcon/Documents/How to turn your OpenClaw.txt • /home/falcon/Documents/openclaw course Anatomy.txt
            </div>
          </div>
        </div>

        {/* End of Class 1 */}
        <div className="border-t-[4px] border-[#111] pt-12 text-center">
          <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 01 Complete.</h2>
          <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[8px_8px_0_0_#111] transition-colors">
            Exit to Curriculum →
          </button>
        </div>{/* close max-w-4xl */}
        </div>{/* close flex-1 overflow-y-auto */}
      </div>
      <LessonAtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

const CourseTwoContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [promptState, setPromptState] = useState(0);
  const [thoughtChain, setThoughtChain] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);

  const sections = [
    { id: 's0', label: 'Intro: Stop Asking, Command' },
    { id: 's1', label: '1. Prompt Translator' },
    { id: 's2', label: '2. Context Window' },
    { id: 's3', label: '3. Laundry List Method' },
    { id: 's4', label: '4. Fabric Memory' },
    { id: 's5', label: '5. Chain of Thought' },
    { id: 's6', label: '6. Voice Interaction' },
    { id: 's7', label: '7. Morning Brief' },
    { id: 's8', label: '8. Bossy Prompt Formula' },
    { id: 's9', label: '9. Dictionary' },
    { id: 's10', label: '10. Resource Locker' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleTranslate = () => {
    if (promptState !== 0) return;
    setPromptState(1);
    setTimeout(() => { setPromptState(2); }, 1500);
  };
  const resetPrompt = () => setPromptState(0);

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 02</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Talk to It Properly</h2>
        </div>
        <button onClick={onClose} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class ✕
        </button>
      </div>

      <div ref={lessonScrollRef} className="lesson-scroll-pane flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Section Progress Tracker */}
        <div className="mb-8 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]">
          <div className="bg-[#111] px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 02 Progress</span>
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSection(s.id)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${completedSections.includes(s.id) ? 'text-[#22c55e]' : 'text-[#555]'}`}
              >
                <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                  {completedSections.includes(s.id) && <span className="block w-2 h-2 bg-current"></span>}
                </span>
                <span className="text-left leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intro */}
        <div id="c2-intro" className="mb-24">
          <NeedBox
            items={[
              "OpenClaw installed and running (if you can open it, you’re good).",
              "A terminal/console (Mac: Terminal app, Windows: PowerShell).",
              "Your Gmail + Calendar accounts handy for login.",
              "A note of your timezone (so your agent doesn’t time‑travel).",
              "Discord access for support (you’ll want it).",
              "One place to paste prompts (Notes app, Notion, or a text file)."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            Stop Asking. <br/><span className="italic text-[#22c55e]">Command.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6">
            If your AI is giving you generic garbage, it's because you're treating it like a magic 8-ball. It's a high-performance intern. Be specific.
          </p>
        </div>

        {/* Section 1: Prompting */}
        <div id="c2-prompting" className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. The Prompt Translator</h2>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-10 shadow-[8px_8px_0_0_#111]">
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div className="flex-1 border-[2px] border-[#333] bg-[#fdfaf6] p-6 relative">
                <div className="absolute -top-3 left-4 bg-red-500 text-white font-mono text-xs font-bold px-2 py-1 uppercase tracking-widest border-[2px] border-[#111]">The Weak Ask</div>
                <p className="font-serif text-lg text-[#555] italic mt-2">"Hey, could you help me write an email to my customers? Make it sound nice."</p>
              </div>
              <div className="flex items-center justify-center">
                {promptState === 0 && <button onClick={handleTranslate} className="font-sans font-black text-sm uppercase px-6 py-4 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e]">Translate →</button>}
                {promptState === 1 && <div className="font-mono text-xs text-[#555] animate-pulse">Bossifying...</div>}
                {promptState === 2 && <button onClick={resetPrompt} className="font-sans font-black text-sm uppercase px-6 py-4 bg-[#eae7de] border-[3px] border-[#111] shadow-[4px_4px_0_0_#111]">Reset</button>}
              </div>
              <div className={`flex-1 border-[2px] border-[#333] p-6 relative ${promptState === 2 ? 'bg-[#f0fdf4] border-green-600' : 'bg-[#e5e5e5]'}`}>
                <div className={`absolute -top-3 left-4 text-white font-mono text-xs font-bold px-2 py-1 uppercase tracking-widest border-[2px] border-[#111] ${promptState === 2 ? 'bg-green-600' : 'bg-gray-500'}`}>80m Standard</div>
                {promptState === 2 ? (
                  <div className="font-serif text-lg text-[#111] mt-2 space-y-2">
                    <p><strong>TASK:</strong> Write 3 urgent Black Friday emails.</p>
                    <p><strong>RULES:</strong> Grade 6 reading level. Zero emojis. 50 words max.</p>
                  </div>
                ) : <p className="font-mono text-[#888] mt-2 text-center py-8">Awaiting command...</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Context Window */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Context Window</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Think of the context window as AI short-term memory. You can hand it a massive document, a long conversation, a full brief — but it all has to fit in that window at once. Class 02 teaches you to manage it.
          </p>
          <div className="bg-[#111] p-8 text-[#eae7de] border-[3px] border-[#333]">
            <p className="font-mono text-xs text-[#aaa] mb-4 uppercase tracking-widest">// Context Window Visualizer</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#555] w-40">System Prompt</span>
                <div className="flex-1 h-6 bg-[#22c55e] rounded-sm"></div>
                <span className="font-mono text-xs text-[#aaa]">~2K tokens</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#555] w-40">Your Message</span>
                <div className="flex-1 h-6 bg-[#38bdf8] rounded-sm"></div>
                <span className="font-mono text-xs text-[#aaa]">~500 tokens</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#555] w-40">AI Response</span>
                <div className="flex-1 h-6 bg-[#f59e0b] rounded-sm"></div>
                <span className="font-mono text-xs text-[#aaa]">~1K tokens</span>
              </div>
              <div className="mt-4 pt-4 border-t border-[#333] flex items-center gap-3">
                <span className="font-mono text-xs text-[#555] w-40">Remaining</span>
                <div className="flex-1 h-6 bg-[#333] rounded-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#555] opacity-50"></div>
                </div>
                <span className="font-mono text-xs text-[#aaa]">~60K tokens free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Delegation */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. The Laundry List Method</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Stop giving one task at a time. Your agent council can handle a laundry list. We use numbered lists to make it execute 5 jobs in one go.
          </p>
          <div className="bg-white border-[3px] border-[#111] p-8">
            <h4 className="font-sans font-black text-lg mb-4 uppercase">The Pro-Delegation Prompt:</h4>
            <div className="bg-gray-100 p-6 font-mono text-sm border-l-4 border-[#111]">
              1. Research the top 3 news stories in [industry] today.<br/>
              2. Summarize each in 2 sentences.<br/>
              3. Draft a LinkedIn post about story #1.<br/>
              4. Draft a tweet about story #2.<br/>
              5. Email story #3 to my partner with the subject "FYI".
            </div>
            <p className="mt-4 font-serif italic text-sm text-[#777]">Note: If you don't number them, the AI will miss step 3 and 4 because it got excited about step 1.</p>
          </div>
        </div>

        {/* Section 4: Fabric Memory */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Fabric: Your Brand's Memory</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Every time you use AI, it starts from scratch. Fabric changes that. It saves your brand voice, your customers, your preferences — and injects them automatically into every conversation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-[#111] text-[#eae7de]">
              <h4 className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">Fabric Pattern</h4>
              <p className="font-serif text-[#aaa] italic">"Summarize the following in the voice of a no-BS direct-response marketer who charges $10K/month."</p>
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#f0fdf4]">
              <h4 className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">Result</h4>
              <p className="font-serif text-[#333]">"Here's what you're missing: your current email sequence is losing you $40K/yr. Here's the fix."</p>
            </div>
          </div>
        </div>

        {/* Section 5: Chain of Thought */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. Chain of Thought: Make It Think</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            AI is fast. Sometimes it's too fast and makes stupid mistakes. We use the **"Think First" Protocol**. We tell it to write its logic out *before* it gives the answer.
          </p>
          <div className="bg-[#111] p-8 border-[4px] border-[#333] text-[#eae7de] shadow-[12px_12px_0_0_#111]">
            <button
              onClick={() => setThoughtChain(!thoughtChain)}
              className="mb-8 font-sans font-black uppercase text-sm py-4 px-8 border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-[#111] transition-all"
            >
              {thoughtChain ? "Stop Thinking" : "Show Thinking Logic"}
            </button>
            <AnimatePresence>
              {thoughtChain && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs space-y-4">
                  <p className="text-[#38bdf8]">&gt; USER: "Balance my monthly ad budget."</p>
                  <p className="text-[#aaa]">&gt; AI THOUGHT PROCESS:<br/>
                    1. Identify total spend from CSV.<br/>
                    2. Compare against target CPA ($2.45).<br/>
                    3. Calculate waste on underperforming campaigns.<br/>
                    4. Draft recommendation based on 80m efficiency rules.
                  </p>
                  <p className="text-[#22c55e]">&gt; AI OUTPUT: "Stop campaign X immediately. Move $400 to Y."</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section 6: Voice Interaction */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Speak To It (Phonetic Hacks)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You're running voice-control now. But sometimes the AI mishears "SaaS" as "Sass" or "80m" as "AD-M".
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-[#eae7de]">
              <h4 className="font-sans font-black uppercase mb-2">The Phonetic Dictionary</h4>
              <p className="font-serif text-[#111]">Inside your OpenClaw config, we add a translation layer. It hears "ATM" and automatically writes "80m". This stops you from yelling at your computer like a lunatic.</p>
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#111] text-[#eae7de]">
              <h4 className="font-sans font-black uppercase mb-2 text-[#22c55e]">Hotkeys</h4>
              <p className="font-serif text-[#aaa]">Don't leave the mic on 24/7. Use a "Push to Talk" button on your desk. It feels cooler, and the AI won't accidentally buy a boat while you're watching a movie.</p>
            </div>
          </div>
        </div>

        {/* Section 7: Morning Brief */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. The Morning Brief (Your First Automations)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            By the end of Class 02, you'll have a cron job that wakes up at 7am, reads your emails and calendar, and delivers you a 5-bullet brief of what matters today. Before you're out of bed.
          </p>
          <MacWindow title="morning_brief.cron" contentClass="bg-[#111] p-6 font-mono text-sm text-[#eae7de]">
            <p className="text-[#aaa] mb-4"># 80m Morning Brief — runs daily at 7:00 AM</p>
            <p className="text-[#38bdf8]">0 7 * * * /root/80m/scripts/morning-brief.sh</p>
            <p className="text-[#555] mt-4">// Output delivered to:<br/>
            /root/80m/outputs/brief_$(date +\%Y-\%m-\%d).md</p>
            <p className="text-[#555] mt-2">// Contents: emails, calendar, action items, priorities</p>
          </MacWindow>
        </div>

        {/* Section 8: The Bossy Prompt Formula */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "The email, doc, or task you want done (copy it).",
              "The output format you want (bullets, table, JSON).",
              "One ‘hard rule’ you care about (tone, length, no emojis).",
              "A destination (Gmail draft, Notion, or plain text file)."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Bossy Prompt Formula</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Prompts aren’t vibes. They’re instructions. Use this formula and you’ll stop getting “AI poetry” when you asked for a calendar update.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-white shadow-[6px_6px_0_0_#111]">
              <h4 className="font-sans font-black uppercase mb-3">The Formula</h4>
              <ul className="font-serif text-[#444] space-y-3">
                <li><strong>ROLE:</strong> Who it is right now. (Executive assistant)</li>
                <li><strong>TASK:</strong> The exact job. (Draft 3 replies)</li>
                <li><strong>RULES:</strong> Constraints. (50 words, no emojis)</li>
                <li><strong>OUTPUT:</strong> The format. (Bulleted list)</li>
                <li><strong>CONTEXT:</strong> The facts it needs. (Client details)</li>
              </ul>
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#111] text-[#eae7de] shadow-[6px_6px_0_0_#22c55e]">
              <h4 className="font-sans font-black uppercase mb-3 text-[#22c55e]">Example (Copy + Paste)</h4>
              <p className="font-mono text-xs text-[#aaa]">ROLE: Executive assistant. TASK: Draft 3 reply options to this email. RULES: 60 words max, confident tone, no emojis. OUTPUT: 3 bullets. CONTEXT: [paste email].</p>
            </div>
          </div>
          <ResourceList
            title="Prompting Resources"
            items={[
              { label: "Prompt Translator Section", href: "#c2-prompting", note: "Go back to Section 1 in this class." },
              { label: "OpenClaw Inspiration Talk", href: "https://www.youtube.com/watch?v=9ZbbxSgrjhw&t=3847s", note: "How the pros structure directives." },
              { label: "ClawChief Repo", href: "https://github.com/snarktank/clawchief", note: "Real-world assistant prompts + workflows." }
            ]}
          />
        </div>

        {/* Section 9: The Dumb‑Proof Dictionary */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A real example from your life (email, task, calendar invite).",
              "A place to store your “rules” (AGENTS.md or a notes file).",
              "Two minutes of patience. That’s the whole requirement."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. The Dumb‑Proof Dictionary</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You’ll see these terms all over the AI world. Here’s what they actually mean.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { term: "Context Window", def: "How much the AI can hold in its short-term memory at once." },
              { term: "System Prompt", def: "The hidden instruction sheet it follows all session." },
              { term: "Delegation", def: "Giving it a list of jobs so it executes more than one thing." },
              { term: "Fabric", def: "Your brand memory. It makes the AI sound like you." },
              { term: "Chain of Thought", def: "Telling it to think before it answers." },
              { term: "Tool", def: "A connected service like Gmail or Calendar." },
              { term: "Cron", def: "A timer that runs tasks for you." },
              { term: "Output Format", def: "The shape you want: bullets, table, JSON, etc." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#444]">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 10: Resource Locker */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A working OpenClaw session (so links are useful, not aspirational).",
              "Your preferred note app for dumping snippets.",
              "Two browser tabs: one for docs, one for your work.",
              "Know this: a Dev Console is just the website where you create API keys. That’s it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. Resource Locker</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Actual links you’ll use. Not “Read 800 docs.” Just the good stuff.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <ul className="space-y-4 font-serif text-lg">
              <li>
                <a className="underline underline-offset-4 font-black" href="https://platform.openai.com" target="_blank" rel="noreferrer">OpenAI Dev Console</a>
                <span className="text-[#555]"> — Where API keys live. Don’t screenshot your key like a goblin.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://console.anthropic.com" target="_blank" rel="noreferrer">Anthropic Console</a>
                <span className="text-[#555]"> — Alternative model provider. Same rules: keys = secret.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://discord.com/app" target="_blank" rel="noreferrer">Discord App</a>
                <span className="text-[#555]"> — Where support + updates actually happen.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://github.com/snarktank/clawchief" target="_blank" rel="noreferrer">ClawChief Repo</a>
                <span className="text-[#555]"> — Real workflows you can steal.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-[4px] border-[#111] pt-12 text-center">
          <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 02 Complete.</h2>
          <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[8px_8px_0_0_#111] transition-colors">
            Exit to Curriculum →
          </button>
        </div>
        </div>{/* close max-w-4xl */}
        </div>{/* close flex-1 overflow-y-auto */}
      <LessonAtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};


const quizData = [
  {
    section: 1,
    questions: [
      { q: "What does DNS stand for?", options: ["Digital Network System", "Domain Name System", "Data Node Service", "Direct Name Server"], correct: 1 },
      { q: "If your AI is at '192.168.1.1:8080', what's the problem?", options: ["It's offline", "It's too fast", "It's impossible to share or remember", "It's been hacked"], correct: 2 },
      { q: "A CNAME record points your domain where?", options: ["To an IP address", "To another domain name", "To an email server", "To a file"], correct: 1 },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What does Nginx do at your server's front door?", options: ["Sends emails", "Checks credentials before letting users through", "Stores files", "Runs Python scripts"], correct: 1 },
      { q: "What port does HTTP traffic typically use?", options: ["22", "443", "80", "3000"], correct: 2 },
      { q: "What does 'proxy_pass' do in an Nginx config?", options: ["Sends email", "Forwards requests to your AI backend", "Blocks all traffic", "Restarts the server"], correct: 1 },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "In the simulator, what happens when you click 'Block All'?", options: ["Everything is allowed", "All traffic is blocked, including legitimate users", "Server speeds up", "Nothing"], correct: 1 },
      { q: "What is the 'Green Traffic' in the simulator?", options: ["Hacker traffic", "Legitimate user requests", "Spam", "System errors"], correct: 1 },
      { q: "What does 'Allow Known Good' do?", options: ["Blocks everything", "Only lets through verified safe traffic", "Deletes logs", "Sends alerts"], correct: 1 },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What does the green padlock in a browser URL bar mean?", options: ["The website is fast", "Traffic between you and the site is encrypted", "The website is government approved", "The website has no ads"], correct: 1 },
      { q: "Who provides the free SSL certificates that Certbot uses?", options: ["Google", "Amazon", "Let's Encrypt", "Microsoft"], correct: 2 },
      { q: "What's the correct Certbot command for Nginx?", options: ["certbot install", "certbot run", "certbot nginx", "certbot start"], correct: 2 },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What's the main advantage of a Cloudflare Tunnel?", options: ["Makes server faster", "No router port forwarding needed", "Replaces Nginx", "Free hosting"], correct: 1 },
      { q: "What does 'cloudflared' do?", options: ["Hosts a website", "Creates an encrypted tunnel from your server to Cloudflare", "Manages DNS only", "Blocks DDoS attacks"], correct: 1 },
      { q: "What is your server's public IP?", options: ["192.168.x.x addresses", "10.x.x.x addresses", "The IP your ISP gives you that the world sees", "Always 1.1.1.1"], correct: 2 },
    ]
  },
  {
    section: 6,
    questions: [
      { q: "Where do you find Nginx access logs?", options: ["/var/log/nginx/access.log", "/etc/nginx/logs", "/root/logs", "/var/www/logs"], correct: 0 },
      { q: "What does a 404 status code mean?", options: ["Server error", "Page not found", "Access denied", "Success"], correct: 1 },
      { q: "Why should you check your server logs regularly?", options: ["To slow down your server", "To spot hacker attempts early", "To increase traffic", "Logs aren't important"], correct: 1 },
    ]
  },
  {
    section: 7,
    questions: [
      { q: "What does Docker Compose let you do?", options: ["Send emails", "Run multiple containers as a single application", "Browse the web", "Edit photos"], correct: 1 },
      { q: "What is a Dockerfile?", options: ["A text message", "Instructions for building a Docker image", "A server config file", "A database"], correct: 1 },
      { q: "When should you scale horizontally?", options: ["Never", "When one bot cannot keep up with the workload", "Only on Fridays", "When the server is slow"], correct: 1 },
    ]
  },
  {
    section: 8,
    questions: [
      { q: "What does UFW stand for?", options: ["Universal File Upload", "Uncomplicated Firewall", "Ultra Fast Network", "User Folder Access"], correct: 1 },
      { q: "What does 'ufw default deny' do?", options: ["Opens all ports", "Blocks all incoming traffic by default", "Disables the firewall", "Restarts the server"], correct: 1 },
      { q: "What port does SSH typically use?", options: ["80", "443", "22", "8080"], correct: 2 },
    ]
  },
];

const CourseThreeContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [bouncerOn, setBouncerOn] = useState(false);
  const [tunnelOn, setTunnelOn] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);
  const [trafficState, setTrafficState] = useState(0);
  const [logView, setLogView] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);

  const sections = [
    { id: 's0', label: 'Intro: Total Ownership' },
    { id: 's1', label: '1. DNS & Domains' },
    { id: 's2', label: '2. Nginx' },
    { id: 's3', label: '3. Defense Simulator' },
    { id: 's4', label: '4. SSL/HTTPS' },
    { id: 's5', label: '5. Cloudflare Tunnel' },
    { id: 's6', label: '6. Log Monitoring' },
    { id: 's7', label: '7. Scaling' },
    { id: 's8', label: '8. Firewall' },
    { id: 's9', label: '9. Dictionary' },
    { id: 's10', label: '10. Resource Locker' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const sendTraffic = () => {
    if (!bouncerOn || !tunnelOn) { setTrafficState(1); } else { setTrafficState(2); }
    setTimeout(() => setTrafficState(0), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 03</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Own the Infrastructure</h2>
        </div>
        <button onClick={onClose} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class ✕
        </button>
      </div>

      <div ref={lessonScrollRef} className="lesson-scroll-pane flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Section Progress Tracker */}
        <div className="mb-8 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]">
          <div className="bg-[#111] px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 03 Progress</span>
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSection(s.id)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${completedSections.includes(s.id) ? 'text-[#22c55e]' : 'text-[#555]'}`}
              >
                <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                  {completedSections.includes(s.id) && <span className="block w-2 h-2 bg-current"></span>}
                </span>
                <span className="text-left leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Intro */}
        <div id="c3-intro" className="mb-24">
          <NeedBox
            items={[
              "A registered domain name (you can buy one today for ~$10/yr).",
              "A server (Mini PC, VPS, or a computer you don't need).",
              "Cloudflare account (free tier is fine).",
              "Docker running from Class 01.",
              "SSH access to your server (your terminal, again)."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase text-center">
            Total <br/><span className="italic text-[#22c55e]">Ownership.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
            No rent. No locks. Just a fortress you built.
          </p>
        </div>

        {/* Section 1: DNS & Domains */}
        <div className="mb-24" id="sec-1">
          <NeedBox
            title="What you need before you start"
            items={[
              "A domain name purchased (Namecheap, Cloudflare, Google Domains).",
              "The ability to click 'DNS Settings' in your registrar.",
              "Your server's public IP address (your hosting provider will give you this)."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. DNS: Your AI's Home Address</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            A domain name is like your home address — it's how people find you. Without it, your AI lives at <code className="bg-[#111] text-[#22c55e] px-2 py-1 font-mono text-sm">192.168.1.1:8080</code> which is impossible to remember and impossible to share.
          </p>
          <div className="bg-[#111] p-8 text-[#eae7de] border-[3px] border-[#333]">
            <p className="font-mono text-xs text-[#aaa] mb-4">// What DNS actually does</p>
            <div className="space-y-3 font-mono text-sm">
              <p className="text-[#38bdf8]">ai.80m.ai → 35.186.240.50 (server IP)</p>
              <p className="text-[#aaa]">When you type ai.80m.ai, DNS says: "Go to 35.186.240.50."</p>
              <p className="text-[#555]">This takes ~20ms. You never think about it.</p>
            </div>
          
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(1); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 1
            </button>
          </div>
        </div>

          {/* DNS Record Builder */}
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-4">// DNS Record Builder</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Type</label>
                  <select id="dnsType" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="A">A Record</option>
                    <option value="AAAA">AAAA Record</option>
                    <option value="CNAME">CNAME Record</option>
                    <option value="TXT">TXT Record</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Name/Host</label>
                  <input id="dnsName" type="text" placeholder="ai" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" defaultValue="ai" />
                </div>
                <div className="flex-1">
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Value/IP</label>
                  <input id="dnsValue" type="text" placeholder="35.186.240.50" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" defaultValue="35.186.240.50" />
                </div>
              </div>
              <button onClick={() => {
                const t = document.getElementById('dnsType').value;
                const n = document.getElementById('dnsName').value;
                const v = document.getElementById('dnsValue').value;
                document.getElementById('dnsOutput').textContent = `${t} Record: ${n}.80m.ai → ${v}`;
                document.getElementById('dnsOutput').classList.remove('hidden');
              }} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:bg-[#333] transition-colors">
                Generate Record
              </button>
              <div id="dnsOutput" className="hidden bg-[#111] p-4 font-mono text-sm text-[#22c55e] border-[2px] border-[#333]"></div>
            </div>
          </div>
        </div>

        {/* Section 2: Nginx */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "SSH access to your server (terminal, again).",
              "Your domain already pointed at your server IP.",
              "The IP address of your running Docker container."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. Nginx: The Bouncer</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Nginx sits at the front door of your server. It checks every request before it reaches your AI. "Who are you? Are you allowed to be here?" It's what stops hackers and lets legitimate users through.
          </p>
          <div className="bg-[#111] p-8 text-[#eae7de] border-[3px] border-[#333] font-mono text-sm space-y-2">
            <p className="text-[#aaa]"># nginx.conf (simplified)</p>
            <p className="text-[#38bdf8]">server &#123;</p>
            <p className="pl-4 text-[#eae7de]">listen 443 ssl;</p>
            <p className="pl-4 text-[#eae7de]">server_name ai.80m.ai;</p>
            <p className="pl-4 text-[#eae7de]">location / &#123;</p>
            <p className="pl-8 text-[#22c55e]">proxy_pass http://localhost:3000;</p>
            <p className="pl-4 text-[#eae7de]">&#125;</p>
            <p className="text-[#38bdf8]">&#125;</p>
          </div>

          {/* Nginx Config Builder */}
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-4">// Nginx Config Builder</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Server Name</label>
                  <input id="ngxServer" type="text" placeholder="ai.80m.ai" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" defaultValue="ai.80m.ai" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Proxy Pass URL</label>
                  <input id="ngxProxy" type="text" placeholder="http://localhost:3000" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" defaultValue="http://localhost:3000" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">SSL Port</label>
                  <input id="ngxPort" type="text" placeholder="443" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" defaultValue="443" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Enable SSL</label>
                  <select id="ngxSSL" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="yes">Yes (recommended)</option>
                    <option value="no">No (not recommended)</option>
                  </select>
                </div>
              </div>
              <button onClick={() => {
                const sn = document.getElementById('ngxServer').value;
                const pp = document.getElementById('ngxProxy').value;
                const port = document.getElementById('ngxPort').value;
                const ssl = document.getElementById('ngxSSL').value;
                const sslLine = ssl === 'yes' ? `    listen ${port} ssl;\n    ssl_certificate \/etc\/ssl\/certs\/your-cert.pem;\n    ssl_certificate_key \/etc\/ssl\/private\/your-key.pem;` : `    listen ${port};`;
                document.getElementById('ngxOutput').textContent = `server {\n${sslLine}\n    server_name ${sn};\n\n    location \/ {\n        proxy_pass ${pp};\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}`;
                document.getElementById('ngxOutput').classList.remove('hidden');
              }} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:bg-[#333] transition-colors">
                Generate Config
              </button>
              <pre id="ngxOutput" className="hidden bg-[#111] p-4 font-mono text-xs text-[#22c55e] border-[2px] border-[#333] overflow-x-auto whitespace-pre-wrap"></pre>
            </div>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(2); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 2
            </button>
          </div>


        {/* Section 3: Server Defense Simulator */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "The interactive simulator below is the only requirement.",
              "Click the buttons. Watch the traffic. That's the whole lesson."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. Server Defense Simulator</h2>
          <div className="bg-[#111] p-8 border-[4px] border-[#333] shadow-[12px_12px_0_0_#111] relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 mb-12 relative z-10">
              <button onClick={() => setBouncerOn(!bouncerOn)} className={`flex-1 font-sans font-black uppercase text-sm py-4 border-[2px] transition-all ${bouncerOn ? 'bg-[#38bdf8] text-[#111] border-[#38bdf8]' : 'bg-transparent text-white border-white/30 hover:border-white'}`}>
                {bouncerOn ? '✓ Nginx ON' : '1. Turn On Nginx'}
              </button>
              <button onClick={() => setTunnelOn(!tunnelOn)} className={`flex-1 font-sans font-black uppercase text-sm py-4 border-[2px] transition-all ${tunnelOn ? 'bg-[#22c55e] text-[#111] border-[#22c55e]' : 'bg-transparent text-white border-white/30 hover:border-white'}`}>
                {tunnelOn ? '✓ Tunnel ON' : '2. Open Secure Tunnel'}
              </button>
            </div>
            <div className="relative h-32 flex items-center justify-between z-10 px-8">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center font-black text-white shadow-[0_0_20px_red] border-2 border-black">WEB</div>
              <div className="flex-1 relative flex items-center">
                <div className="h-[2px] w-full bg-white/20 absolute"></div>
                {trafficState === 1 && <motion.div initial={{ left: "0%" }} animate={{ left: "100%" }} transition={{ duration: 0.5 }} className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center z-30">☠</motion.div>}
                {trafficState === 2 && <motion.div initial={{ left: "0%" }} animate={{ left: "100%" }} transition={{ duration: 1.5 }} className="absolute w-6 h-6 bg-[#22c55e] rounded-full z-30 shadow-[0_0_15px_#22c55e]"></motion.div>}
                <div className={`absolute left-1/3 w-4 h-16 -mt-8 border-2 border-black transition-colors ${tunnelOn ? 'bg-[#22c55e]' : 'bg-[#333]'}`}></div>
                <div className={`absolute left-2/3 w-4 h-16 -mt-8 border-2 border-black transition-colors ${bouncerOn ? 'bg-[#38bdf8]' : 'bg-[#333]'}`}></div>
              </div>
              <div className={`w-16 h-16 flex items-center justify-center font-black border-2 border-black transition-colors ${trafficState === 1 ? 'bg-red-600' : 'bg-[#eae7de]'}`}>
                {trafficState === 1 ? '!!' : 'STK'}
              </div>
            </div>
            <div className="text-center mt-8 relative z-10">
              <button onClick={sendTraffic} className="font-sans font-black text-lg px-8 py-4 bg-[#eae7de] text-[#111] shadow-[4px_4px_0_0_#111]">Send Traffic</button>
            </div>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(3); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 3
            </button>
          </div>


        {/* Section 4: SSL */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Nginx installed (Section 2).",
              "Your domain pointing at your server.",
              "Certbot installed: `sudo apt install certbot python3-certbot-nginx`."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. The "Green Lock" (SSL/HTTPS)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            If your website address doesn't start with <code className="text-[#22c55e] font-mono">https://</code>, you are an easy target. We use **Certbot** to get a free certificate from Let's Encrypt.
          </p>
          <div className="bg-white border-[3px] border-[#111] p-8">
            <h4 className="font-sans font-black uppercase text-sm mb-4">The HTTPS Handshake:</h4>
            <p className="font-serif text-lg leading-relaxed text-[#333]">
              Normally, your password travels over the internet in plain text. Anyone at the Starbucks Wi-Fi can see it. SSL encrypts it into a mess of random gibberish that only your server can unlock. We automate this renewal so it never expires.
            </p>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(4); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 4
            </button>
          </div>


        {/* Section 5: Cloudflare Tunnel */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Cloudflare account with your domain added (free).",
              "Cloudflared installed on your server.",
              "No router access needed. That's the point."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. The Secret Tunnel (Cloudflare Tunnel)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Your server is behind a router at home. The world can't reach it. The Cloudflare Tunnel punches a hole through that router and says "connect this computer to the internet" — without opening any ports.
          </p>
          <div className="bg-[#111] text-[#eae7de] p-8 border-[3px] border-[#22c55e] shadow-[8px_8px_0_0_#22c55e]">
            <p className="font-mono text-xs text-[#aaa] mb-4"># One command. No router config. No port forwarding.</p>
            <p className="font-mono text-[#22c55e]">cloudflared tunnel --url http://localhost:3000</p>
            <p className="font-mono text-xs text-[#555] mt-4">// Output: Try cloudflared-tunnel.trycloudflare.com</p>
            <p className="font-mono text-xs text-[#555]">// Share this URL. It routes straight to your local server.</p>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(5); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 5
            </button>
          </div>


        {/* Section 6: Log Monitoring */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Nginx running from Section 2.",
              "A browser open. That's it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Monitoring the Bouncer</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            How do you know if someone is trying to break in? You check the **Nginx Logs**. We've added a dashboard so you can see every knock at the door.
          </p>
          <MacWindow title="access.log" contentClass="bg-[#111] p-6 h-64 overflow-y-auto font-mono text-[10px] text-[#22c55e]">
            <button onClick={() => setLogView(!logView)} className="mb-4 bg-[#22c55e] text-[#111] px-2 py-1 uppercase font-bold">Refresh Logs</button>
            <div className="space-y-1">
              <p>[INFO] 192.168.1.1 - GET / HTTP/1.1 - 200 OK</p>
              <p>[INFO] 64.233.160.0 - GET /api/status HTTP/1.1 - 200 OK</p>
              {logView && (
                <>
                  <p className="text-red-500">[WARN] 45.12.33.111 - POST /admin/login HTTP/1.1 - 403 FORBIDDEN</p>
                  <p className="text-red-500">[WARN] 45.12.33.111 - POST /wp-admin HTTP/1.1 - 404 NOT FOUND</p>
                  <p className="text-red-500">[WARN] 45.12.33.111 - IP BAN TRIGGERED - BRUTE FORCE DETECTED</p>
                </>
              )}
              <p className="animate-pulse">_</p>
            </div>
          </MacWindow>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(6); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 6
            </button>
          </div>


        {/* Section 7: Scaling */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Docker Compose running from Class 01.",
              "Your Dockerfile ready.",
              "A task that can be split into chunks (research, data entry, outreach)."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. Scaling: From Bot to Factory</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            What happens when your one bot is so busy it can't keep up? You **Containerize**.
          </p>
          <div className="bg-[#22c55e] p-8 md:p-12 border-[4px] border-[#111] shadow-[12px_12px_0_0_#111]">
            <h3 className="font-sans font-black text-2xl uppercase mb-4 text-[#111]">The "Spin Up" Strategy:</h3>
            <p className="font-serif text-lg leading-relaxed mb-6 text-[#111]">
              Because we use Docker, you can spin up 10 versions of your agent in seconds. If you're doing a massive research project for a client, you don't wait for one bot. You hire 10 digital interns, give them each a chunk of the work, and watch them finish it 10x faster. This is how small agencies outwork 100-person firms.
            </p>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(7); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 7
            </button>
          </div>


        {/* Section 8: Firewall */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "SSH access to your server.",
              "Ubuntu or Debian (most common server OS).",
              "Nothing else open. We're about to close everything."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Firewall: Locking the Doors</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            UFW (Uncomplicated Firewall) is the lock on your server's doors. By default, everything is open. We lock it down so only the ports you need are accessible.
          </p>
          <MacWindow title="firewall.rules" contentClass="bg-[#111] p-6 font-mono text-sm text-[#eae7de]">
            <div className="space-y-3">
              <p className="text-[#aaa]"># Default deny all incoming</p>
              <p className="text-[#22c55e]">ufw default deny incoming</p>
              <p className="text-[#aaa] mt-4"># Allow only these:</p>
              <p className="text-[#38bdf8]">ufw allow 443/tcp  # HTTPS</p>
              <p className="text-[#38bdf8]">ufw allow 22/tcp    # SSH (your access only)</p>
              <p className="text-[#aaa] mt-4"># Enable firewall</p>
              <p className="text-[#22c55e]">ufw enable</p>
            </div>
          </MacWindow>

          {/* Firewall Rule Builder */}
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-4">// Firewall Rule Builder</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Port Number</label>
                  <input id="fwPort" type="text" placeholder="443" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" defaultValue="443" />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Protocol</label>
                  <select id="fwProto" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="any">Both</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Rule Type</label>
                  <select id="fwType" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="allow">Allow</option>
                    <option value="deny">Deny</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Comment / Label</label>
                <input id="fwComment" type="text" placeholder="HTTPS for web traffic" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" />
              </div>
              <button onClick={() => {
                const port = document.getElementById('fwPort').value;
                const proto = document.getElementById('fwProto').value;
                const type = document.getElementById('fwType').value;
                const comment = document.getElementById('fwComment').value;
                const protoStr = proto === 'any' ? '' : `\/${proto}`;
                const commentStr = comment ? `  # ${comment}` : '';
                document.getElementById('fwOutput').textContent = `ufw ${type} ${port}${protoStr}${commentStr}`;
                document.getElementById('fwOutput').classList.remove('hidden');
              }} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:bg-[#333] transition-colors">
                Generate Rule
              </button>
              <div id="fwOutput" className="hidden bg-[#111] p-4 font-mono text-sm text-[#22c55e] border-[2px] border-[#333]"></div>
            </div>
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(8); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 8
            </button>
          </div>


        {/* Section 9: The Dumb‑Proof Dictionary */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A server. Any server. Even an old laptop.",
              "Your domain name and login.",
              "Coffee. This is the longest class."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. The Dumb‑Proof Dictionary</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Infrastructure words you’ll see constantly. Memorize these or look them up every time. Either way, know them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { term: "DNS", def: "The phone book of the internet. Maps names (ai.80m.ai) to numbers (35.186.240.50)." },
              { term: "SSL / HTTPS", def: "The padlock. Encrypts traffic so hackers can't read your data." },
              { term: "Nginx", def: "The bouncer. Sits at the door and checks credentials before letting anyone in." },
              { term: "Cloudflare Tunnel", def: "A secret tunnel through your router. No port forwarding required." },
              { term: "Firewall (UFW)", def: "The locks on your doors. Default deny = paranoia mode." },
              { term: "SSH", def: "How you talk to your server remotely. It's your server's intercom." },
              { term: "Docker", def: "Already covered in Class 01. It's the shipping container for your AI." },
              { term: "Certbot", def: "The thing that gets your SSL certificate for free. Auto-renews." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#444]">{item.def}</p>
              </div>
            ))}
          </div>
        </div>
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(9); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 9
            </button>
          </div>


        {/* Section 10: Resource Locker */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A server with SSH access.",
              "Cloudflare account (free).",
              "A domain name.",
              "Docker running."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. Resource Locker</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Class 03 is the most technical. Here are the exact tools, docs, and links you'll actually use.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <ul className="space-y-4 font-serif text-lg">
              <li>
                <a className="underline underline-offset-4 font-black" href="https://www.cloudflare.com" target="_blank" rel="noreferrer">Cloudflare Dashboard</a>
                <span className="text-[#555]"> — Where you manage DNS + tunnels. One dashboard to rule them all.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://certbot.eff.org" target="_blank" rel="noreferrer">Certbot Docs</a>
                <span className="text-[#555]"> — Free SSL. Official instructions for every server OS.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://nginx.org/en/docs/" target="_blank" rel="noreferrer">Nginx Documentation</a>
                <span className="text-[#555]"> — The actual docs. Dense, but complete.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/" target="_blank" rel="noreferrer">Cloudflare Tunnel Docs</a>
                <span className="text-[#555]"> — The tunnel setup guide.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04" target="_blank" rel="noreferrer">UFW Firewall Guide</a>
                <span className="text-[#555]"> — Step‑by‑step firewall setup.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://www.namecheap.com" target="_blank" rel="noreferrer">Namecheap</a>
                <span className="text-[#555]"> — Where to buy a domain for $10/yr.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizActive && quizSection !== null && (() => {
          const qData = quizData.find(q => q.section === quizSection);
          if (!qData) return null;
          return (
            <QuizModal
              isOpen={quizActive}
              questions={qData.questions}
              onComplete={(s) => {
                setQuizScore(s);
                setQuizDone({ section: quizSection, score: s, total: qData.questions.length });
                setQuizActive(false);
                setQuizSection(null);
              }}
            />
          );
        })()}

        {/* Quiz Score Toast */}
        {quizDone && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-[#111] text-[#eae7de] border-[3px] border-[#22c55e] px-8 py-4 font-sans font-black text-lg shadow-[6px_6px_0_0_#22c55e]">
            Section {quizDone.section} Quiz: {quizDone.score}/{quizDone.total} — {quizDone.score >= 2 ? 'Passed.' : 'Read it again.'}
          </div>
        )}

        <div className="border-t-[4px] border-[#111] pt-12 text-center">
          <h2 className="font-serif text-4xl font-black mb-6 uppercase">Total Ownership Achieved.</h2>
          <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[8px_8px_0_0_#111] transition-colors">
            Exit to Curriculum →
          </button>
        </div>

      </div>{/* close max-w-4xl */}
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(10); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 10
            </button>
          </div>

      </div>{/* close flex-1 overflow-y-auto */}
      <LessonAtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

// --- Main Portal Page ---

const classesData = [
  {
    id: "01",
    title: "Install the Stack",
    subtitle: "From Zero to 'Hey, Run This For Me'",
    time: "75 Minutes",
    description: "Installation Hell is where dreams go to die. We skip it entirely with our pre-built 80m container strategy.",
    image: "https://i.postimg.cc/BbsxmGcr/80mascot-Edited.png",
    topics: [
      { name: "Hermes & OpenClaw", detail: "The brain and the muscle." },
      { name: "The Lazy Install", detail: "Copy, paste, and walk away." },
      { name: "Troubleshooting", detail: "What to do when the screen turns red." },
      { name: "The Council", detail: "Specialized agents checking each other's work." }
    ]
  },
  {
    id: "02",
    title: "Talk to It Properly",
    subtitle: "Stop Asking, Start Delegating",
    time: "80 Minutes",
    description: "Most people prompt like interns. You will learn to prompt like a dictator. High output, zero fluff.",
    image: "https://i.postimg.cc/zv5nx1F1/80mascot-claw.png",
    topics: [
      { name: "Boss Mode Prompting", detail: "Get results, not suggestions." },
      { name: "Memory & Fabric", detail: "Making the machine remember your brand." },
      { name: "Chain of Thought", detail: "Make it think before it answers." },
      { name: "Voice Hacking", detail: "The actual 'command' part of voice control." }
    ]
  },
  {
    id: "03",
    title: "Own the Infrastructure",
    subtitle: "The Bouncer for Your Server",
    time: "90 Minutes",
    description: "Domains, DNS, and reverse proxies. This is the wall that keeps your data yours and the hackers out.",
    image: "https://i.postimg.cc/x8YK6S32/80mascot-rich.png",
    topics: [
      { name: "DNS & Domains", detail: "Your AI's home address." },
      { name: "Nginx & Tunnels", detail: "The bouncer at the door." },
      { name: "SSL & Security", detail: "The green lock of trust." },
      { name: "Scaling", detail: "Turning one bot into an army." }
    ]
  }
];

const walkAwayData = [
  { title: "A Local God", desc: "A voice-controlled AI agent on your own server. Total privacy." },
  { title: "Total Delegation", desc: "Hand off tasks and actually get results, not excuses." },
  { title: "The Ghost", desc: "Cron jobs that run while you sleep. Your business moves 24/7." },
  { title: "Zero Rent", desc: "No subscriptions. No vendor lock-in. You own the code." }
];

export default function PortalPage() {
  const [activeCourseId, setActiveCourseId] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (activeCourseId) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, [activeCourseId]);

  return (
    <div className="min-h-screen text-[#111] font-sans selection:bg-[#111] selection:text-[#eae7de] overflow-x-hidden relative">
      <NoiseOverlay />
      <PaperBackground />

      {/* Portal Nav */}
      <nav className="p-6 md:p-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-serif font-black text-3xl tracking-tighter uppercase text-[#111]">80m<span className="text-[#22c55e]">.</span></Link>
          <span className="font-mono text-xs font-bold uppercase tracking-widest bg-[#111] text-[#22c55e] px-4 py-2 border-[2px] border-[#111] shadow-[4px_4px_0_0_#111]">
            Portal
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest font-bold">
          <Link to="/" className="px-4 py-2 hover:text-[#22c55e] transition-colors">← Landing</Link>
        </div>
      </nav>

      <main className="pb-32 px-4 md:px-8 max-w-[1200px] mx-auto relative z-10">

        {/* Hero */}
        <section className="pt-12 md:pt-24 pb-20 border-b-[4px] border-[#111] mb-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
            <motion.p variants={fadeUp} className="font-mono text-sm font-bold uppercase tracking-[0.2em] mb-6 text-[#555]">
              // The 80m Blueprint
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-[8rem] lg:text-[10rem] leading-[0.85] tracking-tighter mix-blend-multiply text-[#111] mb-8 uppercase">
              Own Your <br/> <span className="italic">AI Stack.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-xl md:text-3xl font-bold mix-blend-multiply text-[#333] max-w-3xl mx-auto">
              No Theory. No Fluff. Just Output.
            </motion.p>
          </motion.div>
        </section>

        {/* Manifesto + Outcomes */}
        <section className="mb-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <MacWindow title="manifesto.txt" className="-rotate-1">
                <div className="p-8 md:p-12">
                  <h2 className="font-serif text-4xl font-black mb-6 leading-tight uppercase">Welcome to the Machine.</h2>
                  <div className="font-serif text-lg md:text-xl text-[#333] space-y-6 leading-relaxed">
                    <p>80m was started to catch you up. We find people who are "efficiently lazy"—people who don't want to learn the history of neural networks, they just want an agent that handles their email.</p>
                    <p className="font-sans font-black text-[#111] text-2xl uppercase tracking-tight mt-8 italic underline decoration-[#22c55e]">This isn't a coding bootcamp.</p>
                  </div>
                </div>
              </MacWindow>
            </motion.div>
            <motion.div variants={fadeUp} className="lg:col-span-7 pl-0 lg:pl-12">
              <h3 className="font-mono text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-4 text-[#555]">
                <span className="w-12 h-[2px] bg-[#111]"></span>
                What You're Walking Away With
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {walkAwayData.map((item, idx) => (
                  <div key={idx} className="bg-[#eae7de] border-[3px] border-[#111] p-6 shadow-[6px_6px_0_0_#111] hover:-translate-y-1 transition-transform">
                    <h4 className="font-sans font-black text-xl mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="font-serif text-[#444] leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Curriculum */}
        <section className="mb-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <div className="text-center mb-20">
              <h2 className="font-serif text-6xl md:text-8xl leading-[0.85] tracking-tighter mix-blend-multiply uppercase">The Curriculum.</h2>
            </div>
            <div className="space-y-20">
              {classesData.map((cls, index) => (
                <motion.div key={cls.id} variants={fadeUp} className={`relative border-[4px] border-[#111] bg-[#eae7de] shadow-[12px_12px_0_0_#111] flex flex-col lg:flex-row ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <motion.img src={cls.image} alt={cls.title} className={`absolute z-[60] w-32 md:w-44 lg:w-56 pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] ${index % 2 !== 0 ? '-top-12 -right-4 md:-top-16 md:-right-12' : '-top-12 -left-4 md:-top-16 md:-left-12'}`} animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }} />
                  <div className={`lg:w-1/3 bg-[#111] text-[#eae7de] p-8 md:p-12 flex flex-col justify-between ${index === 1 ? 'bg-[#22c55e] text-[#111]' : ''} ${index % 2 !== 0 ? 'items-start text-left' : 'items-end text-right'}`}>
                    <div className="w-full">
                      <span className={`font-mono text-6xl md:text-8xl font-black opacity-20 block mb-4 ${index === 1 ? 'text-[#111]' : 'text-white'}`}>{cls.id}</span>
                      <h3 className="font-serif text-4xl md:text-5xl font-black leading-[0.9] mb-4 uppercase">Class {cls.id} <br/><span className="italic font-normal">{cls.title}</span></h3>
                    </div>
                    <div className="flex flex-col gap-4 mt-8 w-fit">
                      <div className={`inline-block border-2 px-4 py-2 font-mono text-sm font-bold ${index === 1 ? 'border-[#111] bg-[#111] text-[#eae7de]' : 'border-[#eae7de] bg-transparent'}`}>Target: {cls.time}</div>
                      <button onClick={() => setActiveCourseId(cls.id)} className={`font-sans font-black text-lg px-6 py-3 border-[3px] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all ${index === 1 ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'bg-[#22c55e] text-[#111] border-[#111]'}`}>Start Course →</button>
                    </div>
                  </div>
                  <div className="lg:w-2/3 p-8 md:p-12">
                    <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed mb-10 pb-10 border-b-[3px] border-[#111]/10">{cls.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {cls.topics.map((topic, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="font-mono text-[#22c55e] font-black mt-1 text-lg">›</span>
                          <div>
                            <h4 className="font-sans font-black text-lg uppercase tracking-tight mb-1">{topic.name}</h4>
                            <p className="font-serif text-[#555] leading-snug">{topic.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="mb-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-4xl mx-auto">
            <h2 className="font-serif text-5xl md:text-7xl leading-[0.85] tracking-tighter mix-blend-multiply uppercase text-center mb-16">The Bullsh*t Detector.</h2>
            <div className="border-[3px] border-[#111] shadow-[12px_12px_0_0_#111] bg-[#eae7de]">
              <FAQItem question="Do I need to be a nerd?" answer="No. You just need to be able to copy and paste. If you can follow a LEGO manual, you can build the 80m stack." />
              <FAQItem question="How long does this take?" answer="The videos are ~4 hours. If you pause and follow along, you'll be done in a Saturday afternoon." />
              <FAQItem question="What if I get stuck?" answer="That's what the Private Discord is for. Our team is in there. Don't bang your head against the wall; just ask." />
              <FAQItem question="Is this cloud or local?" answer="Both. The stack runs locally on your hardware for privacy and speed. But you can access it remotely via the secure tunnel we set up in Class 03. Your data never touches our servers." />
              <FAQItem question="What's included in the agent council?" answer="Hermes (chief coordinator), Prawnius (quick tasks), Claudnelius (code/design), Knowledge Knaight (intelligence/research), Knaight of Affairs (scheduling/ops), Sir Clawthchilds (finance), Labrina (content/social), and Clawdette (operations/executor). Each runs as an independent agent with shared memory." />
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-[#111] border-[4px] border-[#22c55e] p-12 md:p-24 shadow-[20px_20px_0_0_#22c55e] relative overflow-hidden">
             <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#22c55e] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
             <motion.div variants={fadeUp} className="relative z-10">
                <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#eae7de] leading-[0.85] tracking-tighter mb-12 uppercase italic">Ready to <br/>Deploy?</h2>
                <button className="font-sans font-black text-xl md:text-3xl px-12 py-6 bg-[#22c55e] text-[#111] border-[3px] border-transparent hover:border-[#eae7de] shadow-[0_10px_30px_rgba(34,197,94,0.3)] hover:-translate-y-1 transition-all">Enroll Now</button>
             </motion.div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t-[4px] border-[#111] py-12 text-center relative z-10 bg-[#eae7de]">
        <div className="flex flex-col items-center gap-4">
          <Link to="/" className="font-serif font-black text-3xl tracking-tighter uppercase text-[#111]">80m<span className="text-[#22c55e]">.</span></Link>
          <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#555]">© 2026 80m SYSTEMS. All rights reserved.</span>
          <a href="mailto:contact@80m.ai" className="font-mono text-xs uppercase tracking-widest hover:underline underline-offset-8 font-black">contact@80m.ai</a>
        </div>
      </footer>

      {/* Course Overlays */}
      <AnimatePresence>
        {activeCourseId === "01" && <CourseOneContent key="course-01" onClose={() => setActiveCourseId(null)} />}
        {activeCourseId === "02" && <CourseTwoContent key="course-02" onClose={() => setActiveCourseId(null)} />}
        {activeCourseId === "03" && <CourseThreeContent key="course-03" onClose={() => setActiveCourseId(null)} />}
      </AnimatePresence>
    </div>
  );
}
