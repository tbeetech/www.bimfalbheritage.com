import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="nav-shell">
      <div className="nav">
        <Link to="/" className="nav-brand">
          <span className="brand-mark">BH</span>
          <div>
            <strong>Bimfalb Heritage</strong>
            <small>Cultural Platform</small>
          </div>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/blog" className={linkClass} onClick={() => setOpen(false)}>Blog</NavLink>
          <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Admin</NavLink>
          <a className="nav-cta" href="#newsletter" onClick={() => setOpen(false)}>Join newsletter</a>
        </nav>

        <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
