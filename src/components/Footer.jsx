import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const whatsappNumber = "919XXXXXXXXX";

  const openWhatsApp = () => {
    const message =
      "Hello Azza Foodstuff, I would like to know more about your products.";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <img
              src="/images/azza-logo.png"
              alt="Azza Foodstuff"
            />
          </Link>

          <p>
            Pure honey and thoughtfully crafted honey nut
            products, made with care and brought to your home.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>

            <button onClick={openWhatsApp}>
              WhatsApp
            </button>
          </div>

        </div>


        {/* Explore */}
        <div className="footer-column">

          <h3>Explore</h3>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>

        </div>


        {/* Customer Care */}
        <div className="footer-column">

          <h3>Customer Care</h3>

          <Link to="/cart">Your Cart</Link>
          <Link to="/shop">Our Products</Link>
          <Link to="/contact">Get in Touch</Link>

        </div>


        {/* Contact */}
        <div className="footer-column footer-contact">

          <h3>Contact</h3>

          <div className="footer-contact-item">
            <span>PHONE</span>

            <a href="tel:+919XXXXXXXXX">
              +91 XXXXX XXXXX
            </a>
          </div>

          <div className="footer-contact-item">
            <span>EMAIL</span>

            <a href="mailto:hello@azzafoodstuff.com">
              hello@azzafoodstuff.com
            </a>
          </div>

          <div className="footer-contact-item">
            <span>LOCATION</span>

            <p>Kerala, India</p>
          </div>

        </div>

      </div>


      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Azza Foodstuff. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <Link to="/privacy">
            Privacy Policy
          </Link>

          <Link to="/terms">
            Terms & Conditions
          </Link>
        </div>

      </div>

    </footer>
  );
}

export default Footer;