import React from "react";
import "./ContactSection.css";

function ContactSection() {
  const whatsappNumber = "919400040225";

  const openWhatsApp = () => {
    const message =
      "Hello Azza Foodstuff, I would like to know more about your products.";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        <div className="contact-card">

          <div className="contact-main">
            <p className="contact-label">GET IN TOUCH</p>

            <h2>
              Let's talk about<br />
              something natural.
            </h2>

            <p className="contact-description">
              Have a question about our honey or want to place an order?
              We're always happy to help.
            </p>

            <div className="contact-buttons">
              <button
                onClick={openWhatsApp}
                className="whatsapp-btn"
              >
                WhatsApp Us
              </button>

              <a
                href="tel:+919400040225"
                className="call-btn"
              >
                Call Us
              </a>
            </div>
          </div>

          <div className="contact-info">

            <div className="contact-info-item">
              <span>PHONE</span>
              <p>+91 94000 40225</p>
            </div>

            <div className="contact-info-item">
              <span>EMAIL</span>
              <p>azzafoodstuff4@gmail.com</p>
            </div>

            <div className="contact-info-item">
              <span>LOCATION</span>
              <p>Nilambur, Malappuram, Kerala, India</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default ContactSection;