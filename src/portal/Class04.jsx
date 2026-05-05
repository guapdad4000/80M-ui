import React from 'react';
import { Link } from 'react-router-dom';
import { NoiseOverlay, MacWindow } from '../PortalShared';

const Class04 = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#eae7de] flex flex-col">
      <NoiseOverlay />
      <div className="shrink-0 w-full bg-[#111] border-b-[4px] border-[#22c55e] px-6 py-4 flex justify-between items-center z-50 shadow-xl">
        <div>
          <span className="font-mono text-[#22c55e] text-xs font-bold uppercase tracking-widest">Class 04</span>
          <h2 className="font-serif text-[#eae7de] text-2xl font-black">Content Forge</h2>
        </div>
        <Link to="/portal" className="font-sans font-black text-sm uppercase px-4 py-2 bg-[#eae7de] text-[#111] border-[2px] border-transparent hover:border-[#22c55e] transition-all">
          Exit Class ✕
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-10 md:py-16">
        <div className="max-w-4xl mx-auto space-y-24">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter mb-8 uppercase">
              The Ghost in the <br/><span className="italic text-[#22c55e]">TikTok Machine.</span>
            </h1>
            <p className="font-serif text-xl md:text-2xl text-[#333] leading-relaxed border-l-[4px] border-[#111] pl-6 mb-8">
              Your AI posts for you. While you sleep. Your phone thinks a human is doing it. TikTok never knows the difference.
            </p>
            <div className="bg-[#111] border-[4px] border-[#22c55e] p-8 md:p-12 shadow-[12px_12px_0_0_#22c55e]">
              <h3 className="font-mono text-[#22c55e] font-bold uppercase tracking-widest mb-6 text-center">The Numbers Don't Lie</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { num: '5.6M', label: 'Views on best Reel.Farm post' },
                  { num: '90', label: 'Market touches per month' },
                  { num: '$0', label: 'Your time investment after setup' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="font-sans font-black text-5xl md:text-6xl text-[#22c55e] tracking-tighter">{stat.num}</div>
                    <div className="font-serif text-[#aaa] mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* The Stack */}
          <MacWindow title="80m_content_forge.arch" contentClass="bg-[#0d1117] p-6 font-mono text-sm text-[#22c55e]">
            <pre className="leading-tight">{`  ┌────────────────────────────────────┐
  │  HERMES (The Coordinator)         │
  └──────────────┬─────────────────────┘
               │ Generate 7 days of images
               ▼
  ┌────────────────────────────────────┐
  │  Gemini API + Nano Banana 2        │
  └──────────────┬─────────────────────┘
               │ Schedule to DRAFTS
               ▼
  ┌────────────────────────────────────┐
  │  Postiz.com ($29/mo)              │
  └──────────────┬─────────────────────┘
               │ Draft lives in TikTok
               ▼
  ┌────────────────────────────────────┐
  │  $50 Android (Native Posting)     │
  └──────────────┬─────────────────────┘
               │ ✓ NO SHADOWBAN
               ▼
           TikTok FYP: 🔥`}</pre>
          </MacWindow>

          {/* Sections */}
          {[
            { id: 's1', label: '1. Anti-Shadowban Protocol', desc: 'Learn why 99% of automations fail and how to avoid the banhammer.' },
            { id: 's2', label: '2. The Stack', desc: 'The complete Hermes + Postiz + Gemini + Android stack explained.' },
            { id: 's3', label: '3. Postiz Setup', desc: 'Wire Postiz to Hermes via API key. All posts go to drafts only.' },
            { id: 's4', label: '4. Gemini + Image Gen', desc: 'Generate slideshow images in batches using Gemini + Nano Banana 2.' },
            { id: 's5', label: '5. The 3-Slide Formula', desc: 'Hook → Info → CTA. The slide structure that converts.' },
            { id: 's6', label: '6. The Stockpile', desc: 'Generate one month of content in one session. Never run dry.' },
            { id: 's7', label: '7. Postiz 7 Rules', desc: 'The laws of automated posting. Break one and your account dies.' },
            { id: 's8', label: '8. The Secret Android', desc: 'The $50 phone trick that makes TikTok think a human is posting.' },
            { id: 's9', label: '9. Cron Automation', desc: 'Three cron jobs. The ghost runs itself 24/7.' },
          ].map((section) => (
            <div key={section.id} id={`c4-${section.id}`} className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
              <h2 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tight mb-3">{section.label}</h2>
              <p className="font-serif text-[#444] text-lg leading-relaxed">{section.desc}</p>
              <div className="mt-4 p-4 bg-[#f0fdf4] border-[2px] border-[#22c55e]">
                <p className="font-mono text-xs text-[#14532d] font-bold uppercase">Content coming soon</p>
                <p className="font-serif text-sm text-[#555] mt-1">This section is being developed. Check the full course in PortalPage.jsx for the complete interactive content.</p>
              </div>
            </div>
          ))}

          {/* Dictionary */}
          <div id="c4-dictionary" className="border-[3px] border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
            <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">10. The Dumb-Proof Dictionary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { term: 'Shadowban', def: 'TikTok silently hiding your content from the For You page.' },
                { term: 'Nano Banana 2', def: "Google Gemini's image generation model. Free tier available." },
                { term: 'Postiz API', def: "Postiz's developer key that lets Hermes schedule posts." },
                { term: 'ADB', def: 'Android Debug Bridge — lets your server control the Android phone.' },
                { term: 'Slideshow Marketing', def: "TikTok video format using static images with audio overlay." },
                { term: 'Warmup Protocol', def: '3-day process of behaving like a human on TikTok before automating.' },
              ].map((item, i) => (
                <div key={i} className="border-[2px] border-[#ddd] p-4">
                  <h4 className="font-sans font-black text-lg uppercase mb-1">{item.term}</h4>
                  <p className="font-serif text-[#444] text-sm">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div id="c4-resources" className="border-[3px] border-[#111] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#111]">
            <h2 className="font-sans font-black text-3xl md:text-4xl uppercase tracking-tight mb-6">11. Resource Locker</h2>
            <ul className="space-y-3 font-serif text-base">
              {[
                { name: 'Postiz.com', url: 'https://postiz.pro/', note: '$29/mo agentic social scheduler' },
                { name: 'Gemini API', url: 'https://ai.google.dev/', note: 'Free tier available' },
                { name: 'Samsung Galaxy A15/A25', url: 'https://www.androidauthority.com/', note: 'The $50 Android for posting' },
                { name: 'Reel.Farm', url: 'https://reelfarm.gg/', note: 'AI UGC integration for Postiz' },
                { name: 'Crontab.guru', url: 'https://crontab.guru/', note: 'Translate cron expressions' },
              ].map((r, i) => (
                <li key={i}>
                  <a className="underline underline-offset-4 font-black" href={r.url} target="_blank" rel="noreferrer">{r.name}</a>
                  <span className="text-[#555]"> — {r.note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="border-[4px] border-[#22c55e] bg-[#f0fdf4] p-10 shadow-[12px_12px_0_0_#22c55e] text-center">
            <div className="font-mono text-6xl mb-4">👻</div>
            <h2 className="font-serif text-4xl font-black mb-6 uppercase">Class 04 Complete.</h2>
            <p className="font-serif text-xl text-[#333] mb-8 leading-relaxed">
              You just built a fully autonomous TikTok content machine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://discord.gg/80m" target="_blank" rel="noreferrer" className="inline-block font-sans font-black text-lg uppercase px-8 py-4 bg-[#111] text-[#eae7de] border-[3px] hover:bg-[#22c55e] hover:text-[#111] transition-all">
                Join the Discord
              </a>
              <Link to="/portal" className="inline-block font-sans font-black text-lg uppercase px-8 py-4 bg-white text-[#111] border-[3px] border-[#111] hover:border-[#22c55e] shadow-[6px_6px_0_0_#111] hover:-translate-y-1 transition-all">
                Exit to Curriculum →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Class04;
