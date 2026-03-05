import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

const SLIDES = [
  { id: '1yPKNNzuLHSNE1TEE_J2Quc2vsDIPvfE0', alt: 'Bimfalb Heritage – cultural scene' },
  { id: '1md_DWJhT5CLH2PYSl7UffWJm9acECUOc', alt: 'Bimfalb Heritage – community gathering' },
  { id: '1w4vFPELBZ1hw8Oth8YjWsUstoqx2CIxi', alt: 'Bimfalb Heritage – artisan craft' },
];

const driveUrl = (id) => `https://drive.google.com/uc?export=view&id=${id}`;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

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

  const handleNav = (dir) => {
    goTo(current + dir);
    startTimer();
  };

  return (
    <section className="hero-slider" aria-label="Hero image carousel">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          id={`hero-slide-${i}`}
          className={`hero-slide${i === current ? ' active' : ''}`}
          style={{ backgroundImage: `url(${driveUrl(slide.id)})` }}
          role="img"
          aria-label={slide.alt}
          aria-hidden={i !== current}
        />
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

      {/* Prev / Next buttons */}
      <button
        type="button"
        className="hero-slider-arrow hero-slider-arrow--prev"
        onClick={() => handleNav(-1)}
        aria-label="Previous slide"
      >
        &#8249;
      </button>
      <button
        type="button"
        className="hero-slider-arrow hero-slider-arrow--next"
        onClick={() => handleNav(1)}
        aria-label="Next slide"
      >
        &#8250;
      </button>

      {/* Dot indicators */}
      <div className="hero-slider-dots" role="tablist" aria-label="Slide indicators">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
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
