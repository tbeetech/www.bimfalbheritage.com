import { faqItems } from '../data/siteContent';
import './Faq.css';

const Faq = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>FAQ</h1>
        <p>Common questions about programs, collaboration, and cultural preservation.</p>
      </header>

      <section className="faq-list">
        {faqItems.map((item) => (
          <details className="card faq-item" key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
};

export default Faq;
