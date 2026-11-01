import Arrow from '../components/Arrow';
import { Link } from 'react-router-dom';
import { portfolio } from '../content/portfolio';
import Project from '../components/Project';
import AnimatedSection from '../components/AnimatedSection';
export default function Home() {
  return (
    <>
      <section className="intro-hero">
        <div className="hero-topline">
          <p className="eyebrow">{portfolio.profession}</p>
          <span className="eyebrow">
            Selected work / 01—
            {String(portfolio.projects.length).padStart(2, '0')}
          </span>
        </div>
        <h1 className="hero-title">
          {portfolio.name}
          <span aria-hidden="true">㋛</span>
        </h1>
        <div className="hero-bottom">
          <p>
            Photography.
            <br />
            Film. A point of view.
          </p>
          <a className="text-link" href="#selected-work">
            Explore the work ↓
          </a>
        </div>
      </section>
      <AnimatedSection id="selected-work" className="selected-work">
        <div className="section-heading">
          <p className="eyebrow">Selected projects</p>
          <Link className="text-link" to="/portfolio">
            All work <Arrow />
          </Link>
        </div>
        {portfolio.projects.map((p, i) => (
          <Project key={p.slug} project={p} index={i} />
        ))}
        {!portfolio.projects.length && (
          <p className="empty-state">New work is on its way.</p>
        )}
      </AnimatedSection>
      <section className="contact-strip">
        <p className="eyebrow">Have something in mind?</p>
        <Link to="/contact">
          Let’s make
          <br />
          something.
          <span aria-hidden="true">
            <Arrow />
          </span>
        </Link>
      </section>
    </>
  );
}
