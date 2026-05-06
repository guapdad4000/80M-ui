import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const StudentCompletionKit = ({ eyebrow = 'Completion kit', title, outcomes = [], drills = [], proof = [] }) => (
  <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
    <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// {eyebrow}</p>
    <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-6">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <div className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
        <p className="font-sans font-black uppercase text-sm text-[#111] mb-3">Student can now</p>
        <ul className="space-y-2 font-serif text-sm text-[#333] leading-relaxed">
          {outcomes.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
      <div className="border-[2px] border-[#111] bg-[#f0fdf4] p-4">
        <p className="font-sans font-black uppercase text-sm text-[#14532d] mb-3">Practice drills</p>
        <ul className="space-y-2 font-serif text-sm text-[#14532d] leading-relaxed">
          {drills.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
      <div className="border-[2px] border-[#111] bg-[#111] text-[#eae7de] p-4">
        <p className="font-sans font-black uppercase text-sm text-[#22c55e] mb-3">Proof of completion</p>
        <ul className="space-y-2 font-serif text-sm text-[#ddd] leading-relaxed">
          {proof.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
    </div>
    <CopyBlock
      label="Copy Completion Audit Prompt"
      text={`Hermes, audit my progress for this class.

Check whether I can now:
${outcomes.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

Ask me for missing proof if needed.
Return:
1. PASS/NEEDS WORK for each item
2. the safest next action
3. one practice drill for tomorrow
4. anything I should save to memory`}
    />
  </div>
);

// --- Course Content Pages ---

  const CourseFourContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const postizTerminalRef = useRef(null);
  const androidTerminalRef = useRef(null);
  const shadowbanResultRef = useRef(null);
  const promptOutputRef = useRef(null);
  const cronOutputRef = useRef(null);

  const scrollToRef = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
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
    { id: 's0', label: 'Intro: Content Forge' },
    { id: 's1', label: '1. Platform Safety' },
    { id: 's2', label: '2. The Stack' },
    { id: 's3', label: '3. Postiz Setup' },
    { id: 's4', label: '4. Image Gen' },
    { id: 's5', label: '5. 3-Slide Formula' },
    { id: 's6', label: '6. Stockpile' },
    { id: 's7', label: '7. Postiz Rules' },
    { id: 's8', label: '8. Review Layer' },
    { id: 's9', label: '9. Review Schedule' },
    { id: 's10', label: '10. Dictionary' },
    { id: 's11', label: '11. Resources' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const scenarios = [
    { label: 'Brand-owned account, warmup complete, posts reviewed before publishing', risk: 5, icon: '🟢', desc: 'Clean operating pattern. The account has real activity, reviewed content, and clear approval gates.' },
    { label: 'Established account, warmup complete, scheduler used for drafts', risk: 15, icon: '🟢', desc: 'Low risk. The system supports consistency while a human still reviews content quality and policy fit.' },
    { label: 'New account, skipped warmup, bulk publishing unreviewed posts', risk: 95, icon: '🔴', desc: 'High account risk. Too much volume too quickly, no quality review, and no platform-rule check.' },
    { label: 'Established account, some history, high-volume direct publishing', risk: 70, icon: '🟡', desc: 'Medium-high risk. Existing history helps, but volume without review can still trigger account or quality problems.' },
    { label: 'Only 1 warmup day, then scheduled drafts with review', risk: 40, icon: '🟡', desc: 'Better than blind publishing, but still rushed. Finish the warmup and review loop before scaling.' },
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

  const c4SafetyPrinciples = [
    { label: 'Draft first', detail: 'Hermes can prepare content, but publishing should go through review and approval.' },
    { label: 'Respect platform rules', detail: 'Use TikTok official rules, community guidelines, and commercial disclosure rules as the source of truth.' },
    { label: 'Human review', detail: 'Check claims, visuals, captions, and links before anything goes live.' },
    { label: 'Disclose when needed', detail: 'Branded, sponsored, affiliate, or AI-assisted content may need labels or policy checks.' },
    { label: 'Measure quality', detail: 'Track saves, comments, shares, watch time, and leads, not just posting volume.' },
    { label: 'Keep backups', detail: 'Save prompts, captions, source images, and approval decisions so the system can be audited.' }
  ];

  const c4ReviewDecisionTree = [
    { question: 'Does the post make a claim?', answer: 'Add the source, simplify the wording, and ask Hermes to separate fact from opinion before review.' },
    { question: 'Is there money, affiliate, sponsorship, gifted product, or client promotion involved?', answer: 'Add the disclosure before posting. If the student is unsure, pause and check FTC/platform guidance.' },
    { question: 'Is Hermes about to publish directly?', answer: 'Stop. Send to drafts first, inspect the visual, caption, link, hashtags, disclosure, and timing.' },
    { question: 'Is the content using trend audio, third-party footage, or someone else\'s screenshot?', answer: 'Check usage rights. Replace anything questionable with original visuals or approved assets.' },
    { question: 'Is the account new or cold?', answer: 'Warm it up, post slowly, and learn the niche before volume. A system is not an excuse to rush.' },
    { question: 'Did the rules change recently?', answer: 'Use official platform docs as the current source of truth, then update the Hermes memory note.' }
  ];

  const c4ResourceLinks = [
    { label: 'Postiz', href: 'https://postiz.com/', note: 'Social scheduling platform with integrations, previews, draft queues, and analytics.' },
    { label: 'Postiz Docs', href: 'https://docs.postiz.com/introduction', note: 'Official setup and product documentation.' },
    { label: 'Postiz Draft Publishing Docs', href: 'https://docs.postiz.com/public-api/posts/create', note: 'Advanced reference for approved draft/review workflows.' },
    { label: 'Postiz Agent Workflow Docs', href: 'https://docs.postiz.com/mcp/introduction', note: 'Advanced reference for connecting Postiz to agent-friendly clients.' },
    { label: 'TikTok Community Guidelines', href: 'https://www.tiktok.com/community-guidelines/en/', note: 'Official platform rules students should check before scaling content.' },
    { label: 'TikTok Direct Posting Rules', href: 'https://developers.tiktok.com/doc/content-posting-api-reference-direct-post', note: 'Official direct-post reference, including consent and metadata requirements.' },
    { label: 'TikTok Content Sharing Guidelines', href: 'https://developers.tiktok.com/doc/content-sharing-guidelines/', note: 'Official sharing guidelines for compliant experiences.' },
    { label: 'TikTok Creative Center', href: 'https://ads.tiktok.com/business/creativecenter/', note: 'Trend, ad, song, and creator research for content planning.' },
    { label: 'FTC Endorsement Guidance', href: 'https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews', note: 'Disclosure guidance for sponsored posts, affiliates, testimonials, reviews, and endorsements.' },
    { label: 'Google AI Studio', href: 'https://aistudio.google.com/', note: 'Browser interface for Gemini experiments and image prompts.' },
    { label: 'Gemini Image Generation Docs', href: 'https://ai.google.dev/gemini-api/docs/image-generation', note: 'Advanced reference for Gemini image generation.' },
    { label: 'Crontab Guru', href: 'https://crontab.guru/', note: 'Plain-English schedule translator for advanced timing rules.' }
  ];

  const c4TutorialLinks = [
    { label: 'Postiz official scheduling overview', href: 'https://www.youtube.com/watch?v=LnNB_vs4HvM', note: 'Short official Postiz product overview.' },
    { label: 'Postiz self-hosted planner', href: 'https://www.youtube.com/watch?v=s37vcN1-Ebc', note: 'Longer Postiz setup walkthrough for builders.' },
    { label: 'Postiz + n8n automation', href: 'https://www.youtube.com/watch?v=c50u3K3xsCI', note: 'Official automation reference for scheduler workflows.' },
    { label: 'TikTok Creative Center tutorial', href: 'https://www.youtube.com/watch?v=Y3GLZGxq0jo', note: 'Beginner walkthrough for finding trends and ads.' },
    { label: 'TikTok Creative Center 2026', href: 'https://www.youtube.com/watch?v=2LTJ2YA9fsk', note: 'Recent Creative Center workflow reference.' },
    { label: 'TikTok marketing beginner guide', href: 'https://www.youtube.com/watch?v=lFpqTrnnHI4', note: 'Short business-facing TikTok marketing overview.' },
    { label: 'Google AI Studio tutorial', href: 'https://www.youtube.com/watch?v=a8NtWQbQI4E', note: 'Beginner AI Studio workflow for prompts and testing.' },
    { label: 'Gemini image generator tutorial', href: 'https://www.youtube.com/watch?v=nK0MkRfNN_I', note: 'Short step-by-step image generation reference.' }
  ];

  const c4HermesPrompts = [
    'Hermes, build a draft-first content workflow for my TikTok account. Include ideation, image prompts, captions, approval, scheduling, analytics, and a weekly review.',
    'Hermes, audit this planned TikTok post against platform rules, brand safety, claim accuracy, and commercial disclosure. Do not publish anything.',
    'Hermes, turn this product into a 3-slide TikTok slideshow: hook, useful insight, CTA. Keep text readable on mobile and make one version for beginners.',
    'Hermes, create a 7-day content stockpile plan. Return topics, slide prompts, captions, review checklist, and suggested posting windows.'
  ];

  const c4CompletionOutcomes = [
    'Explain the difference between draft, scheduled, and direct publishing.',
    'Create a 3-slide slideshow concept with hook, useful insight, and CTA.',
    'Run a review checklist for claims, captions, links, disclosures, and visuals.',
    'Use Postiz as a review surface instead of a blind publishing button.',
    'Ask Hermes for analytics lessons without chasing volume blindly.'
  ];

  const c4CompletionDrills = [
    'Create one draft slideshow for a real product and review it before publishing.',
    'Ask Hermes to rewrite a weak caption into three safer versions.',
    'Audit one planned post against official platform rules and disclosure guidance.',
    'Build a 7-day draft queue with one approval window per day.'
  ];

  const c4CompletionProof = [
    'One approved draft exists in the scheduler.',
    'One review decision is saved with what changed and why.',
    'A weekly analytics review prompt is saved.',
    'Hermes memory includes the account rules and do-not-publish boundary.'
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate">
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
              "A Postiz account or another scheduler you are allowed to use.",
              "Google AI Studio or Gemini image generation access.",
              "A TikTok account you own and are willing to manage responsibly.",
              "TikTok Community Guidelines open in another tab.",
              "A rule: draft and review before publishing."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            Content <br/><span className="italic text-[#22c55e]">Forge.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
            Hermes helps you build a repeatable content pipeline: research, slideshow concepts, image prompts, captions, draft scheduling, review, approval, and analytics. The goal is not spam. The goal is a content operation that a small business can actually maintain.
          </p>

          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Platform-safe operating rules</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Before any automation, protect the account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c4SafetyPrinciples.map((item) => (
                <div key={item.label} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">{item.label}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Review decision tree</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">If this is true, do this before publishing</h3>
            <div className="space-y-3">
              {c4ReviewDecisionTree.map((item, idx) => (
                <div key={item.question} className="grid grid-cols-1 md:grid-cols-[2.5rem_1fr] gap-3 border-[2px] border-[#111] bg-white p-4">
                  <div className="font-mono font-black text-[#22c55e] text-lg">{idx + 1}</div>
                  <div>
                    <p className="font-sans font-black uppercase text-sm text-[#111] mb-1">{item.question}</p>
                    <p className="font-serif text-sm text-[#333] leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e] mb-8">
            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Ask Hermes for the workflow</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Copy a safe content prompt</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c4HermesPrompts.map((prompt, idx) => (
                <div key={prompt} className="border-[2px] border-[#333] bg-[#171717] p-4">
                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">Prompt {idx + 1}</p>
                  <CopyBlock text={prompt} label="Copy Content Prompt" />
                </div>
              ))}
            </div>
          </div>

          {/* Big stats panel */}
          <div className="bg-[#111] border-[4px] border-[#22c55e] p-8 md:p-12 shadow-[12px_12px_0_0_#22c55e] mb-10">
            <h3 className="font-mono text-[#22c55e] font-bold uppercase tracking-widest mb-6 text-center">What a System Unlocks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { num: '30', label: 'Days of concepts planned before posting pressure hits' },
                { num: '90', label: 'Draft touchpoints per month at 3 posts per day' },
                { num: '1', label: 'Weekly review loop to improve what actually works' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-sans font-black text-5xl md:text-6xl text-[#22c55e] tracking-tighter">{stat.num}</div>
                  <div className="font-serif text-[#ddd] mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-center font-serif text-[#ddd] mt-6 italic">Systems win because they remove blank-page panic and make review consistent.</p>
          </div>

          {/* Warmup Tracker */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">3-Day Account Learning Tracker</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Click each day as you complete it. The point is to learn the niche, collect references, and build a review habit before scaling volume.</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { day: 1, label: 'Day 1 — Research', tasks: ['Watch 20 minutes of posts in your niche', 'Save 10 examples with strong hooks', 'Write down 5 repeated audience questions', 'Follow credible accounts for reference'] },
                { day: 2, label: 'Day 2 — Engage', tasks: ['Leave 5 useful comments in your niche', 'Bookmark 5 more examples', 'Draft your first slideshow without publishing pressure', 'Ask Hermes to turn your saves into patterns'] },
                { day: 3, label: 'Day 3 — Test', tasks: ['Review one draft against the checklist', 'Publish only if it is accurate and on-brand', 'Reply to every real comment', 'Start the draft-first workflow slowly'] },
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
                Complete all 3 days before increasing volume. Skipping review and warmup creates unnecessary account risk.
              </div>
            )}
            {warmupDay === 3 && (
              <div className="mt-4 p-3 bg-[#f0fdf4] border-[2px] border-[#22c55e] text-sm font-serif text-[#14532d]">
                ✓ Warmup complete. You are ready to test the draft-first workflow carefully.
              </div>
            )}
          </div>

          <CourseBoostPanel
            title="Class 04 Success Criteria + Rescue Prompts"
            checklist={[
              "3-day warmup complete.",
              "Postiz connected to TikTok with the private access key stored in Hermes.",
              "First 7 days of images generated and loaded into Postiz.",
	              "First draft queue reviewed by a human.",
              "First draft-and-review cycle completed without account warnings."
            ]}
            prompts={[
              '"Hermes, audit our TikTok content pipeline. Report what is connected, pending, risky, and ready for review."',
              '"Postiz just gave me a 500 error when scheduling. Walk me through the draft rules and show me what to verify."'
            ]}
          />
          <StudentCompletionKit
            eyebrow="Class 04 final standard"
            title="Finish with a content system, not just content ideas"
            outcomes={c4CompletionOutcomes}
            drills={c4CompletionDrills}
            proof={c4CompletionProof}
          />
        </div>

        {/* ===== SECTION 1: PLATFORM SAFETY ===== */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "A TikTok account you're willing to warm up.",
              "TikTok Community Guidelines open in another tab.",
              "A clear understanding that review matters more than volume."
            ]}
          />
          <SectionMeta minutes="12 min" focus="Platform-safe posting" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. Platform-Safe Posting Protocol</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Most people break content systems by chasing volume before they understand platform rules. This section teaches a safer operating pattern: warm up the account, draft first, review claims and disclosures, then publish intentionally.
          </p>

          {/* Account Risk Calculator */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-3">Account Risk Calculator</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Pick the scenario that matches your situation. See your actual risk score.</p>
            <div className="space-y-2 mb-6">
              {scenarios.map((s, i) => (
                <button key={i} onClick={() => { setShadowbanScore(s.risk); setShadowbanScenario(i); scrollToRef(shadowbanResultRef); }} className={`w-full text-left p-4 border-[2px] transition-all ${shadowbanScenario === i ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd] hover:border-[#111]'}`}>
                  <span className="font-mono text-lg mr-3">{s.icon}</span>
                  <span className="font-serif text-sm">{s.label}</span>
                  <span className="float-right font-mono text-xs font-bold ml-2">Risk: {s.risk}%</span>
                </button>
              ))}
            </div>
            <div ref={shadowbanResultRef} className={`p-4 border-[2px] ${shadowbanScore < 20 ? 'border-[#22c55e] bg-[#f0fdf4]' : shadowbanScore < 60 ? 'border-[#f59e0b] bg-[#fffbeb]' : 'border-red-500 bg-red-50'}`}>
              <div className="font-mono text-xs font-bold uppercase mb-1">Your Risk Assessment</div>
              <div className="font-serif text-base font-bold">{shadowbanScore < 20 ? 'LOW RISK — Draft workflow is healthy.' : shadowbanScore < 60 ? 'MEDIUM RISK — Fix the weak points below.' : 'HIGH RISK — pause and review before publishing.'}</div>
              <div className="mt-2 h-2 bg-[#ddd] rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${shadowbanScore < 20 ? 'bg-[#22c55e]' : shadowbanScore < 60 ? 'bg-[#f59e0b]' : 'bg-red-500'}`} style={{ width: `${shadowbanScore}%` }}></div>
              </div>
              <p className="font-serif text-sm mt-2">{shadowbanResult.desc}</p>
            </div>
          </div>

          {/* Why API posting kills reach */}
          <div className="bg-[#111] border-[4px] border-red-500 p-8 text-[#eae7de] shadow-[8px_8px_0_0_#dc2626]">
            <h3 className="font-mono text-red-400 font-bold uppercase tracking-widest mb-4">Why Blind Direct Posting Is Risky</h3>
            <p className="font-serif text-[#aaa] mb-4 leading-relaxed">
              Official APIs and schedulers can be useful, but they come with platform rules, consent flows, metadata requirements, and content limits. A bad automation system ignores those rules and publishes low-quality or non-compliant content too quickly.
            </p>
            <p className="font-serif text-[#aaa] leading-relaxed">
              <strong className="text-white">The Fix:</strong> keep Hermes in a <strong className="text-[#22c55e]">draft-first</strong> role. It can prepare assets, captions, and schedules, but publishing decisions should pass through human review and the platform's current rules.
            </p>
          </div>

          <CheckpointCard
            title="Platform Safety Checkpoint"
            pass={[
              "You can explain why draft-first publishing is safer than blind direct-posting.",
              "Your warmup is done or in progress.",
              "You know where to check platform rules before scaling."
            ]}
            fail={[
              "You're planning to publish at volume before review.",
              "Skipping warmup and content checks because you are rushing.",
              "Can't explain the difference between Draft, Scheduled, and Direct Post."
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
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Stack — How the Content System Moves</h2>

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
  │  Gemini Image Generation                     │
  │  Draft Visuals                               │
  │  3 slides × 3 posts × 7 days = 63 images    │
  └──────────────────┬───────────────────────────┘
                    │ "Schedule all posts to DRAFTS"
                    ▼
  ┌──────────────────────────────────────────────┐
  │  Postiz.com                                  │
  │  Agentic Scheduler — Draft Mode             │
  │  Connected to: TikTok, Instagram, LinkedIn  │
  └──────────────────┬───────────────────────────┘
                    │ Draft lives in TikTok account
                    ▼
  ┌──────────────────────────────────────────────┐
  │  Human Review Desk                           │
  │  Claims, disclosures, links, timing checked  │
  │  Approved posts move from draft to publish   │
  └──────────────────────────────────────────────┘
                    │ ✓ REVIEWED POST = CLEAN HANDOFF
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
	              { name: 'Hermes / 80M Agent Desktop', role: 'THE COORDINATOR', desc: 'The planner. It reads your brand rules, creates concepts, drafts captions, prepares image prompts, and hands everything to review before anything goes live.', icon: '🧠' },
	              { name: 'Postiz.com', role: 'THE SCHEDULER', desc: 'The calendar and preview surface. You connect channels, create drafts, inspect previews, and track analytics without juggling every post manually.', icon: '📅' },
	              { name: 'Gemini Image Generation', role: 'THE ARTIST', desc: 'The image workspace. Gemini or AI Studio creates draft slideshow visuals from your 3-slide structure so you can review and refine before publishing.', icon: '🎨' },
              { name: 'Human Approval Layer', role: 'THE SAFETY CHECK', desc: 'The required review step. A real person checks claims, captions, disclosures, visuals, links, and timing before anything goes live.', icon: '📱' },
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
	              "A Postiz account.",
              "TikTok connected to Postiz.",
              "Instagram + LinkedIn connected if you want cross-posting."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. Postiz Setup — Your Agent Gets the Keys</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Postiz gives Hermes a clean place to prepare drafts, calendars, previews, and analytics. You still own the publishing decision.
          </p>

          {/* Postiz Setup Simulator */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Postiz Setup Simulator</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Walk through each step. Green means done.</p>
            <div className="space-y-3">
              {[
                { step: 1, label: 'Connect TikTok to Postiz', detail: 'Go to Postiz → Channels → Add TikTok → Scan QR code with your TikTok account', done: postizStep > 0 },
                { step: 2, label: 'Connect Instagram + LinkedIn (optional)', detail: 'Same process. Each channel can cross-post from the same drafts queue.', done: postizStep > 1 },
                { step: 3, label: 'Grab your private access key', detail: 'Postiz → Settings → API Keys → Create new key. Copy it. You need this next.', done: postizStep > 2 },
                { step: 4, label: 'Store the key in Hermes', detail: 'Paste the key to your agent with the prompt below. This is the last manual step.', done: postizStep > 3 },
              ].map(({ step, label, detail, done }) => (
                <div key={step} className={`flex items-center gap-4 p-4 border-[2px] transition-all ${done ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd] bg-white'}`}>
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
            <button onClick={() => {
              setPostizStep(s => Math.min(s + 1, 4));
              scrollToRef(postizTerminalRef);
            }} className="mt-4 font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#eae7de] border-[2px] hover:bg-[#22c55e] hover:text-[#111] transition-colors">
              {postizStep < 4 ? `Complete Step ${postizStep + 1}` : '✓ Setup Complete'}
            </button>
            {postizStep === 4 && (
              <div className="mt-4 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
	                <p className="font-serif text-sm text-[#14532d] font-bold">Postiz is wired. Hermes has the access rules. Start with one draft, review it, then scale carefully.</p>
              </div>
            )}
          </div>

          {/* Agent prompt MacWindow */}
          <div ref={postizTerminalRef}>
            <MacWindow title="Hermes command box" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`Here's my private Postiz access key: ${postizApiKey || '[YOUR-KEY-HERE]'}
Store it in your memory for ${'`'}[Project Name]${'`'}.
Use this for all future post scheduling.
Rule: ALL posts go to DRAFTS only. Never direct publish.
Postiz manages: TikTok, Instagram, LinkedIn.
Schedule posts at these times: 9am, 12pm, 5pm EST.
Max 5 hashtags per post.
Caption max 1,000 characters.
Reply "Stored and ready" when done.`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Paste this to Hermes once you have your private Postiz access key</p>
              <p className="text-[#eae7de]">hermes: Here's my private Postiz access key:</p>
              <p className="text-[#38bdf8]">${postizApiKey || '[COPY-PASTE-YOUR-KEY-HERE]'}</p>
              <p className="text-[#eae7de]">hermes: Store it in memory. All posts → DRAFTS only.</p>
              <p className="text-[#aaa] italic">hermes: Stored and ready. What do you want to post first?</p>
            </div>
            </MacWindow>
          </div>
          <div className="mt-2 p-3 border-[2px] border-[#111] bg-[#fdfaf6]">
		            <p className="font-mono text-[10px] text-[#555] uppercase mb-1">Your Private Postiz Access Key (paste into the Hermes prompt above)</p>
            <input value={postizApiKey} onChange={e => setPostizApiKey(e.target.value)} placeholder="postiz_live_xxxxxxxxxxxxxxx" className="w-full bg-transparent font-mono text-xs text-[#111] outline-none" />
          </div>
        </div>

	        {/* ===== SECTION 4: GEMINI IMAGE GENERATION ===== */}
        <div className="mb-24">
	          <NeedBox
	            title="What you need before you start"
	            items={[
		              "Google AI Studio access. If support says you need a key, use a separate Gemini key.",
	              "A product, offer, or account niche to turn into visuals."
	            ]}
	          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Gemini Image Generation — The Image Studio</h2>
	          <p className="font-serif text-xl mb-8 leading-relaxed">
	            You don't need to be a designer. You need a specific prompt, a clear format, and a review pass. Gemini can create the draft visuals; you decide what is accurate, readable, and on-brand.
          </p>

          {/* ImagePromptBuilder */}
          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
            <h3 className="font-sans font-black uppercase text-sm mb-4">Image Prompt Builder</h3>
            <p className="font-serif text-[#555] text-sm mb-4">Pick your niche. Get a ready-to-use 3-slide prompt set. Copy and paste to Hermes.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(nicheExamples).map(niche => (
                <button key={niche} onClick={() => { setProductNiche(niche); scrollToRef(promptOutputRef); }} className={`font-mono text-xs font-bold px-4 py-2 border-[2px] transition-all ${productNiche === niche ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'border-[#ddd] hover:border-[#111]'}`}>
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
            <div ref={promptOutputRef} className="mt-4 p-3 bg-[#111] border-[2px] border-[#333]">
              <p className="font-mono text-[10px] text-[#aaa] uppercase mb-2">Full prompt for Hermes</p>
              <p className="font-mono text-xs text-[#22c55e] leading-relaxed">
                "Generate 3 images for a TikTok slideshow for [Product Name]. Slide 1 (Hook): {nicheExamples[productNiche]?.hook} Slide 2 (Info): {nicheExamples[productNiche]?.info} Slide 3 (CTA): {nicheExamples[productNiche]?.cta} Style: clean, high contrast, readable text overlays, vertical format 9:16."
              </p>
              <div className="mt-3">
                <CopyBlock
                  label="Copy Hermes Prompt"
                  text={`Generate 3 images for a TikTok slideshow for [Product Name]. Slide 1 (Hook): ${nicheExamples[productNiche]?.hook} Slide 2 (Info): ${nicheExamples[productNiche]?.info} Slide 3 (CTA): ${nicheExamples[productNiche]?.cta} Style: clean, high contrast, readable text overlays, vertical format 9:16.`}
                />
              </div>
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
	              <h4 className="font-sans font-black uppercase text-sm mb-3 text-[#14532d]">Specific Prompt</h4>
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
              "Gemini image access connected to Hermes."
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
                  <div className="mt-3">
                    <CopyBlock
                      label="Copy Hermes Prompt"
                      text={`Generate 3 TikTok slideshow images for [Product]. Slide 1: ${slideHook || '[your hook]'}. Slide 2: ${slideInfo || '[your info]'}. Slide 3: ${slideCta || '[your CTA]'}. Vertical 9:16, clean design, readable text.`}
                    />
                  </div>
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
              "Postiz connected with the private access key stored.",
              "Your 3-slide formula defined."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Building the Stockpile</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Don't generate one post at a time. Generate in batches. One week of draft content in a single session. Your agent prepares the work, then you review the claims, visuals, captions, and timing before anything goes live.
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
	                <p className="font-serif text-[#555] text-xs mt-1">Time investment: about 45 minutes with Hermes, then a focused review pass.</p>
              </div>
            </div>
          </div>

          <MacWindow title="Hermes stockpile prompt" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`Batch generate ${stockpileDays} days of TikTok slideshow images.
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
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. Postiz 7 Rules — Keep the Workflow Reviewable</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            These aren't suggestions. These are operating rules. Follow them and your draft workflow stays reviewable, measurable, and easier to fix when something breaks.
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
	2. Audio is checked during review.
3. Max 5 hashtags per post. Use only niche-relevant tags.
4. Caption max 1,000 characters. Be concise.
5. Schedule at posted times: 9am EST, 12pm EST, 5pm EST.
6. Each post must have exactly 3 image attachments.
7. Each post must have a unique title based on the content.
REVISION DATE: [TODAY]`}>
            <div className="space-y-2">
	              <p className="text-[#aaa]">// Store this file in your 80M workspace</p>
              <p className="text-[#eae7de]">📁 /skills/postiz-rules.md</p>
              {ruleLabels.map((label, i) => (
                <p key={i} className="text-[#22c55e]">{i+1}. {label}</p>
              ))}
            </div>
          </MacWindow>
        </div>

	        {/* ===== SECTION 8: REVIEW LAYER ===== */}
	        <div className="mb-24">
	          <NeedBox
	            title="What you need before you start"
	            items={[
	              "Postiz with at least one draft loaded.",
	              "TikTok Community Guidelines open.",
	              "A simple place to track approved and rejected drafts."
	            ]}
	          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. Review Layer — The Human Approval Step</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            This is the part people skip when they get excited. Hermes can draft, schedule, and prepare assets, but a human still needs to approve the post, verify claims, check disclosures, and make sure the content fits the platform before it goes live.
          </p>

	          {/* ReviewSetupSimulator */}
	          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
	            <h3 className="font-sans font-black uppercase text-sm mb-4">Draft Review Simulator</h3>
	            <div className="space-y-3">
	              {[
	                { step: 1, label: 'Open the draft queue', detail: 'Open Postiz and inspect the next scheduled draft before it goes public.', done: androidStep > 0 },
	                { step: 2, label: 'Check claims and sources', detail: 'Verify that every factual claim, price, testimonial, and offer is true.', done: androidStep > 1 },
	                { step: 3, label: 'Check platform rules', detail: 'Review TikTok guidelines, disclosure needs, music/audio rights, and prohibited content.', done: androidStep > 2 },
	                { step: 4, label: 'Check mobile readability', detail: 'Make sure text is readable on a phone and does not cover important visuals.', done: androidStep > 3 },
	                { step: 5, label: 'Approve, edit, or reject', detail: 'Only approve drafts that match brand, offer, and platform rules.', done: androidStep > 4 },
	                { step: 6, label: 'Save the decision', detail: 'Record what changed so Hermes can improve the next batch.', done: androidStep > 5 },
              ].map(({ step, label, detail, done }) => (
                <div key={step} className={`flex items-center gap-4 p-4 border-[2px] transition-all ${done ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#ddd] bg-white'}`}>
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
            <button onClick={() => {
              setAndroidStep(s => Math.min(s + 1, 6));
              scrollToRef(androidTerminalRef);
            }} className="mt-4 font-sans font-black text-sm uppercase px-6 py-3 bg-[#111] text-[#eae7de] border-[2px] hover:bg-[#22c55e] hover:text-[#111] transition-colors">
	              {androidStep < 6 ? `Complete Review Step ${androidStep + 1}` : '✓ Review Complete'}
            </button>
          </div>

	          <div ref={androidTerminalRef}>
	            <MacWindow title="Hermes review prompt" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`Hermes, review this draft before it publishes.

Check:
1. factual claims
2. offer accuracy
3. platform-rule risk
4. disclosure requirements
5. mobile readability
6. caption clarity

Return:
- approve / edit / reject
- exact edits needed
- why the decision protects the account`}>
	            <div className="space-y-2">
	              <p className="text-[#aaa]">// Paste this to Hermes before approving a draft</p>
	              <p className="text-[#38bdf8]">hermes: Review this draft before it publishes.</p>
	              <p className="text-[#aaa] italic">hermes: Decision: edit. The claim needs a source and the CTA should be softer.</p>
	              <p className="text-[#eae7de]">You approve only after the edits are made.</p>
	            </div>
	          </MacWindow>
        </div>

        {/* ===== SECTION 9: CRON AUTOMATION ===== */}
        <div className="mb-24">
	          <NeedBox
	            title="What you need before you start"
	            items={[
	              "Postiz stocked with at least one week of drafts.",
	              "Stockpile generation skill file saved.",
	              "A weekly review habit you will actually keep."
	            ]}
	          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. Schedule Automation — The System Checks Itself</h2>
	          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Three reminders. That's the useful automation. One checks drafts before scheduled windows. One prepares the next stockpile monthly. One audits performance weekly. Set these once so the system stays reviewed, measured, and current.
	          </p>

	          {/* ScheduleBuilder */}
	          <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] mb-8">
	            <h3 className="font-sans font-black uppercase text-sm mb-4">Schedule Translation Builder</h3>
	            <p className="font-serif text-sm text-[#555] leading-relaxed mb-4">
	              Pick review times in normal language. The small number patterns below are the advanced schedule translation Hermes can explain if support needs them.
	            </p>
            <div className="mb-6">
              <label className="font-mono text-[10px] font-bold uppercase text-[#555] block mb-2">Your posting times (EST)</label>
              <div className="flex flex-wrap gap-3">
                {['08:00','09:00','10:00','12:00','14:00','17:00','18:00','20:00'].map(time => (
                  <button key={time} onClick={() => {
                    setCronTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : prev.length < 4 ? [...prev, time] : prev);
                    scrollToRef(cronOutputRef);
                  }} className={`font-mono text-xs font-bold px-3 py-2 border-[2px] transition-all ${cronTimes.includes(time) ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'border-[#ddd] hover:border-[#111]'}`}>
                    {time} EST
                  </button>
                ))}
              </div>
            </div>
            <div ref={cronOutputRef} className="bg-[#111] p-4 font-mono text-xs text-[#22c55e] space-y-2">
              <div>
	                <div className="text-[#aaa] uppercase mb-1">// Draft Review Reminder</div>
                <div className="text-[#eae7de]">
                  {cronTimes.map((t) => `0 ${parseInt(t)} * * *`).join('\n')}
                </div>
	                <div className="text-[#aaa] mt-1">→ Review upcoming drafts at {cronTimes.join(', ')} EST daily</div>
              </div>
              <div>
                <div className="text-[#aaa] uppercase mb-1">// Monthly Stockpile Refresh</div>
                <div className="text-[#eae7de]">0 9 1 * *</div>
                <div className="text-[#aaa] mt-1">→ 9am on the 1st of every month: generate next month's stockpile</div>
              </div>
              <div>
                <div className="text-[#aaa] uppercase mb-1">// Weekly System Audit</div>
                <div className="text-[#eae7de]">0 10 * * 1</div>
	                <div className="text-[#aaa] mt-1">→ Every Monday 10am: audit Postiz, content quality, stockpile status</div>
              </div>
            </div>
          </div>

	          <MacWindow title="Hermes schedule prompt" contentClass="bg-[#111] p-6 font-mono text-sm text-[#22c55e]" code={`hermes: Set up the following review schedules:

	1. Daily at ${cronTimes[0] || '09:00'} EST: Check Postiz for upcoming drafts.
	   Return anything that needs review, edits, disclosure, or approval.

2. Monthly on the 1st at 9am: Generate a ${stockpileDays}-day 
   content stockpile and load into Postiz.

	3. Weekly every Monday at 10am: Audit the TikTok content
	   pipeline. Report: published posts, engagement, failures, and learnings.

	Reply with the plain-English schedule confirmation. Include advanced cron patterns only after the explanation.`}>
            <div className="space-y-2">
              <p className="text-[#aaa]">// Give this to Hermes to wire the automation</p>
	              <p className="text-[#eae7de]">hermes: Set up our TikTok review schedules.</p>
	              <p className="text-[#aaa] italic">hermes: Configuring 3 review reminders now...</p>
	              <p className="text-[#aaa]">✓ Draft review: {cronTimes[0] || '09:00'} EST daily</p>
              <p className="text-[#aaa]">✓ Monthly stockpile: 1st of month, 9am</p>
              <p className="text-[#aaa]">✓ Weekly audit: Monday 10am</p>
	              <p className="text-[#22c55e]">hermes: Schedules active. Draft review and weekly audits are running.</p>
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
              { term: 'Account Risk', def: 'The chance that rushed volume, weak review, bad claims, or platform-rule issues hurt the account.' },
              { term: 'Gemini Image Generation', def: 'Google image generation through Gemini or AI Studio. Used for creating draft slideshow visuals.' },
              { term: 'Postiz Access Key', def: 'A private key that lets approved tools create and manage social drafts, schedules, and posts. Treat it like a password.' },
	              { term: 'Review Gate', def: 'A required approval checkpoint before content goes public.' },
	              { term: 'Slideshow Marketing', def: 'TikTok video format using static images with text overlays that auto-advance. Easy to draft because it does not require advanced video editing.' },
	              { term: 'UGC', def: 'User Generated Content. Use it as a style reference, but do not pretend a real customer made content if they did not.' },
              { term: 'Creative Center', def: 'TikTok research dashboard for trends, ads, songs, creators, and content inspiration.' },
              { term: 'Warmup Protocol', def: 'A few days of normal account activity and quality checks before increasing publishing volume.' },
              { term: 'Stockpile', def: 'A batch of pre-generated draft ideas, images, and captions ready for review.' },
              { term: 'Draft Mode', def: 'A safer workflow where content is prepared first, reviewed, and only then published.' },
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-5 shadow-[4px_4px_0_0_#111]">
                <h4 className="font-sans font-black text-lg uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#333] text-sm leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 11: RESOURCE LOCKER ===== */}
        <div className="mb-24" id="c4-resources">
          <NeedBox
            title="What you need before you start"
            items={[
              "Postiz or another scheduler account.",
              "Google AI Studio or Gemini image access.",
              "TikTok Community Guidelines and official rules open.",
              "A place to save approved prompts and reviewed drafts."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">11. Resource Locker — Everything You Need</h2>

          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Official References + Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {c4ResourceLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">YouTube Tutorials for Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {c4TutorialLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-white p-4 hover:bg-[#fffbeb] hover:border-[#f59e0b] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Skill File Template</p>
              <p className="font-serif text-xs text-[#333] mb-2">Save this as <code className="bg-white px-1 font-mono">/skills/tiktok-slideshow.SKILL.md</code> in your workspace:</p>
              <pre className="bg-[#111] text-[#22c55e] p-3 font-mono text-xs overflow-x-auto">{`# TikTok Slideshow Automation Skill

## Purpose
Generate, review, and schedule TikTok slideshow draft content.

## Stack
- Google AI Studio or approved Gemini image access for image generation
- Postiz for draft scheduling, previews, and analytics
- Human approval before publishing

## 3-Slide Formula
Slide 1 (Hook): [specific result or curiosity gap]
Slide 2 (Info): [the actual useful content]
Slide 3 (CTA): [emotional pull + clear action]

## Rules
1. Draft first; do not publish without review
2. Check TikTok Community Guidelines before scale
3. Verify claims, offers, and disclosures
4. Keep captions readable and platform-appropriate
5. Track results weekly
6. Save approved prompts and assets`}</pre>
            </div>

            <div className="mt-6 p-4 bg-[#fffbeb] border-[2px] border-[#f59e0b]">
              <p className="font-sans font-black text-sm uppercase mb-2">Rescue Prompts</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {c4HermesPrompts.map((prompt) => (
                  <CopyBlock key={prompt} text={prompt} label="Copy Content Prompt" />
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#fdfaf6] border-[2px] border-[#111]">
              <p className="font-sans font-black text-sm uppercase mb-2">For future video production</p>
              <p className="font-serif text-sm text-[#333] leading-relaxed">
                Instructor production note: Course 04 content, scheduler, TikTok rules, and Gemini image tutorials are now logged in the internal scrape queue for original 80M motion explainers.
              </p>
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
                setQuizActive(false);
                setQuizSection(null);
              }}
            />
          );
        })()}

        {/* Quiz trigger buttons */}
        <div className="mb-24 border-[3px] border-[#111] bg-white p-8 shadow-[8px_8px_0_0_#111]">
          <h3 className="font-sans font-black uppercase text-sm mb-4">Section Quizzes — Class 04</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[{s:1,l:'Platform Safety'},{s:2,l:'The Stack'},{s:3,l:'Postiz Setup'},{s:4,l:'Image Gen'},{s:5,l:'3-Slide Formula'}].map(({s,l}) => (
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
	            <div className="font-mono text-6xl mb-4">✓</div>
	            <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 04 Complete.</h2>
	            <p className="font-serif text-xl text-[#aaa] mb-8 leading-relaxed">
	              You just built a draft-first TikTok content operation. Hermes prepares ideas, images, captions, and schedule reminders. Postiz holds the drafts. You review, approve, and improve the system with real results.
	            </p>
            <div className="inline-grid grid-cols-2 gap-4 text-left mb-8">
              {[
                'Postiz private access key stored in Hermes',
                'Gemini image generation pipeline tested',
                'First stockpile generated and loaded',
	                'Human review checklist active',
	                '3 review reminders active',
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
      </div>
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />
    </motion.div>
  );
};

// ===== quizDataC07 =====
const quizDataC07 = [
  {
    section: 1,
    questions: [
      { q: "What is 80M Agent Desktop for a beginner?", options: ["A coding school", "The normal desktop app where you chat with Hermes, manage memory, run schedules, and control tools", "A social media app only", "A spreadsheet template"], correct: 1, explanation: "The desktop app is the command center. Beginners open the app, choose a provider, talk to Hermes, save memory, and use schedules/tools through normal screens." },
      { q: "What should happen before connecting outside apps like Discord, Slack, email, or SMS?", options: ["Connect everything immediately", "Save clean memory, write approval rules, and test one safe workflow", "Delete all sessions", "Turn off Hermes"], correct: 1, explanation: "Gateway connections are powerful because they touch outside channels. Set identity, rules, and approval gates first so Hermes prepares work safely instead of acting blindly." },
      { q: "What is the safest first Hermes message?", options: ["A vague 'do everything for me'", "Name, goal, one thing to track, and 'save this to memory'", "A random command from a tutorial", "A private key pasted into Discord"], correct: 1, explanation: "The first useful move is identity plus one concrete job. Hermes should know who you are, what matters, and what you want remembered before automation starts." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "How should students use the 15 real-world app examples?", options: ["Pick the closest example, copy the prompt, replace details, and review the output", "Memorize every example", "Skip them and build from scratch", "Only use the trade examples"], correct: 0, explanation: "The examples are starting points. Students choose the closest life/business situation, paste it to Hermes, then edit details until it matches their reality." },
      { q: "What should a bonus build become before Hermes acts on it?", options: ["A clear request with approval rules and a small first version", "A secret automation with no review", "A public post", "A random download"], correct: 0, explanation: "Bonus ideas are not permission to automate everything. Turn them into one small version, add approval boundaries, and test before expanding." },
      { q: "What is the Custom Builder for?", options: ["Turning a student’s exact messy problem into a copyable Hermes setup prompt", "Changing provider billing", "Deleting memories", "Installing random tools"], correct: 0, explanation: "If none of the examples fit, the custom builder captures the problem and returns a plain-English prompt Hermes can use to create a tracker, reminders, and summaries." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is memory in the 80m desktop app?", options: ["A design theme", "Saved context Hermes can use later: your profile, goals, preferences, rules, and decisions", "A type of agent specialized in research", "A payment screen"], correct: 1, explanation: "Memory is the continuity layer. When you say 'save this to memory,' Hermes can use that context in future sessions instead of making you repeat everything." },
      { q: "How does memory help when you start a new session?", options: ["Memory is wiped every session", "Hermes can recall saved profile, goals, preferences, and history", "You have to re-enter your name every time", "Memory only works on Pro tier"], correct: 1, explanation: "Memory stores what should carry forward: who you are, what you do, what rules matter, and what was decided before." },
      { q: "What should you say when you want Hermes to remember something?", options: ["Delete this", "Save this to memory and tell me what you saved", "Ignore this", "Save a random note somewhere"], correct: 1, explanation: "Use clear language. 'Save this to memory' tells Hermes the information should become durable context, and asking for a confirmation helps you catch mistakes." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is a Skill in the 80m system?", options: ["A personality trait of an agent", "A reusable workflow or tool package you can install to extend what Hermes can do", "A scheduling template", "A type of recurring reminder"], correct: 1, explanation: "Skills are like browser extensions for Hermes. They add capabilities such as Notion sync, Stripe billing, or YouTube research. Install one, test one small workflow, then expand." },
      { q: "How do you install a new skill in 80m?", options: ["Download a file from the internet and upload it", "Ask Hermes to install it and walk through the setup — 'I want to install the notion skill'", "Use the Skill Store app on your phone", "Skills come pre-installed and can't be added"], correct: 1, explanation: "Skills install through conversation. Tell Hermes 'I want to install the [skill name] skill' and it walks you through setup. Some skills need a private access key and a brief. No coding." },
      { q: "Which skill would you install if you wanted Hermes to automatically summarize YouTube videos?", options: ["stripe-80m", "youtube-content", "obsidian", "cortex"], correct: 1, explanation: "The youtube-content skill handles YouTube workflows — transcripts, summaries, spark pipelines. Give it a URL, get a summary, thread, or content repurposed. Perfect for research automation." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is a schedule in the 80m system?", options: ["A type of agent that codes for you", "A recurring task that runs at a chosen time", "An emergency button for when Hermes stops responding", "A way to backup your memory to the cloud"], correct: 1, explanation: "Schedules are recurring helpers. Set one up once, like every weekday at 8am, and Hermes prepares the agreed output until you change or delete it." },
      { q: "What is the safest first schedule?", options: ["A public message sender", "A private weekday morning brief with no external sending", "A random hourly task", "A payment charge"], correct: 1, explanation: "Start with a private brief or review. Add external actions only after memory, rules, and approval gates are clear." },
      { q: "Which of these is the best use case for a schedule in 80m?", options: ["Asking Hermes a one-off question", "Generating a weekly summary every Friday at 4pm because it should happen regularly", "Fixing a broken memory", "Uploading a single file"], correct: 1, explanation: "Schedules are for recurring, predictable tasks: weekly wrap-ups, daily briefs, monthly finance audits, and review reminders." },
    ]
  },
];


// ===== quizDataC04 =====
const quizDataC04 = [
  {
    section: 1,
    questions: [
      { q: "Why is blind direct publishing risky for a business account?", options: ["All third-party tools are banned", "It can skip review, disclosure, platform-rule checks, and quality control", "Postiz has a bug that posts to the wrong account", "TikTok does not allow any scheduling"], correct: 1, explanation: "The risk is not just the tool. The risk is publishing too quickly without checking claims, disclosures, platform rules, and content quality." },
      { q: "What is the warmup protocol for in this course?", options: ["Logging into TikTok exactly 3 times", "Building normal account activity and review discipline before increasing content volume", "Charging your phone before first use", "Installing a new app before posting"], correct: 1, explanation: "Warmup is about responsible account operation: normal activity, quality control, and a review rhythm before you scale volume." },
      { q: "What is the Account Risk Calculator checking for?", options: ["How many followers you have", "Whether the account has warmup, review, draft-first publishing, and reasonable volume", "Your content quality score only", "How many hashtags you're using"], correct: 1, explanation: "Account risk is a combination of account activity, publishing volume, review quality, disclosure, and whether the workflow is draft-first or blind publishing." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "In the 80M Content Forge stack, what is the human approval layer for?", options: ["A backup for when Postiz is down", "Reviewing claims, captions, disclosures, visuals, links, and timing before publishing", "A WiFi hotspot for the server", "A way to avoid all platform rules"], correct: 1, explanation: "The human approval layer protects the account and the business. Hermes can prepare drafts, but a person should approve what goes live." },
      { q: "What does Hermes coordinate in the Content Forge pipeline?", options: ["Only image generation", "Research, draft ideas, image prompts, captions, scheduling prep, and review checklists", "Only posting to TikTok", "Only storing private keys"], correct: 1, explanation: "Hermes coordinates the content operation. It should prepare and organize the work, then hand it to review before publishing." },
      { q: "Why is Postiz useful in this workflow?", options: ["Postiz is broken on mobile", "It gives a place to preview, schedule, manage drafts, and inspect analytics across channels", "Postiz only works on servers", "Postiz requires a coding degree"], correct: 1, explanation: "Postiz is the scheduler and review surface. It helps organize drafts and analytics so the student is not manually juggling every post." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "What is the safest first Postiz workflow?", options: ["Publish everything immediately", "Create drafts, preview them, review rules, then approve only the posts that are ready", "Skip captions", "Give everyone your login"], correct: 1, explanation: "A draft-first workflow gives you a review checkpoint before anything goes public." },
      { q: "What information should Hermes receive for Postiz?", options: ["Your TikTok password", "The private access method, approved posting rules, and a clear 'do not publish without approval' boundary", "Your credit card number", "Nothing"], correct: 1, explanation: "Hermes needs access instructions and rules, not personal passwords. The boundary matters: prepare drafts and schedules, but do not publish without approval." },
      { q: "What is the correct setup sequence?", options: ["Generate a key → publish immediately", "Connect accounts → create access safely → save rules → test with one draft", "Create account → post immediately", "Install app → done"], correct: 1, explanation: "Start with a small test: connect, configure access, store rules, create one draft, review, then scale." },
    ]
  },
  {
    section: 4,
    questions: [
	      { q: "Why does Gemini image generation matter for slideshow marketing?", options: ["It is a TikTok feature for slideshow creation", "It can create draft visuals from clear prompts, then a person reviews them before posting", "It is a Samsung phone model", "It is a Postiz plugin"], correct: 1, explanation: "Gemini image generation turns a specific prompt into draft visuals. The course uses it with the 3-slide structure, then teaches students to review the output before publishing." },
	      { q: "Why does a vague prompt like 'make a nice TikTok image' produce bad results?", options: ["Gemini is broken", "Vague prompts give the AI no specific direction — no subject, style, mood, or format. The output matches the input: generic.", "TikTok has image restrictions", "Gemini requires coding to use"], correct: 1, explanation: "AI image generation is only as good as your prompt. 'Nice TikTok image' gives no useful direction. A prompt with audience, subject, style, format, and readability rules gives Hermes something concrete to produce." },
      { q: "How many images do you need for one day of TikTok slideshow content?", options: ["1 image", "3 images (one per slide)", "9 images (3 slides × 3 posts)", "As many as you feel like"], correct: 1, explanation: "One TikTok slideshow post = 3 images (hook, info, CTA). One day of content at 3 posts/day = 9 images. The stockpile calculator shows you exactly how many you need for any batch size." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is the job of Slide 1 (The Hook) in the 3-slide formula?", options: ["Give all the information at once", "Stop the scroll — make the viewer curious or promise a tangible result in the first 2 seconds", "Show your brand logo", "Introduce yourself as the creator"], correct: 1, explanation: "The Hook's one job: stop the scroll. If they keep swiping, nothing else matters. Good hooks lead with a result, a controversy, or a curiosity gap. Bad hooks explain context first." },
      { q: "What makes the 3-slide formula effective for slideshow marketing?", options: ["It uses video instead of images", "It has a clear structure that guides the viewer from curiosity → value → action, which matches how TikTok's algorithm rewards completion rate", "It posts automatically", "It uses more hashtags"], correct: 1, explanation: "TikTok's algorithm measures completion rate. The 3-slide formula maximizes completion: Hook gets them to watch, Info keeps them engaged, CTA drives the save/share. High completion rate = more For You distribution." },
	      { q: "Why is 'emotional pull' important for Slide 3 (The CTA)?", options: ["It makes the post longer", "It triggers a behavioral response — saves, shares, and comments — which are signals platforms use to understand engagement", "It adds more hashtags", "It replaces review"], correct: 1, explanation: "The CTA is not just telling them what to do. It gives a clear next action and a reason to care. The emotion drives the action, and the action helps you learn what the audience values." },
    ]
  },
];


// --- Course Content Pages ---

const CourseOneContent = ({ onClose }) => {
  const lessonScrollRef = useRef(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const [subMonths, setSubMonths] = useState(1);
  const [hardwareChecks, setHardwareChecks] = useState([]);
  const [setupStep, setSetupStep] = useState(0);
  const [firstWin, setFirstWin] = useState('executive');
  const [errorVisible, setErrorVisible] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [quizSection, setQuizSection] = useState(null);
  const [quizDone, setQuizDone] = useState(null);
  const [passedQuizzes, setPassedQuizzes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('80m-c1-quizzes') || '[]'); } catch { return []; }
  });

  const sections = [
    { id: 's0', label: 'Intro: Desktop-first setup' },
    { id: 's1', label: '1. Why + API key safety' },
    { id: 's2', label: '2. Command box rescue' },
    { id: 's3', label: '3. Agent Council' },
    { id: 's4', label: '4. Desktop app tour' },
    { id: 's5', label: '5. Hardware check' },
    { id: 's6', label: '6. Docker, only if needed' },
    { id: 's7', label: '7. Red error guide' },
    { id: 's8', label: '8. Localhost vs internet' },
    { id: 's9', label: '9. Maintenance' },
    { id: 's10', label: '10. Zero-code playbook' },
    { id: 's11', label: '11. Dictionary + resources' },
  ];

  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleHardwareCheck = (idx) => {
    setHardwareChecks(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const hardwareChecklist = [
    {
      label: "16GB+ memory",
      plain: "Memory is the computer's desk space. Less desk space means the assistant freezes when too many things are open.",
      check: "Mac: Apple menu -> About This Mac. Windows: Settings -> System -> About."
    },
    {
      label: "20GB free storage",
      plain: "Storage is closet space. Hermes, logs, models, and updates need room to unpack without breaking.",
      check: "Mac: System Settings -> General -> Storage. Windows: Settings -> System -> Storage."
    },
    {
      label: "Stable internet",
      plain: "The first install downloads the assistant and dependencies. After setup, more work can happen locally.",
      check: "Do the install on home WiFi, not airport or hotel WiFi."
    },
    {
      label: "One AI provider ready",
      plain: "A provider is the brain service Hermes can call. OpenRouter is the simplest default because it lets you switch models later.",
      check: "Create the key before class, then paste it only inside 80m Agent Desktop."
    },
    {
      label: "80m Agent Desktop downloaded",
      plain: "This is the real customer path. The app installs Hermes, stores settings, shows memory, runs schedules, and gives you chat.",
      check: "Use the latest release for your operating system."
    }
  ];

  const desktopSetupSteps = [
    {
      title: "Download 80m Agent Desktop",
      detail: "Grab the release for your machine. Windows uses .exe, macOS uses .dmg, Linux uses .AppImage or .deb."
    },
    {
      title: "Open the app and let first-run setup work",
      detail: "The app checks whether Hermes already exists, installs missing pieces, and shows progress instead of making you guess."
    },
    {
      title: "Choose a provider",
      detail: "Pick OpenRouter for flexibility, OpenAI or Anthropic for direct accounts, or a local model if you already know what that means."
    },
    {
      title: "Paste the key once",
      detail: "An API key is a private password for the AI service. Never paste it into Discord, screenshots, websites, or public files."
    },
    {
      title: "Send your first real command",
      detail: "Ask Hermes to create a useful output you can inspect: a task list, inbox plan, client follow-up, or daily brief."
    },
    {
      title: "Verify the core screens",
      detail: "Open Chat, Sessions, Skills, Memory, Tools, Schedules, Gateway, and Settings so you know where the controls live."
    }
  ];

  const firstWinPrompts = {
    executive: {
      label: "Executive Assistant",
      prompt: `Hermes, act as my chief of staff for the next 20 minutes.

I do not know technical setup language yet, so explain every action in plain English.

Build my first operating system:
1. Ask me for my timezone, working hours, and preferred update channel.
2. Create a one-page daily brief template.
3. Create a simple task list with Inbox, Today, Waiting, and Done.
4. Tell me what to put in memory so you remember my business.
5. Do not send emails, calendar invites, or external messages without my approval.`
    },
    client: {
      label: "Client Follow-Up",
      prompt: `Hermes, help me stop losing client follow-ups.

I am a non-technical business owner. Walk me through this like I am using an assistant, not writing code.

Create:
1. A client follow-up tracker with columns for name, last contact, promise made, next action, and due date.
2. A daily reminder prompt I can run every morning.
3. Three polite follow-up message templates.
4. A rule: never send anything externally until I approve the final message.`
    },
    sales: {
      label: "Sales Pipeline",
      prompt: `Hermes, set up a simple sales pipeline for me.

Use plain English. No coding terms unless you define them first.

I need:
1. A list of lead stages from new lead to paid customer.
2. A one-screen tracker I can update daily.
3. A weekly review checklist.
4. A follow-up schedule for leads who go quiet.
5. A short explanation of which 80m tools I should connect later.`
    },
    creator: {
      label: "Content System",
      prompt: `Hermes, turn my scattered content ideas into a weekly content system.

Explain every step like I have never used automation before.

Create:
1. A place to dump raw ideas.
2. A weekly content calendar.
3. A reusable prompt for turning one idea into a post, thread, short video outline, and email.
4. A review checklist before anything gets posted.
5. A schedule for when you should remind me to record or approve content.`
    }
  };

  const c1CompletionOutcomes = [
    "Download the correct installer for Windows, macOS, or Linux.",
    "Explain API keys as private paid access and keep them out of public places.",
    "Open 80m Agent Desktop, choose a provider, and send a first useful Hermes prompt.",
    "Recognize common setup words: provider, model, memory, schedule, tool, skill, log, and port.",
    "Use the terminal only as a guided rescue lane, not as the main product experience."
  ];

  const c1CompletionDrills = [
    "Ask Hermes for a PASS/FAIL setup audit and paste one red warning if any appears.",
    "Save name, timezone, business, main goal, and one hard rule to memory.",
    "Create one private daily brief or follow-up tracker with no external sending.",
    "Explain .exe, .dmg, .AppImage, and .deb to another beginner in one minute."
  ];

  const c1CompletionProof = [
    "80M Agent Desktop opens and reaches Chat.",
    "Hermes returns one structured answer.",
    "Memory contains the student's starter profile.",
    "The student knows where Settings, Memory, Skills, Schedules, and Logs live."
  ];

  const plainEnglishTerms = [
    { term: "80m Agent Desktop", def: "The app your clients use. It gives Hermes a normal desktop interface: chat, memory, schedules, settings, tools, and gateways." },
    { term: "Hermes", def: "The assistant engine. It can chat, use tools, remember context, run scheduled work, and delegate to specialized agents." },
    { term: "Provider", def: "The AI company or model service Hermes talks to, such as OpenRouter, OpenAI, Anthropic, Google, or a local model." },
    { term: "API key", def: "A private access key. Treat it like a password for paid AI usage." },
    { term: "Tool", def: "A capability Hermes can use, like reading files, using the web, creating images, running code, or searching memory." },
    { term: "Skill", def: "A reusable workflow. Once installed, Hermes knows how to repeat that kind of work without being retrained every time." },
    { term: "Memory", def: "Saved context about you, your business, your preferences, and previous decisions." },
    { term: "Schedule", def: "A recurring job. Example: every weekday morning, prepare a brief before you wake up." }
  ];

  const installerDecisionTree = [
    { situation: "I am on Windows", pick: "Download the .exe", why: "That is the normal Windows installer. Double-click it, follow prompts, then open 80m Agent Desktop." },
    { situation: "I am on macOS", pick: "Download the .dmg", why: "That is the normal Mac app package. Open it, drag the app if asked, then launch it from Applications." },
    { situation: "I am on Linux and I want the easiest path", pick: "Use the .AppImage", why: "An AppImage is a portable Linux app file. It is usually the least confusing beginner option." },
    { situation: "I am on Ubuntu/Debian Linux and support told me to install a package", pick: "Use the .deb", why: "A .deb is an Ubuntu/Debian installer package. Use it only if it matches your Linux system." },
    { situation: "I do not know my system", pick: "Ask Hermes first", why: "Paste: 'I am on [Windows/Mac/Linux]. Which 80M installer should I download and what should I avoid?'" }
  ];

  const c1LinuxSurvivalTerms = [
    { term: "Terminal", def: "A command text box. You type or paste instructions, press Enter, then read the result." },
    { term: "Command", def: "One instruction for the computer, like open this folder, check this service, or show the version." },
    { term: "Path", def: "A file address. Example: /home/name/Downloads means Downloads inside that user's home folder." },
    { term: "Home folder (~)", def: "Your personal folder. On Linux, ~ is shorthand for your home folder." },
    { term: "Permission", def: "A rule for who can read, change, or run a file. If Linux says permission denied, do not force it blindly." },
    { term: "Process", def: "An app or helper currently running in the background." },
    { term: "Port", def: "A numbered door apps use to talk locally or over the internet. Example: 3000 often means a local web app." },
    { term: "Service", def: "A background helper that starts, stops, restarts, and keeps software alive." },
    { term: "Log", def: "The receipt book. Logs show what happened, when it happened, and what error appeared." },
    { term: "Environment variable", def: "A named setting, often used for private keys or configuration. Beginners should not paste these publicly." }
  ];

  const basicToolLinks = [
    { label: "80M Agent Desktop Releases", href: "https://github.com/guapdad4000/80m-agent-desktop-v3/releases/", note: "Download the customer app: Windows .exe, macOS .dmg, Linux AppImage/deb." },
    { label: "Docker Desktop", href: "https://docs.docker.com/get-started/introduction/get-docker-desktop/", note: "Basic container runtime. Use when the setup/support flow asks for Docker." },
    { label: "Ubuntu Command Line for Beginners", href: "https://ubuntu.com/tutorials/command-line-for-beginners", note: "Official beginner reference for terminal, folders, paths, and basic Linux commands." },
    { label: "Ubuntu Server Docs", href: "https://ubuntu.com/server/docs/", note: "Official Ubuntu server reference for students who later touch Linux servers with support." },
    { label: "OpenRouter API Keys", href: "https://openrouter.ai/settings/keys", note: "Recommended beginner provider. Set a small key credit limit before pasting into 80M." },
    { label: "OpenAI API Keys", href: "https://platform.openai.com/api-keys", note: "Direct OpenAI provider path. Keep keys private and rotate leaked keys immediately." },
    { label: "Anthropic Console", href: "https://console.anthropic.com/", note: "Direct Claude provider path. Use workspace/spend controls for safety." },
    { label: "VS Code", href: "https://code.visualstudio.com/", note: "Optional text editor for workspace files. Not required for normal clients." },
    { label: "GitHub Desktop", href: "https://desktop.github.com/download/", note: "Optional visual GitHub tool for downloading/managing templates." },
    { label: "Discord", href: "https://discord.com/download", note: "Support, announcements, and community help." }
  ];

  const tutorialLinks = [
    { label: "Docker in 12 minutes", href: "https://www.youtube.com/watch?v=DQdB7wFEygo", note: "Beginner Docker concept video. Watch before touching Docker settings." },
    { label: "Docker crash course", href: "https://www.youtube.com/watch?v=pg19Z8LL06w", note: "Longer reference for images, containers, compose, and ports." },
    { label: "OpenRouter API key tutorial", href: "https://www.youtube.com/watch?v=VvJvJ0uXiVQ", note: "How to create an OpenRouter key for model access." },
    { label: "OpenAI API key quick tutorial", href: "https://www.youtube.com/watch?v=Lj43aSwNpog", note: "Short direct OpenAI key walkthrough." },
    { label: "Claude API key quick tutorial", href: "https://www.youtube.com/watch?v=vgncj7MJbVU", note: "Short Anthropic/Claude key walkthrough. Verify UI freshness before filming." },
    { label: "VS Code official beginner tutorial", href: "https://www.youtube.com/watch?v=f8_uF_IDV50", note: "Optional editor basics from the VS Code channel." },
    { label: "GitHub Desktop clone tutorial", href: "https://www.youtube.com/watch?v=PoZNIbs_wx8", note: "Plain clone/download flow for people scared of Git." },
    { label: "Mac Terminal basics", href: "https://www.youtube.com/watch?v=aKRYQsKR46I", note: "Mac command text-box basics." },
    { label: "PowerShell basics", href: "https://www.youtube.com/watch?v=cDcS6iL1G4I", note: "Windows command text-box basics." },
    { label: "Discord complete tutorial", href: "https://www.youtube.com/watch?v=z5c6Bc-S0TI", note: "Community/support app basics." }
  ];

  const terminalLogs = [
    "[SYSTEM] Initiating 80m Lazy-Install Protocol...",
    "[NETWORK] Downloading only what the assistant needs...",
    "[NETWORK] Checking the 80M desktop runtime...",
    "[NETWORK] Fetching Hermes core logic...",
    "[DOCKER] Building containers (this is where the magic happens)...",
    "[PROCESS] Unpacking the assistant workspace...",
    "✔ Hermes successfully linked.",
    "✔ 80M workspace successfully linked.",
    "✔ Local Database instantiated.",
    "✔ Agent Council instantiated.",
    "✔ Safety filters applied.",
    "[SUCCESS] Hermes is ready. Awaiting your first useful command."
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
      className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate"
    >
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 01</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Install the App</h2>
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
              "A laptop, desktop, or mini-PC with 16GB+ memory.",
              "Stable internet for the first install.",
              "The latest 80m Agent Desktop release for your operating system.",
              "One AI provider account: OpenRouter is the easiest default; OpenAI, Anthropic, Google, and local models also work.",
              "One private API key ready to paste into the app.",
              "Discord access for support + updates."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            From Zero to <br/><span className="italic text-[#22c55e]">Alive.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
            Welcome to Class 01. The goal is not to make you "technical." The goal is to get the 80m Agent Desktop running, teach you what the screens mean, and help you get one useful result from Hermes before you leave.
          </p>
          <p className="font-serif text-sm text-[#555] mt-3 mb-8">
            The beginner rule: install with the desktop app first, verify green checks, then customize one thing at a time. The terminal is a rescue lane, not the whole course.
          </p>

          <div className="mb-8 border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Desktop-first install path</p>
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight">The setup flow clients actually use</h3>
              </div>
              <div className="font-mono text-xs uppercase tracking-widest border-[2px] border-[#111] bg-white px-3 py-2 w-fit">
                Step {setupStep + 1}/{desktopSetupSteps.length}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-6">
              <div className="space-y-2">
                {desktopSetupSteps.map((step, i) => (
                  <button
                    key={step.title}
                    onClick={() => setSetupStep(i)}
                    className={`w-full text-left border-[2px] px-4 py-3 transition-all ${setupStep === i ? 'border-[#22c55e] bg-[#f0fdf4] shadow-[4px_4px_0_0_#111]' : 'border-[#ddd] bg-white hover:border-[#111]'}`}
                  >
                    <span className="font-mono text-xs font-black uppercase text-[#22c55e]">0{i + 1}</span>
                    <span className="block font-sans font-black uppercase text-sm text-[#111] mt-1">{step.title}</span>
                  </button>
                ))}
              </div>
              <div className="border-[3px] border-[#111] bg-white p-6">
                <h4 className="font-sans font-black uppercase text-xl mb-3">{desktopSetupSteps[setupStep].title}</h4>
                <p className="font-serif text-[#333] text-lg leading-relaxed mb-5">{desktopSetupSteps[setupStep].detail}</p>
                <div className="bg-[#111] text-[#eae7de] border-[3px] border-[#111] p-5">
                  <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">What the app is doing for you</p>
                  <p className="font-serif text-[#ddd] leading-relaxed">
                    80m Agent Desktop checks install health, configures Hermes, saves provider settings, opens the chat workspace, and gives you screens for sessions, memory, skills, tools, schedules, gateways, models, and backups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Download decision tree</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Which installer do I click?</h3>
            <div className="space-y-3">
              {installerDecisionTree.map((item) => (
                <div key={item.situation} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr] gap-3 border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <p className="font-sans font-black uppercase text-sm text-[#111]">{item.situation}</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#22c55e]">{item.pick}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.why}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Before you click install</p>
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight">Hardware + account readiness</h3>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#555]">{hardwareChecks.length}/{hardwareChecklist.length} ready</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hardwareChecklist.map((item, i) => {
                const checked = hardwareChecks.includes(i);
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleHardwareCheck(i)}
                    className={`text-left border-[3px] p-5 transition-all ${checked ? 'border-[#22c55e] bg-[#f0fdf4] shadow-[5px_5px_0_0_#111]' : 'border-[#111] bg-[#fdfaf6] hover:-translate-y-0.5'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-[2px] border-[#111] ${checked ? 'bg-[#22c55e]' : 'bg-white'}`}>
                        {checked ? <span className="block h-2 w-2 bg-[#111]"></span> : null}
                      </span>
                      <div>
                        <h4 className="font-sans font-black uppercase text-base text-[#111]">{item.label}</h4>
                        <p className="font-serif text-sm text-[#333] leading-relaxed mt-1">{item.plain}</p>
                        <p className="font-mono text-[11px] text-[#555] mt-3 uppercase tracking-wider">{item.check}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8 border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e]">
            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Translation layer</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">Words you will hear, in human language</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plainEnglishTerms.map((item) => (
                <div key={item.term} className="border-[2px] border-[#333] bg-[#171717] p-4">
                  <h4 className="font-sans font-black uppercase text-[#22c55e] mb-1">{item.term}</h4>
                  <p className="font-serif text-sm text-[#ddd] leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Linux survival glossary</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Linux words translated for normal people</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c1LinuxSurvivalTerms.map((item) => (
                <div key={item.term} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <p className="font-sans font-black uppercase text-[#111] mb-1">{item.term}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-[#111] text-[#eae7de] border-[2px] border-[#22c55e] p-4">
              <p className="font-sans font-black uppercase text-sm text-[#22c55e] mb-2">Support rule</p>
              <p className="font-serif text-sm text-[#ddd] leading-relaxed">
                If support gives a Linux command, paste it exactly, run one command at a time, and copy the final output back to Hermes. Do not guess extra words.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
              <h3 className="font-sans font-black uppercase text-sm mb-3">80m Agent Desktop Path</h3>
              <ol className="list-decimal list-inside font-serif text-[#333] space-y-2 text-sm">
                <li>Open the app and follow the first-run setup.</li>
                <li>Choose provider and paste your private API key.</li>
                <li>Wait for install and health checks to finish.</li>
                <li>Open Chat and send the first-win prompt below.</li>
              </ol>
              <p className="font-mono text-xs text-[#555] mt-3">Prompt: "Check my 80m Agent Desktop setup and explain any red warnings in plain English."</p>
            </div>
            <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 shadow-[6px_6px_0_0_#22c55e]">
              <h3 className="font-sans font-black uppercase text-sm mb-3 text-[#22c55e]">Advanced terminal rescue path</h3>
              <ol className="list-decimal list-inside font-serif text-[#ddd] space-y-2 text-sm">
                <li>Use this only if the desktop app asks you to diagnose something.</li>
                <li>Run health commands exactly as shown; do not improvise.</li>
                <li>Copy red error text into Hermes and ask for a plain-English fix.</li>
                <li>Change one setting at a time, then test again.</li>
              </ol>
              <p className="font-mono text-xs text-[#777] mt-3">Prompt: "Hermes, translate this error and give me the safest next click or command."</p>
            </div>
          </div>
          <CourseBoostPanel
            title="Class 01 Success Criteria + Rescue Prompts"
            checklist={[
              "80m Agent Desktop opens without red health warnings.",
              "Hermes receives one message and returns a useful structured answer.",
              "Memory has at least your name, timezone, business, and main goal.",
              "One low-risk schedule is drafted before you automate anything external."
            ]}
            prompts={[
              "\"Run a full setup audit. Explain every warning in plain English and list the safest next step.\"",
              "\"Create my first useful workspace: daily brief, task list, memory profile, and follow-up rules.\""
            ]}
          />
          <StudentCompletionKit
            eyebrow="Class 01 final standard"
            title="The student leaves with a working app and a first Hermes win"
            outcomes={c1CompletionOutcomes}
            drills={c1CompletionDrills}
            proof={c1CompletionProof}
          />

          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// First useful win</p>
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight">Pick the first thing Hermes should build for you</h3>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#555]">No code. Paste and answer questions.</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {Object.entries(firstWinPrompts).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setFirstWin(key)}
                  className={`font-sans font-black text-xs md:text-sm uppercase border-[3px] px-3 py-3 transition-all ${firstWin === key ? 'bg-[#22c55e] text-[#111] border-[#111] shadow-[4px_4px_0_0_#111]' : 'bg-[#fdfaf6] text-[#111] border-[#ddd] hover:border-[#111]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="font-serif text-[#333] leading-relaxed mb-4">
              This is the moment the course should feel real. The student pastes one complete prompt, Hermes asks for missing details, and the app creates something useful instead of just proving it installed.
            </p>
            <CopyBlock text={firstWinPrompts[firstWin].prompt} label="Copy First-Win Prompt" />
          </div>
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
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Money safety before automation</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">The API key is not a password to memorize. It is a private meter.</h3>
            <p className="font-serif text-[#333] text-lg leading-relaxed mb-5">
              An API key lets Hermes pay for AI work on your account. That is why the setup is powerful and why it needs a rule: create one key for 80m, keep it private, set spending limits where your provider supports them, and delete/replace it if it ever appears somewhere public.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "OpenRouter", body: "Best starter path for most clients. One key can access many model providers, and key-level credit limits make beginner mistakes less expensive." },
                { title: "OpenAI", body: "Direct OpenAI account. Good if you already use the platform. Use project keys, keep them server-side, and never paste them into public code or screenshots." },
                { title: "Anthropic", body: "Direct Claude account. Create keys in Console, use workspaces/spend controls, and watch usage until your first workflows are stable." }
              ].map((item) => (
                <div key={item.title} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <h4 className="font-sans font-black uppercase text-[#111] mb-2">{item.title}</h4>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-[#f0fdf4] border-[2px] border-[#22c55e] p-4">
              <p className="font-sans font-black uppercase text-sm text-[#14532d] mb-2">Student rule</p>
              <p className="font-serif text-[#14532d] leading-relaxed">
                If a lesson, Discord message, or website asks you to paste an API key outside 80m Agent Desktop or your provider console, stop and ask support first.
              </p>
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
              "Only open Terminal or PowerShell if the desktop app tells you to.",
              "Know this: a terminal is just a text box where the computer follows written instructions.",
              "Copy commands exactly. Do not retype from memory.",
              "If anything turns red, copy the red text and ask Hermes to translate it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. The Command Box Rescue Protocol</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Most clients will use 80m Agent Desktop and never live in a terminal. You still need to recognize one because it is the emergency room for install problems. The rule is simple: paste exactly, wait, then read the last green or red line.
          </p>
          <MacWindow title="support_command_window.exe" contentClass="bg-[#111] p-6 h-96 overflow-y-auto font-mono text-sm text-[#eae7de]">
            <p className="text-[#555] mb-4">Last login: {new Date().toDateString()} on ttys001</p>
            <p className="text-[#38bdf8] mb-4">lazy_user@macbook-pro ~ % <span className="text-[#eae7de]">_</span></p>

            {terminalStep === 0 && (
              <div className="mt-8 border-[2px] border-[#333] p-6 bg-[#1a1a1a] text-center max-w-lg mx-auto">
                <p className="mb-4 text-[#ddd]">Practice the motion once: paste a command, let it run, then look for the final status. This is a simulation.</p>
                <button onClick={handleRunInstall} className="font-sans font-black text-lg px-8 py-4 bg-[#22c55e] text-[#111] hover:bg-[#4ade80] transition-colors w-full shadow-[4px_4px_0_0_#111]">
                  Simulate the Setup Script
                </button>
              </div>
            )}
            {terminalStep > 0 && (
              <div className="space-y-2">
	                <p className="text-[#38bdf8]">student@computer ~ % <span className="text-[#eae7de]">80m setup check --plain-english</span> <span className="text-[#777]"># simulation only</span></p>
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
            You do not have one generic chatbot. You have Hermes coordinating a team. In plain English: Hermes is the manager, and each specialist handles a lane so the student can ask for outcomes instead of tool names.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Hermes", role: "Chief Coordinator", desc: "The main assistant you talk to. Routes work, checks tools, remembers context, and keeps the whole system moving." },
              { name: "Prawnius", role: "Quick Task Agent", desc: "Fast one-off help: short research, summaries, small drafts, and quick fixes that should not become a project." },
              { name: "Claudnelius", role: "Code + Design", desc: "Builds and repairs technical work. If the client needs a website, app, workflow, or bug fix, this is the builder lane." },
              { name: "Knowledge Knaight", role: "Research + Memory", desc: "Finds facts, reads saved knowledge, and turns messy information into something the rest of the system can use." },
              { name: "Knaight of Affairs", role: "Schedule + Coordination", desc: "Handles calendar logic, reminders, follow-ups, and keeping people aligned without constant manual nudging." },
              { name: "Sir Clawthchilds", role: "Finance", desc: "Budgets, invoices, spreadsheets, pricing, ROI, and money decisions that need clean numbers." },
              { name: "Labrina", role: "Content + Social", desc: "Turns ideas into content plans, posts, hooks, scripts, and community replies." },
              { name: "Clawdette", role: "Operations", desc: "Everyday execution: task cleanup, document prep, checklists, delegation, and making sure loose ends get closed." },
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
          <NeedBox
            title="What you need before you start"
            items={[
              "80m Agent Desktop open.",
              "A successful first message in Chat.",
              "Permission to click around without changing advanced settings yet."
            ]}
          />
          <SectionMeta minutes="18 min" focus="Desktop app tour" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. What the 80m Agent Desktop Actually Does</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            This is the part most non-coders need most. The app is not just a chat box. It is the control room for Hermes: conversations, memory, tools, schedules, connected apps, models, backups, and work boards.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { screen: "Chat", job: "Talk to Hermes and watch tool progress stream live.", first: "Ask for a setup audit or daily brief." },
              { screen: "Sessions", job: "Find old conversations and continue where you left off.", first: "Search for your first setup conversation." },
              { screen: "Memory", job: "See what Hermes remembers about you and your business.", first: "Save name, timezone, role, business, and top goal." },
              { screen: "Skills", job: "Install reusable workflows like content, email, research, or finance helpers.", first: "Browse before installing; pick one workflow you repeat weekly." },
              { screen: "Tools", job: "Turn capabilities on and off: web, files, terminal, image generation, memory, delegation, and more.", first: "Leave defaults on until support tells you otherwise." },
              { screen: "Schedules", job: "Create recurring jobs with delivery targets.", first: "Draft a weekday morning brief, but approve before it sends anywhere." },
              { screen: "Kanban", job: "Track multi-agent tasks, blockers, comments, and run history.", first: "Create one task called 'Finish my first workspace setup'." },
              { screen: "Gateway", job: "Connect messaging surfaces like Telegram, Discord, Slack, email, and webhooks.", first: "Do not connect external messaging until your memory and rules are clean." },
            ].map((item) => (
              <div key={item.screen} className="border-[3px] border-[#111] bg-white p-5 shadow-[5px_5px_0_0_#111]">
                <p className="font-mono text-xs uppercase tracking-widest text-[#22c55e] mb-2">{item.screen}</p>
                <p className="font-serif text-[#333] leading-relaxed mb-3">{item.job}</p>
                <p className="font-sans text-sm font-black uppercase text-[#111]">First action: <span className="font-serif normal-case font-normal text-[#555]">{item.first}</span></p>
              </div>
            ))}
          </div>
          <CheckpointCard
            title="Desktop Tour Checkpoint"
            pass={[
              "You can explain Chat, Memory, Skills, Tools, Schedules, Gateway, and Settings without technical words.",
              "You know where to check old sessions and setup errors.",
              "You created or copied one useful first-win prompt."
            ]}
            fail={[
              "You think 80m is only a chatbot.",
              "You are turning on external gateways before rules and memory are set.",
              "You cannot find where API/provider settings live."
            ]}
          />
        </div>

        {/* Section 4: Hardware Checklist */}
        <div className="mb-24">
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. The Hardware Reality Check</h2>
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
	              "Only continue if the desktop app or support says Docker is part of your setup.",
	              "Docker Desktop installed and open, if needed.",
	              "Hermes open so it can translate any confusing message."
            ]}
          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. Docker in Plain English (Optional Support Vocabulary)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Docker is like a sealed moving box for software. If your setup uses it, Docker keeps the helper parts together so the app runs the same way every time. You do not need to become a Docker person; you only need to know what support means when they say "is Docker running?"
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
	              "80m Agent Desktop open.",
	              "A screenshot or copied text from the warning.",
	              "The rule: read the last line first, then ask Hermes to translate it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. The Red Error Guide</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Eventually, an app, browser, or command window may show red text. Red does not mean you broke everything. It usually means one part is missing, asleep, blocked, or waiting for permission.
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
	                    <p className="font-serif text-lg text-[#14532d]">"Hermes is trying to talk to a local model service, but that service is not awake yet. Open the model app or ask support which provider should be selected."</p>
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
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. 127.0.0.1: Your Home Address</h2>
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
	              "80m Agent Desktop installed and signed in to your provider.",
	              "Your backup/export location chosen.",
	              "Release notes or Discord announcements checked before big updates."
	            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. Keeping the System Alive</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            AI tools change quickly. The safe maintenance habit is boring on purpose: back up settings, read the update note, update one thing at a time, then run a setup audit in Hermes.
          </p>
          <div className="bg-yellow-50 border-[3px] border-[#111] p-8 border-l-[12px] border-l-[#111]">
	            <h3 className="font-sans font-black text-2xl uppercase mb-4 italic">The Update Rule:</h3>
	            <p className="font-serif text-lg leading-relaxed mb-6">
	              Once a week, open Settings, check for updates, export or back up your local settings, and ask Hermes to run a setup audit after the update. If everything is working, do not start changing advanced settings just because a tutorial showed them.
            </p>
          </div>
        </div>

        {/* Section 9: The Zero‑Code Playbook */}
        <div className="mb-24" id="c1-playbook">
          <NeedBox
            title="What you need before you start"
	            items={[
	              "All previous sections complete.",
	              "Your Memory and Soul/settings screens open in 80m Agent Desktop.",
	              "The 7 agent names or lanes written down somewhere."
	            ]}
          />
          <SectionMeta minutes="14 min" focus="Install discipline + automation" />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. The Zero‑Code Playbook (For People With Better Things to Do)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            You’re not here to learn computer science. You’re here to stop drowning in busywork. This is the exact path to get 80m Agent Desktop and Hermes behaving like a real assistant without coding, without developer rituals, and without pretending you care about frameworks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
              <h4 className="font-sans font-black uppercase mb-3">The 7‑Step Adulting Protocol</h4>
              <ol className="list-decimal list-inside font-serif text-[#aaa] space-y-3">
	                <li><strong>Install the desktop app clean:</strong> Use the release for your operating system, finish first-run setup, then wait for the health check before touching anything else.</li>
	                <li><strong>Locate your workspace:</strong> Know where your saved files live. Example: keep the folder in Finder/Explorer favorites so support can help quickly.</li>
	                <li><strong>Write assistant rules:</strong> Define mission, output format, and "never do" list in Memory/Soul or the app's rules screen. Example: "Never send an email without approval."</li>
	                <li><strong>Define identity:</strong> Tell Hermes your tone, role, boundaries, timezone, and main business goal. Example: "Concise, no fluff, business-first."</li>
                <li><strong>Connect real tools:</strong> Add Gmail + Calendar with least-privilege permissions. Example: read calendar + draft emails only.</li>
                <li><strong>Create one source of truth:</strong> Single tasks file (no duplicate lists). Example: <code className="bg-[#fdfaf6] border px-1 font-mono text-xs">tasks.md</code> with Inbox / Today / Waiting.</li>
	                <li><strong>Schedule one heartbeat:</strong> Use the Schedules screen for a daily review or check-in. Example: 7:00am brief and 4:30pm follow-up digest, both approval-first.</li>
              </ol>
            </div>
            <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e]">
              <h4 className="font-sans font-black uppercase mb-3 text-[#22c55e]">Common Dumb Mistakes (Don’t Do These)</h4>
              <ul className="font-serif text-[#aaa] space-y-3">
	                <li>Installing the app but never telling Hermes your rules, business, tone, or hard boundaries.</li>
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
	              "Memory/Soul or assistant rules are filled with explicit boundaries.",
              "At least one tool integration (email/calendar) is verified."
            ]}
            fail={[
              "Multiple conflicting task lists still exist.",
	              "No schedule/heartbeat means the assistant is still reactive.",
              "You cannot explain your assistant rules in 60 seconds."
            ]}
          />
        </div>

        {/* Section 9: The Dumb‑Proof Dictionary */}
        <div className="mb-24" id="c1-dictionary">
          <NeedBox
            title="What you need before you start"
            items={[
	              "80m Agent Desktop open.",
	              "Your workspace or saved-files folder bookmarked.",
	              "Two minutes to read tool names without panicking."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. The Plain-English Dictionary</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You’ll see these words everywhere. Here’s what they actually mean in human language.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
	              { term: "Workspace", def: "Your assistant’s saved-files area. This is where useful context, outputs, and working documents should live." },
	              { term: "Rules", def: "Your assistant’s job description: mission, boundaries, approval rules, and preferred output style." },
	              { term: "Soul", def: "Personality + boundaries. The difference between helpful and annoying." },
	              { term: "Heartbeat", def: "A scheduled check-in. This is how your assistant becomes proactive." },
              { term: "Skills", def: "Reusable workflows. Teach it one good process and it runs it forever." },
              { term: "Memory", def: "Durable context files. It remembers your world across sessions." },
              { term: "Tools", def: "External services it can use (email, calendar, docs)." },
	              { term: "Cron", def: "An advanced scheduler word. In the desktop app, think of it as the behind-the-scenes version of Schedules." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#aaa]">{item.def}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
	            <h4 className="font-sans font-black uppercase mb-3">Schedules Behind the Scenes (Advanced)</h4>
	            <p className="font-serif text-[#aaa] mb-4">
	              Schedules let Hermes prepare recurring work while you are away. Advanced systems may show cron patterns, which are just compact time rules. Students should create schedules in the app first and ask Hermes to translate any pattern before using it.
            </p>
            <ul className="font-mono text-xs space-y-2 text-[#222]">
		              <li><code className="bg-[#fdfaf6] border px-1">0 7 * * 1-5</code> {'->'} Weekday 7:00 AM daily brief.</li>
		              <li><code className="bg-[#fdfaf6] border px-1">*/30 9-17 * * 1-5</code> {'->'} Every 30 minutes during business hours.</li>
		              <li><code className="bg-[#fdfaf6] border px-1">30 16 * * 1-5</code> {'->'} Weekday end-of-day summary at 4:30 PM.</li>
            </ul>
          </div>
          <ResourceList
            title="Dictionary Resources"
            items={[
	              { label: "80M Agent Desktop Releases", href: "https://github.com/guapdad4000/80m-agent-desktop-v3/releases/", note: "Download or update the customer desktop app." },
	              { label: "80M Resource Queue", href: "#c1-resources", note: "Student downloads, tutorials, and copy/paste setup prompts." },
              { label: "crontab.guru", href: "https://crontab.guru", note: "Translate cron patterns into plain English fast." }
            ]}
          />
        </div>

        {/* Section 11: Resource Locker */}
        <div className="mb-24" id="c1-resources">
          <NeedBox
            title="What you need before you start"
            items={[
              "A model provider account: OpenRouter, OpenAI, Anthropic, Google, or local.",
              "The 80m Agent Desktop release page.",
              "Discord installed for support.",
              "Optional later: Gmail + Calendar credentials.",
              "Know this: a console is just a settings website where you create private keys. That is it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">11. Resource Locker (Read This, Win Faster)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            These are the exact downloads and tutorial references students need. The first list is for doing the work. The second list is for learning the tool without pretending they already know developer language.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Basic Tool Downloads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {basicToolLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">YouTube Tutorials for Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorialLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-white p-4 hover:bg-[#fffbeb] hover:border-[#f59e0b] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 border-[2px] border-[#111] bg-[#fdfaf6] p-4">
              <p className="font-sans font-black text-sm uppercase mb-2">For future video production</p>
              <p className="font-serif text-sm text-[#333] leading-relaxed">
                Instructor production note: these tutorials are also logged in the internal scrape queue for later transcript research and original 80M-branded infographic videos.
              </p>
            </div>

            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Copy/Paste Rescue Prompts</p>
              <CopyBlock
                label="Copy Setup Audit Prompt"
                text={`Hermes, audit my 80m Agent Desktop setup.

Return PASS/FAIL for:
1. Hermes install health
2. selected model provider
3. API key loaded safely
4. chat streaming
5. memory/user profile
6. skills access
7. schedules availability
8. gateway status

Explain every failed item in plain English. Give me the safest next click or command. Do not ask me to change advanced settings unless needed.`}
              />
            </div>
            <div className="mt-8 border-t-2 border-[#111] pt-6 text-sm font-mono text-[#555]">
	              Instructor note: keep private internal docs out of screenshots. Student-facing setup should point to official downloads, support, and the 80M app screens.
            </div>
            <div className="mt-6 border-[2px] border-[#111] p-4 bg-[#fdfaf6]">
              <p className="font-sans font-black text-sm uppercase mb-3">Do not start here</p>
              <p className="font-serif text-sm text-[#333] leading-relaxed">
                Students do not need to learn GitHub, Sass, React, or terminal culture to finish Class 01. Those are builder tools. The customer path is: download app, choose provider, paste private key, send first useful prompt, verify memory, then create one safe schedule.
              </p>
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
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />
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
  const [promptBuilder, setPromptBuilder] = useState({
    role: 'Hermes, act as my operations chief of staff.',
    context: 'I run a small business and I keep losing track of client follow-ups.',
    task: 'Build a simple daily follow-up system I can use inside 80M Agent Desktop.',
    rules: 'Use plain English. Ask before sending anything externally. Keep the first version simple.',
    output: 'Return a checklist, a daily prompt, and three message templates.'
  });

  const sections = [
    { id: 's0', label: 'Intro: Brief Hermes Properly' },
    { id: 's1', label: '1. Prompt Translator' },
    { id: 's2', label: '2. Context Window' },
    { id: 's3', label: '3. Clean Brief Recipe' },
    { id: 's4', label: '4. Memory' },
    { id: 's5', label: '5. Reasoning Checks' },
    { id: 's6', label: '6. Voice Interaction' },
    { id: 's7', label: '7. Morning Brief' },
    { id: 's8', label: '8. Firm Prompt Formula' },
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

  const updatePromptBuilder = (field, value) => {
    setPromptBuilder(prev => ({ ...prev, [field]: value }));
  };

  const generatedPrompt = `ROLE:
${promptBuilder.role}

CONTEXT:
${promptBuilder.context}

TASK:
${promptBuilder.task}

RULES:
${promptBuilder.rules}

OUTPUT:
${promptBuilder.output}`;

  const promptAuditChecks = [
    { label: 'Role', bad: '"Help me"', good: '"Act as my client follow-up assistant."' },
    { label: 'Context', bad: '"Write a reply"', good: '"This is for a warm lead who asked about pricing yesterday."' },
    { label: 'Task', bad: '"Make it better"', good: '"Rewrite this message in 3 versions with one clear call to action."' },
    { label: 'Rules', bad: '"Sound good"', good: '"70 words max, no hype, confident but not pushy."' },
    { label: 'Output', bad: '"Give me ideas"', good: '"Return a table with option, subject line, message, and best use case."' }
  ];

  const promptDiagnosisTree = [
    { symptom: 'Hermes gives a generic answer', fix: 'Add role, business context, exact task, and the output format you want.' },
    { symptom: 'Hermes sounds too formal or too hype', fix: 'Give two tone examples: one sentence you like and one sentence you hate.' },
    { symptom: 'Hermes ignores an important rule', fix: 'Put the rule under RULES on its own line, then ask Hermes to self-check against it.' },
    { symptom: 'Hermes writes too much', fix: 'Set a length limit and output shape: "Return 5 bullets, each under 12 words."' },
    { symptom: 'Hermes asks too many questions', fix: 'Tell it what assumptions it may make and what questions are truly blocking.' },
    { symptom: 'Hermes wants to send, publish, buy, delete, or connect something', fix: 'Add approval boundaries: draft only, explain first, and wait for my yes.' }
  ];

  const c2BeginnerTerms = [
    { term: 'Prompt', def: 'The message you give Hermes. A strong prompt is a short job brief, not magic words.' },
    { term: 'Context', def: 'The useful facts Hermes needs to understand the job: customer, goal, situation, examples, and rules.' },
    { term: 'Token', def: 'A piece of text the model reads or writes. Long messy inputs use more of the assistant desk space.' },
    { term: 'Output format', def: 'The shape of the answer: table, checklist, bullets, email draft, CSV, plan, or scorecard.' },
    { term: 'Constraint', def: 'A limit or rule: 70 words, no hype, ask before sending, cite sources, or use plain English.' },
    { term: 'Self-check', def: 'A short review Hermes does after answering: did it follow the rules and miss anything obvious?' }
  ];

  const c2ClientPlaybooks = [
    {
      title: 'Client Follow-Up',
      use: 'When a lead or client goes quiet.',
      prompt: `ROLE: Hermes, act as my client follow-up assistant.

CONTEXT: I spoke with [client name] about [offer/problem] on [date]. They have not replied since [last message].

TASK: Draft 3 follow-up messages.

RULES: Warm, short, no guilt, no pressure, one clear next step. Do not send anything externally.

OUTPUT: Return a table with Tone, Message, Best Use Case, and Risk Check.`
    },
    {
      title: 'Daily Operator',
      use: 'When the student feels scattered.',
      prompt: `ROLE: Hermes, act as my daily operator.

CONTEXT: I have these tasks, meetings, and worries today: [paste list].

TASK: Pick the top 3 priorities and the first action for each.

RULES: Plain English. No productivity theory. Flag anything that needs my approval.

OUTPUT: Return Today, Waiting On, Risks, and First Action.`
    },
    {
      title: 'Offer Cleaner',
      use: 'When the student cannot explain what they sell.',
      prompt: `ROLE: Hermes, act as my offer strategist.

CONTEXT: I sell [service/product] to [audience]. The problem they have is [problem].

TASK: Rewrite my offer so a non-technical client understands the result.

RULES: No jargon. No fake guarantees. Make the outcome measurable.

OUTPUT: Return one sentence offer, 3 proof bullets, and a simple call to action.`
    },
    {
      title: 'Content Draft',
      use: 'When a raw idea needs to become content.',
      prompt: `ROLE: Hermes, act as my content editor.

CONTEXT: Here is my rough idea: [paste idea].

TASK: Turn it into one short post, one video outline, and one email idea.

RULES: Keep claims honest. Add a review checklist before publishing.

OUTPUT: Return Post, Video Outline, Email Idea, and Safety Check.`
    }
  ];

  const c2CompletionOutcomes = [
    'Turn any vague ask into ROLE, CONTEXT, TASK, RULES, and OUTPUT.',
    'Diagnose why Hermes gave a weak answer and improve the next prompt.',
    'Ask for a visible plan, final answer, and self-check without needing technical reasoning terms.',
    'Use memory deliberately: save stable facts, not random temporary noise.',
    'Create reusable prompts for daily planning, client follow-up, offers, and content.'
  ];

  const c2CompletionDrills = [
    'Rewrite one messy prompt into the 5-part Hermes brief.',
    'Ask Hermes to score a prompt from 1-10 and improve it to a 10.',
    'Create one reusable prompt for a real recurring task.',
    'Dictate a rough thought, clean it into a prompt, then copy the final version.'
  ];

  const c2CompletionProof = [
    'One reusable prompt is saved to the workspace.',
    'Hermes produces a table/checklist exactly as requested.',
    'The student can explain token, context, constraint, and output format.',
    'A memory update prompt has been tested and verified.'
  ];

  const c2ResourceLinks = [
    { label: '80M Agent Desktop Releases', href: 'https://github.com/guapdad4000/80m-agent-desktop-v3/releases/', note: 'Open Hermes in the customer desktop app before practicing prompts.' },
    { label: 'OpenAI Prompt Engineering', href: 'https://platform.openai.com/docs/guides/prompt-engineering', note: 'Official guide for instructions, examples, reusable prompts, and context.' },
    { label: 'OpenAI Text Generation Guide', href: 'https://platform.openai.com/docs/guides/text', note: 'Official guide for model inputs, outputs, instructions, and structured responses.' },
    { label: 'OpenAI Reasoning Best Practices', href: 'https://platform.openai.com/docs/guides/reasoning-best-practices', note: 'Use this for safer reasoning prompts and model behavior expectations.' },
    { label: 'Anthropic Clear Prompting', href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct', note: 'Official Claude guide: clear, direct, detailed instructions with context.' },
    { label: 'Claude Prompting Best Practices', href: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices', note: 'Useful examples for explicit instructions, examples, and tool workflows.' },
    { label: 'Gemini Prompting Strategies', href: 'https://ai.google.dev/gemini-api/docs/prompting-strategies', note: 'Official Google guide for clear instructions, examples, and prompt iteration.' },
    { label: 'Wispr Flow Download', href: 'https://wisprflow.ai/downloads', note: 'Optional voice-to-text tool for students who think better out loud.' },
    { label: 'Prompting Guide', href: 'https://www.promptingguide.ai/', note: 'Beginner-friendly outside reference. Use it for examples, not doctrine.' }
  ];

  const c2TutorialLinks = [
    { label: 'Prompt Engineering Full Course', href: 'https://www.youtube.com/watch?v=2BpCk4d2Cc0', note: 'Beginner-friendly broad overview from Tech With Tim.' },
    { label: 'Prompt Engineering Tutorial', href: 'https://www.youtube.com/watch?v=_ZvnD73m40o', note: 'FreeCodeCamp reference for prompt structure and LLM behavior.' },
    { label: 'Perfect ChatGPT Prompt Formula', href: 'https://www.youtube.com/watch?v=jC4v5AS4RIM', note: 'Short prompt formula lesson that maps well to Hermes templates.' },
    { label: 'Google Prompting Course in 20 Minutes', href: 'https://www.youtube.com/watch?v=p09yRj47kNM', note: 'Compressed overview of Google prompting principles.' },
    { label: 'Anthropic Prompting 101', href: 'https://www.youtube.com/watch?v=ysPbXH0LpIE', note: 'Official Anthropic video reference for Claude-style prompting.' },
    { label: 'Context Windows Explained', href: 'https://www.youtube.com/watch?v=TeQDr4DkLYo', note: 'Explains why too much messy context makes models worse.' },
    { label: 'Tokens in 2 Minutes', href: 'https://www.youtube.com/watch?v=OjrGu0L5K7M', note: 'Quick explainer for token vocabulary.' },
    { label: 'Wispr Flow Beginner Guide', href: 'https://www.youtube.com/watch?v=BEWYvMbKAyw', note: 'Official voice dictation starter video.' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 02</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Brief Hermes Properly</h2>
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
              "80M Agent Desktop open with Hermes ready to answer.",
              "One real task you want help with today.",
              "One messy message, email, note, or idea you want cleaned up.",
              "Your timezone and business goal saved from Class 01.",
              "A private note app for saving reusable prompts.",
              "A beginner rule: do not learn jargon first. Learn what to say to Hermes."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
            Stop Guessing. <br/><span className="italic text-[#22c55e]">Brief Hermes.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6">
            If Hermes gives you generic answers, the problem is usually the brief. A good prompt tells Hermes who to act as, what you want done, what facts matter, what rules to follow, and what the finished output should look like.
          </p>
          <p className="font-serif text-sm text-[#555] mt-3">
            Keep it simple: use the formula exactly, test once, then change one rule at a time.
          </p>

          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Interactive prompt builder</p>
                <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight">Build a Hermes brief that works</h3>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#555]">Role + Context + Task + Rules + Output</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                ['role', 'Role', 'Who should Hermes act as?'],
                ['context', 'Context', 'What facts should Hermes know?'],
                ['task', 'Task', 'What exact job should Hermes do?'],
                ['rules', 'Rules', 'What must Hermes avoid or obey?'],
                ['output', 'Output', 'What shape should the answer be?']
              ].map(([field, label, helper]) => (
                <label key={field} className={field === 'output' ? 'md:col-span-2' : ''}>
                  <span className="font-sans font-black uppercase text-sm text-[#111]">{label}</span>
                  <span className="block font-serif text-sm text-[#555] mb-2">{helper}</span>
                  <textarea
                    value={promptBuilder[field]}
                    onChange={(e) => updatePromptBuilder(field, e.target.value)}
                    className="w-full min-h-24 border-[3px] border-[#111] bg-[#fdfaf6] p-3 font-mono text-xs text-[#111] focus:outline-none focus:ring-4 focus:ring-[#22c55e]/30"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6">
              <CopyBlock text={generatedPrompt} label="Copy Built Hermes Brief" />
            </div>
          </div>

          <div className="mt-8 border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Prompt audit</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">The 5 checks before you press send</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {promptAuditChecks.map((item) => (
                <div key={item.label} className="border-[2px] border-[#111] bg-white p-4">
                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">{item.label}</p>
                  <p className="font-mono text-[11px] text-red-600 mb-2">Weak: {item.bad}</p>
                  <p className="font-mono text-[11px] text-[#14532d]">Strong: {item.good}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// If the answer is bad</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Prompt diagnosis tree</h3>
            <div className="space-y-3">
              {promptDiagnosisTree.map((item, idx) => (
                <div key={item.symptom} className="grid grid-cols-1 md:grid-cols-[2rem_1fr_1.3fr] gap-3 border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <p className="font-mono font-black text-[#22c55e]">{idx + 1}</p>
                  <p className="font-sans font-black uppercase text-sm text-[#111]">{item.symptom}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.fix}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e]">
            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Beginner dictionary</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Prompting words in normal language</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c2BeginnerTerms.map((item) => (
                <div key={item.term} className="border-[2px] border-[#333] bg-[#171717] p-4">
                  <p className="font-sans font-black uppercase text-[#22c55e] mb-1">{item.term}</p>
                  <p className="font-serif text-sm text-[#ddd] leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-3">Fast Start: Copy/Paste Prompt Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CopyBlock text="ROLE: Hermes, act as my chief of staff. CONTEXT: I have a messy day and need priorities. TASK: Create my top 3 priorities. RULES: plain English, no fluff, ask before contacting anyone. OUTPUT: numbered list with next action." />
              <CopyBlock text="ROLE: Hermes, act as my client communication assistant. TASK: Rewrite this message. RULES: 70 words max, confident tone, one CTA, no external sending. OUTPUT: 3 options labeled Warm, Direct, Premium. CONTEXT: [paste message]." />
            </div>
          </div>
          <CourseBoostPanel
            title="Class 02 Prompt Quality Checklist"
            checklist={[
              "Every prompt includes ROLE, CONTEXT, TASK, RULES, and OUTPUT.",
              "Output format is explicit (table, bullets, JSON, etc.).",
              "Prompts are reusable templates saved to your workspace.",
              "At least one prompt is automated into a scheduled brief."
            ]}
            prompts={[
              "\"Convert this vague ask into a strict ROLE/TASK/RULES/OUTPUT/CONTEXT prompt.\"",
              "\"Score this prompt from 1-10 for clarity and rewrite it to a 10.\""
            ]}
          />
          <StudentCompletionKit
            eyebrow="Class 02 final standard"
            title="The student can brief Hermes like a real operator"
            outcomes={c2CompletionOutcomes}
            drills={c2CompletionDrills}
            proof={c2CompletionProof}
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
              "80M Agent Desktop open.",
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
                {promptState === 0 && <button onClick={handleTranslate} className="font-sans font-black text-sm uppercase px-6 py-4 bg-[#111] text-[#22c55e] shadow-[4px_4px_0_0_#22c55e]">Translate</button>}
                {promptState === 1 && <div className="font-mono text-xs text-[#555] animate-pulse">Structuring...</div>}
                {promptState === 2 && <button onClick={resetPrompt} className="font-sans font-black text-sm uppercase px-6 py-4 bg-[#eae7de] border-[3px] border-[#111] shadow-[4px_4px_0_0_#111]">Reset</button>}
              </div>
              <div className={`flex-1 border-[2px] border-[#333] p-6 relative ${promptState === 2 ? 'bg-[#f0fdf4] border-green-600' : 'bg-[#e5e5e5]'}`}>
                <div className={`absolute -top-3 left-4 text-white font-mono text-xs font-bold px-2 py-1 uppercase tracking-widest border-[2px] border-[#111] ${promptState === 2 ? 'bg-green-600' : 'bg-gray-500'}`}>80m Standard</div>
                {promptState === 2 ? (
                  <div className="font-serif text-lg text-[#111] mt-2 space-y-2">
                    <p><strong>ROLE:</strong> Hermes, act as my client communication assistant.</p>
                    <p><strong>CONTEXT:</strong> I need to message customers about a limited-time Black Friday offer.</p>
                    <p><strong>TASK:</strong> Write 3 email options.</p>
                    <p><strong>RULES:</strong> Grade 6 reading level. No hype. 50 words max.</p>
                    <p><strong>OUTPUT:</strong> Table with subject line, email body, and best use case.</p>
                    <CopyBlock
                      text={`ROLE: Hermes, act as my client communication assistant.

CONTEXT: I need to message customers about a limited-time Black Friday offer.

TASK: Write 3 email options.

RULES: Grade 6 reading level. No hype. 50 words max.

OUTPUT: Table with subject line, email body, and best use case.`}
                      label="Copy Translated Prompt"
                    />
                  </div>
                ) : <p className="font-mono text-[#888] mt-2 text-center py-8">Awaiting command...</p>}
              </div>
            </div>
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Client-ready prompt playbooks</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-4">Pick the job, copy the brief, replace the brackets</h3>
            <p className="font-serif text-[#333] leading-relaxed mb-5">
              These are the prompts students should actually use with Hermes. They are written for normal work: follow-ups, daily planning, offers, and content drafts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c2ClientPlaybooks.map((item) => (
                <div key={item.title} className="border-[2px] border-[#111] bg-white p-4">
                  <p className="font-sans font-black uppercase text-[#111] mb-1">{item.title}</p>
                  <p className="font-serif text-sm text-[#555] mb-3">{item.use}</p>
                  <CopyBlock text={item.prompt} label="Copy Client Prompt" />
                </div>
              ))}
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
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. Context Window: The Assistant's Desk Space</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Think of the <GlossaryTooltip term="Context Window" definition="How much information Hermes can work with at once" href="#c2-dictionary" /> as the assistant's desk space. If the desk is packed with old notes, random screenshots, and unrelated files, the important job gets buried.
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

	        {/* Section 3: Brief Recipe */}
	        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "One task you've been handing to your AI one piece at a time.",
              "The numbered list format below as a template."
            ]}
          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">3. The Clean Brief Recipe</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Stop sending five separate half-prompts. Give Hermes one clean recipe: what to do first, second, third, and what not to do without approval. Numbered steps make it easier for the assistant to finish every part.
          </p>
          <div className="bg-white border-[3px] border-[#111] p-8">
	            <h4 className="font-sans font-black text-lg mb-4 uppercase">The clean brief prompt:</h4>
            <div className="bg-gray-100 p-6 font-mono text-sm border-l-4 border-[#111]">
              1. Research the top 3 news stories in [industry] today.<br/>
              2. Summarize each in 2 sentences.<br/>
              3. Draft a LinkedIn post about story #1.<br/>
              4. Draft a tweet about story #2.<br/>
              5. Draft an email about story #3, but do not send it until I approve.
            </div>
            <p className="mt-4 font-serif italic text-sm text-[#555]">Note: number the work, then add the approval rule. That gives Hermes a finish line and a boundary.</p>
          </div>
        </div>

        {/* Section 4: Memory */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "80M Agent Desktop open to Memory.",
              "Your name, timezone, business, and current goal.",
              "One hard rule you want Hermes to remember."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Memory: Stop Starting From Scratch</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Every generic AI chat starts cold. 80M memory lets Hermes remember your role, clients, style, limits, and recurring work. A better prompt plus better memory is where the app starts feeling personal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-[#111] text-[#eae7de]">
              <h4 className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">Memory Prompt</h4>
              <CopyBlock
                text="Hermes, save this to memory: my name is [name], my timezone is [timezone], my business is [business], my current goal is [goal], my preferred tone is [tone], and my hard rule is [rule]. After saving, tell me what you will remember."
                label="Copy Memory Prompt"
              />
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#f0fdf4]">
              <h4 className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">Result</h4>
              <p className="font-serif text-[#14532d]">Next time you ask for a client reply, Hermes can use your tone, your business context, and your approval rules without making you repeat the whole story.</p>
            </div>
          </div>
        </div>

        {/* Section 5: Reasoning Checks */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "The interactive 'Show Plan Check' button below.",
              "One complex question you've been afraid to ask your AI."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. Reasoning Checks: Plan, Answer, Check</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            AI is fast. Sometimes it answers before it has understood the job. Do not ask Hermes to reveal hidden model reasoning. Ask for a short visible plan, a clean final answer, and a self-check against your rules.
          </p>
          <div className="bg-[#111] p-8 border-[4px] border-[#333] text-[#eae7de] shadow-[12px_12px_0_0_#111]">
            <button
              onClick={() => setThoughtChain(!thoughtChain)}
              className="mb-8 font-sans font-black uppercase text-sm py-4 px-8 border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-[#111] transition-all"
            >
              {thoughtChain ? "Hide Plan Check" : "Show Plan Check"}
            </button>
            <AnimatePresence>
              {thoughtChain && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs space-y-4">
                  <p className="text-[#38bdf8]">&gt; USER: "Balance my monthly ad budget."</p>
                  <p className="text-[#aaa]">&gt; VISIBLE PLAN:<br/>
                    1. Identify total spend and target outcome.<br/>
                    2. Compare campaign performance against the target.<br/>
                    3. Flag waste, risk, and the safest budget move.
                  </p>
                  <p className="text-[#22c55e]">&gt; FINAL ANSWER: "Pause campaign X, move $400 to Y, and review again in 48 hours."</p>
                  <p className="text-[#f59e0b]">&gt; SELF-CHECK: "This follows your rule: no irreversible ad changes without approval."</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-6 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h4 className="font-sans font-black uppercase mb-3">Copy this when the task matters</h4>
            <CopyBlock
              text={`Hermes, before answering:
1. Give me a short visible plan in 3 bullets.
2. Ask one clarifying question only if the missing detail changes the answer.
3. Give the final answer in the format I requested.
4. End with a self-check against my rules.

Do not take external action without my approval.`}
              label="Copy Plan Answer Check Prompt"
            />
          </div>
        </div>

        {/* Section 6: Voice Interaction */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "Optional: Wispr Flow or another voice-to-text app.",
              "80M Agent Desktop open so you can paste dictated prompts into Hermes.",
              "A quiet room for the first test."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Dictate, Then Review</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You do not have to type every prompt. Voice-to-text lets a student speak the messy version, then Hermes can turn it into a clean brief. The trick is to dictate structure out loud: role, context, task, rules, output.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-[#eae7de]">
              <h4 className="font-sans font-black uppercase mb-2">The Dictation Script</h4>
              <p className="font-serif text-[#111] mb-4">Say the labels out loud. Example: "Role: Hermes, act as my scheduler. Context: I keep missing appointments. Task: build a reminder routine. Rules: ask before messaging anyone. Output: checklist."</p>
              <CopyBlock
                text="Role: Hermes, act as my [assistant type]. Context: [what is happening]. Task: [what I need done]. Rules: [what not to do]. Output: [how I want the answer formatted]."
                label="Copy Voice Prompt Script"
              />
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#111] text-[#eae7de]">
              <h4 className="font-sans font-black uppercase mb-2 text-[#22c55e]">Hotkeys</h4>
              <p className="font-serif text-[#ddd]">Use push-to-talk or a clear record/stop habit. Dictate the prompt, read it once, then paste into Hermes. Voice is for speed, not for skipping review.</p>
            </div>
          </div>
        </div>

        {/* Section 7: Morning Brief */}
        <div className="mb-24">
          <NeedBox
            title="What you need before you start"
            items={[
              "80M Agent Desktop open to the Schedules screen.",
              "Your calendar or inbox connected only if you are ready for that.",
              "A safety rule: draft first, send nothing externally without approval."
            ]}
          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. The Morning Brief (Your First Schedule)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            By the end of Class 02, you should be able to ask Hermes for a weekday morning brief that summarizes what matters, flags conflicts, and gives one first action. Start with a draft schedule. Do not connect external sending until your rules are clean.
          </p>
          <MacWindow title="Hermes Morning Brief Prompt" contentClass="bg-[#111] p-6 font-mono text-sm text-[#eae7de]">
            <p className="text-[#aaa] mb-4"># Paste this into 80M Agent Desktop</p>
            <p className="text-[#38bdf8] whitespace-pre-wrap">{`Hermes, create a weekday morning brief schedule for 7:00 AM.

Context: I want a simple daily operating brief before work starts.
Task: Summarize today's priorities, calendar risks, waiting-on items, and one recommended first action.
Rules: Do not send emails, texts, Discord messages, or calendar invites without my approval.
Output: Show me the schedule draft, the brief template, and a test run for tomorrow.`}</p>
          </MacWindow>
          <div className="mt-6">
            <CopyBlock
              text={`Hermes, create a weekday morning brief schedule for 7:00 AM.

Context: I want a simple daily operating brief before work starts.
Task: Summarize today's priorities, calendar risks, waiting-on items, and one recommended first action.
Rules: Do not send emails, texts, Discord messages, or calendar invites without my approval.
Output: Show me the schedule draft, the brief template, and a test run for tomorrow.`}
              label="Copy Morning Brief Prompt"
            />
          </div>
        </div>

	        {/* Section 8: The Firm Prompt Formula */}
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
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Firm Prompt Formula</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Prompts are not vibes. They are instructions. Use this formula and Hermes will know the job, the boundaries, and what a finished answer should look like.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-[3px] border-[#111] p-6 bg-white shadow-[6px_6px_0_0_#111]">
              <h4 className="font-sans font-black uppercase mb-3">The Formula</h4>
              <ul className="font-serif text-[#333] space-y-3">
                <li><strong>ROLE:</strong> Who it is right now. (Executive assistant)</li>
                <li><strong>CONTEXT:</strong> The facts it needs. (Client details)</li>
                <li><strong>TASK:</strong> The exact job. (Draft 3 replies)</li>
                <li><strong>RULES:</strong> Constraints. (50 words, no hype)</li>
                <li><strong>OUTPUT:</strong> The <GlossaryTooltip term="Output Format" definition="Required structure like bullets/table/JSON" href="#c2-dictionary" />. (Bulleted list)</li>
              </ul>
            </div>
            <div className="border-[3px] border-[#111] p-6 bg-[#111] text-[#eae7de] shadow-[6px_6px_0_0_#22c55e]">
              <h4 className="font-sans font-black uppercase mb-3 text-[#22c55e]">Example (Copy + Paste)</h4>
              <CopyBlock
                text="ROLE: Hermes, act as my executive assistant. CONTEXT: [paste the email and what relationship I have with this person]. TASK: Draft 3 reply options. RULES: 60 words max, confident tone, no hype. OUTPUT: 3 bullets labeled Warm, Direct, and Follow-up."
                label="Copy Formula Example"
              />
            </div>
          </div>
          <ResourceList
            title="Prompting Resources"
            items={[
              { label: "Prompt Translator Section", href: "#c2-prompting", note: "Go back to Section 1 in this class." },
              { label: "OpenAI Prompt Engineering", href: "https://platform.openai.com/docs/guides/prompt-engineering", note: "Official structure and examples." },
	              { label: "Anthropic Clear Prompting", href: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct", note: "Official prompting process and success criteria." }
            ]}
          />
          <CheckpointCard
            title="Prompt Formula Checkpoint"
            pass={[
              "Prompt includes ROLE/CONTEXT/TASK/RULES/OUTPUT in order.",
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
	              "A place to store your rules: 80M Memory, Soul/settings, or a normal notes file.",
              "Two minutes of patience. That’s the whole requirement."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. The Dumb‑Proof Dictionary</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You’ll see these terms all over the AI world. Here’s what they actually mean.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { term: "Context Window", def: "The assistant's desk space: how much information Hermes can work with at once." },
              { term: "System Prompt", def: "A deep instruction sheet controlled by the app or provider. Beginners usually do not edit this directly." },
              { term: "Delegation", def: "Giving Hermes a clear job and, when useful, letting it route parts to the right specialist." },
              { term: "Memory", def: "Saved context about you, your business, your rules, and past decisions." },
              { term: "Reasoning Check", def: "Asking for a short plan, final answer, and self-check instead of a rushed answer." },
              { term: "Tool", def: "A connected service like Gmail or Calendar." },
              { term: "Schedule", def: "A recurring Hermes task, like a weekday morning brief." },
              { term: "Output Format", def: "The shape you want: bullets, table, JSON, etc." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#333]">{item.def}</p>
              </div>
            ))}
          </div>
          <p className="font-serif text-[#555] mt-6">
            Pro move: when a term confuses you in class notes, jump to this dictionary first instead of guessing. It saves hours of bad prompts.
          </p>
        </div>

        {/* Section 10: Resource Locker */}
        <div className="mb-24" id="c2-resources">
          <NeedBox
            title="What you need before you start"
            items={[
              "80M Agent Desktop open.",
              "Your prompt-builder output from the intro.",
              "Your preferred note app for saving reusable prompts.",
              "Know this: docs are references, not homework. Use them when a prompt breaks."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. Resource Locker (Prompting)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Actual links you’ll use. The official docs are here for accuracy; the videos are here for students who need the picture before the vocabulary.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Official References + Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {c2ResourceLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">YouTube Tutorials for Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c2TutorialLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-white p-4 hover:bg-[#fffbeb] hover:border-[#f59e0b] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Copy/Paste Prompt Templates</p>
              <ul className="font-mono text-xs text-[#1f2937] space-y-2">
                <li>"Summarize this thread into: Decisions, Risks, Next Actions. Max 8 bullets."</li>
                <li>"Turn this brain dump into a clean task list with owner, due date, and dependencies."</li>
                <li>"Generate a daily brief from my schedule. Flag conflicts and propose fixes."</li>
              </ul>
            </div>
            <div className="mt-6 p-4 bg-[#fdfaf6] border-[2px] border-[#111]">
              <p className="font-sans font-black text-sm uppercase mb-2">For future video production</p>
              <p className="font-serif text-sm text-[#333] leading-relaxed">
                Instructor production note: Course 02 prompting videos are now logged in the internal scrape queue for future original 80M motion explainers.
              </p>
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
          <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 02 Complete.</h2>
          <button onClick={onClose} className="font-sans font-black text-xl px-12 py-6 bg-[#111] text-[#eae7de] border-[3px] border-[#111] hover:bg-[#22c55e] hover:text-[#111] shadow-[8px_8px_0_0_#111] transition-colors">
            Exit to Curriculum →
          </button>
        </div>
        </div>{/* close max-w-4xl */}
        </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />
    </motion.div>
  );
};


// ===== Quiz Data for all 3 courses =====
const quizDataC01 = [
  {
    section: 1,
    questions: [
      { q: "What is the first setup path for a non-coder?", options: ["Start by editing files", "Download 80m Agent Desktop, finish first-run setup, paste the provider key safely, then send a setup audit prompt", "Open random terminal commands from the internet", "Buy a server first"], correct: 1, explanation: "The beginner path is desktop-first: install the app, choose a provider, paste the private key only in trusted screens, and ask Hermes to audit setup before changing advanced settings." },
      { q: "What is an API key in plain English?", options: ["A public username", "A private meter that lets Hermes use paid AI services on your account", "A design template", "A calendar invite"], correct: 1, explanation: "An API key is like a private paid access card. Treat it like a password, set spending limits where possible, and rotate it if it is ever exposed." },
      { q: "When should a beginner use Terminal or PowerShell?", options: ["Before opening the app", "Only when the desktop app, Hermes, or support gives a specific diagnostic step", "Whenever a YouTube video says to", "Never under any circumstances"], correct: 1, explanation: "A command window is a rescue lane. Beginners should not improvise commands; they should copy exactly, read the last line, and ask Hermes to translate warnings." },
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
      { q: "Why does memory matter after the app is installed?", options: ["It makes the screen brighter", "It lets Hermes remember your name, timezone, business, rules, and goals across sessions", "It replaces your API key", "It turns off schedules"], correct: 1, explanation: "Memory is what stops Hermes from acting generic every session. Save identity, business context, tone, hard rules, and current priorities early." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is the difference between localhost and a public IP?", options: ["There is no difference", "localhost (127.0.0.1) is your computer talking to itself — nobody else can access it. A public IP is how the internet reaches you.", "localhost is faster", "Public IPs are only for websites"], correct: 1, explanation: "localhost/127.0.0.1 is a private loopback address — it's like talking to yourself in a room. Nobody external can access it. A public IP is your 'street address' that the whole internet can reach." },
      { q: "What is the secret tunnel mentioned in Class 03 for?", options: ["It makes downloads faster", "It lets you access your localhost AI from outside your network (e.g. from your phone)", "It encrypts your files", "It backs up your data"], correct: 1, explanation: "The Cloudflare Tunnel (Class 03) creates a secure connection from your server to Cloudflare — then you access your AI through Cloudflare instead of directly. Your phone can reach your AI even though it's behind your home router." },
      { q: "What is the safest way to create the first schedule?", options: ["Let it message people immediately", "Start with a private daily brief or follow-up digest that requires approval before external messages", "Schedule every tool at once", "Skip memory and connect gateways first"], correct: 1, explanation: "The first schedule should create useful private output, not take public action. Add external sending only after rules, memory, and approvals are clear." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "If something turns red, what should the student do first?", options: ["Delete the app", "Copy the exact warning into Hermes and ask for a plain-English next step", "Change five settings at once", "Post their API key for help"], correct: 1, explanation: "Copy the warning, protect private keys, ask Hermes to translate, and change one thing at a time. That keeps support possible and prevents panic-clicking." },
      { q: "What does Docker mean in this beginner course?", options: ["A required identity students must learn", "An optional support word for the sealed software box that may run helper services", "A social media app", "A payment provider"], correct: 1, explanation: "Docker is useful vocabulary, not the student's main job. If the setup uses it, it keeps helper services bundled and consistent." },
      { q: "What should happen before any major update?", options: ["Back up settings, read the update note, update one thing, then ask Hermes for a setup audit", "Delete memory", "Turn on every gateway", "Share logs publicly"], correct: 0, explanation: "Updates are safest when they are boring: backup, update, audit, verify. Avoid changing unrelated advanced settings during the same session." },
    ]
  },
];

const quizDataC02 = [
  {
    section: 1,
    questions: [
      { q: "What are the five parts of a strong Hermes brief?", options: ["Name, age, city, color, price", "Role, context, task, rules, and output", "Model, terminal, code, server, deploy", "Question, answer, joke, link, emoji"], correct: 1, explanation: "A reliable Hermes brief says who Hermes should act as, what facts matter, what job to do, what rules to obey, and what the finished answer should look like." },
      { q: "Why is 'make it sound nice' a weak prompt?", options: ["It is too polite", "It does not define the audience, goal, rules, or output format", "It uses too many words", "It asks Hermes to use memory"], correct: 1, explanation: "Hermes can only aim at what you describe. Give audience, goal, tone, constraints, and output shape so the answer is usable." },
      { q: "What should students do with bracketed placeholders like [client name]?", options: ["Leave them blank forever", "Replace them with real details before sending the prompt", "Delete the whole prompt", "Paste API keys there"], correct: 1, explanation: "Prompt templates are reusable because students replace the bracketed fields with the real facts for the current job." },
    ]
  },
  {
    section: 2,
    questions: [
      { q: "What is a context window in plain English?", options: ["A browser decoration", "The assistant's desk space: the information Hermes can work with at once", "A payment screen", "A social media setting"], correct: 1, explanation: "Context is the working space for the current request. Keep it relevant so the important task is not buried under noise." },
      { q: "What happens when you paste too much unrelated material?", options: ["Hermes always gets smarter", "Hermes may miss the real task because important details compete with clutter", "The API key changes", "Schedules stop working"], correct: 1, explanation: "Too much unrelated context makes the task harder to follow. Paste the facts that matter and summarize the rest." },
      { q: "What is the safest context habit?", options: ["Paste every file you own", "Paste the exact goal, important facts, and any rules Hermes must obey", "Never give context", "Only send screenshots"], correct: 1, explanation: "Good context gives Hermes the right facts without stuffing the desk. Exact goal, key facts, and rules are enough for most student tasks." },
    ]
  },
  {
    section: 3,
    questions: [
      { q: "Why do numbered steps help Hermes?", options: ["They make the prompt look technical", "They give Hermes a checklist so fewer parts are skipped", "They hide the task", "They replace memory"], correct: 1, explanation: "Numbered steps make the work easy to track. Hermes can complete each item and respect the approval rule at the end." },
      { q: "Where should the approval rule go?", options: ["Nowhere", "Clearly inside the rules or final step", "Only in a screenshot", "Inside the API key"], correct: 1, explanation: "Approval rules need to be visible in the prompt: do not send, publish, charge, delete, or message externally without approval." },
      { q: "What does delegation mean for a beginner?", options: ["Copying text", "Giving Hermes a clear job and letting it route specialist work when needed", "Writing an email yourself", "Creating a password"], correct: 1, explanation: "Beginners do not need agent architecture. They need to tell Hermes the outcome, rules, and when specialist help is useful." },
    ]
  },
  {
    section: 4,
    questions: [
      { q: "What is memory in the 80M context?", options: ["A type of clothing", "Saved context that lets Hermes remember your brand, rules, preferences, and past decisions across sessions", "A code library", "A type of image file"], correct: 1, explanation: "Memory stores the useful context Hermes should not have to relearn every session: who you are, what you do, what tone you prefer, and what rules should not be broken." },
      { q: "What should a memory prompt include first?", options: ["Random jokes", "Name, timezone, business, current goal, preferred tone, and hard rule", "Only a logo", "Only a password"], correct: 1, explanation: "The first memory pass should make Hermes useful right away: who you are, what you do, where you are, what matters, and what not to do." },
      { q: "What should Hermes do after saving memory?", options: ["Ignore the student", "Repeat what it saved so the student can correct it", "Delete old chats", "Send an email"], correct: 1, explanation: "A confirmation lets students catch wrong assumptions early." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What is the safest beginner version of a reasoning prompt?", options: ["Ask for hidden chain of thought", "Ask Hermes for a short visible plan, final answer, and self-check", "Ask for a random guess", "Tell Hermes to answer faster"], correct: 1, explanation: "For students, the practical pattern is Plan, Answer, Check: a short visible plan, a clean final answer, and a self-check against rules. That improves reliability without asking for hidden model reasoning." },
      { q: "Why does the self-check step matter?", options: ["It makes the answer longer for no reason", "It forces Hermes to compare the answer against your rules before you act", "It changes your API key", "It replaces memory"], correct: 1, explanation: "The self-check step catches boundary problems, missing constraints, and risky actions before the student trusts or uses the output." },
      { q: "What is the Firm Prompt Formula?", options: ["Being rude to the AI", "Role, context, task, rules, and output", "Using all caps", "Writing one-word prompts"], correct: 1, explanation: "Firm prompting means clear instructions, not rude language: role, context, task, rules, and output." },
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
      { q: "What is the plain-English job of Nginx in this course?", options: ["It writes social posts", "It acts like a front desk that sends web visitors to the right app", "It stores passwords", "It replaces Hermes"], correct: 1, explanation: "Nginx is the front desk. It receives website traffic and routes it to the app behind the scenes. Beginners do not need to write the config from scratch; they need to know what it does and when to ask for review." },
      { q: "What should a student do before changing a live Nginx setup?", options: ["Paste random config from the internet", "Ask Hermes/support to review the domain, app address, certificate, and rollback plan", "Turn off HTTPS", "Delete old notes"], correct: 1, explanation: "A live front-door config can break access fast. The safe habit is: make a draft, review it, back up the old version, then change one thing at a time." },
      { q: "What is the Nginx Config Builder for?", options: ["A reviewed support draft", "A magic one-click production fix", "A billing tool", "A TikTok scheduler"], correct: 0, explanation: "The builder creates a draft for Hermes or support to inspect. It is not permission to paste unverified server settings into production." },
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
      { q: "What should students verify about HTTPS?", options: ["That the padlock appears and someone knows who renews the certificate", "That the logo is bigger", "That every page has animations", "That the password is shorter"], correct: 0, explanation: "HTTPS is not just a one-time checkbox. The student should confirm the padlock works, there are no browser warnings, and Cloudflare, the host, or support knows who renews the certificate." },
      { q: "What is the beginner-safe Certbot rule?", options: ["Run certificate commands from memory", "Use Certbot only when the setup actually needs it and Hermes/support confirms the steps", "Ignore browser warnings", "Publish without HTTPS"], correct: 1, explanation: "Certbot can manage HTTPS certificates for some server setups, but beginners should not guess commands on a live server. Ask for a reviewed checklist first." },
    ]
  },
  {
    section: 5,
    questions: [
      { q: "What's the main advantage of a Cloudflare Tunnel?", options: ["Makes server faster", "No router port forwarding needed", "Replaces Nginx", "Free hosting"], correct: 1, explanation: "Cloudflare Tunnel (formerly Argo Tunnel) creates an outbound connection from your server to Cloudflare — no incoming ports need to be opened on your router. The world reaches your server through Cloudflare instead of directly." },
      { q: "What is the connector's job in a tunnel setup?", options: ["Keep a secure bridge open from your app/server to Cloudflare", "Write invoices", "Delete logs", "Choose a logo"], correct: 0, explanation: "The small connector keeps the bridge alive so approved traffic can reach your app without opening your router directly to the world." },
      { q: "What should you protect when using a temporary tunnel link?", options: ["Admin screens, private data, and anything client-facing", "Only the color palette", "Nothing, tunnel links are always private", "Only images"], correct: 0, explanation: "A tunnel can make a local app reachable. Share links only with the right people, protect admin screens, and never treat a temporary URL as automatically private." },
    ]
  },
  {
    section: 6,
    questions: [
      { q: "What are logs in plain English?", options: ["Receipts for visits, blocked requests, missing pages, and errors", "A design gallery", "A payment method", "A model setting"], correct: 0, explanation: "Logs are the receipt book. They help Hermes or support see what happened instead of guessing." },
      { q: "What should a student copy into Hermes when something looks wrong?", options: ["The exact warning or log lines, with private keys removed", "Their API key", "A screenshot of unrelated settings", "Nothing"], correct: 0, explanation: "The safest support habit is to copy the exact warning or log lines, remove secrets, and ask Hermes for a plain-English summary and next step." },
      { q: "Why check logs regularly?", options: ["To spot repeated failed access, broken pages, or unusual traffic early", "To slow the server down", "To make the page prettier", "Logs are not useful"], correct: 0, explanation: "You do not need to understand every code. You need to notice patterns: repeated admin attempts, missing pages, or sudden error spikes." },
    ]
  },
  {
    section: 7,
    questions: [
      { q: "What does scaling mean for a non-coder?", options: ["Buying random tools", "Splitting a proven workflow into repeatable lanes with review gates", "Deleting logs", "Skipping approvals"], correct: 1, explanation: "Scaling means the workflow is clear enough to repeat: gather, summarize, quality-check, and deliver. Hermes can help divide lanes, but humans approve the client-facing result." },
      { q: "When should you scale a workflow?", options: ["Before it works once", "After one simple version works and the workload is too big for one lane", "Only on Fridays", "When you are bored"], correct: 1, explanation: "Do one useful version first. Then split work into smaller repeatable lanes when volume or deadlines demand it." },
      { q: "What is the biggest scaling mistake?", options: ["Reviewing outputs", "Automating public/client actions before rules and approval gates are clear", "Documenting the workflow", "Starting small"], correct: 1, explanation: "Never scale confusion. Write rules, test small, add review gates, and only then repeat the workflow." },
    ]
  },
  {
    section: 8,
    questions: [
      { q: "What is the firewall's plain-English job?", options: ["Lock every door except the ones your real service needs", "Design the website", "Write captions", "Replace HTTPS"], correct: 0, explanation: "The firewall is the door-lock layer. Allow only the traffic your setup truly needs and keep admin access limited." },
      { q: "What is the safest default firewall mindset?", options: ["Start closed, then open only approved doors", "Open everything so testing is easy", "Turn it off after launch", "Let every app choose its own rules"], correct: 0, explanation: "Beginner-safe security starts closed. Then Hermes/support helps confirm which doors are required for HTTPS and approved admin access." },
      { q: "When should a non-coder change firewall rules?", options: ["Only with a clear support-guided plan and rollback path", "Whenever a random tutorial says so", "After guessing port numbers", "Never document changes"], correct: 0, explanation: "Firewall mistakes can lock you out or expose private services. Change one rule at a time with guidance, notes, and a way back." },
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

  const c3PlainEnglishMap = [
    { term: 'Domain', plain: 'The name people type, like app.yourbrand.com.', studentAction: 'Buy it or log in where it is already registered.' },
    { term: 'DNS', plain: 'The address book that points the name to the right place.', studentAction: 'Create or check A, CNAME, and TXT records.' },
    { term: 'Cloudflare Tunnel', plain: 'A secure bridge from the internet to your computer or server.', studentAction: 'Install cloudflared or use the dashboard connector flow.' },
    { term: 'HTTPS', plain: 'The browser padlock that encrypts traffic.', studentAction: 'Use Cloudflare or Certbot so visitors do not see warnings.' },
    { term: 'Firewall', plain: 'The lock that decides what traffic is allowed in.', studentAction: 'Allow only the ports you actually need.' },
    { term: 'Logs', plain: 'The receipt book for every request.', studentAction: 'Ask Hermes to summarize suspicious patterns.' }
  ];

  const c3LinuxSurvivalTree = [
    { branch: 'Where am I?', terms: 'pwd, ls, cd, path, home folder', plain: 'Use this when support needs to know which folder or machine you are looking at.' },
    { branch: 'What is running?', terms: 'process, service, systemd, status, restart', plain: 'Use this when Hermes, Nginx, cloudflared, or another helper may be asleep or broken.' },
    { branch: 'Can people reach it?', terms: 'port, firewall, DNS, tunnel, HTTPS', plain: 'Use this when a browser cannot open the app or visitors see a warning.' },
    { branch: 'What changed?', terms: 'logs, config, backup, rollback, timestamp', plain: 'Use this when something worked yesterday and fails today.' },
    { branch: 'Is it safe?', terms: 'private key, permission, sudo, public IP, admin route', plain: 'Use this before exposing anything outside the machine.' }
  ];

  const c3LinuxTermBlocks = [
    { term: 'pwd', def: 'Print working directory. In plain English: show me what folder the terminal is currently inside.' },
    { term: 'ls', def: 'List files. In plain English: show me what is inside this folder.' },
    { term: 'cd', def: 'Change directory. In plain English: move the terminal into another folder.' },
    { term: 'sudo', def: 'Run as administrator. Use only when support or Hermes explains why admin power is needed.' },
    { term: 'apt', def: 'Ubuntu package installer. In plain English: install or update approved server software.' },
    { term: 'systemd', def: 'Linux service manager. It starts, stops, and checks background services.' },
    { term: 'SSH', def: 'Secure remote login for servers. Beginners should use it only with support guidance.' },
    { term: 'public IP', def: 'The internet-facing address for a server. Treat it like a front-door address, not a password.' }
  ];

  const c3ResourceLinks = [
    { label: 'Cloudflare Dashboard', href: 'https://dash.cloudflare.com/', note: 'Manage DNS, domains, tunnels, access rules, and analytics.' },
    { label: 'Cloudflare Tunnel Docs', href: 'https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/', note: 'Official tunnel overview. Key idea: outbound connection, no inbound port opening.' },
    { label: 'cloudflared Downloads', href: 'https://developers.cloudflare.com/tunnel/downloads/', note: 'Install the lightweight connector that keeps the tunnel alive.' },
    { label: 'Cloudflare DNS Records', href: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/', note: 'Official dashboard steps for creating A, CNAME, and TXT records.' },
    { label: 'Certbot Instructions', href: 'https://certbot.eff.org/', note: 'Official SSL certificate instructions for Nginx, Apache, and common servers.' },
    { label: 'Nginx Docs', href: 'https://nginx.org/en/docs/', note: 'Official reference for reverse proxy behavior and configuration.' },
    { label: 'Ubuntu Firewall Docs', href: 'https://ubuntu.com/server/docs/how-to/security/firewalls/', note: 'Official Ubuntu explanation of UFW and server firewall basics.' },
    { label: 'Ubuntu Command Line for Beginners', href: 'https://ubuntu.com/tutorials/command-line-for-beginners', note: 'Official beginner reference for terminal, folders, paths, and basic commands.' },
    { label: 'Ubuntu OpenSSH Server Docs', href: 'https://ubuntu.com/server/docs/how-to/security/openssh-server/', note: 'Official SSH server reference for support-guided remote access.' },
    { label: 'Ubuntu Server Docs', href: 'https://ubuntu.com/server/docs/', note: 'Official server docs for Linux concepts, services, networking, and security.' },
    { label: 'Namecheap Domain Search', href: 'https://www.namecheap.com/domains/', note: 'Beginner-friendly domain purchase option.' }
  ];

  const c3TutorialLinks = [
    { label: 'DNS Records Explained', href: 'https://www.youtube.com/watch?v=HnUDtycXSNE', note: 'Animated DNS record explainer for students who need visuals first.' },
    { label: 'DNS in 100 Seconds', href: 'https://www.youtube.com/watch?v=UVR9lhUGAyU', note: 'Fast mental model before touching DNS settings.' },
    { label: 'Cloudflare Tunnel Tutorial', href: 'https://www.youtube.com/watch?v=ZvIdFs3M5ic', note: 'Longer beginner walkthrough for Cloudflare Tunnel.' },
    { label: 'Cloudflare Tunnel Homelab', href: 'https://www.youtube.com/watch?v=wyKkeb3w5lI', note: 'Shorter tunnel setup overview.' },
    { label: 'Nginx + LetsEncrypt', href: 'https://www.youtube.com/watch?v=DyXl4c2XN-o', note: 'Reverse proxy plus certificate walkthrough.' },
    { label: 'NGINX SSL Setup', href: 'https://www.youtube.com/watch?v=X3Pr5VATOyA', note: 'Official NGINX video for SSL basics.' },
    { label: 'UFW Firewall Rules', href: 'https://www.youtube.com/watch?v=XtRXm4FFK7Q', note: 'Firewall rule concepts for Ubuntu servers.' },
    { label: 'UFW Quick Server Security', href: 'https://www.youtube.com/watch?v=68GTL7djIMI', note: 'Short practical UFW setup reference.' }
  ];

  const c3HermesPrompts = [
    'Hermes, explain my infrastructure in plain English: domain, DNS, tunnel, HTTPS, firewall, and logs. Then tell me the one safest next step.',
    'Hermes, audit this DNS setup. I will paste records below. Tell me what each record does, what looks risky, and what to verify before changing anything.',
    'Hermes, create a Cloudflare Tunnel setup checklist for a non-coder. Include what I should click, what I should copy, and what I should not expose publicly.',
    'Hermes, review these firewall rules. Tell me which ports are necessary, which are risky, and what I should ask support before changing.',
    'Hermes, translate this Linux error into plain English. Tell me what probably happened, what not to touch, and the safest next command or click.',
    'Hermes, make a backup-and-rollback plan before I change this server setting. Explain how I can undo the change if it breaks.'
  ];

  const c3CompletionOutcomes = [
    'Explain domain, DNS, tunnel, HTTPS, firewall, log, and port without pretending to be a network engineer.',
    'Use a DNS record builder and understand A, CNAME, TXT, and destination values.',
    'Recognize why Cloudflare Tunnel is safer than random port forwarding for many beginner setups.',
    'Ask Hermes for backup, rollback, and risk checks before changing server settings.',
    'Sort Linux terms into the right support bucket: folder, service, reachability, change, or safety.'
  ];

  const c3CompletionDrills = [
    'Build one fake DNS record and explain what each field means.',
    'Run the simulated port scan and identify which open ports deserve review.',
    'Paste one infrastructure warning into Hermes and ask for a plain-English explanation.',
    'Write a rollback plan before changing a tunnel, firewall, or DNS setting.'
  ];

  const c3CompletionProof = [
    'A domain or planned domain is documented.',
    'The current access path is written down: local address, tunnel, proxy, and public hostname.',
    'Firewall intent is clear: which ports are allowed and why.',
    'Hermes has an infrastructure memory note with safety rules.'
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 03</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Safe Remote Access</h2>
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
              "A domain name or a plan to buy one.",
              "Cloudflare account access.",
              "80M Agent Desktop open so Hermes can guide the setup.",
              "A server, mini PC, or hosted machine you want to expose safely.",
              "A hard rule: do not open random ports because a tutorial says so."
            ]}
          />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase text-center">
            Safe <br/><span className="italic text-[#22c55e]">Access.</span>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
            Class 03 is how a private local app becomes reachable without turning your computer into an open door. The student goal is not to become a network engineer. The goal is to know what each layer does and what to ask Hermes before changing it.
          </p>
          <div className="text-center">
            <p className="font-serif text-sm text-[#555] mt-3">
              Keep it simple: lock in DNS, SSL, and firewall first. Scale only after the basics are stable.
            </p>
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Plain-English infrastructure map</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">What each layer means before you touch anything</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c3PlainEnglishMap.map((item) => (
                <div key={item.term} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">{item.term}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.plain}</p>
                  <p className="font-mono text-[11px] text-[#555] mt-3 uppercase tracking-wider">Student action: {item.studentAction}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Linux support tree</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">When support says a Linux word, put it in one of these buckets</h3>
            <div className="space-y-3">
              {c3LinuxSurvivalTree.map((item) => (
                <div key={item.branch} className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.5fr] gap-3 border-[2px] border-[#111] bg-white p-4">
                  <p className="font-sans font-black uppercase text-sm text-[#111]">{item.branch}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#22c55e]">{item.terms}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.plain}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Commands are vocabulary first</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Do not memorize these. Recognize what they mean.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c3LinuxTermBlocks.map((item) => (
                <div key={item.term} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                  <p className="font-mono text-[#22c55e] font-black text-sm mb-2">{item.term}</p>
                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e]">
            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Ask Hermes before changing infra</p>
            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Copy one prompt before you click scary buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c3HermesPrompts.map((prompt, idx) => (
                <div key={prompt} className="border-[2px] border-[#333] bg-[#171717] p-4">
                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">Prompt {idx + 1}</p>
                  <CopyBlock text={prompt} label="Copy Infra Prompt" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h3 className="font-sans font-black uppercase text-sm mb-3">Infrastructure Quick Checklist</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-serif text-[#333] text-sm">
              <li>✓ Domain points to the correct destination.</li>
              <li>✓ Cloudflare Tunnel or proxy path is documented.</li>
              <li>✓ HTTPS works without browser warnings.</li>
              <li>✓ Firewall exposes only required ports.</li>
              <li>✓ Logs are easy to find and summarize.</li>
              <li>✓ Hermes has an infrastructure note saved to memory.</li>
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
              "\"Generate a weekly infrastructure maintenance checklist. Explain every command before I run it.\""
            ]}
          />
          <StudentCompletionKit
            eyebrow="Class 03 final standard"
            title="The student can ask safe infrastructure questions before touching settings"
            outcomes={c3CompletionOutcomes}
            drills={c3CompletionDrills}
            proof={c3CompletionProof}
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
              "A domain name purchased or ready to buy.",
              "The ability to click DNS Settings in your domain dashboard.",
	              "Either your server's public IP address or a Cloudflare Tunnel target, depending on your setup."
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
	                <li>1) Confirm the record points to the destination your provider or support gave you.</li>
	                <li>2) Keep TTL low during setup so changes refresh faster.</li>
	                <li>3) Ask Hermes to verify the DNS record before changing the front-door server settings.</li>
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
	            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="35.186.240.50"
                value={scanIP}
                onChange={(e) => setScanIP(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border-2 border-[#333] text-[#22c55e] font-mono px-4 py-3"
              />
	              <button onClick={runPortScan} className="font-sans font-black uppercase text-sm px-6 py-3 bg-[#22c55e] text-[#111] hover:bg-[#4ade80] transition-colors w-full sm:w-auto">Scan</button>
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
	              "A support-guided server login, or someone technical helping you.",
              "Your domain already pointed at your server IP.",
	              "The local app address support gave you, usually something like http://localhost:3000."
            ]}
          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. Nginx: The Front Desk</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            <GlossaryTooltip term="Nginx" definition="A front-door routing service for web requests" href="#c3-dictionary" /> sits at the front door of your server. In plain English, it receives website traffic and forwards the right request to the right app. Students do not need to write config from scratch; they need to know what it does and ask Hermes/support to review any change before it goes live.
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
	            <h3 className="font-sans font-black uppercase text-sm mb-4">// Advanced Support Draft: Nginx Config Builder</h3>
	            <p className="font-serif text-sm text-[#555] leading-relaxed mb-4">
	              This creates a draft for Hermes or support to review. Do not paste generated server config into production until someone verifies the domain, app address, certificate path, and rollback plan.
	            </p>
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
	              "Your domain or tunnel route working.",
	              "A browser showing the site you want protected.",
	              "Hermes or support ready to confirm whether Cloudflare, Certbot, or your host manages HTTPS."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. The "Green Lock" (SSL/HTTPS)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            If your website address does not start with <code className="text-[#22c55e] font-mono">https://</code>, browsers may warn visitors and private data may travel unprotected. HTTPS is the padlock. Depending on your setup, Cloudflare, your host, or Certbot can manage it.
          </p>
          <div className="bg-white border-[3px] border-[#111] p-8">
            <h4 className="font-sans font-black uppercase text-sm mb-4">The HTTPS Handshake:</h4>
            <p className="font-serif text-lg leading-relaxed text-[#aaa]">
	              HTTPS scrambles traffic between the visitor and the service so people on the same network cannot read it. The beginner action is simple: confirm the padlock appears, confirm there are no browser warnings, and ask Hermes to explain who renews the certificate.
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
	              "Cloudflare access for the domain.",
	              "A local app address or server address support wants to expose safely.",
	              "A rule: no router port forwarding unless support explicitly approves it."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">5. The Secret Tunnel (Cloudflare Tunnel)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            A Cloudflare Tunnel is a safer bridge from the internet to your local app or server. Instead of opening your router to the world, the connector makes an outbound connection to Cloudflare and Cloudflare routes approved traffic back through it.
          </p>
          <div className="bg-[#111] text-[#eae7de] p-8 border-[3px] border-[#22c55e] shadow-[8px_8px_0_0_#22c55e]">
            <p className="font-mono text-xs text-[#aaa] mb-4"># One command. No router config. No port forwarding.</p>
            <p className="font-mono text-[#22c55e]">cloudflared tunnel --url http://localhost:3000</p>
            <p className="font-mono text-xs text-[#555] mt-4">// Output: Try cloudflared-tunnel.trycloudflare.com</p>
	            <p className="font-mono text-xs text-[#555]">// Share only with people who should access the app. Protect admin screens.</p>
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
	              "The access path working: domain, tunnel, or local address.",
	              "A browser open.",
	              "Hermes ready to summarize scary-looking log lines."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Monitoring the Bouncer</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Logs are the receipt book. They show visits, blocked requests, missing pages, and errors. Students do not need to memorize log codes; they need to know where logs live and how to ask Hermes for a summary.
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
	              "One workflow that already works for one user.",
	              "A task that can be split into chunks: research, data entry, QA, outreach drafting, or reporting.",
	              "A clear approval step before results go to clients or customers."
            ]}
          />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">7. Scaling: From One Helper to a Team</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            What happens when one assistant lane cannot keep up? You split the work into lanes, run smaller batches, and review outputs before they become client-facing.
          </p>
          <div className="bg-[#22c55e] p-8 md:p-12 border-[4px] border-[#111] shadow-[12px_12px_0_0_#111]">
            <h3 className="font-sans font-black text-2xl uppercase mb-4 text-[#111]">The "Spin Up" Strategy:</h3>
            <p className="font-serif text-lg leading-relaxed mb-6 text-[#111]">
	              Scaling is not magic. It means the workflow is clear enough to repeat: one lane gathers sources, one lane summarizes, one lane checks quality, and one lane prepares the final report. Hermes can help divide the work, but humans still set the rules and approve the result.
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
	              "A support-guided server login, if this is a real server.",
              "Ubuntu or Debian (most common server OS).",
	              "A list of which services should be reachable: usually HTTPS, plus admin access for approved people only."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">8. The Firewall: Locking the Doors</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
	            UFW (Uncomplicated Firewall) is a common lock for Ubuntu servers. The goal is not to memorize commands. The goal is to know the safety rule: allow only the doors your real service needs, and keep admin access limited.
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
              "The plain-English map from the intro.",
              "Your domain name and login.",
              "Patience. This is the most technical class."
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
	              { term: "Nginx", def: "The front desk. Receives web traffic and forwards it to the right internal app." },
              { term: "Cloudflare Tunnel", def: "A secret tunnel through your router. No port forwarding required." },
	              { term: "Firewall (UFW)", def: "The locks on your server doors. Allow only the doors your real service needs." },
	              { term: "SSH", def: "A secure admin login for servers. Beginners should use it only with support guidance." },
	              { term: "Docker", def: "Optional support vocabulary for sealed software boxes that keep helper services consistent." },
	              { term: "Certbot", def: "A tool that can request and renew free HTTPS certificates when your setup needs it." },
	              { term: "Port", def: "A numbered door for traffic. 443 usually means HTTPS web traffic. Random open ports are risk." },
	              { term: "Service", def: "A background program that runs even when no window is open, such as Nginx or cloudflared." },
	              { term: "systemd", def: "The common Linux service manager. It can show whether a service is running, failed, or restarting." },
	              { term: "sudo", def: "Administrator power. Do not add it to commands unless Hermes or support explains why it is needed." },
	              { term: "Root", def: "Can mean the top folder / or the administrator user. Ask which meaning applies before changing anything." },
	              { term: "Rollback", def: "The undo plan. Before changing server settings, know how to restore the previous working version." }
            ].map((item, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-[#eae7de] p-6 shadow-[6px_6px_0_0_#111]">
                <h4 className="font-sans font-black text-xl uppercase mb-2">{item.term}</h4>
                <p className="font-serif text-[#333]">{item.def}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Section 10: Resource Locker */}
        <div className="mb-24" id="c3-resources">
          <NeedBox
            title="What you need before you start"
            items={[
              "Cloudflare account access.",
              "Your domain registrar login.",
              "Your server or mini PC reachable locally.",
              "Hermes open so you can paste audit prompts before changing settings."
            ]}
          />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. Resource Locker (Infrastructure)</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Class 03 is the most technical, so the locker is split into official references, student tutorial videos, and copy/paste prompts for Hermes.
          </p>
          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Official References + Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {c3ResourceLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">YouTube Tutorials for Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {c3TutorialLinks.map((item) => (
                <a
                  key={item.label}
                  className="block border-[2px] border-[#111] bg-white p-4 hover:bg-[#fffbeb] hover:border-[#f59e0b] transition-colors"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
              <p className="font-sans font-black text-sm uppercase mb-2">Copy/Paste Infra Prompts</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {c3HermesPrompts.map((prompt) => (
                  <CopyBlock key={prompt} text={prompt} label="Copy Infra Prompt" />
                ))}
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#fdfaf6] border-[2px] border-[#111]">
              <p className="font-sans font-black text-sm uppercase mb-2">For future video production</p>
              <p className="font-serif text-sm text-[#333] leading-relaxed">
                Instructor production note: Course 03 infrastructure tutorials are now logged in the internal scrape queue for future original 80M motion explainers.
              </p>
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
      </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />
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
      { q: "What tool helps turn public web pages into research data Hermes can summarize?", options: ["Google Search only", "Firecrawl web crawler", "A private spreadsheet", "Postiz"], correct: 1, explanation: "Firecrawl and similar web crawlers can extract public page content into structured notes for research. Students should use it only on public, allowed sources." },
      { q: "Which outreach method typically has the highest reply rate for cold outreach?", options: ["Mass email blast", "Cold calling", "Personalized DM or email referencing specific details", "LinkedIn connection request"], correct: 2, explanation: "Personalized outreach that references something specific about the prospect (their business, a post they made, a problem they described) dramatically outperforms generic mass outreach." },
      { q: "What makes a lead qualified vs. just a name on a list?", options: ["They have a corporate email domain", "They responded to your first message", "They have a specific problem you can solve and the budget to pay for it", "They follow you on social media"], correct: 2, explanation: "A qualified lead has: (1) a specific pain point you can address, (2) the authority to make a purchasing decision, and (3) the budget to pay for a solution. Everything else is just a name." }
    ],
    5: [
      { q: "What type of work generates the lowest churn in automation clients?", options: ["Creative work like content generation", "High-stakes financial transactions", "B2B annoyance work tied to revenue and operations", "Employee onboarding workflows"], correct: 2, explanation: "B2B annoyance work — cleaning spreadsheets, generating reports, nudging follow-ups — tied to day-to-day revenue and operations has the lowest churn because clients depend on it for their business to run smoothly." },
      { q: "Why does compounding income matter more than one-time fees?", options: ["One-time fees are taxable", "Compounding income grows while you sleep and requires no additional effort", "Clients prefer monthly billing", "One-time fees are illegal for automations"], correct: 1, explanation: "Compounding monthly income means you're getting paid every month for work you already did. After 12 months, a $100/mo maintenance fee has generated more revenue than a $500 one-time setup — and it requires no new effort." },
      { q: "What is the fastest way to validate if an automation idea has market demand?", options: ["Build it and post on Product Hunt", "Search social media for people complaining about the repetitive task, then DM them", "Run a paid survey campaign", "Look at what Zapier workflows are most popular"], correct: 1, explanation: "The fastest validation: find people already complaining about the exact problem online, DM them, show a rough demo video, and ask if they'd pay. Real pain + real people + real willingness = validated idea." }
    ],
    6: [
      { q: "Why do traditional dev teams avoid building micro-SaaS?", options: ["It's technically too complex", "The market is too small to justify the development cost", "They prefer enterprise clients", "It's against SaaS industry regulations"], correct: 1, explanation: "Traditional dev teams often need $50K-$200K to justify a build. A tiny paid tool serving 500 niche customers at $15/mo generates $90K/year — too small for a dev shop but viable for a solo AI-assisted operator." },
      { q: "What signal tells you a micro-SaaS idea has enough market demand to pursue?", options: ["It has been done before", "You have 3+ people sign up for your waitlist within a week of launching the landing page", "It solves your own personal problem", "It has AI in the name"], correct: 1, explanation: "A waitlist with real signups from your target audience within the first week is the strongest signal of demand. If nobody signs up, the idea isn't connecting. If they do, you have immediate user feedback to iterate on." },
      { q: "What is the minimum viable feature set for a micro-SaaS MVP?", options: ["The core feature that solves the one specific problem, nothing more", "User accounts, billing, admin panel, notifications, and advanced integrations", "At least 10 features to justify the price point", "A full desktop app and a mobile app"], correct: 0, explanation: "A micro-SaaS MVP should do ONE thing extremely well. The moment you add a second major feature, you've left the micro-SaaS category and entered the complexity of building a real product. One job, one screen, one outcome." }
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
	    { id: 's0', label: 'Intro + Desktop Map' },
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

	  const c5SafetyRules = [
	    { label: 'Public sources only', detail: 'Use websites, directories, posts, and pages that are publicly available. Do not bypass logins, paywalls, or private spaces.' },
	    { label: 'Permission beats cleverness', detail: 'If a site says no crawling, stop. If a prospect asks not to be contacted, remove them from the list.' },
	    { label: 'Personalize outreach', detail: 'No spam blasts. Hermes should reference one real observation and ask one simple question.' },
	    { label: 'Track consent', detail: 'Keep a notes column for source, date, response, opt-out, and follow-up status.' },
	    { label: 'Sell a result', detail: 'Every offer should say what changes for the client: fewer missed leads, faster reporting, cleaner intake, more booked calls.' },
	    { label: 'Keep humans in control', detail: 'Agents can research, draft, and route work, but pricing, legal, refunds, and sensitive decisions need approval.' }
	  ];

	  const c5MoneyDecisionTree = [
	    { branch: 'I have no audience and need cash soon', move: 'Find one local business pain, build a tiny demo, and sell setup plus maintenance.' },
	    { branch: 'I know a niche very well', move: 'Research public sources, write a lead sheet, and build one specific offer for that niche.' },
	    { branch: 'I already built something useful for myself', move: 'Package it as a template, prompt pack, checklist, or starter kit and sell the shortcut.' },
	    { branch: 'I can see a repeated workflow in a business', move: 'Turn the before/after into an automation demo and price the saved hours.' },
	    { branch: 'I found one repeated tiny software pain', move: 'Launch a waitlist or payment link before building the whole micro-SaaS.' },
	    { branch: 'I am overwhelmed', move: 'Ask Hermes to pick one lane and give you a 7-day action plan with one measurable signal.' }
	  ];

	  const c5BeginnerBusinessTerms = [
	    { term: 'Public data', def: 'Information available without logging in, bypassing gates, or entering private spaces.' },
	    { term: 'Lead', def: 'A possible customer. A lead is not valuable until there is a real pain, contact path, and reason to talk.' },
	    { term: 'Qualified lead', def: 'A possible customer with a visible problem, likely budget, and fit for your offer.' },
	    { term: 'CRM', def: 'A customer tracking list. For beginners, a spreadsheet can be the CRM.' },
	    { term: 'MVP', def: 'Minimum viable product: the smallest useful version that proves the idea is worth continuing.' },
	    { term: 'Opt-out', def: 'A clear way for a person to say no more contact. Respect it immediately.' },
	    { term: 'Builder handoff', def: 'The plain-English spec a developer, agent, or future you can use to build the tool correctly.' },
	    { term: 'Recurring revenue', def: 'Money that repeats monthly because the client keeps getting value after setup.' }
	  ];

	  const c5ResourceLinks = [
	    { label: 'Firecrawl', href: 'https://www.firecrawl.dev/', note: 'Web scraping and crawling platform for turning public pages into LLM-ready data.' },
	    { label: 'Firecrawl Docs', href: 'https://docs.firecrawl.dev/', note: 'Official setup, scrape, crawl, map, and public research documentation.' },
	    { label: 'Firecrawl Scrape Docs', href: 'https://docs.firecrawl.dev/features/scrape', note: 'Official page for scraping a URL into markdown, JSON, links, screenshots, and more.' },
	    { label: 'Firecrawl Crawl Docs', href: 'https://docs.firecrawl.dev/features/crawl', note: 'Official page for crawling multiple pages from a site with limits and options.' },
	    { label: 'n8n Workflows Docs', href: 'https://docs.n8n.io/workflows/', note: 'Official guide to workflows, nodes, executions, debugging, and templates.' },
	    { label: 'n8n Credentials Docs', href: 'https://docs.n8n.io/integrations/builtin/credentials/', note: 'Official guide for safely connecting accounts and private access keys.' },
	    { label: 'n8n Templates', href: 'https://n8n.io/workflows/', note: 'Searchable automation templates students can study before building from scratch.' },
	    { label: 'n8n Level One Course', href: 'https://docs.n8n.io/courses/level-one/', note: 'Official beginner course for people new to visual automation.' },
	    { label: 'Gumroad Features', href: 'https://gumroad.com/features', note: 'Digital product sales, files, memberships, analytics, and creator storefront features.' },
	    { label: 'Gumroad Help Center', href: 'https://gumroad.com/help', note: 'Official setup help for products, payouts, checkout, files, memberships, and safety rules.' },
	    { label: 'Stripe Docs', href: 'https://docs.stripe.com/', note: 'Official billing, checkout, payment links, subscriptions, invoices, and customer portal docs.' },
	    { label: 'Stripe Payment Links', href: 'https://docs.stripe.com/payment-links', note: 'No-code payment links for deposits, validation tests, and simple offers.' },
	    { label: 'Lemon Squeezy Docs', href: 'https://docs.lemonsqueezy.com/help', note: 'Digital product checkout, subscriptions, files, payouts, and merchant-of-record docs.' },
	    { label: 'Make Help Center', href: 'https://help.make.com/', note: 'Beginner support docs for visual automation scenarios, triggers, and app connections.' },
	    { label: 'Supabase Docs', href: 'https://supabase.com/docs', note: 'Advanced builder reference for auth, database, storage, and app data.' },
	    { label: 'Vercel Docs', href: 'https://vercel.com/docs', note: 'Landing page and small app publishing reference.' }
	  ];

	  const c5TutorialLinks = [
	    { label: 'Firecrawl public web research', href: 'https://www.youtube.com/watch?v=phuyYL0L7AA', note: 'Advanced builder walkthrough for extracting public website data with Firecrawl.' },
	    { label: 'Firecrawl + n8n automation', href: 'https://www.youtube.com/watch?v=5nA14JLCWfU', note: 'Advanced automation example connecting Firecrawl with n8n-style workflows.' },
	    { label: 'Firecrawl explained', href: 'https://www.youtube.com/watch?v=eH8JdttKIdA', note: 'High-level overview of AI web data extraction use cases.' },
	    { label: 'n8n from scratch 2026', href: 'https://www.youtube.com/watch?v=Fqeo8q8-nJg', note: 'Beginner n8n automation tutorial.' },
	    { label: 'n8n beginners guide', href: 'https://www.youtube.com/watch?v=Fy1UCBcgF2o', note: 'Non-coder-friendly overview of nodes and workflow logic.' },
	    { label: 'n8n AI agents tutorial', href: 'https://www.youtube.com/watch?v=TKnaDGpN7Ns', note: 'Agent workflow reference for advanced students.' },
	    { label: 'Validate a SaaS idea', href: 'https://www.youtube.com/watch?v=31U9X_XD63c', note: 'MicroConf / Rob Walling validation logic for paid demand.' },
	    { label: 'Validate before you build', href: 'https://www.youtube.com/watch?v=4_MDP6TcHwU', note: 'Fireship-style quick framing for shipping small and testing demand.' }
	  ];

	  const c5HermesPrompts = [
	    'Hermes, help me pick one public-data research target. I want a list of 20 businesses, the source URL for each lead, the likely pain, and one respectful outreach angle. Do not scrape private pages or bypass site rules.',
	    'Hermes, turn this messy website research into a clean lead sheet with columns: business, website, source, observed pain, possible offer, contact path, follow-up status, opt-out notes.',
	    'Hermes, build me a one-page client demo brief for this workflow. Explain the before state, the after state, the time saved, the setup fee, the monthly maintenance, and the exact first demo we should show.',
	    'Hermes, validate this micro-SaaS idea. Tell me the target user, urgent pain, existing alternatives, cheapest MVP, landing-page headline, waitlist test, and what signal means stop.'
	  ];

	  const c5CompletionOutcomes = [
	    'Collect public research without crossing privacy, login, or paywall boundaries.',
	    'Turn messy public research into a clean lead/opportunity table.',
	    'Write a beginner-readable builder handoff for one custom tool or automation.',
	    'Validate a digital product or micro-SaaS idea with a real signal before overbuilding.',
	    'Explain the difference between lead, qualified lead, MVP, CRM, opt-out, and recurring revenue.'
	  ];

	  const c5CompletionDrills = [
	    'Research one public website and save source URLs next to every finding.',
	    'Build a 20-row lead sheet with source, pain, offer, contact path, and opt-out notes.',
	    'Generate one plain-English tool spec for a small business workflow.',
	    'Create one payment-link or waitlist validation prompt before building the product.'
	  ];

	  const c5CompletionProof = [
	    'One source-backed research brief exists.',
	    'One clean lead sheet exists with consent/opt-out tracking columns.',
	    'One offer or demo brief is ready to send to a real prospect.',
	    'Hermes has a rule saved: public sources only, no private scraping, respectful outreach.'
	  ];

	  const toggleSection = (id) => {
    setCompletedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

	  // Interactive generators
	  const generateCrawlConfig = () => {
	    const target = crawlUrl || 'https://example.com';
	    const safeName = target.replace(/[^a-z0-9]/gi,'_');
	    const hermesBrief = `Hermes, research this public website for a client-opportunity brief:
URL: ${target}
Max pages: ${crawlPages}
Preferred output: ${crawlFormat}

Rules:
1. Use public pages only.
2. Respect robots, login walls, and site terms.
3. Save source URLs next to every finding.
4. Extract business model, offers, repeated pain points, contact path, and possible automation opportunities.
5. Return a beginner-readable summary plus a CSV-ready lead/opportunity table.`;

	    const optionalApi = `// Optional builder handoff for Firecrawl
	Tool: Firecrawl
	Action: Crawl public pages only
	URL: ${target}
	Page limit: ${parseInt(crawlPages) || 10}
	Format: ${crawlFormat}
	Private keys stay inside approved setup screens. Do not paste them into public docs.`;

	    setCrawlOutput(`${hermesBrief}

Save research notes to:
80m-research/${safeName}/raw-notes.md
80m-research/${safeName}/lead-table.csv

${optionalApi}`);
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
      output = headers.join(',') + '\n' + lines.map(l => headers.map(() => l).join(',')).join('\n');
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

	## Builder Handoff
	Use this section only if you or a builder are turning the idea into software. Students do not need to memorize these tool names.
	- Customer screen: the page or app the customer uses
	- Data storage: where customer records and settings live
	- Visual styling: how the page looks
	- Hosting: where the tool is published
	- Notifications: SMS, email, Telegram, or another approved channel

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
1-2 days (AI-assisted prototype with a review checklist)
`);
  };

  const generateProductSpec = () => {
    const personas = { developer: 'Technical operators and tool buyers who need a clean starting point', marketer: 'Growth-focused marketers who need templates to move fast', entrepreneur: 'First-time founders who need structure to think clearly', ops: 'Operations leads who want systems before chaos sets in' };
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
    if (wfAutomations.email) parts.push('1. Trigger: Form submission or schedule\n2. Action: Draft email via AI\n3. Action: Send through Gmail, Mailchimp, or your approved email tool');
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
Key n8n blocks: form trigger, Google Sheets, approved web request, Slack, Email
`);
  };

  const generateMsaas = () => {
    const userTypes = { freelancer: 'Freelancers and solo service providers', developer: 'Technical operators and tool buyers', marketer: 'Marketers and content creators', business: 'Small business owners (5-50 employees)' };
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
2. User accounts (email sign-in; your builder can choose the tool)
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
- [ ] AI-assisted MVP demo (1-2 days max)
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
1. **Trigger:** Receives input (email / form / connected app)
2. **Parse:** Extracts relevant information from input
3. **Decide:** Applies rules (e.g., refund under $50 = auto-approve)
4. **Execute:** Takes action (sends email, updates spreadsheet, books calendar)
5. **Report:** Sends summary to human supervisor (CC or Slack)

## System Prompt Snippet
"You are a ${taskType} agent. For every inbound request:
1. Extract the customer's name, account details, and the core request.
2. Check the relevant customer record or approved tool for context.
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
- Incoming message source (email, form, or chat inbox)
- Customer records (spreadsheet, Airtable, CRM, or app database)
- Decision rules written in plain English
- Notification channel (Slack, email, or dashboard)
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
    setKbOutput(`# Create Your Second Brain

## Paste This To Hermes First
Hermes, create a simple second-brain setup for "${project}".
Topics: ${topics}

I am not using command-line tools for this lesson. Walk me through the folder setup in plain English, then help me create:
1. Raw Sources
2. Clean Notes
3. Finished Outputs
4. An Index note that lists what exists

Ask before moving, deleting, or rewriting any existing files.

## Optional Builder Note
If support or a builder needs a plain text instruction file, use this:
\`\`\`markdown
# ${project} Knowledge Base

## What This Is
A personal knowledge base about ${topics}.
Built to stop losing information and start compounding learning.

## How It's Organized
- Raw Sources = unprocessed source material. Never edit these.
- Clean Notes = AI-organized summaries and topic pages.
- Finished Outputs = generated reports and answers.

## Wiki Rules
- Every topic gets its own note in Clean Notes
- Every clean note starts with a 1-paragraph summary
- Link related topics using [[topic-name]]
- Maintain INDEX.md listing all topics
- Never rewrite original Raw Sources

## My Interests
- ${topics.split(',')[0]?.trim() || 'Topic 1'}
- ${topics.split(',')[1]?.trim() || 'Topic 2'}
- ${topics.split(',')[2]?.trim() || 'Topic 3'}
\`\`\`

## Monthly Health Check Prompt
"Review the entire Clean Notes folder. Flag contradictions between articles.
Find topics mentioned but never explained. List claims not backed by
a source in Raw Sources. Suggest 3 new articles to fill gaps."

## Compounding Loop
Every time you add raw sources → ask Hermes to update clean notes → save useful answers
to outputs/ → next question builds on previous answers.
`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate">
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
	            "80M Agent Desktop open with Hermes ready.",
	            "A Firecrawl account or another approved research tool.",
	            "One public website, directory, or niche you are allowed to research.",
	            "A spreadsheet or notes app for lead and opportunity tracking."
	          ]} />
	          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase text-center">
	            Intelligence Pipeline <br/><span className="italic text-[#22c55e]">+ Agent Products.</span>
	          </h1>
	          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
	            Turn public research into paid offers: lead lists, client demos, automations, micro-SaaS tests, and agents that handle repetitive work with clear human approval.
	          </p>
	          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Safe money workflow</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Research first. Respect people. Sell the result.</h3>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	              {c5SafetyRules.map((item) => (
	                <div key={item.label} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
	                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">{item.label}</p>
	                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.detail}</p>
	                </div>
	              ))}
	            </div>
	          </div>
	          <div className="border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Money lane decision tree</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Which path should a beginner take first?</h3>
	            <div className="space-y-3">
	              {c5MoneyDecisionTree.map((item, idx) => (
	                <div key={item.branch} className="grid grid-cols-1 md:grid-cols-[2rem_1fr_1.5fr] gap-3 border-[2px] border-[#111] bg-white p-4">
	                  <p className="font-mono font-black text-[#22c55e]">{idx + 1}</p>
	                  <p className="font-sans font-black uppercase text-sm text-[#111]">{item.branch}</p>
	                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.move}</p>
	                </div>
	              ))}
	            </div>
	          </div>
	          <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e] mb-8">
	            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Business words translated</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Terms that stop non-coders from freezing</h3>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	              {c5BeginnerBusinessTerms.map((item) => (
	                <div key={item.term} className="border-[2px] border-[#333] bg-[#171717] p-4">
	                  <p className="font-sans font-black uppercase text-[#22c55e] mb-1">{item.term}</p>
	                  <p className="font-serif text-sm text-[#ddd] leading-relaxed">{item.def}</p>
	                </div>
	              ))}
	            </div>
	          </div>
	          <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e] mb-8">
	            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Copy these to Hermes</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Prompts that turn research into offers</h3>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	              {c5HermesPrompts.map((prompt, idx) => (
	                <div key={prompt} className="border-[2px] border-[#333] bg-[#171717] p-4">
	                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">Prompt {idx + 1}</p>
	                  <CopyBlock text={prompt} label="Copy Hermes Prompt" />
	                </div>
	              ))}
	            </div>
	          </div>
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
          <StudentCompletionKit
            eyebrow="Class 05 final standard"
            title="The student can turn research into a respectful paid offer"
            outcomes={c5CompletionOutcomes}
            drills={c5CompletionDrills}
            proof={c5CompletionProof}
          />
        </div>

        {/* SECTION 1: Intelligence Pipeline */}
	        <div id="c5-s1" className="mb-24">
	          <SectionMeta minutes="10 min" focus="Hermes + Firecrawl" />
	          <NeedBox title="What you need" items={["80M Agent Desktop open to Hermes", "Firecrawl account or playground", "One public website you are allowed to research"]} />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">1. Intelligence Pipeline: From Chaos to Cash</h2>
	          <p className="font-serif text-xl mb-8 leading-relaxed">
	            Most people guess what their market wants. The intelligence pipeline turns public pages into notes Hermes can read: offers, complaints, pricing, contact paths, repeated questions, and places where a small automation could save real time.
	          </p>
	          <MacWindow title="hermes_research_brief.md" className="mb-8">
	            <div className="p-6 font-mono text-sm space-y-2">
	              <p className="text-[#aaa]">// Step 1: Name the public source</p>
	              <p className="text-[#38bdf8]">Hermes, research https://example.com and save every source URL.</p>
	              <p className="text-[#aaa]">// Step 2: Ask for business signals</p>
	              <p className="text-[#38bdf8]">Find offers, pains, pricing clues, tools used, contact paths, and automation opportunities.</p>
	              <p className="text-[#aaa]">// Step 3: Turn it into a table</p>
	              <p className="text-[#38bdf8]">Return: source, observation, pain, possible offer, next question.</p>
	              <p className="text-[#aaa]">// Output: a research brief a non-coder can read and act on</p>
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
            <button onClick={generateCrawlConfig} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Research Brief</button>
            {crawlOutput && <CopyBlock code={crawlOutput} />}
          </div>

	          <CheckpointCard
	            title="Intelligence Pipeline Checkpoints"
	            items={[
	              { type: 'pass', text: 'You researched a public source and saved source URLs next to the findings' },
	              { type: 'pass', text: 'Hermes returned at least 5 useful observations tied to possible paid outcomes' },
	              { type: 'fail', text: 'You collected data without knowing what offer it supports' },
	              { type: 'fail', text: "You copied private or restricted information instead of staying with public sources" }
	            ]}
	          />
        </div>

        {/* SECTION 2: Customer Acquisition Machine */}
	        <div id="c5-s2" className="mb-24">
	          <SectionMeta minutes="12 min" focus="Lead gen pipeline" />
	          <NeedBox title="What you need" items={["A lead list built from public sources", "A notes column for source and opt-out status", "One outreach message you would be comfortable receiving"]} />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. Customer Acquisition Machine</h2>
	          <p className="font-serif text-xl mb-8 leading-relaxed">
	            The 5-step pipeline: <span className="font-mono text-[#22c55e]">public research → qualify → personalize → ask one clear question → follow up respectfully.</span> This is not spam. It is useful research turned into a specific offer.
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
	              ['2', 'Qualify', 'Keep only leads with a visible pain you can solve'],
              ['3', 'Segment', 'Filter by industry, size, tech stack'],
	              ['4', 'Outreach', 'Personalized email or DM with a respectful opt-out'],
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
	              { type: 'pass', text: 'Every row has a public source, likely pain, and opt-out status' },
	              { type: 'fail', text: 'You scraped random data with no specific customer in mind' },
	              { type: 'fail', text: 'Your outreach message sounds like a mass blast instead of a real note' }
	            ]}
	          />
        </div>

        {/* SECTION 3: Custom Tools for Small Businesses */}
        <div id="c5-s3" className="mb-24">
	          <SectionMeta minutes="10 min" focus="AI-assisted small business tools" />
	          <NeedBox title="What you need" items={["80M Agent Desktop open", "Understanding of ONE small business's workflow pain", "A simple one-page offer or landing page template"]} />
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
	              <p className="text-[#aaa]">Builder handoff: customer screen + data storage + notifications</p>
	              <p className="text-[#aaa]">Prototype time: 1-2 days after the workflow is clear</p>
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
	              { type: 'pass', text: 'You have a plain-English spec ready to hand to Hermes or a builder' },
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
            {['App Starter Kits', 'Business Templates', 'Design Kits', 'Prompt Libraries'].map((type, i) => (
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
                <option value="boilerplate">App Starter Kit</option>
                <option value="template">Notion Template</option>
                <option value="starter-kit">Starter Kit</option>
                <option value="prompt-pack">Prompt Pack</option>
              </select>
              <select value={prodPersona} onChange={e => setProdPersona(e.target.value)} className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm">
                <option value="developer">Technical Operator</option>
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
          <NeedBox title="What you need" items={["80M Agent Desktop ready with Hermes", "A very specific problem (not a broad category)", "Stripe account for payments"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">6. Micro-SaaS: One Job, One Screen, One Outcome</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            Traditional dev teams can't justify building something this niche — that's why <span className="font-mono text-[#22c55e]">you can own the entire market.</span> AI-assisted building cuts months to days. Test many ideas, find what connects.
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
                <option value="developer">Technical Operator</option>
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
	          <NeedBox title="What you need" items={["Provider access through 80M, OpenRouter, or an approved model service", "One repetitive task a business currently pays a human to do", "A plain-English task spec: tools, memory, rules, and instructions"]} />
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
              <p className="text-[#38bdf8]">2. Checks order in Shopify</p>
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
          <NeedBox title="What you need" items={["80M workspace or any folder you can find again", "15+ minutes to dump everything you already know into source notes", "80M Agent Desktop or any assistant that can read your saved files"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. The Second Brain: Personal Knowledge Base</h2>
          <p className="font-serif text-xl mb-8 leading-relaxed">
            You already collect information, you just can't find it when you need it. <span className="font-mono text-[#22c55e]">Source notes + clean notes + finished outputs = a searchable second brain.</span>
          </p>
          <MacWindow title="knowledge-base-map.txt" className="mb-6">
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-[#aaa]">// The simple map:</p>
              <p className="text-[#38bdf8]">Raw Sources — unprocessed articles, notes, screenshots</p>
              <p className="text-[#38bdf8]">Clean Notes — AI-written summaries you can review</p>
              <p className="text-[#38bdf8]">Finished Outputs — AI answers and reports</p>
              <p className="text-[#aaa]">// Index Note — list what exists and where it lives</p>
              <p className="text-[#aaa]">// The loop:</p>
              <p className="text-[#eae7de]">Add source notes → Ask Hermes to update clean notes → Save useful outputs</p>
              <p className="text-[#aaa]">// Monthly health check:</p>
              <p className="text-[#aaa]">"Review Clean Notes. Flag contradictions. Find gaps."</p>
            </div>
          </MacWindow>

          {/* Interactive: Knowledge Base Setup */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Knowledge Base Setup Wizard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input value={kbProject} onChange={e => setKbProject(e.target.value)} placeholder="Project name (e.g. my-ai-knowledge)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
              <input value={kbTopics} onChange={e => setKbTopics(e.target.value)} placeholder="Focus topics (comma-separated)" className="border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <button onClick={generateKnowledgeBase} className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#111] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all">Generate Knowledge Plan</button>
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
              { type: 'pass', text: "Three easy-to-find folders exist and Raw Sources has at least 5 source files in it" },
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
	              "You can turn public web research into a sourced opportunity brief.",
	              "You have a concrete path from skills to income (8 options, ranked by difficulty).",
	              "You have a working micro-SaaS or automation idea with a waitlist.",
	              "You can build and sell an AI agent that handles a repetitive workflow with approval rules.",
	              "Your personal knowledge base is running and compounding."
	            ].map((outcome, i) => (
              <div key={i} className="border-[3px] border-[#111] bg-white p-5 shadow-[4px_4px_0_0_#111]">
                <span className="font-mono text-[#22c55e] font-black text-lg">✓</span>
                <p className="font-serif text-[#aaa] text-sm mt-2 leading-snug">{outcome}</p>
              </div>
            ))}
          </div>

	          <div id="c5-resources" className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Class 05 Resource Locker</h3>
	            <p className="font-serif text-[#333] leading-relaxed mb-6">
	              Use the first grid to do the work. Use the second grid to learn the tools without assuming you already know automation vocabulary.
	            </p>

	            <h4 className="font-sans font-black text-lg uppercase tracking-tight mb-4">Official References + Tools</h4>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
	              {c5ResourceLinks.map((item) => (
	                <a
	                  key={item.label}
	                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
	                  href={item.href}
	                  target="_blank"
	                  rel="noreferrer"
	                >
	                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
	                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
	                </a>
	              ))}
	            </div>

	            <h4 className="font-sans font-black text-lg uppercase tracking-tight mb-4">YouTube Tutorials for Students</h4>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
	              {c5TutorialLinks.map((item) => (
	                <a
	                  key={item.label}
	                  className="block border-[2px] border-[#111] bg-white p-4 hover:bg-[#fffbeb] hover:border-[#f59e0b] transition-colors"
	                  href={item.href}
	                  target="_blank"
	                  rel="noreferrer"
	                >
	                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
	                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
	                </a>
	              ))}
	            </div>

	            <div className="mt-6 p-4 bg-[#fffbeb] border-[2px] border-[#f59e0b]">
	              <p className="font-sans font-black text-sm uppercase mb-2">Hermes Prompts</p>
	              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	                {c5HermesPrompts.map((prompt) => (
	                  <CopyBlock key={prompt} text={prompt} label="Copy Money Prompt" />
	                ))}
	              </div>
	            </div>

	            <div className="mt-6 p-4 bg-[#fdfaf6] border-[2px] border-[#111]">
	              <p className="font-sans font-black text-sm uppercase mb-2">For future video production</p>
	              <p className="font-serif text-sm text-[#333] leading-relaxed">
	                Instructor production note: Course 05 Firecrawl, n8n, validation, digital-product, and agent-product tutorials are logged in the internal scrape queue for original 80M motion explainers.
	              </p>
	            </div>
	          </div>

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
                try { localStorage.setItem('80m-c5-quizzes', JSON.stringify(updated)); } catch (_e) {}
                return updated;
              });
              setQuizDone({ section: quizSection, score, total, passed });
              setTimeout(() => setQuizDone(null), 5000);
            }}
          />
        )}

      </div>{/* close max-w-4xl */}
      </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />
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
    { id: 's2', label: '2. Demo-to-Money' },
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

	  const c6OperatingRules = [
	    { label: 'Pick one lane', detail: 'The course shows eight models so students can choose, not so they try all eight at once.' },
	    { label: 'Validate before build', detail: 'A paid problem, a response, a waitlist, or a booked call matters more than a clever idea.' },
	    { label: 'Use demos, not hype', detail: 'A two-minute working demo builds more trust than a giant pitch deck.' },
	    { label: 'Keep scope fixed', detail: 'Every paid offer needs one result, one timeline, one price, and written boundaries.' },
	    { label: 'Review automation', detail: 'Client work, payments, publishing, refunds, and sensitive messages need human approval until the workflow is proven.' },
	    { label: 'Measure weekly', detail: 'Track outreach sent, replies, demos, close rate, time saved, revenue, churn, and next experiment.' }
	  ];

	  const c6RevenuePickerTree = [
	    { condition: 'Need money this month and have no audience', lane: 'Small business websites or one simple automation', action: 'Talk to 10 local businesses, find one manual pain, and show a tiny demo.' },
	    { condition: 'Have a warm network', lane: 'Productized consulting', action: 'Offer one fixed outcome with a clear timeline, price, and review gate.' },
	    { condition: 'Have reusable prompts, templates, or internal systems', lane: 'Templates and prompt packs', action: 'Package one shortcut, sell it cheaply, and improve from buyer questions.' },
	    { condition: 'Have one repeated workflow with visible ROI', lane: 'Paid automation', action: 'Calculate hours saved, build the demo, and charge setup plus maintenance.' },
	    { condition: 'Have patience and a narrow software pain', lane: 'Micro-SaaS', action: 'Validate with a waitlist or payment link before building full features.' },
	    { condition: 'Like documenting work publicly', lane: 'Build-in-public', action: 'Post progress, lessons, demos, numbers, and honest blockers for 30 days.' }
	  ];

	  const c6BusinessGlossary = [
	    { term: 'MRR', def: 'Monthly recurring revenue. Money expected to repeat every month.' },
	    { term: 'Churn', def: 'Customers canceling. Low churn means the product or service keeps mattering.' },
	    { term: 'Scope', def: 'What is included and excluded in the job. Clear scope prevents endless extra work.' },
	    { term: 'Deposit', def: 'Money paid upfront before work begins. It confirms the client is serious.' },
	    { term: 'Deliverable', def: 'The finished thing the client receives: website, workflow, dashboard, report, or agent setup.' },
	    { term: 'Case study', def: 'A short before/after story with proof, result, and lesson learned.' },
	    { term: 'Validation', def: 'Evidence that real people care: replies, calls, waitlist signups, deposits, or purchases.' },
	    { term: 'Review gate', def: 'A required human checkpoint before publishing, sending, charging, deleting, or changing client systems.' }
	  ];

	  const c6ResourceLinks = [
	    { label: '80M Agent Desktop Releases', href: 'https://github.com/guapdad4000/80m-agent-desktop-v3/releases/', note: 'Install or update the customer desktop app before using Hermes for the business playbook.' },
	    { label: 'Postiz', href: 'https://postiz.com/', note: 'Social scheduler, draft queue, analytics, approved publishing, and agent-friendly workflows.' },
	    { label: 'Postiz Docs', href: 'https://docs.postiz.com/introduction', note: 'Official setup documentation for channels, drafts, scheduling, and integrations.' },
	    { label: 'n8n Docs', href: 'https://docs.n8n.io/', note: 'Official visual automation docs for nodes, workflows, credentials, and executions.' },
	    { label: 'n8n Credentials Docs', href: 'https://docs.n8n.io/integrations/builtin/credentials/', note: 'Official guide for connecting accounts and keeping private credentials controlled.' },
	    { label: 'n8n Templates', href: 'https://n8n.io/workflows/', note: 'Workflow examples for lead routing, reporting, CRM updates, email, and internal ops.' },
	    { label: 'Stripe Payment Links', href: 'https://docs.stripe.com/payment-links', note: 'No-code payment links for quick paid validation, deposits, and simple offers.' },
	    { label: 'Stripe Billing', href: 'https://docs.stripe.com/billing', note: 'Subscriptions, invoices, customer portal, and recurring revenue setup.' },
	    { label: 'Gumroad Features', href: 'https://gumroad.com/features', note: 'Sell templates, guides, packs, memberships, and files without building checkout.' },
	    { label: 'Lemon Squeezy Docs', href: 'https://docs.lemonsqueezy.com/', note: 'Alternative merchant of record and software/product checkout docs.' },
	    { label: 'Indie Hackers', href: 'https://www.indiehackers.com/', note: 'Community for solo founders, product ideas, revenue examples, and launch stories.' },
	    { label: 'Product Hunt Launch Guide', href: 'https://www.producthunt.com/launch', note: 'Launch checklist and public product discovery channel.' },
	    { label: 'Make Help Center', href: 'https://help.make.com/', note: 'Visual automation help center for scenario planning and app connections.' },
	    { label: 'FTC Endorsement Guides', href: 'https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews', note: 'Disclosure and advertising guidance for creators, affiliates, and testimonial claims.' }
	  ];

	  const c6TutorialLinks = [
	    { label: 'n8n from scratch 2026', href: 'https://www.youtube.com/watch?v=Fqeo8q8-nJg', note: 'Beginner automation workflow tutorial.' },
	    { label: 'n8n beginners guide', href: 'https://www.youtube.com/watch?v=Fy1UCBcgF2o', note: 'Plain-English nodes, triggers, actions, and workflow flow.' },
	    { label: 'n8n AI agents tutorial', href: 'https://www.youtube.com/watch?v=TKnaDGpN7Ns', note: 'Advanced agent automation reference.' },
	    { label: 'Validate a SaaS idea', href: 'https://www.youtube.com/watch?v=31U9X_XD63c', note: 'Rob Walling validation logic for paid software ideas.' },
	    { label: 'Micro-SaaS build story', href: 'https://www.youtube.com/watch?v=NvtsM8Nk72c', note: 'Starter Story reference for small, specific paid products.' },
	    { label: 'Micro-SaaS ideas and validation', href: 'https://www.youtube.com/watch?v=ndqX4vbR7Rc', note: 'Greg Isenberg-style niche software opportunity framing.' },
	    { label: 'Validate before you build', href: 'https://www.youtube.com/watch?v=4_MDP6TcHwU', note: 'Short builder validation framing.' },
	    { label: 'Postiz + n8n automation', href: 'https://www.youtube.com/watch?v=c50u3K3xsCI', note: 'Scheduler automation reference; use through draft/review guardrails.' }
	  ];

	  const c6HermesPrompts = [
	    'Hermes, interview me and choose one revenue model from this course. Consider my skills, network, cash needs, confidence, and available time. Return one recommendation and a 7-day action plan.',
	    'Hermes, turn this vague business idea into a validation sprint. Give me the target customer, where to find them, 5 research DMs, a demo outline, price test, and stop/go criteria.',
	    'Hermes, write a fixed-scope client offer. Include the problem, promised outcome, deliverables, timeline, price, what is excluded, review gates, and next step.',
	    'Hermes, build my weekly business scoreboard. Track outreach, replies, demos, payments, revenue, hours saved, content posted, and the one experiment for next week.'
	  ];

	  const c6CompletionOutcomes = [
	    'Choose one revenue lane based on cash need, network, skill comfort, and timeline.',
	    'Write a fixed-scope offer with deliverables, price, timeline, exclusions, and review gates.',
	    'Run a 72-hour demo-to-money sprint without hiding in planning mode.',
	    'Use payment links, subscriptions, or simple checkout only after the offer is clear.',
	    'Track weekly business numbers: outreach, replies, demos, revenue, churn, and next experiment.'
	  ];

	  const c6CompletionDrills = [
	    'Use the revenue selector and ask Hermes to defend the recommended lane.',
	    'Write one outreach DM for a real niche and one follow-up that is not pushy.',
	    'Build one demo deck showing pain, solution, deliverable, price, and offer.',
	    'Create a weekly scoreboard and schedule a Friday review.'
	  ];

	  const c6CompletionProof = [
	    'One revenue lane is selected and written down.',
	    'One fixed-scope offer exists.',
	    'Five real research/outreach messages are drafted or sent.',
	    'A weekly scoreboard prompt is saved to Hermes.'
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
      recommendation = 'Model 7 (AI Agent Replacement) — Your automation skills command premium pricing.';
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
// Beginner action: paste public URLs into Firecrawl, or ask Hermes
// to walk you through the Firecrawl screen one click at a time.

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
    const userTypes = { freelancer: 'Freelancers and solo service providers', developer: 'Technical operators and tool buyers', marketer: 'Marketers and content creators', business: 'Small business owners (5-50 employees)' };
    const names = ['Desk', 'Flow', 'Prep', 'Core', 'Stack', 'Base', 'Path', 'Kit', 'Dock', 'Beam'];
    const name = names[Math.floor(Math.random() * names.length)];
    setMsaasOutput(`# Micro-SaaS: ${problem.split(' ').slice(0, 4).join(' ')}...

## PHASE 1: VALIDATION (Week 1)
1. Ask agent: "Build me a landing page for [tool idea]. MVP described below.
   Include a 'Join Waitlist' button. Publish it on any simple landing page host."
2. Share link in 3-5 communities:
   - r/SideProject, r/Entrepreneur, r/[your-niche]
   - Relevant Discord servers
   - Twitter/X with relevant hashtags
3. Track waitlist signups. <5 in a week = wrong idea.

## PHASE 2: MVP BUILD (Week 2-3)
4. Once waitlist hits 10+ emails, build the actual tool
5. Ask agent: "Build a tiny first version of [tool name]: [core feature list].
   Include email sign-in, payment, and one customer screen. Explain every tool choice in plain English before using it."
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
	 Monthly cost to run: $[provider/tool costs + maintenance].
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

	// STEP 1: STORE THE PRIVATE ACCESS KEY
	"Here's my private Postiz access key: ${postizApiKey || '[YOUR_PRIVATE_KEY]'}
	 Store it for [Project Name]. Use it only according to the rules below."

// STEP 2: IMAGE GENERATION SYSTEM
"Using Google AI Studio or Gemini image generation, we're going to
 make draft TikTok slideshow image sets for [Project Name].
 3 images per post: HOOK, EXPAND, RESOLUTION.

 HOOK: What are we talking about and why should they care?
 EXPAND: The main piece of information or insight
 RESOLUTION: Emotional pull + potential CTA

 Start with [YOUR NICHE]. Create 3 variations of each slide.
 Return everything as drafts for review."

// STEP 3: POSTING RULES
"Every post we send via Postiz must follow these rules:
 1. Create drafts first. Do not publish without approval.
 2. Audio, music, and rights are checked during review.
 3. Max 5 hashtags per post. Must be trending + relevant.
 4. Captions: <1000 chars, natural tone, no spam.
 5. Posting schedule: [X times/day at X times]
 6. Each post = exactly 3 images. If not, flag and skip.
 7. Title = relevant, created per post based on caption.
 8. Verify claims, links, disclosures, and platform fit."

// STEP 4: REVIEW RHYTHM
"Set reminders:
 1. Daily draft review before publishing windows
 2. Weekly analytics review every Monday
 3. Monthly stockpile refresh
 4. If a draft fails review, explain why and improve the next batch."
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
      { q: "Why should you test an agent for 2 weeks with real data before selling it?", options: ["To impress the client", "To discover every edge case before a paying client does", "It's required by law", "To lower your provider costs"], correct: 1, explanation: "Edge cases are where agents fail. Bad addresses, missing fields, ambiguous inputs — you need to discover every failure mode before your client's reputation is on the line." },
      { q: "If a business pays $5,000/mo for a customer support rep, what is a fair price for an AI agent replacement?", options: ["$5,000/mo", "$500-$1,000/mo", "$100/mo", "Free with ads"], correct: 1, explanation: "At 1/5 to 1/8 of the salary replaced, $500-$1,000/mo is the sweet spot. The ROI is obvious to the client (8-10x savings) and profitable for you (low cost to run)." }
    ],
    8: [
      { q: "What is the biggest differentiator in productized consulting vs. hourly consulting?", options: ["Lower price", "Fixed outcome, fixed price, fixed timeline — no scope creep", "Faster delivery", "More features"], correct: 1, explanation: "Productized consulting eliminates scope creep by fixing the deliverable, price, and timeline upfront. The client knows exactly what they get. You know exactly what you're building." },
      { q: "Why does speed create trust in consulting?", options: ["Clients are impatient", "Underpromising on timeline and overdelivering on speed creates delighted clients who weren't expecting it", "Speed is irrelevant", "Fast delivery means lower quality"], correct: 1, explanation: "When a client expects 4 weeks and you deliver in 3 days, their trust explodes. You've not only met expectations — you've shattered them. That client becomes your evangelist." }
	    ],
	    9: [
	      { q: "What is the safest first Postiz workflow in this course?", options: ["Publish everything immediately", "Create drafts, review them, then approve only what is accurate and on-brand", "Skip captions", "Give everyone the login"], correct: 1, explanation: "Draft-first gives you a review gate. Hermes can prepare posts, but a person should approve claims, links, disclosures, timing, and brand fit before anything goes public." },
	      { q: "What is the purpose of a 3-day account learning period before scaling content?", options: ["It's not necessary", "It helps you learn the niche, save references, understand platform norms, and build a review rhythm", "To build followers first", "To test your phone battery"], correct: 1, explanation: "The point is not magic. It is operational discipline: learn what fits, save examples, draft carefully, and avoid rushing into volume before you understand the account." }
	    ],
	    10: [
	      { q: "PMF stands for:", options: ["Profit Margin Formula", "Product-Market Fit", "Paid Marketing Funnel", "Personal Monthly Fee"], correct: 1, explanation: "PMF = Product-Market Fit. It's the point where your product actually solves a real problem that real customers will pay for. Without PMF, you have a solution looking for a problem." },
	      { q: "What is the main account risk in social media automation?", options: ["Posting too much without review", "Using a scheduler responsibly", "Writing short captions", "Posting in the morning"], correct: 0, explanation: "The main risk is rushing volume without review: weak claims, poor disclosures, off-brand content, platform-rule issues, and bad quality control." }
	    ]
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate">
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
	            "80M Agent Desktop open with Hermes ready",
	            "One small demo, skill, prompt pack, website, automation, or idea from the earlier classes",
	            "A spreadsheet or notes app for tracking leads, tests, and revenue",
	            "The willingness to treat this like a business, not a hobby"
	          ]} />
          <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase text-center">
            The Full System <br/><span className="italic text-[#22c55e]">+ AI Business Playbook.</span>
          </h1>
	          <p className="font-serif text-xl md:text-2xl text-[#aaa] leading-relaxed text-center max-w-2xl mx-auto border-b-4 border-[#111] pb-12 mb-12">
	            The capstone. You built the stack. Now make it print. Eight proven revenue models for AI-assisted builders, from small business websites to micro-SaaS to productized consulting.
	          </p>
	          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// How to not get lost</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">This is a business operating system, not a buffet</h3>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	              {c6OperatingRules.map((item) => (
	                <div key={item.label} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
	                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">{item.label}</p>
	                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.detail}</p>
	                </div>
	              ))}
	            </div>
	          </div>
	          <div className="border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Revenue picker tree</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Start with the lane that matches your situation</h3>
	            <div className="space-y-3">
	              {c6RevenuePickerTree.map((item, idx) => (
	                <div key={item.condition} className="grid grid-cols-1 md:grid-cols-[2rem_1.2fr_1fr_1.4fr] gap-3 border-[2px] border-[#111] bg-white p-4">
	                  <p className="font-mono font-black text-[#22c55e]">{idx + 1}</p>
	                  <p className="font-sans font-black uppercase text-sm text-[#111]">{item.condition}</p>
	                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#22c55e]">{item.lane}</p>
	                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.action}</p>
	                </div>
	              ))}
	            </div>
	          </div>
	          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Business dictionary</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Money words in plain English</h3>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	              {c6BusinessGlossary.map((item) => (
	                <div key={item.term} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
	                  <p className="font-sans font-black uppercase text-[#111] mb-1">{item.term}</p>
	                  <p className="font-serif text-sm text-[#333] leading-relaxed">{item.def}</p>
	                </div>
	              ))}
	            </div>
	          </div>
	          <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e] mb-8">
	            <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Start here with Hermes</p>
	            <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Copy the prompt that matches your next move</h3>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	              {c6HermesPrompts.map((prompt, idx) => (
	                <div key={prompt} className="border-[2px] border-[#333] bg-[#171717] p-4">
	                  <p className="font-sans font-black uppercase text-[#22c55e] mb-2">Prompt {idx + 1}</p>
	                  <CopyBlock text={prompt} label="Copy Business Prompt" />
	                </div>
	              ))}
	            </div>
	          </div>
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
          <StudentCompletionKit
            eyebrow="Class 06 final standard"
            title="The student leaves with one lane, one offer, and one weekly scoreboard"
            outcomes={c6CompletionOutcomes}
            drills={c6CompletionDrills}
            proof={c6CompletionProof}
          />
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
              { num: 5, name: 'Micro-SaaS', diff: 'MEDIUM', desc: 'One job, one screen, one outcome. $5-25/mo. AI-assisted prototype in days.' },
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

        {/* SECTION 2: Demo-to-Money Pipeline */}
        <div id="c6-s2" className="mb-24">
          <SectionMeta minutes="10 min" focus="Execution Velocity" />
          <NeedBox title="What you need" items={["Access to X, Reddit, or LinkedIn (for finding complaints)", "Your 80m agent ready to build on demand", "3 hours of focused work time"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">2. The Demo-to-Money Pipeline — 72-Hour Sprint</h2>
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
	          <NeedBox title="What you need" items={["n8n, Make, or Zapier access", "Your agent with approved access to relevant tools", "At least one identified repetitive workflow from research"]} />
          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">4. Paid Workflow Automations — The Compound Machine</h2>
          <div className="border-[3px] border-[#22c55e] bg-[#111] p-6 mb-6 shadow-[6px_6px_0_0_#22c55e]">
            <p className="font-serif text-[#eae7de] text-xl leading-relaxed font-bold mb-2">
              You're not selling automation.
            </p>
            <p className="font-serif text-[#aaa] text-lg leading-relaxed">
              You're selling hours back. B2B annoyance work is a goldmine: cleaning spreadsheets, generating reports, nudging follow-ups.
            </p>
          </div>
	          <MacWindow title="automation_template.txt" className="mb-8">
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
	          <NeedBox title="What you need" items={["Stripe account set up", "Simple landing page hosting", "Your agent ready to build fast"]} />
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
	                  <option value="developer">Technical Operators</option>
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
	          <NeedBox title="What you need" items={["Deep understanding of one specific repetitive business task", "Provider access through 80M, OpenRouter, or an approved model service", "At least 2 weeks of testing with real data before selling"]} />
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
	          <NeedBox title="What you need" items={["Postiz account or another approved scheduler", "Google AI Studio or Gemini image generation access", "A brand/content checklist", "A TikTok or social account you own and will review responsibly"]} />
	          <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">9. Postiz + Agent Stack — The Automated Marketing Engine</h2>
	          <p className="font-serif text-xl mb-6 leading-relaxed">
	            This section integrates everything: Hermes prepares the content system, Postiz organizes the drafts, and you approve what goes live. The business value is consistency with review, not blind volume.
	          </p>
          <div className="border-[3px] border-[#111] bg-[#111] p-6 mb-6">
            <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-3">// The Stack Wiring</p>
            <div className="space-y-2">
	              {[
	                ['Hermes / 80M Desktop', 'The coordinator — research, prompts, captions, checklists, and draft briefs'],
	                ['Gemini Image Generation', 'Creates draft 3-image sets per post: hook, expand, resolution'],
		                ['Postiz Access', 'Creates and organizes drafts, schedules, previews, and analytics'],
	                ['Human Review', 'Approves claims, disclosures, links, timing, audio, and final publish decision']
	              ].map(([tool, role]) => (
                <div key={tool} className="flex items-center gap-4 py-2 border-b border-[#333] last:border-0">
                  <span className="font-mono font-bold text-[#22c55e] w-48 shrink-0">{tool}</span>
                  <span className="font-serif text-[#aaa] text-sm">{role}</span>
                </div>
              ))}
            </div>
          </div>
	          <div className="bg-[#fffbeb] border-[3px] border-[#111] p-5 mb-6 shadow-[6px_6px_0_0_#111]">
	            <p className="font-mono text-[#92400e] text-xs font-bold uppercase mb-2">// Critical Review Boundary</p>
	            <p className="font-serif text-[#92400e] leading-relaxed">Do not let automation publish business content without approval. Review claims, disclosures, links, captions, visuals, and timing before anything goes live.</p>
	          </div>

          {/* Interactive: Postiz Setup */}
          <div className="border-[3px] border-[#22c55e] bg-white p-6 shadow-[6px_6px_0_0_#22c55e] mb-6">
            <h3 className="font-sans font-black text-lg uppercase mb-4">Postiz + Agent Setup</h3>
            <div className="flex flex-wrap gap-2 mb-4">
	              {[
		                { label: 'Step 1: Store Private Key', done: postizStep >= 1 },
	                { label: 'Step 2: Image Generation', done: postizStep >= 2 },
	                { label: 'Step 3: Posting Rules', done: postizStep >= 3 },
	                { label: 'Step 4: Review Rhythm', done: postizStep >= 4 }
	              ].map((item, i) => (
                <button key={i} onClick={() => setPostizStep(i + 1)} className={`font-mono text-xs font-bold px-3 py-2 border-[2px] ${item.done ? 'bg-[#22c55e] text-[#111] border-[#111]' : 'bg-white text-[#555] border-[#ddd]'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="space-y-3 mb-4">
              <input value={postizApiKey} onChange={e => setPostizApiKey(e.target.value)} placeholder="Postiz private access key (paste to your agent)" className="w-full border-[2px] border-[#111] px-4 py-2 font-mono text-sm" />
            </div>
            <div className="border-[3px] border-[#111] bg-[#111] p-5">
              <p className="font-mono text-[#22c55e] text-xs font-bold uppercase mb-2">// Setup Script</p>
              <CopyBlock code={generatePostizSetup()} />
            </div>
          </div>

          {/* Image Stockpile Method */}
          <div className="bg-[#111] border-[3px] border-[#333] p-6 mb-6">
	            <p className="font-mono text-[#38bdf8] text-xs font-bold uppercase mb-3">// Draft Stockpile Method</p>
	            <p className="font-serif text-[#eae7de] leading-relaxed">
	              3 posts/day x 9 images/day = 1 week of draft material in one sitting. Tell Hermes: "Create 3 variations of each slide (HOOK, EXPAND, RESOLUTION) for [YOUR NICHE]. Return a review checklist with every draft."
	            </p>
          </div>

          <CheckpointCard
	            title="Section 9 Checkpoints"
	            items={[
	              { type: 'pass', text: 'Postiz connected to Hermes, first 3-image set generated, and review rules attached to the draft' },
	              { type: 'fail', text: 'Trying to scale publishing before you can review one draft correctly' }
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
	                { term: 'Draft-First Social Media', def: 'Your AI agent prepares ideas, visuals, captions, and schedules, then a person reviews before publishing.' },
	                { term: 'Account Risk', def: 'The risk that rushed volume, weak claims, missing disclosures, or poor review hurts the account or brand.' },
	                { term: 'Recurring Revenue', def: 'Monthly payments that compound over time. The foundation of a real business.' },
	                { term: 'Lifetime Deal', def: 'One-time payment for lifetime access. Good for early momentum, bad for long-term revenue.' },
	                { term: 'Review Gate', def: 'A written approval checkpoint before sensitive actions like publishing, billing, refunds, client messages, or data changes.' }
	              ].map(item => (
                <div key={item.term} className="border border-[#ddd] p-4">
                  <h4 className="font-mono font-black text-[#22c55e] text-sm mb-1">{item.term}</h4>
                  <p className="font-serif text-[#555] text-sm leading-snug">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

	          <div id="c6-resources" className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Class 06 Resource Locker</h3>
	            <p className="font-serif text-[#333] leading-relaxed mb-6">
	              Keep these close while students pick a revenue model. The links are split into official tools/docs, tutorials, and copyable Hermes prompts.
	            </p>

	            <h4 className="font-sans font-black text-lg uppercase tracking-tight mb-4">Official References + Tools</h4>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
	              {c6ResourceLinks.map((item) => (
	                <a
	                  key={item.label}
	                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
	                  href={item.href}
	                  target="_blank"
	                  rel="noreferrer"
	                >
	                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
	                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
	                </a>
	              ))}
	            </div>

	            <h4 className="font-sans font-black text-lg uppercase tracking-tight mb-4">YouTube Tutorials for Students</h4>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
	              {c6TutorialLinks.map((item) => (
	                <a
	                  key={item.label}
	                  className="block border-[2px] border-[#111] bg-white p-4 hover:bg-[#fffbeb] hover:border-[#f59e0b] transition-colors"
	                  href={item.href}
	                  target="_blank"
	                  rel="noreferrer"
	                >
	                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
	                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
	                </a>
	              ))}
	            </div>

	            <div className="mt-6 p-4 bg-[#fffbeb] border-[2px] border-[#f59e0b]">
	              <p className="font-sans font-black text-sm uppercase mb-2">Hermes Prompts</p>
	              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	                {c6HermesPrompts.map((prompt) => (
	                  <CopyBlock key={prompt} text={prompt} label="Copy Capstone Prompt" />
	                ))}
	              </div>
	            </div>
	          </div>

          <CheckpointCard
            title="Section 10 Checkpoints"
	            items={[
	              { type: 'pass', text: 'You can define PMF, Account Risk, Micro-SaaS, Review Gate, and Productized Consulting in your own words' },
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
	            <pre className="font-mono text-[#22c55e] text-xs leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full overflow-x-auto">{`
╔══════════════════════════════════════════════════════════╗
║             CLASS 06 — MISSION COMPLETE                   ║
║                                                          ║
║  You have:                                               ║
║  ✓ Learned 8 revenue models for AI-assisted builders    ║
║  ✓ Built a 72-hour demo-to-money pipeline               ║
║  ✓ Mastered small business client acquisition            ║
║  ✓ Understood paid automation and micro-SaaS           ║
║  ✓ Built a content flywheel with build-in-public        ║
║  ✓ Positioned AI agents as labor replacement            ║
║  ✓ Learned productized consulting sales                ║
	║  ✓ Wired your 80m stack into a reviewed marketing       ║
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
	              "Your 80m stack is wired into a draft-first, reviewed marketing workflow.",
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
	                { day: 'THIS WEEK', task: 'Set up Postiz with your agent and review your first image set' },
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

	          <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
	            <h3 className="font-sans font-black text-xl uppercase tracking-tight mb-4">Final Resource Pack</h3>
	            <p className="font-serif text-[#333] leading-relaxed mb-6">
	              Same links as the Class 06 locker, repeated here so students do not have to scroll back after graduation.
	            </p>
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
	              {c6ResourceLinks.slice(0, 8).map((item) => (
	                <a
	                  key={item.label}
	                  className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
	                  href={item.href}
	                  target="_blank"
	                  rel="noreferrer"
	                >
	                  <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
	                  <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
	                </a>
	              ))}
	            </div>
	            <div className="p-4 bg-[#fdfaf6] border-[2px] border-[#111]">
	              <p className="font-sans font-black text-sm uppercase mb-2">For future video production</p>
	              <p className="font-serif text-sm text-[#333] leading-relaxed">
	                Instructor production note: Course 06 n8n, validation, micro-SaaS, Postiz, payment, and business-model tutorials are logged in the internal scrape queue for original 80M motion explainers.
	              </p>
	            </div>
	          </div>

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
                try { localStorage.setItem('80m-c6-quizzes', JSON.stringify(updated)); } catch (_e) {}
                return updated;
              });
              setQuizDone({ section: quizSection, score, total, passed });
              setTimeout(() => setQuizDone(null), 5000);
            }}
          />
        )}

      </div>{/* close max-w-4xl */}
      </div>{/* close flex-1 overflow-y-auto */}
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />
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

  const desktopSourceFacts = [
    "Current 80M Agent Desktop README describes the app as the native command center for chat, profiles, memory, tools, schedules, Kanban, and gateway automations.",
    "First-run setup checks for the local runtime, installs missing dependencies, asks for provider/model setup, saves config locally, and launches the workspace.",
    "Chat is powered by a local Hermes service behind the desktop app. Students do not need to edit it; they just need to know the app can show progress, markdown, token usage, and cost data.",
    "The current app exposes Chat, Sessions, Agents, Skills, Models, Memory, Soul, Tools, Schedules, Kanban, Gateway, and Settings screens.",
    "Supported provider paths include OpenRouter, Anthropic, OpenAI, Google Gemini, xAI, Qwen, MiniMax, Hugging Face, Groq, and local OpenAI-compatible endpoints.",
    "Current Hermes v0.12 desktop work prefers Runs/event streaming when available, then falls back safely when older chat support is the only option."
  ];

  const desktopDownloads = [
    { label: '80M Agent Desktop Releases', href: 'https://github.com/guapdad4000/80m-agent-desktop-v3/releases/', note: 'Download the customer app for Windows, macOS, or Linux.' },
    { label: 'OpenRouter Keys', href: 'https://openrouter.ai/settings/keys', note: 'Recommended beginner provider. Use a small credit limit.' },
    { label: 'OpenAI API Keys', href: 'https://platform.openai.com/api-keys', note: 'Direct OpenAI provider setup; treat keys like private paid access cards.' },
    { label: 'Anthropic Console', href: 'https://console.anthropic.com/', note: 'Direct Claude provider setup.' },
    { label: 'Docker Desktop', href: 'https://docs.docker.com/get-started/introduction/get-docker-desktop/', note: 'Optional support tool if a setup flow asks for containers.' },
    { label: 'Ubuntu Command Line for Beginners', href: 'https://ubuntu.com/tutorials/command-line-for-beginners', note: 'Optional Linux command vocabulary for support-guided troubleshooting.' },
    { label: 'Discord Download', href: 'https://discord.com/download', note: 'Support/community channel.' }
  ];

  const desktopTutorials = [
    { label: 'AI agents clearly explained', href: 'https://www.youtube.com/watch?v=FwOTs4UxQS4', note: 'Use this to understand the difference between a chatbot and an agent before using Hermes.' },
    { label: 'No-code AI agent overview', href: 'https://www.youtube.com/watch?v=EH5jx5qPabU', note: 'Market-context video. Students should map the ideas back to the 80M desktop app.' },
    { label: 'OpenRouter API key setup', href: 'https://www.youtube.com/watch?v=VvJvJ0uXiVQ', note: 'Good beginner walkthrough for the recommended provider key.' },
    { label: 'OpenAI API key quick tutorial', href: 'https://www.youtube.com/watch?v=Lj43aSwNpog', note: 'Short walkthrough if the student uses OpenAI directly.' },
    { label: 'Claude API key quick tutorial', href: 'https://www.youtube.com/watch?v=vgncj7MJbVU', note: 'Short walkthrough if the student uses Anthropic/Claude directly.' }
  ];

  const desktopScreenTour = [
    { screen: 'Chat', job: 'Talk to Hermes, see streaming answers, and watch tool progress.', action: 'Send a setup audit prompt and read the final PASS/FAIL summary.' },
    { screen: 'Sessions', job: 'Search old conversations and resume unfinished work.', action: 'Search for your first setup chat and ask Hermes what decisions were made.' },
    { screen: 'Agents', job: 'Switch or create separate Hermes profiles for different work contexts.', action: 'Keep one main profile until you understand what should be isolated.' },
    { screen: 'Skills', job: 'Browse, install, and manage reusable workflows.', action: 'Install only one skill at a time, then test it with a small task.' },
    { screen: 'Models', job: 'Choose saved model/provider configurations.', action: 'Start with OpenRouter or your chosen provider default before experimenting.' },
    { screen: 'Memory', job: 'View and edit what Hermes remembers about you.', action: 'Save name, timezone, business, current goal, and hard rules.' },
    { screen: 'Soul', job: 'Tune the assistant personality and boundaries.', action: 'Set concise, honest, approval-first behavior.' },
    { screen: 'Tools', job: 'Enable or disable capabilities such as web, files, command-window rescue, memory, vision, image gen, skills, and delegation.', action: 'Leave defaults alone unless Hermes or support tells you what to change.' },
    { screen: 'Schedules', job: 'Create recurring work with delivery targets.', action: 'Draft a weekday morning brief with approval gates.' },
    { screen: 'Kanban', job: 'Track multi-agent work, blockers, comments, and run history.', action: 'Create one board task for your first workspace setup.' },
    { screen: 'Gateway', job: 'Connect messaging platforms such as Discord, Telegram, Slack, email, SMS, webhooks, and Home Assistant.', action: 'Do this after memory and rules are clean, not before.' },
    { screen: 'Settings', job: 'Manage provider config, credentials, backup/import, logs, network, and theme.', action: 'Know where it lives before something breaks.' }
  ];

  const desktopFirstWeekPlan = [
    { day: 'Day 1', focus: 'Install + first chat', action: 'Download the app, add provider key, send setup audit, and save the first memory note.' },
    { day: 'Day 2', focus: 'Memory + sessions', action: 'Teach Hermes your profile, then search yesterday\'s session and confirm it can summarize decisions.' },
    { day: 'Day 3', focus: 'Skills', action: 'Pick one skill, ask what access it needs, install only if the permissions make sense, then test one small task.' },
    { day: 'Day 4', focus: 'Schedules', action: 'Create a private morning brief schedule with no external messages or account changes.' },
    { day: 'Day 5', focus: 'Tasks + Kanban', action: 'Turn one real project into tracked tasks with blockers, review rhythm, and owner notes.' },
    { day: 'Day 6', focus: 'Gateway safety', action: 'Review rules for Discord, email, Slack, SMS, or webhooks. Test one harmless message only.' },
    { day: 'Day 7', focus: 'Backup + review', action: 'Ask Hermes what is saved, what is connected, what is risky, and what to back up before scaling.' }
  ];

  const desktopHealthTerms = [
    { term: 'Provider', def: 'The AI account Hermes calls for model answers, such as OpenRouter, OpenAI, Anthropic, or Gemini.' },
    { term: 'Model', def: 'The specific brain selected under a provider. Beginners should start with the recommended default.' },
    { term: 'Gateway', def: 'The bridge between Hermes and outside apps like Discord, email, Slack, SMS, or webhooks.' },
    { term: 'Run', def: 'One tracked task Hermes performs. Newer Hermes paths can stream run events and progress.' },
    { term: 'Session', def: 'One conversation thread. Sessions help you find old decisions instead of losing them in chat history.' },
    { term: 'Skill', def: 'A reusable ability package, like YouTube summaries, Stripe billing, Notion sync, or Obsidian notes.' },
    { term: 'Tool', def: 'A capability Hermes can use during a task, such as web, files, memory, vision, or schedules.' },
    { term: 'Backup', def: 'A saved copy of settings, memory, or workspace data so you can recover if something changes.' },
    { term: 'Log', def: 'A timestamped record of what happened. Logs are for support and troubleshooting, not for panic-reading.' },
    { term: 'Credential', def: 'A private key or login token. Treat it like paid access and never post it in screenshots or public chats.' }
  ];

  const desktopConversationModes = [
    { mode: 'Setup audit', prompt: 'Hermes, audit my 80M Agent Desktop setup. Explain every warning in plain English and give me the safest next click.' },
    { mode: 'Memory dump', prompt: 'Hermes, save this to memory: my name is [name], my timezone is [timezone], my work is [work], my main goal is [goal], and my hard rule is [rule].' },
    { mode: 'Daily brief', prompt: 'Hermes, give me a daily brief with top priorities, calendar risk, waiting-on items, and one recommended first action.' },
    { mode: 'Follow-up manager', prompt: 'Hermes, build a follow-up tracker for my clients. Never send messages externally without my approval.' },
    { mode: 'Skill install', prompt: 'Hermes, I want to install the [skill name] skill. Explain what it does, what access it needs, and how to test it safely.' },
    { mode: 'Long task', prompt: 'Hermes, turn this outcome into a Kanban task. Break it into steps, assign the right agent lane, and flag blockers before work starts.' },
    { mode: 'Session recall', prompt: 'Hermes, search my sessions for [topic]. Summarize what we decided and what still needs action.' },
    { mode: 'Schedule builder', prompt: 'Hermes, create a safe weekday morning schedule that prepares my brief but does not message anyone externally.' }
  ];

  const c7CompletionOutcomes = [
    'Open the 80M desktop app and explain what Chat, Sessions, Memory, Skills, Tools, Schedules, Kanban, Gateway, and Settings do.',
    'Create a useful first memory profile and verify what Hermes saved.',
    'Install or evaluate one skill safely by asking what access it needs and how to test it.',
    'Create a private recurring schedule before connecting any outside messaging channel.',
    'Use troubleshooting prompts instead of guessing settings when something looks broken.'
  ];

  const c7CompletionDrills = [
    'Send the setup audit prompt and copy the PASS/FAIL summary.',
    'Create a memory dump, then start a new session and ask Hermes what it remembers.',
    'Use the schedule builder for a private daily brief with approval rules.',
    'Pick one real-world app example and customize the prompt for the student\'s life.'
  ];

  const c7CompletionProof = [
    'Memory profile saved and verified.',
    'One session recall works.',
    'One safe schedule is drafted or active.',
    'One workspace template or real-world prompt has been copied into Hermes.'
  ];

  // Interactive state: Orb Explorer
  const [selectedOrb, setSelectedOrb] = useState(null);
  const orbs = [
    { id: 'o1', name: 'Prawnius', role: 'Quick Tasks & One-Offs', desc: 'Fast, no-frills agent for quick commands. "Hey, convert this PDF to text." "What\'s 15% of 240?" Prawnius handles it without fanfare.', best: 'Quick lookups, math, one-liner tasks, when you just need an answer fast.', icon: '⚡' },
    { id: 'o2', name: 'Sir Clawthchilds', role: 'Finances & Budgets', desc: 'The money specialist. Tracks expenses, builds budgets, analyzes spending patterns, generates financial reports. Sir Clawthchilds thinks in spreadsheets.', best: 'Expense logging, budget breakdowns, financial summaries, invoice tracking, cash flow analysis.', icon: '💰' },
    { id: 'o3', name: 'Claudnelius', role: 'App Repair & Technical Help', desc: 'The specialist for app repair, setup errors, and technical translation. Most clients use it by asking, "explain this error and tell me the safest next step."', best: 'Explaining errors, reviewing setup, fixing app/tool issues, and translating technical instructions into plain English.', icon: '🔧' },
    { id: 'o4', name: 'Knowledge Knaight', role: 'Memory & Facts', desc: 'The keeper of your long-term memory. Handles knowledge bases, facts, research, and saved notes. Ask Knowledge Knaight anything about what you\'ve discussed before.', best: 'Research, fact-checking, knowledge base queries, session history, "we talked about this before" moments.', icon: '🧠' },
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
    { name: 'godot-liquid-toolbar', desc: 'Advanced game-project toolkit — skip unless you are actively making a game or support tells you to use it.', installPrompt: 'I want to install the godot-liquid-toolbar skill. Explain what it does in plain English and tell me whether I actually need it.' },
    { name: 'github', desc: 'Advanced project-file management — useful only if you already use GitHub or support gives you a repo link.', installPrompt: 'I want to install the github skill. Explain what GitHub access means, what is safe to connect, and what actions require my approval.' },
    { name: 'email', desc: 'Email automation — draft emails, categorize inbox, set up rules, and manage correspondence through Hermes.', installPrompt: 'I want to install the email skill. Walk me through connecting my email and what automations are possible.' },
    { name: 'calendar', desc: 'Calendar integration — sync with Google Calendar, Apple Calendar, or Cal.com. Let Hermes manage your schedule.', installPrompt: 'I want to install the calendar skill. Walk me through connecting my calendar app.' },
    { name: 'custom', desc: 'Build your own skill — any workflow you do repeatedly can become a skill. Tell Hermes what you want and it helps you build it.', installPrompt: 'I want to build a custom skill for [describe your workflow]. How do we set this up?' },
  ];

  // Interactive state: Cron Builder
  const [cronTrigger, setCronTrigger] = useState('daily-morning-brief');
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
    { name: 'GitHub', desc: 'PR merged? Hermes notifies you. Issue opened? Hermes logs it. CI failing? Hermes drafts a fix plan for review. Your dev workflow gets a calmer control panel.', setup: 'Connect your GitHub account via OAuth. Tell Hermes which repos to watch and what actions require approval.' },
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
	      title: 'Schedule Setup',
      desc: 'Set up recurring tasks that run automatically on a schedule.',
      prompt: `hermes: set up these recurring tasks:
1. Every weekday at 8am: give me a morning brief — weather, my top 3 tasks today, anything urgent
	2. Every Friday at 4pm: generate my weekly wrap-up and save it to memory
3. Every Monday at 9am: review my todo list and flag anything overdue
	Reply with the plain-English schedule plan, approval rules, and what I should verify before turning it on.`,
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
	      title: 'Gateway Setup',
	      desc: 'Connect an external app to Hermes through a reviewed gateway.',
	      prompt: `hermes: I want to connect [app name] to my agent.
	Walk me through the safest setup path step by step.
	Tell me what access is needed, what actions require my approval, and how to test with one harmless message first.`,
    },
  ];

  // Interactive state: 15 Real-World Apps
  const [selectedApp, setSelectedApp] = useState(null);
  const realWorldApps = [
    { id: 1, person: 'Mike the Plumber', problem: 'Bad website, misses follow-up calls', prompt: "Track my jobs: customer name, address, what I fixed, when I followed up. Remind me to call 3 days after every job.", output: 'Job log + automated follow-up schedule', bonus: 'Build a customer portal where clients can see job history and request service.' },
    { id: 2, person: 'Sarah the Bookkeeper', problem: 'Solo shop, no accountant, receipts everywhere', prompt: "Every time I send you a photo of a receipt, categorize it and add to my expense log. Monthly summary on the 1st.", output: 'Receipt → categorized expense log + monthly report', bonus: 'Connect to Stripe to auto-log all transactions.' },
    { id: 3, person: 'Carlos the Electrician', problem: 'Forgets to invoice, cash flow suffer', prompt: "After every job, add it to my invoice tracker with hours and materials. Generate a draft invoice every Friday.", output: 'Job → invoice draft every Friday', bonus: 'Send invoices via email automatically with Stripe payment links.' },
    { id: 4, person: 'Streamer Dave', problem: 'Lives on Discord, loses good moments', prompt: "When I send you a clip URL, summarize it and crosspost a tweet thread.", output: 'Clip URL → Twitter thread', bonus: 'Auto-clip highlights from VOD timestamps.' },
    { id: 5, person: 'Producer Marcus', problem: 'Forgets which beat went to which client', prompt: "Log every beat I make: name, key, bpm, client if sold. Show me my catalog on demand.", output: 'Beat catalog with search', bonus: 'Add sample clearance tracking and licensing reminders.' },
    { id: 6, person: 'Office Manager Jennifer', problem: 'Meeting notes go nowhere', prompt: "Forward meeting notes to me. Extract action items and assign owners and due dates.", output: 'Notes → tasks with owners and deadlines', bonus: 'Sync to Notion with a weekly review schedule.' },
    { id: 7, person: 'Ice Cream Shop Gina', problem: 'Just wants to post, not think', prompt: "Every time I send you a photo of an ice cream, give me an Instagram caption and 5 hashtags.", output: 'Photo → caption + hashtags', bonus: 'Set up a daily content schedule that pre-generates 7 days of captions.' },
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
	    { id: 's4', label: '5. Memory' },
    { id: 's5', label: '6. Skills' },
	    { id: 's6', label: '7. Schedules' },
    { id: 's7', label: '8. Sessions & Tasks' },
	    { id: 's8', label: '9. Gateways' },
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
	Save this to memory.
Reply: "Memory updated — I know you now."`;
    setMemoryOutput(output);
  };

  const handleCronBuild = () => {
    const tmpl = cronTemplates[cronTrigger];
    if (!tmpl) return;
	    const output = `hermes: set up this recurring schedule for me:
Schedule: ${tmpl.desc}
Task: Every ${tmpl.desc.toLowerCase()}, ${tmpl.task}
What to do: ${cronTask === 'brief' ? 'Give me a structured brief with the key info I need.' : cronTask === 'content' ? 'Generate content ideas and copy relevant to my niche.' : cronTask === 'finance' ? 'Run a financial summary — income, expenses, and cash flow.' : 'Review my tasks, flag overdue items, and suggest priorities.'}
Approval rule: prepare the output privately first. Do not message customers, post publicly, or change accounts unless I approve.
Reply with the plain-English schedule and include the advanced cron pattern (${tmpl.expr}) only as a reference.`;
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
      className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col isolate"
    >
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 07</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">80M Agent Desktop</h2>
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
            <SectionMeta title="S0: Intro — Talk to Hermes from the Desktop App" sectionNum="00" />

            <MacWindow title="Welcome to Class 07" className="mb-8">
              <div className="space-y-6">
                <h3 className="font-serif text-4xl font-black text-[#111] leading-tight">You are not learning code. You are learning how to brief Hermes.</h3>
                <p className="font-sans text-lg text-[#ddd] leading-relaxed">
                  This class is built from the current 80M Agent Desktop repo. The app is the native command center for your local 80M workspace: chat, profiles, memory, tools, schedules, Kanban, and gateway automations.
                </p>
                <p className="font-sans text-lg text-[#ddd] leading-relaxed">
                  The whole promise is simple: open the desktop app, talk to Hermes in plain English, and make it remember your world before you automate anything risky.
                </p>
                <p className="font-sans text-lg text-[#ddd] leading-relaxed">
                  If a student can text a smart assistant, they can use 80M. The course teaches what to say, what to check, when to use each screen, and how to stay safe with memory, schedules, tools, and external messaging.
                </p>
              </div>
            </MacWindow>

            <div id="c7-downloads" className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Download links</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Everything needed to start talking to Hermes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {desktopDownloads.map((item) => (
                  <a
                    key={item.label}
                    className="block border-[2px] border-[#111] bg-[#fdfaf6] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                    <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Beginner video references</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Watch these before the first Hermes session</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {desktopTutorials.map((item) => (
                  <a
                    key={item.label}
                    className="block border-[2px] border-[#111] bg-[#fffbeb] p-4 hover:bg-[#f0fdf4] hover:border-[#22c55e] transition-colors"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="font-sans font-black uppercase text-[#111]">{item.label}</span>
                    <span className="block font-serif text-sm text-[#555] leading-relaxed mt-1">{item.note}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Current desktop repo research</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">What the app actually includes right now</h3>
              <ul className="font-serif text-[#333] space-y-3">
                {desktopSourceFacts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3">
                    <span className="text-[#22c55e] font-black mt-0.5">›</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Screen map</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">The desktop app in plain English</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {desktopScreenTour.map((item) => (
                  <div key={item.screen} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#22c55e] mb-2">{item.screen}</p>
                    <p className="font-serif text-sm text-[#333] leading-relaxed mb-3">{item.job}</p>
                    <p className="font-sans text-sm font-black uppercase text-[#111]">First action: <span className="font-serif normal-case font-normal text-[#555]">{item.action}</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-[3px] border-[#111] bg-[#fdfaf6] p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// First week checklist</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Use the desktop app in this order</h3>
              <div className="space-y-3">
                {desktopFirstWeekPlan.map((item) => (
                  <div key={item.day} className="grid grid-cols-1 md:grid-cols-[5rem_1fr_1.6fr] gap-3 border-[2px] border-[#111] bg-white p-4">
                    <p className="font-mono font-black text-[#22c55e]">{item.day}</p>
                    <p className="font-sans font-black uppercase text-sm text-[#111]">{item.focus}</p>
                    <p className="font-serif text-sm text-[#333] leading-relaxed">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111] mb-8">
              <p className="font-mono text-xs uppercase tracking-widest text-[#555] mb-2">// Hermes health translation</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">Words you may see in setup warnings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {desktopHealthTerms.map((item) => (
                  <div key={item.term} className="border-[2px] border-[#111] bg-[#fdfaf6] p-4">
                    <p className="font-sans font-black uppercase text-[#111] mb-1">{item.term}</p>
                    <p className="font-serif text-sm text-[#333] leading-relaxed">{item.def}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-[3px] border-[#111] bg-[#111] text-[#eae7de] p-6 md:p-8 shadow-[8px_8px_0_0_#22c55e] mb-8">
              <p className="font-mono text-[#22c55e] text-xs uppercase tracking-widest mb-2">// Conversation ladder</p>
              <h3 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-5">The 8 ways beginners should talk to Hermes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {desktopConversationModes.map((item) => (
                  <div key={item.mode} className="border-[2px] border-[#333] bg-[#171717] p-4">
                    <h4 className="font-sans font-black uppercase text-[#22c55e] mb-2">{item.mode}</h4>
                    <CopyBlock text={item.prompt} label="Copy Prompt" />
                  </div>
                ))}
              </div>
            </div>

            <StudentCompletionKit
              eyebrow="Class 07 final standard"
              title="The student can run the desktop app without learning code"
              outcomes={c7CompletionOutcomes}
              drills={c7CompletionDrills}
              proof={c7CompletionProof}
            />

            {/* Stats panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
	                { label: 'Screens', value: '12', sub: 'Desktop controls' },
                { label: 'Memory', value: 'Forever', sub: 'Persistent recall' },
                { label: 'Toolsets', value: '14', sub: 'Usable abilities' },
                { label: 'Gateways', value: '16', sub: 'External channels' },
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
                  ['First launch', 'Download, choose a provider, paste a private key, and verify chat'],
                  ['Chat with Hermes', 'Ask for outcomes, not tools, and read streaming/tool progress'],
                  ['Memory', 'Teach Hermes who you are, then verify what it remembers'],
                  ['Skills and tools', 'Add one capability at a time and test it safely'],
                  ['Schedules and Kanban', 'Turn recurring work and long tasks into visible systems'],
                  ['Gateway safety', 'Connect outside apps only after rules and approval gates are set'],
                  ['Real-world templates', 'Copy-paste setups for 15 different jobs'],
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
              <p className="font-serif text-lg text-[#333] italic mb-4">Before we dig in, open 80M Agent Desktop and send Hermes this:</p>
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
	                Quiz 1: Desktop Basics →
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
  HERMES (your main assistant)
   ↕ routes
  SPECIALISTS (money, content, research, setup help)
   ↕ remembers
  MEMORY (your profile, rules, goals, decisions)
   ↕ repeats
  SCHEDULES (daily brief, follow-ups, weekly review)
   ↕ extends
  SKILLS (extra workflows you approve)
	                `}</pre>
	                <div className="mt-4 text-[#888] text-xs">
	                  YOU talk to HERMES → HERMES routes work → memory keeps context → schedules repeat safe work → skills add approved abilities
	                </div>
	              </div>
	            </MacWindow>

	            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Specialist Explorer — Click Each Lane</h3>
	            <p className="font-sans text-[#555] mb-6">Each lane is a specialist Hermes can route work to. Beginners can still talk only to Hermes; Hermes decides when a specialist helps.</p>

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
	                Quiz 1: Desktop Basics →
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

            {/* Firm Prompting vs Vague */}
            <MacWindow title="Firm Prompting vs Vague Prompting" className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border-[2px] border-red-300 p-4">
                  <p className="font-mono text-xs font-black uppercase text-red-600 mb-2">❌ Vague</p>
                  <p className="font-mono text-sm text-[#aaa] italic">"can you maybe help me with my budget?"</p>
                  <p className="font-sans text-xs text-[#555] mt-2">Result: generic advice, no action taken</p>
                </div>
                <div className="bg-green-50 border-[2px] border-green-400 p-4">
                  <p className="font-mono text-xs font-black uppercase text-green-700 mb-2">✓ Firm Prompt</p>
                  <p className="font-mono text-sm text-[#aaa]">"I earn $4,200/mo. My fixed expenses are $2,800. Give me a budget breakdown with categories, tell me what to cut, and save this to memory."</p>
	                  <p className="font-sans text-xs text-[#555] mt-2">Result: specific plan, saved to memory, actionable</p>
                </div>
              </div>
            </MacWindow>

	            <div className="bg-[#fffbeb] border-[3px] border-[#f59e0b] p-6 mb-6">
	              <p className="font-sans font-black text-sm uppercase mb-2 text-[#92400e]">Pro tip: Plan, Answer, Check</p>
	              <p className="font-sans text-[#aaa]">For complex questions, ask Hermes for a short visible plan, the answer, and a self-check against your rules. Example: "Should I hire a VA or do this myself? Give me: 1. short plan, 2. recommendation, 3. check against my hourly rate, task complexity, and time constraints."</p>
	            </div>

            <div className="flex justify-end mb-8">
              <button
                onClick={() => { toggleSection('s2'); setQuizSection(2); setQuizActive(true); }}
                className="font-sans font-black text-sm uppercase px-6 py-3 bg-[#22c55e] text-[#111] border-[2px] border-[#22c55e] hover:bg-[#111] hover:text-[#22c55e] transition-all"
              >
                Quiz 2: Real-World Apps →
              </button>
            </div>
          </div>

	          {/* ===== S4: MEMORY ===== */}
	          <div id="s4" className="mb-24">
	            <SectionMeta title="S5: Memory — Your Second Brain" sectionNum="05" />

            <MacWindow title="Hermes doesn't forget. Ever. That's the whole point." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
	                  Memory is the long-term context layer. This is not the temporary chat scroll that disappears from your attention. It is the useful context Hermes can recall later: your business, rules, preferences, decisions, and current goals.
                </p>
                <div className="bg-[#111] p-4">
                  <p className="font-mono text-xs font-black uppercase text-[#22c55e] mb-2">Memory Pipeline</p>
                  <div className="flex items-center gap-2 text-[#eae7de] font-mono text-sm flex-wrap">
                    <span className="bg-[#333] px-2 py-0.5 rounded">YOU</span>
                    <span>→</span>
                    <span className="bg-[#333] px-2 py-0.5 rounded">HERMES</span>
                    <span>→</span>
	                    <span className="bg-[#22c55e] text-[#111] px-2 py-0.5 rounded">Long-term recall</span>
                  </div>
                </div>
                <p className="font-sans text-[#aaa]">
	                  The memory tool is what makes this work. When you say "save this to memory," Hermes stores the important context and can use it in future sessions.
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
              <p className="font-sans text-sm text-[#555]">Hermes will pull the relevant session or memory and give you the answer. No more losing important decisions to the scroll.</p>
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
	            <SectionMeta title="S6: Skills — Reusable Workflows" sectionNum="06" />

            <MacWindow title="Skills are like browser extensions for your brain." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
                  Skills extend what Hermes can do. Think of them as downloadable ability packs. Install one, and Hermes gains a new tool.
                </p>
                <p className="font-sans text-[#aaa] leading-relaxed">
	                  Some skills need a private access key and a brief. No coding. No configuration files. You tell Hermes what you want, it sets it up.
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

	          {/* ===== S6: SCHEDULES ===== */}
		          <div id="s6" className="mb-24">
		            <SectionMeta title="S7: Schedules — Recurring Helpers" sectionNum="07" />

            <MacWindow title="Set it once. Let it run. Forget about it. Get results." className="mb-8">
              <div className="space-y-4">
                <p className="font-sans text-[#aaa] leading-relaxed">
		                  A schedule is a recurring helper. You tell Hermes what should happen and when it should happen, then the system prepares that task on repeat until you change it.
                </p>
                <div className="bg-[#111] p-4 font-mono text-sm overflow-x-auto">
	                  <div className="text-[#888] mb-2">Advanced schedule patterns:</div>
                  <div className="text-[#22c55e] space-y-1">
                    <div><span className="text-[#888]">0 8 * * 1-5</span>    → every weekday at 8am: morning brief</div>
                    <div><span className="text-[#888]">30 21 * * *</span>   → every day at 9:30pm: evening wrap-up</div>
                    <div><span className="text-[#888]">0 9 1 * *</span>     → 1st of every month: finance audit</div>
                    <div><span className="text-[#888]">0 17 * * 5</span>    → every Friday at 5pm: weekly review</div>
                  </div>
                </div>
	                <p className="font-mono text-xs text-[#555]">Advanced note: cron syntax is minute | hour | day | month | weekday. Beginners can ask Hermes to translate it into normal language.</p>
              </div>
            </MacWindow>

	            <h3 className="font-serif text-3xl font-black text-[#111] mb-4">Schedule Builder</h3>
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
	                Build Schedule Prompt
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
	                Quiz 5: Schedules →
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
	                  <p className="font-sans text-[#aaa]">Structured todos that Hermes tracks. You create them in plain English, Hermes reminds you, and overdue items get flagged automatically.</p>
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

	          {/* ===== S8: GATEWAYS & INTEGRATIONS ===== */}
          <div id="s8" className="mb-24">
	            <SectionMeta title="S9: Gateways & Integrations" sectionNum="09" />

	            <MacWindow title="Gateways are how outside apps talk to Hermes." className="mb-8">
              <div className="bg-[#111] p-4 font-mono text-sm mb-4">
                <div className="flex items-center justify-center gap-3 text-[#eae7de] flex-wrap">
                  <span className="bg-[#333] px-2 py-1 rounded">Discord</span>
                  <span className="text-[#22c55e]">→</span>
	                  <span className="bg-[#333] px-2 py-1 rounded">gateway</span>
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
	                      hermes: I want to connect {int.name} to my agent. What is the safest setup path, and what should require my approval?
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
	                  output: 'Job log + automated follow-up schedule', bonus: 'Customer portal for job history.',
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
	                  output: 'Notes → tasks with owners and deadlines', bonus: 'Sync to Notion with a weekly review schedule.',
                },
                {
                  id: 7, person: 'Ice Cream Shop Gina', color: '#f472b6', problem: 'Just wants to post, not think',
                  icon: '🍦', prompt: "Every time I send you a photo of an ice cream, give me an Instagram caption and 5 hashtags.",
	                  output: 'Photo → caption + hashtags', bonus: 'Set up a daily content schedule that pre-generates 7 days of captions.',
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
	                { problem: '"Hermes isn\'t responding"', likely: 'The local service may be asleep, updating, or timed out', fix: 'Check that the desktop app is open and the machine is awake. Try again in 5 minutes. If it persists, ask Hermes or support for a setup audit step instead of guessing commands.' },
                { problem: '"My memory isn\'t sticking"', likely: 'Memory was not saved clearly enough', fix: 'Use "save this to memory" explicitly and ask Hermes to repeat what it saved. Edit the memory if the summary is wrong.' },
	                { problem: '"The schedule didn\'t run"', likely: 'Wrong time, machine asleep, or schedule disabled', fix: 'Open the Schedules screen, verify the time and timezone, make sure the machine is awake, and ask Hermes to explain the next safe check.' },
	                { problem: '"I broke something"', likely: 'You probably didn\'t break anything permanent', fix: 'Stop changing settings, restart the app, copy the exact warning, and ask Hermes for the safest next check. Do not change five things at once.' },
                { problem: '"I don\'t know what to say to Hermes"', likely: 'Start with anything. Seriously.', fix: 'Literally just say "hey" — it works. No prompt is too basic. Hermes is an assistant, not a judge.' },
                { problem: '"The skills aren\'t loading"', likely: 'Skill might not be installed', fix: 'Ask Hermes: "what skills do I have installed?" If yours isn\'t there, reinstall it with the install prompt.' },
	                { problem: '"My agent is giving bad answers"', likely: 'Your prompt is too vague', fix: 'Add specifics: "be more detailed," "give me 3 options," or "give me a short plan, answer, and self-check." Better prompts = better answers.' },
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
	                    'How to set up scheduled helpers that run recurring work',
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
      <AtmScrollbar scrollRef={lessonScrollRef} zIndexClass="z-[40]" />

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
              try { localStorage.setItem('80m-c7-quizzes', JSON.stringify(updated)); } catch (_e) {}
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
    title: "Install the App",
    subtitle: "From Zero to Your First Hermes Win",
    time: "75 Minutes",
    description: "Start with the real client path: download 80M Agent Desktop, add a provider key safely, tour the screens, and get one useful Hermes result.",
    image: "https://i.postimg.cc/BbsxmGcr/80mascot-Edited.png",
    topics: [
      { name: "80M Desktop + Hermes", detail: "The app and the assistant engine." },
      { name: "Provider Key Safety", detail: "Paste once, protect it like a private meter." },
      { name: "Troubleshooting", detail: "What to do when the screen turns red." },
      { name: "The Council", detail: "Specialized agents checking each other's work." }
    ]
  },
  {
    id: "02",
    title: "Brief Hermes Properly",
    subtitle: "Stop Guessing, Start Delegating",
    time: "80 Minutes",
    description: "Most people ask vague questions and get vague answers. You will learn to brief Hermes with role, context, task, rules, and output.",
    image: "https://i.postimg.cc/zv5nx1F1/80mascot-claw.png",
    topics: [
      { name: "Hermes Briefing", detail: "Role, context, task, rules, and output." },
      { name: "Memory", detail: "Making Hermes remember your business." },
      { name: "Reasoning Checks", detail: "Plan, answer, and self-check before action." },
      { name: "Voice Dictation", detail: "Speak structured prompts instead of typing everything." }
    ]
  },
  {
    id: "03",
    title: "Safe Remote Access",
    subtitle: "Domains, Tunnels, and Server Safety",
    time: "90 Minutes",
    description: "Plain-English infrastructure for non-coders: what domains, DNS, tunnels, HTTPS, logs, and firewalls do before you change anything.",
    image: "https://i.postimg.cc/x8YK6S32/80mascot-rich.png",
    topics: [
      { name: "DNS & Domains", detail: "Your AI's home address." },
      { name: "Nginx & Tunnels", detail: "The front desk and secure bridge." },
      { name: "SSL & Security", detail: "The green lock of trust." },
      { name: "Scaling", detail: "Turning one helper lane into a reviewed team." }
    ]
  },
  {
    id: "04",
    title: "Content Forge",
    subtitle: "Draft-First Social Content System",
    time: "90 Minutes",
    description: "Build a compliant TikTok slideshow workflow: research, AI image prompts, Postiz draft scheduling, human review, and analytics.",
    image: "https://i.postimg.cc/yxg9m51C/80m-chat.png",
    topics: [
      { name: "Postiz Drafts", detail: "Scheduling and previewing before approval." },
      { name: "3-Slide Formula", detail: "Hook, Info, CTA. Every time." },
      { name: "Human Review", detail: "Claims, captions, disclosures, and timing." },
      { name: "Platform Safety", detail: "Rules, warmup, and analytics before scale." }
    ]
  },
	  {
	    id: "05",
	    title: "Intelligence Pipeline + Agent Products",
	    subtitle: "Build Once, Stack Income Forever",
	    time: "95 Minutes",
	    description: "Turn public research into paid offers: lead lists, client demos, workflow automations, micro-SaaS tests, and agents that handle repetitive work with review gates.",
	    image: "https://i.postimg.cc/PJpZWcXj/business.png",
	    topics: [
	      { name: "Public Research Pipelines", detail: "Source-backed market notes and lead tables." },
	      { name: "Micro-SaaS Products", detail: "One job, one screen, one outcome — AI-assisted prototype in days." },
	      { name: "Workflow Automations", detail: "B2B annoyance work that pays monthly." },
	      { name: "Agent Products", detail: "AI agents that handle repeated workflows with approval rules." }
	    ]
	  },
  {
    id: "06",
    title: "The Full System + AI Business Playbook",
    subtitle: "Turn the Machine Into Money",
    time: "120 Minutes",
    description: "The capstone. You built the stack. Now make it print. Eight proven revenue models for AI-assisted builders, from small business websites to micro-SaaS to productized consulting. This is where most courses end — and where 80m actually starts.",
    image: "https://i.postimg.cc/4dFVhZgd/research.png",
    topics: [
      { name: "8 Revenue Models", detail: "Pick your lane and run it." },
      { name: "Demo-to-Money Pipeline", detail: "From skill to sale in 72 hours." },
	      { name: "Postiz + Agent Stack", detail: "The draft-first reviewed marketing engine." },
      { name: "Build-in-Public Flywheel", detail: "Content = distribution = revenue." },
      { name: "Micro-SaaS Launch", detail: "Ship fast, validate, iterate." },
      { name: "Productized Consulting", detail: "Sell outcomes, not hours." }
    ]
  },
	  {
	    id: "07",
	    title: "80M Agent Desktop",
	    subtitle: "Use Hermes Without Learning Code",
	    time: "90 Minutes",
	    description: "A full beginner course on opening the 80M Agent Desktop, choosing a provider, talking to Hermes, saving memory, installing skills, using schedules, and building useful workflows in plain English.",
	    image: "https://i.postimg.cc/Hnc5wKYC/social.png",
	    topics: [
	      { name: "Agent Council", detail: "The 7 orbs explained — find your lane." },
	      { name: "Memory & Skills", detail: "Your agent that actually remembers you." },
	      { name: "Schedules & Tasks", detail: "Recurring work without manual reminders." },
	      { name: "Build Your Workspace", detail: "Templates for agents, schedules, tasks, skills." }
	    ]
	  }
];

const walkAwayData = [
  { title: "Your Local Command Center", desc: "A voice-friendly AI agent setup on hardware you control." },
  { title: "Total Delegation", desc: "Hand off tasks and actually get results, not excuses." },
  { title: "Scheduled Helpers", desc: "Recurring work that runs on a schedule. Your business keeps moving." },
  { title: "More Control", desc: "Less vendor lock-in. Your setup, memory, and workflows stay closer to you." }
];

export default function PortalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeCourseMatch = location.pathname.match(/^\/portal\/class-(0[1-7])$/);
  const activeCourseId = routeCourseMatch?.[1] || null;

  const openCourse = (id) => {
    navigate(`/portal/class-${id}`);
  };

  const closeCourse = () => {
    navigate('/portal');
  };

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
      {!activeCourseId && (
        <>
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
                      <button onClick={() => openCourse(cls.id)} className={`font-sans font-black text-lg px-6 py-3 border-[3px] shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-all ${index === 1 ? 'bg-[#111] text-[#eae7de] border-[#111]' : 'bg-[#22c55e] text-[#111] border-[#111]'}`}>Start Course →</button>
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
        </>
      )}

      {/* Course Overlays */}
      <AnimatePresence>
        {activeCourseId === "01" && <CourseOneContent key="course-01" onClose={closeCourse} />}
        {activeCourseId === "02" && <CourseTwoContent key="course-02" onClose={closeCourse} />}
        {activeCourseId === "03" && <CourseThreeContent key="course-03" onClose={closeCourse} />}
        {activeCourseId === "04" && <CourseFourContent key="course-04" onClose={closeCourse} />}
        {activeCourseId === "05" && <CourseFiveContent key="course-05" onClose={closeCourse} />}
        {activeCourseId === "06" && <CourseSixContent key="course-06" onClose={closeCourse} />}
        {activeCourseId === "07" && <CourseSevenContent key="course-07" onClose={closeCourse} />}
      </AnimatePresence>
    </div>
  );
}
