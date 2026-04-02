import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import Carousel from '../components/Carousel';
import HeroSlider from '../components/HeroSlider';
import { useSEO } from '../hooks/useSEO';
import Spinner from '../components/Spinner';
import { eventCards, goalCards, teamCards, valueCards } from '../data/siteContent';
import { getPosts } from '../services/api';
import './Home.css';

const statsData = [
  { number: '10+', label: 'Years of Heritage Work' },
  { number: '50+', label: 'Cultural Events Hosted' },
  { number: '200+', label: 'Artists Supported' },
  { number: '5k+', label: 'Community Members' },
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useSEO({
    title: 'Home',
    description:
      'Bimfalb Heritage (BIMFALB) preserves and promotes Nigerian cultural heritage, supports local artists, and documents historic traditions across Africa and the Globe.',
    url: 'https://www.bimfalbheritage.org/',
    keywords: 'Nigerian cultural heritage, African traditions, cultural preservation, Bimfalb Heritage, local artists',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.bimfalbheritage.org/' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'NGO',
      name: 'Bimfalb Heritage',
      alternateName: ['BIMFALB', 'Bimfalb', 'bimfalbheritage'],
      url: 'https://www.bimfalbheritage.org',
      logo: 'https://www.bimfalbheritage.org/logo.jpg',
      image: 'https://www.bimfalbheritage.org/logo.jpg',
      description: 'Bimfalb Heritage preserves and promotes Nigerian cultural heritage, supports local artists, and documents historic traditions across Africa and the Globe.',
      sameAs: [
        'https://twitter.com/bimfalbheritage',
        'https://www.facebook.com/bimfalbheritage',
        'https://www.instagram.com/bimfalbheritage',
        'https://www.youtube.com/@bimfalbheritage',
        'https://wa.me/2348033842322',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+234-803-384-2322',
        contactType: 'customer service',
        availableLanguage: ['English', 'Yoruba', 'Hausa', 'Igbo'],
      },
      foundingLocation: {
        '@type': 'Place',
        name: 'Nigeria',
        addressCountry: 'NG',
      },
      areaServed: 'Worldwide',
      keywords: 'bimfalb, bimfalbheritage, Nigerian cultural heritage, African heritage, cultural promotion',
    },
  });

  useEffect(() => {
    const load = async () => {
      const res = await getPosts(1, 6);
      setPosts(res.data || []);
      setPostsLoading(false);
    };
    load();
  }, []);

  return (
    <div className="page">
      <HeroSlider />

      <div className="stats-section">
        {statsData.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="home-section">
        <div className="section-title african-divider">
          <h2>We promote Cultural Heritage and Values</h2>
          <p className="muted">Cultural heritage is the foundation upon which we build our future.</p>
        </div>
        <Carousel
          items={valueCards}
          renderItem={(item) => (
            <article className="feature-card">
              <img src={item.image} alt={item.title} />
              <div className="feature-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          )}
        />
      </section>

      <section className="home-section">
        <div className="section-title african-divider">
          <h2>Our Dedicated Team</h2>
        </div>
        <Carousel
          items={teamCards}
          renderItem={(item) => (
            <article className="team-card">
              <img src={item.image} alt={item.name} />
              <div className="team-body">
                <h3>{item.name}</h3>
                <p>{item.role}</p>
              </div>
            </article>
          )}
        />
        <div className="team-social">
          <a href="https://www.facebook.com/bimfalbheritage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="team-social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/></svg>
          </a>
          <a href="https://www.instagram.com/bimfalbheritage" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="team-social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a href="https://www.youtube.com/@bimfalbheritage" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="team-social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://twitter.com/bimfalbheritage" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="team-social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://wa.me/2348033842322" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="team-social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          </a>
        </div>
      </section>

      <section className="artist-cta">
        <h2>Are you a local artiste? reach out to us now</h2>
        <p>
          Local talented artists, we recognize your passion and potential.
          Seek sponsorship and promotion and let us work together.
        </p>
        <Link className="btn" to="/contact">Contact Us</Link>
      </section>

      <section className="home-section">
        <div className="section-title african-divider">
          <h2>Clearly Defined Goals</h2>
        </div>
        <Carousel
          items={goalCards}
          renderItem={(item) => (
            <article className="goal-card">
              <img src={item.image} alt={item.title} />
              <div className="goal-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          )}
        />
      </section>

      <section className="home-section">
        <div className="section-title african-divider">
          <h2>Recent Events</h2>
        </div>
        <Carousel
          items={eventCards}
          renderItem={(item) => (
            <article className="event-card">
              <img src={item.image} alt={item.title} />
              <div className="event-body">
                <span className="event-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          )}
        />
      </section>

      <section className="home-section">
        <div className="section-title african-divider">
          <h2>Latest News</h2>
        </div>
        {postsLoading ? (
          <Spinner message="Loading latest posts…" />
        ) : posts.length > 0 ? (
          <Carousel
            items={posts}
            renderItem={(post) => (
              <ArticleCard post={post} />
            )}
          />
        ) : (
          <p className="muted" style={{ textAlign: 'center', padding: '20px 0' }}>No posts available yet.</p>
        )}
      </section>

      <section className="contact-strip card">
        <h2><Link to="/contact">Contact Us today</Link></h2>
        <p>For partnerships, sponsorship opportunities, and cultural exchange initiatives.</p>
      </section>
    </div>
  );
};

export default Home;
