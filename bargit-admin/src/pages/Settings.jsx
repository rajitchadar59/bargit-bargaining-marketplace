import React, { useState, useEffect } from 'react';
import axios from '../axiosPatch'; 
import server from '../environment';
import AdminNavbar from '../components/AdminNavbar';
import { Save, Globe, Mail, Phone, IndianRupee, ShieldAlert, Loader2, Power } from 'lucide-react';
import './Settings.css';
import { customAlert } from '../utils/toastAlert';


const Settings = () => {
    const [settings, setSettings] = useState({
        platformName: '',
        supportEmail: '',
        supportPhone: '',
        minPayoutThreshold: 500,
        maintenanceMode: false
    });
    
    const [loading, setLoading] = useState(true); 
    const [saving, setSaving] = useState(false);   

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${server}/admin/settings`);
            if (res.data.success && res.data.data) {
                setSettings(res.data.data);
            }
        } catch (error) {
            console.error("Failed to load settings. API issue.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await axios.post(`${server}/admin/settings`, settings);
            if (res.data.success) {
                customAlert("Platform settings updated successfully! 🚀");
            }
        } catch (error) {
            customAlert("Failed to save settings. Check backend connection.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page-layout">
                <AdminNavbar />
                <div className="loading-state" style={{padding: '100px', textAlign: 'center'}}>
                    <Loader2 size={40} className="spinner" color="#8b5cf6" style={{margin: '0 auto'}}/>
                    <p style={{marginTop: '10px', color: '#64748b'}}>Loading Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-layout">
            <AdminNavbar />
            
            <div className="admin-content-container">
                <div className="set-header">
                    <div>
                        <h3>Platform Settings</h3>
                        <p>Manage global configurations, contact details, and system status.</p>
                    </div>
                    <button className="btn-save-top" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="set-grid">
                    
                    <div className="set-card">
                        <div className="set-card-header">
                            <Globe size={20} color="#8b5cf6" />
                            <h3>General Information</h3>
                        </div>
                        <div className="set-card-body">
                            <div className="form-group">
                                <label>Platform Name</label>
                                <input 
                                    type="text" 
                                    name="platformName" 
                                    value={settings.platformName} 
                                    onChange={handleInputChange} 
                                    placeholder="e.g. Bargit"
                                />
                                <span className="help-text">Visible on customer emails and invoices.</span>
                            </div>
                            
                            <div className="form-group-row">
                                <div className="form-group w-50">
                                    <label><Mail size={14} style={{display:'inline'}}/> Support Email</label>
                                    <input 
                                        type="email" 
                                        name="supportEmail" 
                                        value={settings.supportEmail} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div className="form-group w-50">
                                    <label><Phone size={14} style={{display:'inline'}}/> Support Phone</label>
                                    <input 
                                        type="text" 
                                        name="supportPhone" 
                                        value={settings.supportPhone} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="set-card">
                        <div className="set-card-header">
                            <IndianRupee size={20} color="#10b981" />
                            <h3>Financial & Payouts</h3>
                        </div>
                        <div className="set-card-body">
                            <div className="form-group">
                                <label>Minimum Payout Threshold (₹)</label>
                                <input 
                                    type="number" 
                                    name="minPayoutThreshold" 
                                    value={settings.minPayoutThreshold} 
                                    onChange={handleInputChange} 
                                />
                                <span className="help-text">Vendors cannot request withdrawal if their wallet balance is below this amount.</span>
                            </div>
                        </div>
                    </div>

                    <div className="set-card border-danger">
                        <div className="set-card-header text-danger">
                            <ShieldAlert size={20} color="#ef4444" />
                            <h3 style={{color: '#ef4444', margin: 0}}>System & Danger Zone</h3>
                        </div>
                        <div className="set-card-body">
                            
                            <div className="maintenance-box">
                                <div className="m-info">
                                    <h4><Power size={18}/> Maintenance Mode</h4>
                                    <p>Turn this on to temporarily disable the platform for updates or critical bug fixes. Customers and vendors will see a "We'll be right back" message.</p>
                                </div>
                                <div className="m-toggle">
                                    <label className="toggle-switch">
                                        <input 
                                            type="checkbox" 
                                            name="maintenanceMode" 
                                            checked={settings.maintenanceMode} 
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {settings.maintenanceMode && (
                                <div className="alert-warning">
                                    ⚠️ WARNING: Your platform is currently offline for users!
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;