import { useState, useCallback } from 'react';
import { useSEO } from '../hooks/useSEO';
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

const ACCOUNT = {
  bank: 'Polaris Bank',
  name: 'BIMFALB CULTURAL PROMOTION HERITAGE NIGERIA LIMITED',
  number: '409 197 0454',
};

const DonatePanel = ({ context, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(ACCOUNT.number.replace(/\s/g, '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <div className="donate-overlay" role="dialog" aria-modal="true" aria-label="Donate account details" onClick={onClose}>
      <div className="donate-panel card" onClick={(e) => e.stopPropagation()}>
        <button className="donate-panel-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className="donate-panel-header">
          <span className="donate-panel-icon">💛</span>
          <h2>Make Your Donation</h2>
          {context && <p className="donate-panel-context">{context}</p>}
        </div>

        <p className="donate-panel-intro">
          Transfer your contribution directly to our official bank account. Every naira goes
          towards preserving culture, empowering artists, and reaching communities.
        </p>

        <div className="donate-account-card">
          <div className="donate-account-row">
            <span className="donate-account-label">Bank</span>
            <span className="donate-account-value">{ACCOUNT.bank}</span>
          </div>
          <div className="donate-account-row">
            <span className="donate-account-label">Account Name</span>
            <span className="donate-account-value donate-account-name">{ACCOUNT.name}</span>
          </div>
          <div className="donate-account-row donate-account-number-row">
            <span className="donate-account-label">Account Number</span>
            <div className="donate-account-number-wrap">
              <span className="donate-account-number">{ACCOUNT.number}</span>
              <button
                className={`donate-copy-btn${copied ? ' copied' : ''}`}
                onClick={handleCopy}
                aria-label="Copy account number"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="donate-panel-note">
          After transferring, please send proof of payment to our contact email or WhatsApp for
          acknowledgement and receipt.
        </p>

        <button className="btn donate-panel-done" onClick={onClose}>Done</button>
      </div>
    </div>
  );
};

const Donations = () => {
  const [panelContext, setPanelContext] = useState(null);

  useSEO({
    title: 'Support Us — Donate',
    description:
      'Support the preservation of Nigerian cultural heritage. Donate to Bimfalb Heritage to fund events, empower artists, and document historic traditions.',
    url: 'https://www.bimfalbheritage.org/donations',
    keywords: 'donate Bimfalb Heritage, support Nigerian culture, heritage donation, cultural preservation fund',
    breadcrumbs: [
      { name: 'Home', url: 'https://www.bimfalbheritage.org/' },
      { name: 'Donations', url: 'https://www.bimfalbheritage.org/donations' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Support Bimfalb Heritage — Donate',
      url: 'https://www.bimfalbheritage.org/donations',
      description: 'Support the preservation of Nigerian cultural heritage. Donate to Bimfalb Heritage to fund events, empower artists, and document historic traditions.',
      mainEntity: {
        '@type': 'NGO',
        '@id': 'https://www.bimfalbheritage.org/#organization',
        name: 'Bimfalb Heritage',
        url: 'https://www.bimfalbheritage.org',
      },
      potentialAction: {
        '@type': 'DonateAction',
        name: 'Donate to Bimfalb Heritage',
        recipient: {
          '@type': 'NGO',
          name: 'Bimfalb Heritage',
          url: 'https://www.bimfalbheritage.org',
        },
      },
    },
  });

  const openPanel = useCallback((context) => setPanelContext(context || 'General Donation'), []);
  const closePanel = useCallback(() => setPanelContext(null), []);

  return (
    <div className="page">
      {panelContext !== null && (
        <DonatePanel context={panelContext} onClose={closePanel} />
      )}

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
          <button className="btn donation-cta" onClick={() => openPanel('General Donation')}>
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
            <article
              key={w.title}
              className="card way-card"
              role="button"
              tabIndex={0}
              onClick={() => openPanel(w.title)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(w.title); } }}
            >
              <div className="way-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
              <span className="way-card-donate-link">Donate →</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Donations;
