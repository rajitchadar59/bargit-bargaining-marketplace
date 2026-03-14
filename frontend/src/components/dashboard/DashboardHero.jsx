import React, { useState, useEffect } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import './DashboardHero.css';
import heroImg1 from '../../assets/images/customerdashboardhero1.jpg';
import heroImg2 from '../../assets/images/customerdashboardhero2.jpg';
import heroImg3 from '../../assets/images/customerdashboardhero3.jpg';

const images = [
  heroImg1,
  heroImg2,
  heroImg3
];

const DashboardHero = () => {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); 
  const navigate = useNavigate(); 

  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="hero-full-width">
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="hero-slider-bg"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
      </AnimatePresence>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          
          <h1 style={{fontSize:"3.3rem"}}>Don't Just Buy. <br /> <span className="gradient-text">Negotiate Your Price.</span></h1>

          <p className="hero-subtext">
            Welcome back, <span className="pink-highlight">{username}</span> ! Why stick to the tag price? 
            Search for products nearby and <span className="bold-white">start a live negotiation</span> 
            <br/>to grab the lowest price possible, right now.
          </p>

          <div className="hero-search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search gadgets, sneakers, or local stores..."
              className="hero-input"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleKeyPress}
            />
            <button className="hero-search-btn" onClick={handleSearch}>Search</button> {/* 🌟 NAYA: Click handler */}
          </div>

          <div className="hero-stats">
            <div className="h-stat"><b>500+</b> Live Vendors</div>
            <div className="h-stat"><b>100%</b> Real-time Savings</div>
            <div className="h-stat"><b>Nearby</b> Local Deals</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHero;