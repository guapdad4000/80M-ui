import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  NoiseOverlay,
  QuizModal,
  MacWindow,
  NeedBox,
  CourseBoostPanel,
  SectionMeta,
  CheckpointCard,
} from '../PortalShared';

// ===== quizDataC07 =====
const quizDataC07 = [
  {
    section: 1,
    questions: [
      { q: "Which agent in the 80m system is best suited for financial tracking and budget management?", options: ["Prawnius (o1)", "Sir Clawthchilds (o2)", "Claudnelius (o3)", "Knaight of Affairs (o5)"], correct: 1, explanation: "Sir Clawthchilds (o2) handles finances, budgets, and money-related tasks. Use Prawnius for quick one-offs, Sir Clawthchilds for money talk." },
      { q: "What does the Agent Council in 80m actually do?", options: ["It lets all 7 agents respond to every message simultaneously", "It lets you delegate specific task types to specialized agents, each optimized for their domain", "It automatically posts to TikTok", "It runs your cron jobs"], correct: 1, explanation: "The Agent Council is your specialized workforce. Each agent (Prawnius, Sir Clawthchilds, Claudnelius, etc.) handles their lane. Hermes delegates to the right one." },
      { q: "You need help writing Python code. Which agent should you route this to?", options: ["Labrina (o6) — social media agent", "Claudnelius (o3) — code and tech agent", "Knowledge Knaight (o4) — memory and facts", "Prawnius (o1) — quick tasks"], correct: 1, explanation: "Claudnelius (o3) is the code and tech specialist. It's optimized for programming, design, and technical problem-solving." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What is a 'Memory Dump' and when should you use it?", options: ["Deleting old conversations from Hermes", "Pasting all your disorganized thoughts and context into Hermes so it can organize and remember everything", "Exporting your memory to a text file", "Setting up encrypted memory storage"], correct: 1, explanation: "The Memory Dump is your 'dump everything in' move. Paste everything you want Hermes to know — your situation, goals, blockers, preferences — and let Hermes organize it." },
      { q: "What does 'chain-of-thought prompting' mean in plain English?", options: ["Asking Hermes to write chains on social media", "Telling Hermes to think step-by-step before answering, which produces more accurate and reasoned responses", "Linking multiple conversations together", "Creating a chain of agents that pass tasks between each other"], correct: 1, explanation: "Chain-of-thought means adding 'think step by step' to your prompt. It forces Hermes to show its work, catching errors and producing better reasoning." },
      { q: "What makes 'Boss Mode' prompting different from vague prompting?", options: ["Boss Mode means typing in all caps", "Boss Mode gives specific, directive instructions with clear outcomes — you get results instead of suggestions", "Boss Mode requires a special API key", "Boss Mode is only for Pro tier users"], correct: 1, explanation: "Boss Mode isn't a feature — it's a tone. Instead of 'can you maybe help me with my budget?' you say 'Here are my income sources. Here are my expenses. Give me a monthly budget breakdown and tell me what to cut.' Specific input, specific output." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is Fabric in the 80m system?", options: ["A code framework for building apps", "The long-term memory layer — every conversation, decision, and context is stored in SQLite for persistent recall", "A type of agent specialized in research", "A webhook integration service"], correct: 1, explanation: "Fabric is the memory backbone. When you say 'save this to memory,' it goes into Fabric. Every session, every decision, every context gets stored in SQLite." },
      { q: "How does memory work in the 80m system when you start a new session?", options: ["Memory is wiped every session", "Fabric stores long-term context in SQLite, so Hermes retains your profile, goals, and history across sessions", "You have to re-enter your name every time", "Memory only works on Pro tier"], correct: 1, explanation: "Fabric ensures continuity. Your name, your goals, your preferences — all stored in SQLite. Start a new session, Hermes already knows you." },
      { q: "What does the mcp_memory tool actually do?", options: ["It deletes old memories", "It stores and retrieves context — surfacing relevant memories from past sessions when you need them", "It encrypts your conversations", "It syncs with Google Calendar"], correct: 1, explanation: "mcp_memory is the memory access tool. It handles storing new context, retrieving relevant memories, and surfacing them at the right time." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is a Skill in the 80m system?", options: ["A personality trait of an agent", "A reusable workflow or tool package you can install to extend what Hermes can do", "A scheduling template", "A type of cron job"], correct: 1, explanation: "Skills are like browser extensions for Hermes. They add capabilities — Notion sync, Stripe billing, YouTube pipeline. You install a skill, Hermes gains a new ability." },
      { q: "How do you install a new skill in 80m?", options: ["Download a file from the internet and upload it", "Ask Hermes to install it and walk through the setup — 'I want to install the notion skill'", "Use the Skill Store app on your phone", "Skills come pre-installed and can't be added"], correct: 1, explanation: "Skills install through conversation. Tell Hermes 'I want to install the [skill name] skill' and it walks you through setup. Most skills just need an API key and a brief." },
      { q: "Which skill would you install if you wanted Hermes to automatically summarize YouTube videos?", options: ["stripe-80m", "youtube-content", "obsidian", "cortex"], correct: 1, explanation: "The youtube-content skill handles YouTube workflows — transcripts, summaries, spark pipelines. Give it a URL, get a summary, thread, or content repurposed." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is a cron job in the 80m system?", options: ["A type of agent that codes for you", "A scheduled task that runs automatically at specific times — ghost workers that run while you sleep", "An emergency button for when Hermes stops responding", "A way to backup your memory to the cloud"], correct: 1, explanation: "Cron jobs are your ghost workers. Set them up once — 'every day at 9am, send me a morning brief' — and they run on schedule forever." },
      { q: "You want Hermes to send you a morning brief every weekday at 8am. What cron expression do you need?", options: ["*/5 * * * * (every 5 minutes)", "0 8 * * 1-5 (8:00 AM, Monday through Friday)", "0 0 1 * * (midnight on the 1st of every month)", "30 21 * * * (8:30 PM every day)"], correct: 1, explanation: "The cron expression '0 8 * * 1-5' means: at minute 0, hour 8, every day, every month, Monday(1) through Friday(5)." },
      { q: "Which of these is the best use case for a cron job in 80m?", options: ["Asking Hermes a one-off question", "Generating a weekly summary every Friday at 4pm — something you want to happen regularly without manually triggering it", "Fixing a broken memory", "Uploading a single file"], correct: 1, explanation: "Cron jobs are for recurring, predictable, automated tasks. Weekly wrap-ups, daily briefs, monthly finance audits — things that happen on a schedule and don't need your input each time." },
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
      { q: "In the 80m Content Forge stack, what role does the Android phone play?", options: ["A backup for when Postiz is down", "The human-touch layer — Hermes controls it to post natively so TikTok thinks a real person is posting", "A WiFi hotspot for the server", "A way to monitor TikTok analytics"], correct: 1, explanation: "The Android is the secret. Postiz sends to Drafts, Hermes picks them up via ADB, the phone posts natively. TikTok's algorithm sees phone-based posting and treats it as organic." },
      { q: "What does Hermes coordinate in the Content Forge pipeline?", options: ["Only image generation", "Everything — image generation via Gemini, Postiz scheduling via API, and Android control via ADB", "Only posting to TikTok", "Only storing API keys"], correct: 1, explanation: "Hermes is the foreman. It takes your content brief, sends it to Gemini for image generation, loads drafts into Postiz, and coordinates the Android to pick them up and post." },
      { q: "Why is Postiz described as 'for your agent, not for you'?", options: ["Postiz is broken on mobile", "Once you connect TikTok and give Hermes the API key, you never touch Postiz again — Hermes manages the entire queue", "Postiz only works on servers", "Postiz requires a coding degree to use"], correct: 1, explanation: "The one-time Postiz setup is: connect TikTok, grab API key, give key to Hermes. After that, Hermes owns the queue. You only touch Postiz if something breaks." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is Draft Mode in Postiz?", options: ["A feature that saves your post as a draft in Postiz's database", "A setting that sends posts to your TikTok Drafts folder instead of publishing directly — required for Android-native posting", "A way to preview posts before scheduling", "A backup system for failed posts"], correct: 1, explanation: "Draft Mode is what makes the Android step work. Posts go to your TikTok account's native Drafts folder. The Android picks them up from there, adds audio, and posts." },
      { q: "What information do you need to give Hermes to activate Postiz?", options: ["Your TikTok username and password", "Your Postiz API key, plus the 7 posting rules", "Your credit card number", "Nothing — Hermes already knows how to use Postiz"], correct: 1, explanation: "Hermes needs your Postiz API key to authenticate, plus the 7 rules to ensure posts go to Drafts only with the right settings." },
      { q: "What is the correct sequence of Postiz setup steps?", options: ["Generate API key → Connect TikTok → Give to Hermes", "Connect TikTok → Grab API key → Store in Hermes with rules", "Create Postiz account → Post immediately → Add TikTok later", "Install Postiz app → Login → Done"], correct: 1, explanation: "The right order: (1) Connect TikTok to Postiz, (2) Grab the API key from Settings, (3) Give the key to Hermes along with all 7 rules." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is Nano Banana 2 and why does it matter for slideshow marketing?", options: ["A TikTok feature for slideshow creation", "Google Gemini's image generation model — used to create professional slideshow images at scale without designers", "A Samsung phone model", "A Postiz plugin"], correct: 1, explanation: "Nano Banana 2 is Google Gemini's image gen model. You give it a text prompt, it produces an image. Combined with the 3-slide structure, you can generate hundreds of professional slideshow sets." },
      { q: "Why does a vague prompt like 'make a nice TikTok image' produce bad results?", options: ["Gemini is broken", "Vague prompts give the AI no specific direction — no subject, style, mood, or format. The output matches the input: generic.", "TikTok has image restrictions", "Nano Banana 2 requires coding to use"], correct: 1, explanation: "AI image gen is only as good as your prompt. 'Nice TikTok image' = random output. Specific, detailed prompts = exactly what you wanted." },
      { q: "How many images do you need for one day of TikTok slideshow content?", options: ["1 image", "3 images (one per slide)", "9 images (3 slides × 3 posts)", "As many as you feel like"], correct: 1, explanation: "One TikTok slideshow post = 3 images (hook, info, CTA). One day of content at 3 posts/day = 9 images." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is the job of Slide 1 (The Hook) in the 3-slide formula?", options: ["Give all the information at once", "Stop the scroll — make the viewer curious or promise a tangible result in the first 2 seconds", "Show your brand logo", "Introduce yourself as the creator"], correct: 1, explanation: "The Hook's one job: stop the scroll. If they keep swiping, nothing else matters. Good hooks lead with a result, a controversy, or a curiosity gap." },
      { q: "What makes the 3-slide formula effective for slideshow marketing?", options: ["It uses video instead of images", "It has a clear structure that guides the viewer from curiosity → value → action, which matches how TikTok's algorithm rewards completion rate", "It posts automatically", "It uses more hashtags"], correct: 1, explanation: "TikTok's algorithm measures completion rate. The 3-slide formula maximizes completion: Hook gets them to watch, Info keeps them engaged, CTA drives the save/share." },
      { q: "Why is 'emotional pull' important for Slide 3 (The CTA)?", options: ["It makes the post longer", "It triggers a behavioral response — saves, shares, and comments — which are the signals TikTok uses to amplify content beyond your followers", "It adds more hashtags", "It prevents shadowban"], correct: 1, explanation: "The CTA isn't just telling them what to do — it's making them feel something while doing it. The emotion drives the action, and the action drives the algorithm." },
    ]
  },
];

const CourseFourContent = () => {
  const lessonScrollRef = useRef(null);
  const navigate = useNavigate();
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
    { id: 's0', label: 'Intro: The Ghost', anchor: '#c4-intro' },
    { id: 's1', label: '1. Anti-Shadowban', anchor: '#c4-s1' },
    { id: 's2', label: '2. The Stack', anchor: '#c4-s2' },
    { id: 's3', label: '3. Postiz Setup', anchor: '#c4-s3' },
    { id: 's4', label: '4. Image Gen', anchor: '#c4-s4' },
    { id: 's5', label: '5. 3-Slide Formula', anchor: '#c4-s5' },
    { id: 's6', label: '6. Stockpile', anchor: '#c4-s6' },
    { id: 's7', label: '7. Postiz Rules', anchor: '#c4-s7' },
    { id: 's8', label: '8. Secret Android', anchor: '#c4-s8' },
    { id: 's9', label: '9. Cron Automation', anchor: '#c4-s9' },
    { id: 's10', label: '10. Dictionary', anchor: '#c4-dictionary' },
    { id: 's11', label: '11. Resources', anchor: '#c4-resources' },
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
        <button onClick={() => navigate('/portal')} className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
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
                <Link
                  key={s.id}
                  to={`/portal/class-04${s.anchor}`}
                  onClick={(e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); toggleSection(s.id); }}
                  href={`/portal/class-04${s.anchor}`}
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
                </Link>
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
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
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
        <div id="c4-s1" className="mb-24">
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
        <div id="c4-s2" className="mb-24">
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
                <p className="font-serif text-[#444] text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 3: POSTIZ SETUP ===== */}
        <div id="c4-s3" className="mb-24">
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
        <div id="c4-s4" className="mb-24">
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
        <div id="c4-s5" className="mb-24">
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
        <div id="c4-s6" className="mb-24">
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
        <div id="c4-s7" className="mb-24">
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
        <div id="c4-s8" className="mb-24">
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
        <div id="c4-s9" className="mb-24">
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
                <p className="font-serif text-[#444] text-sm leading-relaxed">{item.def}</p>
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
              <p className="font-serif text-xs text-[#333] mb-2">Save this as <code className="bg-white px-1 font-mono">/skills/tiktok-slideshow.SKILL.md</code> in your OpenClaw workspace:</p>
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
              <ul className="font-mono text-xs text-[#333] space-y-2">
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
            <p className="font-serif text-xl text-[#333] mb-8 leading-relaxed">
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
              <button onClick={() => navigate('/portal')} className="font-sans font-black text-lg uppercase px-8 py-4 bg-white text-[#111] border-[3px] border-[#111] hover:border-[#22c55e] shadow-[6px_6px_0_0_#111] hover:-translate-y-1 transition-all">
                Exit to Curriculum →
              </button>
            </div>
          </div>
        </div>

      </div>
          </motion.div>
  );
};

export default CourseFourContent;
done
