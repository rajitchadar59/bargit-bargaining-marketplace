import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import axios from 'axios';
import server from '../../environment';
import '../../pages/CustomerProfile.css'; 
import { customAlert } from '../../utils/toastAlert';


const CustomerPersonalInfo = ({ customer, refreshProfile, token }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const [username, setUsername] = useState(customer?.username || '');
    const [phone, setPhone] = useState(customer?.phone || '');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!username.trim()) return customAlert("Name cannot be empty");
        setLoading(true);
        try {
            const res = await axios.put(`${server}/customer/profile/update`, 
                { username, phone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                customAlert("Profile Updated Successfully!");
                setIsEditing(false);
                refreshProfile(); 
            }
        } catch (error) {
            console.error("Update error:", error);
            customAlert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cp-card fade-in">
            <div className="cp-card-header-flex">
                <h4 className="cp-card-title m-0">Personal Information</h4>
                {!isEditing && (
                    <button className="cp-btn-ghost flex-align" onClick={() => setIsEditing(true)}>
                        <Edit3 size={12}/> Edit
                    </button>
                )}
            </div>
            
            {!isEditing ? (
                <div className="cp-read-grid cp-mt-20">
                    <div className="cp-read-item">
                        <label>Full Name</label>
                        <p>{customer?.username}</p>
                    </div>
                    <div className="cp-read-item">
                        <label>Phone Number</label>
                        <p>{customer?.phone || 'Not provided'}</p>
                    </div>
                    <div className="cp-read-item" style={{gridColumn: '1 / -1'}}>
                        <label>Email Address</label>
                        <p>{customer?.email}</p>
                    </div>
                </div>
            ) : (
                <div className="cp-mt-20">
                    <div className="cp-input-group">
                        <label>Full Name</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="cp-input-group">
                        <label>Phone Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="cp-input-group mb-0">
                        <label>Email (Cannot be changed)</label>
                        <input type="email" value={customer?.email} disabled className="cp-disabled" />
                    </div>
                    <div className="cp-action-row cp-mt-20 border-top-pt">
                        <button className="cp-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="cp-btn-primary" onClick={handleUpdateProfile} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerPersonalInfo;