import { useSEO } from '../hooks/useSEO';
import './Contact.css';

const contactDetails = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    ),
    label: 'Address',
    value: 'No. 127 (shop 7) Ebenezer shopping complex, Araromi street, beside Don Bosco, Akure, Ondo State, Nigeria.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
      </svg>
    ),
    label: 'Phone',
    value: '0803 384 2322 or +210-847-6693',
    sub: 'Mon – Sat: 8am – 10pm · Sun closed',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    label: 'Email',
    value: 'bimfalbheritage@gmail.com',
    link: 'mailto:bimfalbheritage@gmail.com',
  },
];

const Contact = () => {
  useSEO({
    title: 'Contact Us',
    description:
      'Get in touch with Bimfalb Heritage for partnerships, cultural programs, donations, or media enquiries. Located in Akure, Ondo State, Nigeria.',
    url: 'https://www.bimfalbheritage.org/contact',
    keywords: 'contact Bimfalb Heritage, Akure cultural organization, Nigerian heritage NGO',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.bimfalbheritage.org/' },
      { name: 'Contact Us', url: 'https://www.bimfalbheritage.org/contact' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Bimfalb Heritage',
      url: 'https://www.bimfalbheritage.org/contact',
      about: {
        '@type': 'NGO',
        name: 'Bimfalb Heritage',
        url: 'https://www.bimfalbheritage.org',
        logo: 'https://www.bimfalbheritage.org/final.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+234-803-384-2322',
          contactType: 'customer service',
          areaServed: 'NG',
          availableLanguage: ['en'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 127 (shop 7) Ebenezer shopping complex, Araromi street, beside Don Bosco',
          addressLocality: 'Akure',
          addressRegion: 'Ondo State',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 7.2526,
          longitude: 5.1931,
        },
      },
    },
  });
  return (
    <div className="page">
      <header className="page-header">
        <h1>Contact Us</h1>
        <p>Reach out for partnerships, programs, and cultural exchange opportunities.</p>
      </header>

      <section className="contact-layout">
        <article className="card contact-info">
          <span className="pill">Get in touch</span>
          <h2>We&apos;d love to hear from you</h2>
          <p className="contact-intro">
            Whether you want to collaborate, sponsor a program, or simply learn more about our work — we&apos;re here.
          </p>

          <div className="contact-details">
            {contactDetails.map((detail) => (
              <div className="contact-detail-item" key={detail.label}>
                <div className="contact-detail-icon">{detail.icon}</div>
                <div>
                  <p className="contact-detail-label">{detail.label}</p>
                  {detail.link ? (
                    <a href={detail.link} className="contact-detail-value link">{detail.value}</a>
                  ) : (
                    <p className="contact-detail-value">{detail.value}</p>
                  )}
                  {detail.sub && <p className="contact-detail-sub">{detail.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card contact-form-wrap">
          <h2>Send us a message</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-field">
              <label htmlFor="cf-name">Full Name</label>
              <input id="cf-name" type="text" placeholder="Your full name" required />
            </div>
            <div className="form-field">
              <label htmlFor="cf-email">Email Address</label>
              <input id="cf-email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="form-field">
              <label htmlFor="cf-subject">Subject</label>
              <input id="cf-subject" type="text" placeholder="What is this about?" required />
            </div>
            <div className="form-field">
              <label htmlFor="cf-message">Message</label>
              <textarea id="cf-message" placeholder="Tell us more..." rows={6} required />
            </div>
            <button className="btn contact-submit" type="submit">
              Send Message
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </article>
      </section>
    </div>
  );
};

export default Contact;
