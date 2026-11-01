import Arrow from './components/Arrow';
import { BrowserRouter, Link } from 'react-router-dom';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import PersonalShowcaseRoutes from './routes/PersonalShowcaseRoutes';
import NavBar from './components/NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import PageMeta from './components/PageMeta';
import { portfolio } from './content/portfolio';
export default function App() {
  return (
    <BrowserRouter>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <PageMeta />
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <NavBar />
          <main id="main-content" tabIndex={-1}>
            <ErrorBoundary>
              <PersonalShowcaseRoutes />
            </ErrorBoundary>
          </main>
          <footer className="site-footer">
            <Link className="footer-brand" to="/">
              {portfolio.name} ㋛
            </Link>
            <p>{portfolio.profession}</p>
            <div>
              {portfolio.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label} <Arrow />
                </a>
              ))}
            </div>
            <small>
              © {new Date().getFullYear()} {portfolio.name}
            </small>
          </footer>
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  );
}
