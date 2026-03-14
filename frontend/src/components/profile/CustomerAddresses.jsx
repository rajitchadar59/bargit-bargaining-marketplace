import React, { useState } from 'react';
import { Trash2, Plus, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import server from '../../environment';
import '../../pages/CustomerProfile.css'; 
import { customAlert } from '../../utils/toastAlert';


const CustomerAddresses = ({ addresses, refreshProfile, token }) => {
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home'
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async () => {
        if (!formData.name || !formData.city || !formData.addressLine) {
            return customAlert("Please fill all required fields");
        }
        setLoading(true);
        try {
            const res = await axios.post(`${server}/customer/profile/address`, 
                { ...formData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                customAlert("Address added successfully!");
                setShowAdd(false);
                setFormData({ name: '', phone: '', city: '', state: '', pin: '', addressLine: '', type: 'Home' }); 
                refreshProfile();
            }
        } catch (error) {
            console.error("Add address error:", error);
            customAlert("Failed to add address. Ensure city/state are valid for the map.");
        } finally {
            setLoading(false);
        }
    };

   
    const handleMakeDefault = async (addressId) => {
        try {
            const res = await axios.put(`${server}/customer/profile/address/${addressId}/default`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                refreshProfile(); 
            }
        } catch (error) {
            customAlert("Failed to update default address.");
        }
    };

    const handleDelete = async (addressId) => {
        if(!window.confirm("Are you sure you want to delete this address?")) return;
        
        try {
            const res = await axios.delete(`${server}/customer/profile/address/${addressId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                refreshProfile();
            }
        } catch (error) {
            customAlert("Failed to delete address.");
        }
    };

    return (
        <div className="fade-in">
            <div className="cp-flex-between cp-mb-20">
                <h3 className="cp-section-title m-0">Saved Addresses</h3>
                {!showAdd && (
                    <button className="cp-btn-primary flex-align" onClick={() => setShowAdd(true)}>
                        <Plus size={14}/> Add New
                    </button>
                )}
            </div>

            {showAdd && (
                <div className="cp-card cp-mb-20 cp-active-border">
                    <h4 className="cp-card-title">Add New Address</h4>
                    <div className="cp-grid-2 cp-mt-20">
                        <div className="cp-input-group">
                            <label>Receiver's Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" />
                        </div>
                        <div className="cp-input-group">
                            <label>Mobile Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit Number" />
                        </div>
                        <div className="cp-input-group">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Delhi" />
                        </div>
                        <div className="cp-input-group">
                            <label>State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="e.g. DL" />
                        </div>
                        <div className="cp-input-group">
                            <label>Pincode</label>
                            <input type="text" name="pin" value={formData.pin} onChange={handleInputChange} placeholder="6-digit Pincode" />
                        </div>
                        <div className="cp-input-group">
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleInputChange} style={{padding:'12px', borderRadius:'8px', border:'1px solid #cbd5e1'}}>
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="cp-input-group mb-0" style={{marginTop:'10px'}}>
                        <label>Complete Address (House No, Building, Street)</label>
                        <textarea rows="3" name="addressLine" value={formData.addressLine} onChange={handleInputChange} placeholder="Enter full address here..."></textarea>
                    </div>
                    <div className="cp-action-row cp-mt-20 border-top-pt">
                        <button className="cp-btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="cp-btn-primary" onClick={handleAddAddress} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Address'}
                        </button>
                    </div>
                </div>
            )}

            <div className="cp-grid-2">
                {addresses && addresses.length > 0 ? (
                    addresses.map(add => (
                        <div key={add._id} className={`cp-card cp-address-box ${add.isDefault ? 'cp-active-border' : ''}`}>
                            {add.isDefault && <span className="cp-default-badge">Default</span>}
                            <div className="cp-address-type">{add.type}</div>
                            <h4 className="cp-address-name">{add.name} <span className="cp-text-gray">({add.phone})</span></h4>
                            <p className="cp-address-text">
                                {add.addressLine}<br/>{add.city}, {add.state} - <strong>{add.pin}</strong>
                            </p>
                            
                            <div className="cp-address-actions">
                                {!add.isDefault && (
                                    <button className="cp-btn-text flex-align" onClick={() => handleMakeDefault(add._id)} style={{color: '#16a34a'}}>
                                        <CheckCircle2 size={14}/> Set as Default
                                    </button>
                                )}
                                <button className="cp-btn-text text-red flex-align" onClick={() => handleDelete(add._id)} style={{marginLeft: add.isDefault ? '0' : 'auto'}}>
                                    <Trash2 size={14}/> Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="cp-text-gray" style={{ gridColumn: '1 / -1', padding: '20px 0' }}>
                        No saved addresses found. Please add a new address.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerAddresses;