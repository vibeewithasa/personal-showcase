import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { portfolio } from '../content/config';
import { motionFinished, playMotion, useMediaQuery } from '../motion/motion';
import PortfolioImage from './PortfolioImage';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const mobile = useMediaQuery('(max-width: 640px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const location = useLocation();
  useLayoutEffect(() => {
    const nav = navigation.current;
    if (!nav || !mobile || !present) return;
    let live = true;
    const animation = playMotion(nav, open ? 'menu-open' : 'menu-close');
    const stagger = parseFloat(getComputedStyle(nav).getPropertyValue('--motion-stagger')) || 0;
    const links = open ? [...nav.querySelectorAll('a')].map((link, index) => playMotion(link, 'right', index * stagger)) : [];
    if (!open) void motionFinished(animation).then(() => { if (live) setPresent(false); });
    return () => {
      live = false;
      animation?.cancel();
      links.forEach(item => item?.cancel());
    };
  }, [open, present, mobile, reduced]);
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
    { to: '/', label: 'Work', active: location.pathname === '/' && location.hash !== '#about' || location.pathname.startsWith('/work/') },
    ...(portfolio.about ? [{ to: '/#about', label: 'About', active: location.pathname === '/' && location.hash === '#about' }] : []),
    { to: '/contact', label: 'Contact', active: location.pathname === '/contact' },
  ];
  return (
    <header className="site-header page-width">
      <Link to="/" className="wordmark" aria-label={`${portfolio.identity.name} home`} onClick={() => setOpen(false)}>
        {portfolio.identity.logo ? <PortfolioImage key={portfolio.identity.logo.src} image={portfolio.identity.logo} eager className="brand-image" /> : portfolio.identity.name}
      </Link>
      <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => {
        if (!open) setPresent(true);
        setOpen(!open);
      }}>
        {open ? 'Close' : 'Menu'}<span aria-hidden="true" className="menu-symbol">+</span>
      </button>
      <nav ref={navigation} id="main-navigation" aria-label="Main navigation" inert={mobile && !open} aria-hidden={mobile && !open ? true : undefined}
        className={`main-nav ${present ? 'is-present' : ''} ${mobile && present && !open ? 'is-closing' : ''}`}>
        {items.map(item => <Link key={item.label} to={item.to} aria-current={item.active ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
    </header>
  );
}
