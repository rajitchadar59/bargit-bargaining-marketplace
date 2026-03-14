import React, { useState, useEffect } from 'react';
import axios from '../axiosPatch'; 
import server from '../environment';
import AdminNavbar from '../components/AdminNavbar';
import { Search, Store, MapPin, Trash2, RefreshCcw, Mail, Phone, IndianRupee, Eye, X, Package, ShoppingCart, CreditCard, Wallet, AlertOctagon, TrendingUp, Zap, Activity ,Box  } from 'lucide-react';
import './Vendors.css';
import { customAlert } from '../utils/toastAlert';


const Vendors = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [vendors, setVendors] = useState([]);
    const [trashedVendors, setTrashedVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal State
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'active') {
                const res = await axios.get(`${server}/admin/vendors`);
                if (res.data.success) setVendors(res.data.data);
            } else {
                const res = await axios.get(`${server}/admin/trash/vendors`);
                if (res.data.success) setTrashedVendors(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTrash = async (vendorId, companyName) => {
        if (!window.confirm(`Are you sure you want to TRASH "${companyName}"? All their products will be hidden from the app instantly.`)) return;
        try {
            const res = await axios.post(`${server}/admin/vendors/${vendorId}/trash`);
            if (res.data.success) {
                setVendors(vendors.filter(v => v._id !== vendorId));
            }
        } catch (error) { customAlert("Failed to move to trash"); }
    };

    const handleRecover = async (trashId, companyName) => {
        if (!window.confirm(`Are you sure you want to RECOVER "${companyName}"? Their account and products will be live again.`)) return;
        try {
            const res = await axios.post(`${server}/admin/trash/vendors/${trashId}/recover`);
            if (res.data.success) {
                setTrashedVendors(trashedVendors.filter(v => v._id !== trashId));
            }
        } catch (error) { customAlert("Failed to recover vendor"); }
    };

    const handlePermanentDelete = async (trashId, companyName) => {
        if (!window.confirm(`⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE "${companyName}"? This action cannot be undone and all their data will be lost forever.`)) return;
        try {
            const res = await axios.delete(`${server}/admin/trash/vendors/${trashId}`);
            if (res.data.success) {
                setTrashedVendors(trashedVendors.filter(v => v._id !== trashId));
                customAlert("Vendor permanently deleted.");
            }
        } catch (error) { customAlert("Failed to delete permanently"); }
    };

    const currentList = activeTab === 'active' ? vendors : trashedVendors;
    const filteredList = currentList.filter(item => {
        const target = activeTab === 'active' ? item : item.vendorData;
        return target.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
               target.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="admin-page-layout">
            <AdminNavbar />
            
            <div className="admin-content-container fluid-container">
                
                <div className="av-page-header">
                    <div>
                        <h3 className='header-text'>Vendor Management</h3>
                        <p>Manage sellers, view analytics, or handle account recovery.</p>
                    </div>
                    <div className="av-search-wrapper">
                        <Search size={16} className="search-icon"/>
                        <input 
                            type="text" 
                            placeholder="Search store or owner name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="av-segmented-tabs">
                    <div 
                        className={`av-seg-tab ${activeTab === 'active' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('active')}
                    >
                        <Store size={14}/> Active Stores 
                        <span className="seg-badge">{vendors.length}</span>
                    </div>
                    <div 
                        className={`av-seg-tab ${activeTab === 'trash' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('trash')}
                    >
                        <Trash2 size={14}/> Trash Bin 
                        <span className="seg-badge">{trashedVendors.length}</span>
                    </div>
                </div>

                <div className="av-table-wrapper">
                    {loading ? (
                        <div className="loading-state">
                            <RefreshCcw className="spinner" size={24} color="#6b7280" />
                            <p>Loading records...</p>
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="empty-state">
                            {activeTab === 'active' ? <Store size={40} color="#9ca3af" /> : <Trash2 size={40} color="#9ca3af" />}
                            <h3>No Records Found</h3>
                            <p>We couldn't find any vendors matching your criteria.</p>
                        </div>
                    ) : (
                        <table className="av-pro-table">
                            <thead>
                                <tr>
                                    <th>Store & Owner</th>
                                    <th>Subscription Plan</th>
                                    {activeTab === 'active' ? <th>Live Metrics</th> : <th>Lost Data</th>}
                                    <th>Status</th>
                                    <th style={{textAlign: 'right'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map(item => {
                                    const isTrash = activeTab === 'trash';
                                    const vendor = isTrash ? item.vendorData : item;
                                    const itemId = item._id;

                                    return (
                                        <tr key={itemId} className={isTrash ? 'trashed-row' : ''}>
                                            <td>
                                                <div className="td-user-info">
                                                    <div className="av-clean-avatar">{vendor.companyName.charAt(0).toUpperCase()}</div>
                                                    <div className="td-user-text">
                                                        <h4>{vendor.companyName}</h4>
                                                        <p>{vendor.ownerName}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="td-plan-info">
                                                    <span className="clean-plan-badge">
                                                        <Zap size={12}/> {vendor.subscription?.planName || 'Free Plan'}
                                                    </span>
                                                    <p>Fee: {vendor.subscription?.platformFee || 0}% / order</p>
                                                </div>
                                            </td>

                                            {isTrash ? (
                                                <td>
                                                    <div className="td-metrics">
                                                        <span className="text-danger"><Package size={14}/> {item.productsData?.length || 0} Products Lost</span>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td>
                                                    <div className="td-metrics">
                                                        <span className="metric-item"><Package size={14}/> {vendor.stats?.totalProducts || 0} Live</span>
                                                        <span className="metric-item"><TrendingUp size={14}/> {vendor.stats?.totalOrders || 0} Sold</span>
                                                    </div>
                                                </td>
                                            )}

                                            <td>
                                                {isTrash 
                                                    ? <span className="status-pill pill-red">Suspended</span> 
                                                    : <span className="status-pill pill-green">Active</span>
                                                }
                                            </td>

                                            <td style={{textAlign: 'right'}}>
                                                {isTrash ? (
                                                    <div className="td-actions">
                                                        <button className="btn-icon btn-outline" onClick={() => handleRecover(itemId, vendor.companyName)} title="Recover Store">
                                                            <RefreshCcw size={14} /> Recover
                                                        </button>
                                                        <button className="btn-icon btn-danger" onClick={() => handlePermanentDelete(itemId, vendor.companyName)} title="Permanently Delete">
                                                            <AlertOctagon size={14} /> Nuke
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="td-actions">
                                                        <button className="btn-icon btn-outline" onClick={() => setSelectedVendor(vendor)} title="View Details">
                                                            <Eye size={14} /> View
                                                        </button>
                                                        <button className="btn-icon btn-outline-danger" onClick={() => handleTrash(itemId, vendor.companyName)} title="Move to Trash">
                                                            <Trash2 size={14} /> Trash
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedVendor && (
                <div className="av-modal-overlay" onClick={() => setSelectedVendor(null)}>
                    <div className="av-modal-box fade-in" onClick={e => e.stopPropagation()}>
                        
                        <div className="av-modal-header">
                            <div className="modal-profile-wrap">
                                <div className="av-clean-avatar modal-avatar">{selectedVendor.companyName.charAt(0).toUpperCase()}</div>
                                <div className="modal-header-text">
                                    <h3>{selectedVendor.companyName}</h3>
                                    <p>Operated by {selectedVendor.ownerName} • Joined {new Date(selectedVendor.createdAt).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                            <button className="modal-close-btn" onClick={() => setSelectedVendor(null)}><X size={20} /></button>
                        </div>

                        <div className="av-modal-body">
                            <div className="modal-stats-4">
                                <div className="m-stat-card">
                                    <p className="text-muted"><CreditCard size={14}/> Online Sales</p>
                                    <h4>₹{selectedVendor.stats?.onlineEarnings?.toLocaleString() || 0}</h4>
                                </div>
                                <div className="m-stat-card">
                                    <p className="text-muted"><IndianRupee size={14}/> COD Sales</p>
                                    <h4>₹{selectedVendor.stats?.codEarnings?.toLocaleString() || 0}</h4>
                                </div>
                                <div className="m-stat-card">
                                    <p className="text-muted"><Wallet size={14}/> Withdrawable</p>
                                    <h4 className="text-green-txt">₹{selectedVendor.walletInfo?.availableBalance?.toLocaleString() || 0}</h4>
                                </div>
                                <div className="m-stat-card">
                                    <p className="text-muted"><Activity size={14}/> Pending Clearance</p>
                                    <h4>₹{selectedVendor.walletInfo?.pendingBalance?.toLocaleString() || 0}</h4>
                                </div>
                            </div>

                            <div className="modal-details-grid">
                                <div className="m-detail-card">
                                    <h4><Box size={16} className="text-muted"/> Business Details</h4>
                                    <div className="m-detail-row">
                                        <span>Current Plan</span>
                                        <span className="clean-plan-badge">{selectedVendor.subscription?.planName || 'Free'}</span>
                                    </div>
                                    <div className="m-detail-row">
                                        <span>Inventory Used</span>
                                        <strong>{selectedVendor.stats?.totalProducts || 0} / {selectedVendor.subscription?.productLimit >= 99999 ? 'Unlimited' : selectedVendor.subscription?.productLimit}</strong>
                                    </div>
                                    <div className="m-detail-row">
                                        <span>Platform Commission</span>
                                        <strong>{selectedVendor.subscription?.platformFee || 0}% per order</strong>
                                    </div>
                                </div>

                                <div className="m-detail-card">
                                    <h4><MapPin size={16} className="text-muted"/> Contact Information</h4>
                                    <div className="m-detail-row">
                                        <span><Mail size={14}/> Email</span>
                                        <strong>{selectedVendor.email}</strong>
                                    </div>
                                    <div className="m-detail-row">
                                        <span><Phone size={14}/> Phone</span>
                                        <strong>{selectedVendor.phoneNumber}</strong>
                                    </div>
                                    <div className="m-detail-row align-top">
                                        <span><MapPin size={14}/> Address</span>
                                        <strong style={{textAlign:'right', color:'#4b5563', lineHeight:'1.4'}}>
                                            {selectedVendor.shopAddress?.street && <>{selectedVendor.shopAddress.street}<br/></>}
                                            {selectedVendor.shopAddress?.city}, {selectedVendor.shopAddress?.state}<br/>
                                            {selectedVendor.shopAddress?.pincode}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendors;