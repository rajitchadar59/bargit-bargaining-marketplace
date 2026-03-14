import React, { useState, useEffect } from 'react';
import axios from '../axiosPatch';
import server from '../environment';
import AdminNavbar from '../components/AdminNavbar';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
    Store, Users, Box, ArrowRight, Activity, 
    ShieldCheck, Zap, Settings, CreditCard, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { admin } = useAdminAuth();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({
        counts: { vendors: 0, customers: 0, products: 0 },
        recentVendors: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${server}/admin/dashboard/stats`);
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page-layout">
                <AdminNavbar />
                <div className="loading-state" style={{padding: '100px', textAlign: 'center', color: '#6b7280'}}>
                    <Activity size={40} className="spinner" color="#4b5563" style={{margin: '0 auto'}}/>
                    <p style={{marginTop: '15px', fontWeight: '500'}}>Fetching system data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-layout">
            <AdminNavbar />
            
            <div className="admin-content-container fluid-container">
                
                <div className="ad-page-header">
                    <div>
                        <h3 className='header-text'>System Overview</h3>
                        <p>Real-time metrics and platform health</p>
                    </div>
                    <button className="ad-refresh-btn" onClick={fetchDashboardData}>
                        <RefreshCw size={14} /> Refresh Data
                    </button>
                </div>

                <div className="ad-stats-bar">
                    <div className="ad-stat-inline">
                        <Store size={18} className="" />
                        <div className="stat-text">
                            <span className="stat-label">Active Vendors</span>
                            <span className="stat-val">{stats.counts.vendors}</span>
                        </div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="ad-stat-inline">
                        <Users size={18} className="" />
                        <div className="stat-text">
                            <span className="stat-label">Total Customers</span>
                            <span className="stat-val">{stats.counts.customers}</span>
                        </div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="ad-stat-inline">
                        <Box size={18} className="" />
                        <div className="stat-text">
                            <span className="stat-label">Live Catalog</span>
                            <span className="stat-val">{stats.counts.products}</span>
                        </div>
                    </div>
                </div>

                <div className="ad-split-layout">
                    
                    <div className="ad-main-panel">
                        <div className="ad-panel-header">
                            <h3>Recently Onboarded Vendors</h3>
                            <button className="btn-text" onClick={() => navigate('/vendors')}>View All <ArrowRight size={14}/></button>
                        </div>
                        
                        <div className="ad-table-wrapper">
                            <table className="ad-mini-table">
                                <thead>
                                    <tr>
                                        <th>Store Name</th>
                                        <th>Owner</th>
                                        <th>Email</th>
                                        <th style={{textAlign: 'right'}}>Joined On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentVendors.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{textAlign: 'center', padding: '40px', color: '#9ca3af'}}>
                                                No vendors found in the system.
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.recentVendors.map(vendor => (
                                            <tr key={vendor._id}>
                                                <td>
                                                    <div className="td-flex-store">
                                                        <div className="ad-list-avatar">{vendor.companyName.charAt(0).toUpperCase()}</div>
                                                        <span className="fw-bold">{vendor.companyName}</span>
                                                    </div>
                                                </td>
                                                <td>{vendor.ownerName}</td>
                                                <td className="text-muted">{vendor.email}</td>
                                                <td style={{textAlign: 'right'}} className="text-muted">
                                                    {new Date(vendor.createdAt).toLocaleDateString('en-GB')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="ad-side-panel">
                        <div className="ad-widget">
                            <div className="ad-panel-header">
                                <h3>Quick Actions</h3>
                            </div>
                            <div className="ad-widget-body">
                                <button className="ad-action-btn" onClick={() => navigate('/catalog')}>
                                    <Box size={16} color="#4b5563"/> Manage Catalog
                                </button>
                                <button className="ad-action-btn" onClick={() => navigate('/plans')}>
                                    <CreditCard size={16} color="#4b5563"/> Subscription Plans
                                </button>
                                <button className="ad-action-btn" onClick={() => navigate('/settings')}>
                                    <Settings size={16} color="#4b5563"/> Platform Settings
                                </button>
                            </div>
                        </div>

                        <div className="ad-widget mt-20">
                            <div className="ad-panel-header">
                                <h3>System Health</h3>
                            </div>
                            <div className="ad-widget-body">
                                <div className="health-item">
                                    <span className="h-label">Server Status</span>
                                    <span className="h-status text-green">Online</span>
                                </div>
                                <div className="health-item">
                                    <span className="h-label">Database Connection</span>
                                    <span className="h-status text-green">Stable</span>
                                </div>
                                <div className="health-item">
                                    <span className="h-label">Version</span>
                                    <span className="h-status text-muted">v1.0.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;