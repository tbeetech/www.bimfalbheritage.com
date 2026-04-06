import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../services/api';

const AdminDashboardPane = () => {
  const [stats, setStats] = useState({ total: 0, blog: 0, event: 0, news: 0, vlog: 0, lifestyle: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    getPosts(1, 100)
      .then((res) => {
        const posts = res.data || [];
        setRecentPosts(posts.slice(0, 6));
        const counts = { total: posts.length, blog: 0, event: 0, news: 0, vlog: 0, lifestyle: 0 };
        posts.forEach((p) => {
          if (p.contentType && counts[p.contentType] !== undefined) counts[p.contentType]++;
        });
        setStats(counts);

        // Top performing posts by engagement (views + likes + shares + comments)
        const scored = posts.map((p) => ({
          ...p,
          engagement: (p.views || 0) + (Array.isArray(p.likes) ? p.likes.length : 0) + (p.shares || 0) + (Array.isArray(p.comments) ? p.comments.length : 0),
        }));
        scored.sort((a, b) => b.engagement - a.engagement);
        setTopPosts(scored.slice(0, 5));
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

      {/* ── Quick Help & Tips Panel ── */}
      <div className="admin-help-panel">
        <button
          type="button"
          className="admin-help-toggle"
          onClick={() => setHelpOpen((v) => !v)}
          aria-expanded={helpOpen}
        >
          <span>💡 Quick Help &amp; Content Tips</span>
          <span className="admin-toggle-icon">{helpOpen ? '▲' : '▼'}</span>
        </button>
        {helpOpen && (
          <div className="admin-help-content">
            <div className="admin-help-grid">
              <div className="admin-help-card">
                <div className="admin-help-card-icon">📝</div>
                <h4>Writing Best Practices</h4>
                <ul>
                  <li>Use clear, descriptive titles (50–70 characters)</li>
                  <li>Write a compelling excerpt for post cards</li>
                  <li>Add relevant tags for better discoverability</li>
                  <li>Include at least one high-quality image</li>
                </ul>
              </div>
              <div className="admin-help-card">
                <div className="admin-help-card-icon">🖼️</div>
                <h4>Image Guidelines</h4>
                <ul>
                  <li>Upload up to 3 images per post (max 5 MB each)</li>
                  <li>Images are auto-compressed to JPEG</li>
                  <li>Landscape orientation works best for covers</li>
                  <li>Images persist across edits—only replace if needed</li>
                </ul>
              </div>
              <div className="admin-help-card">
                <div className="admin-help-card-icon">🔗</div>
                <h4>Social Media Links</h4>
                <ul>
                  <li>Attach YouTube, Facebook, X, Instagram, or TikTok links</li>
                  <li>Links appear alongside the post for cross-promotion</li>
                  <li>Use full URLs (e.g., https://youtube.com/watch?v=...)</li>
                  <li>Embed videos via the Video URL field for inline playback</li>
                </ul>
              </div>
              <div className="admin-help-card">
                <div className="admin-help-card-icon">📊</div>
                <h4>Engagement Tips</h4>
                <ul>
                  <li>Posts with images get 2× more engagement</li>
                  <li>Encourage readers to share via the share strip</li>
                  <li>Reply to comments to build community</li>
                  <li>Use the Content Health indicator in the editor</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Post Performance Widget ── */}
      {topPosts.length > 0 && (
        <div className="admin-table-wrap">
          <div className="admin-table-hdr">
            <div>
              <div className="admin-table-hdr-title">🏆 Top Performing Posts</div>
              <div className="admin-table-hdr-sub">Ranked by total engagement (views + likes + shares + comments)</div>
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Shares</th>
                <th>Comments</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, idx) => {
                const pid = post._id || post.id;
                const likes = Array.isArray(post.likes) ? post.likes.length : 0;
                const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
                return (
                  <tr key={pid}>
                    <td style={{ fontWeight: 700, color: idx === 0 ? 'var(--gold-2)' : 'var(--muted)' }}>
                      {idx + 1}
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Link to={`/admin/edit/${pid}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.views || 0}</td>
                    <td>{likes}</td>
                    <td>{post.shares || 0}</td>
                    <td>{commentsCount}</td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>{post.engagement}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
