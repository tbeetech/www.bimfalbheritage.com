import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-box">
          <h4 className="footer-title">About Us</h4>
          <p>
            A non governmental community organization for the enhancement of culture,
            promotion of creativity and social welfare in Nigeria and abroad.
          </p>
        </div>

        <div className="footer-box">
          <h4 className="footer-title">Contact Info</h4>
          <p>No. 127 (shop 7) Ebenezer shopping complex, Araromi street, beside Don Bosco, Akure, Ondo State</p>
          <p>Phone: 0803 384 2322</p>
          <p>Email: bimfalbheritage@gmail.com</p>
        </div>

        <div className="footer-box">
          <h4 className="footer-title">Newsletter</h4>
          <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" required />
            <button type="submit">Subscribe</button>
          </form>
          <h4 className="footer-title follow">Follow Us</h4>
          <div className="social-row">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="YouTube">YouTube</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <nav>
          <a href="/">Home</a>
          <a href="/about-us-3">About Us</a>
          <a href="/news">Blog</a>
          <a href="/contact">Contact</a>
          <a href="/faq">FAQ</a>
        </nav>
        <span>(c) {new Date().getFullYear()} Bimfalb Heritage</span>
      </div>
    </footer>
  );
};

export default Footer;
