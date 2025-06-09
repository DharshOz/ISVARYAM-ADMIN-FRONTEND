import React from 'react';
import './ContactPage.css';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you!</p>
      </section>

      <section className="contact-content container">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Feel free to reach out to us for any queries, feedback, or partnership opportunities.</p>
          <ul>
            <li><strong>📍 Address:</strong> 123 Organic Way, Coimbatore, TN</li>
            <li><strong>📞 Phone:</strong> +91 98765 43210</li>
            <li><strong>✉️ Email:</strong> support@isvaryam.com</li>
          </ul>
        </div>

        <div className="contact-form">
          <h2>Send a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </section>

      <section className="map-section">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18..."
          loading="lazy"
          allowFullScreen=""
        ></iframe>
      </section>
    </div>
  );
}
