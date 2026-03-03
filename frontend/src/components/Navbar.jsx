import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { dark, setDark } = useTheme();

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
            <img src="https://i.pinimg.com/736x/9c/50/73/9c5073e69ef82e9ef07ea68fa1a97b11.jpg" alt="Bimfalb Heritage" />
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

          <div className="nav-controls">
            <button
              className="theme-toggle"
              onClick={() => setDark((v) => !v)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4.22 5.64a1 1 0 0 1 1.42-1.42l1.41 1.42a1 1 0 0 1-1.41 1.41L4.22 5.64zm12.72 12.72a1 1 0 0 1 1.42-1.41l1.41 1.41a1 1 0 1 1-1.41 1.42l-1.42-1.42zM3 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zM5.64 18.36a1 1 0 0 1-1.42 0 1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 1 1 1.41 1.42l-1.41 1.41zm12.72-12.72a1 1 0 0 1-1.41 0L15.53 4.22a1 1 0 1 1 1.42-1.42l1.41 1.42a1 1 0 0 1 0 1.42z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
