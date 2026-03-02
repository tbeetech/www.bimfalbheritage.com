import './Hero.css';

const Hero = () => {
  return (
    <section className="hero card">
      <div className="hero-text">
        <div className="pill">Cultural Platform · Prototype</div>
        <h1>
          Bimfalb Heritage
          <span className="hero-accent"> stories, craft, and memory</span>
        </h1>
        <p>
          A living archive celebrating the rhythm of Bimfalb communities—oral histories,
          river songs, artisan craft, and gatherings illuminated by calabash light.
        </p>
        <div className="hero-actions">
          <a className="btn" href="/blog">Explore the journal</a>
          <a className="btn secondary" href="/about">Learn about the mission</a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-badge">Heritage</div>
        <div className="hero-circle" />
        <div className="hero-image" role="presentation" />
      </div>
    </section>
  );
};

export default Hero;
