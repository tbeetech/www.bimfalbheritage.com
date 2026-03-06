import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost } from '../../services/api';

const AdminPostsPane = () => {
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
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="admin-col-type">Type</th>
                  <th className="admin-col-author">Author</th>
                  <th className="admin-col-date">Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => {
                  const pid = post._id || post.id;
                  return (
                    <tr key={pid}>
                      <td className="admin-col-title">
                        {post.title}
                      </td>
                      <td className="admin-col-type">
                        <span className={`admin-type-badge ${post.contentType || 'blog'}`}>
                          {post.contentType || 'blog'}
                        </span>
                      </td>
                      <td className="admin-col-author" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                        {post.authorName || '—'}
                      </td>
                      <td className="admin-col-date" style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                        {post.publishDate ? post.publishDate.slice(0, 10) : '—'}
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Link to={`/admin/edit/${pid}`} className="admin-btn-edit" title="Edit post" aria-label="Edit post">
                            <span className="admin-btn-label">Edit</span>
                            <span className="admin-btn-icon" aria-hidden="true">✏️</span>
                          </Link>
                          <button
                            className="admin-btn-delete"
                            type="button"
                            onClick={() => handleDelete(pid)}
                            title="Delete post"
                            aria-label="Delete post"
                          >
                            <span className="admin-btn-label">Delete</span>
                            <span className="admin-btn-icon" aria-hidden="true">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostsPane;
