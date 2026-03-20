import { useState } from 'react';
import { faqItems } from '../data/siteContent';
import { useSEO } from '../hooks/useSEO';
import './Faq.css';

const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`card faq-item${open ? ' open' : ''}`}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="faq-question">
        <span>{item.q}</span>
        <span className="faq-chevron" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
          </svg>
        </span>
      </div>
      <div className="faq-answer">
        <div className="faq-answer-inner">
          <p>{item.a}</p>
        </div>
      </div>
    </article>
  );
};

const Faq = () => {
  useSEO({
    title: 'Frequently Asked Questions',
    description:
      'Find answers to common questions about Bimfalb Heritage — our programs, how to collaborate, nominate heritage sites, and support cultural preservation.',
    url: 'https://www.bimfalbheritage.com/faq',
  });
  return (
    <div className="page">
      <header className="page-header">
        <h1>FAQ</h1>
        <p>Common questions about programs, collaboration, and cultural preservation.</p>
      </header>

      <section className="faq-list">
        {faqItems.map((item) => (
          <FaqItem key={item.q} item={item} />
        ))}
      </section>
    </div>
  );
};

export default Faq;
