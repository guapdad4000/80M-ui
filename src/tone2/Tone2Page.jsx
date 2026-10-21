import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import presets from './presets.json';
import '../canairy/canairy.css';
import './tone2.css';

// Set VITE_PRESET_PACK_URL at build time once the payment link is approved.
// Until then the buy button renders as a disabled "coming soon" placeholder.
const PACK_URL = import.meta.env.VITE_PRESET_PACK_URL || '';
const CONTACT = 'contact@80m.ai';
const SKY = '/brand/brain-fog/anime-sky.webp';
const MARK = '/brand/80m-mark-black.svg';
// Set VITE_TONE2_REPO_URL once the public repo exists (MIT licence file must ship with it).
const REPO_URL = import.meta.env.VITE_TONE2_REPO_URL || '';

const PROOF = [
  ['Dead shadows (dark kaiju)', '99.2% → 33%'],
  ['Shadow detail', '×6.8'],
  ['Dither algorithms', '20'],
  ['Old recipes, same pixels', '25/25'],
  ['Watermarks', '0'],
  ['Price', '$0.00'],
];

const FEATURES = [
  ['01 // Smart Tone', 'Auto levels, local contrast (CLAHE), shadow lift, clarity and a gated edge-sharpen, all before the first dot lands. It\'s what Photoshop tutorials tell you to do by hand, in one AUTO button.'],
  ['02 // 20 algorithms', 'Floyd-Steinberg, Atkinson, Jarvis, Stucki, Burkes, Sierra x3, plus the deep cuts: variable-coefficient, Riemersma Hilbert-curve, true void-and-cluster blue noise, Bayer 16×16, clustered-dot 8×8. Serpentine scan and anti-worm noise included.'],
  ['03 // AM screens, any angle', 'Photoshop\'s Bitmap → Halftone Screen, live. Pick the angle and the cell. Tone-calibrated, so 25% grey prints as 25%.'],
  ['04 // Multi-ink riso', 'Dither to 3–4 real inks in one pass: ink chosen in OKLab, error spread in linear light, each ink on its own screen angle. Add misregistration and drum grain. Four 80m palettes in the box.'],
  ['05 // Print-honest', 'Dot gain (simulate or compensate), fibre paper, ink spread, CMYK RIP spot shapes, GCR, film-positive plates, SVG.'],
  ['06 // Recipes are JSON', 'Every look saves as a .tone2.json. Share it, diff it, hand it to your agent. After the V2 engine landed, all 25 recipes we tested re-rendered pixel-identical.'],
];

const FAQ = [
  ['Is it actually free?', 'Yes. No watermark, no export cap, no account. The $19 Preset Pack is optional.'],
  ['Can I use it commercially?', 'Yes, both the output and the code (MIT). Credit is appreciated, not required.'],
  ['Can I fork it or put it in my product?', 'That\'s the point. MIT means take it.'],
  ['Do my images get uploaded?', 'No. Everything renders in your browser.'],
  ['Why do dark images look muddy in other tools?', 'Classic Atkinson dither throws away a quarter of the error on purpose, so dark tones fall to solid black. Hit Smart Tone, or switch to variable-coefficient or blue noise.'],
  ['Video?', 'Not yet. Stills only.'],
  ['Will my old recipes break when you update?', 'We test for that: 25/25 legacy recipes rendered pixel-identical after V2.'],
  ['Can the preset files be resold?', 'No. Your renders are yours; the pack\'s .json files aren\'t for resale.'],
];

function Win({ title, children, className = '', dark = false }) {
  return (
    <div className={`t2-win ${dark ? 't2-win-dark' : ''} ${className}`}>
      <div className="t2-bar"><span className="t2-dots"><i /><i /><i /></span><span>{title}</span></div>
      <div className="t2-body">{children}</div>
    </div>
  );
}

function Ransom({ text }) {
  return <span className="t2-ransom" aria-label={text}>{text.split('').map((c, i) => <span key={i} aria-hidden="true" className={`r${i % 5}`}>{c}</span>)}</span>;
}

