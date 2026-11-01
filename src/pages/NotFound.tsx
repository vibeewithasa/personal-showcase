import Arrow from '../components/Arrow';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className="page-intro">
      <p className="eyebrow">404 / Out of frame</p>
      <h1>Page not found.</h1>
      <p className="body-copy">
        This page may have moved. Find your way back to the work.
      </p>
      <Link className="text-link" to="/portfolio">
        Explore the portfolio <Arrow />
      </Link>
    </section>
  );
}
