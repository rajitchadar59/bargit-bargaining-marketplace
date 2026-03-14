import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  IndianRupee, 
  BarChart3, 
  Store,
  Settings,
  LogOut,
  User,
  Bell,
  Plus
} from 'lucide-react';
import { Avatar, Menu, MenuItem, IconButton, ListItemIcon, Badge } from '@mui/material';
import './VendorDashNavbar.css';

import { useAuth } from '../../context/AuthContext';

const VendorDashNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useAuth();
  const companyName = user.companyName || 'Vendor Partner';
   
  const activeTab = location.pathname.includes('/vendor/dashboard') ? 'overview' : 
                    location.pathname.includes('/vendor/inventory') ? 'inventory' : 
                    location.pathname.includes('/vendor/orders') ? 'orders' : 
                    location.pathname.includes('/vendor/earnings') ? 'earnings' : 
                    location.pathname.includes('/vendor/add-product') ? 'addproduct' :
                    location.pathname.includes('/vendor/draftProducts') ? 'draftProducts' :
                    location.pathname.includes('/vendor/analytics') ? 'analytics' :'';



  const handleLogout = () => {
    localStorage.clear();
    navigate('/vendor-login');
  };

  return (
    <nav className="v-dash-navbar">
      <div className="v-nav-container">
        
        <div className="v-logo-section" onClick={() => navigate("/vendor/dashboard")}>
                    <div className="logo">BARGIT<span>.</span></div>
                    <span className="v-logo-badge">Business</span>
                </div>

        <div className="v-right-section">
        
          <div className="v-nav-links">
            <span 
              className={`v-nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => navigate('/vendor/dashboard')}
            >
              <LayoutDashboard size={18} /> Overview
            </span>
            
            <span 
              className={`v-nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => navigate('/vendor/inventory')}
            >
              <Package size={18} /> Inventory
            </span>

            <span 
              className={`v-nav-link ${activeTab === 'draftProducts' ? 'active' : ''}`}
              onClick={() => navigate('/vendor/draftProducts')}
            >
              <Package size={18} /> Draft Inventory
            </span>
            
            <span 
              className={`v-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => navigate('/vendor/orders')}
            >
              
              Orders
            </span>

            <span 
              className={`v-nav-link ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => navigate('/vendor/earnings')}
            >
              <IndianRupee size={18} /> Earnings
            </span>

            <span 
              className={`v-nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => navigate('/vendor/analytics')}
            >
              <BarChart3 size={18} /> Analytics
            </span>

              <span 
              className={`v-nav-link ${activeTab === 'addproduct' ? 'active' : ''}`}
              onClick={() => navigate('/vendor/add-product')}
            >
              <Plus size={18} />Add New Products
            </span>
          </div>

          <div className="v-nav-divider"></div>

          <div className="v-user-section">
        

            <div className="v-account-trigger" >
              <div className="v-text-info">
                <span className="v-welcome">Store Admin</span>
                <span className="v-name">{companyName}</span>
              </div>
              <div className="profile" onClick={()=>navigate("/vendor/account")}>
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