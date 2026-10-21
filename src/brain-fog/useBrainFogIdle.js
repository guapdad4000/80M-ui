import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_MS = 75_000;
const DISMISS_COOLDOWN_MS = 5 * 60_000;
const EXIT_MS = 700;
const ACTIVITY = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'];

function isOccupied() {
  return document.hidden || Boolean(document.querySelector('.studio-header.is-open, .portfolio-experience, [aria-modal="true"]')) ||
    Boolean(document.activeElement?.closest('input,textarea,select,[contenteditable="true"]'));
}

export default function useBrainFogIdle({ disabled = false } = {}) {
  const [phase, setPhase] = useState('idle');
  const phaseRef = useRef('idle');
  const idleTimer = useRef(0);
  const exitTimer = useRef(0);
  const cooldownUntil = useRef(0);
  const scheduleRef = useRef(null);
  const hasShown = useRef(false);
  const [preview] = useState(() => new URLSearchParams(window.location.search).get('brainfog') === 'preview');

  const transition = useCallback(next => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const dismiss = useCallback((cooldown = true) => {
    if (phaseRef.current === 'idle' || phaseRef.current === 'leaving') return;
    clearTimeout(idleTimer.current);
    clearTimeout(exitTimer.current);
    if (cooldown) cooldownUntil.current = Date.now() + DISMISS_COOLDOWN_MS;
    transition('leaving');
    exitTimer.current = window.setTimeout(() => {
      transition('idle');
      scheduleRef.current?.();
    }, EXIT_MS);
  }, [transition]);

  const onCovered = useCallback(() => {
    if (phaseRef.current !== 'forming') return;
    if (disabled || isOccupied()) { dismiss(false); return; }
    transition('open');
  }, [disabled, dismiss, transition]);

  useEffect(() => {
    function schedule() {
      clearTimeout(idleTimer.current);
      if (disabled || document.hidden || phaseRef.current !== 'idle') return;
      const delay = Math.max(preview && !hasShown.current ? 1500 : IDLE_MS, cooldownUntil.current - Date.now());
      idleTimer.current = window.setTimeout(() => {
        if (disabled || isOccupied()) { schedule(); return; }
        hasShown.current = true;
        transition('forming');
      }, delay);
    }
    scheduleRef.current = schedule;
    function onActivity() {
      if (phaseRef.current === 'forming') dismiss(false);
      else if (phaseRef.current === 'idle') schedule();
    }
    function onVisibilityChange() {
      clearTimeout(idleTimer.current);
      if (document.hidden && phaseRef.current === 'forming') dismiss(false);
      else if (!document.hidden) schedule();
    }
    function onBlur() {
      clearTimeout(idleTimer.current);
      if (phaseRef.current === 'forming') dismiss(false);
    }
    schedule();
    ACTIVITY.forEach(event => window.addEventListener(event, onActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onActivity);
    return () => {
      clearTimeout(idleTimer.current);
      scheduleRef.current = null;
      ACTIVITY.forEach(event => window.removeEventListener(event, onActivity));
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onActivity);
    };
  }, [disabled, dismiss, preview, transition]);

  useEffect(() => () => {
    clearTimeout(idleTimer.current);
    clearTimeout(exitTimer.current);
  }, []);

  return { phase, onCovered, dismiss };
}
