import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import RichTextEditor from '../components/RichTextEditor';
import { createPost, login, getSessionStatus, logout } from '../services/api';
import './AdminCreate.css';

const categories = ['History', 'Culture', 'Heritage', 'Events', 'Lifestyle'];
const contentTypes = ['blog', 'vlog', 'news', 'lifestyle', 'event'];

const AdminCreate = () => {
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
  const [coverImage, setCoverImage] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      await createPost({
        ...form,
        body,
        coverImage,
      });
      setStatus('Post created!');
      setForm((prev) => ({
        ...prev,
        title: '',
        excerpt: '',
        tags: '',
      }));
      setBody('');
      setCoverImage(null);
    } catch (err) {
      setStatus('Failed to create post. Check session or server.');
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
          <h1>Create a new cultural post</h1>
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
          <label>
            Cover image
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
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
          <button className="btn" type="submit">Publish post</button>
          {status && <p className="muted">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminCreate;
