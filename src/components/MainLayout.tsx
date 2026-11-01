import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { portfolio } from '../content/config';
import NavBar from './NavBar';
import { usePageMotion } from '../motion/motion';

export default function MainLayout() {
  const location = useLocation();
  const previousLocation = useRef(location.key);
  const main = useRef<HTMLElement>(null);
  usePageMotion(main, location.pathname);
  useEffect(() => {
    const id = location.hash.slice(1);
    const target = id ? document.getElementById(id) : document.querySelector<HTMLElement>('main h1');
    if (id) target?.scrollIntoView();
    else window.scrollTo(0, 0);
    if (previousLocation.current !== location.key && target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    previousLocation.current = location.key;
  }, [location]);
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
        <Link to="/" className="footer-name">{portfolio.identity.name}</Link>
        <div className="footer-bottom small">
          <p>© {new Date().getFullYear()} {portfolio.identity.name}</p>
          {portfolio.demo && <p>Demonstration portfolio · Original sample artwork</p>}
          <Link to="/contact">Get in touch <span aria-hidden="true">↗</span></Link>
        </div>
      </footer>
    </>
  );
}
