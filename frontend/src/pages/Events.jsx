import { eventCards } from '../data/siteContent';
import { useSEO } from '../hooks/useSEO';
import './Events.css';

const Events = () => {
  useSEO({
    title: 'Events',
    description:
      'Discover upcoming cultural festivals, heritage campaigns, and community programs organised by Bimfalb Heritage across Nigeria.',
    url: 'https://www.bimfalbheritage.org/events',
  });
  return (
    <div className="page">
      <header className="page-header">
        <h1>Events</h1>
        <p>Programs and campaigns across cultural promotion and social welfare.</p>
      </header>

      <section className="events-grid">
        {eventCards.map((item) => (
          <article key={item.title} className="card event-item">
            <div className="event-item-img-wrap">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="event-item-body">
              <p className="event-meta">📅 {item.date}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Events;
