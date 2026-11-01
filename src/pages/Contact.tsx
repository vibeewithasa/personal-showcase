import Arrow from '../components/Arrow';
import { useSearchParams } from 'react-router-dom';
import { portfolio } from '../content/portfolio';
export default function Contact() {
  const [params] = useSearchParams();
  const project = portfolio.projects.find(
    (p) => p.slug === params.get('project'),
  );
  return (
    <section className="contact-page">
      <p className="eyebrow">Bookings & collaborations</p>
      <h1>
        Let’s make
        <br />
        something<span className="period">.</span>
      </h1>
      <p className="body-copy">
        {project
          ? `For enquiries about ${project.title}, get in touch with ${portfolio.name} directly.`
          : `For project enquiries, get in touch with ${portfolio.name} directly.`}
      </p>
      <div className="contact-options">
        {portfolio.socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.label}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </a>
        ))}
        {portfolio.email && (
          <a
            href={`mailto:${portfolio.email}${project ? `?subject=${encodeURIComponent(project.title + ' enquiry')}` : ''}`}
          >
            {portfolio.email}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </a>
        )}
        {!portfolio.socials.length && !portfolio.email && (
          <p>Contact details will be available soon.</p>
        )}
      </div>
    </section>
  );
}
