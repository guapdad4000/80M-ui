import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import ArtworkWindow from './ArtworkWindow';
import imageSizes from './portfolioImageSizes.json';

const thumbnail = src => src.replace('/portfolio/', '/portfolio/thumbs/').replace(/\.(png|jpe?g|webp)$/i, '.webp');

export default function FeaturedProject({ project }) {
  const [shotIndex, setShotIndex] = useState(0);
  const shots = project.shots?.length ? project.shots : [project.img];
  const label = project.shotLabels?.[shotIndex] || `${project.title} — view ${shotIndex + 1}`;
  const gallery = shots.length > 1;
  const [width, height] = imageSizes[shots[shotIndex]];
  const nextShot = direction => setShotIndex(index => (index + direction + shots.length) % shots.length);

  return (
    <Motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className={`min-w-0 work-art-project ${project.id === 'squabblemon' ? 'work-art-project--featured' : ''}`}
      aria-labelledby={`project-${project.id}`}
    >
      <ArtworkWindow variant={project.frame} src={shots[shotIndex]} alt={label} width={width} height={height} />
      <div className="work-art-caption">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">{project.kind}</p>
        <h3 id={`project-${project.id}`} className="font-serif text-3xl mb-3">{project.title}</h3>
        <p className="font-sans text-base leading-relaxed text-[#444]">{project.description}</p>
        {project.previewLabel ? <p className="work-art-preview-note">{project.previewLabel}</p> : null}
        {gallery ? (
          <div className="work-art-gallery" aria-label={`${project.title} gallery`}>
            <div className="work-art-gallery-status">
              <button type="button" onClick={() => nextShot(-1)} aria-label={`Previous ${project.title} image`}>←</button>
              <p aria-live="polite" aria-atomic="true">{shotIndex + 1} / {shots.length}<span>{label}</span></p>
              <button type="button" onClick={() => nextShot(1)} aria-label={`Next ${project.title} image`}>→</button>
            </div>
            <div className="work-art-thumbnails">
              {shots.map((shot, index) => (
                <button
                  key={shot}
                  type="button"
                  onClick={() => setShotIndex(index)}
                  aria-label={`Show ${project.shotLabels?.[index] || `${project.title} view ${index + 1}`}`}
                  aria-pressed={shotIndex === index}
                >
                  <img src={thumbnail(shot)} alt="" width="160" height="90" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <a className="work-art-live-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title}`}>Visit live site <span aria-hidden="true">↗</span></a>
      </div>
    </Motion.article>
  );
}
