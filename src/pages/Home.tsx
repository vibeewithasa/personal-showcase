import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { portfolio } from '../content/config';
import AboutMeContent from '../components/AboutMeContent';
import PortfolioImage from '../components/PortfolioImage';
import Project from '../components/Project';

export default function Home() {
  const { identity, projects } = portfolio;
  const words = identity.name.trim().split(/\s+/);
  const prints = projects.flatMap(project => [project.cover, ...project.gallery.filter(image => image.src !== project.cover.src)].map(image => ({ project, image }))).slice(0, 3);
  return (
    <>
      <section className="hero page-width" aria-labelledby="hero-title" data-motion-group data-start>
        <h1 id="hero-title" className={identity.name.length > 28 ? 'long-name' : undefined} aria-label={identity.name}>{words.map((word, index) => <Fragment key={index}>
          {index > 0 && ' '}<span className="word-mask"><span data-motion="word" data-order={Math.min(index + 1, 3)}>{word}{index === words.length - 1 && <span aria-hidden="true" className="hero-period">.</span>}</span></span>
        </Fragment>)}</h1>
        <div className="hero-top small">
          <p data-motion="line">{identity.role}</p>
          {portfolio.demo && <p className="demo-note" data-motion="right" data-order="2">Demo portfolio</p>}
        </div>
        <div className="hero-bottom">
          <p className="hero-intro" data-motion="rise" data-order="3">{identity.intro}</p>
          <Link className="primary-link" to="/#work" data-motion="button" data-order="4">View selected work <span aria-hidden="true">↓</span></Link>
        </div>
        {prints.length > 0 && <div className="hero-prints">{prints.map(({ project, image }, index) => <figure className="hero-print" key={project.slug + image.src + index}>
          <Link to={`/work/${project.slug}`} aria-label={`Open session: ${project.title}, image ${index + 1}`} data-motion={index % 2 ? 'picture-reverse' : 'picture'} data-order={index + 1}><PortfolioImage image={image} eager={index === 0} /></Link>
          <figcaption>{project.title}</figcaption>
        </figure>)}</div>}
      </section>
      <section id="work" className="work-section page-width" aria-labelledby="work-title" tabIndex={-1}>
        <div className="section-heading" data-motion-group><h2 id="work-title" data-motion="line">Selected work</h2><p className="small" data-motion="right" data-order="1">{projects.length === 1 ? '1 project' : `${projects.length} projects`}</p></div>
        {projects.length > 0 ? <div className="project-list">{projects.map((project, index) => <Project key={project.slug} project={project} reverse={index % 2 === 1} />)}</div> : (
          <div className="empty-state" data-motion="rise"><h3>New work is on its way.</h3><p>Projects will appear here soon.</p><Link className="text-link" to="/contact">Get in touch ↗</Link></div>
        )}
      </section>
      <AboutMeContent />
      <section className="contact-band" aria-labelledby="collaborate-title" data-motion-group><div className="page-width"><h2 id="collaborate-title" data-motion="line">Let's make something.</h2><Link className="text-link" to="/contact" data-motion="right" data-order="2">Get in touch <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
