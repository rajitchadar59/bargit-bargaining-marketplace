import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
const Navbar = ({ onAuthClick }) => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={()=>{navigate("/")}} style={{cursor:"pointer"}}>BARGIT<span>.</span></div>
        
        <div className="nav-links">
          <span className="nav-item" onClick={()=>{navigate("/dashboard")}} style={{cursor:"pointer"}}>Collections</span>
          <span className="nav-item">Our Story</span>
          <div className="auth-btns">
            <button className="btn-login" onClick={()=>{navigate("/auth")}}>Sign In</button>
            <button className="btn-signup" onClick={()=>{navigate("/auth")}}>Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;