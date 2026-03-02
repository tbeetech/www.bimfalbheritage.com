import './About.css';

const About = () => {
  return (
    <div className="page about">
      <div className="about-hero card">
        <div>
          <div className="pill">About</div>
          <h1>Mission: keep Bimfalb culture breathing.</h1>
          <p>
            We are archivists, field recorders, and designers working alongside Bimfalb elders and youth.
            Our goal is to digitize fragile stories, celebrate living artisans, and build pathways for
            communities to share their heritage with dignity.
          </p>
        </div>
        <div className="about-hero-image" role="presentation" />
      </div>

      <section className="about-grid">
        <div className="card about-block">
          <h3>Vision</h3>
          <p>
            A future where every Bimfalb child can hear the river songs of their ancestors and watch the
            crafts that carved their identity—on any device, anywhere in the world.
          </p>
        </div>
        <div className="card about-block">
          <h3>Heritage Preservation</h3>
          <p>
            We work onsite to collect oral histories, digitize textiles, and capture rituals through film.
            Everything is stored with community consent and contextual notes, then shared in multiple languages.
          </p>
        </div>
        <div className="card about-block">
          <h3>Community Exchange</h3>
          <p>
            Fellowships for artisans, youth-led edit-a-thons, and traveling exhibitions keep culture active—not
            frozen. Each program is co-created with local councils.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
