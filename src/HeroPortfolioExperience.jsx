import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';

const PORTFOLIO_INTRO_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/202605050146.mp4";
const PORTFOLIO_INTRO_VIDEO = "/media/80m-portfolio-intro.mp4";
const PORTFOLIO_IDLE_SOURCE_VIDEO = "https://yyoxpcsspmjvolteknsn.supabase.co/storage/v1/object/public/akeems%20admin/Videos/0504(1).mp4";
const PORTFOLIO_IDLE_VIDEO = "/media/80m-hero-idle-h264.mp4";
const BRAND_MARK_WHITE = "/brand/80m-mark-white.svg";

const PORTFOLIO_FLYAWAY_MS = 420;
const MotionDiv = motion.div;
const MotionButton = motion.button;

const getPortfolioThumb = (src) => src?.replace('/portfolio/', '/portfolio/thumbs/').replace(/\.(png|jpe?g|webp)$/i, '.webp') || src;
const PORTFOLIO_ASCII_ART = String.raw`
     .--------.
 ___/  80M   \___
/  |  ^   ^   |  \
|  |    $     |  |
\__|  \___/   |__/
   '---. .---'
      /|_|\
    _/ / \ \_
   /__/   \__\
`;

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

function loadContainedTexture(src, fallbackSrc) {
  const sourceList = [src, fallbackSrc].filter(Boolean);

  return new Promise((resolve, reject) => {
    const trySource = (index) => {
      const source = sourceList[index];
      if (!source) {
        reject(new Error('Portfolio texture failed to load.'));
        return;
      }

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 900;
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Portfolio texture canvas unavailable.'));
          return;
        }

        const planeAspect = canvas.width / canvas.height;
        const imageAspect = image.naturalWidth / Math.max(1, image.naturalHeight);
        const drawWidth = imageAspect > planeAspect ? canvas.width : canvas.height * imageAspect;
        const drawHeight = imageAspect > planeAspect ? canvas.width / imageAspect : canvas.height;
        const drawX = (canvas.width - drawWidth) / 2;
        const drawY = (canvas.height - drawHeight) / 2;

        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgb(245, 241, 232)');
        gradient.addColorStop(0.52, 'rgb(216, 232, 191)');
        gradient.addColorStop(1, 'rgb(28, 49, 38)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        resolve(texture);
      };
      image.onerror = () => trySource(index + 1);
      image.src = source;
    };

    trySource(0);
  });
}

