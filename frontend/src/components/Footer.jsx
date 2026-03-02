import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="brand-mark small">BH</div>
          <h4>Bimfalb Heritage</h4>
          <p className="muted">Preserving the sounds, textures, and stories of Bimfalb communities.</p>
        </div>
        <div className="footer-links">
          <h5>Explore</h5>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
        </div>
        <div className="footer-links">
          <h5>Social</h5>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">Newsletter</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bimfalb Heritage</span>
        <span className="muted">Prototype for client demo</span>
      </div>
    </footer>
  );
};

export default Footer;
