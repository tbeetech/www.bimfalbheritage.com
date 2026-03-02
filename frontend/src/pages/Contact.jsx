import './Contact.css';

const Contact = () => {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Contact</h1>
        <p>Reach out for partnerships, programs, and cultural exchange opportunities.</p>
      </header>

      <section className="contact-layout">
        <article className="card contact-info">
          <h2>Address</h2>
          <p>Ebenezer shopping complex, Araromi street, beside Don Bosco, Akure, Ondo State, Nigeria.</p>
          <h2>Phone</h2>
          <p>0803 384 2322 or +210-847-6693</p>
          <p>Mon - Sat: 8am - 10pm; Sun closed</p>
          <h2>Email</h2>
          <p>bimfalbheritage@gmail.com</p>
        </article>

        <article className="card contact-form-wrap">
          <h2>Contact</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Subject" required />
            <textarea placeholder="Message" rows={6} required />
            <button className="btn" type="submit">Send Message</button>
          </form>
        </article>
      </section>
    </div>
  );
};

export default Contact;
