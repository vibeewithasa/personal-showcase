import { portfolio } from '../content/config';

export default function Contact() {
  const { contact, identity } = portfolio;
  const hasMethod = contact.email || contact.phone || contact.links.length > 0;
  return (
    <section className="contact-page page-width">
      <h1>Let's talk.</h1>
      <div className="contact-body">
        <div className="contact-intro">
          <p className="lead">{contact.note || (hasMethod ? 'Tell me a little about your project, your ideas, and what you have in mind.' : 'Contact details will be available here soon.')}</p>
          {identity.availability && <p className="availability">{identity.availability}</p>}
          {identity.location && <p className="muted">{identity.location}</p>}
        </div>
        <div className="contact-methods">
          {contact.email && <a className="contact-email" href={`mailto:${encodeURIComponent(contact.email).replace('%40', '@')}`}>{contact.email}<span aria-hidden="true"> ↗</span></a>}
          {contact.phone && <a className="text-link" href={`tel:${contact.phone.replace(/[^+0-9]/g, '')}`}>{contact.phone}</a>}
          {contact.links.length > 0 && <ul className="social-links">{contact.links.map(link => <li key={link.url}><a className="text-link" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a></li>)}</ul>}
          {!hasMethod && <p className="contact-empty">A new conversation starts here.<br />Check back for ways to connect.</p>}
        </div>
      </div>
    </section>
  );
}
