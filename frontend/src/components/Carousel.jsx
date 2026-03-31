import { useState, useEffect, useRef } from 'react';
import './Carousel.css';

const BASE_AUTO_SLIDE_INTERVAL_MS = 4500;
const AUTO_SLIDE_SLOWDOWN_FACTOR = 1.3;
const DEFAULT_AUTO_SLIDE_INTERVAL_MS = Math.round(
  BASE_AUTO_SLIDE_INTERVAL_MS * AUTO_SLIDE_SLOWDOWN_FACTOR
);

const ITEMS_PER_VIEW_BREAKPOINTS = [
  { maxWidth: 600, items: 1 },
  { maxWidth: 900, items: 2 },
  { maxWidth: Infinity, items: 3 },
];

const getItemsPerView = () => {
  const w = window.innerWidth;
  for (const bp of ITEMS_PER_VIEW_BREAKPOINTS) {
    if (w <= bp.maxWidth) return bp.items;
  }
  return 3;
};

const Carousel = ({
  items = [],
  renderItem,
  autoPlay = true,
  interval = DEFAULT_AUTO_SLIDE_INTERVAL_MS,
}) => {
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(getItemsPerView);
  const animating = useRef(false);
  const maxIndexRef = useRef(0);

  const total = items.length;
  const maxIndex = Math.max(0, total - perView);

  useEffect(() => {
    maxIndexRef.current = maxIndex;
  });

  const go = (dir) => {
    if (animating.current) return;
    animating.current = true;
    setCurrent((c) => {
      const max = maxIndexRef.current;
      if (dir === 1) return c >= max ? 0 : c + 1;
      return c <= 0 ? max : c - 1;
    });
    setTimeout(() => { animating.current = false; }, 380);
  };

  useEffect(() => {
    const handleResize = () => {
      setPerView(getItemsPerView());
      setCurrent(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      if (animating.current) return;
      animating.current = true;
      setCurrent((c) => {
        const max = maxIndexRef.current;
        return c >= max ? 0 : c + 1;
      });
      setTimeout(() => { animating.current = false; }, 380);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval]);

  const visible = items.slice(current, current + perView);

  return (
    <div className="carousel">
      <button
        className="carousel-arrow carousel-arrow--prev"
        onClick={() => go(-1)}
        aria-label="Previous"
      >
        &#8249;
      </button>

      <div className="carousel-track">
        {visible.map((item, i) => (
          <div className="carousel-slide" key={current + i}>
            {renderItem(item, current + i)}
          </div>
        ))}
      </div>

      <button
        className="carousel-arrow carousel-arrow--next"
        onClick={() => go(1)}
        aria-label="Next"
      >
        &#8250;
      </button>

      <div className="carousel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
