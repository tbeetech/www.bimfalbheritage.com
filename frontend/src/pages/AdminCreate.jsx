import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import RichTextEditor from '../components/RichTextEditor';
import { createPost, updatePost, getPost, login, getSessionStatus, logout } from '../services/api';
import './AdminCreate.css';

const categories = ['History', 'Culture', 'Heritage', 'Events', 'Lifestyle'];
const contentTypes = ['blog', 'vlog', 'news', 'lifestyle', 'event'];

const AdminCreate = () => {
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(editId);

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
        setExistingImages(Array.isArray(post.images) && post.images.length > 0 ? post.images : (post.coverImage ? [post.coverImage] : []));
      } catch {
        setStatus('Failed to load post for editing.');
      }
    };
    load();
  }, [editId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      if (!session) {
        await login(password);
        setSession(true);
        localStorage.setItem('bh_admin_password', password);
      }
      let post;
      if (isEditing) {
        post = await updatePost(editId, { ...form, body, images });
        setStatus('Post updated!');
      } else {
        post = await createPost({ ...form, body, images });
        setStatus('Post created!');
      }
      navigate(`/blog/${post._id || post.id}`);
    } catch (err) {
      setStatus(isEditing ? 'Failed to update post.' : 'Failed to create post. Check session or server.');
    }
  };

  const handleLogin = async () => {
    try {
      await login(password);
      setSession(true);
      localStorage.setItem('bh_admin_password', password);
      setStatus('Session active');
    } catch {
      setSession(false);
      setStatus('Login failed');
    }
  };

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
          <h1>{isEditing ? 'Edit post' : 'Create a new cultural post'}</h1>
          <p className="muted">Session-based admin composer with cooperation fields and cross-platform sharing metadata.</p>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Excerpt
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} />
          </label>
          <div className="two-col">
            <label>
              Author name
              <input name="authorName" value={form.authorName} onChange={handleChange} />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Content type
              <select name="contentType" value={form.contentType} onChange={handleChange}>
                {contentTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <div className="two-col">
            <label>
              Publish date
              <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange} />
            </label>
            <label>
              Video URL (YouTube/Vimeo)
              <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." />
            </label>
          </div>
          <div className="two-col">
            <label>
              Collaboration partner
              <input name="collaborationPartner" value={form.collaborationPartner} onChange={handleChange} placeholder="Organization or media partner" />
            </label>
            <label>
              Collaboration type
              <input name="collaborationType" value={form.collaborationType} onChange={handleChange} placeholder="Sponsorship, media exchange, co-production" />
            </label>
          </div>
          <label>
            Share platforms
            <input name="sharePlatforms" value={form.sharePlatforms} onChange={handleChange} placeholder="WhatsApp, X, Facebook, LinkedIn, Email" />
          </label>
          <label>
            Tags
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="culture, event, lifestyle" />
          </label>
          {form.contentType === 'event' && (
            <div className="event-meta card">
              <h3>Event Setup (Facebook-style event launch)</h3>
              <div className="two-col">
                <label>
                  Event title
                  <input name="eventTitle" value={form.eventTitle} onChange={handleChange} required={form.contentType === 'event'} />
                </label>
                <label>
                  Event platform
                  <input name="eventPlatform" value={form.eventPlatform} onChange={handleChange} />
                </label>
              </div>
              <div className="two-col">
                <label>
                  Event start
                  <input type="datetime-local" name="eventStartDate" value={form.eventStartDate} onChange={handleChange} />
                </label>
                <label>
                  Event end
                  <input type="datetime-local" name="eventEndDate" value={form.eventEndDate} onChange={handleChange} />
                </label>
              </div>
              <div className="two-col">
                <label>
                  Event location
                  <input name="eventLocation" value={form.eventLocation} onChange={handleChange} />
                </label>
                <label>
                  External event link
                  <input name="eventExternalUrl" value={form.eventExternalUrl} onChange={handleChange} placeholder="https://facebook.com/events/..." />
                </label>
              </div>
            </div>
          )}
          <label htmlFor="post-images">
            Images (up to 3)
            <input id="post-images" type="file" accept="image/*" multiple onChange={handleImagesChange} />
            {images.length > 0 && (
              <span className="muted">{images.length} image{images.length > 1 ? 's' : ''} selected</span>
            )}
            {isEditing && existingImages.length > 0 && images.length === 0 && (
              <div className="existing-images">
                <span className="muted">Current images (upload new ones to replace):</span>
                <div className="existing-images-grid">
                  {existingImages.map((img, i) => (
                    <img
                      key={i}
                      src={img?.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || ''}${img}`}
                      alt={`Current image ${i + 1}`}
                      className="existing-thumb"
                    />
                  ))}
                </div>
              </div>
            )}
          </label>
          <label>
            Article body
            <RichTextEditor value={body} onChange={setBody} placeholder="Compose with bold, lists, quotes..." />
          </label>
          <div className="session-row">
            <label>
              Admin password
              <input
                name="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </label>
            <div className="session-actions">
              <button className="btn secondary" type="button" onClick={handleLogin}>Save session</button>
              <button className="btn secondary" type="button" onClick={handleLogout}>Logout</button>
              <span className={`session-dot ${session ? 'on' : 'off'}`}>{session ? 'Session active' : 'Session off'}</span>
            </div>
          </div>
          <button className="btn" type="submit">{isEditing ? 'Update post' : 'Publish post'}</button>
          {status && <p className="muted">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminCreate;
