import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ArtworkWindow from './ArtworkWindow';
import CollageArt from './CollageArt';
import imageSizes from './portfolioImageSizes.json';
import './portfolio-experience.css';

const MotionDiv = motion.div;
const thumbnail = (src) => src.replace('/portfolio/', '/portfolio/thumbs/').replace(/\.(png|jpe?g|webp)$/i, '.webp');

export function PortfolioMasthead({ isPreviewOpen }) {
  return (
    <div className={`portfolio-masthead ${isPreviewOpen ? 'portfolio-masthead--viewing' : ''}`}>
      <p className="portfolio-eyebrow">80M / Apps, websites & worlds</p>
      <h1 id="portfolio-heading"><CollageArt name="portfolio-title" text="The portfolio." eager /></h1>
      <p className="portfolio-masthead__intro">A few ideas we took <em>all the way.</em><br />Take a look around. Open something up.</p>
    </div>
  );
}

export function PortfolioStudioBackdrop() {
  return (
    <div className="portfolio-print" aria-hidden="true">
      <span className="portfolio-print__dots" />
      <span className="portfolio-print__orbit" />
    </div>
  );
}

export function PortfolioProjectViewer({ project, shots, shotIndex, projectIndex, total, goToShot, closePreview }) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);
  const shot = shots[shotIndex];
  const [width, height] = imageSizes[shot] || [16, 9];
  return (
    <MotionDiv
      data-portfolio-preview data-portfolio-ui
      className="portfolio-project-viewer"
      initial={{ opacity: 0, y: 28, scale: .96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: .97 }}
      transition={{ duration: .42, ease: [.22, 1, .36, 1] }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="portfolio-preview-stage">
        <a className="portfolio-full-size" href={shot} target="_blank" rel="noopener noreferrer" aria-label={`View full-size ${project.title} screenshot`}>Full-size <span aria-hidden="true">↗</span></a>
        <AnimatePresence mode="wait" initial={false}>
          <MotionDiv
            key={shot}
            className="portfolio-preview-frame"
            style={{ '--preview-aspect': width / height }}
            initial={{ opacity: 0, y: 8, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -8, rotate: .5 }}
            transition={{ duration: .18 }}
          >
            <ArtworkWindow src={shot} alt={`${project.title} screenshot`} width={width} height={height} variant={projectIndex % 2 ? 'flat-paper' : 'flat-black'} />
          </MotionDiv>
        </AnimatePresence>
      </div>
      <div className="portfolio-project-note">
        <span className="portfolio-project-note__tape" aria-hidden="true" />
        <div className="portfolio-project-note__top">
          <p className="portfolio-eyebrow">Project {String(projectIndex + 1).padStart(2, '0')} / {total}</p>
          <button type="button" onClick={closePreview} className="portfolio-icon-button" aria-label="Close preview">×</button>
        </div>
        <div className="portfolio-project-note__body">
          <p className="portfolio-project-note__kind">{project.kind || project.desc}</p>
          <h2 ref={headingRef} tabIndex={-1} className="portfolio-project-heading">{project.title}</h2>
          <p className="portfolio-project-note__description">{project.subtitle}</p>
          {project.previewLabel && <p className="portfolio-project-note__disclosure">{project.previewLabel}</p>}
        </div>
        <div className="portfolio-shot-controls">
          <div aria-live="polite" aria-atomic="true">
            <p className="portfolio-eyebrow">Shot {shotIndex + 1} / {shots.length} / Project {projectIndex + 1} / {total}</p>
            <p className="portfolio-shot-label">{project.shotLabels?.[shotIndex] || 'Project view'}</p>
          </div>
          <div className="portfolio-shot-controls__buttons">
            <button type="button" onClick={() => goToShot(-1)} disabled={shots.length <= 1} className="portfolio-icon-button" aria-label="Previous screenshot">←</button>
            <button type="button" onClick={() => goToShot(1)} disabled={shots.length <= 1} className="portfolio-icon-button" aria-label="Next screenshot">→</button>
          </div>
        </div>
        {project.url && <a className="portfolio-live-link" href={project.url} target="_blank" rel="noopener noreferrer">Open Project <span aria-hidden="true">↗</span></a>}
      </div>
    </MotionDiv>
  );
}

export function PortfolioProjectIndex({ projects, selectedProject, onSelect, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  return (
    <MotionDiv data-portfolio-preview data-portfolio-ui className="portfolio-index" initial={{ opacity: 0, y: 24, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: .25 }} onPointerDown={(event) => event.stopPropagation()}>
      <div className="portfolio-index__heading">
        <div><p className="portfolio-eyebrow">The full collection / {projects.length} projects</p><h2>Pick a project.</h2></div>
        <button type="button" ref={closeRef} className="portfolio-icon-button" onClick={onClose} aria-label="Close project index">×</button>
      </div>
      <div className="portfolio-index__list">
        {projects.map((project, index) => (
          <button type="button" key={project.title} className="portfolio-index__item" onClick={() => onSelect(project)} aria-label={`Open ${project.title}`} aria-current={selectedProject?.title === project.title ? 'true' : undefined}>
            <span className="portfolio-index__number">{String(index + 1).padStart(2, '0')}</span>
            <img src={thumbnail(project.img)} alt="" loading="lazy" decoding="async" />
            <span><strong>{project.title}</strong><small>{project.kind || project.desc}</small></span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </MotionDiv>
  );
}
