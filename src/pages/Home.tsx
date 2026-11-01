import { Link } from 'react-router-dom';
import { portfolio } from '../content/config';
import AboutMeContent from '../components/AboutMeContent';
import Project from '../components/Project';

export default function Home() {
  const { identity, projects } = portfolio;
  return (
    <>
      <section className="hero page-width" aria-labelledby="hero-title">
        <div className="hero-top small">
          <p>{identity.role}</p>
          {portfolio.demo && <p className="demo-note">Demo portfolio</p>}
        </div>
        <h1 id="hero-title">{identity.name}<span aria-hidden="true" className="hero-period">.</span></h1>
        <div className="hero-bottom">
          <p className="hero-intro">{identity.intro}</p>
          <Link className="primary-link" to="/#work">View selected work <span aria-hidden="true">↓</span></Link>
        </div>
      </section>
      <section id="work" className="work-section page-width" aria-labelledby="work-title" tabIndex={-1}>
        <div className="section-heading"><h2 id="work-title">Selected work</h2><p className="small">{projects.length === 1 ? '1 project' : `${projects.length} projects`}</p></div>
        {projects.length > 0 ? <div className="project-list">{projects.map((project, index) => <Project key={project.slug} project={project} reverse={index % 2 === 1} />)}</div> : (
          <div className="empty-state"><h3>New work is on its way.</h3><p>Projects will appear here soon.</p><Link className="text-link" to="/contact">Get in touch ↗</Link></div>
        )}
      </section>
      <AboutMeContent />
      <section className="contact-band" aria-labelledby="collaborate-title"><div className="page-width"><h2 id="collaborate-title">Let's make something.</h2><Link className="text-link" to="/contact">Get in touch <span aria-hidden="true">↗</span></Link></div></section>
    </>
  );
}
