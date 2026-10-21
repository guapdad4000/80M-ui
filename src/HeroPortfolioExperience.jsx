import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import { PortfolioMasthead, PortfolioStudioBackdrop, PortfolioProjectViewer, PortfolioProjectIndex } from './PortfolioArchiveUI';
import { portfolioProjects as portfolioSlides } from './portfolioProjects';

const PORTFOLIO_INTRO_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/202605050146.mp4";
const PORTFOLIO_INTRO_VIDEO = "/media/80m-portfolio-intro.mp4";
const PORTFOLIO_IDLE_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/0504(1).mp4";
const PORTFOLIO_IDLE_VIDEO = "/media/80m-hero-idle-h264.mp4";
const BRAND_MARK_WHITE = "/brand/80m-mark-white.svg";

const PORTFOLIO_FLYAWAY_MS = 420;
const PORTFOLIO_RIBBON_ITEM_SPACING = {
  desktop: 0.16,
  compact: 0.24,
};
const MotionDiv = motion.div;

const getPortfolioThumb = (src) => src?.replace('/portfolio/', '/portfolio/thumbs/').replace(/\.(png|jpe?g|webp)$/i, '.webp') || src;

function clamp(value, min = 0, max = 1) {
  const number = Number.isFinite(Number(value)) ? Number(value) : min;
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(number, low), high);
}

function canCreatePortfolioWebGL() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !window.WebGLRenderingContext) return false;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  canvas.remove();
  return Boolean(context);
}

function usePortfolioCompact() {
  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px), (max-height: 640px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const query = window.matchMedia('(max-width: 767px), (max-height: 640px)');
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isCompact;
}

