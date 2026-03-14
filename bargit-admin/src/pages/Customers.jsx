import React, { useState, useEffect } from 'react';
import axios from '../axiosPatch';
import server from '../environment';
import AdminNavbar from '../components/AdminNavbar';
import { Search, Users, MapPin, Trash2, RefreshCcw, Mail, Phone, Eye, X, ShoppingBag, IndianRupee, AlertOctagon, Calendar, XOctagon, Heart } from 'lucide-react';
import './Customers.css';
import { customAlert } from '../utils/toastAlert';


const Customers = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [customers, setCustomers] = useState([]);
    const [trashedCustomers, setTrashedCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'active') {
                const res = await axios.get(`${server}/admin/customers`);
                if (res.data.success) setCustomers(res.data.data);
            } else {
                const res = await axios.get(`${server}/admin/trash/customers`);
                if (res.data.success) setTrashedCustomers(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTrash = async (userId, username) => {
        if (!window.confirm(`Move "${username}" to Trash? They won't be able to log in.`)) return;
        try {
            const res = await axios.post(`${server}/admin/customers/${userId}/trash`);
            if (res.data.success) {
                setCustomers(customers.filter(c => c._id !== userId));
            }
        } catch (error) { customAlert("Failed to move to trash"); }
    };

    const handleRecover = async (trashId, username) => {
        if (!window.confirm(`Recover "${username}"? Their account will be active again.`)) return;
        try {
            const res = await axios.post(`${server}/admin/trash/customers/${trashId}/recover`);
            if (res.data.success) {
                setTrashedCustomers(trashedCustomers.filter(c => c._id !== trashId));
            }
        } catch (error) { customAlert("Failed to recover"); }
    };

    const handlePermanentDelete = async (trashId, username) => {
        if (!window.confirm(`⚠️ PERMANENTLY DELETE "${username}"? This cannot be undone.`)) return;
        try {
            const res = await axios.delete(`${server}/admin/trash/customers/${trashId}`);
            if (res.data.success) {
                setTrashedCustomers(trashedCustomers.filter(c => c._id !== trashId));
            }
        } catch (error) { customAlert("Failed to delete permanently"); }
    };

    const currentList = activeTab === 'active' ? customers : trashedCustomers;
    const filteredList = currentList.filter(item => {
        const target = activeTab === 'active' ? item : item.userData;
        return target.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            target.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            target.phone?.includes(searchTerm);
    });

    return (
        <div className="admin-page-layout">
            <AdminNavbar />

            <div className="cust-main-container">

                <div className="cust-header-section">
                    <div className="cust-title-block">
                        <h3>Customer Directory</h3>
                        <p>Manage your shopper base, view order history, and handle accounts.</p>
                    </div>
                    <div className="cust-search-pill">
                        <Search size={16} className="cust-icon-gray" />
                        <input
                            type="text"
                            placeholder="Find a customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="cust-tabs-row">
                    <button
                        className={`cust-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        <Users size={14} /> Active Users <span className="cust-tab-count">{customers.length}</span>
                    </button>
                    <button
                        className={`cust-tab-btn ${activeTab === 'trash' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trash')}
                    >
                        <Trash2 size={14} /> Suspended <span className="cust-tab-count trash">{trashedCustomers.length}</span>
                    </button>
                </div>

                <div className="cust-data-surface">
                    {loading ? (
                        <div className="cust-empty-state">
                            <RefreshCcw className="spinner" size={24} color="#0ea5e9" />
                            <p>Loading directory...</p>
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="cust-empty-state">
                            {activeTab === 'active' ? <Users size={32} color="#94a3b8" /> : <Trash2 size={32} color="#fca5a5" />}
                            <h3>Directory Empty</h3>
                            <p>No matching customers found in this list.</p>
                        </div>
                    ) : (
                        <table className="cust-table">
                            <thead>
                                <tr>
                                    <th>Shopper Details</th>
                                    <th>Contact Information</th>
                                    {activeTab === 'active' ? <th>Activity Metrics</th> : <th>Lost Metrics</th>}
                                    <th>Account Status</th>
                                    <th style={{ textAlign: 'right' }}>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map(item => {
                                    const isTrash = activeTab === 'trash';
                                    const customer = isTrash ? item.userData : item;
                                    const itemId = item._id;

                                    return (
                                        <tr key={itemId} className={isTrash ? 'cust-row-deleted' : 'cust-row-active'}>
                                            <td>
                                                <div className="cust-profile-flex">
                                                    <div className="cust-avatar-soft">{customer.username?.charAt(0).toUpperCase()}</div>
                                                    <div className="cust-profile-text">
                                                        <strong>{customer.username}</strong>
                                                        <span>Joined {new Date(customer.createdAt).toLocaleDateString('en-GB')}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="cust-info-stack">
                                                    <span><Mail size={12} /> {customer.email}</span>
                                                    <span><Phone size={12} /> {customer.phone || 'Not Provided'}</span>
                                                </div>
                                            </td>

                                            {activeTab === 'active' ? (
                                                <td>
                                                    <div className="cust-info-stack">
                                                        <span><ShoppingBag size={12} className="icon-blue" /> {customer.stats?.totalOrders || 0} Orders</span>
                                                        <span className="text-emerald"><IndianRupee size={12} /> {customer.stats?.totalSpent?.toLocaleString() || 0} LTV</span>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td>
                                                    <div className="cust-info-stack text-rose">
                                                        <span><XOctagon size={12} /> Account Disabled</span>
                                                    </div>
                                                </td>
                                            )}

                                            <td>
                                                {isTrash
                                                    ? <div className="cust-tag tag-rose">Deleted</div>
                                                    : <div className="cust-tag tag-emerald">Active</div>
                                                }
                                            </td>

                                            <td style={{ textAlign: 'right' }}>
                                                {isTrash ? (
                                                    <div className="cust-action-group">
                                                        <button className="cust-btn-soft btn-green" onClick={() => handleRecover(itemId, customer.username)}>
                                                            <RefreshCcw size={12} /> Restore
                                                        </button>
                                                        <button className="cust-btn-soft btn-red" onClick={() => handlePermanentDelete(itemId, customer.username)}>
                                                            <AlertOctagon size={12} /> Nuke
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="cust-action-group">
                                                        <button className="cust-btn-soft btn-blue" onClick={() => setSelectedCustomer(customer)}>
                                                            <Eye size={12} /> Profile
                                                        </button>
                                                        <button className="cust-btn-soft btn-gray" onClick={() => handleTrash(itemId, customer.username)}>
                                                            <Trash2 size={12} />
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

            {selectedCustomer && (
                <div className="cust-modal-backdrop" onClick={() => setSelectedCustomer(null)}>
                    <div className="cust-modal-window fade-in" onClick={e => e.stopPropagation()}>

                        <div className="cm-pro-header">
                            <div className="cm-header-left">
                                <div className="cm-avatar-pro">{selectedCustomer.username?.charAt(0).toUpperCase()}</div>
                                <div className="cm-user-info">
                                    <div className="cm-name-badge">
                                        <h2>{selectedCustomer.username}</h2>
                                        <span className={`cm-status-badge ${activeTab === 'trash' ? 'deleted' : 'active'}`}>
                                            {activeTab === 'trash' ? 'Suspended' : 'Active Customer'}
                                        </span>
                                    </div>
                                    <div className="cm-meta-data">
                                        <span><Mail size={12} /> {selectedCustomer.email}</span>
                                        <span className="cm-dot">•</span>
                                        <span><Phone size={12} /> {selectedCustomer.phone || 'N/A'}</span>
                                        <span className="cm-dot">•</span>
                                        <span>ID: {selectedCustomer._id}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="cm-close-btn" onClick={() => setSelectedCustomer(null)}><X size={18} /></button>
                        </div>

                        <div className="cust-modal-body">

                            <div className="cust-kpi-grid">
                                <div className="stats-info">
                                    <div className="top">
                                        <ShoppingBag size={16} />
                                        <p>Total Orders</p>
                                    </div>

                                    <div className="bottom">
                                        <h3>{selectedCustomer.stats?.totalOrders || 0}</h3>
                                    </div>
                                </div>

                                <div className="stats-info">
                                    <div className="top">
                                        <XOctagon size={16} />
                                        <p>Cancelled</p>

                                    </div>

                                    <div className="bottom">
                                        <h3>{selectedCustomer.stats?.cancelledOrders || 0}</h3>
                                    </div>
                                </div>

                                <div className="stats-info">
                                    <div className="top">
                                        <IndianRupee size={16} />
                                        <p>Lifetime Spent</p>
                                    </div>

                                    <div className="bottom">
                                        <h3>₹{selectedCustomer.stats?.totalSpent?.toLocaleString() || 0}</h3>
                                    </div>

                                </div>

                                <div className="stats-info">
                                    <div className="top">
                                        <Calendar size={16} />
                                        <p>Joined Date</p>
                                    </div>

                                    <div className="bottom">
                                        <h3 style={{ fontSize: '0.95rem' }}>{new Date(selectedCustomer.createdAt).toLocaleDateString('en-GB')}</h3>

                                    </div>
                                </div>

                            </div>

                            <div className="cust-details-layout">
                                <div className="cust-detail-panel">
                                    <div className="panel-header">
                                        <Users size={14} /> <h4>Platform Activity</h4>
                                    </div>
                                    <div className="panel-row">
                                        <span className="panel-label">Account Created</span>
                                        <span className="panel-value">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="panel-row">
                                        <span className="panel-label">Wishlist Items</span>
                                        <span className="panel-value highlight-rose"><Heart size={12} /> {selectedCustomer.wishlist?.length || 0} Saved</span>
                                    </div>
                                    <div className="panel-row">
                                        <span className="panel-label">Current Cart</span>
                                        <span className="panel-value"><ShoppingBag size={12} /> {selectedCustomer.cart?.length || 0} Pending</span>
                                    </div>
                                    <div className="panel-row">
                                        <span className="panel-label">Order Success Rate</span>
                                        <span className="panel-value text-emerald">
                                            {selectedCustomer.stats?.totalOrders > 0
                                                ? `${(((selectedCustomer.stats.totalOrders - selectedCustomer.stats.cancelledOrders) / selectedCustomer.stats.totalOrders) * 100).toFixed(1)}%`
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="cust-detail-panel">
                                    <div className="panel-header">
                                        <MapPin size={14} /> <h4>Saved Addresses ({selectedCustomer.addresses?.length || 0})</h4>
                                    </div>
                                    <div className="cust-address-scroll">
                                        {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                                            selectedCustomer.addresses.map((addr, idx) => (
                                                <div key={idx} className="cust-address-item">
                                                    <div className="addr-top">
                                                        <strong>{addr.name}</strong>
                                                        <span className="addr-tag">{addr.type || 'HOME'}</span>
                                                    </div>
                                                    <p>{addr.addressLine}, {addr.city}</p>
                                                    <p>{addr.state} - {addr.pin}</p>
                                                    <p className="addr-phone"><Phone size={10} /> {addr.phone}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-address">No addresses saved by this customer.</div>
                                        )}
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

export default Customers;