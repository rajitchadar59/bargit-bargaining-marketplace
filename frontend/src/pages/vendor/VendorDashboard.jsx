import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import server from '../../environment';
import VendorDashNavbar from './VendorDashNavbar';
import VendorDashboardHero from '../../components/vendor/VendorDashboardHero'; 
import './VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [warningMsg, setWarningMsg] = useState("");

  useEffect(() => {
    const checkSubscription = async () => {
        try {
            const res = await axios.get(`${server}/vendors/profile/subscription`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const sub = res.data.data.subscription;
                const totalProds = res.data.data.totalProducts;
                const now = new Date();

                if (sub.planId === 'free' && totalProds > sub.productLimit) {
                    setWarningMsg(`Limit Exceeded! You have ${totalProds} products but your Free Plan limit is ${sub.productLimit}. Your store is hidden.`);
                } else if (sub.planId !== 'free' && new Date(sub.endDate) < now) {
                    setWarningMsg("Your subscription has expired! Your products are no longer visible to customers.");
                }
            }
        } catch (error) {
            console.error("Failed to fetch sub status", error);
        }
    };
    if(token) checkSubscription();
  }, [token]);

  return (
    <div className="vo-layout">
      <VendorDashNavbar />

      {warningMsg && (
        <div style={{
            backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '15px 20px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
            color: '#b91c1c', fontWeight: '600', fontSize: '0.95rem', textAlign: 'center', zIndex: 100
        }}>
            <AlertTriangle size={20} />
            <span>
                {warningMsg} 
                <span onClick={() => navigate('/vendor/account')} style={{color: '#dc2626', textDecoration: 'underline', marginLeft: '10px', fontWeight: '800', cursor: 'pointer'}}>
                    Upgrade Plan Now
                </span>
            </span>
        </div>
      )}

      <VendorDashboardHero />

      <section className="info-section">
        <div className="info-content">
          <span className="section-tag">STORE OVERVIEW</span>
          <h2>Live Business <span className="pink-text">Metrics.</span></h2>
          <p>
            Track your store's health at a glance. Your AI agent is actively negotiating deals, ensuring maximum conversion with minimum effort from your side.
          </p>

          <div className="mini-feature">
            <h4>₹ 1,24,500 Net Earnings</h4>
            <p>Total revenue generated this month. Your AI agent successfully closed 124 deals without any manual intervention.</p>
          </div>

          <div className="mini-feature" style={{ marginTop: '20px' }}>
            <h4>48 Active Listings</h4>
            <p>Your inventory is live and currently receiving 14.2K monthly views from premium buyers. Maintain stock to keep the momentum.</p>
          </div>
        </div>

        <div className="info-content right-side">
          <span className="section-tag">ACTION REQUIRED</span>
          <h2>Your Priority <span className="pink-text">Tasks.</span></h2>
          
          <div className="benefits-container">
            <div className="benefit-line"></div>
            
            <div className="benefit-item" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>
              <div className="benefit-dot"></div>
              <div>
                <h4>3 Products Out of Stock</h4>
                <p>Dyson V15 Vacuum & MacBook Air M2 are out of stock. Please restock immediately to avoid missing live AI deals.</p>
              </div>
            </div>

            <div className="benefit-item" onClick={() => navigate('/v-orders')} style={{ cursor: 'pointer' }}>
              <div className="benefit-dot"></div>
              <div>
                <h4>12 Pending Orders</h4>
                <p>AI has closed these deals. Pack the items, print the shipping labels, and mark them as ready for dispatch.</p>
              </div>
            </div>

            <div className="benefit-item" onClick={() => navigate('/v-profile')} style={{ cursor: 'pointer' }}>
              <div className="benefit-dot"></div>
              <div>
                <h4>Payout Ready: ₹45,200</h4>
                <p>Your settlement is ready to be transferred. Update your banking details in your profile to receive the funds.</p>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
};

export default VendorDashboard;