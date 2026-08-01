import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  IndianRupee, 
  BarChart3, 
  Plus,
  Menu as MenuIcon, // Renamed to avoid conflict with MUI Menu
  X
} from 'lucide-react';
import { Avatar } from '@mui/material';
import './VendorDashNavbar.css';

import { useAuth } from '../../context/AuthContext';

const VendorDashNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const companyName = user?.companyName || 'Vendor Partner';
   
  const activeTab = location.pathname.includes('/vendor/dashboard') ? 'overview' : 
                    location.pathname.includes('/vendor/inventory') ? 'inventory' : 
                    location.pathname.includes('/vendor/orders') ? 'orders' : 
                    location.pathname.includes('/vendor/earnings') ? 'earnings' : 
                    location.pathname.includes('/vendor/add-product') ? 'addproduct' :
                    location.pathname.includes('/vendor/draftProducts') ? 'draftProducts' :
                    location.pathname.includes('/vendor/analytics') ? 'analytics' :'';

  // Helper function to handle navigation and close menu on mobile
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="v-dash-navbar">
      <div className="v-nav-container">
        
        <div className="v-logo-section" onClick={() => handleNavigation("/vendor/dashboard")}>
          <div className="logo">BARGIT<span>.</span></div>
          <span className="v-logo-badge">Business</span>
        </div>

        {/* Mobile Toggle Button */}
        <div className="v-mobile-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
        </div>

        {/* Right Section wrapped for mobile responsiveness */}
        <div className={`v-right-section ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="v-nav-links">
            <span 
              className={`v-nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => handleNavigation('/vendor/dashboard')}
            >
              <LayoutDashboard size={18} /> Overview
            </span>
            
            <span 
              className={`v-nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => handleNavigation('/vendor/inventory')}
            >
              <Package size={18} /> Inventory
            </span>

            <span 
              className={`v-nav-link ${activeTab === 'draftProducts' ? 'active' : ''}`}
              onClick={() => handleNavigation('/vendor/draftProducts')}
            >
              <Package size={18} /> Draft Inventory
            </span>
            
            <span 
              className={`v-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavigation('/vendor/orders')}
            >
              Orders
            </span>

            <span 
              className={`v-nav-link ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => handleNavigation('/vendor/earnings')}
            >
              <IndianRupee size={18} /> Earnings
            </span>

            <span 
              className={`v-nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleNavigation('/vendor/analytics')}
            >
              <BarChart3 size={18} /> Analytics
            </span>

              <span 
              className={`v-nav-link ${activeTab === 'addproduct' ? 'active' : ''}`}
              onClick={() => handleNavigation('/vendor/add-product')}
            >
              <Plus size={18} /> Add New Products
            </span>
          </div>

          <div className="v-nav-divider"></div>

          <div className="v-user-section">
            <div className="v-account-trigger" onClick={() => handleNavigation("/vendor/account")}>
              <div className="v-text-info">
                <span className="v-welcome">Store Admin</span>
                <span className="v-name">{companyName}</span>
              </div>
              <div className="profile">
                <Avatar 
                  sx={{ 
                    bgcolor: '#0A0E17', 
                    width: 38, 
                    height: 38, 
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    border: '2px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {companyName[0].toUpperCase()}
                </Avatar>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default VendorDashNavbar;