import './About.css';
import { useSEO } from '../hooks/useSEO';

const pillars = [
  {
    icon: '🏛️',
    title: 'Preserve',
    text: 'Safeguard historic sites, oral traditions, and cultural artifacts for future generations.',
  },
  {
    icon: '🎓',
    title: 'Educate',
    text: 'Build awareness programs that illuminate the richness of our diverse cultural heritage.',
  },
  {
    icon: '🎵',
    title: 'Empower',
    text: 'Champion young local musicians and artists, giving their creative voices a global stage.',
  },
  {
    icon: '🤝',
    title: 'Connect',
    text: 'Bridge communities through cultural exchange, collaboration, and shared celebration.',
  },
];

const About = () => {
  useSEO({
    title: 'About Us',
    description:
      'Learn about Bimfalb Heritage — our mission to preserve Nigerian cultural identity, empower local artists, and document the traditions that define Africa.',
    url: 'https://www.bimfalbheritage.org/about',
    keywords: 'about Bimfalb Heritage, Nigerian cultural identity, African heritage organization, Elano Abimbola Falayi',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.bimfalbheritage.org/' },
      { name: 'About Us', url: 'https://www.bimfalbheritage.org/about' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Bimfalb Heritage',
      url: 'https://www.bimfalbheritage.org/about',
      description: 'Learn about Bimfalb Heritage — our mission to preserve Nigerian cultural identity, empower local artists, and document the traditions that define Africa.',
      mainEntity: {
        '@type': 'NGO',
        '@id': 'https://www.bimfalbheritage.org/#organization',
        name: 'Bimfalb Heritage',
        alternateName: ['BIMFALB', 'Bimfalb Cultural Heritage Promotion and Initiative'],
        url: 'https://www.bimfalbheritage.org',
        logo: 'https://www.bimfalbheritage.org/final.png',
        founder: {
          '@type': 'Person',
          name: 'Elano Abimbola Falayi',
          jobTitle: 'Founder & Cultural Ambassador',
        },
        foundingLocation: {
          '@type': 'Place',
          name: 'Akure, Ondo State, Nigeria',
        },
        description: 'A non governmental community organization for the enhancement of culture, promotion of creativity and social welfare in Nigeria and abroad.',
        areaServed: 'Worldwide',
        knowsAbout: ['Nigerian cultural heritage', 'African traditions', 'Cultural preservation', 'Artist empowerment'],
      },
    },
  });
  return (
    <div className="page">
      <header className="page-header">
        <h1>About Us</h1>
        <p>BIMFALB CULTURAL HERITAGE INITIATIVE &amp; PROMOTION</p>
      </header>

      <section className="about-layout">
        <article className="card about-main">
          <div className="about-main-inner">
            <span className="pill">Our Story</span>
            <h2>Rooted in culture, reaching for tomorrow</h2>
            <p>
              A non governmental community organization for the enhancement of culture,
              promotion of creativity and social welfare in Nigeria and abroad.
            </p>
            <p>
              Led by Elano, Abimbola Falayi (Bimbo Abolu), a cultural ambassador and
              community developer across multiple sectors, Bimfalb Heritage stands as
              a beacon for cultural preservation and creative empowerment.
            </p>
            <p>
              At BIMFALB, we are open to collaborations with individuals, groups, and
              communities for cultural, educational and social exchange initiatives.
            </p>
            <div className="about-signature">
              <div className="about-sig-line" />
              <span>Elano Abimbola Falayi — Founder &amp; Cultural Ambassador</span>
            </div>
          </div>
        </article>

        <aside className="about-side">
          <article className="card about-mission">
            <h3>Core Focus</h3>
            <ul className="about-list-items">
              <li>
                <span className="about-list-icon">✦</span>
                Promote education and awareness on cultures and heritage.
              </li>
              <li>
                <span className="about-list-icon">✦</span>
                Promote young, talented local musicians.
              </li>
              <li>
                <span className="about-list-icon">✦</span>
                Support sustainable development through heritage programs.
              </li>
              <li>
                <span className="about-list-icon">✦</span>
                Preserve historic sites and local documentation practices.
              </li>
              <li>
                <span className="about-list-icon">✦</span>
                Support students and dignify senior citizens in development.
              </li>
            </ul>
          </article>
        </aside>
      </section>

      <section className="about-pillars">
        <div className="section-title" style={{ marginBottom: '32px' }}>
          <h2>Our Four Pillars</h2>
        </div>
        <div className="pillars-grid">
          {pillars.map((p) => (
            <article key={p.title} className="card pillar-card">
              <div className="pillar-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
