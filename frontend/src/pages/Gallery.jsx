import { useEffect, useRef, useState } from 'react';
import { getGalleryItems } from '../services/api';
import { resolveImageUrl } from '../utils/imageUrl';
import Spinner from '../components/Spinner';
import './Gallery.css';

const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 2000;

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [view, setView] = useState('board'); // 'board' | 'slider'
  const [sliderIndex, setSliderIndex] = useState(0);
  const startXRef = useRef(null);
  const [lightbox, setLightbox] = useState(null); // index or null
  const trackRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    const fetchWithRetry = async (retries = RETRY_COUNT, delay = RETRY_DELAY_MS) => {
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const data = await getGalleryItems();
          setItems(Array.isArray(data) ? data : []);
          setFetchError('');
          return;
        } catch (err) {
          const status = err?.response?.status;
          if (status === 503 && attempt < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
          setFetchError(
            status === 503
              ? 'Gallery service is unavailable. Please try again shortly.'
              : 'Failed to load gallery images. Please refresh the page.'
          );
          setItems([]);
          return;
        }
      }
    };
    fetchWithRetry().finally(() => setLoading(false));
  }, []);

  // ── Slider drag handlers ───────────────────────────────────────────────────
  const handleDragStart = (e) => {
    startXRef.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    draggingRef.current = true;
  };

  const handleDragMove = (e) => {
    if (!draggingRef.current || startXRef.current === null) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - startXRef.current);
  };

  const handleDragEnd = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const clientX =
      e.type === 'touchend'
        ? (e.changedTouches[0]?.clientX ?? startXRef.current)
        : e.clientX;
    const diff = clientX - startXRef.current;
    if (diff < -50 && sliderIndex < items.length - 1) {
      setSliderIndex((i) => i + 1);
    } else if (diff > 50 && sliderIndex > 0) {
      setSliderIndex((i) => i - 1);
    }
    setDragOffset(0);
    startXRef.current = null;
  };

  const prevSlide = () => setSliderIndex((i) => Math.max(i - 1, 0));
  const nextSlide = () => setSliderIndex((i) => Math.min(i + 1, items.length - 1));

  return (
    <div className="page gallery-page">
      <div className="gallery-header">
        <h1>Gallery</h1>
        <p>A visual archive of Bimfalb Heritage moments and cultural memories.</p>
        <div className="gallery-view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`gallery-toggle-btn${view === 'board' ? ' active' : ''}`}
            onClick={() => setView('board')}
            aria-pressed={view === 'board'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Board
          </button>
          <button
            type="button"
            className={`gallery-toggle-btn${view === 'slider' ? ' active' : ''}`}
            onClick={() => setView('slider')}
            aria-pressed={view === 'slider'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <polyline points="5,9 2,12 5,15" />
              <polyline points="19,9 22,12 19,15" />
            </svg>
            Deck Slider
          </button>
        </div>
      </div>

      {loading && <Spinner message="Loading gallery…" />}

      {!loading && fetchError && (
        <p className="gallery-error">{fetchError}</p>
      )}

      {!loading && !fetchError && items.length === 0 && (
        <p className="gallery-empty">No gallery images yet. Check back soon!</p>
      )}

      {/* ── Board view ── */}
      {!loading && items.length > 0 && view === 'board' && (
        <div className="gallery-board">
          {items.map((item, i) => (
            <div
              key={item._id}
              className="gallery-card"
              onClick={() => setLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightbox(i)}
              aria-label={item.caption || `Gallery image ${i + 1}`}
            >
              <img src={resolveImageUrl(item.imageUrl)} alt={item.caption || `Gallery image ${i + 1}`} loading="lazy" />
              {item.caption && <div className="gallery-card-caption">{item.caption}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ── Deck slider view ── */}
      {!loading && items.length > 0 && view === 'slider' && (
        <div className="gallery-slider-wrap">
          <div
            className="gallery-slider-track"
            ref={trackRef}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{
              transform: `translateX(calc(-${sliderIndex * 100}% + ${dragOffset}px))`,
              cursor: draggingRef.current ? 'grabbing' : 'grab',
            }}
          >
            {items.map((item, i) => (
              <div
                key={item._id}
                className="gallery-slide"
                onClick={() => !dragOffset && setLightbox(i)}
                aria-label={item.caption || `Gallery image ${i + 1}`}
              >
                <img src={resolveImageUrl(item.imageUrl)} alt={item.caption || `Gallery image ${i + 1}`} draggable={false} />
                {item.caption && <div className="gallery-slide-caption">{item.caption}</div>}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="gallery-slider-arrow prev"
            onClick={prevSlide}
            disabled={sliderIndex === 0}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery-slider-arrow next"
            onClick={nextSlide}
            disabled={sliderIndex === items.length - 1}
            aria-label="Next image"
          >
            ›
          </button>

          <div className="gallery-slider-dots">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`gallery-dot${i === sliderIndex ? ' active' : ''}`}
                onClick={() => setSliderIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <div className="gallery-slider-counter">
            {sliderIndex + 1} / {items.length}
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox !== null && items[lightbox] && (
        <div
          className="gallery-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            ✕
          </button>
          <button
            type="button"
            className="gallery-lightbox-nav prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => Math.max(l - 1, 0)); }}
            disabled={lightbox === 0}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="gallery-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img
              src={resolveImageUrl(items[lightbox].imageUrl)}
              alt={items[lightbox].caption || `Image ${lightbox + 1}`}
            />
            {items[lightbox].caption && (
              <p className="gallery-lightbox-caption">{items[lightbox].caption}</p>
            )}
          </div>
          <button
            type="button"
            className="gallery-lightbox-nav next"
            onClick={(e) => { e.stopPropagation(); setLightbox((l) => Math.min(l + 1, items.length - 1)); }}
            disabled={lightbox === items.length - 1}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
