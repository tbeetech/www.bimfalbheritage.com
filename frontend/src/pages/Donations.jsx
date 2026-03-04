import './Donations.css';

const impactStats = [
  { number: '50+', label: 'Events Funded' },
  { number: '200+', label: 'Artists Empowered' },
  { number: '15', label: 'Heritage Sites Documented' },
  { number: '1000+', label: 'Youth Reached' },
];

const ways = [
  {
    icon: '🎪',
    title: 'Event Sponsorship',
    text: 'Cover logistics, venue, and production costs for cultural festivals and exhibitions.',
  },
  {
    icon: '🎓',
    title: 'Youth Education Grants',
    text: 'Fund creativity workshops, school outreach, and mentorship for young talents.',
  },
  {
    icon: '📜',
    title: 'Heritage Documentation',
    text: 'Support oral history recording, archive building, and digital preservation.',
  },
  {
    icon: '🎶',
    title: 'Artist Development',
    text: 'Invest in studio time, showcase funding, and equipment for local musicians.',
  },
];

const Donations = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Donations</h1>
        <p>Your Support Can Change Lives for the Better</p>
      </header>

      <section className="donation-hero card">
        <div className="donation-hero-content">
          <span className="pill">Make an impact</span>
          <h2>See the Difference Your Donations Make</h2>
          <p>
            Every donation creates ripples of change, transforming lives and preserving
            cultural heritage through documentation, events, outreach, and youth support.
          </p>
          <p>
            Contributions help maintain heritage programs, artist empowerment, and local
            community initiatives focused on shared cultural identity.
          </p>
          <button className="btn donation-cta">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            Support This Mission
          </button>
        </div>
        <div className="donation-hero-stats">
          {impactStats.map((s) => (
            <div className="donation-stat" key={s.label}>
              <span className="donation-stat-num">{s.number}</span>
              <span className="donation-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ways-section">
        <div className="section-title" style={{ marginBottom: '28px' }}>
          <h2>Ways to Support</h2>
        </div>
        <div className="ways-grid">
          {ways.map((w) => (
            <article key={w.title} className="card way-card">
              <div className="way-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Donations;
