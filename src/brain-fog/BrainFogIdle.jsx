import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import CollageArt from '../CollageArt';
import { startCloudPainting } from './paintClouds';
import './brain-fog.css';

function supportsDOMCanvas() {
  return typeof CanvasRenderingContext2D !== 'undefined' &&
    typeof CanvasRenderingContext2D.prototype.drawElementImage === 'function' &&
    typeof HTMLCanvasElement.prototype.requestPaint === 'function';
}

function FogContent({ onDismiss, onStartProject, native }) {
  return (
    <>
      <button type="button" className="brain-fog__close" onClick={onDismiss} aria-label="Clear the clouds"><span>Clear the clouds</span><span aria-hidden="true">×</span></button>
      <h2 id="brain-fog-title">{native ? <span className="sr-only">Too much brain fog?</span> : <CollageArt name="too-much-brain-fog" text="Too much brain fog?" eager />}</h2>
      <Link to="/book" className="brain-fog__help" onClick={onStartProject}>Let us help! <span aria-hidden="true">↗</span></Link>
      <button type="button" className="brain-fog__browse" onClick={onDismiss}>I’m good. Keep browsing.</button>
    </>
  );
}

export default function BrainFogIdle({ phase, onCovered, dismiss }) {
  const sceneRef = useRef(null);
  const uiCanvasRef = useRef(null);
  const contentRef = useRef(null);
  const dialogRef = useRef(null);
  const leavingForIntake = useRef(false);
  const [native, setNative] = useState(supportsDOMCanvas);
  const [returnPoint] = useState(() => ({ element: document.activeElement, scroll: window.scrollY }));
  const reducedMotion = useReducedMotion();

  useEffect(() => startCloudPainting(sceneRef.current, { reducedMotion, onCovered }), [onCovered, reducedMotion]);

  useEffect(() => {
    if (!native) return;
    const canvas = uiCanvasRef.current;
    const content = contentRef.current;
    const context = canvas.getContext('2d');
    if (!context) {
      const fallback = requestAnimationFrame(() => setNative(false));
      return () => cancelAnimationFrame(fallback);
    }
    let ratio = 1;
    let disposed = false;
    let retries = 0;
    let retryFrame = 0;
    let verifiedPixels = false;
    const titleImage = new Image();
    function requestPaint() { if (!disposed) canvas.requestPaint(); }
    function paint() {
      if (disposed) return;
      if (dialogRef.current?.dataset.phase !== 'open') return;
      try {
        context.reset();
        // DOM snapshots already carry the browser's device scale. Give an
        // explicit destination instead of applying DPR a second time.
        const matrix = context.drawElementImage(content, 0, 0, canvas.width, canvas.height);
        // Older trial builds return the hit-test matrix. Newer builds align
        // pointer/focus geometry automatically and return undefined instead.
        if (matrix?.toString) {
          const transform = matrix.isIdentity ? '' : matrix.toString();
          if (content.style.transform !== transform) content.style.transform = transform;
        } else if (content.style.transform) content.style.transform = '';
        // Raster title art belongs in the image compositor. Rendering it here
        // also avoids legacy DOM snapshots dropping nested transparent images.
        if (titleImage.complete && titleImage.naturalWidth) {
          const title = content.querySelector('#brain-fog-title').getBoundingClientRect();
          context.save();
          context.translate((title.left + title.width / 2) * ratio, (title.top + title.height / 2) * ratio);
          context.rotate(-3 * Math.PI / 180);
          context.drawImage(titleImage, 0, 23, 1680, 838, -title.width * ratio / 2, -title.height * ratio / 2, title.width * ratio, title.height * ratio);
          context.restore();
        }
        if (!verifiedPixels) {
          const bounds = content.querySelector('.brain-fog__help').getBoundingClientRect();
          const x = Math.min(canvas.width - 1, Math.max(0, Math.round((bounds.left + bounds.width / 2) * ratio)));
          const y = Math.min(canvas.height - 1, Math.max(0, Math.round((bounds.top + bounds.height / 2) * ratio)));
          if (context.getImageData(x, y, 1, 1).data[3] < 128) {
            if (retries++ < 6) {
              cancelAnimationFrame(retryFrame);
              retryFrame = requestAnimationFrame(requestPaint);
              return;
            }
            throw new Error('Native DOM controls were not painted');
          }
          verifiedPixels = true;
        }
        canvas.dataset.painted = 'true';
        retries = 0;
      } catch (error) {
        // A newly visible subtree can need one more browser paint before its
        // cached record is ready. Do not mistake that for an unavailable API.
        if (error.name === 'InvalidStateError' && retries++ < 6) {
          cancelAnimationFrame(retryFrame);
          retryFrame = requestAnimationFrame(requestPaint);
          return;
        }
        // An exposed but unusable trial API must never hide the live controls.
        setNative(false);
      }
    }
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4_000_000 / Math.max(1, bounds.width * bounds.height)));
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      content.style.width = `${bounds.width}px`;
      content.style.height = `${bounds.height}px`;
      requestPaint();
    }
    canvas.addEventListener('paint', paint);
    canvas.addEventListener('pointerover', requestPaint, { passive: true });
    canvas.addEventListener('focusin', requestPaint);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    content.querySelectorAll('img').forEach(image => image.addEventListener('load', requestPaint));
    titleImage.onload = requestPaint;
    titleImage.src = '/brand/landing-art/too-much-brain-fog.webp';
    document.fonts.ready.then(requestPaint);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(retryFrame);
      observer.disconnect();
      canvas.removeEventListener('paint', paint);
      canvas.removeEventListener('pointerover', requestPaint);
      canvas.removeEventListener('focusin', requestPaint);
      content.querySelectorAll('img').forEach(image => image.removeEventListener('load', requestPaint));
      titleImage.onload = null;
    };
  }, [native]);

  useEffect(() => { uiCanvasRef.current?.requestPaint?.(); }, [phase]);

  useEffect(() => {
    if (phase !== 'open') return;
    const previousOverflow = document.body.style.overflow;
    const playing = [...document.querySelectorAll('video')].filter(video => !video.paused);
    document.body.style.overflow = 'hidden';
    playing.forEach(video => video.pause());
    dialogRef.current?.focus({ preventScroll: true });
    function onKeyDown(event) {
      if (event.key === 'Escape') { event.preventDefault(); dismiss(); }
      if (event.key === 'Tab') {
        const controls = [...dialogRef.current.querySelectorAll('button,a[href]')];
        const index = controls.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1)?.focus({ preventScroll: true }); }
        else if (!event.shiftKey && (index === controls.length - 1 || index === -1)) { event.preventDefault(); controls[0]?.focus({ preventScroll: true }); }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (!leavingForIntake.current) {
        window.scrollTo({ top: returnPoint.scroll, behavior: 'instant' });
        if (returnPoint.element?.isConnected) returnPoint.element.focus({ preventScroll: true });
        if (!document.hidden && !reducedMotion) playing.forEach(video => video.play().catch(() => {}));
      }
    };
  }, [dismiss, phase, reducedMotion, returnPoint]);

  function onStartProject(event) {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) leavingForIntake.current = true;
  }
  const content = <FogContent onDismiss={() => dismiss()} onStartProject={onStartProject} native={native} />;
  return createPortal(
    <div ref={dialogRef} className="brain-fog" data-phase={phase} data-renderer={native ? 'html-in-canvas' : 'canvas-and-dom'} role={phase === 'open' ? 'dialog' : undefined} aria-modal={phase === 'open' ? 'true' : undefined} aria-labelledby={phase === 'open' ? 'brain-fog-title' : undefined} aria-hidden={phase !== 'open'} tabIndex={-1}>
      <canvas className="brain-fog__sky" ref={sceneRef} aria-hidden="true" />
      {native ? <canvas ref={uiCanvasRef} className="brain-fog__ui-canvas" layoutsubtree="" content="drawable">
        <div className="brain-fog__dom brain-fog__message" drawable="" ref={contentRef} inert={phase !== 'open'}>{content}</div>
      </canvas> : <div className="brain-fog__dom brain-fog__message" inert={phase !== 'open'}>{content}</div>}
    </div>, document.body,
  );
}
