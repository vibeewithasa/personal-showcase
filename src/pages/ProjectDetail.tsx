import Arrow from '../components/Arrow';
import { Link, useParams } from 'react-router-dom';
import { portfolio } from '../content/portfolio';
import Gallery from '../components/Gallery';
import NotFound from './NotFound';
export default function ProjectDetail() {
  const { slug } = useParams();
  const index = portfolio.projects.findIndex((p) => p.slug === slug);
  const project = portfolio.projects[index];
  if (!project) return <NotFound />;
  const next = portfolio.projects[(index + 1) % portfolio.projects.length];
  return (
    <>
      <div className="page-intro">
        <Link className="text-link" to="/portfolio">
          ← All projects
        </Link>
        <p className="eyebrow project-number">
          Project {String(index + 1).padStart(2, '0')}
          {project.category && ` / ${project.category}`}
        </p>
        <h1>{project.title}</h1>
        {project.description && (
          <p className="body-copy">{project.description}</p>
        )}
        {project.metadata && (
          <dl className="metadata">
            {project.metadata.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <Gallery key={project.slug} photos={project.images} />
      {project.video && (
        <section className="video-section">
          <h2>{project.video.title}</h2>
          <video controls preload="metadata" src={project.video.src}>
            {project.video.captions?.map((track, index) => (
              <track
                key={track.language}
                kind="captions"
                src={track.src}
                label={track.label}
                srcLang={track.language}
                default={index === 0}
              />
            ))}
            Your browser cannot play this video.
          </video>
        </section>
      )}
      <div className="project-enquiry">
        <p className="eyebrow">Continue the conversation</p>
        <Link className="text-link" to={`/contact?project=${project.slug}`}>
          Enquire about this work <Arrow />
        </Link>
      </div>
      {portfolio.projects.length > 1 && (
        <Link className="next-project" to={`/projects/${next.slug}`}>
          <span className="eyebrow">Next project</span>
          <span>
            {next.title} <Arrow />
          </span>
        </Link>
      )}
    </>
  );
}
