import './About.css';

const About = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>About Us</h1>
        <p>BIMFALB CULTURAL HERITAGE INITIATIVE &amp; PROMOTION</p>
      </header>

      <section className="about-layout">
        <article className="card about-main">
          <p>
            A non governmental community organization for the enhancement of culture,
            promotion of creativity and social welfare in Nigeria and abroad.
          </p>
          <p>
            Led by Elano, Abimbola Falayi (Bimbo Abolu), a cultural ambassador and
            community developers across multiple sectors.
          </p>
          <p>
            At BIMFALB, we are open to collaborations with individuals, groups, and
            communities for cultural, educational and social exchange initiatives.
          </p>
        </article>

        <article className="card about-list">
          <h2>Core Focus</h2>
          <ul>
            <li>Promote education and awareness on cultures and heritage.</li>
            <li>Promote young, talented local musicians.</li>
            <li>Support sustainable development through heritage programs.</li>
            <li>Preserve historic sites and local documentation practices.</li>
            <li>Support students and dignify senior citizens in development.</li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default About;
