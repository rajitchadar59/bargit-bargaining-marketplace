import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Store, MapPin, Zap, Settings, Landmark } from 'lucide-react';
import VendorDashNavbar from './VendorDashNavbar';
import VendorPersonalInfo from '../../components/vendor/VendorPersonalInfo';
import VendorStorefront from '../../components/vendor/VendorStorefront';
import VendorLocation from '../../components/vendor/VendorLocation';
import VendorSubscription from '../../components/vendor/VendorSubscription';
import VendorAdvancedActions from '../../components/vendor/VendorAdvancedActions';
import VendorBankDetails from '../../components/vendor/VendorBankDetails'; 
import './VendorAccount.css'; 

const VendorAccount = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('personal');
    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location]);

    const menuItems = [
        { id: 'personal', label: 'Account & Profile', icon: <User size={18} /> },
        { id: 'storefront', label: 'Shop Details', icon: <Store size={18} /> },
        { id: 'bank', label: 'Payout Details', icon: <Landmark size={18} /> }, 
        { id: 'location', label: 'Location Setup', icon: <MapPin size={18} /> },
        { id: 'subscription', label: 'Current Plan', icon: <Zap size={18} /> },
        { id: 'advanced', label: 'Advanced Actions', icon: <Settings size={18} /> }
    ];

    return (
        <div className="vo-layout">
            <VendorDashNavbar />
            
            <div className="va-full-width-container">
                <div className="vac-header">
                    <div>
                        <h2 className="va-title">Account <span className="pink-text">Settings.</span></h2>
                    </div>
                </div>

                <div className="vac-main-grid">
                    <div className="vac-sidebar">
                        {menuItems.map(item => (
                            <button 
                                key={item.id}
                                className={`vac-tab-btn ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="vac-content-area">
                        {activeTab === 'personal' && <VendorPersonalInfo />}
                        {activeTab === 'storefront' && <VendorStorefront />}
                        {activeTab === 'bank' && <VendorBankDetails />} 
                        {activeTab === 'location' && <VendorLocation />}
                        {activeTab === 'subscription' && <VendorSubscription />}
                        {activeTab === 'advanced' && <VendorAdvancedActions />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorAccount;