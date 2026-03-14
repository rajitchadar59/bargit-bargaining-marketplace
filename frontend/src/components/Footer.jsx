import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2 className="logo">BARGIT<span>.</span></h2>
          <p>Redefining luxury retail through the art of the deal.</p>
        </div>
        
        <div className="footer-links">
          <h4>Explore</h4>
          <span>Electronics</span>
          <span>Timepieces</span>
          <span>Accessories</span>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <span>Shipping Policy</span>
          <span>Authenticity Guarantee</span>
          <span>Contact Us</span>
        </div>

        <div className="footer-links">
          <h4>Social</h4>
          <span>Instagram</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>© 2026 BARGIT LUXURY RETAIL PVT LTD. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;