import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

const SWIPE_THRESHOLD = 40;

const SLIDES = [
  { url: 'https://i.pinimg.com/736x/38/3f/20/383f208ebe7ec9bbe705c0709f3d3217.jpg', alt: 'Bimfalb Heritage – cultural scene' },
  { url: 'https://i.pinimg.com/736x/7a/ed/71/7aed71741f7a0e9f6cf1722c06b7ae9e.jpg', alt: 'Bimfalb Heritage – community gathering' },
  { url: 'https://i.pinimg.com/736x/ac/a8/b9/aca8b919a9277761dc8157c67fc87c38.jpg', alt: 'Bimfalb Heritage – artisan craft' },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = (index) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(current + (delta > 0 ? 1 : -1));
      startTimer();
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); startTimer(); }
    else if (e.key === 'ArrowRight') { goTo(current + 1); startTimer(); }
  };

  return (
    <section
      className="hero-slider"
      aria-label="Hero image carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.url}
          id={`hero-slide-${i}`}
          className={`hero-slide${i === current ? ' active' : ''}`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            referrerPolicy="no-referrer"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Overlay gradient */}
      <div className="hero-slider-overlay" aria-hidden="true" />

      {/* Decorative corner elements */}
      <div className="hero-corner" aria-hidden="true" />
      <div className="hero-corner-br" aria-hidden="true" />

      {/* Text content */}
      <div className="hero-slider-content">
        <div className="hero-badge">&#10022; Bimfalb Heritage &#10022;</div>
        <h1>Bimfalb cultural heritage promotion and initiative</h1>
        <p>
          Promoting education and awareness about different cultures and heritage.
          We also promote young, talented local musicians.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/about-us-3">Learn More</Link>
          <Link className="btn secondary" to="/news">Read News</Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="hero-slider-dots" role="tablist" aria-label="Slide indicators">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.url}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            aria-controls={`hero-slide-${i}`}
            className={`hero-slider-dot${i === current ? ' active' : ''}`}
            onClick={() => { goTo(i); startTimer(); }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
