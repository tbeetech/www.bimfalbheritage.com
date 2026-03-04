import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import RichTextEditor from '../../components/RichTextEditor';
import { createPost, updatePost, getPost, login, logout } from '../../services/api';

const categories = ['History', 'Culture', 'Heritage', 'Events', 'Lifestyle'];
const contentTypes = ['blog', 'vlog', 'news', 'lifestyle', 'event'];

const AdminEditorPane = ({ session, onSessionChange }) => {
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(editId) && editId !== 'new';

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    authorName: '',
    category: 'Culture',
    contentType: 'blog',
    tags: '',
    publishDate: dayjs().format('YYYY-MM-DD'),
    videoUrl: '',
    collaborationPartner: '',
    collaborationType: '',
    sharePlatforms: '',
    eventTitle: '',
    eventStartDate: '',
    eventEndDate: '',
    eventLocation: '',
    eventExternalUrl: '',
    eventPlatform: 'Facebook Events',
  });
  const [body, setBody] = useState('');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [password, setPassword] = useState(() => localStorage.getItem('bh_admin_password') || '');
  const [status, setStatus] = useState('');
  const [statusOk, setStatusOk] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    const load = async () => {
      try {
        const post = await getPost(editId);
        if (!post) return;
        setForm({
          title: post.title || '',
          excerpt: post.excerpt || '',
          authorName: post.authorName || '',
          category: post.category || 'Culture',
          contentType: post.contentType || 'blog',
          tags: post.tags || '',
          publishDate: post.publishDate ? dayjs(post.publishDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
          videoUrl: post.videoUrl || '',
          collaborationPartner: post.collaborationPartner || '',
          collaborationType: post.collaborationType || '',
          sharePlatforms: post.sharePlatforms || '',
          eventTitle: post.eventMeta?.title || '',
          eventStartDate: post.eventMeta?.startDate || '',
          eventEndDate: post.eventMeta?.endDate || '',
          eventLocation: post.eventMeta?.location || '',
          eventExternalUrl: post.eventMeta?.externalUrl || '',
          eventPlatform: post.eventMeta?.platform || 'Facebook Events',
        });
        setBody(post.body || '');
        setExistingImages(
          Array.isArray(post.images) && post.images.length > 0
            ? post.images
            : post.coverImage
            ? [post.coverImage]
            : []
        );
      } catch {
        setStatus('Failed to load post for editing.');
        setStatusOk(false);
      }
    };
    load();
  }, [editId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files).slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      if (!session) {
        await login(password);
        onSessionChange?.(true);
        localStorage.setItem('bh_admin_password', password);
      }
      let post;
      if (isEditing) {
        post = await updatePost(editId, { ...form, body, images });
        setStatus('Post updated!');
        setStatusOk(true);
      } else {
        post = await createPost({ ...form, body, images });
        setStatus('Post created!');
        setStatusOk(true);
      }
      navigate(`/blog/${post._id || post.id}`);
    } catch {
      setStatus(isEditing ? 'Failed to update post.' : 'Failed to create post. Check session or server.');
      setStatusOk(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login(password);
      onSessionChange?.(true);
      localStorage.setItem('bh_admin_password', password);
      setStatus('Session active');
      setStatusOk(true);
    } catch {
      onSessionChange?.(false);
      setStatus('Login failed');
      setStatusOk(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onSessionChange?.(false);
    setStatus('Logged out');
    setStatusOk(true);
  };

  return (
    <div>
      <div className="admin-section-hdr">
        <div className="pill">Content Editor</div>
        <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
        <p>Compose cultural content with rich media, collaboration metadata, and event details.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-wrap">

          {/* ── Post details ── */}
          <div className="admin-form-section">
            <div className="admin-form-section-title">Post Details</div>
            <div className="admin-field">
              <label htmlFor="ef-title">Title</label>
              <input
                id="ef-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter post title"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="ef-excerpt">Excerpt</label>
              <textarea
                id="ef-excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="Short summary shown in post cards"
              />
            </div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="ef-author">Author</label>
                <input
                  id="ef-author"
                  name="authorName"
                  value={form.authorName}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="ef-category">Category</label>
                <select id="ef-category" name="category" value={form.category} onChange={handleChange}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="ef-type">Content Type</label>
                <select id="ef-type" name="contentType" value={form.contentType} onChange={handleChange}>
                  {contentTypes.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="ef-date">Publish Date</label>
                <input
                  id="ef-date"
                  type="date"
                  name="publishDate"
                  value={form.publishDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ── Media ── */}
          <div className="admin-form-section">
            <div className="admin-form-section-title">Media</div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="ef-video">Video URL</label>
                <input
                  id="ef-video"
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Images (up to 3)
              </div>
              <div className="admin-image-zone">
                <input
                  id="ef-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  aria-label="Upload images"
                />
                <div className="admin-image-zone-label">
                  {images.length > 0
                    ? `${images.length} image${images.length > 1 ? 's' : ''} selected`
                    : 'Click or drag images here (up to 3)'}
                </div>
              </div>
              {isEditing && existingImages.length > 0 && images.length === 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginBottom: '6px' }}>
                    Current images (upload new ones to replace):
                  </div>
                  <div className="admin-image-thumbs">
                    {existingImages.map((img, i) => (
                      <img
                        key={i}
                        src={img?.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || ''}${img}`}
                        alt={`Current image ${i + 1}`}
                        className="admin-thumb"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Article body ── */}
          <div className="admin-form-section">
            <div className="admin-form-section-title">Article Body</div>
            <RichTextEditor value={body} onChange={setBody} placeholder="Compose with bold, lists, quotes…" />
          </div>

          {/* ── Metadata ── */}
          <div className="admin-form-section">
            <div className="admin-form-section-title">Metadata &amp; Distribution</div>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="ef-partner">Collaboration Partner</label>
                <input
                  id="ef-partner"
                  name="collaborationPartner"
                  value={form.collaborationPartner}
                  onChange={handleChange}
                  placeholder="Organization or media partner"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="ef-collab-type">Collaboration Type</label>
                <input
                  id="ef-collab-type"
                  name="collaborationType"
                  value={form.collaborationType}
                  onChange={handleChange}
                  placeholder="Sponsorship, co-production…"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="ef-platforms">Share Platforms</label>
                <input
                  id="ef-platforms"
                  name="sharePlatforms"
                  value={form.sharePlatforms}
                  onChange={handleChange}
                  placeholder="WhatsApp, X, Facebook, LinkedIn"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="ef-tags">Tags</label>
                <input
                  id="ef-tags"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="culture, event, lifestyle"
                />
              </div>
            </div>
          </div>

          {/* ── Event meta (conditional) ── */}
          {form.contentType === 'event' && (
            <div className="admin-form-section">
              <div className="admin-form-section-title">Event Details</div>
              <div className="admin-event-panel">
                <p className="admin-event-panel-title">🗓 Facebook-style Event Setup</p>
                <div className="admin-form-grid">
                  <div className="admin-field">
                    <label htmlFor="ef-etitle">Event Title</label>
                    <input
                      id="ef-etitle"
                      name="eventTitle"
                      value={form.eventTitle}
                      onChange={handleChange}
                      required={form.contentType === 'event'}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ef-eplatform">Platform</label>
                    <input
                      id="ef-eplatform"
                      name="eventPlatform"
                      value={form.eventPlatform}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ef-estart">Event Start</label>
                    <input
                      id="ef-estart"
                      type="datetime-local"
                      name="eventStartDate"
                      value={form.eventStartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ef-eend">Event End</label>
                    <input
                      id="ef-eend"
                      type="datetime-local"
                      name="eventEndDate"
                      value={form.eventEndDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ef-eloc">Location</label>
                    <input
                      id="ef-eloc"
                      name="eventLocation"
                      value={form.eventLocation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor="ef-eurl">External Link</label>
                    <input
                      id="ef-eurl"
                      name="eventExternalUrl"
                      value={form.eventExternalUrl}
                      onChange={handleChange}
                      placeholder="https://facebook.com/events/…"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Session / auth ── */}
          <div className="admin-form-section">
            <div className="admin-form-section-title">Authentication</div>
            <div className="admin-login-panel">
              <div className="admin-field">
                <label htmlFor="ef-password">Admin Password</label>
                <input
                  id="ef-password"
                  name="adminPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  placeholder="Enter admin password"
                />
              </div>
              <div className="admin-login-actions">
                <button className="btn secondary" type="button" onClick={handleLogin}>
                  Save Session
                </button>
                <button className="btn secondary" type="button" onClick={handleLogout}>
                  Sign Out
                </button>
                <span className={`admin-session-tag${session ? ' active' : ''}`}>
                  <span className="admin-dot" />
                  {session ? 'Session active' : 'Not logged in'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="admin-form-section">
            <div className="admin-form-footer">
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Saving…' : isEditing ? 'Update Post' : 'Publish Post'}
              </button>
              {status && (
                <span className={`admin-status-msg ${statusOk ? 'ok' : 'err'}`}>
                  {status}
                </span>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AdminEditorPane;
