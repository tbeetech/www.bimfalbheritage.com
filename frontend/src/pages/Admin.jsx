import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { login, logout, getSessionStatus } from '../services/api';
import AdminDashboardPane from './admin/AdminDashboardPane';
import AdminPostsPane from './admin/AdminPostsPane';
import AdminEditorPane from './admin/AdminEditorPane';
import AdminGalleryPane from './admin/AdminGalleryPane';
import PasswordInput from '../components/PasswordInput';
import { useSEO } from '../hooks/useSEO';
import './Admin.css';

const Admin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useSEO({
    title: 'Admin',
    description: 'Private administration interface for Bimfalb Heritage.',
    url: 'https://www.bimfalbheritage.org/admin',
    robots: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
  });

  useEffect(() => {
    getSessionStatus()
      .then((data) => setIsAdmin(!!data.admin))
      .catch(() => setIsAdmin(false))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await login(password);
      setIsAdmin(true);
    } catch (err) {
      if (err?.response?.status === 401) {
        setLoginError('Invalid password. Please try again.');
      } else {
        setLoginError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    setIsAdmin(false);
  };

  if (authLoading) {
    return <div className="admin-auth-loading">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <div className="admin-brand">
            <span className="admin-brand-icon">🌿</span>
            <div>
              <div className="admin-brand-name">Heritage Admin</div>
              <div className="admin-brand-sub">Bimfalb Management</div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <h2 className="admin-login-title">Admin Login</h2>
            <p className="admin-login-hint">Enter the admin password to access the dashboard.</p>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              required
              autoFocus
              className="admin-login-input"
            />
            {loginError && <p className="admin-login-error">{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="admin-login-btn">
              {loginLoading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <a href="/" className="admin-login-back">← Back to site</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {menuOpen && (
        <div className="admin-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`admin-sidebar${menuOpen ? ' open' : ''}`}>
        <div className="admin-brand">
          <span className="admin-brand-icon">🌿</span>
          <div>
            <div className="admin-brand-name">Heritage Admin</div>
            <div className="admin-brand-sub">Bimfalb Management</div>
          </div>
        </div>

        <div className="admin-nav-label-group">Content</div>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/posts"
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            All Posts
          </NavLink>

          <NavLink
            to="/admin/edit/new"
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Create Post
          </NavLink>

          <NavLink
            to="/admin/gallery"
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            Gallery
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="admin-signout-btn" style={{ textDecoration: 'none' }}>← Back to site</a>
          <button type="button" onClick={handleLogout} className="admin-signout-btn admin-logout-btn">
            Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="admin-topbar-title">Bimfalb Heritage</span>
        </header>

        <div className="admin-pane">
          <Routes>
            <Route
              index
              element={<AdminDashboardPane />}
            />
            <Route
              path="posts"
              element={<AdminPostsPane />}
            />
            <Route
              path="edit/:id"
              element={<AdminEditorPane />}
            />
            <Route
              path="gallery"
              element={<AdminGalleryPane />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
