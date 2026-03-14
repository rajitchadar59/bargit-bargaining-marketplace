import React, { useState, useEffect } from 'react';
import { User, MapPin, LogOut, Package, Heart } from 'lucide-react'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import server from '../environment'; 


import DashNavbar from '../components/dashboard/DashNavbar'; 
import CustomerPersonalInfo from '../components/profile/CustomerPersonalInfo';
import CustomerAddresses from '../components/profile/CustomerAddresses';
import CustomerOrders from '../components/profile/CustomerOrders';     
import CustomerWishlist from '../components/profile/CustomerWishlist'; 
import { customAlert } from '../utils/toastAlert';

import './CustomerProfile.css'; 

const CustomerProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [customer, setCustomer] = useState(null); 
    const [loading, setLoading] = useState(true);
    
    const { token, logout } = useAuth(); 

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/customer/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCustomer(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            customAlert("Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfileData();
        }
    }, [token]);

    const refreshProfile = () => {
        fetchProfileData();
    };

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2rem'}}>Loading Profile...</div>;
    }

    return (
        <div className="cp-page-wrapper">
            <DashNavbar />
            <div className="cp-full-width-container">
                
                <div className="cp-header">
                    <div><h2 className="cp-title">My <span className="pink-text">Profile.</span></h2></div>
                    
                    {customer && (
                        <div className="cp-user-identity">
                            <div className="cp-avatar">{customer.username?.charAt(0).toUpperCase()}</div>
                            <div className="cp-user-text">
                                <h4>{customer.username}</h4>
                                <p>{customer.email}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="cp-main-grid">
                    <div className="cp-sidebar"> 
                        <button className={`cp-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                            <User size={16} /> Account Settings
                        </button>
                        
                        <button className={`cp-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <Package size={16} /> My Orders
                        </button>
                        
                        <button className={`cp-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
                            <Heart size={16} /> Wishlist
                        </button>
                        
                        <button className={`cp-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                            <MapPin size={16} /> Saved Addresses
                        </button>
                        
                        <div className="cp-divider"></div>
                        
                        <button className="cp-tab-btn text-red" onClick={logout}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <div className="cp-content-area">
                        {activeTab === 'profile' && <CustomerPersonalInfo customer={customer} refreshProfile={refreshProfile} token={token} />}
                        
                        {activeTab === 'orders' && <CustomerOrders token={token} />}
                        {activeTab === 'wishlist' && <CustomerWishlist token={token} />}
                        
                        {activeTab === 'addresses' && <CustomerAddresses addresses={customer?.addresses} refreshProfile={refreshProfile} token={token} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;