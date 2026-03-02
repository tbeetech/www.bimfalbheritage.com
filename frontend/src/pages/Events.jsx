import { eventCards } from '../data/siteContent';
import './Events.css';

const Events = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Events</h1>
        <p>Programs and campaigns across cultural promotion and social welfare.</p>
      </header>

      <section className="events-grid">
        {eventCards.map((item) => (
          <article key={item.title} className="card event-item">
            <img src={item.image} alt={item.title} />
            <div>
              <h2>{item.title}</h2>
              <p className="event-meta">{item.date}</p>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Events;
