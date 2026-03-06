import { useEffect, useRef, useState } from 'react';
import { createGalleryItem, deleteGalleryItem, getGalleryItems, login, logout } from '../../services/api';

const resolveUrl = (url) =>
  url?.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || ''}${url || ''}`;

const AdminGalleryPane = ({ session, onSessionChange }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [statusOk, setStatusOk] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const loadItems = async () => {
    try {
      const data = await getGalleryItems();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setStatus('Please select an image.');
      setStatusOk(false);
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      if (!session) {
        await login(password);
        onSessionChange?.(true);
      }
      await createGalleryItem({ image: imageFile, caption });
      setStatus('Image added to gallery!');
      setStatusOk(true);
      setCaption('');
      setImageFile(null);
      setPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadItems();
    } catch {
      setStatus('Failed to add image. Check your session or server.');
      setStatusOk(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setStatus('Image deleted.');
      setStatusOk(true);
    } catch {
      setStatus('Failed to delete image.');
      setStatusOk(false);
    }
  };

  const handleLogin = async () => {
    try {
      await login(password);
      onSessionChange?.(true);
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
        <div className="pill">Gallery Manager</div>
        <h1>Add to Gallery</h1>
        <p>Upload images with captions to the public gallery. Images are stored in MongoDB Atlas.</p>
      </div>

      <div className="admin-form-wrap">

        {/* ── Upload form ── */}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-section">
            <div className="admin-form-section-title">New Gallery Image</div>

            <div className="admin-field">
              <label htmlFor="gal-caption">Caption <span style={{ color: 'var(--muted)' }}>(required)</span></label>
              <input
                id="gal-caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe this image…"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="gal-image">Image <span style={{ color: 'var(--muted)' }}>(required)</span></label>
              <div className="admin-image-zone">
                <input
                  id="gal-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  aria-label="Upload gallery image"
                  required
                />
                <div className="admin-image-zone-label">
                  {imageFile ? imageFile.name : 'Click or drag an image here'}
                </div>
              </div>
              {preview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Authentication ── */}
          <div className="admin-form-section">
            <div className="admin-form-section-title">Authentication</div>
            <div className="admin-login-panel">
              <div className="admin-field">
                <label htmlFor="gal-password">Admin Password</label>
                <input
                  id="gal-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required={!session}
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

          <div className="admin-form-section">
            <div className="admin-form-footer">
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Uploading…' : 'Add to Gallery'}
              </button>
              {status && (
                <span className={`admin-status-msg ${statusOk ? 'ok' : 'err'}`}>
                  {status}
                </span>
              )}
            </div>
          </div>
        </form>

        {/* ── Existing gallery items ── */}
        <div className="admin-form-section">
          <div className="admin-form-section-title">
            Current Gallery ({items.length} {items.length === 1 ? 'image' : 'images'})
          </div>
          {loading && <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading…</p>}
          {!loading && items.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No gallery images yet.</p>
          )}
          <div className="admin-gallery-grid">
            {items.map((item) => (
              <div key={item._id} className="admin-gallery-thumb-wrap">
                <img
                  src={resolveUrl(item.imageUrl)}
                  alt={item.caption || 'Gallery image'}
                  className="admin-gallery-thumb"
                />
                {item.caption && (
                  <div className="admin-gallery-thumb-caption">{item.caption}</div>
                )}
                <button
                  type="button"
                  className="admin-gallery-delete-btn"
                  onClick={() => handleDelete(item._id)}
                  aria-label="Delete gallery image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryPane;
