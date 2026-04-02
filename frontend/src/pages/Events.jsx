import { eventCards } from '../data/siteContent';
import { useSEO } from '../hooks/useSEO';
import './Events.css';

const Events = () => {
  useSEO({
    title: 'Events',
    description:
      'Discover upcoming cultural festivals, heritage campaigns, and community programs organised by Bimfalb Heritage across Nigeria.',
    url: 'https://www.bimfalbheritage.org/events',
    keywords: 'Bimfalb Heritage events, Nigerian cultural festivals, heritage campaigns, community programs Nigeria',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.bimfalbheritage.org/' },
      { name: 'Events', url: 'https://www.bimfalbheritage.org/events' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Bimfalb Heritage Events',
      url: 'https://www.bimfalbheritage.org/events',
      description: 'Cultural festivals, heritage campaigns, and community programs organised by Bimfalb Heritage across Nigeria.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: eventCards.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Event',
            name: item.title,
            description: item.text,
            startDate: item.date,
            image: item.image,
            organizer: {
              '@type': 'NGO',
              name: 'Bimfalb Heritage',
              url: 'https://www.bimfalbheritage.org',
            },
            location: {
              '@type': 'Place',
              name: 'Akure, Ondo State, Nigeria',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Akure',
                addressRegion: 'Ondo State',
                addressCountry: 'NG',
              },
            },
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
          },
        })),
      },
    },
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
              <img src={item.image} alt={item.title} loading="lazy" />
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
