import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import './Home.css';
import { getPosts } from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getPosts(1, 6);
      setPosts(res.data || []);
    };
    load();
  }, []);

  const featured = posts.slice(0, 3);
  const videoHighlight = posts.find((p) => p.videoUrl) || featured[0];

  return (
    <div className="page">
      <Hero />

      <section className="about-preview card">
        <div>
          <div className="section-title">
            <span className="pill">About</span>
            <span className="muted">Our purpose</span>
          </div>
          <h2>We keep Bimfalb memory alive.</h2>
          <p>
            Bimfalb Heritage documents oral histories, crafts, and rituals before they fade.
            We partner with elders, youth leaders, and artisans to record stories, digitize
            artifacts, and host gatherings where culture is celebrated in the present tense.
          </p>
          <div className="about-points">
            <div className="point">
              <div className="dot" />
              <span>Field recordings and river song archives</span>
            </div>
            <div className="point">
              <div className="dot" />
              <span>Artisan residencies with shared studios</span>
            </div>
            <div className="point">
              <div className="dot" />
              <span>Community festivals that light the calabash trail</span>
            </div>
          </div>
        </div>
        <div className="about-image" role="presentation" />
      </section>

      <section>
        <div className="section-title">
          <span className="pill">Journal</span>
          <span className="muted">Featured cultural stories</span>
        </div>
        <div className="grid featured-grid">
          {featured.map((post) => (
            <ArticleCard key={post._id || post.id} post={post} />
          ))}
        </div>
      </section>

      {videoHighlight && (
        <section className="video-section card">
          <div>
            <div className="section-title">
              <span className="pill">Watch</span>
              <span className="muted">Voices in motion</span>
            </div>
            <h2>{videoHighlight.title}</h2>
            <p className="muted">
              A short film from the Bimfalb collective, capturing communal weaving, drum calls,
              and the laughter that keeps stories awake.
            </p>
            <a className="btn" href={videoHighlight.videoUrl || '#'} target="_blank" rel="noreferrer">
              Play video
            </a>
          </div>
          <div className="video-embed">
            {videoHighlight.videoUrl ? (
              <iframe
                src={videoHighlight.videoUrl.replace('watch?v=', 'embed/')}
                title="Featured video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="video-placeholder">Video coming soon</div>
            )}
          </div>
        </section>
      )}

      <section id="newsletter" className="newsletter card">
        <div>
          <div className="section-title">
            <span className="pill">Stay close</span>
            <span className="muted">Monthly field notes</span>
          </div>
          <h2>Join the Bimfalb field notes.</h2>
          <p className="muted">Sign up to receive cultural highlights, festival updates, and calls for collaboration. (Demo only.)</p>
        </div>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Your email" required />
          <button className="btn" type="submit">Join waitlist</button>
        </form>
      </section>
    </div>
  );
};

export default Home;
