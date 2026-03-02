import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { eventCards, goalCards, teamCards, valueCards } from '../data/siteContent';
import { getPosts } from '../services/api';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getPosts(1, 3);
      setPosts(res.data || []);
    };
    load();
  }, []);

  return (
    <div className="page">
      <section className="hero-block card">
        <div className="hero-overlay">
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
      </section>

      <section className="home-section">
        <div className="section-title">
          <h2>We promote Cultural Heritage and Values</h2>
          <p className="muted">Cultural heritage is the foundation upon which we build our future.</p>
        </div>
        <div className="grid value-grid">
          {valueCards.map((item) => (
            <article className="feature-card card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div className="feature-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-title">
          <h2>Our Dedicated Team</h2>
        </div>
        <div className="grid team-grid">
          {teamCards.map((item) => (
            <article className="team-card card" key={`${item.name}-${item.image}`}>
              <img src={item.image} alt={item.name} />
              <div className="team-body">
                <h3>{item.name}</h3>
                <p>{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="artist-cta card">
        <h2>Are you a local artiste? reach out to us now</h2>
        <p>
          Local talented artists, we recognize your passion and potential.
          Seek sponsorship and promotion and let us work together.
        </p>
        <Link className="btn" to="/contact">Contact Us</Link>
      </section>

      <section className="home-section">
        <div className="section-title">
          <h2>Clearly Defined Goals</h2>
        </div>
        <div className="grid goal-grid">
          {goalCards.map((item) => (
            <article className="goal-card card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div className="goal-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-title">
          <h2>Recent Events</h2>
        </div>
        <div className="grid event-grid">
          {eventCards.slice(0, 3).map((item) => (
            <article className="event-card card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div className="event-body">
                <span className="event-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-title">
          <h2>Latest News</h2>
        </div>
        <div className="grid news-grid">
          {posts.map((post) => (
            <ArticleCard key={post._id || post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="contact-strip card">
        <h2><Link to="/contact">Contact Us today</Link></h2>
        <p>For partnerships, sponsorship opportunities, and cultural exchange initiatives.</p>
      </section>
    </div>
  );
};

export default Home;