function Signup() {
  const [email, setEmail] = useState('');
  const href = `mailto:${CONTACT}?subject=${encodeURIComponent('tone/2 waitlist')}&body=${encodeURIComponent(`Add me to the tone/2 list: ${email}`)}`;
  return (
    <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" className="t2-input flex-1" />
      <button type="submit" className="cn-btn bg-[#FFD60A]">Get it first →</button>
    </form>
  );
}

export default function Tone2Page() {
  const [active, setActive] = useState(0);
  useEffect(() => { document.title = 'tone/2 · free halftone + dither app · 80m'; }, []);
  const p = presets[active];
  return (
    <div className="t2-root relative min-h-screen text-[#111]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[#9cc8f0] bg-cover bg-center" style={{ backgroundImage: `url(${SKY})` }} />
      <header className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-5 md:px-8">
        <Link to="/" className="t2-chip">← 80m</Link>
        <nav className="flex gap-3 font-mono text-[10px] font-black uppercase tracking-[0.18em]">
          <a href="#clone" className="t2-chip">Source</a>
          <a href="#presets" className="t2-chip">Presets</a>
          <a href="#pack" className="t2-chip">$19 Pack</a>
          <Link to="/canairy" className="t2-chip">Canairy</Link>
        </nav>
      </header>
      <main className="relative z-10 mx-auto max-w-[1100px] space-y-10 px-4 pb-16 md:px-8">
        <section className="grid items-center gap-8 py-6 md:grid-cols-[1fr_1.1fr]">
          <Win title="tone2.app — free">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#555]">// free tool from 80m</p>
            <h1 className="mt-3 text-6xl leading-none lg:text-7xl"><Ransom text="tone/2" /></h1>
            <p className="mt-4 font-sans text-2xl font-black uppercase leading-tight">Your shadows deserved better.</p>
            <p className="mt-3 font-sans leading-relaxed text-[#333]">tone/2 is a free, open-source halftone and dither studio that runs in your browser. 20 algorithms, real multi-ink riso, and a Smart Tone pass that pulls detail out of dark art instead of burying it. No watermark, no account, no export cap. Take it, fork it, ship it.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="cn-btn bg-[#eae7de] opacity-70" aria-disabled="true">App: dropping soon</span>
              <a href="#clone" className="cn-btn bg-[#FFD60A]">Get the source (MIT)</a>
            </div>
            <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#555]">Runs locally · your images never leave your machine · MIT licensed</p>
          </Win>
          <Win title={`preview_${p.slug}`} dark>
            <img src={p.img} alt={`${p.name} before and after`} width="800" height="500" className="block h-auto w-full" />
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#FFD60A]">{p.no} · {p.name}</p>
            <p className="font-sans text-sm text-[#ccc]">{p.desc}</p>
          </Win>
        </section>

        <section className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <Win title="RECEIPT — engine_v2" className="t2-receipt">
            <ul className="space-y-1 font-mono text-sm">
              {PROOF.map(([k, v]) => <li key={k} className="flex justify-between gap-4"><span>{k}</span><span className="font-black">{v}</span></li>)}
            </ul>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#555]">Measured on our own renders.</p>
          </Win>
          <Win title="features.txt">
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map(([t, d]) => <div key={t}><p className="font-mono text-[11px] font-black uppercase tracking-widest">{t}</p><p className="mt-1 font-sans text-sm leading-relaxed text-[#333]">{d}</p></div>)}
            </div>
          </Win>
        </section>

        <section id="clone">
          <Win title="git clone — take the whole thing" dark>
            <h2 className="text-4xl text-[#eae7de] md:text-5xl"><Ransom text="clone it" /></h2>
            <p className="mt-3 max-w-[60ch] font-sans text-[#ccc]">tone/2 is MIT licensed. Clone it, fork it, rip the engine out, put it in your app, sell what you make with it. It's one HTML file and a small Python CLI, so there's no build step, no framework, and no account to make.</p>
            <pre className="mt-4 overflow-x-auto border-2 border-[#FFD60A] p-3 font-mono text-sm text-[#FFD60A]">{`git clone ${REPO_URL || '<repo coming soon>'}\nopen tone2/index.html`}</pre>
            <p className="mt-3 font-sans text-xs text-[#999]">Said plainly: the app loads Tailwind from a CDN for styling (rendering runs locally). The CLI does vector CMYK halftone only; dither and multi-ink live in the web app.</p>
            {REPO_URL && <a href={REPO_URL} className="cn-btn mt-4 bg-[#FFD60A]">Fork it on GitHub →</a>}
          </Win>
        </section>

        <section id="presets">
          <Win title={`presets.list — ${presets.length} looks`}>
            <h2 className="text-4xl md:text-5xl"><Ransom text="18 presets" /></h2>
            <p className="mt-2 font-sans text-[#333]">Pick one to preview it above. Each card shows the original next to the result.</p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {presets.map((x, i) => (
                <li key={x.slug}>
                  <button type="button" onClick={() => { setActive(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`t2-preset ${i === active ? 'is-on' : ''}`}>
                    <img src={x.img} alt="" width="800" height="500" loading="lazy" decoding="async" />
                    <span className="font-mono text-[11px] font-black uppercase tracking-widest">{x.no} · {x.name}</span>
                    <span className="font-sans text-xs text-[#444]">{x.desc}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Win>
        </section>

        <section id="pack" className="grid gap-8 md:grid-cols-2">
          <Win title="RECEIPT — preset_pack_v1" className="t2-receipt">
            <p className="font-mono text-xs uppercase tracking-widest">80m // tone/2 preset pack</p>
            <h2 className="mt-2 text-3xl"><Ransom text="skip the tweaking" /></h2>
            <p className="mt-2 font-sans text-sm text-[#333]">18 tuned recipes we use on 80m art (Pulp 1974, Noir Slam, Kaiju Mezzotint, Pink Riso, Misreg CMYK, ATM Receipt and 12 more), each with a before/after card, plus a 4-page guide. Drop a .json in, get the look.</p>
            <ul className="mt-4 space-y-1 font-mono text-sm">
              <li className="flex justify-between"><span>18 tone/2 presets (.json)</span><span>✓</span></li>
              <li className="flex justify-between"><span>18 before/after cards</span><span>✓</span></li>
              <li className="flex justify-between"><span>4-page PDF guide</span><span>✓</span></li>
              <li className="flex justify-between"><span>Commercial use of your output</span><span>✓</span></li>
              <li className="flex justify-between border-t-2 border-dashed border-[#111] pt-2 text-lg font-black"><span>TOTAL</span><span>$19</span></li>
            </ul>
            {PACK_URL
              ? <a href={PACK_URL} className="cn-btn mt-6 bg-[#FFD60A]">Buy the pack — $19 →</a>
              : <button type="button" disabled className="cn-btn mt-6 cursor-not-allowed bg-[#ccc]">Coming soon — $19</button>}
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#555]">The app stays free forever. The pack just saves you an afternoon.</p>
          </Win>
          <Win title="waitlist.txt" dark>
            <h2 className="text-4xl text-[#eae7de]"><Ransom text="get it first" /></h2>
            <p className="mt-3 font-sans text-[#ccc]">Leave your email to hear when the tone/2 app and the Preset Pack go live. This opens an email to {CONTACT}.</p>
            <Signup />
          </Win>
        </section>
        <section id="faq">
          <Win title="faq.txt">
            <h2 className="text-4xl"><Ransom text="faq" /></h2>
            <dl className="mt-4 grid gap-4 md:grid-cols-2">
              {FAQ.map(([q, a]) => <div key={q}><dt className="font-mono text-xs font-black uppercase tracking-widest">{q}</dt><dd className="mt-1 font-sans text-sm text-[#333]">{a}</dd></div>)}
            </dl>
          </Win>
        </section>
      </main>
      <footer className="relative z-10 mx-auto max-w-[1100px] px-4 pb-10 md:px-8">
        <div className="cn-card flex items-center gap-3 p-4"><img src={MARK} alt="80m" className="h-7 w-auto" /><p className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">tone/2 · a free tool from 80m</p></div>
      </footer>
    </div>
  );
}