const PortfolioFallbackRibbon = ({ projects, scrollOffset, flyawayProjectTitle, onSelect, isCompact = false }) => (
  <div className="absolute inset-0 z-20 overflow-hidden">
    {projects.map((project, index) => {
      const total = Math.max(projects.length, 1);
      const t = (index / total + scrollOffset) % 1;
      const pull = Math.pow(t, 1.4);
      const left = isCompact ? 13 + t * 74 : -2 + t * 106;
      const top = isCompact ? 66 - t * 34 + Math.sin(t * Math.PI * 2) * 5 : 16 + Math.sin(t * Math.PI * 2) * 10 + pull * 24;
      const scale = isCompact ? 0.86 - pull * 0.34 : 0.98 - pull * 0.42;
      const opacity = t > 0.9 ? Math.max(0.12, (1 - t) / 0.1) : 0.9;
      const isExiting = project.title === flyawayProjectTitle;

      return (
        <button
          key={project.title}
          type="button"
          aria-label={`Select ${project.title}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onSelect?.(project)}
          className="absolute aspect-[2.25/1.36] w-36 overflow-hidden border-2 border-[#111]/70 bg-[#eae7de]/45 p-1 shadow-[5px_5px_0_rgba(17,17,17,0.42)] backdrop-blur-sm transition-[left,top,opacity,transform] duration-500 hover:scale-105 md:w-60"
          style={{
            left: isExiting ? '50%' : `${left}%`,
            top: isExiting ? '52%' : `${top}%`,
            opacity: isExiting ? 0 : opacity,
            transform: isExiting
              ? 'translate3d(-50%, -50%, 0) rotate(0deg) scale(0.38)'
              : `translate3d(-50%, -50%, 0) rotate(${Math.sin(index) * 7}deg) scale(${scale})`,
          }}
        >
          <img src={getPortfolioThumb(project.img)} alt="" className="h-full w-full object-cover opacity-90" />
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
            point(0.22, 0.62),
            point(0.29, 0.55),
            point(0.38, 0.49),
            point(0.48, 0.44),
            point(0.62, 0.38),
            point(0.74, 0.33),
            point(0.86, 0.30),
            point(0.94, 0.31),
          ]);
        }

        return new THREE.CatmullRomCurve3([
          point(0.13, 0.72),
          point(0.19, 0.66),
          point(0.28, 0.58),
          point(0.38, 0.48),
          point(0.44, 0.36),
          point(0.56, 0.46),
          point(0.66, 0.34),
          point(0.75, 0.46),
          point(0.82, 0.51),
          point(0.86, 0.51),
        ]);
      };

      let curve = buildCurve(16 / 9);
      const textureLoader = new THREE.TextureLoader();
      const planeWidth = isCompact ? 1.62 : 2.12;
      const planeHeight = isCompact ? 0.98 : 1.28;

      meshes = projects.map((project, index) => {
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 12, 7);
        const positions = geometry.attributes.position.array;
        geometry.userData.original = Float32Array.from(positions);
        const texture = textureLoader.load(getPortfolioThumb(project.img));
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
        mesh.userData.base = index / Math.max(projects.length, 1);
        scene.add(mesh);
        return mesh;
      });

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const onPointerDown = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(meshes, false);
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
          const t = (mesh.userData.base + scrollRef.current + elapsed * 0.018) % 1;
          const point = curve.getPointAt(t);
          const tangent = curve.getTangentAt(t);
          const pull = Math.pow(t, 1.8);
          let scale = isCompact
            ? THREE.MathUtils.lerp(0.82, 0.2, pull)
            : THREE.MathUtils.lerp(1.0, 0.2, pull);
          const flutter = Math.sin(elapsed * 1.8 + index) * (isCompact ? 0.04 : 0.1);
          let x = point.x;
          let y = point.y + flutter;
          let z = 1.2 - t;
          let rotationZ = Math.atan2(tangent.y, tangent.x) + Math.sin(elapsed + index) * 0.12;
          let rotationY = Math.sin(elapsed * 0.7 + index * 1.4) * 0.22;
          let opacity = t > 0.9 ? THREE.MathUtils.clamp((1 - t) / 0.1, 0.08, 0.9) : 0.92;

          if (flyawayRef.current?.title === mesh.userData.title) {
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
          mesh.scale.set(scale, scale, scale);
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
      window.addEventListener('resize', resize);

      return () => {
        cancelAnimationFrame(rafId);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
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

const PortfolioFabricFallback = ({ imageSrc, fallbackSrc, project }) => {
  const [src, setSrc] = useState(imageSrc);

  useEffect(() => {
    setSrc(imageSrc);
  }, [imageSrc]);

  return (
    <div className="relative h-full w-full overflow-visible">
      <style>{`
        @keyframes portfolioFabricFallbackWave {
          0%, 100% { transform: perspective(900px) rotateX(4deg) rotateY(-5deg) skewY(-0.8deg) translate3d(0, 0, 0); }
          50% { transform: perspective(900px) rotateX(-2deg) rotateY(5deg) skewY(1.1deg) translate3d(0, -1.2%, 0); }
        }
      `}</style>
      <img
        src={src}
        data-fallback={fallbackSrc}
        alt={`${project.title} screenshot`}
        className="h-full w-full object-contain drop-shadow-[0_34px_48px_rgba(0,0,0,0.58)]"
        style={{
          animation: 'portfolioFabricFallbackWave 5.4s ease-in-out infinite',
          transformOrigin: 'center',
        }}
        onError={(event) => {
          const fallback = event.currentTarget.dataset.fallback;
          if (!fallback || fallback === src) return;
          event.currentTarget.dataset.fallback = '';
          setSrc(fallback);
        }}
      />
    </div>
  );
};

const PortfolioFabricPreview = ({ project, imageSrc, fallbackSrc }) => {
  const mountRef = useRef(null);
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const meshRef = useRef(null);
  const textureRef = useRef(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    if (webglUnavailable) return undefined;

    const mount = mountRef.current;
    if (!mount) return undefined;
    if (!canCreatePortfolioWebGL()) {
      queueMicrotask(() => setWebglUnavailable(true));
      return undefined;
    }

    let renderer;
    let rafId = 0;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-4, 4, 2.35, -2.35, 0.1, 30);
      camera.position.set(0, 0, 8);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      const fabricWidth = 5.8;
      const fabricHeight = 3.26;
      const geometry = new THREE.PlaneGeometry(fabricWidth, fabricHeight, 64, 36);
      geometry.userData.original = Float32Array.from(geometry.attributes.position.array);
      const shadowGeometry = new THREE.PlaneGeometry(fabricWidth, fabricHeight, 1, 1);
      const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x020611,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.FrontSide,
        depthWrite: true,
      });
      material.visible = false;
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
      const mesh = new THREE.Mesh(geometry, material);
      shadow.position.set(0.12, -0.16, -0.34);
      shadow.scale.set(1.025, 1.025, 1);
      mesh.position.set(0, 0, 0);
      scene.add(shadow);
      scene.add(mesh);

      geometryRef.current = geometry;
      materialRef.current = material;
      meshRef.current = mesh;

      const resize = () => {
        const rect = mount.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        const aspect = width / height;
        const baseViewHeight = width < 680 ? 4.62 : 4.7;
        const viewHeight = Math.max(baseViewHeight, (fabricWidth / aspect) * 1.14, fabricHeight * 1.28);
        camera.top = viewHeight / 2;
        camera.bottom = -viewHeight / 2;
        camera.left = (-viewHeight * aspect) / 2;
        camera.right = (viewHeight * aspect) / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const startTime = performance.now();
      const animate = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const geometryPosition = geometry.attributes.position;
        const original = geometry.userData.original;

        for (let i = 0; i < geometryPosition.array.length; i += 3) {
          const x = original[i];
          const y = original[i + 1];
          const edge = Math.pow(Math.abs(x) / (fabricWidth / 2), 1.45);
          const ripple = Math.sin(x * 1.75 + elapsed * 1.25) * 0.055;
          const crossRipple = Math.sin((x + y) * 2.8 - elapsed * 0.96) * 0.024;
          geometryPosition.array[i] = x + Math.sin(y * 3.2 + elapsed * 1.05) * 0.028 * (0.22 + edge);
          geometryPosition.array[i + 1] = y + Math.sin(x * 2.15 - elapsed * 0.7) * 0.016;
          geometryPosition.array[i + 2] = (ripple + crossRipple) * (0.18 + edge * 0.42);
        }

        geometryPosition.needsUpdate = true;
        mesh.rotation.x = -0.032 + Math.sin(elapsed * 0.65) * 0.015;
        mesh.rotation.y = Math.sin(elapsed * 0.5) * 0.032;
        shadow.rotation.copy(mesh.rotation);
        material.visible = Boolean(textureRef.current);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };

      resize();
      animate();
      window.addEventListener('resize', resize);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        textureRef.current?.dispose();
        shadowMaterial.dispose();
        material.dispose();
        shadowGeometry.dispose();
        geometry.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        textureRef.current = null;
        geometryRef.current = null;
        materialRef.current = null;
        meshRef.current = null;
      };
    } catch {
      renderer?.dispose?.();
      renderer?.domElement?.remove?.();
      queueMicrotask(() => setWebglUnavailable(true));
      return undefined;
    }
  }, [webglUnavailable]);

  useEffect(() => {
    if (webglUnavailable || !imageSrc) return undefined;

    let cancelled = false;
    loadContainedTexture(imageSrc, fallbackSrc)
      .then((texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        const material = materialRef.current;
        if (!material) {
          texture.dispose();
          return;
        }
        textureRef.current?.dispose();
        textureRef.current = texture;
        material.map = texture;
        material.visible = true;
        material.needsUpdate = true;
      })
      .catch(() => {
        if (!cancelled) setWebglUnavailable(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackSrc, imageSrc, webglUnavailable]);

  if (webglUnavailable) {
    return <PortfolioFabricFallback imageSrc={imageSrc} fallbackSrc={fallbackSrc} project={project} />;
  }

  return <div ref={mountRef} className="h-full w-full" aria-label={`${project.title} fabric preview`} />;
};

const PortfolioAtmScrollRail = () => (
  <div className="pointer-events-none absolute right-4 top-14 z-40 hidden h-24 w-12 md:block" aria-hidden="true">
    <style>{`
      @keyframes portfolioAtmBlink {
        0%, 92%, 100% { transform: scaleY(1); }
        96% { transform: scaleY(0.12); }
      }
      @keyframes portfolioBillSuck {
        0% { transform: translate3d(var(--bill-x), calc(100vh + 2rem), 0) rotate(var(--bill-rotate)) scale(0.82); opacity: 0; }
        12% { opacity: 1; }
        78% { opacity: 1; }
        100% { transform: translate3d(0, 1.5rem, 0) rotate(4deg) scale(0.36); opacity: 0; }
      }
      .portfolio-atm-eye { transform-origin: center; animation: portfolioAtmBlink 4s infinite; }
      .portfolio-bill-suck { animation: portfolioBillSuck 1.8s linear infinite; }
    `}</style>
    <div className="absolute right-0 top-0 h-24 w-12">
      {[0, 1, 2, 3].map((bill) => (
        <span
          key={bill}
          className="portfolio-bill-suck absolute bottom-1 right-3 h-2 w-6 rounded-sm border border-green-800 bg-green-500 shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
          style={{
            animationDelay: `${bill * -0.42}s`,
            '--bill-x': `${(bill - 1.5) * 1.15}rem`,
            '--bill-rotate': `${bill % 2 ? -18 : 16}deg`,
          }}
        />
      ))}
      <div className="relative z-10 flex h-full w-full flex-col items-center rounded-[4px] border-b-4 border-r-[3px] border-[#b5b3a3] bg-[#dfddd0]/95 p-1 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
        <div className="mt-0.5 flex h-8 w-10 items-center justify-center rounded-[3px] border-[1.5px] border-[#1f1e1c] bg-[#2e2d2b] p-[2px] shadow-inner">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2px] bg-[#facc15]">
            <div className="absolute inset-0 rounded-[2px] bg-gradient-to-br from-white/25 to-transparent" />
            <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-sm">
              <circle className="portfolio-atm-eye" cx="7" cy="9" r="2" fill="#111" />
              <circle className="portfolio-atm-eye" cx="17" cy="9" r="2" fill="#111" />
              <path d="M6 13.5c2.5 3.5 7.5 3.5 12 0" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>
        <div className="mt-1 flex w-10 items-center justify-between px-0.5">
          <div className="flex gap-[1px]">
            {[...Array(6)].map((_, index) => <span key={index} className="h-1.5 w-[1px] bg-black/20" />)}
          </div>
          <span className="h-1 w-1.5 rounded-[0.5px] bg-black" />
        </div>
        <div className="mt-1.5 w-8 rounded-[2px] border-l border-t border-black/10 bg-[#cbc9ba] p-1 shadow-inner">
          <div className="grid grid-cols-3 gap-[1.5px]">
            {[...Array(12)].map((_, index) => <span key={index} className="h-[2px] rounded-[0.5px] bg-[#444] shadow-sm" />)}
          </div>
        </div>
        <div className="mt-2 flex w-full justify-end px-2">
          <div className="flex flex-col items-center gap-[1px]">
            <span className="h-[1.5px] w-3 rounded-full bg-zinc-800 shadow-inner" />
            <span className="h-[2px] w-[2px] rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]" />
          </div>
        </div>
        <div className="mb-1 mt-auto flex h-2 w-9 items-center justify-center rounded-sm border-[1px] border-zinc-500 bg-zinc-400 shadow-inner">
          <span className="h-[1.5px] w-6 rounded-full bg-zinc-900" />
        </div>
      </div>
    </div>
  </div>
);

const PortfolioAsciiBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 z-[12] overflow-hidden" aria-hidden="true">
    <pre
      className="absolute left-[47%] top-[43%] -translate-x-1/2 -translate-y-1/2 -rotate-[7deg] select-none font-mono text-[30px] font-black leading-[0.88] md:left-[50%] md:top-[48%] md:text-[60px] lg:text-[72px]"
      style={{
        color: 'rgba(217, 255, 72, 0.38)',
        textShadow: '0 0 36px rgba(217, 255, 72, 0.32), 0 8px 30px rgba(0, 0, 0, 0.5)',
        mixBlendMode: 'screen',
      }}
    >
      {PORTFOLIO_ASCII_ART}
    </pre>
  </div>
);

const PortfolioMasthead = ({ selectedProject }) => (
  <div className="pointer-events-none absolute left-3 right-[6.4rem] top-3 z-[72] md:left-8 md:right-auto md:top-7 md:w-[440px]">
    <div className="px-1 py-1 text-white md:px-0 md:py-0">
      <div className="flex items-center gap-3 md:gap-4">
        <span className="flex h-16 w-24 shrink-0 items-center overflow-visible md:h-24 md:w-36">
          <img src={BRAND_MARK_WHITE} alt="80m" className="h-full w-auto origin-left scale-125 object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.82)]" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-black uppercase leading-none tracking-[0.18em] text-[#d9ff48] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] md:text-[10px]">
            {selectedProject ? selectedProject.desc : 'Selected work'}
          </p>
          <h1 className="mt-1 font-serif text-3xl font-black leading-[0.88] text-white drop-shadow-[2px_3px_0_rgba(17,17,17,0.92)] md:text-5xl">
            Portfolio
          </h1>
        </div>
      </div>
    </div>
  </div>
);

const PortfolioDetailDock = ({
  selectedProject,
  selectedShots,
  normalizedShotIndex,
  selectedIndex,
  goToShot,
  closePreview,
}) => (
  <MotionDiv
    data-portfolio-preview
    key="portfolio-detail-dock"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 18 }}
    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    onPointerDown={(event) => event.stopPropagation()}
    className="absolute inset-x-3 bottom-3 z-[70] p-1 text-white md:bottom-7 md:left-8 md:right-auto md:w-[min(640px,calc(100vw-4rem))] md:p-0"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[9px] font-black uppercase leading-none tracking-[0.18em] text-[#d9ff48] drop-shadow-[0_2px_8px_rgba(0,0,0,0.92)] md:text-[10px]">
          Shot {normalizedShotIndex + 1} / {selectedShots.length} / Project {selectedIndex + 1} / {portfolioSlides.length}
        </p>
        <h2 className="mt-1 font-serif text-3xl font-black leading-[0.9] text-white drop-shadow-[2px_3px_0_rgba(17,17,17,0.92)] md:text-5xl">
          {selectedProject.title}
        </h2>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        <button
          type="button"
          onClick={() => goToShot(-1)}
          disabled={selectedShots.length <= 1}
          className="flex h-9 w-9 items-center justify-center border-2 border-[#d9ff48] bg-black/20 font-mono text-lg font-black leading-none text-[#d9ff48] shadow-[0_0_18px_rgba(217,255,72,0.32)] backdrop-blur-[2px] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 md:h-11 md:w-11 md:text-xl"
          aria-label="Previous screenshot"
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={() => goToShot(1)}
          disabled={selectedShots.length <= 1}
          className="flex h-9 w-9 items-center justify-center border-2 border-[#d9ff48] bg-black/20 font-mono text-lg font-black leading-none text-[#d9ff48] shadow-[0_0_18px_rgba(217,255,72,0.32)] backdrop-blur-[2px] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 md:h-11 md:w-11 md:text-xl"
          aria-label="Next screenshot"
        >
          &gt;
        </button>
        <button
          type="button"
          onClick={closePreview}
          className="flex h-9 w-9 items-center justify-center border-2 border-white/80 bg-black/20 font-mono text-base font-black leading-none text-white shadow-[0_0_18px_rgba(0,0,0,0.42)] backdrop-blur-[2px] transition-transform hover:-translate-y-0.5 md:h-11 md:w-11"
          aria-label="Close preview"
        >
          x
        </button>
      </div>
    </div>

    <p className="mt-2 max-w-2xl font-sans text-sm font-extrabold leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.94)] md:mt-3 md:text-base">
      {selectedProject.subtitle}
    </p>

    {selectedProject.url && (
      <a
        href={selectedProject.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex border-2 border-white/75 bg-black/20 px-4 py-2 font-sans text-xs font-black uppercase leading-none tracking-wider text-white shadow-[0_0_18px_rgba(0,0,0,0.34)] backdrop-blur-[2px] transition-transform hover:-translate-y-0.5"
      >
        Open Project
      </a>
    )}
  </MotionDiv>
);

const portfolioSlides = [
  {
    img: "/portfolio/vans-hyphy-yacht-club.png",
    shots: ["/portfolio/vans-hyphy-yacht-club.png"],
    title: "Vans Yacht Club x Hyphy Burger",
    desc: "3D CAMPAIGN DECK",
    subtitle: "Scroll-driven Vercel pitch deck with a yellow-bus delivery world, Vans colorway storytelling, Hyphy Burger food assets, and 3D lane choreography built around the product.",
    url: "https://vansxguapdadxtwnshp.vercel.app",
  },
  {
    img: "/portfolio/blackline-executive.png",
    shots: ["/portfolio/blackline-executive.png"],
    title: "Blackline Executive",
    desc: "3D LUXURY TRANSPORT MVP",
    subtitle: "Cinematic black-car landing page with a scroll-driven 3D Suburban, red-carpet hero staging, paparazzi light hits, and UI lanes tuned around the vehicle.",
    url: "https://blackline-executive-kappa.vercel.app",
  },
  {
    img: "/portfolio/hyphyburger.png",
    shots: ["/portfolio/hyphyburger.png", "/portfolio/hyphyburger-game.png", "/portfolio/hyphyburger-menu.png"],
    title: "HyphyBurger.com",
    desc: "RESTAURANT WEBSITE",
    subtitle: "Menu-first site with appetite-heavy visuals, a mini-game moment, local conversion, and franchise-ready brand energy.",
    url: "https://hyphyburger.com",
  },
  {
    img: "/portfolio/highroller-home.png",
    shots: ["/portfolio/highroller-home.png", "/portfolio/highroller-products.png", "/portfolio/highroller-minimal.png"],
    title: "High Roller",
    desc: "CANNABIS SHOP",
    subtitle: "Cannabis retail concept with slot-machine energy, bold product storytelling, and a premium shop direction.",
    url: "https://highrollershop.com",
  },
  {
    img: "/portfolio/caviarbutter-home.png",
    shots: ["/portfolio/caviarbutter-home.png", "/portfolio/caviarbutter-products.png", "/portfolio/caviarbutter-alt.png"],
    title: "Caviar Butter LA",
    desc: "BEAUTY STORE",
    subtitle: "Body-butter storefront system with luxury product framing, education copy, and clean ecommerce sections.",
    url: "https://caviarbutterla.com",
  },
  {
    img: "/portfolio/lane-athletics-hero.png",
    shots: ["/portfolio/lane-athletics-hero.png", "/portfolio/lane-athletics-commerce.png"],
    title: "Lane Athletics",
    desc: "ATHLETIC STORE MVP",
    subtitle: "Black-and-white performance storefront with kinetic commerce panels, category rails, product cards, and premium sportswear direction.",
    url: "https://lane-athletics-mvp.vercel.app",
  },
  {
    img: "/portfolio/gurag-commerce-hero.png",
    shots: ["/portfolio/gurag-commerce-hero.png", "/portfolio/gurag-protocol-logo.png", "/portfolio/gurag-system-map.png", "/portfolio/gurag-product-32.png", "/portfolio/gurag-product-34.png", "/portfolio/gurag-packaging.png", "/portfolio/gurag-brand-sheet.png", "/portfolio/gurag-fabric-swatches.png", "/portfolio/gurag-durag-mockup.png"],
    title: "GURAG",
    desc: "DURAG BRAND",
    subtitle: "Durag brand identity with product mockups, fabric systems, packaging, pattern language, and preorder-ready assets.",
  },
  {
    img: "/portfolio/tagesplan-device-world.png",
    shots: ["/portfolio/tagesplan-device-world.png", "/portfolio/tagesplan-device-hero.png", "/portfolio/tagesplan.png", "/portfolio/tagesplan-planner.png", "/portfolio/tagesplan-editor.png"],
    title: "Tagesplan Forma",
    desc: "PROJECT WEBSITE",
    subtitle: "Editorial planner world with clean storytelling, premium motion, and a polished daily-use interface.",
  },
  {
    img: "/portfolio/hustlin-usa-billiards-shop.png",
    shots: ["/portfolio/hustlin-usa-billiards-shop.png", "/portfolio/hustlin-usa-billiards-intro.png", "/portfolio/hustlin-usa.png", "/portfolio/hustlin-usa-shop.png"],
    title: "Hustlin USA",
    desc: "BRAND + STORE SYSTEM",
    subtitle: "Shopify-ready storefront/admin split, inventory language, and sharper retail identity.",
    url: "https://hustlinusa.com",
  },
  {
    img: "/portfolio/kay-loves-kitchen-fridge-closed.png",
    shots: ["/portfolio/kay-loves-kitchen-fridge-closed.png", "/portfolio/kay-loves-kitchen-fridge-gallery.png", "/portfolio/kay-loves-kitchen-fridge-open.png", "/portfolio/kay-loves-kitchen-product.png"],
    title: "Kay Love's Kitchen",
    desc: "3D STORE EXPERIENCE",
    subtitle: "Interactive fridge storefront with floating menu cards, product selection, cart flow, and soft beverage-world staging.",
  },
  {
    img: "/portfolio/two-personal-youtube.png",
    shots: ["/portfolio/two-personal-youtube.png", "/portfolio/two-personal-studio-joy.png", "/portfolio/two-personal-studio-guest.png"],
    title: "Two Personal",
    desc: "PODCAST LOGO SYSTEM",
    subtitle: "Logo identity for Joy Taylor's podcast carried across the YouTube banner, studio screen, episode thumbnails, and show visuals.",
  },
  {
    img: "/portfolio/axl-mania-hub.png",
    shots: ["/portfolio/axl-mania-hub.png", "/portfolio/axl-mania-boot.png", "/portfolio/axl-mania-magi-system.png", "/portfolio/axl-mania-world.png", "/portfolio/axl-mania-music.png", "/portfolio/axl-mania-finance.png", "/portfolio/axl-mania-network.png"],
    title: "AX-L Mania.OS",
    desc: "AI COMMAND DASHBOARD",
    subtitle: "Axel Foley-inspired command dashboard with boot sequencing, hub telemetry, music, finance, world, and network operating views.",
    url: "https://github.com/guapdad4000/ax-l-mania-dashboard",
  },
  {
    img: "/portfolio/80m.png",
    shots: ["/portfolio/80m.png", "/portfolio/80m-portal.png", "/portfolio/80m-pricing.png"],
    title: "80M",
    desc: "BRAND + COURSE SYSTEM",
    subtitle: "A full-machine brand language built to feel like money moving through agents, software, courses, and onboarding.",
    url: "https://80m.guru",
  },
  {
    img: "/portfolio/80m-agent-desktop.png",
    shots: ["/portfolio/80m-agent-desktop.png"],
    title: "80M Agent Desktop",
    desc: "DESKTOP AGENT HARNESS",
    subtitle: "Packaged command center for local sessions, skills, tools, gateway controls, and live workspace preview.",
    url: "https://github.com/guapdad4000/80m-agent-desktop-v3/releases/latest",
  },
  {
    img: "/portfolio/life-os.png",
    shots: ["/portfolio/life-os.png", "/portfolio/life-os-workspace.png"],
    title: "Life OS Dashboard",
    desc: "FULL DASHBOARD APP",
    subtitle: "Dense product UI organized into a clean command center for tasks, memory, and local-first operations.",
  },
  {
    img: "/portfolio/cortex-os-system-core.png",
    shots: ["/portfolio/cortex-os-system-core.png", "/portfolio/cortex-os-agent-map.png", "/portfolio/cortex-os-debug-panel.png", "/portfolio/cortex-os-workflow-map.png", "/portfolio/cortex-os-agent-chat.png", "/portfolio/cortex-mobile.png", "/portfolio/cortex-mobile-lower.png"],
    title: "Cortex OS",
    desc: "LOCAL AGENT OS",
    subtitle: "Pale-blue operating shell for local agents, live chat, system debug panels, node maps, and compact mobile-ready workflows.",
  },
];

export default function HeroPortfolioExperience({ isOpen, onClose }) {
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
  const selectedShotFallback = getPortfolioThumb(selectedShot);
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
      setIntroReady(false);
      setSelectedProject(null);
      setSelectedShotIndex(0);
      setIsPreviewOpen(false);
      setHiddenProjectTitle(null);
      setFlyawayProjectTitle(null);
      setScrollOffset(0);
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
    event.preventDefault();
    nudge((event.deltaY + event.deltaX) * 0.0007);
  };

  const handleTouchStart = (event) => {
    touchRef.current = event.touches[0]?.clientX ?? null;
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
  };

  const handleSelectProject = (project) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
          className="fixed inset-0 z-[240] overflow-hidden bg-transparent text-white"
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

          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-[80] px-1 py-1 font-mono text-[10px] font-black uppercase leading-none tracking-[0.16em] text-[#d9ff48] drop-shadow-[0_2px_8px_rgba(0,0,0,0.92)] transition-transform hover:-translate-y-0.5 md:right-7 md:top-7 md:text-xs"
          >
            Back
          </button>

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
            onPointerDown={handleGalleryPointerDown}
          >
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_82%_55%,transparent_0,rgba(0,0,0,0.04)_34%,rgba(0,0,0,0.34)_88%),linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.2)_86%)]" />
            <PortfolioAsciiBackdrop />
            <PortfolioThreeRibbon
              projects={visibleProjects}
              scrollOffset={scrollOffset}
              flyawayProjectTitle={flyawayProjectTitle}
              onSelect={handleSelectProject}
              isCompact={isCompact}
            />
            <PortfolioAtmScrollRail />

            <PortfolioMasthead selectedProject={selectedProject} />

            <AnimatePresence mode="wait">
              {selectedProject && selectedShot && isPreviewOpen && (
                <MotionDiv
                  data-portfolio-preview
                  key={`${selectedProject.title}-${selectedShot}`}
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.97 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-[44%] z-50 h-[min(34vh,340px)] w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2 md:top-[49%] md:h-[min(58vh,560px)] md:w-[min(84vw,1120px)]"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <PortfolioFabricPreview
                    project={selectedProject}
                    imageSrc={selectedShot}
                    fallbackSrc={selectedShotFallback}
                  />
                </MotionDiv>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedProject && selectedShot && isPreviewOpen && (
                <PortfolioDetailDock
                  selectedProject={selectedProject}
                  selectedShots={selectedShots}
                  normalizedShotIndex={normalizedShotIndex}
                  selectedIndex={selectedIndex}
                  goToShot={goToShot}
                  closePreview={closePreview}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedProject && !isPreviewOpen && !flyawayProjectTitle && (
                <MotionButton
                  data-portfolio-preview
                  type="button"
                  key="portfolio-preview-chip"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={reopenPreview}
                  className="absolute bottom-3 left-1/2 z-50 flex max-w-[86vw] -translate-x-1/2 items-center gap-2 px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.92)] md:bottom-5 md:text-xs"
                >
                  Preview {selectedProject.title}
                  <span className="text-[#d9ff48]">shot {normalizedShotIndex + 1}/{selectedShots.length}</span>
                </MotionButton>
              )}
            </AnimatePresence>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
