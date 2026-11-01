import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { portfolio } from '../content/portfolio';
const links = [
  ['/', 'Home'],
  ['/portfolio', 'Portfolio'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];
export default function NavBar() {
  const location = useLocation();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === location.key;
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenAt(null);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpenAt(null);
    };
    const media = window.matchMedia('(max-width: 700px)');
    const resize = () => {
      if (!media.matches) setOpenAt(null);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    media.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
      media.removeEventListener('change', resize);
    };
  }, [open]);
  return (
    <header
      className={open ? 'site-header menu-is-open' : 'site-header'}
      ref={header}
    >
      <Link
        className="wordmark"
        to="/"
        onClick={() => setOpenAt(null)}
        aria-label={`${portfolio.name} home`}
      >
        {portfolio.name}
        <span aria-hidden="true">㋛</span>
      </Link>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpenAt(open ? null : location.key)}
      >
        {open ? 'Close −' : 'Menu +'}
      </button>
      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={open ? 'navigation is-open' : 'navigation'}
      >
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpenAt(null)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
