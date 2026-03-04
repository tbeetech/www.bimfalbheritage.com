import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost } from '../../services/api';

const AdminPostsPane = ({ session }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getPosts(1, 100)
      .then((res) => setPosts(res.data || []))
      .catch(() => setStatus('Failed to load posts.'))
      .finally(() => setLoading(false));
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

  const filtered = filter ? posts.filter((p) => p.contentType === filter) : posts;

  return (
    <div>
      <div className="admin-section-hdr">
        <div className="pill">Content</div>
        <h1>All Posts</h1>
        <p>Manage and edit all cultural content.</p>
      </div>

      {!session && (
        <div className="admin-alert warning">
          No active session — some actions may be blocked.
        </div>
      )}

      {status && (
        <div className={`admin-alert ${status.toLowerCase().includes('failed') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="admin-table-hdr">
          <div>
            <div className="admin-table-hdr-title">Posts ({filtered.length})</div>
          </div>
          <div className="admin-filter-bar">
            <select
              className="admin-filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All types</option>
              <option value="blog">Blog</option>
              <option value="event">Event</option>
              <option value="news">News</option>
              <option value="vlog">Vlog</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
            <Link
              to="/admin/edit/new"
              className="btn"
              style={{ padding: '6px 14px', fontSize: '0.76rem' }}
            >
              + New Post
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
            Loading posts…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.88rem' }}>
            No posts found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => {
                const pid = post._id || post.id;
                return (
                  <tr key={pid}>
                    <td
                      style={{
                        maxWidth: '260px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {post.title}
                    </td>
                    <td>
                      <span className={`admin-type-badge ${post.contentType || 'blog'}`}>
                        {post.contentType || 'blog'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      {post.authorName || '—'}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      {post.publishDate ? post.publishDate.slice(0, 10) : '—'}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Link to={`/admin/edit/${pid}`} className="admin-btn-edit">
                          Edit
                        </Link>
                        <button
                          className="admin-btn-delete"
                          type="button"
                          onClick={() => handleDelete(pid)}
                        >
                          Delete
                        </button>
                      </div>
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
