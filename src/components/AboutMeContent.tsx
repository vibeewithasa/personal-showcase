import { Link } from 'react-router-dom';
import { portfolio } from '../content/config';
import PortfolioImage from './PortfolioImage';

export default function AboutMeContent() {
  const about = portfolio.about;
  if (!about) return null;
  return (
    <section id="about" className="about-section page-width" aria-labelledby="about-title" tabIndex={-1}>
      <div className="about-heading">
        <h2 id="about-title">{about.title}</h2>
        {portfolio.identity.portrait && <PortfolioImage key={portfolio.identity.portrait.src} image={portfolio.identity.portrait} className="portrait" />}
        {about.services.length > 0 && <ul className="services" aria-label="Services">{about.services.map(service => <li key={service}>{service}</li>)}</ul>}
      </div>
      <div className="about-copy">
        {about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <Link className="text-link" to="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
