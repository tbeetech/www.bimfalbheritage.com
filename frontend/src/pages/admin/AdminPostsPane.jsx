import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost, getSessionStatus } from '../../services/api';

const AdminPostsPane = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [session, setSession] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPosts(1, 50);
        setPosts(res.data || []);
      } catch {
        setStatus('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      setStatus('Post deleted.');
    } catch {
      setStatus('Failed to delete post.');
    }
  };

  return (
    <div className="page">
      <div className="admin card">
        <div>
          <div className="pill">Admin</div>
          <h1>Manage Posts</h1>
          <p className="muted">Edit or delete existing cultural posts.</p>
        </div>
        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
          <Link to="/admin" className="btn secondary">← Dashboard</Link>
          <Link to="/admin/edit/new" className="btn">+ New post</Link>
        </div>
        {!session && (
          <p className="muted" style={{ color: 'var(--terracotta, #a0522d)' }}>
            No active session — some actions may be blocked.
          </p>
        )}
        {status && <p className="muted">{status}</p>}
        {loading ? (
          <p className="muted">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="muted">No posts found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '8px 6px' }}>Title</th>
                <th style={{ padding: '8px 6px' }}>Type</th>
                <th style={{ padding: '8px 6px' }}>Date</th>
                <th style={{ padding: '8px 6px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const pid = post._id || post.id;
                return (
                  <tr key={pid} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 6px' }}>{post.title}</td>
                    <td style={{ padding: '8px 6px' }}>{post.contentType || '—'}</td>
                    <td style={{ padding: '8px 6px' }}>{post.publishDate ? post.publishDate.slice(0, 10) : '—'}</td>
                    <td style={{ padding: '8px 6px', display: 'flex', gap: '6px' }}>
                      <Link to={`/admin/edit/${pid}`} className="btn secondary" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>Edit</Link>
                      <button className="btn secondary" style={{ padding: '4px 10px', fontSize: '0.85rem', color: 'var(--terracotta, #a0522d)' }} onClick={() => handleDelete(pid)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPostsPane;
