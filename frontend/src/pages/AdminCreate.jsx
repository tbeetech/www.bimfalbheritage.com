import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import RichTextEditor from '../components/RichTextEditor';
import { createPost, login, getSessionStatus, logout } from '../services/api';
import './AdminCreate.css';

const categories = ['History', 'Culture', 'Heritage', 'Events'];

const AdminCreate = () => {
  const [form, setForm] = useState({
    title: '',
    category: 'Culture',
    publishDate: dayjs().format('YYYY-MM-DD'),
    videoUrl: '',
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
          <p className="muted">Protected by header token. This UI is for demo and basic publishing.</p>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <div className="two-col">
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Publish date
              <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange} />
            </label>
          </div>
          <label>
            Video URL (YouTube/Vimeo)
            <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." />
          </label>
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
