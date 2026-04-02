import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import './NotFound.css';

const NotFound = () => {
  useSEO({
    title: 'Page Not Found',
    description:
      'The page you are looking for does not exist. Explore Bimfalb Heritage to discover Nigerian cultural heritage, events, and community programs.',
    robots: 'noindex, follow',
  });

  return (
    <div className="page not-found-page">
      <header className="page-header">
        <h1>404 — Page Not Found</h1>
        <p>Sorry, the page you requested could not be found.</p>
      </header>

      <section className="not-found-body card">
        <p>
          The URL may have changed or the page may no longer exist. Use the links below to continue
          exploring Bimfalb Heritage.
        </p>
        <nav className="not-found-links" aria-label="Helpful links">
          <Link className="btn" to="/">Go Home</Link>
          <Link className="btn secondary" to="/blog">Read Blog</Link>
          <Link className="btn secondary" to="/about">About Us</Link>
          <Link className="btn secondary" to="/contact">Contact Us</Link>
        </nav>
      </section>
    </div>
  );
};

export default NotFound;
