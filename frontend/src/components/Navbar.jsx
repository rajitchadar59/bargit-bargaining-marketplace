import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Imported icons from lucide-react

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menu toggle karne ke liye
  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigate hone ke baad mobile menu close karne ke liye
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => handleNavigation("/")}>
          BARGIT<span>.</span>
        </div>
        
        {/* Desktop Navigation & Mobile Dropdown */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <span className="nav-item" onClick={() => handleNavigation("/dashboard")}>
            Collections
          </span>
          <span className="nav-item">Our Story</span>
          <div className="auth-btns">
            <button className="btn-login" onClick={() => handleNavigation("/auth")}>
              Sign In
            </button>
            <button className="btn-signup" onClick={() => handleNavigation("/auth")}>
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Menu Icon (Only visible on small screens) */}
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;