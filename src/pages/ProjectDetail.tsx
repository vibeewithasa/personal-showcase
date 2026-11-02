import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { portfolio } from '../content/config';
import Gallery from '../components/Gallery';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = portfolio.projects.find(item => item.slug === slug);
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — ${portfolio.identity.name}`;
      document.querySelector('meta[name="description"]')?.setAttribute('content', project.summary);
    }
    return () => {
      document.title = portfolio.seo.title;
      document.querySelector('meta[name="description"]')?.setAttribute('content', portfolio.seo.description);
    };
  }, [project]);
  if (!project) return <NotFound />;
  const next = portfolio.projects.length > 1 ? portfolio.projects[(portfolio.projects.indexOf(project) + 1) % portfolio.projects.length] : undefined;
  return (
    <article className="project-page page-width" data-motion="page" data-start>
      <Link className="text-link back-link" to="/">← All work</Link>
      <header className="project-intro" data-motion-group data-start><div><h1 data-motion="line">{project.title}</h1><p className="project-meta small">{[project.category, project.date || project.year].filter(Boolean).join(' / ')}</p></div><p className="lead" data-motion="rise" data-order="2">{project.summary}</p></header>
      <Gallery key={project.slug} images={project.gallery.length ? project.gallery : [project.cover]} title={project.title} />
      <section data-motion-group className="project-story" aria-labelledby="project-story-title"><h2 data-motion="line" id="project-story-title">The idea</h2><div>{project.description.map((paragraph, index) => <p data-motion="rise" data-order={index + 1} key={index}>{paragraph}</p>)}{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit project <span className="sr-only">(opens in a new tab)</span><span aria-hidden="true"> ↗</span></a>}</div></section>
      <div className="project-next" data-motion="line">{next ? <Link className="next-link" to={`/work/${next.slug}`}><span className="small">Next project</span><span>{next.title} <span aria-hidden="true">↗</span></span></Link> : <Link className="primary-link" to="/">Back to selected work ↗</Link>}</div>
    </article>
  );
}
