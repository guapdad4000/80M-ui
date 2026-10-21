import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { exploreLinks, primaryLinks } from './studioNavigation';
import './site-navigation.css';

function focusSection(hash) {
  if (!hash.startsWith('#')) return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  // Section shortcuts bypass the film's long scroll holds.
  target.scrollIntoView({ behavior: 'instant', block: 'start' });
  target.focus({ preventScroll: true });
}

export function StudioLink({ item, className, onNavigate, children }) {
  const navigate = useNavigate();

  function handleClick(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onNavigate?.();
    if (item.href.startsWith('#') && document.getElementById(item.href.slice(1))) {
      event.preventDefault();
      navigate(item.href, { preventScrollReset: true });
      focusSection(item.href);
    }
  }

  const content = children || item.label;
  return item.href.startsWith('mailto:') ? (
    <a href={item.href} className={className} onClick={handleClick}>{content}</a>
  ) : (
    <Link to={item.href} className={className} onClick={handleClick}>{content}</Link>
  );
}

export default function SiteNavigation({ onOpenPortfolio }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(() => window.scrollY > 160);
  const compactRef = useRef(isCompact);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const { hash } = useLocation();
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : .38, ease: [.22, 1, .36, 1] };

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > (compactRef.current ? 72 : 160);
    if (next !== compactRef.current) {
      compactRef.current = next;
      setIsCompact(next);
    }
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => focusSection(hash));
    return () => cancelAnimationFrame(frame);
  }, [hash]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => rootRef.current?.querySelector('.studio-nav__panel a')?.focus({ preventScroll: true }));
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
      if (event.key === 'Tab') {
        const controls = [...rootRef.current.querySelectorAll('a,button')].filter(element => element.getClientRects().length && !element.closest('[hidden]'));
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus(); }
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1000px)');
    const close = () => setIsOpen(false);
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  const close = () => setIsOpen(false);
  return (
    <Motion.header layoutRoot className={`studio-header${isCompact ? ' is-compact' : ''}${isOpen ? ' is-open' : ''}`} ref={rootRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    }}>
      <div className="studio-nav__scrim" hidden={!isOpen} onClick={close} aria-hidden="true" />
      <Motion.nav layout transition={transition} aria-label="Main navigation" className="studio-nav">
        <Motion.div layout transition={transition} className="studio-nav__identity">
          <Motion.div layout transition={transition} animate={{ rotate: isCompact && !reducedMotion ? -8 : 0 }}>
            <StudioLink item={{ href: '#top', label: '80M home' }} className="studio-nav__brand" onNavigate={close}>
              <img src="/brand/80m-mark-white.svg" alt="80M home" width="78" height="48" />
            </StudioLink>
          </Motion.div>
        </Motion.div>
        <div className="studio-nav__primary" hidden={isCompact || isOpen}>
          {primaryLinks.map((item) => <StudioLink key={item.href} item={item} onNavigate={close} className="studio-nav__link" />)}
        </div>
        <Motion.div layout transition={transition} className="studio-nav__actions">
          <div className="studio-nav__portfolio-wrap">
            <button type="button" className="studio-nav__portfolio" onClick={(event) => { close(); onOpenPortfolio(event); }}>
              <small>See the work</small>
              <span>Portfolio <span aria-hidden="true">↗</span></span>
            </button>
          </div>
          <StudioLink item={{ href: '/book', label: 'Start a project' }} className="studio-nav__project" onNavigate={close}>
            <span><small>Start a</small><strong>project</strong></span><span aria-hidden="true">↗</span>
          </StudioLink>
          <button ref={toggleRef} type="button" className="studio-nav__toggle" aria-label={isOpen ? 'Close menu' : 'Menu'} aria-expanded={isOpen} aria-controls="studio-explore" onClick={() => setIsOpen((open) => !open)}>
            <span>{isOpen ? 'Close' : 'Menu'}</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d={isOpen ? 'M5 5L19 19M19 5L5 19' : 'M3 7H21M3 17H21'} />
            </svg>
          </button>
        </Motion.div>
      </Motion.nav>
      <div id="studio-explore" role="navigation" aria-label="Studio menu" className="studio-nav__panel" hidden={!isOpen}>
          <div>
            <p className="studio-nav__eyebrow">Make something</p>
            {primaryLinks.map((item) => <StudioLink key={item.href} item={item} onNavigate={close} className="studio-nav__panel-link">
              <span>{item.label}</span><span aria-hidden="true">↗</span>
            </StudioLink>)}
            <StudioLink item={{ href: '/book', label: 'Start a project' }} className="studio-nav__panel-link studio-nav__panel-project" onNavigate={close}>
              <span>Start a project</span><span aria-hidden="true">↗</span>
            </StudioLink>
          </div>
          <div>
            <p className="studio-nav__eyebrow">Around the studio</p>
            {exploreLinks.map((item) => <StudioLink key={item.href} item={item} onNavigate={close} className="studio-nav__panel-link studio-nav__panel-link--secondary">
              <span>{item.label}<small>{item.description}</small></span><span aria-hidden="true">↗</span>
            </StudioLink>)}
          </div>
        </div>
    </Motion.header>
  );
}
