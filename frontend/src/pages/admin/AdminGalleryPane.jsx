import { useEffect, useRef, useState } from 'react';
import { createGalleryItem, deleteGalleryItem, getGalleryItems } from '../../services/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const AdminGalleryPane = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
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
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(setPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      setStatus('Please select at least one image.');
      setStatusOk(false);
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      await createGalleryItem({ images: imageFiles, caption });
      const count = imageFiles.length;
      setStatus(`${count} ${count === 1 ? 'image' : 'images'} added to gallery!`);
      setStatusOk(true);
      setCaption('');
      setImageFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadItems();
    } catch (err) {
      const errStatus = err?.response?.status;
      if (errStatus === 401) {
        setStatus('Unauthorized. Authentication required.');
      } else if (errStatus === 503) {
        setStatus('Server unavailable. Please wait a moment and try again.');
      } else {
        setStatus('Failed to add images. Check server.');
      }
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
            <div className="admin-form-section-title">New Gallery Images</div>

            <div className="admin-field">
              <label htmlFor="gal-caption">Caption <span style={{ color: 'var(--muted)' }}>(optional — applied to all uploaded images)</span></label>
              <input
                id="gal-caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe these images…"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="gal-image">Images <span style={{ color: 'var(--muted)' }}>(required — select one or more)</span></label>
              <div className="admin-image-zone">
                <input
                  id="gal-image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  aria-label="Upload gallery images"
                />
                <div className="admin-image-zone-label">
                  {imageFiles.length > 0
                    ? `${imageFiles.length} ${imageFiles.length === 1 ? 'image' : 'images'} selected`
                    : 'Click or drag images here (select multiple)'}
                </div>
              </div>
              {previews.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {previews.map((src, i) => (
                    <img
                      key={`${imageFiles[i]?.name}-${imageFiles[i]?.size}-${i}`}
                      src={src}
                      alt={`Preview ${i + 1}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="admin-form-section">
            <div className="admin-form-footer">
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Uploading…' : `Add to Gallery${imageFiles.length > 1 ? ` (${imageFiles.length} images)` : ''}`}
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
                  src={resolveImageUrl(item.imageUrl)}
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
