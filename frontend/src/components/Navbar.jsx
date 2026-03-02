import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span className="topbar-item">A non governmental cultural organization</span>
          <span className="topbar-item">0803 384 2322</span>
          <span className="topbar-item">bimfalbheritage@gmail.com</span>
        </div>
      </div>

      <div className="nav-shell">
        <div className="nav">
          <Link to="/" className="nav-brand">
            <img src="https://bimfalbheritage.com/wp-content/uploads/2025/04/logo.png" alt="Bimfalb Heritage" />
            <div>
              <strong>Bimfalb Heritage</strong>
              <small>...promoting cultural heritage</small>
            </div>
          </Link>

          <nav className={`nav-links ${open ? 'open' : ''}`}>
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about-us-3" className={linkClass} onClick={() => setOpen(false)}>About Us</NavLink>
            <NavLink to="/events" className={linkClass} onClick={() => setOpen(false)}>Events</NavLink>
            <NavLink to="/donations" className={linkClass} onClick={() => setOpen(false)}>Donations</NavLink>
            <NavLink to="/news" className={linkClass} onClick={() => setOpen(false)}>News</NavLink>
            <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact Us</NavLink>
            <NavLink to="/faq" className={linkClass} onClick={() => setOpen(false)}>FAQ</NavLink>
          </nav>

          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
