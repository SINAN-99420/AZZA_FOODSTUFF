import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="azza-footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <img
            src="/images/azza-logo.png"
            alt="Azza Foodstuff"
          />

          <p>
            Natural goodness, carefully selected
            and made with care.
          </p>
        </div>


        {/* Links */}
        <div className="footer-links">
          <h4>Explore</h4>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>


        {/* Help */}
        <div className="footer-links">
          <h4>Customer Care</h4>

          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>


        {/* Contact */}
        <div className="footer-contact">
          <h4>Get In Touch</h4>

          <p>Malappuram, Kerala</p>

          <a href="tel:+919495987283">
            +91 94959 87283
          </a>

          <a href="mailto:hello@azzafoodstuff.com">
            hello@azzafoodstuff.com
          </a>

          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>
          </div>
        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Azza Foodstuff. All rights reserved.
        </p>

        <span>
          GOOD FOOD · BRIGHTER DAYS
        </span>

      </div>

    </footer>
  );
}

export default Footer;