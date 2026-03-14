import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './VendorDashboardHero.css';
import heroImg1 from '../../assets/images/vendordashboardimage1.jpg';
import heroImg2 from '../../assets/images/vendordashboardimage2.jpg';
import heroImg3 from '../../assets/images/vendordashboardimage3.jpg';

const heroImages = [
    heroImg1,
    heroImg2,
    heroImg3  
];

const VendorDashboardHero = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const vendorName = localStorage.getItem('companyName') || 'Tech World';

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="v-hero-full-width">
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="v-hero-slider-bg"
          style={{ backgroundImage: `url(${heroImages[index]})` }}
        />
      </AnimatePresence>

      <div className="v-hero-overlay"></div>

      <div className="v-hero-content container">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Automate. Negotiate. <br /> <span className="v-gradient-text">Dominate the Market.</span></h1>

          <p className="v-hero-subtext">
            Welcome back, <span className="v-pink-highlight">{vendorName}</span>! Your AI agent is currently handling negotiations. Monitor your stock, process pending orders, and scale your revenue effortlessly.
          </p>

          {/* 3 Stats Info Group */}
          <div className="v-hero-glass-action-box">
             <div className="v-glass-info-group">
                <div className="v-glass-info-item">
                    <span>SMART AI AGENT</span>
                    <p>Auto-Negotiates</p>
                </div>
                
                <div className="v-glass-divider"></div>
                
                <div className="v-glass-info-item">
                    <span>HYPERLOCAL</span>
                    <p>Connect Neighbors</p>
                </div>

                <div className="v-glass-divider"></div>
                
                {/* TEESRA STAT YAHAN ADD KIYA HAI */}
                <div className="v-glass-info-item">
                    <span>Control on Bargaining</span>
                    <strong>100%</strong>
                </div>
             </div>
          </div>
                    <div className="v-hero-glass-action-box">
             <div className="v-glass-info-group">
                <div className="v-glass-info-item">
                    <span>SECURE PAYOUTS</span>
                    <p>Fast Settlements</p>
                </div>
                
                <div className="v-glass-divider"></div>
                
                <div className="v-glass-info-item">
                    <span>Manual Effort</span>
                    <p>Zero</p>
                </div>

                <div className="v-glass-divider"></div>
                
                {/* TEESRA STAT YAHAN ADD KIYA HAI */}
                <div className="v-glass-info-item">
                    <span>Store Active</span>
                    <strong>24/7</strong>
                </div>
             </div>
          </div>

          
        </motion.div>
      </div>
    </div>
  );
};

export default VendorDashboardHero;