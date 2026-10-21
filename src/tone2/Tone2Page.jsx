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
            <p className="mt-4 font-sans text-xl font-black uppercase">Halftone + dither, in your browser.</p>
            <p className="mt-3 font-sans leading-relaxed text-[#333]">Turn any picture into print: Bayer, Floyd–Steinberg, blue noise, mezzotint, rosettes, riso, and CMYK misregistration. It's free, and it's the tool we use for every 80m visual.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="cn-btn bg-[#eae7de] opacity-70" aria-disabled="true">App: coming soon</span>
              <a href="#pack" className="cn-btn bg-[#FFD60A]">See the $19 Preset Pack</a>
            </div>
          </Win>
          <Win title={`preview_${p.slug}`} dark>
            <img src={p.img} alt={`${p.name} before and after`} width="800" height="500" className="block h-auto w-full" />
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-[#FFD60A]">{p.no} · {p.name}</p>
            <p className="font-sans text-sm text-[#ccc]">{p.desc}</p>
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
          </Win>
          <Win title="waitlist.txt" dark>
            <h2 className="text-4xl text-[#eae7de]"><Ransom text="get it first" /></h2>
            <p className="mt-3 font-sans text-[#ccc]">Leave your email to hear when the tone/2 app and the Preset Pack go live. This opens an email to {CONTACT}.</p>
            <Signup />
          </Win>
        </section>
      </main>
      <footer className="relative z-10 mx-auto max-w-[1100px] px-4 pb-10 md:px-8">
        <div className="cn-card flex items-center gap-3 p-4"><img src={MARK} alt="80m" className="h-7 w-auto" /><p className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">tone/2 · a free tool from 80m</p></div>
      </footer>
    </div>
  );
}
