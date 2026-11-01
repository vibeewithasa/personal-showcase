import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { portfolio } from '../content/config';
import PortfolioImage from './PortfolioImage';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  const items = [
    { to: '/', label: 'Work', active: location.pathname === '/' && !location.hash || location.pathname.startsWith('/work/') },
    ...(portfolio.about ? [{ to: '/#about', label: 'About', active: location.pathname === '/' && location.hash === '#about' }] : []),
    { to: '/contact', label: 'Contact', active: location.pathname === '/contact' },
  ];
  return (
    <header className="site-header page-width">
      <Link to="/" className="wordmark" aria-label={`${portfolio.identity.name} home`} onClick={() => setOpen(false)}>
        {portfolio.identity.logo ? <PortfolioImage key={portfolio.identity.logo.src} image={portfolio.identity.logo} eager className="brand-image" /> : portfolio.identity.name}
      </Link>
      <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
        {open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <nav id="main-navigation" aria-label="Main navigation" className={open ? 'main-nav is-open' : 'main-nav'}>
        {items.map(item => <Link key={item.label} to={item.to} aria-current={item.active ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
    </header>
  );
}
