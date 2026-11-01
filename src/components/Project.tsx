import { Link } from 'react-router-dom';
import type { PortfolioProject } from '../content/schema';
import PortfolioImage from './PortfolioImage';

export default function Project({ project, reverse = false }: { project: PortfolioProject; reverse?: boolean }) {
  return (
    <article className={`project-row ${reverse ? 'is-reversed' : ''}`}>
      <Link className="project-image-link" to={`/work/${project.slug}`} aria-label={`View ${project.title}`}>
        <PortfolioImage image={project.cover} />
        <span className="image-action" aria-hidden="true">View project ↗</span>
      </Link>
      <div className="project-copy">
        {(project.category || project.year) && <p className="project-meta small">{[project.category, project.year].filter(Boolean).join(' / ')}</p>}
        <h3><Link to={`/work/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.summary}</p>
        <Link className="text-link" to={`/work/${project.slug}`}>Explore project <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}
