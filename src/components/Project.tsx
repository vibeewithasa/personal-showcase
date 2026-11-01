import Arrow from './Arrow';
import { Link } from 'react-router-dom';
import { projectCover, type PortfolioProject } from '../content/portfolio';
import Photo from './Photo';
export default function Project({
  project,
  index = 0,
  sizes = '90vw',
}: {
  project: PortfolioProject;
  index?: number;
  sizes?: string;
}) {
  const cover = projectCover(project);
  return (
    <article className="project-card">
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`View ${project.title}`}
      >
        <div
          className="project-image"
          style={
            project.coverAspectRatio
              ? { aspectRatio: project.coverAspectRatio }
              : undefined
          }
        >
          {cover ? (
            <Photo
              key={cover.src}
              photo={cover}
              eager={index === 0}
              fit={project.coverFit || 'contain'}
              sizes={sizes}
            />
          ) : (
            <span className="photo-fallback">Gallery coming soon</span>
          )}
          <span className="image-cta" aria-hidden="true">
            View project <Arrow />
          </span>
        </div>
        <div className="project-label">
          <span className="index">{String(index + 1).padStart(2, '0')}</span>
          <h2>{project.title}</h2>
          <span aria-hidden="true">
            <Arrow />
          </span>
        </div>
      </Link>
    </article>
  );
}
