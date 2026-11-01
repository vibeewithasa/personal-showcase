import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="not-found page-width"><p className="small">404 / Page not found</p><h1>A different direction.</h1><p>This page may have moved, or the project is no longer available.</p><Link className="primary-link" to="/">Back to selected work <span aria-hidden="true">↗</span></Link></section>;
}
