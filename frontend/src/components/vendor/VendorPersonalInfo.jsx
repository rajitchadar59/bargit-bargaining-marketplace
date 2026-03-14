import React, { useState, useEffect } from 'react';
import { KeyRound, Edit3, Loader2 } from 'lucide-react';
import axios from 'axios';
import '../../pages/vendor/VendorAccount.css';
import server from '../../environment';

const VendorPersonalInfo = () => {
    const [isEditing, setIsEditing] = useState({ personal: false, password: false });
    const toggleEdit = (section) => setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' }); 

    const [vendorData, setVendorData] = useState({
        ownerName: '',
        email: '',
        phoneNumber: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await axios.get(`${server}/vendors/profile/personal`);
                if (response.data.success && response.data.data) {
                    setVendorData({
                        ownerName: response.data.data.ownerName || '',
                        email: response.data.data.email || '',
                        phoneNumber: response.data.data.phoneNumber || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch info:", error);
                setMessage({ text: 'Could not load personal details.', type: 'error' });
            } finally {
                setIsFetching(false);
            }
        };
        fetchPersonalInfo();
    }, []);

    const handleInfoChange = (e) => setVendorData({ ...vendorData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleUpdatePersonal = async () => {
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await axios.put(`${server}/vendors/profile/personal`, {
                ownerName: vendorData.ownerName,
                phoneNumber: vendorData.phoneNumber
            });

            if (response.data.success) {
                setMessage({ text: 'Personal info updated!', type: 'success' });
                setIsEditing(prev => ({ ...prev, personal: false }));
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update info.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    
    const handleUpdatePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ text: 'New passwords do not match!', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const response = await axios.put(`${server}/vendors/profile/password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (response.data.success) {
                setMessage({ text: 'Password updated successfully!', type: 'success' });
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear fields
                setIsEditing(prev => ({ ...prev, password: false }));
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update password.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="vac-tab-content fade-in">
                <div className="vac-card flex-align justify-center" style={{ padding: '40px' }}>
                    <Loader2 className="spinner text-pink" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="vac-tab-content fade-in">
           
            {message.text && (
                <div style={{
                    padding: '10px 15px', borderRadius: '8px', marginBottom: '20px',
                    color: message.type === 'success' ? '#15803d' : '#ef4444',
                    fontSize: '0.9rem', fontWeight: '600'
                }}>
                    {message.text}
                </div>
            )}

            
            <div className="vac-card">
                <div className="vac-card-header-flex">
                    <div>
                        <h3 className="vac-card-title">Personal Information</h3>
                        <p className="vac-card-subtitle">Details provided during account creation.</p>
                    </div>
                    {!isEditing.personal && (
                        <button className="vac-btn-ghost flex-align" onClick={() => toggleEdit('personal')}>
                            <Edit3 size={14}/> Edit Details
                        </button>
                    )}
                </div>
                
                {!isEditing.personal ? (
                    <div className="vac-read-grid mt-20">
                        <div className="vac-read-item">
                            <label>Full Name</label>
                            <p>{vendorData.ownerName}</p>
                        </div>
                        <div className="vac-read-item">
                            <label>Phone Number</label>
                            <p>{vendorData.phoneNumber}</p>
                        </div>
                        <div className="vac-read-item">
                            <label>Registered Email</label>
                            <p>{vendorData.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="vac-edit-form mt-20">
                        <div className="vac-row-inputs">
                            <div className="vac-input-group flex-1">
                                <label>Full Name</label>
                                <input type="text" name="ownerName" value={vendorData.ownerName} onChange={handleInfoChange} disabled={isLoading} />
                            </div>
                            <div className="vac-input-group flex-1">
                                <label>Phone Number</label>
                                <input type="text" name="phoneNumber" value={vendorData.phoneNumber} onChange={handleInfoChange} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="vac-input-group mb-0">
                            <label>Registered Email (Non-editable)</label>
                            <input type="email" value={vendorData.email} disabled className="vac-disabled" />
                        </div>
                        <div className="vac-action-row mt-20 border-top-pt">
                            <button className="vac-btn-outline" onClick={() => toggleEdit('personal')} disabled={isLoading}>Cancel</button>
                            <button className="vac-btn-primary flex-align" onClick={handleUpdatePersonal} disabled={isLoading || !vendorData.ownerName || !vendorData.phoneNumber}>
                                {isLoading ? <><Loader2 size={16} className="spinner"/> Saving...</> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="vac-card">
                <div className="vac-card-header-flex">
                    <div className="flex-align" style={{gap: '10px', marginBottom: '5px'}}>
                        <KeyRound size={18} className="text-gray"/>
                        <div>
                            <h3 className="vac-card-title m-0">Security</h3>
                            <p className="vac-card-subtitle">Update your account password.</p>
                        </div>
                    </div>
                    {!isEditing.password && (
                        <button className="vac-btn-ghost flex-align" onClick={() => { toggleEdit('password'); setMessage({text:'', type:''}); }}>
                            <Edit3 size={14}/> Change Password
                        </button>
                    )}
                </div>

                {isEditing.password && (
                    <div className="vac-edit-form mt-20 border-top-pt">
                        <div className="vac-input-group">
                            <label>Current Password</label>
                            <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" disabled={isLoading}/>
                        </div>
                        <div className="vac-row-inputs">
                            <div className="vac-input-group flex-1 mb-0">
                                <label>New Password</label>
                                <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="Min. 6 characters" disabled={isLoading}/>
                            </div>
                            <div className="vac-input-group flex-1 mb-0">
                                <label>Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="Re-type new password" disabled={isLoading}/>
                            </div>
                        </div>
                        <div className="vac-action-row mt-20">
                            <button className="vac-btn-outline" onClick={() => { toggleEdit('password'); setPasswords({currentPassword: '', newPassword: '', confirmPassword: ''}); }} disabled={isLoading}>Cancel</button>
                            <button className="vac-btn-primary flex-align" onClick={handleUpdatePassword} disabled={isLoading || !passwords.currentPassword || !passwords.newPassword}>
                                {isLoading ? <><Loader2 size={16} className="spinner"/> Updating...</> : 'Update Password'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorPersonalInfo;