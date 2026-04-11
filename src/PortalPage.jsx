import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AtmScrollbar } from './App';
import {
  NoiseOverlay,
  PaperBackground,
  QuizModal,
  MacWindow,
  NeedBox,
  ResourceList,
  GlossaryTooltip,
  CourseBoostPanel,
  SectionMeta,
  CopyBlock,
  CheckpointCard,
  FAQItem,
} from './PortalShared';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- Course Content Pages ---

  export const CourseFourContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [warmupDay, setWarmupDay] = useState(0);
  const [shadowbanScore, setShadowbanScore] = useState(50);
  const [shadowbanScenario, setShadowbanScenario] = useState(null);
  const [postizStep, setPostizStep] = useState(0);
  const [postizApiKey, setPostizApiKey] = useState('');
  const [productNiche, setProductNiche] = useState('ai-app');
  const [slideHook, setSlideHook] = useState('');
  const [slideInfo, setSlideInfo] = useState('');
  const [slideCta, setSlideCta] = useState('');
  const [stockpileDays, setStockpileDays] = useState(7);
  const [stockpilePosts, setStockpilePosts] = useState(3);
  const [ruleChecked, setRuleChecked] = useState([false,false,false,false,false,false,false]);
  const [androidStep, setAndroidStep] = useState(0);
  const [cronTimes, setCronTimes] = useState(['09:00','12:00','17:00']);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('80m-c4-quizzes') || '[]'); } catch { return []; }
  });

  const sections = [
    { id: 's0', label: 'Intro: The Ghost' },
    { id: 's1', label: '1. Anti-Shadowban' },
    { id: 's2', label: '2. The Stack' },
    { id: 's3', label: '3. Postiz Setup' },
    { id: 's4', label: '4. Image Gen' },
    { id: 's5', label: '5. 3-Slide Formula' },
    { id: 's6', label: '6. Stockpile' },
    { id: 's7', label: '7. Postiz Rules' },
    { id: 's8', label: '8. Secret Android' },
    { id: 's9', label: '9. Cron Automation' },
    { id: 's10', label: '10. Dictionary' },
    { id: 's11', label: '11. Resources' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const scenarios = [
    { label: 'Brand new account, warmed 3 days, posting from Android phone', risk: 5, icon: '🟢', desc: 'Clean. TikTok sees this as a real human. Reach is maximized.' },
    { label: '3-month-old account, warmed 3 days, posting from Android', risk: 15, icon: '🟢', desc: 'Low risk. The Android step is doing heavy lifting here.' },
    { label: 'New account, skipped warmup, posting from Postiz API directly', risk: 95, icon: '🔴', desc: 'Shadowban incoming. TikTok detects the API signature and kills your reach the first time you post.' },
    { label: '6-month account, some history, posting from Postiz API', risk: 70, icon: '🟡', desc: 'Medium-high risk. Old accounts get grandfathered a bit, but API posting still flags you.' },
    { label: 'Warmed 1 day only, then Android posting', risk: 40, icon: '🟡', desc: 'Better than nothing, but TikTok may still flag inconsistent behavior. Go full 3 days.' },
  ];

  const shadowbanResult = scenarios.find(s => s.risk === shadowbanScore) || scenarios[1];

  const nicheExamples = {
    'ai-app': { hook: 'Your Quran app now explains verses in plain English. No scholar required.', info: 'Upload any verse. Get an AI explanation in 3 seconds. Perfect for daily reflection.', cta: 'Download on the App Store. Free to start.' },
    'lifestyle': { hook: 'Day in the life of someone who stopped chasing productivity and started building systems.', info: '5am wake up. Not for the grind. For the clarity. Here\'s the exact morning stack that changed everything.', cta: 'Save this. Your future self will thank you.' },
    'health': { hook: 'I lost 18 pounds in 90 days. No gym. No starvation. Just these 3 rules.', info: 'Rule 1: Protein first. Rule 2: Walk after every meal. Rule 3: Sleep 7 hours minimum. That\'s it. Here\'s the tracking template.', cta: 'Screenshots your results. DM me your before.' },
    'ecommerce': { hook: 'I found the exact product my competitors are hiding. Here\'s how.', info: 'Used one free tool. Spent $0 on ads. The trick? Finding the pain point your audience googles at 2am.', cta: 'Link in bio for the full breakdown.' },
  };

  const handleRuleToggle = (i) => {
    setRuleChecked(prev => { const next = [...prev]; next[i] = !next[i]; return next; });
  };

  const ruleLabels = [
    'All posts go to DRAFTS only',
    'Audio = None on every post',
    'Max 5 hashtags per post',
    'Caption under 1,000 characters',
    'Scheduled at posted times only',
    'Correct number of attachments',
    'Unique title per post',
  ];

  const ruleScore = ruleChecked.filter(Boolean).length;

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 04</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Content Forge</h2>
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
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 04 Progress</span>
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete · {passedQuizzes.length}/5 quizzes passed</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => {
              const sectionNum = parseInt(s.id.replace('s', ''));
              const hasQuiz = sectionNum >= 1 && sectionNum <= 5;
              const isPassed = passedQuizzes.includes(sectionNum);
              const isDone = completedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${isDone ? 'text-[#22c55e]' : 'text-[#555]'}`}
                >
                  <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                    {isDone ? (
                      <span className="block w-2 h-2 bg-current"></span>
                    ) : hasQuiz && !isPassed ? (
                      <span className="text-[8px]">🔒</span>
                    ) : null}
                  </span>
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== SECTION 0: INTRO ===== */}
        <div id="c4-intro" className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Classes 01 + 02 completed (Hermes running, tools connected).",
              "A Postiz account (postiz.pro/ashen — use ashen's ref).",
              "A Gemini API key (or OpenAI if you prefer).",
              "A warm TikTok account (create new on a cheap Android).",
              "The $50 Android setup (Section 8 walks through this)."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            The Ghost in the <br/><span className="italic text-[#22c55e]">TikTok Machine.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
            Your AI posts for you. While you sleep. Your phone thinks a human is doing it. TikTok never knows the difference. This is not a growth hack. This is the actual system.
          </p>

          {/* Big stats panel */}
          <div className="bg-[#111] border-[4px] border-[#22c55e] p-8 md:p-12 shadow-[12px_12px_0_0_#22c55e] mb-10">
            <h3 className="font-mono text-[#22c55e] font-bold uppercase tracking-widest mb-6 text-center">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { num: '5.6M', label: 'Views on best Reel.Farm post' },
                { num: '90', label: 'Market touches per month (3 posts × 30 days)' },
                { num: '$0', label: 'Your time investment after setup' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-sans font-black text-5xl md:text-6xl text-[#22c55e] tracking-tighter">{stat.num}</div>
                  <div className="font-serif text-[#aaa] mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-center font-serif text-[#aaa] mt-6 italic">The Reel.Farm team gets these numbers with zero manual posting. You can too.</p>
          </div>

          {/* Warmup Tracker */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">3-Day Warmup Protocol Tracker</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Click each day as you complete it. TikTok needs to see human behavior before you go live.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { day: 1, label: 'Day 1 — Watch & Scroll', tasks: ['Scroll TikTok for 20 min in your niche', 'Like 15-20 posts in your niche', 'Save 3 posts to your favorites', 'Follow 10 accounts in your niche'] },
                { day: 2, label: 'Day 2 — Engage & Comment', tasks: ['Comment on 5 posts in your niche (real comments!)', 'Share 2 posts to your story', 'Bookmark 5 more posts', 'Post your first raw slideshow (no link, no CTA)'] },
                { day: 3, label: 'Day 3 — Soft Post', tasks: ['Post 1 slideshow with soft CTA (no link)', 'Engage with every comment you get', 'Share to Instagram if connected', 'You\'re ready. Hit go on the automation.'] },
              ].map(({ day, label, tasks }) => (
                <div key={day} className={`border-[2px] p-4 cursor-pointer transition-all ${warmupDay >= day ? 'border-[#22c55e] bg-[#f0fdf4]' : warmupDay === day - 1 ? 'border-[#22c55e] bg-[#fffbeb]' : 'border-[#ddd] bg-white'}`} onClick={() => setWarmupDay(day === warmupDay ? day - 1 : day)}>
                  <div className="font-mono text-xs font-bold uppercase mb-2">{label}</div>
                  <div className="space-y-1">
                    {tasks.map((task, i) => (
                      <div key={i} className={`flex items-start gap-2 text-xs font-serif ${warmupDay >= day ? 'text-[#14532d]' : 'text-[#555]'}`}>
                        <span className={warmupDay >= day ? 'text-[#22c55e] font-black' : 'text-[#aaa]'}>
                          {warmupDay >= day ? '✓' : '○'}
                        </span>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {warmupDay < 3 && (
              <div className="mt-4 p-3 bg-[#fffbeb] border-[2px] border-[#f59e0b] text-sm font-serif text-[#92400e]">
                ⚠ Complete all 3 days before activating automation. Skipping this = shadowban. It's not worth it.
              </div>
            )}
            {warmupDay === 3 && (
              <div className="mt-4 p-3 bg-[#f0fdf4] border-[2px] border-[#22c55e] text-sm font-serif text-[#14532d]">
                ✓ Warmup complete. You are cleared for automated posting. The Ghost is ready.
              </div>
            )}
          </div>

          <CourseBoostPanel
            title="Class 04 Success Criteria + Rescue Prompts"
            checklist={[
              "3-day warmup complete.",
              "Postiz connected to TikTok with API key stored in Hermes.",
              "First 7 days of images generated and loaded into Postiz.",
              "Android phone connected and verified with Hermes.",
              "First automated post cycle completed without shadowban."
            ]}
            prompts={[
              '"Hermes, audit our TikTok automation pipeline. Report what\'s connected, what\'s pending, and what\'s failing."',
              '"Postiz just gave me a 500 error when scheduling. Walk me through the 7 rules and show me which one we broke."'
            ]}
          />
        </div>

        {/* ===== SECTION 1: ANTI-SHADOWBAN ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A TikTok account you're willing to warm up.",
              "A clear understanding of why reach matters (not just posting)."
            ]}
          />
          <SectionMeta minutes="12 min" focus="Avoiding the banhammer" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. The Anti-Shadowban Protocol</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            99% of people who \"automate their TikTok\" get shadowbanned in week one. The reason is stupid simple: they post from the API. TikTok knows. TikTok punishes. This section is about making TikTok think a human is doing everything.
          </p>

          {/* Shadowban Risk Calculator */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-3">Shadowban Risk Calculator</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Pick the scenario that matches your situation. See your actual risk score.</p>
            <div className="space-y-2 mb-6">
              {scenarios.map((s, i) => (
                <button key={i} onClick={() => { setShadowbanScore(s.risk); setShadowbanScenario(i); }} className={`w-full text-left p-4 border-[2px] transition-all ${shadowbanScenario === i ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd] hover:border-[#111]'}`}>
                  <span className="font-mono text-lg mr-3">{s.icon}</span>
                  <span className="font-serif text-sm">{s.label}</span>
                  <span className="float-right font-mono text-xs font-bold ml-2">Risk: {s.risk}%</span>
                </button>
              ))}
            </div>
            <div className={`p-4 border-[2px] ${shadowbanScore < 20 ? 'border-[#22c55e] bg-[#f0fdf4]' : shadowbanScore < 60 ? 'border-[#f59e0b] bg-[#fffbeb]' : 'border-red-500 bg-red-50'}`}>
              <div className="font-mono text-xs font-bold uppercase mb-1">Your Risk Assessment</div>
              <div className="font-serif text-base font-bold">{shadowbanScore < 20 ? '🟢 LOW RISK — Post away, ghost.' : shadowbanScore < 60 ? '🟡 MEDIUM RISK — Fix the weak points below.' : '🔴 HIGH RISK — You will get shadowbanned. Fix this before posting.'}</div>
              <div className="mt-2 h-2 bg-[#ddd] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${shadowbanScore < 20 ? 'bg-[#22c55e]' : shadowbanScore < 60 ? 'bg-[#f59e0b]' : 'bg-red-500'}`} style={{ width: `${shadowbanScore}%` }}></div>
              </div>
              <p className="font-serif text-sm mt-2">{shadowbanResult.desc}</p>
            </div>
          </div>

          {/* Why API posting kills reach */}
          <div className="bg-[#111] border-[4px] border-red-500 p-8 text-[#eae7de] shadow-[8px_8px_0_0_#dc2626]">
            <h3 className="font-mono text-red-400 font-bold uppercase tracking-widest mb-4">Why Direct API Posting = Shadowban</h3>
            <p className="font-serif text-[#aaa] mb-4 leading-relaxed">
              When you post via the Postiz API directly to TikTok, TikTok sees the API signature in the request. It's not a person. It's a bot. TikTok's algorithm downgrades bot posts before they even reach the For You page.
            </p>
            <p className="font-serif text-[#aaa] leading-relaxed">
              <strong className="text-white">The Fix:</strong> Postiz sends your slideshow to <strong className="text-[#22c55e]">Drafts only</strong>. Your Android phone picks up the drafts and posts them natively — like a real human. TikTok sees a phone post. Reach stays alive.
            </p>
          </div>

          <CheckpointCard
            title="Shadowban Checkpoint"
            pass={[
              "You can explain why Android posting beats API direct-posting.",
              "Your warmup is done or in progress.",
              "You understand what shadowban looks like in practice."
            ]}
            fail={[
              "You're still planning to post directly from the Postiz API.",
              "Skipping warmup because you 'don't have time.'",
              "Can't explain the difference between Draft and Direct Post."
            ]}
          />
        </div>

        {/* ===== SECTION 2: THE STACK ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Nothing physical yet — this section is conceptual.",
              "Understanding that automation ≠ just hitting a button."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Stack — How the Ghost Moves</h2>

          {/* ASCII flow diagram */}
          <MacWindow title="80m_content_forge.arch" contentClass="bg-[#0d1117] p-6 font-mono text-sm text-[#22c55e]">
            <pre className="leading-tight">{`
  ┌──────────────────────────────────────────────┐
  │         THE 80M CONTENT FORGE                 │
  │         Your AI Agent (Hermes)               │
  └──────────────────┬───────────────────────────┘
                    │ "Generate 7 days of slideshow images"
                    ▼
  ┌──────────────────────────────────────────────┐
  │  Gemini API + Nano Banana 2                  │
  │  AI Image Generation                         │
  │  3 slides × 3 posts × 7 days = 63 images    │
  └──────────────────┬───────────────────────────┘
                    │ "Schedule all posts to DRAFTS"
                    ▼
  ┌──────────────────────────────────────────────┐
  │  Postiz.com ($29/mo)                         │
  │  Agentic Scheduler — Draft Mode             │
  │  Connected to: TikTok, Instagram, LinkedIn  │
  └──────────────────┬───────────────────────────┘
                    │ Draft lives in TikTok account
                    ▼
  ┌──────────────────────────────────────────────┐
  │  $50 Android Phone (Same WiFi as Server)    │
  │  Your agent controls it via ADB             │
  │  Picks up drafts, adds audio, posts natively │
  └──────────────────────────────────────────────┘
                    │ ✓ NATIVE POST = NO SHADOWBAN
                    ▼
              ┌───────────────┐
              │   TikTok      │
              │   For You     │
              │   Page: 🔥   │
              └───────────────┘`}</pre>
          </MacWindow>

          {/* Tool breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[
              { name: 'Hermes / OpenClaw', role: 'THE COORDINATOR', desc: 'The boss. Reads your brand rules from Fabric. Coordinates every step: image gen, Postiz scheduling, Android control. You talk to Hermes, Hermes talks to everything else.', icon: '🧠' },
              { name: 'Postiz.com', role: 'THE SCHEDULER', desc: '$29/mo and worth every penny. Agentic-first social media management. You connect it to TikTok once, give Hermes the API key, and never touch it again. It holds drafts, not posts — the Android does the posting.', icon: '📅' },
              { name: 'Gemini + Nano Banana 2', role: 'THE ARTIST', desc: 'AI image generation. Gemini creates the images, Nano Banana 2 refines them. You give it the 3-slide structure, it gives you batch-ready slideshow sets. No designers. No stock photos.', icon: '🎨' },
              { name: '$50 Android Phone', role: 'THE HUMAN-TOUCH', desc: 'The secret. A cheap Samsung on your WiFi. Hermes controls it via ADB. It picks up drafts from Postiz, adds audio (the step TikTok cares about), and posts natively. TikTok thinks a human is doing it. Because technically, a robot pretending to be a human is indistinguishable.', icon: '📱' },
            ].map((tool, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
                <div className="text-3xl mb-2">{tool.icon}</div>
                <span className="font-mono text-[#22c55e] text-xs font-bold uppercase">{tool.role}</span>
                <h4 className="font-sans font-black text-xl mt-1 mb-3">{tool.name}</h4>
                <p className="font-serif text-[#aaa] text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 3: POSTIZ SETUP ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A Postiz account (postiz.pro/ashen).",
              "TikTok connected to Postiz.",
              "Instagram + LinkedIn connected if you want cross-posting."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. Postiz Setup — Your Agent Gets the Keys</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Here's the thing about Postiz: it's not for you. It's for your agent. You set it up once. Then Hermes owns it. That's the whole point.
          </p>

          {/* Postiz Setup Simulator */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Postiz Setup Simulator</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Walk through each step. Green means done.</p>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Connect TikTok to Postiz', detail: 'Go to Postiz → Channels → Add TikTok → Scan QR code with your TikTok account', done: postizStep > 0 },
                { step: 2, label: 'Connect Instagram + LinkedIn (optional)', detail: 'Same process. Each channel can cross-post from the same drafts queue.', done: postizStep > 1 },
                { step: 3, label: 'Grab your API key', detail: 'Postiz → Settings → API Keys → Create new key. Copy it. You need this next.', done: postizStep > 2 },
                { step: 4, label: 'Store API key in Hermes', detail: 'Paste the key to your agent with the prompt below. This is the last manual step.', done: postizStep > 3 },
              ].map(({ step, label, detail, done }) => (
                <div key={step} className={`flex items-center gap-4 p-4 border-[2px] transition-all ${done ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 ${done ? 'bg-[#22c55e] text-white' : 'bg-[#ddd] text-[#555]'}`}>
                    {done ? '✓' : step}
                  </div>
                  <div className="flex-1">
                    <div className={`font-sans font-black text-sm ${done ? 'text-[#14532d]' : 'text-[#555]'}`}>{label}</div>
                    {!done && <div className="font-serif text-xs text-[#888] mt-0.5">{detail}</div>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setPostizStep(s => Math.min(s + 1, 4))} className="mt-4 font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#eae7de] border-[2px] hover:bg-[#22c55e] hover:text-[#111] transition-colors">
              {postizStep < 4 ? `Complete Step ${postizStep + 1}` : '✓ Setup Complete'}
            </button>
            {postizStep === 4 && (
              <div className="mt-4 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
                <p className="font-serif text-sm text-[#14532d] font-bold">Postiz is wired. Hermes has the API key. Now every post goes through drafts — never direct.</p>
              </div>
            )}
          </div>

          {/* Agent prompt MacWindow */}
          <MacWindow title="hermes_terminal" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`Here's your Postiz API key: ${postizApiKey || '[YOUR-KEY-HERE]'}
Store it in your memory for ${'`'}[Project Name]${'`'}.
Use this for all future post scheduling.
Rule: ALL posts go to DRAFTS only. Never direct publish.
Postiz manages: TikTok, Instagram, LinkedIn.
Schedule posts at these times: 9am, 12pm, 5pm EST.
Max 5 hashtags per post.
Caption max 1,000 characters.
Reply "Stored and ready" when done.`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Paste this to Hermes once you have your Postiz API key</p>
              <p className="text-[#eae7de]">hermes: Here's your Postiz API key:</p>
              <p className="text-[#38bdf8]">${postizApiKey || '[COPY-PASTE-YOUR-KEY-HERE]'}</p>
              <p className="text-[#eae7de]">hermes: Store it in memory. All posts → DRAFTS only.</p>
              <p className="text-[#aaa] italic">hermes: Stored and ready. What do you want to post first?</p>
            </div>
          </MacWindow>
          <div className="mt-2 p-3 border-[2px] border-[#111] bg-[#fdfaf6]">
            <p className="font-mono text-[10px] text-[#555] uppercase mb-1">Your API Key (paste in the terminal above)</p>
            <input value={postizApiKey} onChange={e => setPostizApiKey(e.target.value)} placeholder="postiz_live_xxxxxxxxxxxxxxx" className="w-full bg-transparent font-mono text-xs text-[#111] outline-none" />
          </div>
        </div>

        {/* ===== SECTION 4: GEMINI + NANO BANANA 2 ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A Gemini API key (ai.google.dev).",
              "Nano Banana 2 accessible (or substitute with Imagen 3 / DALL-E 3)."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Gemini + Nano Banana 2 — The Image Studio</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You don't need a designer. You need the right prompt. Gemini creates the base, Nano Banana 2 polishes it. Together they make slideshow images that look better than most creators are making manually.
          </p>

          {/* ImagePromptBuilder */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Image Prompt Builder</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Pick your niche. Get a ready-to-use 3-slide prompt set. Copy and paste to Hermes.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(nicheExamples).map(niche => (
                <button key={niche} onClick={() => setProductNiche(niche)} className={`font-mono text-xs font-bold px-4 py-2 border-[2px] transition-all ${productNiche === niche ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'border-[#ddd] hover:border-[#111]'}`}>
                  {niche.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { num: 'Slide 1 — THE HOOK', text: nicheExamples[productNiche]?.hook, color: 'bg-[#111] text-[#eae7de]' },
                { num: 'Slide 2 — THE INFO', text: nicheExamples[productNiche]?.info, color: 'bg-[#22c55e] text-[#111]' },
                { num: 'Slide 3 — THE CTA', text: nicheExamples[productNiche]?.cta, color: 'bg-white text-[#111] border border-[#ddd]' },
              ].map(({ num, text, color }) => (
                <div key={num} className={`p-4 ${color}`}>
                  <div className="font-mono text-[10px] font-bold uppercase mb-1 opacity-60">{num}</div>
                  <p className="font-serif text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#111] border-[2px] border-[#333]">
              <p className="font-mono text-[10px] text-[#aaa] uppercase mb-2">Full prompt for Hermes</p>
              <p className="font-mono text-xs text-[#22c55e] leading-relaxed">
                "Generate 3 images for a TikTok slideshow for [Product Name]. Slide 1 (Hook): {nicheExamples[productNiche]?.hook} Slide 2 (Info): {nicheExamples[productNiche]?.info} Slide 3 (CTA): {nicheExamples[productNiche]?.cta} Style: clean, high contrast, readable text overlays, vertical format 9:16."
              </p>
            </div>
          </div>

          {/* Before/After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-red-500 bg-red-50 p-6">
              <h4 className="font-sans font-black uppercase text-sm mb-3 text-red-700">Bad Prompt</h4>
              <div className="font-mono text-xs bg-white p-3 border mb-2">"make a nice tiktok image"</div>
              <p className="font-serif text-sm text-red-700">Result: Generic. No hook. No brand. Looks like every other AI image. Zero saves, zero shares.</p>
            </div>
            <div className="border-[3px] border-[#22c55e] bg-[#f0fdf4] p-6">
              <h4 className="font-sans font-black uppercase text-sm mb-3 text-[#14532d]">Boss Mode Prompt</h4>
              <div className="font-mono text-xs bg-white p-3 border mb-2">"Anime Quran verse, soft gradient background, minimal text overlay 'What does this verse really mean?', vertical 9:16, cinematic lighting"</div>
              <p className="font-serif text-sm text-[#14532d]">Result: Specific. On-brand. Looks intentional. Saves happen. Shares happen.</p>
            </div>
          </div>
        </div>

        {/* ===== SECTION 5: 3-SLIDE FORMULA ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Your product/app/service clearly defined.",
              "Gemini API connected to Hermes."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. The 3-Slide Formula — Hook, Info, CTA</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Every viral TikTok slideshow follows the same arc. Three slides. Three jobs. Get all three right and you have a machine for producing content that actually converts.
          </p>

          {/* SlideBuilder */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">3-Slide Workshop — Build Yours</h3>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-1">Slide 1 — The Hook (What + Why Care)</label>
                <textarea value={slideHook} onChange={e => setSlideHook(e.target.value)} placeholder="e.g. I deleted every productivity app from my phone. Here's what happened..." className="w-full border-[2px] border-[#111] p-3 font-serif text-sm h-20 resize-none focus:outline-none focus:border-[#22c55e]" />
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-1">Slide 2 — The Info (Main Point Expanded)</label>
                <textarea value={slideInfo} onChange={e => setSlideInfo(e.target.value)} placeholder="e.g. Week 1: Constant urge to check phone. Week 2: Mental clarity I forgot existed. Week 3: I got 3 new clients from cold emails I sent in the extra 2 hours..." className="w-full border-[2px] border-[#111] p-3 font-serif text-sm h-20 resize-none focus:outline-none focus:border-[#22c55e]" />
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-1">Slide 3 — The CTA (Emotion + Action)</label>
                <textarea value={slideCta} onChange={e => setSlideCta(e.target.value)} placeholder="e.g. If you want my exact 30-day phone detox protocol — it's linked in my bio. No fluff. Just the system." className="w-full border-[2px] border-[#111] p-3 font-serif text-sm h-20 resize-none focus:outline-none focus:border-[#22c55e]" />
              </div>
              {(slideHook || slideInfo || slideCta) && (
                <div className="p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
                  <p className="font-mono text-[10px] font-bold uppercase text-[#14532d] mb-2">Paste this to Hermes:</p>
                  <p className="font-mono text-xs text-[#111]">"Generate 3 TikTok slideshow images for [Product]. Slide 1: {slideHook || '[your hook]'}. Slide 2: {slideInfo || '[your info]'}. Slide 3: {slideCta || '[your CTA]'}. Vertical 9:16, clean design, readable text."</p>
                </div>
              )}
            </div>
          </div>

          {/* 3-slide anatomy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'THE HOOK', job: 'Stop the scroll. Make them curious or give them a result.', example: '"I saved $4,200 this year by canceling one subscription."', color: 'border-[#111] bg-[#111] text-[#eae7de]' },
              { num: '02', title: 'THE INFO', job: 'Give them the meat. The actual useful thing they bookmarked you for.', example: '"The Automatic Renewal Trick: Every January, your bank shows you all active subscriptions. Cancel the ones you forgot about."', color: 'border-[#22c55e] bg-[#22c55e] text-[#111]' },
              { num: '03', title: 'THE CTA', job: 'Tell them what to do next. Make it easy. Make it feel good.', example: '"Screenshots this. Set a calendar reminder for January. Your future self will mail you a thank-you note."', color: 'border-[#ddd] bg-white text-[#111]' },
            ].map((slide, i) => (
              <div key={i} className={`p-6 border-[3px] ${slide.color} shadow-[4px_4px_0_0_#111]`}>
                <div className="font-mono text-xs font-bold opacity-50 mb-2">Slide {slide.num}</div>
                <h4 className="font-sans font-black text-lg uppercase mb-3">{slide.title}</h4>
                <p className="font-serif text-sm leading-relaxed mb-4">{slide.job}</p>
                <div className="border-t border-current opacity-30 pt-3">
                  <p className="font-mono text-[10px] italic">{slide.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 6: BUILDING THE STOCKPILE ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Hermes running with Gemini connected.",
              "Postiz connected with API key stored.",
              "Your 3-slide formula defined."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Building the Stockpile</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Don't generate one post at a time. Generate in batches. One week of content in a single session. Your agent does the work, you review it in 10 minutes. Then you have a month of posts ready to run on autopilot.
          </p>

          {/* StockpileBuilder */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Stockpile Calculator</h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-2">Days of content</label>
                <input type="range" min="3" max="30" value={stockpileDays} onChange={e => setStockpileDays(parseInt(e.target.value))} className="w-full accent-[#22c55e]" />
                <div className="font-mono text-xs text-center mt-1">{stockpileDays} days</div>
              </div>
              <div>
                <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-2">Posts per day</label>
                <input type="range" min="1" max="5" value={stockpilePosts} onChange={e => setStockpilePosts(parseInt(e.target.value))} className="w-full accent-[#22c55e]" />
                <div className="font-mono text-xs text-center mt-1">{stockpilePosts} posts/day</div>
              </div>
            </div>
            <div className="bg-[#111] p-6 text-[#eae7de]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-sans font-black text-4xl text-[#22c55e]">{stockpileDays * stockpilePosts}</div>
                  <div className="font-mono text-xs text-[#aaa] uppercase mt-1">Total Posts</div>
                </div>
                <div>
                  <div className="font-sans font-black text-4xl text-[#22c55e]">{stockpileDays * stockpilePosts * 3}</div>
                  <div className="font-mono text-xs text-[#aaa] uppercase mt-1">Total Images</div>
                </div>
                <div>
                  <div className="font-sans font-black text-4xl text-[#22c55e]">{stockpileDays * stockpilePosts * 3 * 3}</div>
                  <div className="font-mono text-xs text-[#aaa] uppercase mt-1">Total Slides</div>
                </div>
              </div>
              <div className="mt-4 border-t border-[#333] pt-4 text-center">
                <p className="font-serif text-[#aaa] text-sm">One batch session = <span className="text-[#22c55e] font-bold">{stockpileDays * stockpilePosts * 3}</span> images generated</p>
                <p className="font-serif text-[#555] text-xs mt-1">Time investment: ~45 minutes with Hermes. Then it's autopilot.</p>
              </div>
            </div>
          </div>

          <MacWindow title="hermes_terminal" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`Batch generate ${stockpileDays} days of TikTok slideshow images.
${stockpilePosts} posts/day × 3 slides = ${stockpileDays * stockpilePosts * 3} images total.
For each day: generate a unique angle, hook, and CTA.
All images: vertical 9:16, clean design, text overlays readable.
Save to /stockpile/[date]/slide1.png, slide2.png, slide3.png.
Name the files by post date.
Reply with a summary of what was generated.`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Give this to Hermes to kick off the stockpile session</p>
              <p className="text-[#eae7de]">hermes: Generate a {stockpileDays}-day content stockpile.</p>
              <p className="text-[#aaa]">→ {stockpilePosts} posts/day × 3 slides = {stockpileDays * stockpilePosts * 3} images</p>
              <p className="text-[#aaa]">→ Each day gets a unique angle</p>
              <p className="text-[#aaa]">→ Vertical 9:16, clean design</p>
              <p className="text-[#aaa] italic">hermes: Started. Generating day 1 of {stockpileDays}...</p>
            </div>
          </MacWindow>
        </div>

        {/* ===== SECTION 7: POSTIZ 7 RULES ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "At least one set of images ready to post.",
              "Postiz connected with TikTok."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. Postiz 7 Rules — Don't Get Banned</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            These aren't suggestions. These are the laws. Break one and your account gets flagged. Follow all seven and your automation runs forever, quietly, like a ghost.
          </p>

          {/* PostizRulesChecker */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-black uppercase text-sm">Postiz Rules Checklist</h3>
              <div className={`font-mono text-lg font-black ${ruleScore === 7 ? 'text-[#22c55e]' : 'text-[#555]'}`}>{ruleScore}/7</div>
            </div>
            <div className="space-y-2">
              {ruleLabels.map((label, i) => (
                <button key={i} onClick={() => handleRuleToggle(i)} className={`w-full flex items-center gap-3 p-3 border-[2px] transition-all text-left ${ruleChecked[i] ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd] hover:border-[#111]'}`}>
                  <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${ruleChecked[i] ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#aaa]'}`}>
                    {ruleChecked[i] && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                  <span className={`font-serif text-sm ${ruleChecked[i] ? 'text-[#14532d] font-bold' : 'text-[#555]'}`}>{label}</span>
                </button>
              ))}
            </div>
            {ruleScore < 7 && (
              <div className="mt-4 p-3 bg-[#fffbeb] border-[2px] border-[#f59e0b]">
                <p className="font-serif text-sm text-[#92400e]">⚠ {7 - ruleScore} rule{7 - ruleScore > 1 ? 's' : ''} not configured. Your agent will need these reminders before posting.</p>
              </div>
            )}
            {ruleScore === 7 && (
              <div className="mt-4 p-3 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
                <p className="font-serif text-sm text-[#14532d] font-bold">✓ All rules configured. Your automation is clean.</p>
              </div>
            )}
          </div>

          <MacWindow title="postiz_rules.md" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`POSTIZ SCHEDULING RULES — [PROJECT NAME]
1. All posts → DRAFTS only. Never direct publish.
2. Audio = None. We add audio manually on the phone.
3. Max 5 hashtags per post. Use only niche-relevant tags.
4. Caption max 1,000 characters. Be concise.
5. Schedule at posted times: 9am EST, 12pm EST, 5pm EST.
6. Each post must have exactly 3 image attachments.
7. Each post must have a unique title based on the content.
REVISION DATE: [TODAY]`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Store this file in your OpenClaw workspace</p>
              <p className="text-[#eae7de]">📁 /skills/postiz-rules.md</p>
              {ruleLabels.map((label, i) => (
                <p key={i} className="text-[#22c55e]">{i+1}. {label}</p>
              ))}
            </div>
          </MacWindow>
        </div>

        {/* ===== SECTION 8: THE SECRET ANDROID ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A $50 Samsung Android on the same WiFi as your server.",
              "Postiz with drafts loaded."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Secret Android — The Human Layer</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            This is the part nobody talks about. Every post scheduler in the world tells you to connect the API. Then you get shadowbanned. The 80m approach is different: you buy a cheap Android, your agent controls it over WiFi, and it posts like a human would. TikTok never knows.
          </p>

          {/* AndroidSetupSimulator */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Android Setup Simulator</h3>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Buy a $50 Samsung Android', detail: 'Galaxy A-series or equivalent. New, not used. You need a fresh TikTok install.', done: androidStep > 0 },
                { step: 2, label: 'Install TikTok on the Android', detail: 'Create a new TikTok account or log into your existing one. This is the account that runs on the phone.', done: androidStep > 1 },
                { step: 3, label: 'Connect to same WiFi as your server', detail: 'The Android and your OpenClaw server must be on the same network. Write down the IP address.', done: androidStep > 2 },
                { step: 4, label: 'Enable Developer Options + USB Debugging', detail: 'Settings → About Phone → Tap Build Number 7 times. Then Settings → Developer Options → Enable USB Debugging.', done: androidStep > 3 },
                { step: 5, label: 'Connect Hermes via ADB over WiFi', detail: 'Run: adb connect [phone-ip]:5555. Verify connection: adb devices', done: androidStep > 4 },
                { step: 6, label: 'Verify with test command', detail: 'hermes: check if Android is connected and responsive.', done: androidStep > 5 },
              ].map(({ step, label, detail, done }) => (
                <div key={step} className={`flex items-center gap-4 p-4 border-[2px] transition-all ${done ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 ${done ? 'bg-[#22c55e] text-white' : 'bg-[#ddd] text-[#555]'}`}>
                    {done ? '✓' : step}
                  </div>
                  <div className="flex-1">
                    <div className={`font-sans font-black text-sm ${done ? 'text-[#14532d]' : 'text-[#555]'}`}>{label}</div>
                    {!done && <div className="font-serif text-xs text-[#888] mt-0.5">{detail}</div>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setAndroidStep(s => Math.min(s + 1, 6))} className="mt-4 font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#eae7de] border-[2px] hover:bg-[#22c55e] hover:text-[#111] transition-colors">
              {androidStep < 6 ? `Complete Step ${androidStep + 1}` : '✓ Android Connected'}
            </button>
          </div>

          <MacWindow title="hermes_terminal" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`# Step 1: Find your Android's IP
hermes: what is the IP address of the Android phone on our network?

# Step 2: Connect via ADB
adb connect 192.168.1.104:5555

# Step 3: Verify
adb devices
# Output: 192.168.1.104:5555    device

# Step 4: Verify Hermes can see it
hermes: run 'adb devices' and report what phones are connected.`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Run these on your OpenClaw server terminal</p>
              <p className="text-[#38bdf8]">hermes: Find Android IP on our network</p>
              <p className="text-[#aaa] italic">hermes: Android found at 192.168.1.104</p>
              <p className="text-[#eae7de]">$ adb connect 192.168.1.104:5555</p>
              <p className="text-[#aaa]">connected to 192.168.1.104:5555</p>
              <p className="text-[#aaa] italic">hermes: Android connected. Ready to receive commands.</p>
            </div>
          </MacWindow>
        </div>

        {/* ===== SECTION 9: CRON AUTOMATION ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Android connected and verified.",
              "Postiz stocked with at least one week of drafts.",
              "Stockpile generation skill file saved."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. Cron Automation — The Ghost Runs on Its Own</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Three cron jobs. That's the whole automation. One monitors Postiz drafts and posts them. One generates new stockpile monthly. One audits the system weekly. Set these once, and your content machine runs while you do actual work.
          </p>

          {/* CronBuilder */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Cron Expression Builder</h3>
            <div className="mb-6">
              <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-2">Your posting times (EST)</label>
              <div className="flex flex-wrap gap-3">
                {['08:00','09:00','10:00','12:00','14:00','17:00','18:00','20:00'].map(time => (
                  <button key={time} onClick={() => setCronTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : prev.length < 4 ? [...prev, time] : prev)} className={`font-mono text-xs font-bold px-3 py-2 border-[2px] transition-all ${cronTimes.includes(time) ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'border-[#ddd] hover:border-[#111]'}`}>
                    {time} EST
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] space-y-2">
              <div>
                <div className="text-[#aaa] uppercase mb-1">// Draft → Phone Posting Cron</div>
                <div className="text-[#eae7de]">
                  {cronTimes.map((t, i) => `0 ${parseInt(t)} * * *`).join('\n')}
                </div>
                <div className="text-[#aaa] mt-1">→ Run Android posting check at {cronTimes.join(', ')} EST daily</div>
              </div>
              <div>
                <div className="text-[#aaa] uppercase mb-1">// Monthly Stockpile Refresh</div>
                <div className="text-[#eae7de]">0 9 1 * *</div>
                <div className="text-[#aaa] mt-1">→ 9am on the 1st of every month: generate next month's stockpile</div>
              </div>
              <div>
                <div className="text-[#aaa] uppercase mb-1">// Weekly System Audit</div>
                <div className="text-[#eae7de]">0 10 * * 1</div>
                <div className="text-[#aaa] mt-1">→ Every Monday 10am: audit Postiz, Android, stockpile status</div>
              </div>
            </div>
          </div>

          <MacWindow title="hermes_terminal" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`hermes: Set up the following cron jobs:

1. Daily at ${cronTimes[0] || '09:00'} EST: Check Postiz for new drafts. 
   If drafts exist, push to Android for native posting.

2. Monthly on the 1st at 9am: Generate a ${stockpileDays}-day 
   content stockpile and load into Postiz.

3. Weekly every Monday at 10am: Audit the TikTok automation 
   pipeline. Report: posts published, engagement, failures.

Reply with the crontab entries when done.`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Give this to Hermes to wire the automation</p>
              <p className="text-[#eae7de]">hermes: Set up our TikTok cron jobs.</p>
              <p className="text-[#aaa] italic">hermes: Configuring 3 cron jobs now...</p>
              <p className="text-[#aaa]">✓ Draft check: {cronTimes[0] || '09:00'} EST daily</p>
              <p className="text-[#aaa]">✓ Monthly stockpile: 1st of month, 9am</p>
              <p className="text-[#aaa]">✓ Weekly audit: Monday 10am</p>
              <p className="text-[#22c55e]">hermes: All cron jobs active. The ghost is running.</p>
            </div>
          </MacWindow>
        </div>

        {/* ===== SECTION 10: DICTIONARY ===== */}
        <div className="mb-24" id="c4-dictionary">
          <NeedBox
            title="What you need before you start"
            items={[
              "A text editor open.",
              "Two minutes and a willingness to learn what words mean."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. The Dumb-Proof Dictionary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { term: 'Shadowban', def: 'TikTok silently hiding your content from For You pages without telling you. Your account looks normal to you, but nobody new sees your posts.' },
              { term: 'Nano Banana 2', def: 'Google Gemini\'s image generation model. Free tier available. Used for creating slideshow images at scale.' },
              { term: 'Postiz API', def: 'Postiz\'s developer key that lets your agent (Hermes) schedule posts, manage drafts, and control the queue without touching the UI.' },
              { term: 'ADB (Android Debug Bridge)', def: 'A command-line tool that lets your server talk to the Android phone over WiFi. This is how Hermes controls the physical phone.' },
              { term: 'Slideshow Marketing', def: 'TikTok video format using static images with text overlays that auto-advance. Easiest format to automate — no video editing required.' },
              { term: 'UGC', def: 'User Generated Content. The type of content real users create. AI-generated slideshows mimicking UGC perform well because they look authentic.' },
              { term: 'Reel.Farm', def: 'The team that pioneered TikTok slideshow automation at scale. Their posts hit 5.6M+ views. The system we\'re copying uses their approach.' },
              { term: 'Warmup Protocol', def: '3-day process of behaving like a human on TikTok before posting — scrolling, liking, commenting. Required to avoid shadowban.' },
              { term: 'Stockpile', def: 'A batch of pre-generated slideshow images sitting in Postiz, ready to be posted. One stockpile session = one month of content.' },
              { term: 'Draft Mode', def: 'Postiz setting that sends posts to your TikTok DRAFTS folder instead of publishing directly. Required for Android-native posting.' },
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-5 shadow-[4px_4px_0_0_#111]">
                <h4 className="font-sans font-black text-lg uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#aaa] text-sm leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 11: RESOURCE LOCKER ===== */}
        <div className="mb-24" id="c4-resources">
          <NeedBox
            title="What you need before you start"
            items={[
              "Everything in this class is free or already purchased.",
              "The tools you need are listed below."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">11. Resource Locker — Everything You Need</h2>

          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <ul className="space-y-4 font-serif text-base">
              <li>
                <a className="underline underline-offset-4 font-black" href="https://postiz.pro/ashen" target="_blank" rel="noreferrer">Postiz.com (ashen's ref)</a>
                <span className="text-[#555]"> — $29/mo agentic social scheduler. Use ashen's ref: postiz.pro/ashen</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://ai.google.dev" target="_blank" rel="noreferrer">Google AI Studio (Gemini API)</a>
                <span className="text-[#555]"> — Free tier available. Get your API key here.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://www.android.com/samsung" target="_blank" rel="noreferrer">Samsung Galaxy A-Series ($50-80)</a>
                <span className="text-[#555]"> — The $50 Android for posting. Galaxy A15 or A25 recommended.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://developer.android.com/tools/adb" target="_blank" rel="noreferrer">Android ADB Documentation</a>
                <span className="text-[#555]"> — How to connect your Android to your server over WiFi.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://reelfarm.gg" target="_blank" rel="noreferrer">Reel.Farm</a>
                <span className="text-[#555]"> — The AI UGC integration for Postiz. Mixed with your slideshow images.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://crontab.guru" target="_blank" rel="noreferrer">Crontab Guru</a>
                <span className="text-[#555]"> — Translate cron expressions into plain English.</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Skill File Template</p>
              <p className="font-serif text-xs text-[#aaa] mb-2">Save this as <code className="bg-white px-1 font-mono">/skills/tiktok-slideshow.SKILL.md</code> in your OpenClaw workspace:</p>
              <pre className="bg-[#111] text-[#22c55e] p-3 font-mono text-xs overflow-x-auto">{`# TikTok Slideshow Automation Skill

## Purpose
Generate and schedule TikTok slideshow content automatically.

## Stack
- Gemini API + Nano Banana 2 for image generation
- Postiz for scheduling (DRAFTS only)
- $50 Android for native posting

## 3-Slide Formula
Slide 1 (Hook): [specific result or curiosity gap]
Slide 2 (Info): [the actual useful content]
Slide 3 (CTA): [emotional pull + clear action]

## Rules
1. All posts → Postiz DRAFTS only
2. Max 5 hashtags
3. Caption < 1,000 characters
4. Audio = None (add on phone)
5. Schedule: 9am, 12pm, 5pm EST
6. Always run warmup protocol first`}</pre>
            </div>

            <div className="mt-6 p-4 bg-[#fffbeb] border-[2px] border-[#f59e0b]">
              <p className="font-sans font-black text-sm uppercase mb-2">Rescue Prompts</p>
              <ul className="font-mono text-xs text-[#aaa] space-y-2">
                <li>"Hermes, audit our TikTok pipeline. What's connected, what's stocked, what's due for refresh?"</li>
                <li>"Postiz gave me a 500 error. Walk through the 7 rules and tell me which one we broke."</li>
                <li>"Android isn't responding to ADB. Walk me through the troubleshooting checklist."</li>
                <li>"Our posts got 0 views. Check warmup status, posting method, and shadowban signals."</li>
              </ul>
            </div>
          </div>
        </div>

        {/* QUIZ MODAL */}
        {quizActive && quizSection !== null && (() => {
          const qData = quizDataC04.find(q => q.section === quizSection);
          if (!qData) return null;
          return (
            <QuizModal
              isOpen={quizActive}
              questions={qData.questions}
              courseLabel="C04"
              section={quizSection}
              onComplete={(score, passed) => {
                setQuizDone({ score, passed });
                if (passed) {
                  setPassedQuizzes(prev => {
                    const next = [...new Set([...prev, quizSection])];
                    localStorage.setItem('80m-c4-quizzes', JSON.stringify(next));
                    return next;
                  });
                }
              }}
            />
          );
        })()}

        {/* Quiz trigger buttons */}
        <div className="mb-24 border-[3px] border-[#111] bg-white p-8 shadow-[8px_8px_0_0_#111]">
          <h3 className="font-sans font-black uppercase text-sm mb-4">Section Quizzes — Class 04</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[{s:1,l:'Anti-Shadowban'},{s:2,l:'The Stack'},{s:3,l:'Postiz Setup'},{s:4,l:'Image Gen'},{s:5,l:'3-Slide Formula'}].map(({s,l}) => (
              <button key={s} onClick={() => { setQuizSection(s); setQuizActive(true); }} className="font-mono text-xs font-bold uppercase px-4 py-3 bg-[#111] text-[#eae7de] border-[2px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] transition-colors">
                Quiz {s}: {l}
                {passedQuizzes.includes(s) && <span className="ml-1 text-[#22c55e]">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* CLASS 04 COMPLETE */}
        <div className="border-[4px] border-[#22c55e] bg-[#f0fdf4] p-10 shadow-[12px_12px_0_0_#111] mb-12">
          <div className="text-center">
            <div className="font-mono text-6xl mb-4">👻</div>
            <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 04 Complete.</h2>
            <p className="font-serif text-xl text-[#aaa] mb-8 leading-relaxed">
              You just built a fully autonomous TikTok content machine. Your agent generates the images. Postiz schedules the drafts. Your Android posts natively. And you — you sleep while TikTok works for you.
            </p>
            <div className="inline-grid grid-cols-2 gap-4 text-left mb-8">
              {[
                'Postiz API key stored in Hermes',
                'Gemini image generation pipeline tested',
                'First stockpile generated and loaded',
                'Android connected and verified',
                '3 cron jobs active',
                'Skill file saved in workspace',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-serif text-sm text-[#14532d]">
                  <span className="text-[#22c55e] font-black">✓</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="font-mono text-xs text-[#555] uppercase">What's next?</p>
              <a href="https://discord.gg/80m" target="_blank" rel="noreferrer" className="inline-block font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] hover:bg-[#22c55e] hover:text-[#111] transition-all mr-4">Join the Discord</a>
              <button onClick={onClose} className="font-sans font-black text-lg uppercase px-8 py-4 bg-white text-[#111] border-[3px] border-[#111] hover:border-[#22c55e] shadow-[6px_6px_0_0_#111] hover:-translate-y-1 transition-all">
                Exit to Curriculum →
              </button>
            </div>
          </div>
        </div>

      </div>
      </div>
      <AtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

// ===== quizDataC07 =====
const quizDataC07 = [
  {
    section: 1,
    questions: [
      { q: "Which agent in the 80m system is best suited for financial tracking and budget management?", options: ["Prawnius (o1)", "Sir Clawthchilds (o2)", "Claudnelius (o3)", "Knaight of Affairs (o5)"], correct: 1, explanation: "Sir Clawthchilds (o2) handles finances, budgets, and money-related tasks. Use Prawnius for quick one-offs, Sir Clawthchilds for money talk." },
      { q: "What does the Agent Council in 80m actually do?", options: ["It lets all 7 agents respond to every message simultaneously", "It lets you delegate specific task types to specialized agents, each optimized for their domain", "It automatically posts to TikTok", "It runs your cron jobs"], correct: 1, explanation: "The Agent Council is your specialized workforce. Each agent (Prawnius, Sir Clawthchilds, Claudnelius, etc.) handles their lane. Hermes delegates to the right one." },
      { q: "You need help writing Python code. Which agent should you route this to?", options: ["Labrina (o6) — social media agent", "Claudnelius (o3) — code and tech agent", "Knowledge Knaight (o4) — memory and facts", "Prawnius (o1) — quick tasks"], correct: 1, explanation: "Claudnelius (o3) is the code and tech specialist. It's optimized for programming, design, and technical problem-solving. Claudnelius has the tools and context for development work." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What is a 'Memory Dump' and when should you use it?", options: ["Deleting old conversations from Hermes", "Pasting all your disorganized thoughts and context into Hermes so it can organize and remember everything", "Exporting your memory to a text file", "Setting up encrypted memory storage"], correct: 1, explanation: "The Memory Dump is your 'dump everything in' move. Paste everything you want Hermes to know — your situation, goals, blockers, preferences — and let Hermes organize it. Think of it as the 'set it and forget it' of context setting." },
      { q: "What does 'chain-of-thought prompting' mean in plain English?", options: ["Asking Hermes to write chains on social media", "Telling Hermes to think step-by-step before answering, which produces more accurate and reasoned responses", "Linking multiple conversations together", "Creating a chain of agents that pass tasks between each other"], correct: 1, explanation: "Chain-of-thought means adding 'think step by step' or 'reason through this before answering' to your prompt. It forces Hermes to show its work, catching errors and producing better reasoning." },
      { q: "What makes 'Boss Mode' prompting different from vague prompting?", options: ["Boss Mode means typing in all caps", "Boss Mode gives specific, directive instructions with clear outcomes — you get results instead of suggestions", "Boss Mode requires a special API key", "Boss Mode is only for Pro tier users"], correct: 1, explanation: "Boss Mode isn't a feature — it's a tone. Instead of 'can you maybe help me with my budget?' you say 'Here are my income sources. Here are my expenses. Give me a monthly budget breakdown and tell me what to cut.' Specific input, specific output." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is Fabric in the 80m system?", options: ["A code framework for building apps", "The long-term memory layer — every conversation, decision, and context is stored in SQLite for persistent recall", "A type of agent specialized in research", "A webhook integration service"], correct: 1, explanation: "Fabric is the memory backbone. When you say 'save this to memory,' it goes into Fabric. Every session, every decision, every context gets stored in SQLite. Next conversation, Hermes already knows you." },
      { q: "How does memory work in the 80m system when you start a new session?", options: ["Memory is wiped every session", "Fabric stores long-term context in SQLite, so Hermes retains your profile, goals, and history across sessions", "You have to re-enter your name every time", "Memory only works on Pro tier"], correct: 1, explanation: "Fabric ensures continuity. Your name, your goals, your preferences — all stored in SQLite. Start a new session, Hermes says 'Hey Mike, welcome back. Last time we talked about your plumbing business. Where'd we leave off?'" },
      { q: "What does the mcp_memory tool actually do?", options: ["It deletes old memories", "It stores and retrieves context — surfacing relevant memories from past sessions when you need them", "It encrypts your conversations", "It syncs with Google Calendar"], correct: 1, explanation: "mcp_memory is the memory access tool. It handles storing new context, retrieving relevant memories, and surfacing them at the right time. When you say 'remember this,' mcp_memory handles it." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is a Skill in the 80m system?", options: ["A personality trait of an agent", "A reusable workflow or tool package you can install to extend what Hermes can do", "A scheduling template", "A type of cron job"], correct: 1, explanation: "Skills are like browser extensions for Hermes. They add capabilities — Notion sync, Stripe billing, YouTube pipeline. You install a skill, Hermes gains a new ability. Browse available skills and pick what you need." },
      { q: "How do you install a new skill in 80m?", options: ["Download a file from the internet and upload it", "Ask Hermes to install it and walk through the setup — 'I want to install the notion skill'", "Use the Skill Store app on your phone", "Skills come pre-installed and can't be added"], correct: 1, explanation: "Skills install through conversation. Tell Hermes 'I want to install the [skill name] skill' and it walks you through setup. Most skills just need an API key and a brief. No downloading, no coding." },
      { q: "Which skill would you install if you wanted Hermes to automatically summarize YouTube videos?", options: ["stripe-80m", "youtube-content", "obsidian", "cortex"], correct: 1, explanation: "The youtube-content skill handles YouTube workflows — transcripts, summaries, spark pipelines. Give it a URL, get a summary, thread, or content repurposed. Perfect for research automation." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is a cron job in the 80m system?", options: ["A type of agent that codes for you", "A scheduled task that runs automatically at specific times — ghost workers that run while you sleep", "An emergency button for when Hermes stops responding", "A way to backup your memory to the cloud"], correct: 1, explanation: "Cron jobs are your ghost workers. Set them up once — 'every day at 9am, send me a morning brief' — and they run on schedule forever. You set it, you forget it, you get results. That's the whole idea." },
      { q: "You want Hermes to send you a morning brief every weekday at 8am. What cron expression do you need?", options: ["*/5 * * * * (every 5 minutes)", "0 8 * * 1-5 (8:00 AM, Monday through Friday)", "0 0 1 * * (midnight on the 1st of every month)", "30 21 * * * (8:30 PM every day)"], correct: 1, explanation: "The cron expression '0 8 * * 1-5' means: at minute 0, hour 8, every day, every month, Monday(1) through Friday(5). That's your weekday morning at 8am. Cron syntax is: minute | hour | day | month | weekday." },
      { q: "Which of these is the best use case for a cron job in 80m?", options: ["Asking Hermes a one-off question", "Generating a weekly summary every Friday at 4pm — something you want to happen regularly without manually triggering it", "Fixing a broken memory", "Uploading a single file"], correct: 1, explanation: "Cron jobs are for recurring, predictable, automated tasks. Weekly wrap-ups, daily briefs, monthly finance audits — things that happen on a schedule and don't need your input each time. One-off tasks are for direct Hermes messages." },
    ]
  },
];


// ===== quizDataC04 =====
const quizDataC04 = [
  {
    section: 1,
    questions: [
      { q: "Why does posting directly from the Postiz API get your TikTok account shadowbanned?", options: ["TikTok blocks all third-party apps", "TikTok detects the API signature and treats it as bot activity, which destroys reach", "Postiz has a bug that posts to the wrong account", "TikTok doesn't allow any automation"], correct: 1, explanation: "TikTok flags accounts that post via API signature because it's a telltale bot pattern. The fix is Draft Mode + Android posting — TikTok sees a phone post and treats it as organic human activity." },
      { q: "What is the warmup protocol and why does it matter?", options: ["Logging into TikTok on your phone 3 times", "A 3-day process of behaving like a human on TikTok before posting — scrolling, liking, commenting, and posting soft content — so TikTok's algorithm identifies you as a real person", "Charging your Android phone to full before first use", "Installing TikTok on a fresh Android before posting"], correct: 1, explanation: "TikTok's algorithm profiles new accounts. Without warmup, automated posts look suspicious. With 3 days of human behavior, your account has legitimacy signals before the automation kicks in." },
      { q: "What is the Shadowban Risk Calculator checking for?", options: ["How many followers you have", "Whether your warmup is complete, what posting method you use (API vs Android), and your account age — all of which affect whether TikTok flags your content", "Your content quality score", "How many hashtags you're using"], correct: 1, explanation: "Shadowban risk is a combination of account age, warmup status, and posting method. New accounts posting via API = highest risk. Aged accounts posting via Android after full warmup = lowest risk." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "In the 80m Content Forge stack, what role does the Android phone play?", options: ["A backup for when Postiz is down", "The human-touch layer — Hermes controls it to post natively so TikTok thinks a real person is posting", "A WiFi hotspot for the server", "A way to monitor TikTok analytics"], correct: 1, explanation: "The Android is the secret. Postiz sends to Drafts, Hermes picks them up via ADB, the phone posts natively. TikTok's algorithm sees phone-based posting and treats it as organic. No Android = no shadowban-free automation." },
      { q: "What does Hermes coordinate in the Content Forge pipeline?", options: ["Only image generation", "Everything — image generation via Gemini, Postiz scheduling via API, and Android control via ADB", "Only posting to TikTok", "Only storing API keys"], correct: 1, explanation: "Hermes is the foreman. It takes your content brief, sends it to Gemini for image generation, loads drafts into Postiz, and coordinates the Android to pick them up and post. You're the client, Hermes is the operator." },
      { q: "Why is Postiz described as 'for your agent, not for you'?", options: ["Postiz is broken on mobile", "Once you connect TikTok and give Hermes the API key, you never touch Postiz again — Hermes manages the entire queue", "Postiz only works on servers", "Postiz requires a coding degree to use"], correct: 1, explanation: "The one-time Postiz setup is: connect TikTok, grab API key, give key to Hermes. After that, Hermes owns the queue. You only touch Postiz if something breaks." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is Draft Mode in Postiz?", options: ["A feature that saves your post as a draft in Postiz's database", "A setting that sends posts to your TikTok Drafts folder instead of publishing directly — required for Android-native posting", "A way to preview posts before scheduling", "A backup system for failed posts"], correct: 1, explanation: "Draft Mode is what makes the Android step work. Posts go to your TikTok account's native Drafts folder. The Android picks them up from there, adds audio, and posts. No Draft Mode = Hermes posts directly = shadowban." },
      { q: "What information do you need to give Hermes to activate Postiz?", options: ["Your TikTok username and password", "Your Postiz API key, plus the 7 posting rules", "Your credit card number", "Nothing — Hermes already knows how to use Postiz"], correct: 1, explanation: "Hermes needs your Postiz API key to authenticate, plus the 7 rules to ensure posts go to Drafts only with the right settings. The API key is found in Postiz → Settings → API Keys." },
      { q: "What is the correct sequence of Postiz setup steps?", options: ["Generate API key → Connect TikTok → Give to Hermes", "Connect TikTok → Grab API key → Store in Hermes with rules", "Create Postiz account → Post immediately → Add TikTok later", "Install Postiz app → Login → Done"], correct: 1, explanation: "The right order: (1) Connect TikTok to Postiz, (2) Grab the API key from Settings, (3) Give the key to Hermes along with all 7 rules. Skip step 1 and there's nothing to automate." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is Nano Banana 2 and why does it matter for slideshow marketing?", options: ["A TikTok feature for slideshow creation", "Google Gemini's image generation model — used to create professional slideshow images at scale without designers", "A Samsung phone model", "A Postiz plugin"], correct: 1, explanation: "Nano Banana 2 is Google Gemini's image gen model. You give it a text prompt, it produces an image. Combined with the 3-slide structure, you can generate hundreds of professional slideshow sets without a design team." },
      { q: "Why does a vague prompt like 'make a nice TikTok image' produce bad results?", options: ["Gemini is broken", "Vague prompts give the AI no specific direction — no subject, style, mood, or format. The output matches the input: generic.", "TikTok has image restrictions", "Nano Banana 2 requires coding to use"], correct: 1, explanation: "AI image gen is only as good as your prompt. 'Nice TikTok image' = random output. 'Anime Quran verse, soft gradient background, minimal text overlay, vertical 9:16, cinematic lighting' = exactly what you wanted." },
      { q: "How many images do you need for one day of TikTok slideshow content?", options: ["1 image", "3 images (one per slide)", "9 images (3 slides × 3 posts)", "As many as you feel like"], correct: 1, explanation: "One TikTok slideshow post = 3 images (hook, info, CTA). One day of content at 3 posts/day = 9 images. The stockpile calculator shows you exactly how many you need for any batch size." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is the job of Slide 1 (The Hook) in the 3-slide formula?", options: ["Give all the information at once", "Stop the scroll — make the viewer curious or promise a tangible result in the first 2 seconds", "Show your brand logo", "Introduce yourself as the creator"], correct: 1, explanation: "The Hook's one job: stop the scroll. If they keep swiping, nothing else matters. Good hooks lead with a result, a controversy, or a curiosity gap. Bad hooks explain context first." },
      { q: "What makes the 3-slide formula effective for slideshow marketing?", options: ["It uses video instead of images", "It has a clear structure that guides the viewer from curiosity → value → action, which matches how TikTok's algorithm rewards completion rate", "It posts automatically", "It uses more hashtags"], correct: 1, explanation: "TikTok's algorithm measures completion rate. The 3-slide formula maximizes completion: Hook gets them to watch, Info keeps them engaged, CTA drives the save/share. High completion rate = more For You distribution." },
      { q: "Why is 'emotional pull' important for Slide 3 (The CTA)?", options: ["It makes the post longer", "It triggers a behavioral response — saves, shares, and comments — which are the signals TikTok uses to amplify content beyond your followers", "It adds more hashtags", "It prevents shadowban"], correct: 1, explanation: "The CTA isn't just telling them what to do — it's making them feel something while doing it. 'Screenshots this' = implied value. 'DM me your results' = engagement. The emotion drives the action, and the action drives the algorithm." },
    ]
  },
];


// --- Course Content Pages ---

const CourseOneContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const [subMonths, setSubMonths] = useState(1);
  const [errorVisible, setErrorVisible] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('80m-c1-quizzes') || '[]'); } catch { return []; }
  });

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
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete · {passedQuizzes.length}/5 quizzes passed</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => {
              const sectionNum = parseInt(s.id.replace('s', ''));
              const hasQuiz = sectionNum >= 1 && sectionNum <= 5;
              const isPassed = passedQuizzes.includes(sectionNum);
              const isDone = completedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${isDone ? 'text-[#22c55e]' : 'text-[#555]'}`}
                >
                  <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                    {isDone ? (
                      <span className="block w-2 h-2 bg-current"></span>
                    ) : hasQuiz && !isPassed ? (
                      <span className="text-[8px]">🔒</span>
                    ) : null}
                  </span>
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
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
          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
            Welcome to Class 01. The biggest barrier to AI is "Installation Hell." Most people download a file, get a red error message they don't understand, and go back to watching Netflix. We are skipping the hell.
          </p>
          <p className="font-serif text-sm text-[#555] mt-3">
            Keep it simple: copy/paste the defaults first, verify green checks, then customize one thing at a time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
              <h3 className="font-sans font-black uppercase text-sm mb-3">OpenClaw Install Path (Copy/Paste)</h3>
              <ol className="list-decimal list-inside font-serif text-[#aaa] space-y-2 text-sm">
                <li>Install Docker Desktop and make sure it is running.</li>
                <li>Open terminal and paste the setup script in Section 1.</li>
                <li>Confirm services are healthy with <code className="bg-[#fdfaf6] border px-1 font-mono text-xs">docker compose ps</code>.</li>
                <li>Open the local dashboard and verify commands run end-to-end.</li>
              </ol>
              <p className="font-mono text-xs text-[#555] mt-3">Prompt: "Check OpenClaw health, list failing services, and give me exact fix commands."</p>
            </div>
            <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 shadow-[6px_6px_0_0_#22c55e]">
              <h3 className="font-sans font-black uppercase text-sm mb-3 text-[#22c55e]">Hermes Install + First Voice Test</h3>
              <ol className="list-decimal list-inside font-serif text-[#aaa] space-y-2 text-sm">
                <li>Confirm Hermes service is linked during install output.</li>
                <li>Load your mic permissions and test wake phrase.</li>
                <li>Run one voice command that writes a file or task output.</li>
                <li>Verify logs show request → delegation → response cycle.</li>
              </ol>
              <p className="font-mono text-xs text-[#777] mt-3">Prompt: "Hermes, run a mic check and return latency + failure reasons if any."</p>
            </div>
          </div>
          <CourseBoostPanel
            title="Class 01 Success Criteria + Rescue Prompts"
            checklist={[
              "OpenClaw containers show healthy in docker compose.",
              "Hermes receives one voice command and returns structured output.",
              "AGENTS.md and identity files are filled before automations.",
              "One morning brief cron job runs without manual intervention."
            ]}
            prompts={[
              "\"Run a full install audit and report failures by service with exact fix commands.\"",
              "\"Validate Hermes voice pipeline: mic input, model response, and output latency.\""
            ]}
          />
          <ResourceList
            title="Jump Links"
            items={[
              { label: "Go to The 7-Step Adulting Protocol", href: "#c1-playbook", note: "Detailed, executable step-by-step flow." },
              { label: "Go to Class 01 Resource Locker", href: "#c1-resources", note: "All install and tooling links in one place." }
            ]}
          />
        </div>

        {/* Section 1: Money */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A browser. That's it. This one doesn't require anything.",
              "The willingness to feel mildly attacked by a calculator."
            ]}
          />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "Docker Desktop installed and running (Class 01 Intro).",
              "A terminal window open.",
              "The ability to copy/paste two commands."
            ]}
          />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "Docker running from Section 1.",
              "A problem that's making you want to throw your computer."
            ]}
          />
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
                    <p className="font-serif text-lg text-[#aaa]">"I'm trying to talk to the Brain, but the Brain isn't awake yet. Open the Ollama app and try again."</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Section 7: Localhost vs The World */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Class 03 started (or at least the concept of a domain name).",
              "The difference between 192.168.x.x and a real IP address."
            ]}
          />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "Docker Compose running from Class 01.",
              "A mini-PC or server that's supposed to stay on 24/7.",
              "Coffee. This is the maintenance class."
            ]}
          />
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
        <div className="mb-24" id="c1-playbook">
          <NeedBox
            title="What you need before you start"
            items={[
              "All previous sections complete.",
              "Your AGENTS.md file open in a text editor.",
              "The 7-agent names written down somewhere."
            ]}
          />
          <SectionMeta minutes="14 min" focus="Install discipline + automation" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Zero‑Code Playbook (For People With Better Things to Do)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You’re not here to learn computer science. You’re here to stop drowning in busywork. This is the exact path to get{" "}
            <GlossaryTooltip term="OpenClaw" definition="Your local assistant runtime and workspace engine" href="#c1-dictionary" />{" "}
            behaving like a real assistant — without coding, without nerd rituals, and without pretending you care about “frameworks.”
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
              <h4 className="font-sans font-black uppercase mb-3">The 7‑Step Adulting Protocol</h4>
              <ol className="list-decimal list-inside font-serif text-[#aaa] space-y-3">
                <li><strong>Install OpenClaw clean:</strong> Run default install, then confirm with <code className="bg-[#fdfaf6] border px-1 font-mono text-xs">docker compose ps</code>. Example: if a container is "Exited", restart before moving on.</li>
                <li><strong>Locate your workspace:</strong> Open the root folder and bookmark it. Example: keep it in Finder/Explorer favorites so edits take seconds.</li>
                <li><strong>Write AGENTS.md rules:</strong> Define mission, output format, and "never do" list. Example: "Never send an email without approval."</li>
                <li><strong>Define identity files:</strong> Fill USER.md + IDENTITY.md with your tone, role, and boundaries. Example: "Concise, no fluff, business-first."</li>
                <li><strong>Connect real tools:</strong> Add Gmail + Calendar with least-privilege permissions. Example: read calendar + draft emails only.</li>
                <li><strong>Create one source of truth:</strong> Single tasks file (no duplicate lists). Example: <code className="bg-[#fdfaf6] border px-1 font-mono text-xs">tasks.md</code> with Inbox / Today / Waiting.</li>
                <li><strong>Schedule heartbeat automation:</strong> Use <GlossaryTooltip term="Cron" definition="A scheduler that runs commands at defined times" href="#c1-dictionary" /> to run daily review + check-ins. Example: 7:00am brief and 4:30pm follow-up digest.</li>
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
          <CheckpointCard
            title="Playbook Checkpoint"
            pass={[
              "You have exactly one tasks file and one heartbeat schedule.",
              "AGENTS.md + identity files are filled with explicit rules.",
              "At least one tool integration (email/calendar) is verified."
            ]}
            fail={[
              "Multiple conflicting task lists still exist.",
              "No cron/heartbeat means the assistant is still reactive.",
              "You cannot explain your assistant rules in 60 seconds."
            ]}
          />
        </div>

        {/* Section 9: The Dumb‑Proof Dictionary */}
        <div className="mb-24" id="c1-dictionary">
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
              { term: "Cron", def: "A Linux/macOS scheduler that runs commands at specific times using a 5-part pattern (minute hour day month weekday)." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#aaa]">{item.def}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h4 className="font-sans font-black uppercase mb-3">Cron in OpenClaw (Detailed)</h4>
            <p className="font-serif text-[#aaa] mb-4">
              Cron lets OpenClaw run jobs while you are offline. Format: <code className="bg-[#fdfaf6] border px-1 font-mono text-xs">minute hour day month weekday command</code>.
            </p>
            <ul className="font-mono text-xs space-y-2 text-[#222]">
              <li><code className="bg-[#fdfaf6] border px-1">0 7 * * * /root/80m/scripts/morning-brief.sh</code> → Sends your 7:00 AM daily brief.</li>
              <li><code className="bg-[#fdfaf6] border px-1">*/30 * * * * /root/80m/scripts/inbox-triage.sh</code> → Checks inbox every 30 minutes.</li>
              <li><code className="bg-[#fdfaf6] border px-1">30 16 * * 1-5 /root/80m/scripts/eod-wrap.sh</code> → Weekday end-of-day summary at 4:30 PM.</li>
            </ul>
          </div>
          <ResourceList
            title="Dictionary Resources"
            items={[
              { label: "OpenClaw Course Anatomy (local) ", href: "#", note: "Walkthrough of folder structure + role of each core file." },
              { label: "ClawChief Repo", href: "https://github.com/snarktank/clawchief", note: "Reference workspace layout, prompts, and automations." },
              { label: "crontab.guru", href: "https://crontab.guru", note: "Translate cron patterns into plain English fast." }
            ]}
          />
        </div>

        {/* Section 11: Resource Locker */}
        <div className="mb-24" id="c1-resources">
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
                <span className="text-[#555]"> — Create API keys for OpenClaw/Hermes model calls. Keep them secret.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://console.anthropic.com" target="_blank" rel="noreferrer">Anthropic Console</a>
                <span className="text-[#555]"> — Alternative provider with Claude models. Same secret‑key rule.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://discord.com/app" target="_blank" rel="noreferrer">Discord App</a>
                <span className="text-[#555]"> — Support + announcements.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://docs.docker.com/desktop/" target="_blank" rel="noreferrer">Docker Desktop Docs</a>
                <span className="text-[#555]"> — Official install + troubleshooting for Mac/Windows.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://docs.github.com/en/get-started/start-your-journey/hello-world" target="_blank" rel="noreferrer">GitHub Hello World</a>
                <span className="text-[#555]"> — If Git feels scary, this is the 10-minute primer.</span>
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
            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Copy/Paste Rescue Prompts</p>
              <ul className="font-mono text-xs text-[#1f2937] space-y-2">
                <li>"Audit my OpenClaw install. Return PASS/FAIL for Docker, containers, API keys, and memory files."</li>
                <li>"Hermes, generate a morning brief template with sections for Calendar, Inbox, Priorities, and Follow-Ups."</li>
                <li>"Create a safe first-week cron schedule with one morning brief and one end-of-day recap."</li>
              </ul>
            </div>
            <div className="mt-8 border-t-2 border-[#111] pt-6 text-sm font-mono text-[#555]">
              Local docs: /home/falcon/Documents/How to turn your OpenClaw.txt • /home/falcon/Documents/openclaw course Anatomy.txt
            </div>
            <div className="mt-6 border-[2px] border-[#111] p-4 bg-[#fdfaf6]">
              <p className="font-sans font-black text-sm uppercase mb-3">Tools & Technologies (for course builders)</p>
              <ul className="font-serif text-sm text-[#aaa] space-y-1">
                <li><a className="underline font-black" href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank" rel="noreferrer">HTML/CSS/JavaScript</a> — Front-end foundations.</li>
                <li><a className="underline font-black" href="https://react.dev/" target="_blank" rel="noreferrer">React</a> / <a className="underline font-black" href="https://vuejs.org/" target="_blank" rel="noreferrer">Vue</a> / <a className="underline font-black" href="https://angular.dev/" target="_blank" rel="noreferrer">Angular</a> — Interactive UI frameworks.</li>
                <li><a className="underline font-black" href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noreferrer">Markdown Editor Guide</a> — Write and maintain curriculum text.</li>
                <li><a className="underline font-black" href="https://git-scm.com/doc" target="_blank" rel="noreferrer">Git Docs</a> — Version control and collaboration.</li>
                <li><a className="underline font-black" href="https://docs.netlify.com/" target="_blank" rel="noreferrer">Netlify</a> / <a className="underline font-black" href="https://vercel.com/docs" target="_blank" rel="noreferrer">Vercel</a> / <a className="underline font-black" href="https://pages.github.com/" target="_blank" rel="noreferrer">GitHub Pages</a> — Hosting and deployment options.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizActive && quizSection !== null && (() => {
          const qData = quizDataC01.find(q => q.section === quizSection);
          if (!qData) return null;
          return (
            <QuizModal
              isOpen={quizActive}
              questions={qData.questions}
              courseLabel="C01"
              section={quizSection}
              onComplete={(s, passed) => {
                if (passed) {
                  const updated = [...new Set([...passedQuizzes, quizSection])];
                  setPassedQuizzes(updated);
                  localStorage.setItem('80m-c1-quizzes', JSON.stringify(updated));
                  const secId = `s${quizSection}`;
                  if (!completedSections.includes(secId)) setCompletedSections(prev => [...prev, secId]);
                }
                setQuizDone({ section: quizSection, score: s, total: qData.questions.length, passed });
                setQuizActive(false);
                setQuizSection(null);
              }}
            />
          );
        })()}

        {/* Quiz Score Toast */}
        {quizDone && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-[#111] text-[#eae7de] border-[3px] border-[#22c55e] px-8 py-4 font-sans font-black text-lg shadow-[6px_6px_0_0_#22c55e]">
            {quizDone.passed
              ? `✓ Section ${quizDone.section} Passed (${quizDone.score}/${quizDone.total}) — section unlocked.`
              : `✗ Section ${quizDone.section}: ${quizDone.score}/${quizDone.total}. Read it again, then retake.`
            }
            {!quizDone.passed && (
              <button
                onClick={() => { setQuizDone(null); setQuizActive(true); setQuizSection(quizDone.section); }}
                className="ml-4 font-sans font-black text-sm uppercase px-4 py-2 bg-[#22c55e] text-[#111] border-[2px] border-[#111] hover:bg-[#4ade80] transition-colors"
              >
                Retake Quiz
              </button>
            )}
          </div>
        )}

        {/* End of Class 1 */}
        <div className="border-t-[4px] border-[#111] pt-12 text-center">
          <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 01 Complete.</h2>
          <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[8px_8px_0_0_#111] transition-colors">
            Exit to Curriculum →
          </button>
        </div>{/* close max-w-4xl */}
        </div>{/* close flex-1 overflow-y-auto */}
      </div>
      <AtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

const CourseTwoContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [promptState, setPromptState] = useState(0);
  const [thoughtChain, setThoughtChain] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('80m-c2-quizzes') || '[]'); } catch { return []; }
  });
  const [tokenSliderVal, setTokenSliderVal] = useState('64');
  const [tokenHistWidth, setTokenHistWidth] = useState(30);
  const [tokenHistLabel, setTokenHistLabel] = useState('~38K tokens');
  const [tokenRemWidth, setTokenRemWidth] = useState(45);
  const [tokenRemLabel, setTokenRemLabel] = useState('~58K tokens');

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
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete · {passedQuizzes.length}/5 quizzes passed</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => {
              const sectionNum = parseInt(s.id.replace('s', ''));
              const hasQuiz = sectionNum >= 1 && sectionNum <= 5;
              const isPassed = passedQuizzes.includes(sectionNum);
              const isDone = completedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${isDone ? 'text-[#22c55e]' : 'text-[#555]'}`}
                >
                  <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                    {isDone ? (
                      <span className="block w-2 h-2 bg-current"></span>
                    ) : hasQuiz && !isPassed ? (
                      <span className="text-[8px]">🔒</span>
                    ) : null}
                  </span>
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
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
          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed border-l-[4px] border-[#111] pl-6">
            If your AI is giving you generic garbage, it's because you're treating it like a magic 8-ball. It's a high-performance intern. Be specific.
          </p>
          <p className="font-serif text-sm text-[#555] mt-3">
            Keep it simple: use the templates exactly as written, then tweak one rule at a time.
          </p>
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-3">Fast Start: Copy/Paste Prompt Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CopyBlock text="ROLE: Hermes Chief of Staff. TASK: Build my top 3 priorities for today from calendar + inbox. RULES: concise, no fluff. OUTPUT: numbered list." />
              <CopyBlock text="TASK: Rewrite this message for a client. RULES: 70 words max, confident tone, one CTA. OUTPUT: 3 options." />
            </div>
          </div>
          <CourseBoostPanel
            title="Class 02 Prompt Quality Checklist"
            checklist={[
              "Every prompt includes ROLE, TASK, RULES, OUTPUT, and CONTEXT.",
              "Output format is explicit (table, bullets, JSON, etc.).",
              "Prompts are reusable templates saved to your workspace.",
              "At least one prompt is automated into a scheduled brief."
            ]}
            prompts={[
              "\"Convert this vague ask into a strict ROLE/TASK/RULES/OUTPUT/CONTEXT prompt.\"",
              "\"Score this prompt from 1-10 for clarity and rewrite it to a 10.\""
            ]}
          />
          <ResourceList
            title="Jump Links"
            items={[
              { label: "Go to Prompt Translator", href: "#c2-prompting", note: "Fastest way to improve output quality." },
              { label: "Go to Class 02 Dictionary", href: "#c2-dictionary", note: "Glossary for terms used throughout class." },
              { label: "Go to Class 02 Resource Locker", href: "#c2-resources", note: "Official prompting docs + templates." }
            ]}
          />
        </div>

        {/* Section 1: Prompting */}
        <div id="c2-prompting" className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "An OpenClaw instance running.",
              "One vague prompt you've been using that you want to fix.",
              "The interactive translator widget below (built in)."
            ]}
          />
          <SectionMeta minutes="8 min" focus="Prompt upgrades" />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "The interactive context window visualizer below.",
              "Your most recent prompt (open it next to this tab)."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Context Window</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Think of the <GlossaryTooltip term="Context Window" definition="How much information the model can hold at once" href="#c2-dictionary" /> as AI short-term memory. You can hand it a massive document, a long conversation, a full brief — but it all has to fit in that window at once. Class 02 teaches you to manage it.
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

          {/* Interactive: Token Budget Slider */}
          <div className="mt-8 border-[3px] border-[#111] bg-[#111] p-6">
            <h3 className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-4">// Token Budget Calculator</h3>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="range"
                min="0"
                max="128"
                value={tokenSliderVal}
                onChange={(e) => {
                  const val = e.target.value;
                  setTokenSliderVal(val);
                  const rem = 128 - val;
                  setTokenHistWidth(val * 0.5);
                  setTokenHistLabel(`~${Math.round(val * 0.5)}K tokens`);
                  setTokenRemWidth(rem / 128 * 100);
                  setTokenRemLabel(`~${rem}K tokens`);
                }}
                className="flex-1 accent-[#22c55e]"
              />
              <span className="font-mono text-[#22c55e] text-lg w-32 text-right">{tokenSliderVal}K / 128K</span>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex gap-2"><span className="text-[#38bdf8] w-20">System:</span><div className="flex-1 h-4 bg-[#222] rounded"><div className="h-full bg-[#22c55e] rounded" style={{ width: '15%' }}></div></div><span className="text-[#aaa] w-20">~19K tokens</span></div>
              <div className="flex gap-2"><span className="text-[#38bdf8] w-20">History:</span><div className="flex-1 h-4 bg-[#222] rounded"><div className="h-full bg-[#f59e0b] rounded" style={{ width: `${tokenHistWidth}%` }}></div></div><span className="text-[#aaa] w-20">{tokenHistLabel}</span></div>
              <div className="flex gap-2"><span className="text-[#38bdf8] w-20">Your input:</span><div className="flex-1 h-4 bg-[#222] rounded"><div className="h-full bg-[#38bdf8] rounded" style={{ width: '10%' }}></div></div><span className="text-[#aaa] w-20">~13K tokens</span></div>
              <div className="flex gap-2"><span className="text-[#38bdf8] w-20">Remaining:</span><div className="flex-1 h-4 bg-[#222] rounded"><div className="h-full bg-[#333] rounded" style={{ width: `${tokenRemWidth}%` }}></div></div><span className="text-[#aaa] w-20">{tokenRemLabel}</span></div>
            </div>
          </div>
        </div>

        {/* Section 3: Delegation */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "One task you've been handing to your AI one piece at a time.",
              "The numbered list format below as a template."
            ]}
          />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "Fabric running (part of the 80m stack from Class 01).",
              "Your SOUL.md and AGENTS.md files accessible."
            ]}
          />
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
              <p className="font-serif text-[#aaa]">"Here's what you're missing: your current email sequence is losing you $40K/yr. Here's the fix."</p>
            </div>
          </div>
        </div>

        {/* Section 5: Chain of Thought */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "The interactive 'Show Thinking Logic' button below.",
              "One complex question you've been afraid to ask your AI."
            ]}
          />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "Wispr Flow installed (or a similar voice-to-clipboard tool).",
              "Your phonetic dictionary config file."
            ]}
          />
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
          <NeedBox
            title="What you need before you start"
            items={[
              "Cron set up from Class 01.",
              "Your calendar connected (Google Calendar or equivalent).",
              "Your inbox accessible via IMAP."
            ]}
          />
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
          <SectionMeta minutes="11 min" focus="Prompt reliability system" />
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
              <ul className="font-serif text-[#aaa] space-y-3">
                <li><strong>ROLE:</strong> Who it is right now. (Executive assistant)</li>
                <li><strong>TASK:</strong> The exact job. (Draft 3 replies)</li>
                <li><strong>RULES:</strong> Constraints. (50 words, no emojis)</li>
                <li><strong>OUTPUT:</strong> The <GlossaryTooltip term="Output Format" definition="Required structure like bullets/table/JSON" href="#c2-dictionary" />. (Bulleted list)</li>
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
          <CheckpointCard
            title="Prompt Formula Checkpoint"
            pass={[
              "Prompt includes ROLE/TASK/RULES/OUTPUT/CONTEXT in order.",
              "Output format is machine-checkable (table, list, JSON).",
              "Prompt is saved for reuse and adjusted after one test run."
            ]}
            fail={[
              "Vague asks like 'make it better' without constraints.",
              "No explicit output format causes inconsistent responses.",
              "One-off prompts are lost and rewritten every day."
            ]}
          />
        </div>

        {/* Section 9: The Dumb‑Proof Dictionary */}
        <div className="mb-24" id="c2-dictionary">
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
              { term: "Cron", def: "A scheduler that runs prompts/scripts automatically at set times." },
              { term: "Output Format", def: "The shape you want: bullets, table, JSON, etc." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#aaa]">{item.def}</p>
              </div>
            ))}
          </div>
          <p className="font-serif text-[#aaa] mt-6">
            Pro move: when a term confuses you in class notes, jump to this dictionary first instead of guessing. It saves hours of bad prompts.
          </p>
        </div>

        {/* Section 10: Resource Locker */}
        <div className="mb-24" id="c2-resources">
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
              <li>
                <a className="underline underline-offset-4 font-black" href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">OpenAI Prompting Guide</a>
                <span className="text-[#555]"> — Official prompt patterns for structure and reliability.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" target="_blank" rel="noreferrer">Anthropic Prompting Guide</a>
                <span className="text-[#555]"> — Clear examples for instruction quality and guardrails.</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Copy/Paste Prompt Templates</p>
              <ul className="font-mono text-xs text-[#1f2937] space-y-2">
                <li>"Summarize this thread into: Decisions, Risks, Next Actions. Max 8 bullets."</li>
                <li>"Turn this brain dump into a clean task list with owner, due date, and dependencies."</li>
                <li>"Generate a daily brief from my schedule. Flag conflicts and propose fixes."</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizActive && quizSection !== null && (() => {
          const qData = quizDataC02.find(q => q.section === quizSection);
          if (!qData) return null;
          return (
            <QuizModal
              isOpen={quizActive}
              questions={qData.questions}
              courseLabel="C02"
              section={quizSection}
              onComplete={(s, passed) => {
                if (passed) {
                  const updated = [...new Set([...passedQuizzes, quizSection])];
                  setPassedQuizzes(updated);
                  localStorage.setItem('80m-c2-quizzes', JSON.stringify(updated));
                  const secId = `s${quizSection}`;
                  if (!completedSections.includes(secId)) setCompletedSections(prev => [...prev, secId]);
                }
                setQuizDone({ section: quizSection, score: s, total: qData.questions.length, passed });
                setQuizActive(false);
                setQuizSection(null);
              }}
            />
          );
        })()}

        {/* Quiz Score Toast */}
        {quizDone && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-[#111] text-[#eae7de] border-[3px] border-[#22c55e] px-8 py-4 font-sans font-black text-lg shadow-[6px_6px_0_0_#22c55e]">
            {quizDone.passed
              ? `✓ Section ${quizDone.section} Passed (${quizDone.score}/${quizDone.total}) — section unlocked.`
              : `✗ Section ${quizDone.section}: ${quizDone.score}/${quizDone.total}. Read it again, then retake.`
            }
            {!quizDone.passed && (
              <button
                onClick={() => { setQuizDone(null); setQuizActive(true); setQuizSection(quizDone.section); }}
                className="ml-4 font-sans font-black text-sm uppercase px-4 py-2 bg-[#22c55e] text-[#111] border-[2px] border-[#111] hover:bg-[#4ade80] transition-colors"
              >
                Retake Quiz
              </button>
            )}
          </div>
        )}

        <div className="border-t-[4px] border-[#111] pt-12 text-center">
          <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 01 Complete.</h2>
          <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[8px_8px_0_0_#111] transition-colors">
            Exit to Curriculum →
          </button>
        </div>
        </div>{/* close max-w-4xl */}
        </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};


// ===== Quiz Data for all 3 courses =====
const quizDataC01 = [
  {
    section: 1,
    questions: [
      { q: "What does the terminal command 'curl -sL url | bash' do?", options: ["Downloads a file to your desktop", "Fetches and runs a script directly from the internet without saving it", "Installs a package manager", "Creates a new Docker container"], correct: 1, explanation: "curl fetches data from a URL, the -s flag suppresses progress, -L follows redirects, and | bash pipes the output directly to the shell — so the script runs without ever touching your disk." },
      { q: "What is Docker Desktop's main purpose in the 80m stack?", options: ["Runs your web browser", "Provides the container runtime that houses your AI agents", "Manages your files", "Compiles code faster"], correct: 1, explanation: "Docker Desktop is the container runtime — it lets Docker run the 80m stack as isolated containers on your local machine. Without it, Docker can't run anything." },
      { q: "Why does 80m use Docker instead of installing dependencies directly?", options: ["Docker is faster", "Docker makes everything run in an isolated 'box' so it works the same on your laptop and on a server", "Docker is required by law", "Docker hosts the files"], correct: 1, explanation: "Docker containers include everything needed — brain, memory, tools — and run identically everywhere. No 'works on my machine' problems. One command sets up the whole stack." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What is the Agent Council in the 80m stack?", options: ["A physical meeting room", "A team of AI agents where each specializes in one task and they check each other's work before anything reaches you", "A programming framework", "A file storage system"], correct: 1, explanation: "The Agent Council is how 80m handles complex tasks — Claudnelius writes code, Sir Clawthchilds handles budgets, Clawdette executes operations. They delegate, check, and hand off rather than doing everything at once." },
      { q: "Which agent is responsible for technical architecture and UI?", options: ["Prawnius", "Sir Clawthchilds", "Claudnelius", "Knaight"], correct: 2, explanation: "Claudnelius is the Code & Design agent — technical architecture, debugging, UI work. Prawnius handles quick tasks, Sir Clawthchilds handles finances." },
      { q: "What does Hermes do in the agent council?", options: ["Writes code", "Manages finances", "Coordinates the council — takes your input and distributes work to the right agent", "Manages files"], correct: 2, explanation: "Hermes is Chief of Staff — the coordinator. You talk to Hermes, Hermes delegates to the right specialist agent. Think of it as the difference between one intern doing everything badly vs. a team with a project manager." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is the minimum RAM required for the 80m stack?", options: ["4GB", "8GB", "16GB", "64GB"], correct: 2, explanation: "16GB is the floor for running the 80m stack comfortably. 8GB will run slow and frustrated. More RAM = more agents you can run simultaneously without things freezing." },
      { q: "What happens if you try to run the 80m stack on a machine with only 4GB RAM?", options: ["It runs faster", "It installs but crashes constantly", "Nothing special", "You need more hard drive space"], correct: 1, explanation: "4GB RAM is not enough — the AI models are heavy. You'll see constant crashes, frozen terminals, and a very frustrating experience. 16GB+ (ideally 32GB for M-series Mac) is the actual minimum." },
      { q: "What does Docker Compose do when you run 'docker-compose up'?", options: ["Opens a web browser", "Starts all containers defined in docker-compose.yml as a single application", "Downloads files", "Creates a backup"], correct: 1, explanation: "docker-compose.yml defines your entire stack — brain, memory, tools. docker-compose up reads that file and starts all the containers together, linked and configured properly." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is the difference between localhost and a public IP?", options: ["There is no difference", "localhost (127.0.0.1) is your computer talking to itself — nobody else can access it. A public IP is how the internet reaches you.", "localhost is faster", "Public IPs are only for websites"], correct: 1, explanation: "localhost/127.0.0.1 is a private loopback address — it's like talking to yourself in a room. Nobody external can access it. A public IP is your 'street address' that the whole internet can reach." },
      { q: "What is the secret tunnel mentioned in Class 03 for?", options: ["It makes downloads faster", "It lets you access your localhost AI from outside your network (e.g. from your phone)", "It encrypts your files", "It backs up your data"], correct: 1, explanation: "The Cloudflare Tunnel (Class 03) creates a secure connection from your server to Cloudflare — then you access your AI through Cloudflare instead of directly. Your phone can reach your AI even though it's behind your home router." },
      { q: "What is a Dockerfile?", options: ["A text file with instructions Docker uses to build a container image", "A database backup", "A web page template", "An email template"], correct: 0, explanation: "A Dockerfile is a recipe card — it tells Docker which base OS to start from, which dependencies to install, which files to copy in, and which port to expose. Without it, Docker doesn't know what to build or run." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "If Docker shows a container as 'Exited', what does that mean?", options: ["The container is running perfectly", "The container started but then stopped due to an error", "The container is paused", "The container needs more RAM"], correct: 1, explanation: "Exited means Docker tried to start the container but it crashed or the process finished. Check the logs with docker-compose logs [service-name] to see what went wrong." },
      { q: "What command shows you running Docker containers?", options: ["docker ps", "docker-compose ps", "docker ps | grep", "docker ps ls"], correct: 1, explanation: "docker-compose ps shows all containers defined in your docker-compose.yml and their current status. docker ps alone only shows containers started with plain docker run, not docker-compose." },
      { q: "What does 'docker-compose pull' do?", options: ["Deletes all containers", "Fetches the latest versions of your container images from the internet", "Starts all containers", "Creates a backup"], correct: 1, explanation: "docker-compose pull downloads fresh images for each service defined in docker-compose.yml. Run this once a week to keep your stack updated with the latest improvements." },
    ]
  },
];

const quizDataC02 = [
  {
    section: 1,
    questions: [
      { q: "What is a context window?", options: ["The visible part of a web page", "The amount of text an AI can 'see' and work with in a single prompt — like its working memory", "A security feature", "A type of image format"], correct: 1, explanation: "The context window is the AI's working memory per conversation. If it's 128K tokens, you can paste in an entire book. Fill it with garbage and there's no room for actual work." },
      { q: "What happens when you overload the context window with irrelevant info?", options: ["The AI gets smarter", "The AI may miss the actual task because there's too much noise in the context", "Nothing happens", "The AI ignores all previous messages"], correct: 1, explanation: "A stuffed context window dilutes what matters. The AI processes everything equally — so important instructions compete with filler. Be surgical: only include what's directly relevant to the task." },
      { q: "What is a system prompt?", options: ["Your email subject line", "The foundational instructions that tell the AI who it is, how to behave, and what rules to follow — loaded before any user message", "A password", "A file name"], correct: 1, explanation: "The system prompt is the AI's constitution — who it is, how it thinks, what it never does. This is where you define the agent's identity, tone, and constraints. It's loaded once at the start of the session." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What does 'Chain of Thought' prompting mean?", options: ["Writing long paragraphs", "Asking the AI to think step-by-step before giving you the final answer", "Using bullet points", "Sending multiple messages"], correct: 1, explanation: "Chain of Thought = 'think out loud before you answer.' Adding 'think step by step' or 'before you answer, walk through the logic' forces the AI to show its reasoning, which dramatically improves accuracy on complex tasks." },
      { q: "Why does Chain of Thought improve AI outputs?", options: ["It doesn't improve outputs", "It forces the AI to work through the problem visibly, catching mistakes before it gives you a wrong answer", "It makes responses faster", "It reduces token usage"], correct: 1, explanation: "The AI can't just 'hallucinate' an answer when it's showing its work. Chain of Thought catches logical errors in real-time — the AI sees its own mistake in the chain and self-corrects before output." },
      { q: "What is 'fabric' in the 80m context?", options: ["A type of clothing", "The 80m memory layer — a persistent, searchable knowledge system that lets your AI remember your brand, rules, and context across sessions", "A code library", "A type of database"], correct: 1, explanation: "Fabric is 80m's memory layer — it stores your agent's knowledge, your brand rules, past decisions, and context. Without it, every session starts from scratch. With it, your AI knows who you are and what you care about." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What does the 'laundry list method' of prompting produce?", options: ["Short creative outputs", "More structured, thorough outputs with named categories and explicit lists — because the AI has clear places to put information", "Faster responses", "Fewer tokens used"], correct: 1, explanation: "Instead of dumping everything into one paragraph, the laundry list method gives the AI named buckets: Background, Task, Constraints, Output Format. Each bucket gets filled deliberately — and the AI fills all of them before stopping." },
      { q: "What is the correct order for a laundry list prompt?", options: ["Task → Background → Format → Constraints", "Background → Task → Constraints → Output Format", "Constraints → Task → Background → Format", "Format → Constraints → Task → Background"], correct: 1, explanation: "The order is: 1) Background (what they need to know), 2) Task (what to do), 3) Constraints (rules and guardrails), 4) Output Format (how to structure the answer). Background first so the AI has context before receiving the task." },
      { q: "What is 'delegation' in the agent context?", options: ["Copying text", "Handing a task off to a specialized sub-agent that has the right tools and context to execute it independently", "Writing an email", "Creating a file"], correct: 1, explanation: "Delegation is how the Agent Council works — Hermes takes your input, identifies which sub-agent is right for the task, hands off with the right context, and collects the result. Done right, you get a finished product, not a suggestion." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What does Cron do in the 80m stack?", options: ["Sends emails", "Runs scheduled commands automatically — like a task scheduler for your server", "Manages Docker containers", "Compiles code"], correct: 1, explanation: "Cron is a Linux/macOS built-in scheduler. It runs commands at defined times — 7am brief, 4:30pm follow-up digest, weekly docker-compose pull. The 80m stack uses cron to move your business forward 24/7 without you being there." },
      { q: "What is a cron expression and what does '0 7 * * 1-5' mean?", options: ["It means 'run every minute'", "It means 'at 7:00am, Monday through Friday' — the 5 fields are: minute hour day month weekday", "It means 'run once a year'", "It means 'never run'"], correct: 1, explanation: "Cron uses 5 fields: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-6, 0=Sun). '0 7 * * 1-5' = at 7:00am every weekday. '0,30 9 * * *' = at 9:00 and 9:30 every day." },
      { q: "What does 'HEARTBEAT' do in the 80m context?", options: ["Plays music", "A scheduled daily check-in where your AI reviews tasks, flags blockers, and primes itself for the day ahead", "Sends emails", "Manages your calendar"], correct: 1, explanation: "The HEARTBEAT is your AI's daily morning ritual — at 7am it wakes up, reviews your task list, checks your calendar, and gives you a prioritized briefing: what to do today, what's blocked, what's waiting on others." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What does voice hacking mean in the 80m curriculum?", options: ["Breaking into voice servers", "Using voice-to-text so you can dictate commands to your AI instead of typing", "Recording audio", "Transcribing meetings"], correct: 1, explanation: "Voice hacking is using tools like Wispr Flow to dictate prompts instead of typing. You speak naturally, it converts to text and copies to clipboard, and your AI agent executes. 'Run a full audit of my inbox and flag anything urgent.' Done." },
      { q: "What does AGENTS.md do?", options: ["It's a to-do list", "It's a configuration file that defines your agent's mission, output format, tools, and 'never do' rules — the AI reads this before every task", "It's an email template", "It's a backup file"], correct: 1, explanation: "AGENTS.md is the agent's constitution — it tells the AI: who it is, how to behave, what tools it has access to, output format rules, and explicit 'never do' restrictions. Without it, every task gets the generic AI treatment." },
      { q: "What is the 'Bossy Prompt Formula'?", options: ["Being rude to the AI", "Background + Task + Constraints + Output Format — gives the AI no room to improvise, only to execute", "Using all caps", "Writing one-word prompts"], correct: 1, explanation: "The Bossy Prompt Formula is: 'Here's the context, here's exactly what to do, here are the rules, here's how to format the output.' You command, it executes. No wiggle room, no suggestions — just the product." },
    ]
  },
];

const quizData = [
  {
    section: 1,
    questions: [
      { q: "What does DNS stand for?", options: ["Digital Network System", "Domain Name System", "Data Node Service", "Direct Name Server"], correct: 1, explanation: "DNS (Domain Name System) is the phone book of the internet — it maps human-readable names like 'ai.80m.ai' to IP addresses like '35.186.240.50' that computers actually use." },
      { q: "If your AI is at '192.168.1.1:8080', what's the problem?", options: ["It's offline", "It's too fast", "It's impossible to share or remember", "It's been hacked"], correct: 2, explanation: "192.168.x.x addresses are private — they only work inside your home or office network. You can't share them with anyone outside, and nobody can reach your AI from the internet." },
      { q: "A CNAME record points your domain where?", options: ["To an IP address", "To another domain name", "To an email server", "To a file"], correct: 1, explanation: "A CNAME (Canonical Name) record points one domain to another domain, not an IP. This is how 'www' and 'api' subdomains point to your main server without hardcoding IP addresses." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What does Nginx do at your server's front door?", options: ["Sends emails", "Checks credentials before letting users through", "Stores files", "Runs Python scripts"], correct: 1, explanation: "Nginx is the bouncer — it sits in front of your server and checks every incoming request. 'Who are you? Are you allowed to be here?' It stops hackers and routes legitimate users to your AI." },
      { q: "What port does HTTP traffic typically use?", options: ["22", "443", "80", "3000"], correct: 2, explanation: "Port 80 is the default for unencrypted HTTP traffic. Port 443 is for encrypted HTTPS. Port 22 is for SSH. Port 3000 is a common dev server port — not for production." },
      { q: "What does 'proxy_pass' do in an Nginx config?", options: ["Sends email", "Forwards requests to your AI backend", "Blocks all traffic", "Restarts the server"], correct: 1, explanation: "proxy_pass tells Nginx to forward requests that it receives to another server — your AI backend running on localhost:8080, for example. This is how the bouncer hands off to the actual service." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "In the simulator, what happens when you click 'Block All'?", options: ["Everything is allowed", "All traffic is blocked, including legitimate users", "Server speeds up", "Nothing"], correct: 1, explanation: "Blocking all traffic sounds safe but your real users get blocked too. The correct setting is 'Allow Known Good' — it only lets through verified legitimate traffic while silently dropping hackers." },
      { q: "What is the 'Green Traffic' in the simulator?", options: ["Hacker traffic", "Legitimate user requests", "Spam", "System errors"], correct: 1, explanation: "Green traffic = legitimate users who passed the bouncer check. Red = blocked attacks. In real server logs, you'll see these as HTTP status codes — 200 for success, 403 for blocked." },
      { q: "What does 'Allow Known Good' do?", options: ["Blocks everything", "Only lets through verified safe traffic", "Deletes logs", "Sends alerts"], correct: 1, explanation: "Allow Known Good is the paranoia setting. It maintains a list of known-safe patterns (your app, your IP, your users) and blocks everything else — hackers, scrapers, and random bots trying your server." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What does the green padlock in a browser URL bar mean?", options: ["The website is fast", "Traffic between you and the site is encrypted", "The website is government approved", "The website has no ads"], correct: 1, explanation: "The padlock means SSL/TLS encryption is active — all data between your browser and the website is scrambled and can't be read by hackers on the same WiFi, your ISP, or anyone in between." },
      { q: "Who provides the free SSL certificates that Certbot uses?", options: ["Google", "Amazon", "Let's Encrypt", "Microsoft"], correct: 2, explanation: "Let's Encrypt is a non-profit certificate authority that issues free SSL certificates. Certbot is the tool that obtains and installs these certificates on your Nginx server automatically." },
      { q: "What's the correct Certbot command for Nginx?", options: ["certbot install", "certbot run", "certbot nginx", "certbot start"], correct: 2, explanation: "certbot nginx — the 'nginx' subcommand tells Certbot to use the Nginx plugin, which automatically configures your Nginx site configuration. That's the whole point: you don't edit files manually." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What's the main advantage of a Cloudflare Tunnel?", options: ["Makes server faster", "No router port forwarding needed", "Replaces Nginx", "Free hosting"], correct: 1, explanation: "Cloudflare Tunnel (formerly Argo Tunnel) creates an outbound connection from your server to Cloudflare — no incoming ports need to be opened on your router. The world reaches your server through Cloudflare instead of directly." },
      { q: "What does 'cloudflared' do?", options: ["Hosts a website", "Creates an encrypted tunnel from your server to Cloudflare", "Manages DNS only", "Blocks DDoS attacks"], correct: 1, explanation: "cloudflared is the daemon that runs on your server and maintains the persistent tunnel connection to Cloudflare. It 'phones home' and keeps the tunnel open so Cloudflare can route traffic to you." },
      { q: "What is your server's public IP?", options: ["192.168.x.x addresses", "10.x.x.x addresses", "The IP your ISP gives you that the world sees", "Always 1.1.1.1"], correct: 2, explanation: "192.168.x.x and 10.x.x.x are private IP ranges — used inside your network. Your public IP is what the internet sees. It's assigned by your ISP and changes (unless you pay for a static one). Check it at whatismyip.com." },
    ]
  },
  {
    section: 6,
    questions: [
      { q: "Where do you find Nginx access logs?", options: ["/var/log/nginx/access.log", "/etc/nginx/logs", "/root/logs", "/var/www/logs"], correct: 0, explanation: "Ubuntu/Debian puts Nginx logs in /var/log/nginx/ by default — access.log for every request, error.log for crashes and misconfigurations. This is the first place to look when debugging." },
      { q: "What does a 404 status code mean?", options: ["Server error", "Page not found", "Access denied", "Success"], correct: 1, explanation: "404 = Not Found. The URL doesn't exist on your server. 200 = success, 403 = forbidden (blocked), 500 = server error. Check your Nginx logs to see which URLs are returning 404s — it might mean a misconfigured proxy rule." },
      { q: "Why should you check your server logs regularly?", options: ["To slow down your server", "To spot hacker attempts early", "To increase traffic", "Logs aren't important"], correct: 1, explanation: "Every hack attempt leaves a log entry. If you see thousands of requests for /wp-admin or /phpmyadmin from random IPs — those are bots scanning your server. Regular log checks catch intrusions before they succeed." },
    ]
  },
  {
    section: 7,
    questions: [
      { q: "What does Docker Compose let you do?", options: ["Send emails", "Run multiple containers as a single application", "Browse the web", "Edit photos"], correct: 1, explanation: "Docker Compose runs multiple Docker containers together as one application. Your AI stack might need: the AI model container, a database container, a web server container — Compose starts them all with one command." },
      { q: "What is a Dockerfile?", options: ["A text message", "Instructions for building a Docker image", "A server config file", "A database"], correct: 1, explanation: "A Dockerfile is a recipe — it tells Docker exactly how to build your container image: which base OS, which dependencies to install, which files to copy in, which port to expose. Without it, Docker doesn't know what to run." },
      { q: "When should you scale horizontally?", options: ["Never", "When one bot cannot keep up with the workload", "Only on Fridays", "When the server is slow"], correct: 1, explanation: "Horizontal scaling = adding more copies of your bot to handle more work. Scale when one instance is maxed out (CPU at 100%, requests queuing up). Vertical scaling = bigger machine. Horizontal = more machines." },
    ]
  },
  {
    section: 8,
    questions: [
      { q: "What does UFW stand for?", options: ["Universal File Upload", "Uncomplicated Firewall", "Ultra Fast Network", "User Folder Access"], correct: 1, explanation: "UFW (Uncomplicated Firewall) is Ubuntu's default firewall. It's just iptables made simple — 'ufw allow 22', 'ufw deny 80' — without having to write complex iptables rules by hand." },
      { q: "What does 'ufw default deny' do?", options: ["Opens all ports", "Blocks all incoming traffic by default", "Disables the firewall", "Restarts the server"], correct: 1, explanation: "ufw default deny incoming means your server starts with all doors locked. You then explicitly open only the ports you need (22 for SSH, 443 for HTTPS). Default-deny is the security paranoid approach — nothing意外 gets in." },
      { q: "What port does SSH typically use?", options: ["80", "443", "22", "8080"], correct: 2, explanation: "SSH uses port 22 by default — this is how you connect to your server's terminal remotely. If you change this to a non-standard port (like 2222), it's harder for bots to find — though not a real security fix on its own." },
    ]
  },
];

const CourseThreeContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [bouncerOn, setBouncerOn] = useState(false);
  const [tunnelOn, setTunnelOn] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('80m-c3-quizzes') || '[]');
    } catch { return []; }
  });

  // Simulator state (Section 3)
  const [trafficState, setTrafficState] = useState(0);
  const [logView, setLogView] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [scanIP, setScanIP] = useState('35.186.240.50');
  const [scanResults, setScanResults] = useState([{ port: null, status: '_ Awaiting scan...', service: '', risk: 'WAITING' }]);
  const [dnsType, setDnsType] = useState('A');
  const [dnsName, setDnsName] = useState('ai');
  const [dnsValue, setDnsValue] = useState('35.186.240.50');
  const [dnsOutput, setDnsOutput] = useState('');
  const [ngxServer, setNgxServer] = useState('ai.80m.ai');
  const [ngxProxy, setNgxProxy] = useState('http://localhost:3000');
  const [ngxPort, setNgxPort] = useState('443');
  const [ngxSSL, setNgxSSL] = useState('yes');
  const [ngxOutput, setNgxOutput] = useState('');
  const [fwPort, setFwPort] = useState('443');
  const [fwProto, setFwProto] = useState('tcp');
  const [fwType, setFwType] = useState('allow');
  const [fwComment, setFwComment] = useState('');
  const [fwOutput, setFwOutput] = useState('');

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

  const runPortScan = () => {
    const ip = (scanIP || '35.186.240.50').trim() || '35.186.240.50';
    const ports = [
      { port: 22, status: 'OPEN', service: 'SSH', risk: 'LOW' },
      { port: 80, status: 'OPEN', service: 'HTTP', risk: 'MED' },
      { port: 443, status: 'OPEN', service: 'HTTPS', risk: 'LOW' },
      { port: 3000, status: 'FILTERED', service: 'Node.js', risk: 'MED' },
      { port: 8080, status: 'CLOSED', service: 'Alt HTTP', risk: 'LOW' },
      { port: 21, status: 'CLOSED', service: 'FTP', risk: 'HIGH' },
      { port: 3306, status: 'FILTERED', service: 'MySQL', risk: 'HIGH' },
      { port: 5432, status: 'CLOSED', service: 'Postgres', risk: 'HIGH' }
    ];

    setScanResults([{ port: null, status: `Scanning ${ip}...`, service: '', risk: 'SCANNING' }]);

    ports.forEach((p, i) => {
      setTimeout(() => {
        setScanResults(prev => {
          const base = prev.filter(item => item.risk !== 'SCANNING' && item.risk !== 'WAITING');
          return [...base, p];
        });
      }, 100 * (i + 1));
    });
  };

  const generateDnsRecord = () => {
    setDnsOutput(`${dnsType} Record: ${dnsName}.80m.ai → ${dnsValue}`);
  };

  const generateNginxConfig = () => {
    const sslLine = ngxSSL === 'yes'
      ? `    listen ${ngxPort} ssl;\n    ssl_certificate /etc/ssl/certs/your-cert.pem;\n    ssl_certificate_key /etc/ssl/private/your-key.pem;`
      : `    listen ${ngxPort};`;
    setNgxOutput(`server {\n${sslLine}\n    server_name ${ngxServer};\n\n    location / {\n        proxy_pass ${ngxProxy};\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}`);
  };

  const generateFirewallRule = () => {
    const protoStr = fwProto === 'any' ? '' : `/${fwProto}`;
    const commentStr = fwComment ? `  # ${fwComment}` : '';
    setFwOutput(`ufw ${fwType} ${fwPort}${protoStr}${commentStr}`);
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
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete · {passedQuizzes.length}/8 quizzes passed</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => {
              const sectionNum = parseInt(s.id.replace('s', ''));
              const hasQuiz = sectionNum >= 1 && sectionNum <= 8;
              const isPassed = passedQuizzes.includes(sectionNum);
              const isDone = completedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSection(s.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${isDone ? 'text-[#22c55e]' : 'text-[#555]'}`}
                >
                  <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                    {isDone ? (
                      <span className="block w-2 h-2 bg-current"></span>
                    ) : hasQuiz && !isPassed ? (
                      <span className="text-[8px]">🔒</span>
                    ) : null}
                  </span>
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
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
          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
            No rent. No locks. Just a fortress you built.
          </p>
          <div className="text-center">
            <p className="font-serif text-sm text-[#555] mt-3">
              Keep it simple: lock in DNS, SSL, and firewall first. Scale only after the basics are stable.
            </p>
          </div>
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-3">Infrastructure Quick Checklist</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-serif text-[#aaa] text-sm">
              <li>✅ Domain points to your server IP.</li>
              <li>✅ Nginx reverse proxy responds locally.</li>
              <li>✅ SSL cert issues cleanly with Certbot.</li>
              <li>✅ Cloudflare Tunnel routes to app.</li>
              <li>✅ Firewall only exposes 22 + 443.</li>
              <li>✅ Logs show legit traffic and blocked attacks.</li>
            </ul>
          </div>
          <CourseBoostPanel
            title="Class 03 Hardening Checklist + Ops Prompts"
            checklist={[
              "DNS points correctly and resolves globally.",
              "Nginx + SSL pass basic security checks.",
              "Firewall allows only required inbound ports.",
              "Logs and alerts are reviewed daily for anomalies."
            ]}
            prompts={[
              "\"Review my Nginx and firewall setup and list top 5 security risks in priority order.\"",
              "\"Generate a weekly infrastructure maintenance checklist with exact shell commands.\""
            ]}
          />
          <ResourceList
            title="Jump Links"
            items={[
              { label: "Go to DNS Section", href: "#sec-1", note: "Start here if domain routing is broken." },
              { label: "Go to Class 03 Dictionary", href: "#c3-dictionary", note: "Infrastructure term cheat sheet." },
              { label: "Go to Class 03 Resource Locker", href: "#c3-resources", note: "Security + deployment references." }
            ]}
          />
        </div>

        {/* Section 1: DNS & Domains */}
        <div className="mb-24" id="sec-1">
          <SectionMeta minutes="12 min" focus="DNS routing" />
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
            <div className="mt-6 border-t border-[#333] pt-4">
              <p className="font-mono text-xs text-[#aaa] mb-2">// If DNS fails</p>
              <ul className="font-serif text-sm text-[#bbb] space-y-1">
                <li>1) Confirm A record points to public IP (not 192.168.x.x).</li>
                <li>2) Lower TTL to 120 during setup.</li>
                <li>3) Test with `dig yourdomain.com` before blaming Nginx.</li>
              </ul>
            </div>
          
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={() => { setQuizActive(true); setQuizSection(1); }}
              className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer"
            >
              Take Quiz — Section 1
            </button>
          </div>

          {/* Interactive: Port Scanner Simulator */}
          <div className="mt-8 border-[3px] border-[#22c55e] bg-[#111] p-6 shadow-[6px_6px_0_0_#22c55e]">
            <h3 className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-4">// Live Port Scanner Simulator</h3>
            <p className="font-serif text-[#aaa] text-sm mb-4">Enter an IP address. Watch the scan find open ports. (This is a visual simulation using example IPs.)</p>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="35.186.240.50"
                value={scanIP}
                onChange={(e) => setScanIP(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border-2 border-[#333] text-[#22c55e] font-mono px-4 py-3"
              />
              <button onClick={runPortScan} className="font-sans font-black uppercase text-sm px-6 py-3 bg-[#22c55e] text-[#111] hover:bg-[#4ade80] transition-colors">Scan</button>
            </div>
            <div className="font-mono text-xs text-[#aaa] space-y-1">
              {scanResults.map((item, idx) => {
                if (item.risk === 'WAITING') return <p key={idx} className="text-[#555]">{item.status}</p>;
                if (item.risk === 'SCANNING') return <p key={idx} className="text-[#22c55e]">{item.status}</p>;
                const riskColor = item.risk === 'HIGH' ? 'text-red-500' : item.risk === 'MED' ? 'text-yellow-500' : 'text-[#22c55e]';
                return (
                  <p key={`${item.port}-${idx}`}>
                    <span className="text-[#aaa]">{item.port}/tcp</span>{' '}
                    <span className={riskColor}>{item.status}</span>{' '}
                    <span className="text-[#555]">{item.service} ({item.risk} risk)</span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>

          {/* DNS Record Builder */}
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-4">// DNS Record Builder</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Type</label>
                  <select value={dnsType} onChange={(e) => setDnsType(e.target.value)} className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="A">A Record</option>
                    <option value="AAAA">AAAA Record</option>
                    <option value="CNAME">CNAME Record</option>
                    <option value="TXT">TXT Record</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Name/Host</label>
                  <input type="text" placeholder="ai" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={dnsName} onChange={(e) => setDnsName(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Value/IP</label>
                  <input type="text" placeholder="35.186.240.50" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={dnsValue} onChange={(e) => setDnsValue(e.target.value)} />
                </div>
              </div>
              <button onClick={generateDnsRecord} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:bg-[#333] transition-colors">
                Generate Record
              </button>
              {dnsOutput && (
                <div className="bg-[#111] p-4 font-mono text-sm text-[#22c55e] border-[2px] border-[#333]">{dnsOutput}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Nginx */}
        <div className="mb-24">
          <SectionMeta minutes="15 min" focus="Proxy + TLS front door" />
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
            <GlossaryTooltip term="Nginx" definition="Reverse proxy handling and routing incoming web requests" href="#c3-dictionary" /> sits at the front door of your server. It checks every request before it reaches your AI. "Who are you? Are you allowed to be here?" It's what stops hackers and lets legitimate users through.
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
          <CheckpointCard
            title="Nginx Checkpoint"
            pass={[
              "Nginx config validates with no syntax errors.",
              "Proxy routes to app and returns expected response.",
              "HTTPS endpoint is reachable with valid certificate."
            ]}
            fail={[
              "502/504 errors from wrong upstream or stopped app container.",
              "Mixed-content or cert warnings in browser.",
              "Config edits made without backup/version control."
            ]}
          />

          {/* Nginx Config Builder */}
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-4">// Nginx Config Builder</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Server Name</label>
                  <input type="text" placeholder="ai.80m.ai" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={ngxServer} onChange={(e) => setNgxServer(e.target.value)} />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Proxy Pass URL</label>
                  <input type="text" placeholder="http://localhost:3000" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={ngxProxy} onChange={(e) => setNgxProxy(e.target.value)} />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">SSL Port</label>
                  <input type="text" placeholder="443" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={ngxPort} onChange={(e) => setNgxPort(e.target.value)} />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Enable SSL</label>
                  <select value={ngxSSL} onChange={(e) => setNgxSSL(e.target.value)} className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="yes">Yes (recommended)</option>
                    <option value="no">No (not recommended)</option>
                  </select>
                </div>
              </div>
              <button onClick={generateNginxConfig} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:bg-[#333] transition-colors">
                Generate Config
              </button>
              {ngxOutput && (
                <pre className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] border-[2px] border-[#333] overflow-x-auto whitespace-pre-wrap">{ngxOutput}</pre>
              )}
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
            <p className="font-serif text-lg leading-relaxed text-[#aaa]">
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
                  <input type="text" placeholder="443" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={fwPort} onChange={(e) => setFwPort(e.target.value)} />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Protocol</label>
                  <select value={fwProto} onChange={(e) => setFwProto(e.target.value)} className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="any">Both</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Rule Type</label>
                  <select value={fwType} onChange={(e) => setFwType(e.target.value)} className="w-full border-[2px] border-[#111] p-2 font-mono text-sm">
                    <option value="allow">Allow</option>
                    <option value="deny">Deny</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono text-xs uppercase text-[#555] mb-1 block">Comment / Label</label>
                <input type="text" placeholder="HTTPS for web traffic" className="w-full border-[2px] border-[#111] p-2 font-mono text-sm" value={fwComment} onChange={(e) => setFwComment(e.target.value)} />
              </div>
              <button onClick={generateFirewallRule} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:bg-[#333] transition-colors">
                Generate Rule
              </button>
              {fwOutput && (
                <div className="bg-[#111] p-4 font-mono text-sm text-[#22c55e] border-[2px] border-[#333]">{fwOutput}</div>
              )}
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
        <div className="mb-24" id="c3-dictionary">
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
                <p className="font-serif text-[#aaa]">{item.def}</p>
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
        <div className="mb-24" id="c3-resources">
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
              <li>
                <a className="underline underline-offset-4 font-black" href="https://developers.cloudflare.com/dns/" target="_blank" rel="noreferrer">Cloudflare DNS Docs</a>
                <span className="text-[#555]"> — Official DNS record reference + troubleshooting.</span>
              </li>
              <li>
                <a className="underline underline-offset-4 font-black" href="https://docs.github.com/en/get-started/git-basics" target="_blank" rel="noreferrer">Git Basics</a>
                <span className="text-[#555]"> — Version control fundamentals before server config edits.</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Copy/Paste Infra Prompts</p>
              <ul className="font-mono text-xs text-[#1f2937] space-y-2">
                <li>"Audit my Nginx config for security issues and return a corrected version."</li>
                <li>"Generate Cloudflare DNS records for app, API, and www with recommended TTL."</li>
                <li>"Review my UFW rules and tell me what is unnecessarily exposed."</li>
              </ul>
            </div>
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
              onComplete={(s, passed) => {
                if (passed) {
                  const updated = [...new Set([...passedQuizzes, quizSection])];
                  setPassedQuizzes(updated);
                  localStorage.setItem('80m-c3-quizzes', JSON.stringify(updated));
                  // Auto-mark section complete on quiz pass
                  const secId = `s${quizSection}`;
                  if (!completedSections.includes(secId)) {
                    setCompletedSections(prev => [...prev, secId]);
                  }
                }
                setQuizDone({ section: quizSection, score: s, total: qData.questions.length, passed });
                setQuizActive(false);
                setQuizSection(null);
              }}
            />
          );
        })()}

        {/* Quiz Score Toast */}
        {quizDone && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] bg-[#111] text-[#eae7de] border-[3px] border-[#22c55e] px-8 py-4 font-sans font-black text-lg shadow-[6px_6px_0_0_#22c55e]">
            {quizDone.passed
              ? `✓ Section ${quizDone.section} Passed (${quizDone.score}/${quizDone.total}) — section unlocked.`
              : `✗ Section ${quizDone.section}: ${quizDone.score}/${quizDone.total}. Read it again, then retake.`
            }
            {!quizDone.passed && (
              <button
                onClick={() => { setQuizDone(null); setQuizActive(true); setQuizSection(quizDone.section); }}
                className="ml-4 font-sans font-black text-sm uppercase px-4 py-2 bg-[#22c55e] text-[#111] border-[2px] border-[#111] hover:bg-[#4ade80] transition-colors"
              >
                Retake Quiz
              </button>
            )}
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
      <AtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

// --- CourseFiveContent: Intelligence Pipeline + Agent Products ---

export const CourseFiveContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('80m-c5-quizzes') || '[]');
    } catch { return []; }
  });

  // Section 1 - Crawl Config Builder
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawlPages, setCrawlPages] = useState('10');
  const [crawlFormat, setCrawlFormat] = useState('markdown');
  const [crawlOutput, setCrawlOutput] = useState('');

  // Section 2 - Lead Sheet Builder
  const [leadData, setLeadData] = useState('');
  const [leadFields, setLeadFields] = useState({ name: true, email: true, instagram: false, website: false, phone: false });
  const [leadOutput, setLeadOutput] = useState('');
  const [leadFormat, setLeadFormat] = useState('csv');

  // Section 3 - Tool Spec Generator
  const [bizType, setBizType] = useState('salon');
  const [bizPain, setBizPain] = useState('');
  const [bizBudget, setBizBudget] = useState('$500-$2K setup');
  const [toolSpec, setToolSpec] = useState('');

  // Section 4 - Product Spec Builder
  const [prodType, setProdType] = useState('boilerplate');
  const [prodProblem, setProdProblem] = useState('');
  const [prodBefore, setProdBefore] = useState('');
  const [prodAfter, setProdAfter] = useState('');
  const [prodPersona, setProdPersona] = useState('developer');
  const [prodPrice, setProdPrice] = useState('$29');
  const [prodOutput, setProdOutput] = useState('');

  // Section 5 - Workflow Builder
  const [wfTask, setWfTask] = useState('');
  const [wfAutomations, setWfAutomations] = useState({ sheets: false, email: false, calendar: false, slack: false, csv: false });
  const [wfOutput, setWfOutput] = useState('');

  // Section 6 - Micro-SaaS Validator
  const [msaasProblem, setMsaasProblem] = useState('');
  const [msaasUser, setMsaasUser] = useState('freelancer');
  const [msaasPrice, setMsaasPrice] = useState('$15/mo');
  const [msaasOutput, setMsaasOutput] = useState('');

  // Section 7 - Content Topic Generator
  const [contentWeek, setContentWeek] = useState('');
  const [contentPlatform, setContentPlatform] = useState('x');
  const [contentFormat, setContentFormat] = useState('tutorial');
  const [contentOutput, setContentOutput] = useState('');

  // Section 8 - Agent Spec Builder
  const [agentTask, setAgentTask] = useState('lead qualification');
  const [agentProcess, setAgentProcess] = useState('');
  const [agentCost, setAgentCost] = useState('3000');
  const [agentOutput, setAgentOutput] = useState('');

  // Section 9 - Consulting Proposal Generator
  const [propOutcome, setPropOutcome] = useState('');
  const [propDomain, setPropDomain] = useState('ops');
  const [propTimeline, setPropTimeline] = useState('2 weeks');
  const [propBudget, setPropBudget] = useState('1k-5k');
  const [propOutput, setPropOutput] = useState('');

  // Section 10 - Knowledge Base Setup
  const [kbProject, setKbProject] = useState('');
  const [kbTopics, setKbTopics] = useState('');
  const [kbOutput, setKbOutput] = useState('');

  // Quiz data
  const quizData = {
    2: [
      { q: "What tool finds publicly accessible business contact data across the web?", options: ["Google Search", "Firecrawl web crawler", "Claude Code", "Postiz"], correct: 1, explanation: "Firecrawl and similar web crawlers can systematically extract publicly accessible contact data — emails, social handles, phone numbers — from across the web." },
      { q: "Which outreach method typically has the highest reply rate for cold outreach?", options: ["Mass email blast", "Cold calling", "Personalized DM or email referencing specific details", "LinkedIn connection request"], correct: 2, explanation: "Personalized outreach that references something specific about the prospect (their business, a post they made, a problem they described) dramatically outperforms generic mass outreach." },
      { q: "What makes a lead qualified vs. just a name on a list?", options: ["They have a corporate email domain", "They responded to your first message", "They have a specific problem you can solve and the budget to pay for it", "They follow you on social media"], correct: 2, explanation: "A qualified lead has: (1) a specific pain point you can address, (2) the authority to make a purchasing decision, and (3) the budget to pay for a solution. Everything else is just a name." }
    ],
    5: [
      { q: "What type of work generates the lowest churn in automation clients?", options: ["Creative work like content generation", "High-stakes financial transactions", "B2B annoyance work tied to revenue and operations", "Employee onboarding workflows"], correct: 2, explanation: "B2B annoyance work — cleaning spreadsheets, generating reports, nudging follow-ups — tied to day-to-day revenue and operations has the lowest churn because clients depend on it for their business to run smoothly." },
      { q: "Why does compounding income matter more than one-time fees?", options: ["One-time fees are taxable", "Compounding income grows while you sleep and requires no additional effort", "Clients prefer monthly billing", "One-time fees are illegal for automations"], correct: 1, explanation: "Compounding monthly income means you're getting paid every month for work you already did. After 12 months, a $100/mo maintenance fee has generated more revenue than a $500 one-time setup — and it requires no new effort." },
      { q: "What is the fastest way to validate if an automation idea has market demand?", options: ["Build it and post on Product Hunt", "Search social media for people complaining about the repetitive task, then DM them", "Run a paid survey campaign", "Look at what Zapier workflows are most popular"], correct: 1, explanation: "The fastest validation: find people already complaining about the exact problem online, DM them, show a rough demo video, and ask if they'd pay. Real pain + real people + real willingness = validated idea." }
    ],
    6: [
      { q: "Why do traditional dev teams avoid building micro-SaaS?", options: ["It's technically too complex", "The market is too small to justify the development cost", "They prefer enterprise clients", "It's against SaaS industry regulations"], correct: 1, explanation: "Traditional dev teams need $50K-$200K to justify a build. A micro-SaaS serving 500 niche customers at $15/mo generates $90K/year — too small for a dev shop but perfectly viable for a solo vibe coder." },
      { q: "What signal tells you a micro-SaaS idea has enough market demand to pursue?", options: ["It has been done before", "You have 3+ people sign up for your waitlist within a week of launching the landing page", "It solves your own personal problem", "It has AI in the name"], correct: 1, explanation: "A waitlist with real signups from your target audience within the first week is the strongest signal of demand. If nobody signs up, the idea isn't connecting. If they do, you have immediate user feedback to iterate on." },
      { q: "What is the minimum viable feature set for a micro-SaaS MVP?", options: ["The core feature that solves the one specific problem, nothing more", "User accounts, billing, admin panel, email notifications, and API access", "At least 10 features to justify the price point", "A full desktop app and a mobile app"], correct: 0, explanation: "A micro-SaaS MVP should do ONE thing extremely well. The moment you add a second major feature, you've left the micro-SaaS category and entered the complexity of building a real product. One job, one screen, one outcome." }
    ],
    8: [
      { q: "Why does pricing an agent as a fraction of the human salary it replaces work better than hourly billing?", options: ["It's legally required", "Clients think in ROI, not hours — replacing a $4K/month VA at $500/mo is an obvious yes", "Hourly billing is more expensive", "Fractional pricing is industry standard"], correct: 1, explanation: "Hourly billing means you're selling your time. Fractional pricing means you're selling outcomes. If a human costs $4K/month and your agent does their job for $500/month, the ROI is 8x — the client doesn't need to think twice." },
      { q: "What makes an agent 'replace a workflow' vs. 'assist with a workflow'?", options: ["Replacement means it runs autonomously end-to-end without any human input; assistance means a human still does most of the work", "Agents that use LLMs replace workflows; skill files assist", "Replacement is more expensive than assistance", "Assistance is better for high-stakes decisions"], correct: 0, explanation: "An agent that assists still needs a human doing 80% of the work. An agent that replaces a workflow completes the entire loop autonomously — from input to output to delivery — with no human involvement in the middle." },
      { q: "How many iterations of real data should you run before showing an agent to a client?", options: ["1 iteration is enough", "At least 5 full iterations with real data to cover edge cases", "10 iterations minimum", "You don't need to test it yourself first"], correct: 1, explanation: "Run at least 5 complete iterations with real, messy data before showing a client. Edge cases are where agents fail — bad addresses, missing fields, ambiguous inputs. You need to know every failure mode before your client's reputation is on the line." }
    ],
    9: [
      { q: "Why does 'outcome-first' selling close faster than 'expertise-first' selling?", options: ["Clients don't care about outcomes", "Businesses buy results, not credentials — 'reduce your support tickets by 60% in 30 days' beats 'I know AI tools'", "Outcome-first is more expensive", "Expertise-first is the industry standard"], correct: 1, explanation: "Every business owner thinks in terms of outcomes: more revenue, less cost, fewer problems. Saying 'I can reduce your support workload by 60% in 2 weeks' is concrete, measurable, and directly tied to their P&L. Expertise is assumed, outcomes are purchased." },
      { q: "What is the fastest way to build social proof when starting from zero?", options: ["Buy fake testimonials", "Do 1-2 free projects, document the results, turn them into case studies with real metrics", "Wait for clients to volunteer testimonials", "Pay for a case study write-up"], correct: 1, explanation: "The fastest social proof: do 1-2 free or discounted projects, document the before/after with real numbers, turn results into case studies. Even a demo project with made-up-but-realistic data is infinitely more convincing than an empty portfolio." },
      { q: "What makes speed a competitive advantage in consulting?", options: ["Clients don't value speed", "When you deliver in 3 days what they expected in 4 weeks, trust and credibility explode — they want to hire you again immediately", "Speed means lower quality", "Slow delivery impresses clients more"], correct: 1, explanation: "When a client expects a 4-week delivery timeline and you show up with a working prototype in 3 days, their trust in you skyrockets. You've not only met expectations — you've shattered them. That client becomes your evangelist." }
    ]
  };

  const sections = [
    { id: 's0', label: 'Intro' },
    { id: 's1', label: '1. Intelligence Pipeline' },
    { id: 's2', label: '2. Customer Acquisition' },
    { id: 's3', label: '3. Custom Tools' },
    { id: 's4', label: '4. Digital Products' },
    { id: 's5', label: '5. Workflow Automation' },
    { id: 's6', label: '6. Micro-SaaS' },
    { id: 's7', label: '7. Build in Public' },
    { id: 's8', label: '8. Agent Products' },
    { id: 's9', label: '9. Consulting' },
    { id: 's10', label: '10. Second Brain' },
    { id: 's11', label: '11. Completion' }
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  // Interactive generators
  const generateCrawlConfig = () => {
    const cmd = `npx firecrawl scrape ${crawlUrl} \\
  --max-pages ${crawlPages} \\
  --output-format ${crawlFormat} \\
  --wait-for-selector .content`;

    const apiCall = `curl -X POST https://api.firecrawl.dev/v0/scrape \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url":"${crawlUrl}","pageOptions":{"onlyMainContent":true},"formats":["${crawlFormat}"]}'`;

    setCrawlOutput(`// Command Line:\n${cmd}\n\n// API Call:\n${apiCall}\n\n// Then ingest into Cortex:\n// 1. Save output to ~/openclaw/raw/${crawlUrl.replace(/[^a-z0-9]/gi,'_')}/\n// 2. Run: openclaw ingest ./raw/\n// 3. Ask: "What did you find at ${crawlUrl}?"`);
  };

  const generateLeadSheet = () => {
    if (!leadData.trim()) { setLeadOutput('// Paste your scraped data above, then click Generate.'); return; }
    const lines = leadData.trim().split('\n');
    const headers = ['Name', 'Email', 'Instagram', 'Website', 'Phone'].filter((h, i) => {
      if (i === 0) return leadFields.name;
      if (i === 1) return leadFields.email;
      if (i === 2) return leadFields.instagram;
      if (i === 3) return leadFields.website;
      if (i === 4) return leadFields.phone;
    });
    let output = '';
    if (leadFormat === 'csv') {
      output = headers.join(',') + '\n' + lines.map(l => headers.map(h => l).join(',')).join('\n');
    } else if (leadFormat === 'json') {
      output = JSON.stringify(lines.map(l => ({ raw: l, name: l, email: l, source: crawlUrl })), null, 2);
    } else {
      output = lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    }
    setLeadOutput(output);
  };

  const generateToolSpec = () => {
    const painPoints = {
      salon: { 'Appointment reminders': 'Automated SMS/email reminders 24h before appointments', 'Client intake forms': 'Digital form that collects preferences before service', 'Staff scheduling': 'Visual calendar with drag-drop shift management', 'Product inventory': 'Track retail products with low-stock alerts', 'Gift card management': 'Digital gift card sales with automatic redemption' },
      gym: { 'Class booking': 'Online booking system with instructor management', 'Lead intake': 'Fitness assessment form for new members', 'Membership tracking': 'Auto-renewal tracking with billing reminders', 'Prospect follow-up': 'Automated check-in sequences for trial members', 'Locker management': 'Digital key system with expiry tracking' },
      restaurant: { 'Reservation management': 'Online table booking with SMS confirmations', 'Takeout orders': 'Order-ahead system with pickup windows', 'Staff scheduling': 'Weekly rota builder with shift swap requests', 'Customer feedback': 'Post-meal survey with review link automation', 'Inventory ordering': 'Supplier auto-order when stock drops below threshold' },
      retail: { 'Point of sale': 'Fast checkout with barcode scanning and receipt printing', 'Customer loyalty': 'Stamp card system with automated rewards', 'Supplier orders': 'Auto-reorder system based on sales velocity', 'Layby management': 'Track deposits and payment schedules', 'Staff timesheets': 'Clock-in/out with hours auto-calculation' },
      service: { 'Job scheduling': 'Field service routing with map view', 'Quote builder': 'Template-based quote generator with PDF export', 'Customer portal': 'Self-service portal for job status and invoices', 'Invoice chasing': 'Automated overdue payment reminders', 'Lead intake': 'Detailed inquiry form routing to CRM' }
    };
    const pains = painPoints[bizType] || painPoints.salon;
    const selected = bizPain && pains[bizPain] ? pains[bizPain] : (bizPain || 'Custom solution');
    setToolSpec(`# Tool Spec: ${bizType.charAt(0).toUpperCase() + bizType.slice(1)} — ${bizPain || 'Custom Feature'}

## Problem Statement
${bizType.charAt(0).toUpperCase() + bizType.slice(1)} owners struggle with: ${bizPain || 'manual process that wastes time and creates errors'}.

## Solution
${selected}

## Before / After
**Before:** Owner does this manually every day. Takes X hours. Errors happen.
**After:** Automated. Runs in background. Zero errors after setup.

## Tech Stack
- Frontend: Next.js (fastest vibe code delivery)
- Backend: Supabase (auth + database + realtime)
- Styling: Tailwind CSS
- Deployment: Vercel (free tier works)
- SMS/Notifications: Twilio or Telegram bot

## User Journey
1. Customer visits tool → signs up (email or phone)
2. Enters their business details
3. Tool runs automatically or on trigger
4. Owner gets notification / sees dashboard

## Pricing Model
- Setup: ${bizBudget}
- Monthly maintenance: $50-$100/mo
- Total first-year value: ${bizBudget} + ($75 x 12) = ~$1,500

## Time to Build
1-2 days (vibe coded with AI)
`);
  };

  const generateProductSpec = () => {
    const personas = { developer: 'Experienced developers who want to skip scaffolding and ship features', marketer: 'Growth-focused marketers who need templates to move fast', entrepreneur: 'First-time founders who need structure to think clearly', ops: 'Operations leads who want systems before chaos sets in' };
    const before = prodBefore || '2-3 days of setup work, figuring out structure from scratch';
    const after = prodAfter || 'Ship features immediately, no setup overhead';
    setProdOutput(`# Digital Product: ${prodType.charAt(0).toUpperCase() + prodType.slice(1)}

## What It Solves
**Before:** ${before}
**After:** ${after}

## Target Persona
${personas[prodPersona]}

## Pricing: ${prodPrice}
${prodPrice === 'Free' ? 'Lead generation + email list building' : prodPrice === '$9' ? 'Impulse buy / low-commitment entry' : prodPrice === '$29' ? 'Core product tier / clear value' : 'Professional tier / serious buyers only'}

## Product Description (for Gumroad)
This ${prodType} solves the specific problem of: ${prodProblem || 'setup overhead and structural confusion'}.
Instead of spending days figuring out the right approach, you get a battle-tested starting point that works on day one.

## Feature List
- Core ${prodType} structure
- Customization guide
- Example walkthrough
- 30-day support thread access

## Landing Page Copy
**Headline:** Stop Starting From Zero.
**Subheadline:** The ${prodType} that ships you straight to the finish line.
**CTA:** Get It for ${prodPrice}

## Before/After Stats
Before: ${before}
After: ${after}
Time saved: 2-5 days per project
`);
  };

  const generateWorkflow = () => {
    const parts = [];
    parts.push(`// Manual Task: ${wfTask || 'Describe your repetitive task above'}`);
    if (wfAutomations.sheets) parts.push('1. Trigger: Google Sheet row added\n2. Action: Parse and validate data\n3. Action: Update secondary sheet / notify owner');
    if (wfAutomations.email) parts.push('1. Trigger: Form submission or schedule\n2. Action: Draft email via AI\n3. Action: Send via Gmail/SMTP or queue in Mailchimp');
    if (wfAutomations.calendar) parts.push('1. Trigger: Calendar event created\n2. Action: Auto-create prep task\n3. Action: Send agenda to invitees 24h before');
    if (wfAutomations.slack) parts.push('1. Trigger: New lead in CRM\n2. Action: Post to Slack channel #sales\n3. Action: Tag specific team member');
    if (wfAutomations.csv) parts.push('1. Trigger: CSV uploaded to Dropbox/email\n2. Action: Parse, deduplicate, enrich\n3. Action: Export clean CSV + summary report');

    const setupFee = 200;
    const monthlyFee = 75;
    setWfOutput(`${parts.join('\n\n')}

## Pricing Recommendation
- Setup fee: $${setupFee} (covers build + 1 revision)
- Monthly maintenance: $${monthlyFee}/mo
- First year value: $${setupFee + (monthlyFee * 12)} = $${setupFee + (monthlyFee * 12)}
- Target 5 similar clients in your area = $${monthlyFee * 5}/mo recurring

## n8n Workflow Template
Start with: https://n8n.io/workflows (search for your trigger type)
Key n8n nodes: Webhook, Google Sheets, HTTP Request, Slack, Email
`);
  };

  const generateMsaas = () => {
    const userTypes = { freelancer: 'Freelancers and solo service providers', developer: 'Developers and technical creators', marketer: 'Marketers and content creators', business: 'Small business owners (5-50 employees)' };
    const problem = msaasProblem || 'Describe the specific problem your tool solves';
    const names = ['Desk', 'Flow', 'Prep', 'Core', 'Stack', 'Base', 'Path', 'Kit'];
    const name = names[Math.floor(Math.random() * names.length)];
    setMsaasOutput(`# Micro-SaaS Validator: ${problem.split(' ').slice(0, 4).join(' ')}...

## Landing Page
**Headline:** ${problem.split(' ').slice(0, 6).join(' ')}
**Subheadheadline:** Built for ${userTypes[msaasUser]} who are stuck doing this manually.
**CTA:** Join Waitlist → (email capture)

## MVP Feature List
1. The ONE core feature that solves the problem
2. User accounts (email auth via Supabase)
3. Payment (Stripe, ${msaasPrice})
4. Dashboard showing the output/history
That's it. Nothing else until a user asks for it.

## Product Name Ideas
- ${name}.app (${msaasPrice.includes('15') ? '$15/mo' : msaasPrice.includes('5') ? '$5/mo' : msaasPrice.includes('25') ? '$25/mo' : 'one-time fee'})
- Domain: ${name.toLowerCase()}.io or ${name.toLowerCase()}.tools

## Validation Checklist
- [ ] Landing page live with waitlist
- [ ] 3+ real signups from target user
- [ ] Problem confirmed by at least 1 person
- [ ] Stripe account ready
- [ ] Vibe coded MVP (1-2 days max)
`);
  };

  const generateContentTopic = () => {
    const week = contentWeek || 'What you built or learned this week';
    const platformTips = {
      x: 'Keep hooks under 280 chars. Use line breaks for scanability. End with a CTA.',
      linkedin: 'Professional tone. First-person narrative. 150-300 words. End with insight.',
      youtube: 'Hook in first 10 seconds. Tutorial structure. 10-15 min. Add chapters.',
      blog: '500-800 words. Problem → solution → how-to → resources.'
    };
    const formatAngles = {
      tutorial: 'Step-by-step guide format',
      comparison: 'This vs That analysis',
      results: 'Here\'s what happened when I tried X',
      behind: 'Behind-the-scenes of building X'
    };
    setContentOutput(`## Content Strategy: ${week}

**Platform:** ${contentPlatform.toUpperCase()} — ${platformTips[contentPlatform]}
**Format:** ${formatAngles[contentFormat]}

## 3 Content Angles
1. **The Hook Angle:** Start with the surprising result or counterintuitive insight
   "I automated [X] in 4 hours. Here's what most people get wrong."
   
2. **The Problem Angle:** Describe the specific pain without your tool
   "Every week I spent 3 hours doing [task]. I finally fixed it."
   
3. **The How-To Angle:** Share the exact process someone can replicate
   "Here's the exact workflow I use to [outcome]. Step 1..."

## 5-Tweet X Thread Outline
1. Hook: The bold claim or surprising stat
2. Problem: The pain point in one sentence
3. The Tool: What you built/used
4. The Results: Specific numbers, before/after
5. CTA: "Here's the setup if you want it" + follow

## Engagement Tips
- Post at 8am or 6pm local time
- Respond to every comment in first 2 hours
- Quote tweet yourself with a key insight 1h after posting
`);
  };

  const generateAgentSpec = () => {
    const taskType = agentTask;
    const monthly = parseInt(agentCost) || 3000;
    const yourPrice = Math.round(monthly * 0.12);
    const savings = monthly - yourPrice;
    setAgentOutput(`# Agent Spec: ${taskType.charAt(0).toUpperCase() + taskType.slice(1)} Agent

## Task Type: ${taskType}
## Current Manual Process
${agentProcess || 'Describe step by step what the human currently does...'}
Example: Reads inbound email → checks order in Shopify → approves/refuses → sends response

## Agent Workflow
1. **Trigger:** Receives input (email / form / API call)
2. **Parse:** Extracts relevant information from input
3. **Decide:** Applies rules (e.g., refund under $50 = auto-approve)
4. **Execute:** Takes action (sends email, updates spreadsheet, books calendar)
5. **Report:** Sends summary to human supervisor (CC or Slack)

## System Prompt Snippet
"You are a ${taskType} agent. For every inbound request:
1. Extract the customer's name, account details, and the core request.
2. Check the relevant database/API for context.
3. Apply the decision rules provided by your supervisor.
4. If automated: execute the action and send a confirmation.
5. If uncertain: escalate to supervisor with summary."

## Pricing
- Human costs: $${monthly}/month
- You charge: $${yourPrice}/month
- Client saves: $${savings}/month (${Math.round((savings/monthly)*100)}% reduction)
- Your time to build: 1 week
- ROI for client: immediate

## Tools Needed
- Email (Gmail API or SMTP)
- Database (Supabase or Airtable)
- Decision logic (Claude function calling)
- Notification (Slack webhook or email)
`);
  };

  const generateProposal = () => {
    const domainMap = { ops: 'Operations efficiency', marketing: 'Marketing performance', sales: 'Sales conversion', support: 'Customer support reduction' };
    const timelineMap = { '1 week': '7 calendar days', '2 weeks': '14 calendar days', '1 month': '30 calendar days' };
    const priceMap = { 'under 1k': '$500-$900', '1k-5k': '$1,500-$4,500', '5k-10k': '$5,000-$9,000', '10k+': '$10,000-$15,000' };
    setPropOutput(`# Consulting Proposal

## Client Problem Statement
${propOutcome || 'Describe the outcome you will deliver...'}

## Problem Category
${domainMap[propDomain]}

## Deliverables
1. Automated system / AI pipeline that handles [specific task]
2. Documentation so the team can maintain it
3. 2-week post-delivery support window

## Timeline
${timelineMap[propTimeline] || '14 calendar days'}

## Success Metrics (KPIs)
- [ ] [Specific measurable outcome 1]
- [ ] [Specific measurable outcome 2]
- [ ] Time saved per week: [X] hours

## Investment
${priceMap[propBudget] || '$2,500'} fixed price
- 50% upon agreement
- 50% upon delivery

## Social Proof Placeholder
"[Client name] saw [specific result] within [timeframe] of implementing the system."
(Add your own case study results here)

## Next Steps
1. Agree on scope and timeline
2. Sign proposal + pay 50% deposit
3. I deliver the working system
4. Client reviews + pays final 50%
5. 2-week support period begins
`);
  };

  const generateKnowledgeBase = () => {
    const project = kbProject || 'my-knowledge-base';
    const topics = kbTopics || 'AI tools, workflow optimization, business building';
    const safe = project.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setKbOutput(`# Create Your Second Brain

## Folder Structure Commands
\`\`\`
mkdir -p ~/${safe}/{raw,wiki,outputs}
cd ~/${safe}
touch CLAUDE.md
\`\`\`

## CLAUDE.md Schema File
\`\`\`markdown
# ${project} Knowledge Base

## What This Is
A personal knowledge base about ${topics}.
Built to stop losing information and start compounding learning.

## How It's Organized
- raw/ = unprocessed source material. Never edit these.
- wiki/ = AI-organized summaries and topic pages.
- outputs/ = generated reports and answers.

## Wiki Rules
- Every topic gets its own .md file in wiki/
- Every wiki file starts with a 1-paragraph summary
- Link related topics using [[topic-name]]
- Maintain INDEX.md listing all topics
- Never edit wiki/ by hand

## My Interests
- ${topics.split(',')[0]?.trim() || 'Topic 1'}
- ${topics.split(',')[1]?.trim() || 'Topic 2'}
- ${topics.split(',')[2]?.trim() || 'Topic 3'}
\`\`\`

## Monthly Health Check Prompt
"Review the entire wiki/ directory. Flag contradictions between articles.
Find topics mentioned but never explained. List claims not backed by
a source in raw/. Suggest 3 new articles to fill gaps."

## Compounding Loop
Every time you add raw files → ask AI to update wiki → save AI answers
to outputs/ → next question builds on previous answers.
`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 05</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Intelligence Pipeline + Agent Products</h2>
        </div>
        <button onClick={onClose} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class
        </button>
      </div>

      <div ref={lessonScrollRef} className="lesson-scroll-pane flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Progress Tracker */}
        <div className="mb-8 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]">
          <div className="bg-[#111] px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 05 Progress</span>
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => {
              const sectionNum = parseInt(s.id.replace('s', ''));
              const isDone = completedSections.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleSection(s.id)} className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${isDone ? 'text-[#22c55e]' : 'text-[#555]'}`}>
                  <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                    {isDone && <span className="block w-2 h-2 bg-current"></span>}
                  </span>
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* INTRO */}
        <div id="c5-intro" className="mb-24">
          <NeedBox title="What you need before you start" items={[
            "OpenClaw workspace with Cortex running.",
            "Firecrawl or similar crawler tool installed.",
            "A target niche or industry in mind for income generation.",
            "One vibe coding tool (Cursor, Claude Code, or similar)."
          ]} />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase text-center">
            Intelligence Pipeline <br/><span className="italic text-[#22c55e]">+ Agent Products.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
            Turn your AI skills into income machines. Web crawlers, micro-SaaS, automations, and agents that replace high-value employees.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[
              { num: '8', label: 'Income paths covered', icon: '$' },
              { num: '11', label: 'Hands-on sections', icon: '#' },
              { num: '5', label: 'Interactive builders', icon: '>' },
              { num: '15', label: 'Quiz questions', icon: '?' }
            ].map(item => (
              <div key={item.num} className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
                <span className="font-mono text-[#22c55e] font-black text-4xl">{item.icon}</span>
                <div className="font-sans font-black text-3xl uppercase">{item.num} <span className="text-[#555] text-lg">{item.label}</span></div>
              </div>
            ))}
          </div>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-3">// The 8-Lane Highway</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Web Crawlers', 'Custom Tools', 'Digital Products', 'Automations', 'Micro-SaaS', 'Build in Public', 'Agent Products', 'Consulting'].map((lane, i) => (
                <div key={i} className="font-sans text-[#eae7de] text-sm font-bold uppercase">{i + 1}. {lane}</div>
              ))}
            </div>
          </div>
          <CourseBoostPanel title="Class 05 Income Prompts" checklist={["Identify your highest-value automation opportunity", "Draft first micro-SaaS landing page", "Write agent spec for one workflow"]} prompts={["\"Help me identify 3 automation opportunities in my current workflow that would save me the most time per week.\"", "\"Review my skill set and recommend the fastest income path given my current tools and experience.\""]} />
        </div>

        {/* SECTION 1: Intelligence Pipeline */}
        <div id="c5-s1" className="mb-24">
          <SectionMeta minutes="10 min" focus="Cortex + Firecrawl" />
          <NeedBox title="What you need" items={["OpenClaw workspace with Cortex running", "Firecrawl installed (npx firecrawl-cli)", "A target niche or industry in mind"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. Intelligence Pipeline: From Chaos to Cash</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Most people don't know what's publicly available about their market. The intelligence pipeline changes that — it takes raw web data and turns it into a searchable knowledge base your agent can query.
          </p>
          <MacWindow title="cortex-pipeline.sh" className="mb-8">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// Step 1: Crawl the target domain</p>
              <p className="text-[#38bdf8]">$ npx firecrawl scrape https://example.com --max-pages 50 --format markdown</p>
              <p className="text-[#aaa]">// Step 2: Ingest into Cortex</p>
              <p className="text-[#38bdf8]">$ openclaw ingest ./raw/example-com/</p>
              <p className="text-[#aaa]">// Step 3: Query your new brain</p>
              <p className="text-[#38bdf8]">&gt; "What products does example.com sell and what are their main pain points?"</p>
              <p className="text-[#aaa]">// Output: Structured analysis from 47 pages of crawled content</p>
            </div>
          </MacWindow>
          <div className="bg-[#111] p-6 border-[3px] border-[#333] mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// Key Insight</p>
            <p className="font-serif text-[#eae7de] text-lg leading-relaxed">
              "If you can't explain your market to your agent, your agent can't serve your market."
            </p>
          </div>

          {/* Interactive: Crawl Config Builder */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Crawl Config Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={crawlUrl} onChange={e => setCrawlUrl(e.target.value)} placeholder="https://targetsite.com" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={crawlPages} onChange={e => setCrawlPages(e.target.value)} placeholder="Max pages (e.g. 10)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <select value={crawlFormat} onChange={e => setCrawlFormat(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <button onClick={generateCrawlConfig} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Crawl Command</button>
            {crawlOutput && <CopyBlock code={crawlOutput} />}
          </div>

          <CheckpointCard
            title="Intelligence Pipeline Checkpoints"
            items={[
              { type: 'pass', text: 'You have a live crawl running against a target domain' },
              { type: 'pass', text: 'Cortex has received and stored at least 5 pages from your crawl' },
              { type: 'fail', text: 'Crawl is still running with no destination for the output' },
              { type: 'fail', text: "You haven't asked Cortex a question about what it just ingested" }
            ]}
          />
        </div>

        {/* SECTION 2: Customer Acquisition Machine */}
        <div id="c5-s2" className="mb-24">
          <SectionMeta minutes="12 min" focus="Lead gen pipeline" />
          <NeedBox title="What you need" items={["Crawler output (emails + social handles of 20+ businesses)", "Bulk email service account", "DM automation tool configured"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. Customer Acquisition Machine</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            The 5-step pipeline: <span className="font-mono text-[#22c55e]">Firecrawl → email scrape → bulk email → DM automation → close the client.</span> Each step compounds on the last.
          </p>
          <MacWindow title="lead-pipeline.sh" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-3">
              <p className="text-[#aaa]">// The agent pipeline in action:</p>
              <p className="text-[#22c55e]">&gt; "I need leads for gym owners in Austin, TX who don't have a booking system."</p>
              <p className="text-[#38bdf8]">→ Crawling 47 gym websites...</p>
              <p className="text-[#38bdf8]">→ Extracting contact data, social handles, website status...</p>
              <p className="text-[#38bdf8]">→ Output: 47 qualified leads</p>
              <p className="text-[#aaa]">  12 with Instagram accounts</p>
              <p className="text-[#aaa]">  8 with websites (booking system gap identified)</p>
              <p className="text-[#aaa]">  3 already using competitors</p>
            </div>
          </MacWindow>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// The 5-Step Acquisition Loop</p>
            {[
              ['1', 'Firecrawl', 'Crawl target niches for business data'],
              ['2', 'Enrich', 'Extract emails, social handles, phone numbers'],
              ['3', 'Segment', 'Filter by industry, size, tech stack'],
              ['4', 'Outreach', 'Personalized email + DM campaigns'],
              ['5', 'Close', 'Deliver value, ask for testimonial']
            ].map(([n, tool, desc]) => (
              <div key={n} className="flex items-center gap-4 py-2 border-b border-[#333] last:border-0">
                <span className="font-mono font-black text-[#22c55e] text-lg w-6">{n}</span>
                <span className="font-mono font-bold text-[#eae7de] w-24">{tool}</span>
                <span className="font-serif text-[#aaa] text-sm">{desc}</span>
              </div>
            ))}
          </div>

          {/* Interactive: Lead Sheet Builder */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Lead Sheet Builder</h3>
            <div className="mb-4">
              <textarea value={leadData} onChange={e => setLeadData(e.target.value)} placeholder="Paste scraped data here (one lead per line)..." className="w-full border-[2px] border-[#111] p-4 font-mono text-sm h-32" />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {[['name', leadFields.name, () => setLeadFields(f => ({...f, name: !f.name}))], ['email', leadFields.email, () => setLeadFields(f => ({...f, email: !f.email}))], ['instagram', leadFields.instagram, () => setLeadFields(f => ({...f, instagram: !f.instagram}))], ['website', leadFields.website, () => setLeadFields(f => ({...f, website: !f.website}))], ['phone', leadFields.phone, () => setLeadFields(f => ({...f, phone: !f.phone}))]].map(([field, checked, toggle]) => (
                <label key={field} className="flex items-center gap-2 font-mono text-sm cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={toggle} className="w-4 h-4" />
                  {field}
                </label>
              ))}
              <select value={leadFormat} onChange={e => setLeadFormat(e.target.value)} className="border-[2px] border-[#111] px-3 py-1 font-mono text-sm">
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="text">Formatted Text</option>
              </select>
            </div>
            <button onClick={generateLeadSheet} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Clean Output</button>
            {leadOutput && <CopyBlock code={leadOutput} />}
          </div>

          <div className="text-center mb-6">
            <button onClick={() => { setQuizActive(true); setQuizSection(2); }} className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer">
              Take Quiz — Section 2
            </button>
          </div>

          <CheckpointCard
            title="Customer Acquisition Checkpoints"
            items={[
              { type: 'pass', text: 'You have 20+ qualified leads in a spreadsheet' },
              { type: 'pass', text: 'Your outreach message is drafted and tested on yourself first' },
              { type: 'fail', text: 'You scraped random data with no specific customer in mind' },
              { type: 'fail', text: 'Your outreach message sounds like every other spammer' }
            ]}
          />
        </div>

        {/* SECTION 3: Custom Tools for Small Businesses */}
        <div id="c5-s3" className="mb-24">
          <SectionMeta minutes="10 min" focus="Vibe coding small biz tools" />
          <NeedBox title="What you need" items={["Vibe coding tool (Cursor, Claude Code, or similar)", "Understanding of ONE small business's workflow pain", "Basic landing page template"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. Custom Tools for Small Businesses</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Small businesses need simple software but can't afford $10K+ dev shops. Build once, sell to an entire niche vertical. <span className="font-mono text-[#22c55e]">Appointment systems, inventory trackers, lead capture forms.</span>
          </p>
          <MacWindow title="salon-tool.spec.md" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// Customer says:</p>
              <p className="text-[#eae7de]">"I hate manually texting appointment reminders. I need clients to book online and I want to send promotions."</p>
              <p className="text-[#aaa]">// AI outputs:</p>
              <p className="text-[#22c55e]">→ Appointment system spec</p>
              <p className="text-[#38bdf8]">  - Booking widget (embeddable)</p>
              <p className="text-[#38bdf8]">  - SMS reminders via Twilio</p>
              <p className="text-[#38bdf8]">  - Promotion blast tool</p>
              <p className="text-[#38bdf8]">  - Client database</p>
              <p className="text-[#aaa]">Stack: Next.js + Supabase</p>
              <p className="text-[#aaa]">Time to build: 1-2 days</p>
              <p className="text-[#aaa]">Price: $500 setup + $75/mo</p>
            </div>
          </MacWindow>

          {/* Interactive: Tool Spec Generator */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Tool Spec Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select value={bizType} onChange={e => setBizType(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="salon">Hair Salon</option>
                <option value="gym">Gym / Fitness</option>
                <option value="restaurant">Restaurant</option>
                <option value="retail">Retail Store</option>
                <option value="service">Service Business</option>
              </select>
              <select value={bizPain} onChange={e => setBizPain(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="">Select common pain...</option>
                <option>Appointment reminders</option>
                <option>Client intake forms</option>
                <option>Staff scheduling</option>
                <option>Customer feedback</option>
                <option>Lead follow-up</option>
              </select>
              <select value={bizBudget} onChange={e => setBizBudget(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option>$500-$2K setup</option>
                <option>$2K-$5K setup</option>
                <option>$5K+ setup</option>
              </select>
            </div>
            <button onClick={generateToolSpec} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Tool Spec</button>
            {toolSpec && <CopyBlock code={toolSpec} />}
          </div>

          <CheckpointCard
            title="Custom Tools Checkpoints"
            items={[
              { type: 'pass', text: 'You have talked to a real small business owner and documented their exact pain' },
              { type: 'pass', text: 'You have a spec document ready to hand to your AI coding assistant' },
              { type: 'fail', text: "You've been researching tools instead of talking to customers" },
              { type: 'fail', text: "You're building for a business type you've never interacted with" }
            ]}
          />
        </div>

        {/* SECTION 4: Digital Products */}
        <div id="c5-s4" className="mb-24">
          <SectionMeta minutes="8 min" focus="Boilerplates, templates, prompts" />
          <NeedBox title="What you need" items={["Something you've built that saved you time", "Gumroad or Lemon Squeezy account", "A clear target persona"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Templates, Starter Kits & Prompt Packs</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Build-once, sell-repeatedly. <span className="font-mono text-[#22c55e]">Near-zero marginal cost.</span> The best digital products solve a very specific starting-point problem — the buyer skips 2 days of setup.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['SaaS Boilerplates', 'Notion Templates', 'Figma Kits', 'Prompt Libraries'].map((type, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-white p-4 text-center shadow-[4px_4px_0_0_#111]">
                <span className="font-sans font-black text-lg uppercase">{type}</span>
              </div>
            ))}
          </div>

          {/* Interactive: Product Spec Builder */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Digital Product Spec Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select value={prodType} onChange={e => setProdType(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="boilerplate">SaaS Boilerplate</option>
                <option value="template">Notion Template</option>
                <option value="starter-kit">Starter Kit</option>
                <option value="prompt-pack">Prompt Pack</option>
              </select>
              <select value={prodPersona} onChange={e => setProdPersona(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="developer">Developer</option>
                <option value="marketer">Marketer</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="ops">Ops</option>
              </select>
              <select value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="Free">Free</option>
                <option value="$9">$9</option>
                <option value="$29">$29</option>
                <option value="$97">$97</option>
              </select>
              <input value={prodProblem} onChange={e => setProdProblem(e.target.value)} placeholder="Problem it solves..." className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={prodBefore} onChange={e => setProdBefore(e.target.value)} placeholder="Before (e.g. 3 days setup)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={prodAfter} onChange={e => setProdAfter(e.target.value)} placeholder="After (e.g. 2 hours)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <button onClick={generateProductSpec} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Product Spec</button>
            {prodOutput && <CopyBlock code={prodOutput} />}
          </div>

          <CheckpointCard
            title="Digital Products Checkpoints"
            items={[
              { type: 'pass', text: 'You have identified ONE thing you built that has reusable value' },
              { type: 'pass', text: 'Gumroad store is live (even if empty)' },
              { type: 'fail', text: "You're waiting for the 'perfect' product instead of shipping" },
              { type: 'fail', text: "Your product solves a problem you don't actually understand deeply" }
            ]}
          />
        </div>

        {/* SECTION 5: Workflow Automations */}
        <div id="c5-s5" className="mb-24">
          <SectionMeta minutes="10 min" focus="n8n + Make + Zapier" />
          <NeedBox title="What you need" items={["n8n, Make, or Zapier account (free tier works)", "One repetitive manual task you can observe", "Understanding of B2B 'annoyance work'"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. Paid Workflow Automations</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You're not selling automation. <span className="font-mono text-[#22c55e]">You're selling hours back.</span> B2B annoyance work is a goldmine: cleaning spreadsheets, generating reports, nudging follow-ups. Low churn, recurring revenue.
          </p>
          <MacWindow title="real-estate-workflow.json" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// Problem: Real estate agent spends 3 hours every Friday</p>
              <p className="text-[#aaa]">// compiling leads from 5 different platforms into one spreadsheet.</p>
              <p className="text-[#eae7de]">// n8n workflow:</p>
              <p className="text-[#38bdf8]">Trigger: Schedule (Friday 5pm)</p>
              <p className="text-[#38bdf8]">→ Scrape 5 APIs (Zillow, Realtor, MLS, etc.)</p>
              <p className="text-[#38bdf8]">→ Combine + deduplicate records</p>
              <p className="text-[#38bdf8]">→ Format with custom fields</p>
              <p className="text-[#38bdf8]">→ Export to Google Sheet</p>
              <p className="text-[#aaa]">// Saves 3 hours/week. Price: $200 setup + $75/mo</p>
            </div>
          </MacWindow>

          {/* Interactive: Workflow Builder */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Workflow Builder</h3>
            <div className="mb-4">
              <textarea value={wfTask} onChange={e => setWfTask(e.target.value)} placeholder="Describe the repetitive manual task you want to automate..." className="w-full border-[2px] border-[#111] p-4 font-mono text-sm h-24" />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="font-mono text-xs uppercase font-bold text-[#555]">Automations:</span>
              {[['Google Sheets', wfAutomations.sheets, () => setWfAutomations(f => ({...f, sheets: !f.sheets}))], ['Email Send', wfAutomations.email, () => setWfAutomations(f => ({...f, email: !f.email}))], ['Calendar Event', wfAutomations.calendar, () => setWfAutomations(f => ({...f, calendar: !f.calendar}))], ['Slack Notify', wfAutomations.slack, () => setWfAutomations(f => ({...f, slack: !f.slack}))], ['CSV Parse', wfAutomations.csv, () => setWfAutomations(f => ({...f, csv: !f.csv}))]].map(([label, checked, toggle]) => (
                <label key={label} className="flex items-center gap-2 font-mono text-sm cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={toggle} className="w-4 h-4" />
                  {label}
                </label>
              ))}
            </div>
            <button onClick={generateWorkflow} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Workflow Spec</button>
            {wfOutput && <CopyBlock code={wfOutput} />}
          </div>

          <div className="text-center mb-6">
            <button onClick={() => { setQuizActive(true); setQuizSection(5); }} className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer">
              Take Quiz — Section 5
            </button>
          </div>

          <CheckpointCard
            title="Workflow Automation Checkpoints"
            items={[
              { type: 'pass', text: 'You can name the exact repetitive task you are going to automate' },
              { type: 'pass', text: 'You have a demo video (even rough) of the automation working' },
              { type: 'fail', text: "You're building an automation nobody asked for" },
              { type: 'fail', text: "You haven't tested it yourself for a week before showing it to clients" }
            ]}
          />
        </div>

        {/* SECTION 6: Micro-SaaS */}
        <div id="c5-s6" className="mb-24">
          <SectionMeta minutes="12 min" focus="One job, one screen, one outcome" />
          <NeedBox title="What you need" items={["Vibe coding tool ready", "A very specific problem (not a broad category)", "Stripe account for payments"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Micro-SaaS: One Job, One Screen, One Outcome</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Traditional dev teams can't justify building something this niche — that's why <span className="font-mono text-[#22c55e]">you can own the entire market.</span> Vibe coding cuts months to days. Test many ideas, find what connects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'Invoice Generator', audience: 'for dog walkers' },
              { name: 'Script Creator', audience: 'for TikTokers' },
              { name: 'Client Prep Deck', audience: 'for freelancers' }
            ].map((idea, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#111] p-6 text-center">
                <span className="font-sans font-black text-[#eae7de] text-lg uppercase block mb-2">{idea.name}</span>
                <span className="font-mono text-[#22c55e] text-sm">{idea.audience}</span>
              </div>
            ))}
          </div>

          {/* Interactive: Micro-SaaS Validator */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Micro-SaaS Validator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <textarea value={msaasProblem} onChange={e => setMsaasProblem(e.target.value)} placeholder="Describe the specific problem..." className="border-[2px] border-[#111] p-4 font-mono text-sm md:col-span-3 h-24" />
              <select value={msaasUser} onChange={e => setMsaasUser(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="freelancer">Freelancer</option>
                <option value="developer">Developer</option>
                <option value="marketer">Marketer</option>
                <option value="business">Small Business Owner</option>
              </select>
              <select value={msaasPrice} onChange={e => setMsaasPrice(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="$5/mo">$5/mo</option>
                <option value="$15/mo">$15/mo</option>
                <option value="$25/mo">$25/mo</option>
                <option value="one-time">One-time fee</option>
              </select>
            </div>
            <button onClick={generateMsaas} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Validate Micro-SaaS Idea</button>
            {msaasOutput && <CopyBlock code={msaasOutput} />}
          </div>

          <div className="text-center mb-6">
            <button onClick={() => { setQuizActive(true); setQuizSection(6); }} className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer">
              Take Quiz — Section 6
            </button>
          </div>

          <CheckpointCard
            title="Micro-SaaS Checkpoints"
            items={[
              { type: 'pass', text: 'Landing page is live with a waitlist button and 3+ signups' },
              { type: 'pass', text: 'You can explain the entire product in one sentence' },
              { type: 'fail', text: 'Product does 10 things instead of 1 thing perfectly' },
              { type: 'fail', text: "You're still in 'planning' mode after 2 weeks instead of collecting real emails" }
            ]}
          />
        </div>

        {/* SECTION 7: Build in Public */}
        <div id="c5-s7" className="mb-24">
          <SectionMeta minutes="8 min" focus="Content flywheel" />
          <NeedBox title="What you need" items={["A tool you're currently building (any stage counts)", "X/Twitter or LinkedIn account", "Recording software (even Zoom works)"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. Build in Public: The Compounding Flywheel</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Content creates audience. Audience creates distribution. Distribution creates monetization. <span className="font-mono text-[#22c55e]">Every tool becomes a case study. Every learning becomes content. Every case study becomes trust.</span>
          </p>
          <MacWindow title="x-thread-idea.txt" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// The thread that generated 2,000 followers and 3 inquiries:</p>
              <p className="text-[#22c55e]">Tweet 1: "I built a lead scraper for gym owners in 4 hours using Firecrawl. Here's exactly how."</p>
              <p className="text-[#eae7de]">Tweet 2: "The problem: Gym owners don't have time to prospect."</p>
              <p className="text-[#eae7de]">Tweet 3: "The tool: [screenshot of the scraper running]"</p>
              <p className="text-[#eae7de]">Tweet 4: "The results: 47 leads in 20 minutes."</p>
              <p className="text-[#aaa]">Tweet 5: "Here's the setup if you want it → [link]"</p>
            </div>
          </MacWindow>

          {/* Interactive: Content Topic Generator */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Content Topic Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <textarea value={contentWeek} onChange={e => setContentWeek(e.target.value)} placeholder="What did you build or learn this week?" className="border-[2px] border-[#111] p-4 font-mono text-sm md:col-span-3 h-24" />
              <select value={contentPlatform} onChange={e => setContentPlatform(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="x">X / Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="blog">Blog</option>
              </select>
              <select value={contentFormat} onChange={e => setContentFormat(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="tutorial">Tutorial</option>
                <option value="comparison">Comparison</option>
                <option value="results">Results Post</option>
                <option value="behind">Behind-the-Scenes</option>
              </select>
            </div>
            <button onClick={generateContentTopic} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Content Plan</button>
            {contentOutput && <CopyBlock code={contentOutput} />}
          </div>

          <CheckpointCard
            title="Build in Public Checkpoints"
            items={[
              { type: 'pass', text: 'You have posted content about your build process at least once this week' },
              { type: 'pass', text: 'Your content answers: what did you build, what problem does it solve, what can others learn' },
              { type: 'fail', text: "You're creating content nobody would want to bookmark" },
              { type: 'fail', text: "You're faking expertise you don't have (it shows)" }
            ]}
          />
        </div>

        {/* SECTION 8: AI Agents */}
        <div id="c5-s8" className="mb-24">
          <SectionMeta minutes="12 min" focus="Agent architecture" />
          <NeedBox title="What you need" items={["OpenAI / Claude / MiniMax API access", "One repetitive task a business currently pays a human to do", "Understanding of agent architecture (tools + memory + instructions)"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. AI Agents That Replace Labor</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            "I'm not building a chatbot. <span className="font-mono text-[#22c55e]">I'm replacing a human workflow.</span>" If the human costs $4K/month, charge $500/month. ROI is obvious — clients say yes fast.
          </p>
          <MacWindow title="refund-agent.spec.md" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// Task: Shopify store pays $3,000/month for a VA handling refund requests.</p>
              <p className="text-[#aaa]">// The VA reads email → checks order → approves/denies → responds.</p>
              <p className="text-[#eae7de]">// Agent spec:</p>
              <p className="text-[#38bdf8]">1. Reads inbound refund email</p>
              <p className="text-[#38bdf8]">2. Checks order via Shopify API</p>
              <p className="text-[#38bdf8]">3. Approves refunds under $50; escalates above</p>
              <p className="text-[#38bdf8]">4. Sends personalized response</p>
              <p className="text-[#aaa]">// Saves $2,500/mo. Charge: $500/mo. Build time: 1 week.</p>
            </div>
          </MacWindow>

          {/* Interactive: Agent Spec Builder */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Agent Spec Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select value={agentTask} onChange={e => setAgentTask(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="lead qualification">Lead Qualification</option>
                <option value="customer support">Customer Support</option>
                <option value="research">Research</option>
                <option value="scheduling">Scheduling</option>
                <option value="report generation">Report Generation</option>
              </select>
              <input value={agentCost} onChange={e => setAgentCost(e.target.value)} placeholder="Human monthly cost (e.g. 3000)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <textarea value={agentProcess} onChange={e => setAgentProcess(e.target.value)} placeholder="Describe the manual process step by step..." className="border-[2px] border-[#111] p-4 font-mono text-sm md:col-span-3 h-24" />
            </div>
            <button onClick={generateAgentSpec} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Agent Spec</button>
            {agentOutput && <CopyBlock code={agentOutput} />}
          </div>

          <div className="text-center mb-6">
            <button onClick={() => { setQuizActive(true); setQuizSection(8); }} className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer">
              Take Quiz — Section 8
            </button>
          </div>

          <CheckpointCard
            title="Agent Products Checkpoints"
            items={[
              { type: 'pass', text: 'You can name the exact human workflow you are replacing' },
              { type: 'pass', text: 'You have tested the agent with real data for at least 5 full iterations' },
              { type: 'fail', text: 'The agent requires more human oversight than the original human' },
              { type: 'fail', text: "You're charging $50/mo for something that replaces a $4K/month role" }
            ]}
          />
        </div>

        {/* SECTION 9: Consulting */}
        <div id="c5-s9" className="mb-24">
          <SectionMeta minutes="10 min" focus="Outcome-first selling" />
          <NeedBox title="What you need" items={["One specific outcome you can deliver with AI + automation", "A deck or one-pager showing before/after", "Fixed-price proposal template"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. Productized Consulting: Sell Outcomes, Not Hours</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            "I don't sell my time. <span className="font-mono text-[#22c55e]">I sell the result. The result is the reduction of pain.</span>" The secret weapon: speed. Client expects 4 weeks, you deliver in 3 days. Trust skyrockets.
          </p>

          {/* Interactive: Consulting Proposal Generator */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Consulting Proposal Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <textarea value={propOutcome} onChange={e => setPropOutcome(e.target.value)} placeholder="Describe the specific outcome you will deliver..." className="border-[2px] border-[#111] p-4 font-mono text-sm md:col-span-3 h-24" />
              <select value={propDomain} onChange={e => setPropDomain(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="ops">Operations</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
              </select>
              <select value={propTimeline} onChange={e => setPropTimeline(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="1 week">1 Week</option>
                <option value="2 weeks">2 Weeks</option>
                <option value="1 month">1 Month</option>
              </select>
              <select value={propBudget} onChange={e => setPropBudget(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="under 1k">Under $1K</option>
                <option value="1k-5k">$1K - $5K</option>
                <option value="5k-10k">$5K - $10K</option>
                <option value="10k+">$10K+</option>
              </select>
            </div>
            <button onClick={generateProposal} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Proposal</button>
            {propOutput && <CopyBlock code={propOutput} />}
          </div>

          <div className="text-center mb-6">
            <button onClick={() => { setQuizActive(true); setQuizSection(9); }} className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer">
              Take Quiz — Section 9
            </button>
          </div>

          <CheckpointCard
            title="Consulting Checkpoints"
            items={[
              { type: 'pass', text: 'You have a one-pager deck showing real results from a client (even a demo)' },
              { type: 'pass', text: 'You can articulate your offer in one sentence without using the word "everything"' },
              { type: 'fail', text: 'Your proposal says "I can do anything" instead of "I deliver X by Y date"' },
              { type: 'fail', text: "You're waiting for warm intros when you have a cold outreach strategy ready" }
            ]}
          />
        </div>

        {/* SECTION 10: Second Brain */}
        <div id="c5-s10" className="mb-24">
          <SectionMeta minutes="8 min" focus="Personal knowledge base" />
          <NeedBox title="What you need" items={["OpenClaw workspace", "15+ minutes to dump everything you already know into raw files", "Claude Code / Cursor / any AI tool that reads local files"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. The Second Brain: Personal Knowledge Base</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You already collect information, you just can't find it when you need it. <span className="font-mono text-[#22c55e]">Three folders + one schema file = searchable wiki maintained by AI.</span>
          </p>
          <MacWindow title="knowledge-base.sh" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// The architecture:</p>
              <p className="text-[#38bdf8]">raw/       — unprocessed articles, notes, screenshots</p>
              <p className="text-[#38bdf8]">wiki/      — AI-written summaries (never edit by hand)</p>
              <p className="text-[#38bdf8]">outputs/   — AI answers and reports</p>
              <p className="text-[#aaa]">// CLAUDE.md — schema file that teaches the AI</p>
              <p className="text-[#aaa]">// The loop:</p>
              <p className="text-[#eae7de]">Add raw files → Ask AI to update wiki → Save answers to outputs</p>
              <p className="text-[#aaa]">// Monthly health check:</p>
              <p className="text-[#aaa]">"Review wiki/. Flag contradictions. Find gaps."</p>
            </div>
          </MacWindow>

          {/* Interactive: Knowledge Base Setup */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Knowledge Base Setup Wizard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input value={kbProject} onChange={e => setKbProject(e.target.value)} placeholder="Project name (e.g. my-ai-knowledge)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={kbTopics} onChange={e => setKbTopics(e.target.value)} placeholder="Focus topics (comma-separated)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <button onClick={generateKnowledgeBase} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Setup Commands</button>
            {kbOutput && <CopyBlock code={kbOutput} />}
          </div>

          <div className="text-center mb-6">
            <button onClick={() => { setQuizActive(true); setQuizSection(10); }} className="font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[6px_6px_0_0_#111] transition-colors cursor-pointer">
              Take Quiz — Section 10
            </button>
          </div>

          <CheckpointCard
            title="Second Brain Checkpoints"
            items={[
              { type: 'pass', text: "Three folders exist and raw/ has at least 5 source files in it" },
              { type: 'pass', text: 'You can ask the AI "what do I know about [topic]" and get a real answer' },
              { type: 'fail', text: 'You spent more time configuring tools than actually dumping information' },
              { type: 'fail', text: "You created the folders and then never touched them again" }
            ]}
          />
        </div>

        {/* SECTION 11: Completion Card */}
        <div id="c5-s11" className="mb-24">
          <div className="border-[4px] border-[#111] bg-[#111] p-8 shadow-[12px_12px_0_0_#22c55e] mb-8">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 05 — Complete</span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-[#eae7de] mt-4 uppercase">Intelligence Pipeline + Agent Products</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              "You can ingest any website into Cortex and query it intelligently.",
              "You have a concrete path from skills to income (8 options, ranked by difficulty).",
              "You have a working micro-SaaS or automation idea with a waitlist.",
              "You can build and sell an AI agent that replaces a human workflow.",
              "Your personal knowledge base is running and compounding."
            ].map((outcome, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-white p-5 shadow-[4px_4px_0_0_#111]">
                <span className="font-mono text-[#22c55e] font-black text-lg">✓</span>
                <p className="font-serif text-[#aaa] text-sm mt-2 leading-snug">{outcome}</p>
              </div>
            ))}
          </div>

          <ResourceList
            title="Class 05 Resource Locker"
            links={[
              { label: "Cortex Knowledge Pipeline", url: "https://github.com/80m/knowledge-pipeline" },
              { label: "Firecrawl Docs", url: "https://docs.firecrawl.dev" },
              { label: "n8n Workflow Templates", url: "https://n8n.io/workflows" },
              { label: "Gumroad Creator Guide", url: "https://gumroad.com/creator-guide" },
              { label: "Micro-SaaS Validation (levels.io)", url: "https://levels.io/build-micro-saas" },
              { label: "Claude Agent Building Docs", url: "https://anthropic.com/docs/agents" },
              { label: "Personal Knowledge Base Template", url: "https://github.com/80m/second-brain" },
              { label: "Karpathy Second Brain Post", url: "https://karpathy.ai" },
              { label: "Productized Consulting Guide", url: "https://github.com/80m/consulting-playbook" }
            ]}
          />

          <div className="text-center mt-12">
            <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#22c55e] text-[#111] border-[3px] border-[#111] hover:bg-[#111] hover:text-[#22c55e] shadow-[8px_8px_0_0_#111] transition-colors">
              Exit to Curriculum →
            </button>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizActive && quizSection && quizData[quizSection] && (
          <QuizModal
            title={`Class 05 — Section ${quizSection} Quiz`}
            questions={quizData[quizSection]}
            onClose={() => { setQuizActive(false); setQuizSection(null); }}
            onPass={(score, total) => {
              const passed = score >= Math.ceil(total * 0.6);
              setPassedQuizzes(prev => {
                const updated = [...new Set([...prev, quizSection])];
                try { localStorage.setItem('80m-c5-quizzes', JSON.stringify(updated)); } catch {}
                return updated;
              });
              setQuizDone({ section: quizSection, score, total, passed });
              setTimeout(() => setQuizDone(null), 5000);
            }}
          />
        )}

      </div>{/* close max-w-4xl */}
      </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

export const CourseSixContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('80m-c6-quizzes') || '[]');
    } catch { return []; }
  });

  // Interactive state: Business Model Selector
  const [bmComfort, setBmComfort] = useState('MED');
  const [bmNetwork, setBmNetwork] = useState('COLD');
  const [bmCapital, setBmCapital] = useState('SOME');
  const [bmTimeline, setBmTimeline] = useState('SOON');
  const [bmResult, setBmResult] = useState(null);

  // Interactive state: 72-Hour Pipeline
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineNiche, setPipelineNiche] = useState('');
  const [pipelineDms, setPipelineDms] = useState('');
  const [pipelinePain, setPipelinePain] = useState('');

  // Interactive state: Client Acquisition
  const [clientNiche, setClientNiche] = useState('');
  const [clientCount, setClientCount] = useState('20');
  const [clientOutput, setClientOutput] = useState('');

  // Interactive state: Automation Deck
  const [autoCompany, setAutoCompany] = useState('');
  const [autoHours, setAutoHours] = useState('5');
  const [autoRate, setAutoRate] = useState('50');
  const [autoTrigger, setAutoTrigger] = useState('');
  const [autoAction, setAutoAction] = useState('');

  // Interactive state: Micro-SaaS Validator
  const [msaasProblem, setMsaasProblem] = useState('');
  const [msaasUser, setMsaasUser] = useState('freelancer');
  const [msaasPrice, setMsaasPrice] = useState('$15/mo');
  const [msaasOutput, setMsaasOutput] = useState('');

  // Interactive state: Content Calendar
  const [contentNiche, setContentNiche] = useState('');
  const [contentDay, setContentDay] = useState(1);

  // Interactive state: Agent Pricing
  const [agentJob, setAgentJob] = useState('');
  const [agentSalary, setAgentSalary] = useState('4000');
  const [agentOutput, setAgentOutput] = useState('');

  // Interactive state: Consulting Proposal
  const [propCompany, setPropCompany] = useState('');
  const [propProblem, setPropProblem] = useState('');
  const [propDeliverable, setPropDeliverable] = useState('');
  const [propPrice, setPropPrice] = useState('$2,500');
  const [propOutput, setPropOutput] = useState('');

  // Interactive state: Postiz Setup
  const [postizApiKey, setPostizApiKey] = useState('');
  const [postizStep, setPostizStep] = useState(0);

  const sections = [
    { id: 's0', label: 'Intro' },
    { id: 's1', label: '1. Revenue Models' },
    { id: 's2', label: '2. Vibe-to-Money' },
    { id: 's3', label: '3. Client Work' },
    { id: 's4', label: '4. Automations' },
    { id: 's5', label: '5. Micro-SaaS' },
    { id: 's6', label: '6. Build-in-Public' },
    { id: 's7', label: '7. Agent Labor' },
    { id: 's8', label: '8. Consulting' },
    { id: 's9', label: '9. Postiz Stack' },
    { id: 's10', label: '10. Dictionary' },
    { id: 's11', label: '11. Complete' }
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const runModelPicker = () => {
    const scores = [];
    scores.push(bmComfort);
    scores.push(bmNetwork);
    scores.push(bmCapital);
    scores.push(bmTimeline);

    let recommendation = '';
    if (bmComfort === 'LOW' && bmCapital === 'ZERO' && bmTimeline === 'NOW') {
      recommendation = 'Model 1 (Small Business Websites) or Model 4 (Automations) — Fastest path to paid with minimal overhead.';
    } else if (bmComfort === 'MED' && bmNetwork === 'WARM' && bmTimeline === 'SOON') {
      recommendation = 'Model 8 (Productized Consulting) — Your network + automation skills = immediate value delivery.';
    } else if ((bmComfort === 'MED' || bmComfort === 'HIGH') && bmNetwork === 'COLD' && (bmTimeline === 'SOON' || bmTimeline === 'BUILD')) {
      recommendation = 'Model 5 (Micro-SaaS) — Build it, validate with strangers online, iterate fast.';
    } else if (bmComfort === 'HIGH') {
      recommendation = 'Model 7 (AI Agent Replacement) — Your technical skills command premium pricing.';
    } else {
      recommendation = 'Model 3 (Templates/Prompt Packs) — Always works. Zero client dependency. Build once, sell forever.';
    }
    setBmResult(recommendation);
  };

  const generateClientAcquisition = () => {
    if (!clientNiche.trim()) { setClientOutput('// Enter your target niche above, then click Generate.'); return; }
    const niche = clientNiche.trim();
    setClientOutput(`// SMALL BUSINESS CLIENT ACQUISITION — ${niche.toUpperCase()}

// STEP 1: FIND LEADS
// "Use Firecrawl to find all ${niche} businesses in [YOUR CITY]
//  with no website or a terrible one. Return: name, address,
//  what they do, website URL, and email if findable."
// Command: npx firecrawl scrape [target_url] --max-pages ${clientCount}

// STEP 2: WARM UP THE LIST
// "Pick the ${clientCount} most likely to pay for a website or custom tool.
//  Create a CSV: business_name, owner_name, email, phone, best_time_to_dm, pain_point_guess."

// STEP 3: OUTREACH TEMPLATE
// "Write ${clientCount} personalized cold outreach messages.
//  Tone: friendly, local, not salesy.
//  Mention something specific about their business.
//  End with a simple question."

// STEP 4: AUTOMATE SEQUENCES
// Day 0: Initial DM or email
// Day 3: Follow-up if no response
// Day 7: Second follow-up with a sample
// Day 14: Breakup email ("sorry if I bothered you")

// YOUR PRICING STICKER:
// - Website: $500-$1,500 one-time build
// - Maintenance: $50-$100/mo recurring
// - Custom Tool: $1,000-$3,000 + $75/mo maintenance
`);
  };

  const generateAutomationDeck = () => {
    const hours = parseInt(autoHours) || 5;
    const rate = parseInt(autoRate) || 50;
    const deadTime = hours * rate;
    const setupFee = Math.max(500, Math.round(deadTime * 2));
    const monthlyFee = Math.max(97, Math.round(deadTime * 0.3));
    setAutoOutput(`// AUTOMATION CLIENT DECK

// SLIDE 1: THE PAIN
"${autoCompany || '[Company Name]'}" spends ${hours} hours per week on ${autoTrigger || '[task]'}.
That's $${deadTime}/month in dead time — every single month.

// SLIDE 2: THE SOLUTION
Automation Name: [Name it]
Connects: ${autoTrigger || '[Trigger Tool]'} → ${autoAction || '[Action Tool]'}
When ${autoTrigger || '[trigger]'} happens, ${autoAction || '[action]'} is taken automatically.
No human involvement required.

// SLIDE 3: THE DELIVERABLE
- ${autoTrigger || '[Tool A]'} → ${autoAction || '[Tool B]'} integration live
- Weekly summary report emailed to owner
- Dashboard showing automation runs
- Monthly maintenance included

// SLIDE 4: THE PRICE
Setup: $${setupFee} (one-time, 3-5 day delivery)
Maintenance: $${monthlyFee}/mo (unlimited updates)
ROI: Pays for itself in ${Math.max(1, Math.round(30 / (deadTime > monthlyFee ? deadTime / monthlyFee : 1)))} days

// SLIDE 5: THE OFFER
"I'll build this free for 2 weeks.
If it saves you at least ${hours} hours/month, we continue.
If not, I'll dismantle it and you owe nothing."
`);
  };

  const generateMsaasLaunch = () => {
    if (!msaasProblem.trim()) { setMsaasOutput('// Describe the specific problem your micro-SaaS solves above.'); return; }
    const problem = msaasProblem.trim();
    const userTypes = { freelancer: 'Freelancers and solo service providers', developer: 'Developers and technical creators', marketer: 'Marketers and content creators', business: 'Small business owners (5-50 employees)' };
    const names = ['Desk', 'Flow', 'Prep', 'Core', 'Stack', 'Base', 'Path', 'Kit', 'Dock', 'Beam'];
    const name = names[Math.floor(Math.random() * names.length)];
    setMsaasOutput(`# Micro-SaaS: ${problem.split(' ').slice(0, 4).join(' ')}...

## PHASE 1: VALIDATION (Week 1)
1. Ask agent: "Build me a landing page for [tool idea]. MVP described below.
   Include a 'Join Waitlist' button. Deploy to Vercel."
2. Share link in 3-5 communities:
   - r/SideProject, r/Entrepreneur, r/[your-niche]
   - Relevant Discord servers
   - Twitter/X with relevant hashtags
3. Track waitlist signups. <5 in a week = wrong idea.

## PHASE 2: MVP BUILD (Week 2-3)
4. Once waitlist hits 10+ emails, build the actual tool
5. Ask agent: "Vibe code [tool name]: [core feature list].
   Use Next.js + Supabase + Stripe."
6. Set Stripe to ${msaasPrice} OR one-time $97-$297 lifetime

## PHASE 3: ITERATE (Week 4+)
7. Add features ONLY when 3+ users ask for the same thing
8. Raise price once you have paying customers

## Landing Page Copy
**Headline:** ${problem}
**Subheadline:** Built for ${userTypes[msaasUser]} who are stuck doing this manually.
**CTA:** Join Waitlist

## Product Name Ideas
- ${name}.app
- Domain: ${name.toLowerCase()}.io or ${name.toLowerCase()}.tools
`);
  };

  const [autoOutput, setAutoOutput] = useState('');

  const getContentPrompt = (day) => {
    const prompts = {
      1: 'Post about what you\'re building. Why. Who it\'s for.',
      2: 'Share the first output from your agent. What did it make?',
      3: 'Post about a tool you mastered. What problem did it solve?',
      4: 'Share a before/after (task before agent vs. after agent).',
      5: 'Post about the dumbest thing your agent got wrong (relatable).',
      6: 'Share a prompt that actually worked well.',
      7: 'REST',
      8: '"I built [X] in [Y time]. Here\'s how."',
      9: 'Share a screenshot or video of output.',
      10: '"The one prompt I use every single day."',
      11: 'React to something trending in AI (your take only).',
      12: 'Share a lesson from a failure.',
      13: '"I saved [X hours] this week using [tool]."',
      14: 'REST',
      15: 'Share feedback from someone who used what you built.',
      16: 'Post a thread of "5 things I wish I knew when I started."',
      17: 'Share a tool you\'re exploring (honest review).',
      18: 'Post about your revenue numbers (even if small).',
      19: 'Answer 5 questions from replies.',
      20: '"Here\'s what\'s not working" (radical transparency).',
      21: 'REST',
      22: 'Soft pitch your product/service.',
      23: 'Share a success story (yours or a client\'s).',
      24: 'Post about pricing decisions and why.',
      25: '"I made $[X] this month from [source]."',
      26: 'Engage deeply with 10 other builders\' posts.',
      27: '"What\'s coming next."',
      28: 'Monthly recap.',
      29: 'REST',
      30: 'REST'
    };
    return prompts[day] || 'Day content not defined.';
  };

  const generateAgentPricing = () => {
    const salary = parseInt(agentSalary) || 4000;
    const yourPrice = Math.round(salary * 0.15);
    const savings = salary - yourPrice;
    setAgentOutput(`# AI AGENT — PRICING FORMULA

// STEP 1: IDENTIFY THE TARGET JOB
What repetitive task does a business pay a human $${salary}/month to do?
Examples:
- Lead qualification: $3,000-5,000/mo
- Customer support (refunds, FAQs): $2,500-4,000/mo
- Data entry + reporting: $2,000-3,500/mo
- Appointment scheduling: $1,500-2,500/mo

// STEP 2: CALCULATE YOUR PRICE
Your price = Target salary × 0.12 to 0.20
(1/5 to 1/8 of what they'd pay a human)
$${salary}/mo human → $${yourPrice}/mo for your agent

// STEP 3: BUILD THE PROOF
"I replaced a [JOB TITLE] with an AI agent.
 It handles [X]% of volume.
 Average response time: [Y seconds].
 Human escalations per week: [Z].
 Monthly cost to run: $[API costs + maintenance].
 My margin: $${yourPrice} - $[costs] = $${yourPrice - Math.round(yourPrice * 0.3)}/mo."

// STEP 4: THE SALES APPROACH
"Would you pay $${yourPrice}/mo to eliminate ${agentJob || '[PAIN POINT]'}?
 I'll run it free for 2 weeks. If it doesn't save you
 [X hours] per week, I'll shut it down."
`);
  };

  const generateConsultingProposal = () => {
    setPropOutput(`// [YOUR NAME] — CONSULTING PROPOSAL
// One page. No fluff. Fixed price, fixed timeline.

// --- THE PROBLEM ---
${propCompany || '[Company Name]'} currently ${propProblem || '[specific problem]'}.
This costs them an estimated $[X]/month in [lost revenue / wasted time / missed opportunities].

// --- THE DELIVERABLE ---
We will deliver: ${propDeliverable || '[specific, measurable outcome]'}
Example deliverables:
- "A working automation that handles [X]% of [task], integrated with [Tool A] and [Tool B]"
- "An AI agent that qualifies leads 24/7, booking appointments directly into your calendar"
- "A content pipeline that produces [X] pieces per week with zero manual involvement"

// --- THE TIMELINE ---
Week 1: Discovery + prototype demo
Week 2: Full delivery + testing
Week 2 end: Handoff + documentation

// --- THE PRICE ---
Total: ${propPrice} fixed price
Includes: [X] rounds of revisions, [Y] months of support
Does NOT include: [scope creep, additional tools, ongoing management]

// --- THE OFFER ---
"If this doesn't deliver [specific outcome] in [timeframe],
 I don't get paid. Simple as that."

// --- SOCIAL PROOF PLACEHOLDER ---
[Insert 1-2 relevant testimonials or case study links]
`);
  };

  const generatePostizSetup = () => {
    return `// POSTIZ + 80M AGENT SOCIAL MEDIA SETUP

// STEP 1: STORE THE API KEY
"Here's an API key for Postiz: ${postizApiKey || '[YOUR_API_KEY]'}
 Store it and use it for all post scheduling for [Project Name]."

// STEP 2: IMAGE GENERATION SYSTEM
"Using our Gemini API Key and Nano Banana 2, we're going to
 make sets of TikTok slideshow images for [Project Name].
 3 images per post: HOOK, EXPAND, RESOLUTION.

 HOOK: What are we talking about and why should they care?
 EXPAND: The main piece of information or insight
 RESOLUTION: Emotional pull + potential CTA

 Start with [YOUR NICHE]. Create 3 variations of each slide.
 Once we approve the style, turn this into a skill file."

// STEP 3: POSTING RULES
"Every post we send via Postiz must follow these rules:
 1. Send to DRAFTS ONLY. Never publish directly.
 2. Audio: always set to 'none'. We pick manually later.
 3. Max 5 hashtags per post. Must be trending + relevant.
 4. Captions: <1000 chars, natural tone, no spam.
 5. Posting schedule: [X times/day at X times]
 6. Each post = exactly 3 images. If not, flag and skip.
 7. Title = relevant, created per post based on caption."

// STEP 4: ANDROID HUMAN-TOUCH (AVOID SHADOWBAN)
"For the Android phone step:
 1. Connect Android to same Wi-Fi as this agent
 2. Turn on ADB debugging in Android developer options
 3. Use scrcpy to let this agent control the phone
 4. Set up a cron: check Postiz drafts every [X mins]
    If new draft exists, add audio + publish
 5. NEVER post from API. Always route through Android."
`;
  };

  const quizData = {
    0: [
      { q: "What separates a hobby project from a business?", options: ["Paying customers", "Cool technology", "Number of features", "Viral tweets"], correct: 0, explanation: "A business has paying customers. Everything else — technology, features, viral tweets — is not a business model. It's a hobby with delusions." },
      { q: "Which question best identifies a monetizable problem?", options: ["What can AI do?", "What do business owners hate doing for 3+ hours/week?", "What's the most impressive AI agent?", "Which framework is trending?"], correct: 1, explanation: "The specific question 'What do business owners hate doing for 3+ hours per week?' identifies real, paid problems. Generic AI questions identify technology, not opportunities." }
    ],
    1: [
      { q: "Which revenue model has the lowest marginal cost per sale?", options: ["Custom tools", "Templates/prompt packs", "Automations", "Consulting"], correct: 1, explanation: "Templates and prompt packs have near-zero marginal cost — you build once and sell repeatedly. No client work, no time traded for money." },
      { q: "If you need money in 30 days with zero network, which model do you start with?", options: ["Micro-SaaS", "Build-in-public", "Small business websites", "AI agents"], correct: 2, explanation: "Small business websites require zero network, near-zero capital, and clients are everywhere. You can close your first client in a week with the right outreach." }
    ],
    2: [
      { q: "What is the primary purpose of the first 5 DMs in the pipeline?", options: ["Close a sale", "Build rapport", "Research the actual pain", "Promote your product"], correct: 2, explanation: "First 5 DMs are research, not sales. You're validating whether the pain point is real and worth solving. If you pitch too early, you look desperate." },
      { q: "Why should you send a demo video instead of a pitch deck?", options: ["Videos are trendy", "Demo shows rather than tells, forces real build", "PDFs don't work", "It's easier"], correct: 1, explanation: "A demo video shows the actual thing working. It forces you to actually build something, and showing beats telling every time. A pitch deck is just words." }
    ],
    3: [
      { q: "Why should you charge a monthly maintenance fee on top of a one-time build fee?", options: ["To punish clients", "Compound recurring revenue, low churn", "It's standard practice", "One-time fees are illegal"], correct: 1, explanation: "Monthly maintenance creates compounding recurring revenue. Each client = automatic monthly income. After 12 months, one $75/mo client has generated more than a $500 one-time build." },
      { q: "What is the most valuable signal that a small business will pay for a website?", options: ["They have a large Instagram following", "They complained online about manual work", "They're a restaurant", "They already have a website"], correct: 1, explanation: "When someone complains online about a manual process, they're telling you exactly what they want solved. That complaint = validated demand = paying customer potential." }
    ],
    4: [
      { q: "Why is B2B automation work low-churn?", options: ["Clients are lazy", "Work is tied to revenue/operations — they can't afford to lose it", "It requires a contract", "n8n is free"], correct: 1, explanation: "B2B automation work that touches revenue and operations is low-churn because clients become dependent on it. Losing it would cost them time and money — they can't afford to churn." },
      { q: "What is the compound advantage of automation clients vs. one-time clients?", options: ["They refer more", "Recurring monthly revenue compounds over time", "They're easier to find", "They pay more upfront"], correct: 1, explanation: "Recurring monthly revenue compounds: a $100/mo automation client generates $1,200/year. After 5 years, that's $6,000 from one client — with zero additional work." }
    ],
    5: [
      { q: "What is the fastest way to validate a micro-SaaS idea?", options: ["Build the full product first", "Survey your friends", "Landing page + waitlist in communities", "Post on Product Hunt"], correct: 2, explanation: "A landing page with a waitlist in relevant communities is the fastest validation. If nobody signs up in a week, the idea isn't connecting. If they do, you have real demand." },
      { q: "When should you add features to your micro-SaaS?", options: ["Immediately — more features = more value", "When 3+ paying users ask for the same feature", "After 6 months", "Never"], correct: 1, explanation: "Add features ONLY when 3+ paying users ask for the same thing. This is PMF signal — users are telling you what they actually need, not what you think they need." }
    ],
    6: [
      { q: "What compounds faster — one viral post or 30 days of consistent posting?", options: ["Viral post", "30 days of consistent content", "They're equal", "Virality beats consistency always"], correct: 1, explanation: "30 days of consistent content compounds. The algorithm rewards consistency. A viral post is luck. Consistency is a system. Systems beat luck every time." },
      { q: "Why does authentic practitioner content outperform 'AI guru' content?", options: ["Gurus are too expensive", "Authentic content is more relatable and trustworthy", "Gurus use the wrong tools", "Algorithms favor beginners"], correct: 1, explanation: "Authentic practitioner content is relatable and trustworthy because it's real experience, not performance. People can tell the difference between someone who actually does this and someone who talks about it." }
    ],
    7: [
      { q: "Why should you test an agent for 2 weeks with real data before selling it?", options: ["To impress the client", "To discover every edge case before a paying client does", "It's required by law", "To lower your API costs"], correct: 1, explanation: "Edge cases are where agents fail. Bad addresses, missing fields, ambiguous inputs — you need to discover every failure mode before your client's reputation is on the line." },
      { q: "If a business pays $5,000/mo for a customer support rep, what is a fair price for an AI agent replacement?", options: ["$5,000/mo", "$500-$1,000/mo", "$100/mo", "Free with ads"], correct: 1, explanation: "At 1/5 to 1/8 of the salary replaced, $500-$1,000/mo is the sweet spot. The ROI is obvious to the client (8-10x savings) and profitable for you (low cost to run)." }
    ],
    8: [
      { q: "What is the biggest differentiator in productized consulting vs. hourly consulting?", options: ["Lower price", "Fixed outcome, fixed price, fixed timeline — no scope creep", "Faster delivery", "More features"], correct: 1, explanation: "Productized consulting eliminates scope creep by fixing the deliverable, price, and timeline upfront. The client knows exactly what they get. You know exactly what you're building." },
      { q: "Why does speed create trust in consulting?", options: ["Clients are impatient", "Underpromising on timeline and overdelivering on speed creates delighted clients who weren't expecting it", "Speed is irrelevant", "Fast delivery means lower quality"], correct: 1, explanation: "When a client expects 4 weeks and you deliver in 3 days, their trust explodes. You've not only met expectations — you've shattered them. That client becomes your evangelist." }
    ],
    9: [
      { q: "Why should you use a cheap Android phone instead of posting directly from the Postiz API?", options: ["Android is cooler", "Direct API posting shadowbans your account — Android mimics human posting", "Postiz doesn't support API posting", "It's free"], correct: 1, explanation: "Direct API posting looks like a bot to TikTok/Instagram and gets you shadowbanned. A cheap Android controlled via scrcpy mimics human posting behavior, preserving reach and account health." },
      { q: "What is the purpose of warming up a TikTok account for 3 days before posting?", options: ["It's not necessary", "TikTok shadowbans accounts that look like bots — warming up makes it look human", "To build followers first", "To test your content"], correct: 1, explanation: "TikTok's algorithm flags accounts that immediately post at high volume as bots. Warming up with 3 days of organic activity (likes, comments, follows) makes the account look human before you start posting." }
    ],
    10: [
      { q: "PMF stands for:", options: ["Profit Margin Formula", "Product-Market Fit", "Paid Marketing Funnel", "Personal Monthly Fee"], correct: 1, explanation: "PMF = Product-Market Fit. It's the point where your product actually solves a real problem that real customers will pay for. Without PMF, you have a solution looking for a problem." },
      { q: "What is the shadowban risk in social media automation?", options: ["Posting too much", "Posting from API instead of mimicking human behavior", "Using too many hashtags", "Posting at night"], correct: 1, explanation: "Shadowbans happen when platforms detect bot-like behavior. Direct API posting is the most common trigger. The human-touch Android layer avoids this by mimicking real human posting behavior." }
    ]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 06</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">The Full System + AI Business Playbook</h2>
        </div>
        <button onClick={onClose} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class
        </button>
      </div>

      <div ref={lessonScrollRef} className="lesson-scroll-pane flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Progress Tracker */}
        <div className="mb-8 border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]">
          <div className="bg-[#111] px-5 py-3 flex items-center justify-between">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 06 Progress</span>
            <span className="font-mono text-[#aaa] text-xs">{completedSections.length}/{sections.length} complete</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {sections.map((s) => {
              const isDone = completedSections.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleSection(s.id)} className={`flex items-center gap-2 px-4 py-3 font-mono text-xs border-b border-r border-[#ddd] hover:bg-[#f0fdf4] transition-colors ${isDone ? 'text-[#22c55e]' : 'text-[#555]'}`}>
                  <span className="w-4 h-4 border-[2px] border-current flex items-center justify-center shrink-0">
                    {isDone && <span className="block w-2 h-2 bg-current"></span>}
                  </span>
                  <span className="text-left leading-tight">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* INTRO */}
        <div id="c6-intro" className="mb-24">
          <NeedBox title="What you need before you start" items={[
            "Your 80m stack up and running (C01-C03 complete)",
            "Basic understanding of what vibe coding can produce",
            "At least one thing you've built (even if it embarrasses you)",
            "The willingness to treat this like a business, not a hobby"
          ]} />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase text-center">
            The Full System <br/><span className="italic text-[#22c55e]">+ AI Business Playbook.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
            The capstone. You built the stack. Now make it print. Eight proven revenue models for vibe coders, from small business websites to micro-SaaS to productized consulting.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {[
              { num: '8', label: 'Revenue models', icon: '$' },
              { num: '11', label: 'Hands-on sections', icon: '#' },
              { num: '6', label: 'Interactive builders', icon: '>' },
              { num: '22', label: 'Quiz questions', icon: '?' }
            ].map(item => (
              <div key={item.num} className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
                <span className="font-mono text-[#22c55e] font-black text-4xl">{item.icon}</span>
                <div className="font-sans font-black text-3xl uppercase">{item.num} <span className="text-[#555] text-lg">{item.label}</span></div>
              </div>
            ))}
          </div>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 shadow-[6px_6px_0_0_#22c55e] mb-8">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-3">// The 8 Revenue Models</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Small Business Websites', 'Custom Tools', 'Templates/Packs', 'Paid Automations', 'Micro-SaaS', 'Build-in-Public', 'Agent Replacement', 'Consulting'].map((lane, i) => (
                <div key={i} className="font-sans text-[#eae7de] text-sm font-bold uppercase">{i + 1}. {lane}</div>
              ))}
            </div>
          </div>
          <MacWindow title="your_position.txt" className="mb-8">
            <div className="p-6 font-mono text-sm space-y-1">
              <p className="text-[#aaa]">// Your current position:</p>
              <p className="text-[#eae7de]">1. You can build fast with AI</p>
              <p className="text-[#eae7de]">2. You have a stack that runs 24/7</p>
              <p className="text-[#eae7de]">3. You have automation superpowers</p>
              <p className="text-[#eae7de]">4. You have ZERO clients</p>
              <p className="text-[#aaa] mt-4">// The gap: technical skill ≠ revenue</p>
              <p className="text-[#aaa]">// The fix: solve paid problems, not hobby problems</p>
            </div>
          </MacWindow>
          <div className="border-[3px] border-[#22c55e] bg-[#111] p-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-lg leading-relaxed font-bold">
              "Building cool stuff is not a business model. Solving expensive problems for people who can pay is."
            </p>
          </div>
          <CourseBoostPanel title="Class 06 Money Prompts" checklist={["Identify one specific revenue model from Section 1", "Draft your first outreach DM using the 72-hour pipeline", "Set up Postiz with your agent"]} prompts={["\"Help me identify the one revenue model that fits my current skills, network, and capital situation best.\"", "\"Review what I've built so far and tell me which of the 8 revenue models I could start monetizing in the next 7 days.\""]} />
        </div>

        {/* SECTION 1: The 8 Revenue Models */}
        <div id="c6-s1" className="mb-24">
          <SectionMeta minutes="12 min" focus="Strategy Selection" />
          <NeedBox title="What you need" items={["Nothing. This is a decision section."]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. The 8 Revenue Models — Pick Your Lane</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Eight models. Ranked by difficulty vs. leverage. <GlossaryTooltip term="pick-one">Pick ONE</GlossaryTooltip> and go deep. Ignore the rest.
          </p>

          {/* 8 Model Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              { num: 1, name: 'Small Business Websites', diff: 'SUPER EASY', desc: 'Every local business needs a web presence. 2-3/day. Near-zero friction.' },
              { num: 2, name: 'Custom Tools', diff: 'EASY', desc: 'Appointment systems, inventory trackers, lead forms. $50-100/mo recurring.' },
              { num: 3, name: 'Templates/Prompt Packs', diff: 'EASY', desc: 'Build-once, sell-repeatedly. Near-zero marginal cost. Gumroad or Stripe.' },
              { num: 4, name: 'Paid Automations', diff: 'MEDIUM', desc: 'B2B annoyance work. Zapier/Make/n8n. Setup fee + monthly maintenance.' },
              { num: 5, name: 'Micro-SaaS', diff: 'MEDIUM', desc: 'One job, one screen, one outcome. $5-25/mo. Vibe coded in days.' },
              { num: 6, name: 'Build-in-Public', diff: 'MEDIUM', desc: 'Document the build. X, YouTube, blog. Audience = distribution = revenue.' },
              { num: 7, name: 'AI Agent Replacement', diff: 'MEDIUM', desc: 'One task, done well. Price at a fraction of the salary replaced.' },
              { num: 8, name: 'Productized Consulting', diff: 'HARD', desc: 'Sell the outcome, not the hours. Fixed deliverable. Fixed price.' }
            ].map(model => (
              <div key={model.num} className="border-[3px] border-[#111] bg-white p-5 shadow-[4px_4px_0_0_#111]">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono font-black text-[#22c55e] text-sm">{model.num}.</span>
                  <span className={`font-mono text-xs font-bold px-2 py-1 ${model.diff === 'SUPER EASY' ? 'bg-[#22c55e] text-[#111]' : model.diff === 'EASY' ? 'bg-[#38bdf8] text-[#111]' : model.diff === 'MEDIUM' ? 'bg-[#f59e0b] text-[#111]' : 'bg-[#ef4444] text-white'}`}>{model.diff}</span>
                </div>
                <h3 className="font-sans font-black text-lg uppercase">{model.name}</h3>
                <p className="font-serif text-sm text-[#555] leading-snug mt-1">{model.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive: Model Picker */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Revenue Model Selector</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-mono text-xs font-bold uppercase text-[#555] block mb-2">Technical Comfort</label>
                <div className="flex gap-2">
                  {[['LOW', bmComfort === 'LOW'], ['MED', bmComfort === 'MED'], ['HIGH', bmComfort === 'HIGH']].map(([val, sel]) => (
                    <button key={val} onClick={() => { setBmComfort(val); setBmResult(null); }} className={`flex-1 font-mono text-xs font-bold py-2 border-[2px] ${sel ? 'bg-[#111] text-[#22c55e] border-[#111]' : 'bg-white text-[#111] border-[#111]'}`}>{val}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-[#555] block mb-2">Network</label>
                <div className="flex gap-2">
                  {[['WARM', bmNetwork === 'WARM'], ['COLD', bmNetwork === 'COLD']].map(([val, sel]) => (
                    <button key={val} onClick={() => { setBmNetwork(val); setBmResult(null); }} className={`flex-1 font-mono text-xs font-bold py-2 border-[2px] ${sel ? 'bg-[#111] text-[#22c55e] border-[#111]' : 'bg-white text-[#111] border-[#111]'}`}>{val}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-[#555] block mb-2">Capital</label>
                <div className="flex gap-2">
                  {[['ZERO', bmCapital === 'ZERO'], ['SOME', bmCapital === 'SOME'], ['ENOUGH', bmCapital === 'ENOUGH']].map(([val, sel]) => (
                    <button key={val} onClick={() => { setBmCapital(val); setBmResult(null); }} className={`flex-1 font-mono text-xs font-bold py-2 border-[2px] ${sel ? 'bg-[#111] text-[#22c55e] border-[#111]' : 'bg-white text-[#111] border-[#111]'}`}>{val}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-[#555] block mb-2">Timeline</label>
                <div className="flex gap-2">
                  {[['NOW', bmTimeline === 'NOW'], ['SOON', bmTimeline === 'SOON'], ['BUILD', bmTimeline === 'BUILD']].map(([val, sel]) => (
                    <button key={val} onClick={() => { setBmTimeline(val); setBmResult(null); }} className={`flex-1 font-mono text-xs font-bold py-2 border-[2px] ${sel ? 'bg-[#111] text-[#22c55e] border-[#111]' : 'bg-white text-[#111] border-[#111]'}`}>{val}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={runModelPicker} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Find My Model</button>
            {bmResult && (
              <div className="mt-4 border-[3px] border-[#111] bg-[#111] p-5">
                <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-2">// Recommended Model</p>
                <p className="font-serif text-[#eae7de] text-lg leading-relaxed">{bmResult}</p>
              </div>
            )}
          </div>

          <CheckpointCard
            title="Section 1 Checkpoints"
            items={[
              { type: 'pass', text: 'Identified ONE specific revenue model and can name an example of a real customer in that space' },
              { type: 'fail', text: 'Still looking at all 8 thinking "I could do all of them"' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(1); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 1 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 2: Vibe-to-Money Pipeline */}
        <div id="c6-s2" className="mb-24">
          <SectionMeta minutes="10 min" focus="Execution Velocity" />
          <NeedBox title="What you need" items={["Access to X, Reddit, or LinkedIn (for finding complaints)", "Your 80m agent ready to build on demand", "3 hours of focused work time"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Vibe-to-Money Pipeline — 72-Hour Sprint</h2>
          <div className="border-[3px] border-[#22c55e] bg-[#111] p-6 mb-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-xl leading-relaxed font-bold mb-2">
              Speed beats perfection.
            </p>
            <p className="font-serif text-[#aaa] leading-relaxed">
              A working prototype in 72 hours beats a "perfect" plan in 3 months. Run the pipeline. Don't skip steps.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { hour: '0-4', step: '1', title: 'Find ONE pain point', desc: 'Search "[your niche] + I spend 3 hours every week on..." on X/Reddit. Find 10 posts. DM 5 of them. No pitch. Just: "Hey, what tool do you use for that?" Pick the most common pain point. This is your product.' },
              { hour: '4-12', step: '2', title: 'Build a 2-minute demo', desc: 'Ask your agent: "Build me a demo of [PAIN POINT SOLVED]." Give specifics: who the user is, what input, what output. Record a Loom video showing it working. Send to the 5 DMs with: "I built this for you. Thoughts?"' },
              { hour: '12-72', step: '3', title: 'Charge. Start small. Scale up.', desc: 'Collect feedback. Fix the worst problem. Ask: "Would you pay $X/month for this?" (start at $97/mo). If 1 yes: you have a business. If 3 yes: you have a real business.' }
            ].map(item => (
              <div key={item.step} className="border-[3px] border-[#111] bg-white p-5 shadow-[4px_4px_0_0_#111]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-black text-[#22c55e] text-sm">HOUR {item.hour}</span>
                  <span className="font-mono text-[#aaa] text-xs">STEP {item.step}</span>
                </div>
                <h3 className="font-sans font-black text-lg uppercase">{item.title}</h3>
                <p className="font-serif text-[#555] text-sm leading-relaxed mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Pipeline Tracker */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">72-Hour Pipeline Tracker</h3>
            <div className="space-y-3">
              {[
                { label: 'Step 1: Sent research DMs', active: pipelineStep >= 1, onClick: () => setPipelineStep(Math.max(pipelineStep, 1)) },
                { label: 'Step 2: Built a demo video', active: pipelineStep >= 2, onClick: () => setPipelineStep(Math.max(pipelineStep, 2)) },
                { label: 'Step 3: Collected feedback', active: pipelineStep >= 3, onClick: () => setPipelineStep(Math.max(pipelineStep, 3)) },
                { label: 'Step 4: Asked for payment', active: pipelineStep >= 4, onClick: () => setPipelineStep(Math.max(pipelineStep, 4)) }
              ].map((item, i) => (
                <button key={i} onClick={item.onClick} className={`w-full flex items-center gap-3 px-4 py-3 border-[2px] font-mono text-sm text-left transition-all ${item.active ? 'bg-[#22c55e] text-[#111] border-[#111]' : 'bg-white text-[#555] border-[#ddd]'}`}>
                  <span className="w-5 h-5 border-[2px] border-current flex items-center justify-center shrink-0">{item.active && '✓'}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <CheckpointCard
            title="Section 2 Checkpoints"
            items={[
              { type: 'pass', text: 'Sent at least 5 research DMs and received at least 2 responses' },
              { type: 'fail', text: 'Still "planning" and haven\'t messaged anyone yet' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(2); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 2 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 3: Small Business Websites + Custom Tools */}
        <div id="c6-s3" className="mb-24">
          <SectionMeta minutes="15 min" focus="Build + Deliver" />
          <NeedBox title="What you need" items={["Firecrawl or similar crawler tool set up in your agent", "Bulk email service (Hunter.io, Apollo, or similar)", "Access to a CRM or spreadsheet for tracking outreach"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. Small Business Websites + Custom Tools</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Small businesses are the perfect first clients: they need websites/tools, can't afford $10K dev shops, and are used to paying monthly for subscriptions.
          </p>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// The Stack for Client Acquisition</p>
            {[
              ['Crawl', 'Find small business websites, extract emails and social contacts'],
              ['Email', 'Personalized cold outreach (not spam — your agent writes each one)'],
              ['DM', 'Automated follow-up sequences via your agent'],
              ['Deploy', 'Your agent manages all of this 24/7']
            ].map(([tool, desc]) => (
              <div key={tool} className="flex items-center gap-4 py-2 border-b border-[#333] last:border-0">
                <span className="font-mono font-black text-[#22c55e] text-lg w-16">{tool}</span>
                <span className="font-serif text-[#aaa] text-sm">{desc}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#22c55e] border-[3px] border-[#111] p-5 mb-6 shadow-[6px_6px_0_0_#111]">
            <p className="font-sans font-black text-lg uppercase">Pro Tip:</p>
            <p className="font-serif text-[#111] leading-relaxed">Walk into a hair salon, gym, or restaurant and ask "what do you hate doing manually?" That answer becomes your product.</p>
          </div>

          {/* Interactive: Client Acquisition */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Client Acquisition Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input value={clientNiche} onChange={e => setClientNiche(e.target.value)} placeholder="Target niche (e.g. hair salons, gyms)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={clientCount} onChange={e => setClientCount(e.target.value)} placeholder="Number of leads (e.g. 20)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <button onClick={generateClientAcquisition} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Acquisition Script</button>
            {clientOutput && <CopyBlock code={clientOutput} />}
          </div>

          <div className="bg-[#111] border-[3px] border-[#333] p-6 mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// Pricing Sticker</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#333] p-4 text-center">
                <p className="font-mono text-[#aaa] text-xs uppercase">Website Build</p>
                <p className="font-serif text-[#eae7de] text-2xl font-black">$500-1,500</p>
                <p className="font-mono text-[#aaa] text-xs">one-time</p>
              </div>
              <div className="border border-[#333] p-4 text-center">
                <p className="font-mono text-[#aaa] text-xs uppercase">Monthly Maintenance</p>
                <p className="font-serif text-[#eae7de] text-2xl font-black">$50-100</p>
                <p className="font-mono text-[#aaa] text-xs">per month</p>
              </div>
            </div>
          </div>

          <CheckpointCard
            title="Section 3 Checkpoints"
            items={[
              { type: 'pass', text: 'Built a list of 20+ potential clients, sent first round of outreach, set up one automation sequence' },
              { type: 'fail', text: 'Still "figuring out" what niche to target while doing zero outreach' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(3); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 3 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 4: Paid Workflow Automations */}
        <div id="c6-s4" className="mb-24">
          <SectionMeta minutes="12 min" focus="Recurring Revenue" />
          <NeedBox title="What you need" items={["n8n, Make, or Zapier access", "Your agent with API access to relevant tools", "At least one identified repetitive workflow from research"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Paid Workflow Automations — The Compound Machine</h2>
          <div className="border-[3px] border-[#22c55e] bg-[#111] p-6 mb-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-xl leading-relaxed font-bold mb-2">
              You're not selling automation.
            </p>
            <p className="font-serif text-[#aaa] text-lg leading-relaxed">
              You're selling hours back. B2B annoyance work is a goldmine: cleaning spreadsheets, generating reports, nudging follow-ups.
            </p>
          </div>
          <MacWindow title="automation_template.sh" className="mb-8">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// SLIDE 1: THE PAIN</p>
              <p className="text-[#eae7de]">"[Company Name] spends [X hours] per [week/month] on [task]."</p>
              <p className="text-[#aaa]">// SLIDE 2: THE SOLUTION</p>
              <p className="text-[#eae7de]">"[Automation Name] connects [Tool A] to [Tool B]."</p>
              <p className="text-[#aaa]">// SLIDE 3: THE DELIVERABLE</p>
              <p className="text-[#eae7de]">- Integration live + weekly summary + dashboard</p>
              <p className="text-[#aaa]">// SLIDE 4: THE PRICE</p>
              <p className="text-[#eae7de]">Setup: $[500-2000] | Maintenance: $[97-500]/mo</p>
              <p className="text-[#aaa]">// SLIDE 5: THE OFFER</p>
              <p className="text-[#38bdf8]">"Free for 2 weeks. If it saves you [X hours]/month, we continue."</p>
            </div>
          </MacWindow>

          {/* Interactive: Automation Deck */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Automation Deck Builder</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={autoCompany} onChange={e => setAutoCompany(e.target.value)} placeholder="Company name" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={autoTrigger} onChange={e => setAutoTrigger(e.target.value)} placeholder="Trigger tool (e.g. Gmail)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={autoAction} onChange={e => setAutoAction(e.target.value)} placeholder="Action tool (e.g. Sheets)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input value={autoHours} onChange={e => setAutoHours(e.target.value)} placeholder="Hours/week wasted" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={autoRate} onChange={e => setAutoRate(e.target.value)} placeholder="Hourly rate ($)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <button onClick={generateAutomationDeck} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Deck</button>
            {autoOutput && <CopyBlock code={autoOutput} />}
          </div>

          <CheckpointCard
            title="Section 4 Checkpoints"
            items={[
              { type: 'pass', text: 'Identified one automation workflow from a real business, built a demo, sent it to the business owner' },
              { type: 'fail', text: 'Building automations for imaginary businesses with zero customer validation' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(4); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 4 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 5: Micro-SaaS */}
        <div id="c6-s5" className="mb-24">
          <SectionMeta minutes="15 min" focus="Ship Fast" />
          <NeedBox title="What you need" items={["Stripe account set up", "Landing page hosting (Vercel, Netlify, or your own infra from C03)", "Your agent ready to build fast"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. Micro-SaaS — One Job, One Screen, One Outcome</h2>
          <div className="border-[3px] border-[#22c55e] bg-[#111] p-6 mb-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-xl leading-relaxed font-bold">
              Micro-SaaS is the goldmine: very specific problem, very focused tool, $5-25/mo or lifetime fee.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '💰', name: 'Invoice Generator', for: 'Dog walkers' },
              { icon: '🎬', name: 'Content Script Creator', for: 'TikTok creators' },
              { icon: '📋', name: 'Client Prep Checklist', for: 'Freelancers' }
            ].map(item => (
              <div key={item.name} className="border-[3px] border-[#111] bg-white p-5 shadow-[4px_4px_0_0_#111] text-center">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="font-sans font-black uppercase mt-2">{item.name}</h3>
                <p className="font-mono text-[#555] text-xs mt-1">For: {item.for}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#111] border-[3px] border-[#333] p-5 mb-6">
            <p className="font-mono text-[#38bdf8] text-xs mb-2">// PMF Validation Rule</p>
            <p className="font-serif text-[#eae7de] text-base leading-relaxed">
              Don't add features until someone asks for them. If 3+ paying users ask for the same thing — then add it.
            </p>
          </div>

          {/* Interactive: Micro-SaaS Launch */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Micro-SaaS Launch Builder</h3>
            <div className="space-y-4 mb-4">
              <textarea value={msaasProblem} onChange={e => setMsaasProblem(e.target.value)} placeholder="Describe the specific problem your micro-SaaS solves..." className="w-full border-[2px] border-[#111] p-4 font-mono text-sm h-24" />
              <div className="grid grid-cols-2 gap-4">
                <select value={msaasUser} onChange={e => setMsaasUser(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                  <option value="freelancer">Freelancers</option>
                  <option value="developer">Developers</option>
                  <option value="marketer">Marketers</option>
                  <option value="business">Small Businesses</option>
                </select>
                <select value={msaasPrice} onChange={e => setMsaasPrice(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                  <option value="$5/mo">$5/mo</option>
                  <option value="$15/mo">$15/mo</option>
                  <option value="$25/mo">$25/mo</option>
                  <option value="$97 lifetime">$97 lifetime</option>
                </select>
              </div>
            </div>
            <button onClick={generateMsaasLaunch} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Launch Plan</button>
            {msaasOutput && <CopyBlock code={msaasOutput} />}
          </div>

          <CheckpointCard
            title="Section 5 Checkpoints"
            items={[
              { type: 'pass', text: 'Landing page live with waitlist, shared in at least 2 communities, at least 3 signups' },
              { type: 'fail', text: 'Still "perfecting the idea" without a live landing page' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(5); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 5 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 6: Build-in-Public */}
        <div id="c6-s6" className="mb-24">
          <SectionMeta minutes="10 min" focus="Distribution Engine" />
          <NeedBox title="What you need" items={["At least one thing you've built (even a demo)", "X account or YouTube channel (or both)", "30 minutes per day for content creation"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Build-in-Public — The Compounding Flywheel</h2>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// The Flywheel</p>
            <div className="flex flex-wrap gap-2">
              {['Build', '→', 'Document', '→', 'Post', '→', 'Audience', '→', 'Revenue', '→', 'Build'].map((item, i) => (
                <span key={i} className={`font-sans font-black text-lg ${item === '→' ? 'text-[#555]' : 'text-[#eae7de]'}`}>{item}</span>
              ))}
            </div>
          </div>
          <MacWindow title="content_flywheel.sh" className="mb-8">
            <div className="p-6 font-mono text-sm space-y-1">
              <p className="text-[#aaa]">// 30-day content calendar. 30 min/day. No excuses.</p>
              <p className="text-[#aaa]">// WEEK 1: SETUP + FIRST POSTS</p>
              <p className="text-[#eae7de]">D1: Post what you're building. Why. Who it's for.</p>
              <p className="text-[#eae7de]">D2: Share first output from your agent.</p>
              <p className="text-[#eae7de]">D3: Post about a tool you mastered.</p>
              <p className="text-[#eae7de]">D4: Before/after (task before agent vs. after).</p>
              <p className="text-[#eae7de]">D5: The dumbest thing your agent got wrong.</p>
              <p className="text-[#eae7de]">D6: Share a prompt that actually worked well.</p>
              <p className="text-[#aaa]">// WEEK 2-4: Continue with tutorial, proof, and conversion content...</p>
            </div>
          </MacWindow>

          {/* Interactive: Content Calendar */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Content Prompt Generator</h3>
            <div className="flex items-center gap-4 mb-4">
              <input type="number" min={1} max={30} value={contentDay} onChange={e => setContentDay(parseInt(e.target.value) || 1)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm w-24" />
              <span className="font-mono text-[#555] text-sm">of 30</span>
              <button onClick={() => setContentNiche(getContentPrompt(contentDay))} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Get Prompt</button>
            </div>
            {contentNiche && (
              <div className="border-[3px] border-[#111] bg-[#111] p-5">
                <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-2">Day {contentDay}</p>
                <p className="font-serif text-[#eae7de] text-lg leading-relaxed">{contentNiche}</p>
              </div>
            )}
          </div>

          <CheckpointCard
            title="Section 6 Checkpoints"
            items={[
              { type: 'pass', text: 'Posted at least 10 pieces of content in 30 days, engaged with 10+ other builders\' posts' },
              { type: 'fail', text: 'Created an account, wrote one post, and called it a content strategy' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(6); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 6 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 7: AI Agents Replacing Labor */}
        <div id="c6-s7" className="mb-24">
          <SectionMeta minutes="10 min" focus="High-Value Selling" />
          <NeedBox title="What you need" items={["Deep understanding of one specific repetitive business task", "Access to LLM APIs (OpenAI, Anthropic, or similar)", "At least 2 weeks of testing with real data before selling"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. AI Agents Replacing Labor — The Salary Cutter</h2>
          <div className="border-[3px] border-[#22c55e] bg-[#111] p-6 mb-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-xl leading-relaxed font-bold">
              Build an agent that does ONE thing exceptionally well. Sell the labor it replaces.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { job: 'Lead Qualifier', salary: '$3K-5K/mo', agentPrice: '$400-800/mo' },
              { job: 'Customer Support', salary: '$2.5K-4K/mo', agentPrice: '$300-600/mo' },
              { job: 'Data Entry + Reporting', salary: '$2K-3.5K/mo', agentPrice: '$250-500/mo' },
              { job: 'Appointment Scheduler', salary: '$1.5K-2.5K/mo', agentPrice: '$200-400/mo' }
            ].map(item => (
              <div key={item.job} className="border-[3px] border-[#111] bg-white p-4 shadow-[4px_4px_0_0_#111]">
                <h3 className="font-sans font-black uppercase text-sm">{item.job}</h3>
                <p className="font-mono text-[#555] text-xs mt-1">Human: {item.salary}</p>
                <p className="font-mono text-[#22c55e] font-bold text-sm mt-1">Your Agent: {item.agentPrice}</p>
              </div>
            ))}
          </div>

          {/* Interactive: Agent Pricing */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Agent Pricing Calculator</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input value={agentJob} onChange={e => setAgentJob(e.target.value)} placeholder="Job title (e.g. lead qualifier)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={agentSalary} onChange={e => setAgentSalary(e.target.value)} placeholder="Monthly salary ($)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <button onClick={generateAgentPricing} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Calculate Price</button>
            {agentOutput && <CopyBlock code={agentOutput} />}
          </div>

          <CheckpointCard
            title="Section 7 Checkpoints"
            items={[
              { type: 'pass', text: 'Identified one job a business pays a human to do, researched what that role costs, drafted a pitch' },
              { type: 'fail', text: 'Building an agent without a specific client in mind for a specific job' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(7); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 7 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 8: Productized Consulting */}
        <div id="c6-s8" className="mb-24">
          <SectionMeta minutes="12 min" focus="Premium Positioning" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. Productized Consulting — Outcome-First Selling</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Instead of building something and looking for clients — sell the outcome first. Fixed deliverable. Fixed price. Fixed timeline.
          </p>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// The Secret Weapon: Speed</p>
            <p className="font-serif text-[#eae7de] text-lg leading-relaxed">
              Underpromise on timeline, overdeliver on speed. When a client expects 4 weeks and you show up with a working prototype in 3 days — trust skyrockets.
            </p>
          </div>
          <MacWindow title="consulting_proposal.txt" className="mb-8">
            <div className="p-6 font-mono text-sm space-y-3">
              <p className="text-[#aaa]">// CLIENT: [Company Name]</p>
              <p className="text-[#aaa]">// --- THE PROBLEM ---</p>
              <p className="text-[#eae7de]">[Company] currently [specific problem].</p>
              <p className="text-[#aaa]">// --- THE DELIVERABLE ---</p>
              <p className="text-[#eae7de]">We will deliver: [specific, measurable outcome]</p>
              <p className="text-[#aaa]">// --- THE TIMELINE ---</p>
              <p className="text-[#eae7de]">Week 1: Discovery + prototype | Week 2: Full delivery</p>
              <p className="text-[#aaa]">// --- THE PRICE ---</p>
              <p className="text-[#38bdf8]">$[1,500-5,000] fixed price — typically $1,500-5,000 for 1-2 week deliverables</p>
            </div>
          </MacWindow>

          {/* Interactive: Consulting Proposal */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Consulting Proposal Builder</h3>
            <div className="space-y-4 mb-4">
              <input value={propCompany} onChange={e => setPropCompany(e.target.value)} placeholder="Client company name" className="w-full border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={propProblem} onChange={e => setPropProblem(e.target.value)} placeholder="Specific problem they have" className="w-full border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={propDeliverable} onChange={e => setPropDeliverable(e.target.value)} placeholder="Specific outcome you'll deliver" className="w-full border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <select value={propPrice} onChange={e => setPropPrice(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                  <option value="$500-900">$500-900</option>
                  <option value="$1,500">$1,500</option>
                  <option value="$2,500">$2,500</option>
                  <option value="$4,500">$4,500</option>
                </select>
              </div>
            </div>
            <button onClick={generateConsultingProposal} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Proposal</button>
            {propOutput && <CopyBlock code={propOutput} />}
          </div>

          <CheckpointCard
            title="Section 8 Checkpoints"
            items={[
              { type: 'pass', text: 'Written one-page consulting proposal for a specific client with a specific outcome, sent it' },
              { type: 'fail', text: 'Still saying "I should do consulting" without a single written proposal or outreach attempt' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(8); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 8 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 9: Postiz + Agent Stack */}
        <div id="c6-s9" className="mb-24">
          <SectionMeta minutes="15 min" focus="System Integration" />
          <NeedBox title="What you need" items={["Postiz account ($29/mo)", "Gemini API key + Nano Banana 2 for image generation", "A $50 Android phone (for human-touch posting)", "A warmed-up TikTok account (3 days organic first)"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. Postiz + Agent Stack — The Automated Marketing Engine</h2>
          <p className="font-serif text-xl mb-6 leading-relaxed">
            This section integrates everything: your 80m agent becomes a 24/7 social media marketing machine for your own business or clients.
          </p>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// The Stack Wiring</p>
            <div className="space-y-2">
              {[
                ['Hermes/OpenClaw', 'The brain — generates content, manages API calls'],
                ['Gemini + Nano Banana 2', 'Creates 3-image sets per post (hook, expand, resolution)'],
                ['Postiz API', 'Schedules posts to drafts — NOT directly to platform'],
                ['$50 Android', 'Human-touch layer — picks up drafts and posts like a human']
              ].map(([tool, role]) => (
                <div key={tool} className="flex items-center gap-4 py-2 border-b border-[#333] last:border-0">
                  <span className="font-mono font-bold text-[#22c55e] w-48 shrink-0">{tool}</span>
                  <span className="font-serif text-[#aaa] text-sm">{role}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#ef4444] border-[3px] border-[#111] p-5 mb-6 shadow-[6px_6px_0_0_#111]">
            <p className="font-mono text-white text-xs font-bold uppercase mb-2">// CRITICAL: Shadowban Warning</p>
            <p className="font-serif text-white leading-relaxed">NEVER post directly from the Postiz API. You will get shadowbanned. Always route through the Android human-touch layer.</p>
          </div>

          {/* Interactive: Postiz Setup */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Postiz + Agent Setup</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: 'Step 1: Store API Key', done: postizStep >= 1 },
                { label: 'Step 2: Image Generation', done: postizStep >= 2 },
                { label: 'Step 3: Posting Rules', done: postizStep >= 3 },
                { label: 'Step 4: Android Human-Touch', done: postizStep >= 4 }
              ].map((item, i) => (
                <button key={i} onClick={() => setPostizStep(i + 1)} className={`font-mono text-xs font-bold px-3 py-2 border-[2px] ${item.done ? 'bg-[#22c55e] text-[#111] border-[#111]' : 'bg-white text-[#555] border-[#ddd]'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="space-y-3 mb-4">
              <input value={postizApiKey} onChange={e => setPostizApiKey(e.target.value)} placeholder="Postiz API key (paste to your agent)" className="w-full border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <div className="border-[3px] border-[#111] bg-[#111] p-5">
              <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-2">// Setup Script</p>
              <CopyBlock code={generatePostizSetup()} />
            </div>
          </div>

          {/* Image Stockpile Method */}
          <div className="bg-[#111] border-[3px] border-[#333] p-6 mb-6">
            <p className="font-mono text-[#38bdf8] text-xs font-bold uppercase mb-3">// Image Stockpile Method</p>
            <p className="font-serif text-[#eae7de] leading-relaxed">
              3 posts/day x 9 images/day = 1 week stockpile in one sitting. Tell your agent: "Create 3 variations of each slide (HOOK, EXPAND, RESOLUTION) for [YOUR NICHE]. Turn this into a skill file."
            </p>
          </div>

          <CheckpointCard
            title="Section 9 Checkpoints"
            items={[
              { type: 'pass', text: 'Postiz connected to agent, first 3-image set generated and sent to drafts, Android step configured' },
              { type: 'fail', text: 'Tried to post directly from API and got shadowbanned, then asked "why isn\'t this working?"' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(9); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 9 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 10: Dictionary + Tools Reference */}
        <div id="c6-s10" className="mb-24">
          <SectionMeta minutes="5 min" focus="Reference" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. Dictionary + Tools Reference</h2>

          {/* Glossary */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Key Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { term: 'Micro-SaaS', def: 'Very specific tool solving one niche problem. $5-25/mo. Traditional dev teams can\'t justify building these.' },
                { term: 'Productized Consulting', def: 'Selling a fixed outcome at a fixed price. No hourly billing. No scope creep.' },
                { term: 'PMF', def: 'Product-Market Fit. When real customers pay for a real problem. Nothing else matters before this.' },
                { term: 'Agentic Social Media', def: 'Your AI agent manages posting via API. The Android layer adds human-touch to avoid shadowban.' },
                { term: 'Shadowban', def: 'Platform hiding your content because you look like a bot. Fixed by human-touch posting layer.' },
                { term: 'Recurring Revenue', def: 'Monthly payments that compound over time. The foundation of a real business.' },
                { term: 'Lifetime Deal', def: 'One-time payment for lifetime access. Good for early momentum, bad for long-term revenue.' },
                { term: 'scrcpy', def: 'Tool to control Android phone from your computer. The human-touch layer for automated posting.' }
              ].map(item => (
                <div key={item.term} className="border border-[#ddd] p-4">
                  <h4 className="font-mono font-black text-[#22c55e] text-sm mb-1">{item.term}</h4>
                  <p className="font-serif text-[#555] text-sm leading-snug">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

          <ResourceList
            title="Class 06 Resource Locker"
            links={[
              { label: "Micro-SaaS Forum (IndieHackers)", url: "https://www.indiehackers.com" },
              { label: "Levels.io — Micro-SaaS Inspiration", url: "https://levels.io" },
              { label: "Postiz.com — Agentic Social Media", url: "https://postiz.pro/ashen" },
              { label: "scrcpy — Phone Screen Mirroring", url: "https://github.com/Genymobile/scrcpy" },
              { label: "Hunter.io — Email Finder", url: "https://hunter.io" },
              { label: "Apollo.io — B2B Lead Database", url: "https://apollo.io" },
              { label: "Gumroad — Sell Digital Products", url: "https://gumroad.com" },
              { label: "Lemon Squeezy — Alt to Gumroad", url: "https://lemonsqueezy.com" },
              { label: "Stripe Atlas — Company Formation", url: "https://stripe.com/atlas" },
              { label: "Reel.Farm — AI UGC Video", url: "https://reelfarm.io" }
            ]}
          />

          <CheckpointCard
            title="Section 10 Checkpoints"
            items={[
              { type: 'pass', text: 'You can define PMF, Shadowban, Micro-SaaS, and Productized Consulting in your own words' },
              { type: 'fail', text: 'You\'re still confused about the difference between recurring revenue and one-time fees' }
            ]}
          />
          <div className="mt-6 text-center">
            <button onClick={() => { setQuizActive(true); setQuizSection(10); }} className="font-sans font-black text-sm uppercase px-8 py-4 bg-[#111] text-[#22c55e] border-[3px] border-[#22c55e] shadow-[4px_4px_0_0_#22c55e] hover:-translate-y-1 transition-all">
              Take Section 10 Quiz →
            </button>
          </div>
        </div>

        {/* SECTION 11: Completion Card */}
        <div id="c6-s11" className="mb-24">
          <div className="border-[4px] border-[#111] bg-[#111] p-8 shadow-[12px_12px_0_0_#22c55e] mb-8">
            <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 06 — Complete</span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-[#eae7de] mt-4 uppercase">The Full System + AI Business Playbook</h2>
          </div>

          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-8 shadow-[6px_6px_0_0_#22c55e]">
            <pre className="font-mono text-[#22c55e] text-xs leading-relaxed whitespace-pre-wrap">{`
╔══════════════════════════════════════════════════════════╗
║             CLASS 06 — MISSION COMPLETE                   ║
║                                                          ║
║  You have:                                               ║
║  ✓ Learned 8 revenue models for vibe coders             ║
║  ✓ Built a 72-hour vibe-to-money pipeline               ║
║  ✓ Mastered small business client acquisition            ║
║  ✓ Understood paid automation and micro-SaaS           ║
║  ✓ Built a content flywheel with build-in-public        ║
║  ✓ Positioned AI agents as labor replacement            ║
║  ✓ Learned productized consulting sales                ║
║  ✓ Wired your 80m stack into an automated marketing     ║
║    engine via Postiz                                    ║
║                                                          ║
║  THE MACHINE IS BUILT. NOW MAKE IT PRINT.              ║
║                                                          ║
║  Your 80m stack is not a toy. It's a revenue engine.    ║
║  Every hour you run it is compounding.                  ║
║  Start with ONE model. Execute. Ship. Get paid.         ║
║                                                          ║
║  Then do it again.                                       ║
╚══════════════════════════════════════════════════════════╝
`}</pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              "You can articulate what specific business problem you want to solve and who would pay for it.",
              "You have identified ONE revenue model and are executing on it.",
              "You've sent research DMs using the 72-hour pipeline.",
              "You have a concrete path from skills to income (8 options, ranked by difficulty).",
              "Your 80m stack is wired into Postiz for automated marketing.",
              "You know exactly what to do next — because you've done the work."
            ].map((outcome, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-white p-5 shadow-[4px_4px_0_0_#111]">
                <span className="font-mono text-[#22c55e] font-black text-lg">✓</span>
                <p className="font-serif text-[#aaa] text-sm mt-2 leading-snug">{outcome}</p>
              </div>
            ))}
          </div>

          {/* Final Action Items */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-8">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Your Homework — Start Today</h3>
            <div className="space-y-3">
              {[
                { day: 'TODAY', task: 'Pick ONE revenue model from Section 1' },
                { day: 'THIS WEEK', task: 'Send 5 research DMs using the 72-hour pipeline' },
                { day: 'THIS WEEK', task: 'Build one demo and send it to at least one person' },
                { day: 'THIS WEEK', task: 'Set up Postiz with your agent and generate your first image set' },
                { day: 'TOMORROW', task: 'Start the build-in-public calendar — Day 1 post' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-[#ddd] last:border-0">
                  <span className={`font-mono text-xs font-bold px-2 py-1 shrink-0 ${item.day === 'TODAY' ? 'bg-[#ef4444] text-white' : item.day === 'TOMORROW' ? 'bg-[#f59e0b] text-[#111]' : 'bg-[#22c55e] text-[#111]'}`}>{item.day}</span>
                  <span className="font-serif text-[#aaa] text-sm">{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graduation Message */}
          <div className="border-[3px] border-[#111] bg-[#111] p-8 mb-8 shadow-[8px_8px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-xl md:text-2xl leading-relaxed">
              "You don't need permission. You don't need investors. You don't need a perfect plan. You have a machine that runs 24/7, costs less than your phone bill, and can build anything you can describe. The only gap between where you are and where you want to be is execution. <span className="text-[#22c55e] font-bold">Start today.</span> Start with one client. Start with one dollar. Then scale."
            </p>
          </div>

          <ResourceList
            title="Class 06 Resource Locker"
            links={[
              { label: "Micro-SaaS Forum (IndieHackers)", url: "https://www.indiehackers.com" },
              { label: "Levels.io — Micro-SaaS Inspiration", url: "https://levels.io" },
              { label: "Postiz.com — Agentic Social Media", url: "https://postiz.pro/ashen" },
              { label: "scrcpy — Phone Screen Mirroring", url: "https://github.com/Genymobile/scrcpy" },
              { label: "Hunter.io — Email Finder", url: "https://hunter.io" },
              { label: "Apollo.io — B2B Lead Database", url: "https://apollo.io" },
              { label: "Gumroad — Sell Digital Products", url: "https://gumroad.com" },
              { label: "Lemon Squeezy — Alt to Gumroad", url: "https://lemonsqueezy.com" },
              { label: "Stripe Atlas — Company Formation", url: "https://stripe.com/atlas" },
              { label: "Reel.Farm — AI UGC Video", url: "https://reelfarm.io" }
            ]}
          />

          <div className="text-center mt-12">
            <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#22c55e] text-[#111] border-[3px] border-[#111] hover:bg-[#111] hover:text-[#22c55e] shadow-[8px_8px_0_0_#111] transition-colors">
              Exit to Curriculum →
            </button>
          </div>
        </div>

        {/* Quiz Modal */}
        {quizActive && quizSection !== null && quizData[quizSection] && (
          <QuizModal
            title={`Class 06 — Section ${quizSection} Quiz`}
            questions={quizData[quizSection]}
            onClose={() => { setQuizActive(false); setQuizSection(null); }}
            onPass={(score, total) => {
              const passed = score >= Math.ceil(total * 0.6);
              setPassedQuizzes(prev => {
                const updated = [...new Set([...prev, quizSection])];
                try { localStorage.setItem('80m-c6-quizzes', JSON.stringify(updated)); } catch {}
                return updated;
              });
              setQuizDone({ section: quizSection, score, total, passed });
              setTimeout(() => setQuizDone(null), 5000);
            }}
          />
        )}

      </div>{/* close max-w-4xl */}
      </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} />
    </motion.div>
  );
};

// COURSE SEVEN CONTENT - insert before "// --- Main Portal Page ---"

export const CourseSevenContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('80m-c7-quizzes') || '[]'); } catch { return []; }
  });

  // Interactive state: Orb Explorer
  const [selectedOrb, setSelectedOrb] = useState(null);
  const orbs = [
    { id: 'o1', name: 'Prawnius', role: 'Quick Tasks & One-Offs', desc: 'Fast, no-frills agent for quick commands. "Hey, convert this PDF to text." "What\'s 15% of 240?" Prawnius handles it without fanfare.', best: 'Quick lookups, math, one-liner tasks, when you just need an answer fast.', icon: '⚡' },
    { id: 'o2', name: 'Sir Clawthchilds', role: 'Finances & Budgets', desc: 'The money specialist. Tracks expenses, builds budgets, analyzes spending patterns, generates financial reports. Sir Clawthchilds thinks in spreadsheets.', best: 'Expense logging, budget breakdowns, financial summaries, invoice tracking, cash flow analysis.', icon: '💰' },
    { id: 'o3', name: 'Claudnelius', role: 'Code & Tech', desc: 'Your development partner. Writes code, debugs errors, explains technical concepts, helps with system setup. Claudnelius speaks fluent Python, JavaScript, and everything in between.', best: 'Writing scripts, debugging code, explaining APIs, system architecture, dev tool setup.', icon: '🔧' },
    { id: 'o4', name: 'Knowledge Knaight', role: 'Memory & Facts', desc: 'The keeper of your long-term memory. Handles knowledge bases, facts, research, and Cortex integration. Ask Knowledge Knaight anything about what you\'ve discussed before.', best: 'Research, fact-checking, knowledge base queries, session history, "we talked about this before" moments.', icon: '🧠' },
    { id: 'o5', name: 'Knaight of Affairs', role: 'Scheduling & Calendars', desc: 'The organizer. Tracks events, sets reminders, manages schedules, coordinates your calendar. Knaight of Affairs makes sure nothing falls through the cracks.', best: 'Calendar management, appointment reminders, schedule coordination, event planning, deadline tracking.', icon: '📅' },
    { id: 'o6', name: 'Labrina', role: 'Social Media & Content', desc: 'The creative engine. Generates captions, hashtags, content ideas, post schedules, social media strategy. Labrina thinks in engagement metrics and viral hooks.', best: 'Instagram captions, tweet threads, content calendars, hashtag research, social media strategy.', icon: '🎨' },
    { id: 'o7', name: 'Clawdette', role: 'Everyday Tasks & Delegation', desc: 'Your everyday assistant. Handles general tasks that don\'t fit neatly into one category. Clawdette is your fallback agent for miscellaneous life management.', best: 'General to-do lists, errands, miscellaneous reminders, life admin, delegation management.', icon: '✨' },
  ];

  // Interactive state: First Message Builder
  const [situation, setSituation] = useState('freelancer');
  const [firstMessage, setFirstMessage] = useState('');
  const firstMessageTemplates = {
    freelancer: "hermes: here's my situation — I'm a freelance designer working with 4-5 clients at a time. I struggle with tracking deliverables, follow-up emails, and invoice deadlines. I want you to remember my clients, flag deadlines 48 hours in advance, and help me draft follow-up emails when I haven't heard back in 3 days. Here's my standard rate: $75/hr. My niche is brand identity for wellness brands.",
    smallbusiness: "hermes: I run a small business — [business type]. Here's what I need from you: remember my product catalog, help me draft customer responses, track inventory, and flag when I need to reorder supplies. I'm the only person running this so I need you to act as my COO. My main goal right now is [specific goal].",
    student: "hermes: I'm a student studying [subject]. Here's my situation — I work best in [morning/evening], I have [X] assignments due per week, and I struggle with [specific challenge]. I want you to help me plan my weeks, break down big projects, and quiz me on material before exams. I learn best when [learning preference].",
    sidehustle: "hermes: I have a side hustle doing [what you do]. I can dedicate about [X] hours per week to it. My main challenge is [time management/inconsistent income/customer acquisition]. I want you to track my leads, remind me to post content, and help me draft outreach messages. My goal is to hit [specific number] in revenue by [date].",
    organized: "hermes: I'm trying to get more organized. Here's everything about me: my name is [name], I work in [field], I have [X] ongoing projects, and I want to track [specific things]. I need you to remember my preferences, help me prioritize every morning, and flag anything overdue. I hate [pet peeve] and I'd rather you handle it.",
  };

  // Interactive state: Memory Audit
  const [memoryInput, setMemoryInput] = useState('');
  const [memoryOutput, setMemoryOutput] = useState('');

  // Interactive state: Skill Picker
  const [selectedSkill, setSelectedSkill] = useState(null);
  const skills = [
    { name: 'cortex', desc: 'Knowledge base management — build and query a personal knowledge graph from your notes, PDFs, and web research.', installPrompt: 'I want to install the cortex skill. Walk me through setup and how to start adding knowledge.' },
    { name: 'stripe-80m', desc: 'Stripe billing integration — let Hermes handle invoices, payment links, subscription management, and financial tracking through Stripe.', installPrompt: 'I want to install the stripe-80m skill. Walk me through connecting my Stripe account and what I can automate.' },
    { name: 'notion', desc: 'Notion sync — pull and push data to your Notion workspace. Tasks, databases, notes — all in sync with Hermes.', installPrompt: 'I want to install the notion skill. Walk me through connecting my Notion workspace.' },
    { name: 'obsidian', desc: 'Obsidian vault sync — connect your local Obsidian notes to Hermes. Query your second brain from any device.', installPrompt: 'I want to install the obsidian skill. Walk me through connecting my Obsidian vault.' },
    { name: 'youtube-content', desc: 'YouTube pipeline — paste a video URL, get a transcript, summary, tweet thread, and content repurposed for all platforms.', installPrompt: 'I want to install the youtube-content skill. Walk me through how to use it with any video.' },
    { name: 'godot-liquid-toolbar', desc: 'Game dev toolkit — streamline Godot 4 workflows with asset management, scene organization, and export automation.', installPrompt: 'I want to install the godot-liquid-toolbar skill. Walk me through the Godot integration.' },
    { name: 'github', desc: 'GitHub management — automate PR reviews, issue tracking, repo management, and code deployment through conversation.', installPrompt: 'I want to install the github skill. Walk me through connecting my repos.' },
    { name: 'email', desc: 'Email automation — draft emails, categorize inbox, set up rules, and manage correspondence through Hermes.', installPrompt: 'I want to install the email skill. Walk me through connecting my email and what automations are possible.' },
    { name: 'calendar', desc: 'Calendar integration — sync with Google Calendar, Apple Calendar, or Cal.com. Let Hermes manage your schedule.', installPrompt: 'I want to install the calendar skill. Walk me through connecting my calendar app.' },
    { name: 'custom', desc: 'Build your own skill — any workflow you do repeatedly can become a skill. Tell Hermes what you want and it helps you build it.', installPrompt: 'I want to build a custom skill for [describe your workflow]. How do we set this up?' },
  ];

  // Interactive state: Cron Builder
  const [cronTrigger, setCronTrigger] = useState('daily-morning');
  const [cronTask, setCronTask] = useState('brief');
  const [cronOutput, setCronOutput] = useState('');
  const cronTemplates = {
    'daily-morning-brief': { expr: '0 8 * * 1-5', desc: 'Every weekday at 8:00 AM', task: 'morning brief — weather, top 3 tasks, anything urgent' },
    'daily-evening-wrap': { expr: '30 21 * * *', desc: 'Every day at 9:30 PM', task: 'evening wrap-up — log accomplishments, flag tomorrow priorities' },
    'weekly-review': { expr: '0 17 * * 5', desc: 'Every Friday at 5:00 PM', task: 'weekly review — summarize the week, list wins, plan next week' },
    'monthly-audit': { expr: '0 9 1 * *', desc: '1st of every month at 9:00 AM', task: 'monthly finance audit — expenses vs income, cash flow report' },
    'content-stockpile': { expr: '0 10 * * 1,3,5', desc: 'Mon/Wed/Fri at 10:00 AM', task: 'generate content stockpile — 3 posts worth of ideas and copy' },
  };

  // Interactive state: Task Manager Setup
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [task3, setTask3] = useState('');
  const [taskOutput, setTaskOutput] = useState('');

  // Interactive state: Integration Picker
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const integrations = [
    { name: 'Discord', desc: 'When a Discord message matches a keyword, Hermes processes it and responds or logs it. Great for community management and alerts.', setup: 'Give Hermes your Discord webhook URL. Tell it which channels and keywords to watch. It\'ll DM you summaries or take action automatically.' },
    { name: 'GitHub', desc: 'PR merged? Hermes notifies you. Issue opened? Hermes logs it. CI failing? Hermes alerts you with a fix. Your dev workflow on autopilot.', setup: 'Connect your GitHub account via OAuth. Tell Hermes which repos to watch and what actions to take on events.' },
    { name: 'Gmail', desc: 'New email from a client? Hermes categorizes it, drafts a reply, and flags anything urgent. Your inbox managed like a executive assistant.', setup: 'Connect Gmail via IMAP or Google OAuth. Tell Hermes which senders are priority and what categories to apply.' },
    { name: 'Stripe', desc: 'Payment received? Hermes logs it to your finance tracker. Subscription canceled? Hermes flags it. Stripe events trigger Hermes actions.', setup: 'Connect Stripe via API key. Tell Hermes which events to watch and what to do with each one.' },
    { name: 'Notion', desc: 'New Notion database entry? Hermes reads it, extracts action items, and creates tasks. Your knowledge base becomes a living to-do list.', setup: 'Connect Notion via OAuth. Tell Hermes which databases to monitor and how to process new entries.' },
    { name: 'Obsidian', desc: 'New note in your vault? Hermes reads it, links it to related concepts, and surfaces it when relevant. Your second brain actually thinks.', setup: 'Point Hermes at your vault path. Tell it which folders to index and how often to sync.' },
    { name: 'Telegram', desc: 'Message Hermes from anywhere via Telegram. Send texts, photos, voice notes. Get responses, reminders, and alerts. Your AI on the go.', setup: 'Create a Telegram bot via BotFather. Give the token to Hermes. You\'re now connected from any device.' },
    { name: 'Calendar', desc: 'Upcoming event? Hermes reminds you with context. Meeting conflict? Hermes flags it. Your schedule proactively managed.', setup: 'Connect Google Calendar, Apple Calendar, or Cal.com. Tell Hermes your buffer preferences and reminder timing.' },
  ];

  // Interactive state: Workspace Builder
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [workspaceOutput, setWorkspaceOutput] = useState('');
  const templates = [
    {
      id: 'agents',
      title: 'Agents Management',
      desc: 'Tell Hermes how to route different task types to different agents.',
      prompt: `hermes: here's how I want you to manage my agents:
- [Agent Name] handles: [what they do]
- [Agent Name] handles: [what they do]
- Default agent for quick questions: [who]
Reply with a summary of how you've set up my agent council.`,
    },
    {
      id: 'cron',
      title: 'Cron Setup',
      desc: 'Set up recurring tasks that run automatically on a schedule.',
      prompt: `hermes: set up these recurring tasks:
1. Every weekday at 8am: give me a morning brief — weather, my top 3 tasks today, anything urgent
2. Every Friday at 4pm: generate my weekly wrap-up and save it to fabric
3. Every Monday at 9am: review my todo list and flag anything overdue
Reply with the crontab entries when done.`,
    },
    {
      id: 'tasks',
      title: 'Tasks Monitoring',
      desc: 'Break down a project into tracked tasks with daily check-ins.',
      prompt: `hermes: here's my current project: [describe it]
Break it down into tasks and track them for me.
Check in on progress every morning.
Flag me if anything is overdue.`,
    },
    {
      id: 'sessions',
      title: 'Sessions Review',
      desc: 'Generate a summary of what you discussed with Hermes this week.',
      prompt: `hermes: run a session review — what did we talk about this week?
Give me a summary of decisions made, tasks created, and things to follow up on.`,
    },
    {
      id: 'skills',
      title: 'Skills Installation',
      desc: 'Install a new skill to extend what Hermes can do.',
      prompt: `hermes: I want to install the [skill name] skill.
Walk me through what it does and how to use it.`,
    },
    {
      id: 'memory',
      title: 'Memory Update',
      desc: 'Set your complete memory profile so Hermes knows you.',
      prompt: `hermes: update my memory profile:
My name: [name]
I work in: [industry]
My main goals right now: [3 things]
Things I hate doing that you should handle: [3 things]
Current projects: [what you're working on]
Reply: "Memory updated" when done.`,
    },
    {
      id: 'webhook',
      title: 'Webhook Setup',
      desc: 'Connect an external app to Hermes via webhook.',
      prompt: `hermes: I want to connect [app name] to my agent.
What webhook endpoint should I use?
Walk me through the setup step by step.`,
    },
  ];

  // Interactive state: 15 Real-World Apps
  const [selectedApp, setSelectedApp] = useState(null);
  const realWorldApps = [
    { id: 1, person: 'Mike the Plumber', problem: 'Bad website, misses follow-up calls', prompt: "Track my jobs: customer name, address, what I fixed, when I followed up. Remind me to call 3 days after every job.", output: 'Job log + automated follow-up cron', bonus: 'Build a customer portal where clients can see job history and request service.' },
    { id: 2, person: 'Sarah the Bookkeeper', problem: 'Solo shop, no accountant, receipts everywhere', prompt: "Every time I send you a photo of a receipt, categorize it and add to my expense log. Monthly summary on the 1st.", output: 'Receipt → categorized expense log + monthly report', bonus: 'Connect to Stripe to auto-log all transactions.' },
    { id: 3, person: 'Carlos the Electrician', problem: 'Forgets to invoice, cash flow suffer', prompt: "After every job, add it to my invoice tracker with hours and materials. Generate a draft invoice every Friday.", output: 'Job → invoice draft every Friday', bonus: 'Send invoices via email automatically with Stripe payment links.' },
    { id: 4, person: 'Streamer Dave', problem: 'Lives on Discord, loses good moments', prompt: "When I send you a clip URL, summarize it and crosspost a tweet thread.", output: 'Clip URL → Twitter thread', bonus: 'Auto-clip highlights from VOD timestamps.' },
    { id: 5, person: 'Producer Marcus', problem: 'Forgets which beat went to which client', prompt: "Log every beat I make: name, key, bpm, client if sold. Show me my catalog on demand.", output: 'Beat catalog with search', bonus: 'Add sample clearance tracking and licensing reminders.' },
    { id: 6, person: 'Office Manager Jennifer', problem: 'Meeting notes go nowhere', prompt: "Forward meeting notes to me. Extract action items and assign owners and due dates.", output: 'Notes → tasks with owners and deadlines', bonus: 'Sync to Notion with a weekly review cron.' },
    { id: 7, person: 'Ice Cream Shop Gina', problem: 'Just wants to post, not think', prompt: "Every time I send you a photo of an ice cream, give me an Instagram caption and 5 hashtags.", output: 'Photo → caption + hashtags', bonus: 'Set up a daily content cron that pre-generates 7 days of captions.' },
    { id: 8, person: 'Grower Jake', problem: '200 plants, hard to track feeds', prompt: "Log every feeding: plant ID, nutrients used, pH, date. Alert me 3 days before scheduled feed.", output: 'Plant health tracker + feed reminders', bonus: 'Add watering schedules and harvest date tracking.' },
    { id: 9, person: 'Flipper Tyler (PS5)', problem: 'Buys low, forgets what he paid', prompt: "Log every marketplace find: item, price, source, listing URL. Calculate profit vs estimated resale.", output: 'Hustle tracker with profit calc', bonus: 'Set price alerts for items you\'re tracking.' },
    { id: 10, person: 'Coach Marcus', problem: 'Forgets client progress between sessions', prompt: "Log every client session: name, exercises done, weight/reps, client feedback. Monthly progress report.", output: 'Client progress notes + monthly report', bonus: 'Generate workout plans based on progress history.' },
    { id: 11, person: 'Depop Dani', problem: 'Reposts same items, misses sales', prompt: "Track my listings: item, price, date posted, price reductions. Alert me when something has been listed for 2 weeks.", output: 'Listing optimizer with stale alerts', bonus: 'Auto-generate repricing suggestions based on market data.' },
    { id: 12, person: 'Landlord Luis', problem: 'Messy tenant communication', prompt: "Log every tenant message: who, what, when. Remind me 3 days before rent is due. Flag maintenance requests.", output: 'Tenant manager + rent reminders', bonus: 'Track lease dates and renewal notifications.' },
    { id: 13, person: 'Tutor Priya', problem: 'Different students, different needs', prompt: "Log every tutoring session: student name, topic covered, what they struggled with, homework assigned.", output: 'Student progress notes', bonus: 'Generate personalized study plans based on struggle patterns.' },
    { id: 14, person: 'Chef Marco', problem: 'Forgets client preferences', prompt: "Remember these dietary preferences for catering clients: [list]. Generate grocery lists based on upcoming events.", output: 'Client preference memory + grocery lists', bonus: 'Auto-calculate costs per event and track profit margins.' },
    { id: 15, person: 'Realtor Aisha', problem: 'Forgets which client wants what', prompt: "Track client wishlists: name, budget, preferred neighborhoods, must-haves. Alert me when a listing matches 3+ criteria.", output: 'Client matcher with listing alerts', bonus: 'Connect MLS webhook for automatic matching.' },
  ];

  // Custom builder
  const [customProblem, setCustomProblem] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const sections = [
    { id: 's0', label: 'Intro' },
    { id: 's1', label: '2. 15 Real-World Apps' },
    { id: 's2', label: '3. What 80m Is' },
    { id: 's3', label: '4. Talking to Hermes' },
    { id: 's4', label: '5. Memory & Fabric' },
    { id: 's5', label: '6. Skills' },
    { id: 's6', label: '7. Crons' },
    { id: 's7', label: '8. Sessions & Tasks' },
    { id: 's8', label: '9. Webhooks' },
    { id: 's9', label: '10. Workspace' },
    { id: 's10', label: '11. Troubleshooting' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleFirstMessage = () => {
    setFirstMessage(firstMessageTemplates[situation] || '');
  };

  const handleMemoryAudit = () => {
    const output = `hermes: here's everything I want you to remember about me:

${memoryInput}

Please organize this into a memory profile. 
Update my fabric with this information.
Reply: "Memory updated — I know you now."`;
    setMemoryOutput(output);
  };

  const handleCronBuild = () => {
    const tmpl = cronTemplates[cronTrigger];
    if (!tmpl) return;
    const output = `hermes: set up this cron job for me:
Schedule: ${tmpl.desc} (cron: ${tmpl.expr})
Task: Every ${tmpl.desc.toLowerCase()}, ${tmpl.task}
What to do: ${cronTask === 'brief' ? 'Give me a structured brief with the key info I need.' : cronTask === 'content' ? 'Generate content ideas and copy relevant to my niche.' : cronTask === 'finance' ? 'Run a financial summary — income, expenses, and cash flow.' : 'Review my tasks, flag overdue items, and suggest priorities.'}
Reply with the cron expression and confirmation.`;
    setCronOutput(output);
  };

  const handleTaskSetup = () => {
    const tasks = [task1, task2, task3].filter(t => t.trim());
    if (tasks.length === 0) return;
    const output = `hermes: here's my current todo list that I keep forgetting to do:
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Track these for me. Every morning, ask me "What's your status on these?" and flag anything that's been sitting for more than 3 days. If I say "I did [task]", mark it done and celebrate with me.`;
    setTaskOutput(output);
  };

  const handleTemplateToggle = (id) => {
    setSelectedTemplates(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleGenerateWorkspace = () => {
    const selected = templates.filter(t => selectedTemplates.includes(t.id));
    if (selected.length === 0) { setWorkspaceOutput('Select at least one template above.'); return; }
    setWorkspaceOutput(selected.map(t => `--- ${t.title} ---\n${t.prompt}`).join('\n\n'));
  };

  const handleCustomBuilder = () => {
    if (!customProblem.trim()) return;
    const prompt = `hermes: I have a problem I need help tracking.

Here's my situation: ${customProblem}

Build me a tracking system that:
1. Logs the key data points I need to capture
2. Sets up any automated reminders or alerts
3. Generates useful summaries on a schedule

Give me the exact prompts I should use to set this up with you.`;
    setCustomPrompt(prompt);
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
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 07</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">The 80m Chat App</h2>
        </div>
        <button onClick={onClose} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto" ref={lessonScrollRef}>
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* Section Nav */}
          <div className="sticky top-0 z-40 bg-[#eae7de]/95 backdrop-blur-sm border-b-[2px] border-[#111] mb-12 -mx-6 px-6 py-3">
            <div className="flex flex-wrap gap-2">
              {sections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => {
                    toggleSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`font-mono text-xs font-bold uppercase px-3 py-1.5 border-[2px] transition-all ${
                    completedSections.includes(sec.id)
                      ? 'bg-[#22c55e] text-[#111] border-[#22c55e]'
                      : 'bg-transparent text-[#111] border-[#111] hover:bg-[#111] hover:text-[#eae7de]'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== S0: INTRO ===== */}
          <div id="s0" className="mb-24">
            <SectionMeta title="S0: Intro — The App Already in Their Hands" sectionNum="00" />

            <MacWindow title="Welcome to Class 07" className="mb-8">
              <div className="space-y-6">
                <h3 className="font-serif text-4xl font-black text-[#111] leading-tight">You downloaded the app. Now let's make it yours.</h3>
                <p className="font-sans text-lg text-[#aaa] leading-relaxed">
                  This course is different. You didn't pay extra for it. You didn't upgrade to Pro. You already have the tool — the 80m Chat App — sitting on your phone right now.
                </p>
                <p className="font-sans text-lg text-[#aaa] leading-relaxed">
                  Most people use it like a fancy Siri. You ask a question, you get an answer. Cool. But that's like buying a supercar and only driving it to the grocery store.
                </p>
                <p className="font-sans text-lg text-[#aaa] leading-relaxed">
                  This course shows you what the app actually is: <strong>a personal command center</strong>. An agent that remembers everything. Ghost workers that run while you sleep. A system you can build around your exact life.
                </p>
              </div>
            </MacWindow>

            {/* Stats panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Agents', value: '7', sub: 'Specialized orbs' },
                { label: 'Memory', value: 'Forever', sub: 'Persistent recall' },
                { label: 'Skills', value: '10+', sub: 'Downloadable tools' },
                { label: 'Crons', value: '∞', sub: 'Scheduled automation' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#111] border-[3px] border-[#111] p-4 text-center">
                  <div className="font-serif text-3xl font-black text-[#22c55e]">{stat.value}</div>
                  <div className="font-sans font-black text-xs uppercase text-[#eae7de] mt-1">{stat.label}</div>
                  <div className="font-mono text-[10px] uppercase text-[#888] mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            <MacWindow title="What This Course Covers" className="mb-8">
              <div className="space-y-3">
                {[
                  ['The Agent Council', 'All 7 orbs — what they do and when to use which'],
                  ['Memory & Fabric', 'Your second brain that never forgets'],
                  ['Skills', 'Downloadable brain patches for new abilities'],
                  ['Crons', 'Ghost workers running on autopilot'],
                  ['Sessions & Tasks', 'Your searchable work history'],
                  ['Webhooks', 'How other apps talk to your agent'],
                  ['15 Real-World Apps', 'Copy-paste setups for 15 different jobs'],
                ].map(([title, detail]) => (
                  <div key={title} className="flex items-start gap-3 border-b border-[#ddd] pb-3 last:border-0">
                    <span className="text-[#22c55e] font-black text-lg mt-[-2px]">✓</span>
                    <div>
                      <span className="font-sans font-black text-[#111]">{title}</span>
                      <span className="font-sans text-[#555] text-sm ml-2">— {detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </MacWindow>

            {/* Warmup */}
            <div className="bg-[#fffbeb] border-[3px] border-[#f59e0b] p-6 mb-6">
              <p className="font-sans font-black text-sm uppercase mb-3 text-[#92400e]">Warmup: Your First Message</p>
              <p className="font-serif text-lg text-[#aaa] italic mb-4">Before we dig in — open the 80m app right now and send Hermes this:</p>
              <div className="bg-[#111] p-4 font-mono text-sm text-[#22c55e] mb-4">
                hey hermes, my name is [your name]. I'm taking a course on how to use you properly. Here's one thing I want to keep track of: [one thing you're always forgetting]. Save this to memory.
              </div>
              <p className="font-sans text-sm text-[#555]">That's it. Your first memory dump. Hermes will organize it and you'll see it remember you next time you open the app.</p>
            </div>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s0'); setQuizSection(1); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 1: Agent Council →
              </button>
            </div>
          </div>

          {/* ===== S2: WHAT 80M ACTUALLY IS ===== */}
          <div id="s2" className="mb-24">
            <SectionMeta title="S3: What 80m Actually Is" sectionNum="03" />

            <MacWindow title="The Architecture" className="mb-8">
              <div className="font-mono text-sm leading-relaxed text-[#aaa] bg-[#1a1a1a] p-6 overflow-x-auto">
                <pre className="text-[#22c55e]">{`
  YOU
   ↕ talk
  HERMES (main agent)
   ↕ delegates
  ┌──┬──┬──┬──┬──┬──┬──┐
  │Pwn│Sir│Clu│Knn│Kof│Lab│Clw│  ← the 7 agents
  └──┴──┴──┴──┴──┴──┴──┘
   ↕ stores
  FABRIC (memory)
   ↕ runs
  CRONS (scheduled tasks)
   ↕ connects
  SKILLS (downloadable abilities)
                `}</pre>
                <div className="mt-4 text-[#888] text-xs">
                  YOU talk to HERMES → HERMES delegates to the right agent → Agent uses FABRIC (memory) → CRONS run on schedule → SKILLS extend capabilities
                </div>
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Orb Explorer — Click Each Agent</h3>
            <p className="font-sans text-[#555] mb-6">Each orb is a specialized agent. Click one to see what it does and when to use it.</p>

            {/* Orb grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {orbs.map(orb => (
                <button
                  key={orb.id}
                  onClick={() => setSelectedOrb(orb.id === selectedOrb ? null : orb.id)}
                  className={`text-left p-4 border-[3px] transition-all ${
                    selectedOrb === orb.id
                      ? 'bg-[#111] border-[#22c55e] text-[#eae7de]'
                      : 'bg-[#f5f3ef] border-[#111] text-[#111] hover:border-[#22c55e]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{orb.icon}</span>
                    <span className={`font-mono text-xs font-black uppercase ${selectedOrb === orb.id ? 'text-[#22c55e]' : 'text-[#888]'}`}>{orb.id}</span>
                  </div>
                  <div className={`font-serif font-black text-lg ${selectedOrb === orb.id ? 'text-[#eae7de]' : ''}`}>{orb.name}</div>
                  <div className={`font-mono text-xs uppercase mt-0.5 ${selectedOrb === orb.id ? 'text-[#888]' : 'text-[#555]'}`}>{orb.role}</div>
                </button>
              ))}
            </div>

            {/* Selected orb detail */}
            {selectedOrb && (() => {
              const orb = orbs.find(o => o.id === selectedOrb);
              return (
                <MacWindow title={`${orb.icon} ${orb.name}`} className="border-[#22c55e]">
                  <div className="space-y-4">
                    <div>
                      <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-1">Role</p>
                      <p className="font-sans font-black text-[#111]">{orb.role}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-1">What it does</p>
                      <p className="font-sans text-[#aaa]">{orb.desc}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-1">Best for</p>
                      <p className="font-sans text-[#aaa]">{orb.best}</p>
                    </div>
                    <div className="bg-[#111] p-3 font-mono text-xs text-[#22c55e]">
                      Prompt: "Use {orb.name} to handle: [your task]"
                    </div>
                  </div>
                </MacWindow>
              );
            })()}

            <div className="flex justify-end mt-6 mb-8">
              <button
                onClick={() => { toggleSection('s1'); setQuizSection(1); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 1: Agent Council →
              </button>
            </div>
          </div>

          {/* ===== S3: TALKING TO HERMES ===== */}
          <div id="s3" className="mb-24">
            <SectionMeta title="S4: Talking to Hermes (For Real This Time)" sectionNum="04" />

            <MacWindow title="Talk to Hermes like you're texting a smart friend who never forgets." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
                  Most people talk to AI like it's a search engine. "What's the weather?" "Define photosynthesis." Cool, but you're wasting it.
                </p>
                <p className="font-sans text-[#aaa] leading-relaxed">
                  Hermes is a <strong>memory-powered agent</strong>. The more context you give it, the more useful it becomes. Think of it less like Google and more like hiring an executive assistant — you brief them once, they handle the rest.
                </p>
              </div>
            </MacWindow>

            <MacWindow title="Example: Mike the Plumber" className="mb-8">
              <div className="bg-[#111] font-mono text-sm p-4 space-y-2 text-[#eae7de]">
                <div><span className="text-[#22c55e]">you:</span> hey, I'm starting a plumbing business</div>
                <div><span className="text-[#22c55e]">you:</span> add this to memory: my name is Mike, I'm a plumber in Austin TX, I work solo, I hate invoicing, I need to remember when to call customers for follow-ups</div>
                <div><span className="text-[#22c55e]">you:</span> what can you help me track?</div>
                <div className="border-t border-[#333] pt-2 mt-2 text-[#aaa]">hermes: Got it Mike — I've saved your profile. Here's what I can track for you:<br/>• Job log (customer, address, work done, date)<br/>• Follow-up reminders (3 days after each job)<br/>• Invoice drafts (ready every Friday)<br/>• Expense tracker (receipts → categorized)<br/>Just say "new job" and I'll walk you through it.</div>
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">First Message Builder</h3>
            <p className="font-sans text-[#555] mb-6">Select your situation and we'll generate a "memory dump" message to paste to Hermes. This is how you brief your agent properly.</p>

            <div className="bg-[#f5f3ef] border-[3px] border-[#111] p-6 mb-6">
              <label className="font-mono text-xs font-black uppercase text-[#555] block mb-2">What describes you best?</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                {['freelancer', 'smallbusiness', 'student', 'sidehustle', 'organized'].map(s => (
                  <button key={s} onClick={() => { setSituation(s); setFirstMessage(''); }}
                    className={`font-sans font-black text-xs uppercase px-3 py-2 border-[2px] transition-all ${situation === s ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'bg-transparent text-[#111] border-[#111] hover:bg-[#111] hover:text-[#eae7de]'}`}>
                    {s === 'freelancer' ? 'Freelancer' : s === 'smallbusiness' ? 'Small Biz' : s === 'student' ? 'Student' : s === 'sidehustle' ? 'Side Hustle' : 'Organized'}
                  </button>
                ))}
              </div>
              <button onClick={handleFirstMessage}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all mb-4">
                Generate My First Message
              </button>
              {firstMessage && (
                <div className="relative">
                  <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap">{firstMessage}</div>
                  <button onClick={() => handleCopy(firstMessage)}
                    className="absolute top-2 right-2 font-mono text-xs font-bold uppercase px-3 py-1 bg-[#22c55e] text-[#111] hover:bg-[#eae7de] transition-all">
                    Copy
                  </button>
                </div>
              )}
            </div>

            {/* Boss Mode vs Vague */}
            <MacWindow title="Boss Mode vs Vague Prompting" className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border-[2px] border-red-300 p-4">
                  <p className="font-mono text-xs font-black uppercase text-red-600 mb-2">❌ Vague</p>
                  <p className="font-mono text-sm text-[#aaa] italic">"can you maybe help me with my budget?"</p>
                  <p className="font-sans text-xs text-[#555] mt-2">Result: generic advice, no action taken</p>
                </div>
                <div className="bg-green-50 border-[2px] border-green-400 p-4">
                  <p className="font-mono text-xs font-black uppercase text-green-700 mb-2">✓ Boss Mode</p>
                  <p className="font-mono text-sm text-[#aaa]">"I earn $4,200/mo. My fixed expenses are $2,800. Give me a budget breakdown with categories, tell me what to cut, and save this to memory."</p>
                  <p className="font-sans text-xs text-[#555] mt-2">Result: specific plan, saved to Fabric, actionable</p>
                </div>
              </div>
            </MacWindow>

            <div className="bg-[#fffbeb] border-[3px] border-[#f59e0b] p-6 mb-6">
              <p className="font-sans font-black text-sm uppercase mb-2 text-[#92400e]">Pro tip: Chain-of-Thought</p>
              <p className="font-sans text-[#aaa]">Add "think step by step before answering" to any complex question. It forces Hermes to show its reasoning, catches errors, and produces better results. Example: "Think step by step: should I hire a VA or do this myself? Consider: my hourly rate, the task complexity, and my time constraints."</p>
            </div>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s2'); setQuizSection(2); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 2: Prompting →
              </button>
            </div>
          </div>

          {/* ===== S4: MEMORY & FABRIC ===== */}
          <div id="s4" className="mb-24">
            <SectionMeta title="S5: Memory & Fabric — Your Second Brain" sectionNum="05" />

            <MacWindow title="Hermes doesn't forget. Ever. That's the whole point." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
                  Every conversation with Hermes feeds into <strong>Fabric</strong> — the long-term memory layer. This isn't session context that disappears. This is your life, stored in SQLite, recalled on demand.
                </p>
                <div className="bg-[#111] p-4">
                  <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-2">Memory Pipeline</p>
                  <div className="flex items-center gap-2 text-[#eae7de] font-mono text-sm flex-wrap">
                    <span className="bg-[#333] px-2 py-0.5 rounded">YOU</span>
                    <span>→</span>
                    <span className="bg-[#333] px-2 py-0.5 rounded">HERMES</span>
                    <span>→</span>
                    <span className="bg-[#333] px-2 py-0.5 rounded">FABRIC</span>
                    <span>→</span>
                    <span className="bg-[#333] px-2 py-0.5 rounded">SQLite</span>
                    <span>→</span>
                    <span className="bg-[#22c55e] text-[#111] px-2 py-0.5 rounded">Long-term recall</span>
                  </div>
                </div>
                <p className="font-sans text-[#aaa]">
                  The <code className="bg-[#f0f0f0] px-1 font-mono text-sm">mcp_memory</code> tool is what makes this work. When you say "save this to memory," it goes through Fabric into SQLite. Next session, Hermes already knows you.
                </p>
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Memory Audit</h3>
            <p className="font-sans text-[#555] mb-6">Tell Hermes everything about you in plain English. It'll organize it into a proper memory profile.</p>

            <div className="bg-[#f5f3ef] border-[3px] border-[#111] p-6 mb-6">
              <label className="font-mono text-xs font-black uppercase text-[#555] block mb-2">What do you want Hermes to remember about you?</label>
              <textarea
                value={memoryInput}
                onChange={e => setMemoryInput(e.target.value)}
                placeholder="I'm a [what you do]. My main goals right now are [3 things]. I struggle with [pet peeves]. I want you to handle [things you hate doing]. I'm working on [current projects]..."
                className="w-full h-32 p-3 border-[2px] border-[#111] bg-white font-mono text-sm text-[#aaa] resize-none focus:outline-none focus:border-[#22c55e]"
              />
              <button onClick={handleMemoryAudit}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all mt-4">
                Generate Memory Statement
              </button>
              {memoryOutput && (
                <div className="relative mt-4">
                  <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap">{memoryOutput}</div>
                  <button onClick={() => handleCopy(memoryOutput)}
                    className="absolute top-2 right-2 font-mono text-xs font-bold uppercase px-3 py-1 bg-[#22c55e] text-[#111] hover:bg-[#eae7de] transition-all">
                    Copy
                  </button>
                </div>
              )}
            </div>

            <MacWindow title="Session Search" className="mb-8">
              <p className="font-sans text-[#aaa] mb-3">Every conversation with Hermes is searchable. Did you talk about something weeks ago? Just ask:</p>
              <div className="bg-[#111] p-4 font-mono text-sm text-[#22c55e] mb-3">
                hermes: did we talk about [topic]? what did I say?
              </div>
              <p className="font-sans text-sm text-[#555]">Hermes will pull the relevant session from Fabric and give you the answer. No more losing important decisions to the scroll.</p>
            </MacWindow>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s3'); setQuizSection(3); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 3: Memory →
              </button>
            </div>
          </div>

          {/* ===== S5: SKILLS ===== */}
          <div id="s5" className="mb-24">
            <SectionMeta title="S6: Skills — The Downloadable Brain Patches" sectionNum="06" />

            <MacWindow title="Skills are like browser extensions for your brain." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
                  Skills extend what Hermes can do. Think of them as downloadable ability packs. Install one, and Hermes gains a new tool.
                </p>
                <p className="font-sans text-[#aaa] leading-relaxed">
                  Most skills just need an API key and a brief. No coding. No configuration files. You tell Hermes what you want, it sets it up.
                </p>
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Skill Picker</h3>
            <p className="font-sans text-[#555] mb-6">Click a skill to see what it does. Each one comes with a "Install" button that generates the prompt to paste to Hermes.</p>

            <div className="space-y-3 mb-6">
              {skills.map(skill => (
                <div key={skill.name} className={`border-[3px] transition-all ${selectedSkill === skill.name ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#111] bg-[#f5f3ef]'}`}>
                  <button
                    onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                    className="w-full text-left p-4 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-sans font-black text-[#111]">{skill.name}</span>
                      <span className="font-sans text-[#555] text-sm ml-3">{skill.desc}</span>
                    </div>
                    <span className={`font-mono text-lg transition-transform ${selectedSkill === skill.name ? 'rotate-90' : ''}`}>{selectedSkill === skill.name ? '▼' : '▶'}</span>
                  </button>
                  {selectedSkill === skill.name && (
                    <div className="px-4 pb-4">
                      <div className="bg-[#111] p-3 font-mono text-xs text-[#22c55e] mb-3 whitespace-pre-wrap">{skill.installPrompt}</div>
                      <button onClick={() => handleCopy(skill.installPrompt)}
                        className="font-mono text-xs font-bold uppercase px-4 py-2 bg-[#22c55e] text-[#111] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                        Copy Install Prompt
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s4'); setQuizSection(4); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 4: Skills →
              </button>
            </div>
          </div>

          {/* ===== S6: CRONS ===== */}
          <div id="s6" className="mb-24">
            <SectionMeta title="S7: Crons — The Ghost Workers" sectionNum="07" />

            <MacWindow title="Set it once. Let it run. Forget about it. Get results." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
                  A cron job is a thing that runs on a schedule, automatically, without you doing anything. Think of them as ghost workers — you hire them once, they work forever.
                </p>
                <div className="bg-[#111] p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-[#888] mb-2">Crontab examples:</div>
                  <div className="text-[#22c55e] space-y-1">
                    <div><span className="text-[#888]">0 8 * * 1-5</span>    → every weekday at 8am: morning brief</div>
                    <div><span className="text-[#888]">30 21 * * *</span>   → every day at 9:30pm: evening wrap-up</div>
                    <div><span className="text-[#888]">0 9 1 * *</span>     → 1st of every month: finance audit</div>
                    <div><span className="text-[#888]">0 17 * * 5</span>    → every Friday at 5pm: weekly review</div>
                  </div>
                </div>
                <p className="font-mono text-xs text-[#555]">Cron syntax: minute | hour | day | month | weekday. 0-23 for hours, 1-7 for weekdays (Mon=1).</p>
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Cron Builder</h3>
            <p className="font-sans text-[#555] mb-6">Pick your trigger and task. We'll generate the exact prompt to paste to Hermes.</p>

            <div className="bg-[#f5f3ef] border-[3px] border-[#111] p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="font-mono text-xs font-black uppercase text-[#555] block mb-2">When should it run?</label>
                  <div className="space-y-2">
                    {Object.entries(cronTemplates).map(([key, val]) => (
                      <button key={key} onClick={() => { setCronTrigger(key); setCronOutput(''); }}
                        className={`w-full text-left font-mono text-xs px-3 py-2 border-[2px] transition-all ${cronTrigger === key ? 'bg-[#111] text-[#22c55e] border-[#22c55e]' : 'bg-transparent text-[#111] border-[#111] hover:border-[#22c55e]'}`}>
                        {val.desc}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-mono text-xs font-black uppercase text-[#555] block mb-2">What should it do?</label>
                  <div className="space-y-2">
                    {[
                      { key: 'brief', label: '📋 Morning/Evening Brief' },
                      { key: 'content', label: '🎨 Content Generation' },
                      { key: 'finance', label: '💰 Finance Review' },
                      { key: 'review', label: '✅ Task Review' },
                    ].map(t => (
                      <button key={t.key} onClick={() => setCronTask(t.key)}
                        className={`w-full text-left font-mono text-xs px-3 py-2 border-[2px] transition-all ${cronTask === t.key ? 'bg-[#111] text-[#22c55e] border-[#22c55e]' : 'bg-transparent text-[#111] border-[#111] hover:border-[#22c55e]'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleCronBuild}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                Build Cron Prompt
              </button>
              {cronOutput && (
                <div className="relative mt-4">
                  <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap">{cronOutput}</div>
                  <button onClick={() => handleCopy(cronOutput)}
                    className="absolute top-2 right-2 font-mono text-xs font-bold uppercase px-3 py-1 bg-[#22c55e] text-[#111] hover:bg-[#eae7de] transition-all">
                    Copy
                  </button>
                </div>
              )}
            </div>

            <MacWindow title="Real Examples from Real Life" className="mb-8">
              <div className="space-y-3">
                {[
                  { who: 'The Freelancer', cron: 'Every Monday 9am', what: 'Review my open projects, flag anything overdue, suggest this week\'s priorities' },
                  { who: 'The Content Creator', cron: 'Every Friday 5pm', what: 'Generate my content stockpile — 7 post ideas for next week with captions' },
                  { who: 'The Small Business Owner', cron: '1st of every month', what: 'Audit my finances — total income, expenses by category, profit margin' },
                  { who: 'The Student', cron: 'Every Sunday 7pm', what: 'Review my assignments for the week, break down big projects into tasks' },
                ].map(ex => (
                  <div key={ex.who} className="flex items-start gap-3 border-b border-[#ddd] pb-3 last:border-0">
                    <span className="font-mono text-xs font-black text-[#22c55e] whitespace-nowrap mt-0.5">{ex.cron}</span>
                    <div>
                      <span className="font-sans font-black text-[#111] text-sm">{ex.who}:</span>
                      <span className="font-sans text-[#555] text-sm ml-2">{ex.what}</span>
                    </div>
                  </div>
                ))}
              </div>
            </MacWindow>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s5'); setQuizSection(5); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 5: Crons →
              </button>
            </div>
          </div>

          {/* ===== S7: SESSIONS & TASKS ===== */}
          <div id="s7" className="mb-24">
            <SectionMeta title="S8: Sessions & Tasks — Your Work Log" sectionNum="08" />

            <MacWindow title="Sessions are your work history. Tasks are your accountability partner." className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-2">Sessions</p>
                  <p className="font-sans text-[#aaa]">Every conversation with Hermes = a session. Searchable, reviewable, resumable. "What were we talking about last week?" Ask Hermes, it pulls the session.</p>
                </div>
                <div>
                  <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-2">Tasks</p>
                  <p className="font-sans text-[#aaa]">Structured todos that Hermes tracks. The <code className="bg-[#f0f0f0] px-1 font-mono text-xs">mcp_todo</code> tool. You create them, Hermes nags you about them. Overdue items get flagged automatically.</p>
                </div>
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Task Manager Setup</h3>
            <p className="font-sans text-[#555] mb-6">What are 3 things you keep forgetting to do? We'll turn them into tracked tasks.</p>

            <div className="bg-[#f5f3ef] border-[3px] border-[#111] p-6 mb-6">
              <div className="space-y-3 mb-4">
                {[task1, task2, task3].map((val, i) => (
                  <input key={i} type="text" value={val} onChange={e => [setTask1, setTask2, setTask3][i](e.target.value)}
                    placeholder={`Task ${i + 1}: Something I keep forgetting...`}
                    className="w-full p-3 border-[2px] border-[#111] bg-white font-mono text-sm text-[#aaa] focus:outline-none focus:border-[#22c55e]" />
                ))}
              </div>
              <button onClick={handleTaskSetup}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                Generate Task Setup Prompt
              </button>
              {taskOutput && (
                <div className="relative mt-4">
                  <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap">{taskOutput}</div>
                  <button onClick={() => handleCopy(taskOutput)}
                    className="absolute top-2 right-2 font-mono text-xs font-bold uppercase px-3 py-1 bg-[#22c55e] text-[#111] hover:bg-[#eae7de] transition-all">
                    Copy
                  </button>
                </div>
              )}
            </div>

            <MacWindow title="How to Use Sessions to Pick Up Where You Left Off" className="mb-8">
              <div className="bg-[#111] font-mono text-sm p-4 space-y-2">
                <div><span className="text-[#22c55e]">you:</span> what were we working on last time?</div>
                <div className="text-[#aaa] border-l-2 border-[#444] pl-3">hermes: Last session we set up your invoice tracker for your electrical work. You had 3 pending invoices for [Client A], [Client B], [Client C]. We also discussed... Continue?</div>
                <div><span className="text-[#22c55e]">you:</span> yes, continue</div>
              </div>
              <p className="font-sans text-sm text-[#555] mt-3">Sessions are your continuity thread. Hermes always knows where you left off.</p>
            </MacWindow>
          </div>

          {/* ===== S8: WEBHOOKS & INTEGRATIONS ===== */}
          <div id="s8" className="mb-24">
            <SectionMeta title="S9: Webhooks & Integrations" sectionNum="09" />

            <MacWindow title="Webhooks are how other apps talk to Hermes. Integrations are how Hermes talks to other apps." className="mb-8">
              <div className="bg-[#111] p-4 font-mono text-sm mb-4">
                <div className="flex items-center justify-center gap-3 text-[#eae7de] flex-wrap">
                  <span className="bg-[#333] px-2 py-1 rounded">Discord</span>
                  <span className="text-[#22c55e]">→</span>
                  <span className="bg-[#333] px-2 py-1 rounded">webhook</span>
                  <span className="text-[#22c55e]">→</span>
                  <span className="bg-[#22c55e] text-[#111] px-2 py-1 rounded font-black">HERMES</span>
                  <span className="text-[#22c55e]">→</span>
                  <span className="bg-[#333] px-2 py-1 rounded">Discord</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { app: 'Discord', flow: 'Message → Hermes → summary → DM you' },
                  { app: 'GitHub', flow: 'PR merged → Hermes → notify you + log' },
                  { app: 'Gmail', flow: 'New email → Hermes → categorize + draft reply' },
                  { app: 'Stripe', flow: 'Payment → Hermes → update finance log' },
                ].map(ex => (
                  <div key={ex.app} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-black text-[#22c55e] whitespace-nowrap mt-0.5">{ex.app}:</span>
                    <span className="font-sans text-sm text-[#555]">{ex.flow}</span>
                  </div>
                ))}
              </div>
            </MacWindow>

            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Integration Picker</h3>
            <p className="font-sans text-[#555] mb-6">Click an integration to see what it does and how to set it up.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {integrations.map(int => (
                <button key={int.name}
                  onClick={() => setSelectedIntegration(selectedIntegration === int.name ? null : int.name)}
                  className={`text-left p-3 border-[2px] transition-all ${selectedIntegration === int.name ? 'bg-[#111] border-[#22c55e] text-[#eae7de]' : 'bg-[#f5f3ef] border-[#111] text-[#111] hover:border-[#22c55e]'}`}>
                  <div className={`font-sans font-black text-sm ${selectedIntegration === int.name ? 'text-[#22c55e]' : ''}`}>{int.name}</div>
                  <div className={`font-mono text-[10px] uppercase mt-0.5 ${selectedIntegration === int.name ? 'text-[#888]' : 'text-[#555]'}`}>integration</div>
                </button>
              ))}
            </div>

            {selectedIntegration && (() => {
              const int = integrations.find(i => i.name === selectedIntegration);
              return (
                <MacWindow title={`${int.name} Integration`} className="border-[#22c55e]">
                  <div className="space-y-4">
                    <p className="font-sans text-[#aaa]">{int.desc}</p>
                    <div>
                      <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-2">Setup</p>
                      <p className="font-sans text-sm text-[#555]">{int.setup}</p>
                    </div>
                    <div className="bg-[#111] p-3 font-mono text-xs text-[#22c55e]">
                      hermes: I want to connect {int.name} to my agent. What webhook endpoint should I use?
                    </div>
                  </div>
                </MacWindow>
              );
            })()}
          </div>

          {/* ===== S9: WORKSPACE TEMPLATES ===== */}
          <div id="s9" className="mb-24">
            <SectionMeta title="S10: Building Your Workspace — The Templates Section" sectionNum="10" />

            <MacWindow title="This is the good stuff. Here's exactly what to paste to Hermes." className="mb-8">
              <p className="font-sans text-[#aaa] leading-relaxed">
                Below are 7 copy-and-paste workspace templates. Each one is a complete setup for a specific aspect of your 80m system. Click any template to expand it, copy it, and paste it directly to Hermes.
              </p>
            </MacWindow>

            {/* Template checklist */}
            <div className="bg-[#f5f3ef] border-[3px] border-[#111] p-6 mb-6">
              <p className="font-mono text-xs font-black uppercase text-[#555] mb-3">Select templates to include in your workspace:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {templates.map(t => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedTemplates.includes(t.id)}
                      onChange={() => handleTemplateToggle(t.id)}
                      className="w-4 h-4 accent-[#22c55e]" />
                    <span className="font-sans font-black text-xs text-[#111]">{t.title}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleGenerateWorkspace}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                Generate My Workspace
              </button>
            </div>

            {/* Template cards */}
            <div className="space-y-4">
              {templates.map(t => (
                <MacWindow key={t.id} title={t.title}>
                  <div className="space-y-3">
                    <p className="font-sans text-[#aaa]">{t.desc}</p>
                    <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap">{t.prompt}</div>
                    <button onClick={() => handleCopy(t.prompt)}
                      className="font-mono text-xs font-bold uppercase px-4 py-2 bg-[#22c55e] text-[#111] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                      Copy Template
                    </button>
                  </div>
                </MacWindow>
              ))}
            </div>

            {/* Generated workspace output */}
            {workspaceOutput && workspaceOutput.length > 20 && (
              <div className="mt-6">
                <div className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap max-h-96 overflow-y-auto">{workspaceOutput}</div>
                <button onClick={() => handleCopy(workspaceOutput)}
                  className="mt-2 font-mono text-xs font-bold uppercase px-4 py-2 bg-[#22c55e] text-[#111] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                  Copy Full Workspace
                </button>
              </div>
            )}
          </div>

          {/* ===== S1: 15 REAL-WORLD APPS (HERO + CARD GRID) ===== */}
          <div id="s1" className="mb-24">
            <SectionMeta title="S2: 15 Real-World Applications" sectionNum="02" />

            {/* Hero MacWindow */}
            <MacWindow title="15 Real-World 80m Applications" className="mb-8" contentClass="bg-[#000]">
              <div className="p-6 space-y-4">
                <h3 className="font-serif text-3xl md:text-4xl font-black text-[#22c55e] leading-tight">Copy. Paste. Done.</h3>
                <p className="font-mono text-sm text-[#888] leading-relaxed">
                  These are real problems real people have. Every single one has a one-paragraph setup that turns Hermes into their personal assistant. Find yours. Paste the prompt. Done.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {[
                    { icon: '🔧', label: 'Trades & Services' },
                    { icon: '📊', label: 'Finance & Admin' },
                    { icon: '🎵', label: 'Creative Work' },
                    { icon: '🏠', label: 'Property & Clients' },
                    { icon: '📚', label: 'Education' },
                  ].map(tag => (
                    <span key={tag.label} className="font-mono text-xs text-[#22c55e] border border-[#1a3a1a] px-2 py-1">{tag.icon} {tag.label}</span>
                  ))}
                </div>
              </div>
            </MacWindow>

            {/* App Card Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  id: 1, person: 'Mike the Plumber', color: '#0ea5e9', problem: 'Bad website, misses follow-up calls',
                  icon: '🔧', prompt: "Track my jobs: customer name, address, what I fixed, when I followed up. Remind me to call 3 days after every job.",
                  output: 'Job log + automated follow-up cron', bonus: 'Customer portal for job history.',
                },
                {
                  id: 2, person: 'Sarah the Bookkeeper', color: '#22c55e', problem: 'Solo shop, no accountant, receipts everywhere',
                  icon: '💰', prompt: "Every time I send you a photo of a receipt, categorize it and add to my expense log. Monthly summary on the 1st.",
                  output: 'Receipt → categorized expense log + monthly report', bonus: 'Connect to Stripe to auto-log all transactions.',
                },
                {
                  id: 3, person: 'Carlos the Electrician', color: '#f59e0b', problem: 'Forgets to invoice, cash flow suffer',
                  icon: '⚡', prompt: "After every job, add it to my invoice tracker with hours and materials. Generate a draft invoice every Friday.",
                  output: 'Job → invoice draft every Friday', bonus: 'Send invoices via email automatically with Stripe payment links.',
                },
                {
                  id: 4, person: 'Streamer Dave', color: '#8b5cf6', problem: 'Lives on Discord, loses good moments',
                  icon: '🎮', prompt: "When I send you a clip URL, summarize it and crosspost a tweet thread.",
                  output: 'Clip URL → Twitter thread', bonus: 'Auto-clip highlights from VOD timestamps.',
                },
                {
                  id: 5, person: 'Producer Marcus', color: '#ec4899', problem: 'Forgets which beat went to which client',
                  icon: '🎵', prompt: "Log every beat I make: name, key, bpm, client if sold. Show me my catalog on demand.",
                  output: 'Beat catalog with search', bonus: 'Add sample clearance tracking and licensing reminders.',
                },
                {
                  id: 6, person: 'Office Manager Jennifer', color: '#06b6d4', problem: 'Meeting notes go nowhere',
                  icon: '📋', prompt: "Forward meeting notes to me. Extract action items and assign owners and due dates.",
                  output: 'Notes → tasks with owners and deadlines', bonus: 'Sync to Notion with a weekly review cron.',
                },
                {
                  id: 7, person: 'Ice Cream Shop Gina', color: '#f472b6', problem: 'Just wants to post, not think',
                  icon: '🍦', prompt: "Every time I send you a photo of an ice cream, give me an Instagram caption and 5 hashtags.",
                  output: 'Photo → caption + hashtags', bonus: 'Set up a daily content cron that pre-generates 7 days of captions.',
                },
                {
                  id: 8, person: 'Grower Jake', color: '#84cc16', problem: '200 plants, hard to track feeds',
                  icon: '🌱', prompt: "Log every feeding: plant ID, nutrients used, pH, date. Alert me 3 days before scheduled feed.",
                  output: 'Plant health tracker + feed reminders', bonus: 'Add watering schedules and harvest date tracking.',
                },
                {
                  id: 9, person: 'Flipper Tyler', color: '#f97316', problem: 'Buys low, forgets what he paid',
                  icon: '📦', prompt: "Log every marketplace find: item, price, source, listing URL. Calculate profit vs estimated resale.",
                  output: 'Hustle tracker with profit calc', bonus: 'Set price alerts for items you\'re tracking.',
                },
                {
                  id: 10, person: 'Coach Marcus', color: '#14b8a6', problem: 'Forgets client progress between sessions',
                  icon: '🏋️', prompt: "Log every client session: name, topic covered, what they struggled with, homework assigned.",
                  output: 'Client progress notes + monthly report', bonus: 'Generate workout plans based on progress history.',
                },
                {
                  id: 11, person: 'Depop Dani', color: '#a855f7', problem: 'Reposts same items, misses sales',
                  icon: '👕', prompt: "Track my listings: item, price, date posted, price reductions. Alert me when something has been listed for 2 weeks.",
                  output: 'Listing optimizer with stale alerts', bonus: 'Auto-generate repricing suggestions based on market data.',
                },
                {
                  id: 12, person: 'Landlord Luis', color: '#64748b', problem: 'Messy tenant communication',
                  icon: '🏠', prompt: "Log every tenant message: who, what, when. Remind me 3 days before rent is due. Flag maintenance requests.",
                  output: 'Tenant manager + rent reminders', bonus: 'Track lease dates and renewal notifications.',
                },
                {
                  id: 13, person: 'Tutor Priya', color: '#6366f1', problem: 'Different students, different needs',
                  icon: '📚', prompt: "Log every tutoring session: student name, topic covered, what they struggled with, homework assigned.",
                  output: 'Student progress notes', bonus: 'Generate personalized study plans based on struggle patterns.',
                },
                {
                  id: 14, person: 'Chef Marco', color: '#ef4444', problem: 'Forgets client preferences',
                  icon: '🍽️', prompt: "Remember these dietary preferences for catering clients: [list]. Generate grocery lists based on upcoming events.",
                  output: 'Client preference memory + grocery lists', bonus: 'Auto-calculate costs per event and track profit margins.',
                },
                {
                  id: 15, person: 'Realtor Aisha', color: '#0d9488', problem: 'Forgets which client wants what',
                  icon: '🏡', prompt: "Track client wishlists: name, budget, preferred neighborhoods, must-haves. Alert me when a listing matches 3+ criteria.",
                  output: 'Client matcher with listing alerts', bonus: 'Connect MLS webhook for automatic matching.',
                },
              ].map(app => {
                const isSelected = selectedApp === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(isSelected ? null : app.id)}
                    className={`text-left p-4 border-[2px] transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                        : 'border-[#333] hover:border-[#22c55e]'
                    }`} style={{ backgroundColor: isSelected ? '#0a1a0a' : '#111', minHeight: '160px' }}
                  >
                    {/* Color bar */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: app.color }} />
                    <div className="flex items-start gap-2 mb-2 mt-1">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <div className="font-sans font-black text-sm text-[#eae7de] leading-tight">{app.person.split(' ')[0]}</div>
                        <div className="font-mono text-[10px] text-[#888] uppercase">#{app.id}</div>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-[#888] leading-relaxed">{app.problem}</p>
                    {isSelected && (
                      <div className="mt-3 pt-2 border-t border-[#1a3a1a]">
                        <p className="font-mono text-[10px] text-[#22c55e] font-black uppercase mb-1">What it does:</p>
                        <p className="font-mono text-[10px] text-[#aaa]">{app.output}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected app detail - full prompt MacWindow */}
            {selectedApp && (() => {
              const app = realWorldApps.find(a => a.id === selectedApp);
              if (!app) return null;
              return (
                <MacWindow title={`#${app.id}: ${app.person}`} className="mb-6" contentClass="bg-[#000]">
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-3xl font-black text-[#22c55e]">#{app.id}</span>
                      <div>
                        <p className="font-sans font-black text-lg text-[#eae7de]">{app.person}</p>
                        <p className="font-sans text-sm text-[#888]">{app.problem}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase text-[#2a7a2a] tracking-widest mb-2">// COPY THIS PROMPT</p>
                      <div className="bg-[#0a1a0a] border border-[#1a3a1a] p-4 font-mono text-sm text-[#22c55e] whitespace-pre-wrap leading-relaxed">{app.prompt}</div>
                      <button onClick={() => handleCopy(app.prompt)}
                        className="mt-3 font-mono text-xs font-bold uppercase px-4 py-2 bg-[#22c55e] text-[#000] hover:bg-[#111] hover:text-[#22c55e] border border-[#22c55e] transition-all">
                        Copy Prompt
                      </button>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase text-[#2a7a2a] tracking-widest mb-2">// WHAT RUNS AUTOMATICALLY</p>
                      <p className="font-mono text-sm text-[#aaa]">{app.output}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase text-[#f59e0b] tracking-widest mb-2">// BONUS BUILD</p>
                      <p className="font-mono text-sm text-[#888] italic">{app.bonus}</p>
                    </div>
                  </div>
                </MacWindow>
              );
            })()}

            {/* Custom builder */}
            <MacWindow title="Custom Builder — Describe Your Problem" className="mb-8" contentClass="bg-[#000]">
              <p className="font-sans text-sm text-[#888] mb-4">Can't find your exact situation above? Describe your problem in one sentence and we'll generate a custom Hermes prompt for you.</p>
              <div className="space-y-3">
                <textarea value={customProblem} onChange={e => setCustomProblem(e.target.value)}
                  placeholder="Example: I run a dog walking business with 12 clients and I forget which dogs need which medication during walks..."
                  className="w-full h-24 p-3 border border-[#1a3a1a] bg-[#0a1a0a] font-mono text-sm text-[#22c55e] resize-none focus:outline-none focus:border-[#22c55e]" />
                <button onClick={handleCustomBuilder}
                  className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#000] border border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all">
                  Generate Custom Prompt
                </button>
                {customPrompt && (
                  <div className="relative">
                    <div className="bg-[#0a1a0a] border border-[#1a3a1a] p-4 font-mono text-xs text-[#22c55e] whitespace-pre-wrap">{customPrompt}</div>
                    <button onClick={() => handleCopy(customPrompt)}
                      className="absolute top-2 right-2 font-mono text-[10px] font-bold uppercase px-3 py-1 bg-[#22c55e] text-[#000] hover:bg-[#1a1a1a] hover:text-[#22c55e] transition-all">
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </MacWindow>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s1'); setQuizSection(2); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 2: Real-World Apps →
              </button>
            </div>
          </div>

          {/* ===== S10: TROUBLESHOOTING ===== */}
          <div id="s10" className="mb-24">
            <SectionMeta title="S11: Troubleshooting (For Dummies)" sectionNum="11" />

            <MacWindow title="The screen is red. The agent isn't responding. Here's what to do." className="mb-8">
              <p className="font-sans text-[#aaa] mb-4">
                The 80m system is solid, but things go wrong. Most issues have simple fixes. Here's your troubleshooting cheat sheet.
              </p>
            </MacWindow>

            <div className="space-y-3">
              {[
                { problem: '"Hermes isn\'t responding"', likely: 'Server might be down or timed out', fix: 'Check if your Beelink is on. Try again in 5 minutes. If it persists, restart the container with docker-compose restart.' },
                { problem: '"My memory isn\'t sticking"', likely: 'Memory isn\'t saved to long-term yet', fix: 'Use "save this to memory" explicitly in your message. The keywords matter — Fabric listens for that phrase.' },
                { problem: '"The cron didn\'t run"', likely: 'Wrong time format or server was asleep', fix: 'Check your crontab with `crontab -l`. Verify the cron expression is correct. Make sure your server wasn\'t in sleep mode.' },
                { problem: '"I broke something"', likely: 'You probably didn\'t break anything permanent', fix: 'Ctrl+C always exits. Restart the session. The worst case is you re-enter some context — nothing is permanently corrupted.' },
                { problem: '"I don\'t know what to say to Hermes"', likely: 'Start with anything. Seriously.', fix: 'Literally just say "hey" — it works. No prompt is too basic. Hermes is an assistant, not a judge.' },
                { problem: '"The skills aren\'t loading"', likely: 'Skill might not be installed', fix: 'Ask Hermes: "what skills do I have installed?" If yours isn\'t there, reinstall it with the install prompt.' },
                { problem: '"My agent is giving bad answers"', likely: 'Your prompt is too vague', fix: 'Add specifics: "be more detailed," "give me 3 options," "think step by step." Better prompts = better answers.' },
                { problem: '"Everything is overwhelming"', likely: 'That\'s normal. Start with one thing.', fix: 'Pick just the Memory Dump section (S3) and do that first. Get Hermes to remember you. Everything else gets easier from there.' },
              ].map(item => (
                <MacWindow key={item.problem} title={item.problem}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-mono text-xs font-black uppercase text-red-600 mb-1">What's Probably Happening</p>
                      <p className="font-sans text-sm text-[#555]">{item.likely}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-black uppercase text-green-700 mb-1">The Fix</p>
                      <p className="font-sans text-sm text-[#aaa]">{item.fix}</p>
                    </div>
                  </div>
                </MacWindow>
              ))}
            </div>
          </div>

          {/* ===== COMPLETION ===== */}
          <div className="mb-24">
            <MacWindow title="Course Complete" className="bg-[#111] border-[#22c55e]">
              <div className="space-y-6">
                <h3 className="font-serif text-4xl font-black text-[#22c55e] leading-tight">This course is different.</h3>
                <p className="font-sans text-lg text-[#eae7de] leading-relaxed">
                  You didn't buy new tools. You learned to use the tools you already had.
                </p>
                <div className="space-y-2">
                  {[
                    'How to talk to Hermes so it actually helps',
                    'How to make your agent remember what matters',
                    'How to set up ghost workers that run on autopilot',
                    'How to build niche tools for your exact life',
                    '15 copy-paste templates to start today',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="text-[#22c55e] font-black text-xl">✓</span>
                      <span className="font-sans text-[#eae7de]">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-[#22c55e] pt-4 mt-4">
                  <p className="font-serif text-2xl font-black text-[#eae7de] italic">
                    Next: Pick ONE of the 15 real-world examples. Build it this week. That's the whole course.
                  </p>
                </div>
              </div>
            </MacWindow>

            <div className="mt-8 p-6 bg-[#fffbeb] border-[3px] border-[#f59e0b]">
              <p className="font-mono text-xs font-black uppercase text-[#92400e] mb-2">Your Assignment</p>
              <p className="font-sans text-lg text-[#aaa]">
                Open the 80m app. Find the example that closest matches your life. Copy the prompt. Paste it to Hermes. Watch it set itself up in real time. That's homework. That's it.
              </p>
            </div>
          </div>

        </div>{/* close max-w-4xl */}
      </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} />

      {/* Quiz Modal */}
      {quizActive && quizSection && (
        <QuizModal
          title={`Class 07 — Section ${quizSection} Quiz`}
          questions={quizDataC07[quizSection - 1]?.questions || []}
          onClose={() => { setQuizActive(false); setQuizSection(null); }}
          onPass={(score, total) => {
            const passed = score >= Math.ceil(total * 0.6);
            setPassedQuizzes(prev => {
              const updated = [...new Set([...prev, quizSection])];
              try { localStorage.setItem('80m-c7-quizzes', JSON.stringify(updated)); } catch {}
              return updated;
            });
            setQuizDone({ section: quizSection, score, total, passed });
            setTimeout(() => setQuizDone(null), 5000);
          }}
        />
      )}
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
  },
  {
    id: "04",
    title: "Content Forge",
    subtitle: "The Ghost in the TikTok Machine",
    time: "90 Minutes",
    description: "Full TikTok slideshow automation — AI image generation, Postiz scheduling, physical Android control, and the anti-shadowban protocol.",
    image: "https://i.postimg.cc/BbsxmGcr/80mascot-Edited.png",
    topics: [
      { name: "Postiz API", detail: "Agentic scheduling that actually works." },
      { name: "3-Slide Formula", detail: "Hook, Info, CTA. Every time." },
      { name: "Android Control", detail: "The secret human-touch layer." },
      { name: "Anti-Shadowban", detail: "How to warm up and stay alive." }
    ]
  },
  {
    id: "05",
    title: "Intelligence Pipeline + Agent Products",
    subtitle: "Build Once, Stack Income Forever",
    time: "95 Minutes",
    description: "Turn your AI skills into income machines. Web crawlers, micro-SaaS, workflow automations, and agents that replace labor — the 8-lane highway to compounding revenue.",
    image: "https://i.postimg.cc/BbsxmGcr/80mascot-Edited.png",
    topics: [
      { name: "Web Research Pipelines", detail: "Cortex knowledge ingestion + automated enrichment." },
      { name: "Micro-SaaS Products", detail: "One job, one screen, one outcome — vibe coded in days." },
      { name: "Workflow Automations", detail: "B2B annoyance work that pays monthly." },
      { name: "Agent Products", detail: "AI agents that replace high-value employees." }
    ]
  },
  {
    id: "06",
    title: "The Full System + AI Business Playbook",
    subtitle: "Turn the Machine Into Money",
    time: "120 Minutes",
    description: "The capstone. You built the stack. Now make it print. Eight proven revenue models for vibe coders, from small business websites to micro-SaaS to productized consulting. This is where most courses end — and where 80m actually starts.",
    image: "https://i.postimg.cc/BbsxmGcr/80mascot-Edited.png",
    topics: [
      { name: "8 Revenue Models", detail: "Pick your lane and run it." },
      { name: "Vibe-to-Money Pipeline", detail: "From skill to sale in 72 hours." },
      { name: "Postiz + Agent Stack", detail: "The automated marketing engine." },
      { name: "Build-in-Public Flywheel", detail: "Content = distribution = revenue." },
      { name: "Micro-SaaS Launch", detail: "Ship fast, validate, iterate." },
      { name: "Productized Consulting", detail: "Sell outcomes, not hours." }
    ]
  },
  {
    id: "07",
    title: "The 80m Chat App",
    subtitle: "Build Your Personal Command Center",
    time: "90 Minutes",
    description: "The app you got for free is actually a platform. This course teaches you how to use every feature, wire up your own agents, and build niche tools for your exact life situation — with 15 real-world examples for plumbers, artists, weed growers, PS5 flippers, and everyone in between.",
    image: "https://i.postimg.cc/BbsxmGcr/80mascot-Edited.png",
    topics: [
      { name: "Agent Council", detail: "The 7 orbs explained — find your lane." },
      { name: "Memory & Skills", detail: "Your agent that actually remembers you." },
      { name: "Crons & Tasks", detail: "Ghost workers running while you sleep." },
      { name: "Build Your Workspace", detail: "Templates for agents, crons, tasks, skills." }
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
            <motion.p variants={fadeUp} className="font-sans text-xl md:text-3xl font-bold mix-blend-multiply text-[#aaa] max-w-3xl mx-auto">
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
                  <div className="font-serif text-lg md:text-xl text-[#aaa] space-y-6 leading-relaxed">
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
                    <p className="font-serif text-[#aaa] leading-snug">{item.desc}</p>
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
                    <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed mb-10 pb-10 border-b-[3px] border-[#111]/10">{cls.description}</p>
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
        {activeCourseId === "04" && <CourseFourContent key="course-04" onClose={() => setActiveCourseId(null)} />}
        {activeCourseId === "05" && <CourseFiveContent key="course-05" onClose={() => setActiveCourseId(null)} />}
        {activeCourseId === "06" && <CourseSixContent key="course-06" onClose={() => setActiveCourseId(null)} />}
        {activeCourseId === "07" && <CourseSevenContent key="course-07" onClose={() => setActiveCourseId(null)} />}
      </AnimatePresence>
    </div>
  );
}
