import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../services/api';

const AdminDashboardPane = () => {
  const [stats, setStats] = useState({ total: 0, blog: 0, event: 0, news: 0, vlog: 0, lifestyle: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts(1, 50)
      .then((res) => {
        const posts = res.data || [];
        setRecentPosts(posts.slice(0, 6));
        const counts = { total: posts.length, blog: 0, event: 0, news: 0, vlog: 0, lifestyle: 0 };
        posts.forEach((p) => {
          if (p.contentType && counts[p.contentType] !== undefined) counts[p.contentType]++;
        });
        setStats(counts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-section-hdr">
        <div className="pill">Admin</div>
        <h1>Dashboard</h1>
        <p>Manage cultural posts and content for Bimfalb Heritage.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{loading ? '—' : stats.total}</div>
          <div className="admin-stat-label">Total Posts</div>
        </div>
        <div className="admin-stat-card gold">
          <div className="admin-stat-number">{loading ? '—' : stats.blog}</div>
          <div className="admin-stat-label">Blog</div>
        </div>
        <div className="admin-stat-card green">
          <div className="admin-stat-number">{loading ? '—' : stats.event}</div>
          <div className="admin-stat-label">Events</div>
        </div>
        <div className="admin-stat-card terracotta">
          <div className="admin-stat-number">{loading ? '—' : stats.news}</div>
          <div className="admin-stat-label">News</div>
        </div>
        <div className="admin-stat-card blue">
          <div className="admin-stat-number">{loading ? '—' : stats.vlog + stats.lifestyle}</div>
          <div className="admin-stat-label">Vlog / Lifestyle</div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <Link to="/admin/edit/new" className="admin-action-card">
          <div className="admin-action-icon green">✏️</div>
          <div>
            <div className="admin-action-title">Create Post</div>
            <div className="admin-action-sub">Write a new cultural post</div>
          </div>
        </Link>
        <Link to="/admin/posts" className="admin-action-card">
          <div className="admin-action-icon gold">📋</div>
          <div>
            <div className="admin-action-title">Manage Posts</div>
            <div className="admin-action-sub">Edit or delete existing posts</div>
          </div>
        </Link>
        <a href="/" className="admin-action-card">
          <div className="admin-action-icon terracotta">🌐</div>
          <div>
            <div className="admin-action-title">View Site</div>
            <div className="admin-action-sub">Open the public website</div>
          </div>
        </a>
      </div>

      {recentPosts.length > 0 && (
        <div className="admin-table-wrap">
          <div className="admin-table-hdr">
            <div>
              <div className="admin-table-hdr-title">Recent Posts</div>
              <div className="admin-table-hdr-sub">Latest content activity</div>
            </div>
            <Link
              to="/admin/posts"
              className="btn secondary"
              style={{ fontSize: '0.76rem', padding: '6px 14px' }}
            >
              View all
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => {
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
                      {post.publishDate ? post.publishDate.slice(0, 10) : '—'}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Link to={`/admin/edit/${pid}`} className="admin-btn-edit">
                          Edit
                        </Link>
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
  );
};

export default AdminDashboardPane;
