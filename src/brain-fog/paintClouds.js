const SKY = '/brand/brain-fog/anime-sky.webp';
const BANK = '/brand/brain-fog/cloud-bank.webp';
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

function loadImage(src) {
  return new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function cover(context, image, width, height, drift) {
  const scale = Math.max(width / image.width, height / image.height) * 1.025;
  const w = image.width * scale;
  const h = image.height * scale;
  context.drawImage(image, (width - w) / 2 + drift, (height - h) / 2, w, h);
}

// Decode once, then composite a few textured layers with a capped pixel budget.
// No canvas or animation loop exists while the visitor is actively browsing.
export function startCloudPainting(canvas, { reducedMotion, onCovered }) {
  const context = canvas.getContext('2d', { alpha: true });
  let disposed = false;
  let frame = 0;
  let lastFrame = -Infinity;
  let started = 0;
  let covered = false;
  let sky = null;
  let bank = null;
  let width = 1;
  let height = 1;
  let ratio = 1;
  let fallbackTimer = 0;
  const duration = reducedMotion ? 1200 : 10_000;

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    ratio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(2_200_000 / (width * height)));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (context && covered && reducedMotion) paint(performance.now());
  }

  function cloud(x, y, w, alpha, mirrored = false, rotation = 0) {
    if (!bank || alpha <= 0) return;
    context.save();
    context.globalAlpha = alpha;
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(mirrored ? -1 : 1, 1);
    const h = w * bank.height / bank.width;
    context.drawImage(bank, -w / 2, -h / 2, w, h);
    context.restore();
  }

  function paint(now) {
    frame = 0;
    if (disposed || document.hidden) return;
    if (now - lastFrame < 1000 / 30) { frame = requestAnimationFrame(paint); return; }
    lastFrame = now;
    const elapsed = Math.max(0, now - started);
    const progress = clamp(elapsed / duration);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const background = reducedMotion ? smooth(progress) : smooth((progress - .2) / .72);
    const breath = reducedMotion ? 0 : Math.sin(elapsed / 8500) * Math.min(width * .008, 12);
    context.globalAlpha = background;
    if (sky) cover(context, sky, width, height, breath);
    else {
      const fill = context.createLinearGradient(0, 0, 0, height);
      fill.addColorStop(0, '#208eda'); fill.addColorStop(1, '#e8f3ff');
      context.fillStyle = fill; context.fillRect(0, 0, width, height);
    }
    context.globalAlpha = 1;
    if (!reducedMotion && bank) {
      const enter = smooth(progress / .9);
      const opacity = smooth(progress * 3.5);
      const size = Math.max(width * .9, height * 1.25);
      const float = Math.sin(elapsed / 7200) * 9;
      cloud(width * .22 - size * .54 * (1 - enter) + breath, height * .78 + height * .36 * (1 - enter) + float, size, opacity * .96);
      cloud(width * .9 + size * .68 * (1 - enter) - breath, height * .68 + height * .3 * (1 - enter) - float, size * 1.05, opacity * .9, true);
      cloud(width * .16 - size * .45 * (1 - enter), height * .06 - height * .45 * (1 - enter), size * .88, opacity * .7, true, Math.PI);
      cloud(width * .74 + size * .4 * (1 - enter), height * .98 + height * .5 * (1 - enter) + float, size * 1.3, opacity);
    }
    canvas.dataset.coverage = progress.toFixed(2);
    if (progress >= 1 && !covered) { covered = true; onCovered(); }
    if (!reducedMotion || progress < 1) frame = requestAnimationFrame(paint);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  function visibility() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (context && !document.hidden && started && !disposed) { lastFrame = -Infinity; frame = requestAnimationFrame(paint); }
  }
  document.addEventListener('visibilitychange', visibility);
  resize();
  Promise.all([loadImage(SKY), loadImage(BANK)]).then(images => {
    if (disposed) return;
    [sky, bank] = images;
    started = performance.now();
    if (!context) {
      canvas.style.background = `url('${SKY}') center/cover`;
      canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration, fill: 'forwards' });
      fallbackTimer = window.setTimeout(() => { if (!disposed) onCovered(); }, duration);
      return;
    }
    frame = requestAnimationFrame(paint);
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    clearTimeout(fallbackTimer);
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    canvas.getAnimations().forEach(animation => animation.cancel());
  };
}
