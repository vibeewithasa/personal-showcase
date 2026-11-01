import { Link } from 'react-router-dom';
import { portfolio } from '../content/config';
import PortfolioImage from './PortfolioImage';

export default function AboutMeContent() {
  const about = portfolio.about;
  if (!about) return null;
  return (
    <section data-motion-group id="about" className="about-section page-width" aria-labelledby="about-title" tabIndex={-1}>
      <div className="about-heading">
        <h2 data-motion="line" id="about-title">{about.title}</h2>
        {portfolio.identity.portrait && <div data-motion="picture" data-order="1"><PortfolioImage key={portfolio.identity.portrait.src} image={portfolio.identity.portrait} className="portrait" /></div>}
        {about.services.length > 0 && <ul className="services" aria-label="Services">{about.services.map((service, index) => <li data-motion="right" data-order={index + 1} key={service}>{service}</li>)}</ul>}
      </div>
      <div className="about-copy">
        {about.paragraphs.map((paragraph, index) => <p data-motion="rise" data-order={index + 1} key={index}>{paragraph}</p>)}
        <Link data-motion="button" data-order="3" className="text-link" to="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
