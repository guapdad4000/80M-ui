import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { renderMarkdown } from './markdown.js';
import chapter1 from './content/chapter-1.md?raw';
import chapter2 from './content/chapter-2.md?raw';
import research from './content/research.md?raw';
import outline from './content/outline.md?raw';
import blueprint from './content/blueprint.md?raw';
import ledgerMd from './content/ledger.md?raw';
import './canairy.css';

const EMBLEM = '/brand/landing-art/canairy-emblem.webp';
const MARK = '/brand/80m-mark-black.svg';
const BG_VIDEO = '/media/80m-background-h264.mp4';

const PAGES = [
  { slug: 'chapter-1', no: '01', kicker: 'Chapter 01 · Free', title: 'The rules of the dig', blurb: 'How an AI starts a business from $150, the human gate, and the first mistake it caught.', src: chapter1 },
  { slug: 'chapter-2', no: '02', kicker: 'Chapter 02 · Free', title: 'Eleven mines, one canary', blurb: 'Eleven real attempts at AI-run businesses, sourced. What actually happened to the money.', src: chapter2 },
  { slug: 'ledger', no: '03', kicker: 'Public ledger', title: 'Every dollar, in and out', blurb: '$150 start. Every spend, every fee, every off-budget cost. Nothing rounded.', src: ledgerMd },
  { slug: 'research', no: '04', kicker: 'Field notes', title: 'The research file', blurb: 'The raw notes behind Chapter 2, with every source linked.', src: research },
  { slug: 'blueprint', no: '05', kicker: 'Blueprint ideas', title: 'Audience and content engine', blurb: 'Who this is for, what we post, and the rules the AI runs by.', src: blueprint },
  { slug: 'outline', no: '06', kicker: 'Roadmap', title: 'The playbook outline', blurb: 'Every chapter we plan to dig through next. All free.', src: outline },
];

function Backdrop() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      {!reduce && (
        <video className="absolute inset-0 h-full w-full object-cover opacity-60 saturate-[1.1]" muted playsInline autoPlay loop preload="metadata">
          <source src={BG_VIDEO} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(234,231,222,0.16),transparent_30%),linear-gradient(90deg,rgba(234,231,222,0.18),rgba(234,231,222,0.04)_48%,rgba(5,5,5,0.24))]" />
    </div>
  );
}

function Emblem({ size = 96, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <Motion.img src={EMBLEM} alt="Canairy winged ATM and canary emblem" width={size} height={Math.round(size * 1212 / 1298)}
      className={`cn-emblem ${className}`}
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
  );
}

function Shell({ children }) {
  return (
    <div className="cn-root relative min-h-screen text-[#111]">
      <Backdrop />
      <header className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-5 md:px-8">
        <Link to="/canairy" className="flex items-center gap-3">
          <img src={EMBLEM} alt="" width={44} height={41} className="cn-emblem cn-emblem-badge" />
          <span className="font-serif text-2xl leading-none text-[#eae7de]">Canairy</span>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#eae7de]">
          <Link to="/canairy/chapter-1" className="hover:underline">Ch.01</Link>
          <Link to="/canairy/chapter-2" className="hover:underline">Ch.02</Link>
          <Link to="/canairy/ledger" className="hover:underline">Ledger</Link>
          <Link to="/" className="hover:underline">80m ↗</Link>
        </nav>
      </header>
      <main className="relative z-10 mx-auto max-w-[1100px] px-4 pb-16 md:px-8">{children}</main>
      <footer className="relative z-10 mx-auto max-w-[1100px] px-4 pb-10 md:px-8">
        <div className="cn-card flex flex-col items-center justify-between gap-4 p-5 md:flex-row">
          <div className="flex items-center gap-3">
            <img src={MARK} alt="80m" className="h-8 w-auto" />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">Canairy · an 80m Systems field notebook · always free</p>
          </div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#555]">炭鉱のカナリア · 탄광의 카나리아</p>
        </div>
      </footer>
    </div>
  );
}

function Landing() {
  return (
    <Shell>
      <section className="grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-[1.3fr_0.7fr] md:py-16">
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="cn-card p-6 md:p-10">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#555]">80m Systems presents · 初版</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] md:text-7xl">Canairy</h1>
          <p className="mt-2 font-sans text-xl font-black uppercase md:text-2xl">An AI-run business, built in public from $150.</p>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-[#333]">
            The canary goes into the mine first. Here an AI does the digging: it researches, writes, builds, and keeps the books, and a human approves every dollar.
            Every chapter is free, and so is the ledger. Nothing here is for sale.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/canairy/chapter-1" className="cn-btn bg-[#FFD60A]">Read Chapter 01 →</Link>
            <Link to="/canairy/ledger" className="cn-btn bg-[#eae7de]">See the ledger</Link>
          </div>
        </Motion.div>
        <div className="flex flex-col items-center gap-4">
          <div className="cn-card cn-emblem-panel flex w-full max-w-[326px] items-center justify-center p-8"><Emblem size={256} /></div>
          <div className="cn-card grid w-full grid-cols-3 text-center">
            {[['$150', 'Start'], ['$0', 'Spent'], ['$0', 'Revenue']].map(([v, k]) => (
              <div key={k} className="border-r-2 border-[#111] p-3 last:border-r-0">
                <p className="font-serif text-2xl">{v}</p>
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#555]">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section aria-label="Contents" className="grid gap-4 md:grid-cols-2">
        {PAGES.map((p, i) => (
          <Motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={`/canairy/${p.slug}`} className="cn-card cn-link block h-full p-6">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">{p.kicker}</p>
                <span className="font-serif text-3xl text-[#C9A227]">{p.no}</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl leading-tight">{p.title}</h2>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#333]">{p.blurb}</p>
            </Link>
          </Motion.div>
        ))}
      </section>
    </Shell>
  );
}

function Article({ page }) {
  const html = useMemo(() => renderMarkdown(page.src), [page]);
  const idx = PAGES.indexOf(page);
  const next = PAGES[idx + 1];
  return (
    <Shell>
      <article className="cn-card mx-auto mt-6 max-w-[820px] p-6 md:p-12">
        <div className="mb-6 flex items-center gap-4 border-b-2 border-[#111] pb-5">
          <Emblem size={72} className="cn-emblem-badge" />
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">{page.kicker}</p>
            <p className="font-serif text-2xl">{page.title}</p>
          </div>
        </div>
        <div className="cn-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t-2 border-[#111] pt-6">
          <Link to="/canairy" className="cn-btn bg-[#eae7de]">← All chapters</Link>
          {next && <Link to={`/canairy/${next.slug}`} className="cn-btn bg-[#FFD60A]">Next: {next.title} →</Link>}
        </div>
      </article>
    </Shell>
  );
}

export default function CanairyPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/canairy\/?/, '').replace(/\/$/, '');
  const page = PAGES.find((p) => p.slug === slug);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = page ? `${page.title} · Canairy · 80m` : 'Canairy · An AI-run business from $150 · 80m';
    window.scrollTo(0, 0);
    return () => { document.title = previousTitle; };
  }, [page]);
  return page ? <Article page={page} /> : <Landing />;
}
