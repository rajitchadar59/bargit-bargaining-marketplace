import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { 
  ShoppingBag, 
  LayoutGrid, 
  ShoppingCart, 
  Search,
  
} from 'lucide-react';
import { Avatar, Badge } from '@mui/material';
import { useAuth } from '../../context/AuthContext'; // 🌟 AuthContext Import zaroori hai
import './DashNavbar.css';

const DashNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // 🌟 NAYA: Yahan se token aur user data nikal rahe hain
  const { token, user } = useAuth(); 
  
  // Agar context me user ka naam hai toh wo lo, warna localStorage check karo
  const username = user?.username || localStorage.getItem('username') || 'User';
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // URL ke base par active tab decide karna
  const activeTab = location.pathname.includes('dashboard') ? 'marketplace' : 
                    location.pathname.includes('cart') ? 'cart' : 
                    location.pathname.includes('categories') ? 'categories' : '';

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav className="dash-navbar">
      <div className="dash-nav-container">
      
        <div className="logo" onClick={() => navigate('/dashboard')}>
            BARGIT<span className="dot">.</span>
        </div>
      
        {/* Navbar Search Bar */}
        <div className="nav-search-container">
          <Search size={18} className="nav-search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }} />
          <input 
            type="text" 
            placeholder="Search products, categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="nav-search-input"
          />
        </div>

        <div className="right-section">
          {/* Menu Links */}
          <div className="dash-links">
            <span 
              className={`nav-link ${activeTab === 'marketplace' ? 'active' : ''}`} 
              onClick={() => navigate('/dashboard')}
            >
              <ShoppingBag size={18} /> Marketplace
            </span>
            
            <span 
              className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => navigate('/categories')}
            >
              <LayoutGrid size={18} /> Categories
            </span>
            
            <span 
              className={`nav-link ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag size={18} />
              Cart
            </span>
          </div>

          <div className="nav-divider"></div>

          {/* 🌟 MAIN LOGIC: Auth Check 🌟 */}
          {token ? (
            // Agar Token HAI -> User Profile Dikhao
            <div className="user-account">
              <span className="welcome-text">Hi, <strong>{username}</strong></span>
              
              <div className="customer-profile" onClick={() => navigate('/profile')} style={{cursor:"pointer"}}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FF2E63', 
                    width: 38, 
                    height: 38, 
                    fontSize: '1rem',
                    fontWeight: 700,
                    border: '2px solid #fff',
                    boxShadow: '0 4px 12px rgba(255, 46, 99, 0.2)'
                  }}
                >
                  {username[0]?.toUpperCase()}
                </Avatar>
              </div>
            </div>
          ) : (
            // Agar Token NAHI HAI -> Login/Signup Buttons Dikhao
            <div className="auth-buttons-group">
              <button className="nav-btn-outline" onClick={() => navigate('/auth')}>Log In</button>
              <button className="nav-btn-solid" onClick={() => navigate('/auth')}>Sign Up</button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default DashNavbar;