const PortfolioFallbackRibbon = ({ projects, scrollOffset, flyawayProjectTitle, onSelect, isCompact = false }) => (
  <div className="absolute inset-0 z-20 overflow-hidden">
    {projects.map((project, index) => {
      const spacing = isCompact ? PORTFOLIO_RIBBON_ITEM_SPACING.compact : PORTFOLIO_RIBBON_ITEM_SPACING.desktop;
      const loopLength = Math.max(1, projects.length * spacing);
      const rawT = (index * spacing + scrollOffset * loopLength) % loopLength;
      const t = rawT > 1 ? rawT - loopLength : rawT;
      const isVisible = t >= -0.16 && t <= 1.06;
      const displayT = clamp(t, 0, 1);
      const pull = Math.pow(displayT, 1.4);
      const left = isCompact ? 13 + displayT * 74 : -2 + displayT * 106;
      const top = isCompact ? 64 - displayT * 15 + Math.sin(displayT * Math.PI * 2) * 5 : 62 - displayT * 18 + Math.sin(displayT * Math.PI * 2) * 8;
      const scale = isCompact ? 0.86 - pull * 0.34 : 0.98 - pull * 0.42;
      const edgeFade = Math.min(1, Math.max(0, (t + 0.08) / 0.14), Math.max(0, (1.04 - t) / 0.16));
      const opacity = isVisible ? 0.9 * edgeFade : 0;
      const isExiting = project.title === flyawayProjectTitle;

      return (
        <button
          key={project.title}
          type="button"
          aria-label={`Select ${project.title}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onSelect?.(project)}
          className="portfolio-fallback-card"
          tabIndex={isVisible && opacity > .1 ? 0 : -1}
          style={{
            left: isExiting ? '50%' : `${left}%`,
            top: isExiting ? '52%' : `${top}%`,
            opacity: isExiting ? 0 : opacity,
            pointerEvents: isVisible ? 'auto' : 'none',
            transform: isExiting
              ? 'translate3d(-50%, -50%, 0) rotate(0deg) scale(0.38)'
              : `translate3d(-50%, -50%, 0) rotate(${Math.sin(index) * 7}deg) scale(${scale})`,
          }}
        >
          <img src={getPortfolioThumb(project.img)} alt="" />
          <span className="portfolio-fallback-card__label">{project.title} ↗</span>
        </button>
      );
    })}
  </div>
);

const PortfolioThreeRibbon = ({ projects, scrollOffset, flyawayProjectTitle, onSelect, isCompact = false }) => {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollOffset);
  const selectRef = useRef(onSelect);
  const flyawayRef = useRef(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    scrollRef.current = scrollOffset;
  }, [scrollOffset]);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    flyawayRef.current = flyawayProjectTitle
      ? { title: flyawayProjectTitle, startedAt: performance.now() }
      : null;
  }, [flyawayProjectTitle]);

  useEffect(() => {
    if (webglUnavailable) return undefined;

    const mount = mountRef.current;
    if (!mount) return undefined;
    if (!canCreatePortfolioWebGL()) {
      queueMicrotask(() => setWebglUnavailable(true));
      return undefined;
    }

    let renderer;
    let meshes = [];
    let rafId = 0;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-6, 6, 3.4, -3.4, 0.1, 100);
      camera.position.set(0, 0, 10);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const buildCurve = (aspect) => {
        const horizontal = 5.8 * aspect;
        const left = -horizontal;
        const right = horizontal;
        const top = 3.4;
        const bottom = -3.4;
        const point = (x, y) => new THREE.Vector3(
          THREE.MathUtils.lerp(left, right, x),
          THREE.MathUtils.lerp(top, bottom, y),
          0
        );

        if (isCompact) {
          return new THREE.CatmullRomCurve3([
            point(0.12, 0.67),
            point(0.24, 0.64),
            point(0.36, 0.61),
            point(0.48, 0.58),
            point(0.62, 0.54),
            point(0.74, 0.49),
            point(0.86, 0.46),
            point(0.94, 0.48),
          ]);
        }

        return new THREE.CatmullRomCurve3([
          point(0.08, 0.66), point(0.18, 0.62), point(0.30, 0.63),
          point(0.42, 0.60), point(0.52, 0.52), point(0.64, 0.48),
          point(0.76, 0.40), point(0.86, 0.36), point(0.95, 0.38),
        ]);
      };

      let curve = buildCurve(16 / 9);
      const textureLoader = new THREE.TextureLoader();
      const planeWidth = isCompact ? 1.62 : 2.12;
      const planeHeight = isCompact ? 0.98 : 1.28;
      const itemSpacing = isCompact ? PORTFOLIO_RIBBON_ITEM_SPACING.compact : PORTFOLIO_RIBBON_ITEM_SPACING.desktop;
      const loopLength = Math.max(1, projects.length * itemSpacing);

      meshes = projects.map((project, index) => {
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 12, 7);
        const positions = geometry.attributes.position.array;
        geometry.userData.original = Float32Array.from(positions);
        const texture = textureLoader.load(getPortfolioThumb(project.img), (loaded) => {
          const aspect = loaded.image.width / loaded.image.height;
          const fitWidth = Math.min(planeWidth, planeHeight * 1.2 * aspect);
          mesh.userData.imageScaleX = fitWidth / planeWidth;
          mesh.userData.imageScaleY = fitWidth / aspect / planeHeight;
        });
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 1;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.index = index;
        mesh.userData.title = project.title;
        mesh.userData.base = index * itemSpacing;
        scene.add(mesh);
        return mesh;
      });

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let pointerStart = null;
      const onPointerDown = (event) => { pointerStart = { x: event.clientX, y: event.clientY }; };
      const onPointerCancel = () => { pointerStart = null; };
      const onPointerUp = (event) => {
        const start = pointerStart;
        pointerStart = null;
        if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(meshes.filter((mesh) => mesh.visible), false);
        if (hits[0]) {
          event.stopPropagation();
          const project = projects[hits[0].object.userData.index];
          selectRef.current?.(project);
        }
      };

      const resize = () => {
        const rect = mount.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        renderer.setSize(width, height, false);
        const aspect = width / height;
        camera.left = -5.8 * aspect;
        camera.right = 5.8 * aspect;
        camera.top = 3.4;
        camera.bottom = -3.4;
        camera.updateProjectionMatrix();
        curve = buildCurve(aspect);
      };

      const startTime = performance.now();
      const animate = () => {
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;

        meshes.forEach((mesh, index) => {
          const rawT = (mesh.userData.base + scrollRef.current * loopLength + elapsed * 0.018) % loopLength;
          const t = rawT > 1 ? rawT - loopLength : rawT;
          const isInActiveBand = t >= -0.08 && t <= 1.05;
          const isExiting = flyawayRef.current?.title === mesh.userData.title;
          mesh.visible = isInActiveBand || isExiting;
          if (!mesh.visible) return;

          const curveT = clamp(t, 0, 1);
          const point = curve.getPointAt(curveT);
          const tangent = curve.getTangentAt(curveT);
          const pull = Math.pow(curveT, 1.8);
          let scale = isCompact
            ? THREE.MathUtils.lerp(0.82, 0.2, pull)
            : THREE.MathUtils.lerp(1.0, 0.2, pull);
          const flutter = Math.sin(elapsed * 1.8 + index) * (isCompact ? 0.04 : 0.1);
          let x = point.x;
          let y = point.y + flutter;
          let z = 1.2 - t;
          let rotationZ = Math.atan2(tangent.y, tangent.x) + Math.sin(elapsed + index) * 0.12;
          let rotationY = Math.sin(elapsed * 0.7 + index * 1.4) * 0.22;
          const edgeFade = Math.min(
            1,
            THREE.MathUtils.clamp((t + 0.06) / 0.12, 0, 1),
            THREE.MathUtils.clamp((1.04 - t) / 0.14, 0, 1)
          );
          let opacity = 0.92 * edgeFade;

          if (isExiting) {
            const exitProgress = clamp((now - flyawayRef.current.startedAt) / PORTFOLIO_FLYAWAY_MS);
            const eased = 1 - Math.pow(1 - exitProgress, 3);
            x = THREE.MathUtils.lerp(x, 0, eased);
            y = THREE.MathUtils.lerp(y, -1.38, eased);
            z = THREE.MathUtils.lerp(z, 3.2, eased);
            scale = THREE.MathUtils.lerp(scale, 0.44, eased);
            rotationZ = THREE.MathUtils.lerp(rotationZ, 0, eased);
            rotationY = THREE.MathUtils.lerp(rotationY, 0, eased);
            opacity *= Math.max(0, 1 - eased);
          }

          mesh.position.set(x, y, z);
          mesh.scale.set(scale * (mesh.userData.imageScaleX || 1), scale * (mesh.userData.imageScaleY || 1), scale);
          mesh.rotation.z = rotationZ;
          mesh.rotation.y = rotationY;
          mesh.material.opacity = opacity;

          const position = mesh.geometry.attributes.position;
          const original = mesh.geometry.userData.original;
          for (let i = 0; i < position.array.length; i += 3) {
            const originalX = original[i];
            const originalY = original[i + 1];
            position.array[i] = originalX + Math.sin(originalY * 6 + elapsed * 2 + index) * 0.055;
            position.array[i + 1] = originalY + Math.sin(originalX * 4 + elapsed * 1.6 + index) * 0.045;
            position.array[i + 2] = original[i + 2] + Math.sin((originalX + originalY) * 4 + elapsed * 2.2 + index) * 0.16 * (1 - pull);
          }
          position.needsUpdate = true;
        });

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };

      resize();
      animate();
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointerup', onPointerUp);
      renderer.domElement.addEventListener('pointercancel', onPointerCancel);
      window.addEventListener('resize', resize);

      return () => {
        cancelAnimationFrame(rafId);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        renderer.domElement.removeEventListener('pointercancel', onPointerCancel);
        window.removeEventListener('resize', resize);
        meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          mesh.material.map?.dispose();
          mesh.material.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    } catch {
      cancelAnimationFrame(rafId);
      meshes.forEach((mesh) => {
        mesh.geometry?.dispose();
        mesh.material?.map?.dispose();
        mesh.material?.dispose();
      });
      renderer?.dispose?.();
      renderer?.domElement?.remove?.();
      queueMicrotask(() => setWebglUnavailable(true));
      return undefined;
    }
  }, [isCompact, projects, webglUnavailable]);

  if (webglUnavailable) {
    return (
      <PortfolioFallbackRibbon
        projects={projects}
        scrollOffset={scrollOffset}
        flyawayProjectTitle={flyawayProjectTitle}
        onSelect={onSelect}
        isCompact={isCompact}
      />
    );
  }

  return <div ref={mountRef} className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing" aria-hidden="true" />;
};

export default function HeroPortfolioExperience({ isOpen, onClose }) {
  const experienceRef = useRef(null);
  const indexToggleRef = useRef(null);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [phase, setPhase] = useState('intro');
  const [introReady, setIntroReady] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedShotIndex, setSelectedShotIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hiddenProjectTitle, setHiddenProjectTitle] = useState(null);
  const [flyawayProjectTitle, setFlyawayProjectTitle] = useState(null);
  const touchRef = useRef(null);
  const flyawayTimeoutRef = useRef(0);
  const isCompact = usePortfolioCompact();

  const selectedIndex = selectedProject ? portfolioSlides.findIndex((project) => project.title === selectedProject.title) : -1;
  const selectedShots = selectedProject?.shots?.length ? selectedProject.shots : selectedProject ? [selectedProject.img] : [];
  const normalizedShotIndex = selectedShots.length ? ((selectedShotIndex % selectedShots.length) + selectedShots.length) % selectedShots.length : 0;
  const selectedShot = selectedShots[normalizedShotIndex];
  const visibleProjects = useMemo(
    () => portfolioSlides.filter((project) => project.title !== hiddenProjectTitle),
    [hiddenProjectTitle]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setPhase('intro');
      setIsIndexOpen(false);
      experienceRef.current?.querySelector('.portfolio-home')?.focus({ preventScroll: true });
      setIntroReady(false);
      setSelectedProject(null);
      setSelectedShotIndex(0);
      setIsPreviewOpen(false);
      setHiddenProjectTitle(null);
      setFlyawayProjectTitle(null);
      setScrollOffset(.035);
    });
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cancelled = true;
      window.clearTimeout(flyawayTimeoutRef.current);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const nudge = (delta) => {
    setScrollOffset((value) => {
      const next = (value + delta) % 1;
      return next < 0 ? next + 1 : next;
    });
  };

  const handleWheel = (event) => {
    if (event.target.closest('[data-portfolio-ui]')) return;
    nudge((event.deltaY + event.deltaX) * 0.0007);
  };

  const handleTouchStart = (event) => {
    touchRef.current = event.target.closest('[data-portfolio-ui]') ? null : event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event) => {
    if (touchRef.current == null) return;
    const nextX = event.touches[0]?.clientX ?? touchRef.current;
    nudge((touchRef.current - nextX) * 0.002);
    touchRef.current = nextX;
  };

  const closePreview = () => {
    window.clearTimeout(flyawayTimeoutRef.current);
    setFlyawayProjectTitle(null);
    setHiddenProjectTitle(null);
    setIsPreviewOpen(false);
    indexToggleRef.current?.focus({ preventScroll: true });
  };

  const handleSelectProject = (project) => {
    setIsIndexOpen(false);
    window.clearTimeout(flyawayTimeoutRef.current);
    setSelectedProject(project);
    setSelectedShotIndex(0);
    setIsPreviewOpen(false);
    setHiddenProjectTitle(null);
    setFlyawayProjectTitle(project.title);

    flyawayTimeoutRef.current = window.setTimeout(() => {
      setHiddenProjectTitle(project.title);
      setIsPreviewOpen(true);
      setFlyawayProjectTitle(null);
      requestAnimationFrame(() => experienceRef.current?.querySelector('.portfolio-project-heading')?.focus({ preventScroll: true }));
    }, PORTFOLIO_FLYAWAY_MS);
  };

  const reopenPreview = () => {
    if (!selectedProject) return;
    setHiddenProjectTitle(selectedProject.title);
    setIsPreviewOpen(true);
  };

  const goToShot = (step) => {
    if (!selectedShots.length) return;
    setSelectedShotIndex((index) => (index + step + selectedShots.length) % selectedShots.length);
  };

  const handleGalleryPointerDown = (event) => {
    if (phase !== 'gallery' || !isPreviewOpen) return;
    if (event.target.closest('[data-portfolio-preview]')) return;
    closePreview();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      if (isIndexOpen) {
        setIsIndexOpen(false);
        indexToggleRef.current?.focus({ preventScroll: true });
      } else if (isPreviewOpen) closePreview();
      else onClose();
    }
    if (event.key === 'Tab') {
      const controls = [...experienceRef.current.querySelectorAll('button:not(:disabled), a[href]')]
        .filter((element) => element.tabIndex >= 0 && !element.closest('[inert]') && element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      const focusOutside = !experienceRef.current.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusOutside)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusOutside)) {
        event.preventDefault(); first?.focus();
      }
    }
    if (!isIndexOpen && phase === 'gallery' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      if (isPreviewOpen) goToShot(direction);
      else nudge(direction * .035);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
          ref={experienceRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-heading"
          onKeyDown={handleKeyDown}
          className="portfolio-experience fixed inset-0 z-[240] overflow-hidden"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <video
            className="absolute inset-0 z-0 h-full w-full object-cover saturate-[1.18] contrast-[1.08]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={PORTFOLIO_IDLE_VIDEO} type="video/mp4" />
            <source src={PORTFOLIO_IDLE_SOURCE_VIDEO} type="video/mp4" />
          </video>

          <div className="portfolio-topbar" data-portfolio-ui>
            <img className="portfolio-topbar__brand" src={BRAND_MARK_WHITE} alt="80M" />
            <button type="button" onClick={onClose} className="portfolio-home" aria-label="Back to home"><span aria-hidden="true">←</span> Home</button>
          </div>

          {phase === 'intro' && (
            <MotionDiv
              key="portfolio-intro"
              className="absolute inset-0 z-50 bg-transparent"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <video
                className={`h-full w-full object-cover ${introReady ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                playsInline
                muted
                preload="auto"
                onLoadedData={() => setIntroReady(true)}
                onCanPlay={() => setIntroReady(true)}
                onPlaying={() => setIntroReady(true)}
                onEnded={() => setPhase('gallery')}
                onError={() => setPhase('gallery')}
              >
                <source src={PORTFOLIO_INTRO_VIDEO} type="video/mp4" />
                <source src={PORTFOLIO_INTRO_SOURCE_VIDEO} type="video/mp4" />
              </video>
            </MotionDiv>
          )}

          <MotionDiv
            className="absolute inset-0 z-10"
            initial={false}
            animate={{ opacity: phase === 'gallery' ? 1 : 0 }}
            transition={{ duration: 0 }}
            inert={phase !== 'gallery'}
            onPointerDown={handleGalleryPointerDown}
          >
            <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(7,87,130,.12),transparent_65%)]" />
            {!isPreviewOpen && !isIndexOpen && <PortfolioStudioBackdrop />}
            <div className={`portfolio-gallery-layer ${isPreviewOpen || isIndexOpen ? 'portfolio-gallery-layer--muted' : ''}`} inert={isPreviewOpen || isIndexOpen || phase !== 'gallery'}>
              <PortfolioThreeRibbon
                projects={visibleProjects}
                scrollOffset={scrollOffset}
                flyawayProjectTitle={flyawayProjectTitle}
                onSelect={handleSelectProject}
                isCompact={isCompact}
              />
            </div>
            <PortfolioMasthead isPreviewOpen={isPreviewOpen || isIndexOpen} />
            <AnimatePresence mode="wait">
              {selectedProject && selectedShot && isPreviewOpen && !isIndexOpen && (
                <PortfolioProjectViewer
                  key={selectedProject.title}
                  project={selectedProject} shots={selectedShots} shotIndex={normalizedShotIndex}
                  projectIndex={selectedIndex} total={portfolioSlides.length}
                  goToShot={goToShot} closePreview={closePreview}
                />
              )}
              {isIndexOpen && <PortfolioProjectIndex key="project-index" projects={portfolioSlides} selectedProject={selectedProject} onSelect={handleSelectProject} onClose={() => { setIsIndexOpen(false); indexToggleRef.current?.focus({ preventScroll: true }); }} />}
            </AnimatePresence>
            {selectedProject && !isPreviewOpen && !flyawayProjectTitle && !isIndexOpen && (
              <button data-portfolio-preview data-portfolio-ui type="button" onPointerDown={(event) => event.stopPropagation()} onClick={reopenPreview} className="portfolio-preview-reopen">
                Open {selectedProject.title} ↗<span>Shot {normalizedShotIndex + 1} / {selectedShots.length}</span>
              </button>
            )}
            <div className={`portfolio-footer ${isPreviewOpen || isIndexOpen ? 'portfolio-footer--viewing' : ''}`} data-portfolio-preview data-portfolio-ui>
              <div className="portfolio-browse">
                <div className="portfolio-browse__buttons">
                  <button type="button" className="portfolio-icon-button" aria-label="Previous projects" disabled={isPreviewOpen || isIndexOpen} onClick={() => nudge(-.035)}>←</button>
                  <button type="button" className="portfolio-icon-button" aria-label="Next projects" disabled={isPreviewOpen || isIndexOpen} onClick={() => nudge(.035)}>→</button>
                </div>
                <p><strong>Scroll. Swipe. Explore.</strong><br />Pick a window to see more.</p>
              </div>
              <button type="button" ref={indexToggleRef} className="portfolio-index-toggle" aria-expanded={isIndexOpen} onClick={() => setIsIndexOpen((open) => !open)}><span>Jump straight in</span>All {portfolioSlides.length} projects ↗</button>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
