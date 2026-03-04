import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSessionStatus, logout } from '../../services/api';

const AdminDashboardPane = () => {
  const [session, setSession] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const check = async () => {
      try {
        const res = await getSessionStatus();
        setSession(res.admin);
      } catch {
        setSession(false);
      }
    };
    check();
  }, []);

  const handleLogout = async () => {
    await logout();
    setSession(false);
    setStatus('Logged out');
  };

  return (
    <div className="page">
      <div className="admin card">
        <div>
          <div className="pill">Admin</div>
          <h1>Admin Dashboard</h1>
          <p className="muted">Manage cultural posts and content for Bimfalb Heritage.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
          <span className={`session-dot ${session ? 'on' : 'off'}`} style={{ fontWeight: 700 }}>
            {session ? '● Session active' : '○ Session off'}
          </span>
          {session && (
            <button className="btn secondary" type="button" onClick={handleLogout}>Logout</button>
          )}
        </div>
        {status && <p className="muted">{status}</p>}
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <Link to="/admin/edit/new" className="btn" style={{ textAlign: 'center', padding: '18px 12px', fontSize: '1rem' }}>
            ✏️ Create post
          </Link>
          <Link to="/admin/posts" className="btn secondary" style={{ textAlign: 'center', padding: '18px 12px', fontSize: '1rem' }}>
            📋 Manage posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPane;
