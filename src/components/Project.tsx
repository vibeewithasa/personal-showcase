import { Link } from 'react-router-dom';
import type { PortfolioProject } from '../content/schema';
import PortfolioImage from './PortfolioImage';

export default function Project({ project, reverse = false }: { project: PortfolioProject; reverse?: boolean }) {
  return (
    <article data-motion-group className={`project-row ${reverse ? 'is-reversed' : ''}`}>
      <Link data-motion={reverse ? 'picture-reverse' : 'picture'} data-parallax className="project-image-link" to={`/work/${project.slug}`} aria-label={`View ${project.title}`}>
        <PortfolioImage image={project.cover} />
        <span className="image-action" aria-hidden="true">↗</span>
      </Link>
      <div className="project-copy">
        <h3 data-motion="line" data-order="1"><Link to={`/work/${project.slug}`}>{project.title}</Link></h3>
        {(project.category || project.date || project.year) && <p data-motion="right" data-order="2" className="project-meta small">{[project.category, project.date || project.year].filter(Boolean).join(' / ')}</p>}
        <p data-motion="rise" data-order="3">{project.summary}</p>
        <Link data-motion="right" data-order="4" className="text-link" to={`/work/${project.slug}`}>Explore project <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}
