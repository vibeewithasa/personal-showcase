import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { portfolio } from '../content/config';
import NavBar from './NavBar';
import PortfolioImage from './PortfolioImage';
import { usePageMotion, useMediaQuery } from '../motion/motion';

export default function MainLayout() {
  const location = useLocation();
  const lastProject = portfolio.projects.at(-1);
  const footerImage = lastProject?.gallery.at(-1) || lastProject?.cover;
  const previousLocation = useRef(location.key);
  const main = useRef<HTMLElement>(null);
  usePageMotion(main, location.pathname);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    // Route scroll has one owner; native history restoration can interrupt smooth anchors.
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = previous; };
  }, []);
  useEffect(() => {
    const id = location.hash.slice(1);
    const target = id ? document.getElementById(id) : document.querySelector<HTMLElement>('main h1');
    if (target && (id || previousLocation.current !== location.key)) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    if (id) target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    previousLocation.current = location.key;
  }, [location, reduced]);
  return (
    <>
      {/* WebKit needs explicit tabindex to include this skip link in Tab navigation. */}
      <a tabIndex={0} className="skip-link" href="#/#main-content" onClick={event => {
        event.preventDefault();
        document.getElementById('main-content')?.focus();
      }}>Skip to content</a>
      <NavBar key={location.pathname + location.hash} />
      <main ref={main} id="main-content" tabIndex={-1}><Outlet /></main>
      <footer className="site-footer page-width">
        <div className={`footer-main ${footerImage ? '' : 'no-image'}`}>
          {footerImage && <Link className="footer-image" to={`/work/${lastProject!.slug}`} aria-label={`Revisit ${lastProject!.title}`}><PortfolioImage image={footerImage} /></Link>}
          <div><Link to="/" className="footer-name">{portfolio.identity.name}</Link><p><Link className="text-link" to="/#work">Selected work ↗</Link></p>{portfolio.about && <p><Link className="text-link" to="/#about">About the practice ↗</Link></p>}</div>
        </div>
        <div className="footer-bottom small">
          <p>© {new Date().getFullYear()} {portfolio.identity.name}</p>
          {portfolio.demo && <p>Demonstration portfolio · AI-generated sample images</p>}
          <Link to="/contact">Get in touch <span aria-hidden="true">↗</span></Link>
        </div>
      </footer>
    </>
  );
}
