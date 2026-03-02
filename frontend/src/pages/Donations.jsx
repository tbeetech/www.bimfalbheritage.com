import './Donations.css';

const Donations = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Donations</h1>
        <p>Your Support Can Change Lives for the Better</p>
      </header>

      <section className="donation-layout">
        <article className="card donation-main">
          <h2>See the Difference Your Donations Make</h2>
          <p>
            Every donation creates ripples of change, transforming lives and preserving
            cultural heritage through documentation, events, outreach, and youth support.
          </p>
          <p>
            Contributions help maintain heritage programs, artist empowerment, and local
            community initiatives focused on shared cultural identity.
          </p>
          <button className="btn">Support This Mission</button>
        </article>

        <article className="card donation-side">
          <h2>Ways to Support</h2>
          <ul>
            <li>Event sponsorship and logistics support</li>
            <li>Youth creativity and education grants</li>
            <li>Heritage documentation partnerships</li>
            <li>Artist development and showcase funding</li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default Donations;
