import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const PhoneIcon = () => (
  <svg className="topbar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
);

const MailIcon = () => (
  <svg className="topbar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const OrgIcon = () => (
  <svg className="topbar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { dark, setDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const initials = user?.name?.trim()
    ? user.name.trim().split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <span className="topbar-item">
            <OrgIcon />
            A non governmental cultural organization
          </span>
          <span className="topbar-item">
            <PhoneIcon />
            0803 384 2322
          </span>
          <span className="topbar-item">
            <MailIcon />
            bimfalbheritage@gmail.com
          </span>
        </div>
      </div>

      <div className="nav-shell">
        <div className="nav">
          <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
            <div className="nav-brand-img-wrap">
              <img src="https://i.pinimg.com/736x/9c/50/73/9c5073e69ef82e9ef07ea68fa1a97b11.jpg" alt="Bimfalb Heritage" referrerPolicy="no-referrer" />
              <div className="nav-brand-ring" aria-hidden="true" />
            </div>
            <div className="nav-brand-text">
              <strong>Bimfalb Heritage</strong>
              <small>Promoting cultural heritage</small>
            </div>
          </Link>

          <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Main navigation">
            <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about-us-3" className={linkClass} onClick={() => setOpen(false)}>About Us</NavLink>
            <NavLink to="/events" className={linkClass} onClick={() => setOpen(false)}>Events</NavLink>
            <NavLink to="/donations" className={linkClass} onClick={() => setOpen(false)}>Donations</NavLink>
            <NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>Blog</NavLink>
            <NavLink to="/gallery" className={linkClass} onClick={() => setOpen(false)}>Gallery</NavLink>
            <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>Contact Us</NavLink>
            <NavLink to="/faq" className={linkClass} onClick={() => setOpen(false)}>FAQ</NavLink>
          </nav>

          <div className="nav-controls">
            <Link to="/donations" className="nav-cta" onClick={() => setOpen(false)}>
              ✦ Donate
            </Link>
            <button
              className="theme-toggle"
              onClick={() => setDark((v) => !v)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4.22 5.64a1 1 0 0 1 1.42-1.42l1.41 1.42a1 1 0 0 1-1.41 1.41L4.22 5.64zm12.72 12.72a1 1 0 0 1 1.42-1.41l1.41 1.41a1 1 0 1 1-1.41 1.42l-1.42-1.42zM3 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1zm16 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zM5.64 18.36a1 1 0 0 1-1.42 0 1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 1 1 1.41 1.42l-1.41 1.41zm12.72-12.72a1 1 0 0 1-1.41 0L15.53 4.22a1 1 0 1 1 1.42-1.42l1.41 1.42a1 1 0 0 1 0 1.42z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* User auth area */}
            {user ? (
              <div className="nav-user-wrap">
                <button
                  className="nav-user-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="User menu"
                  type="button"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="nav-user-avatar-img" />
                  ) : (
                    <span className="nav-user-initials">{initials}</span>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="nav-user-dropdown">
                    <div className="nav-user-name">{user.name}</div>
                    <Link to="/profile" className="nav-user-item" onClick={() => setUserMenuOpen(false)}>
                      My Profile
                    </Link>
                    <button type="button" className="nav-user-item nav-user-logout" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            )}

            <button
              className="nav-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
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
