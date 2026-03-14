import React, { useState, useEffect } from 'react';
import { Edit3, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import '../../pages/vendor/VendorAccount.css';
import server from '../../environment';

const VendorStorefront = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [vendorData, setVendorData] = useState({
        companyName: '',
        businessType: 'Retailer',
        category: '',
        description: ''
    });

    useEffect(() => {
        const fetchStorefront = async () => {
            try {
                const response = await axios.get(`${server}/vendors/profile/storefront`);
                if (response.data.success && response.data.data) {
                    const dbData = response.data.data;
                    setVendorData({
                        companyName: dbData.companyName || '',
                        businessType: dbData.businessType || 'Retailer',
                        category: dbData.category || '',
                        description: dbData.description || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch storefront info:", error);
                setMessage({ text: 'Could not load storefront details.', type: 'error' });
            } finally {
                setIsFetching(false);
            }
        };
        fetchStorefront();
    }, []);

    const handleInputChange = (e) => {
        setVendorData({ ...vendorData, [e.target.name]: e.target.value });
    };

    const handleUpdateStorefront = async () => {
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.put(`${server}/vendors/profile/storefront`, vendorData);

            if (response.data.success) {
                setMessage({ text: 'Storefront details updated successfully!', type: 'success' });
                setIsEditing(false);
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update details.', type: 'error' });
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
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#15803d' : '#ef4444',
                    fontSize: '0.9rem', fontWeight: '600'
                }}>
                    {message.text}
                </div>
            )}

            <div className="vac-card">
                <div className="vac-card-header-flex">
                    <div>
                        <h3 className="vac-card-title">Shop Details</h3>
                        <p className="vac-card-subtitle">Public information visible on your storefront.</p>
                    </div>
                    {!isEditing && (
                        <button className="vac-btn-ghost flex-align" onClick={() => { setIsEditing(true); setMessage({text: '', type: ''}); }}>
                            <Edit3 size={14}/> Edit Shop
                        </button>
                    )}
                </div>

                {!isEditing ? (
                    <div className="vac-read-grid mt-20">
                        <div className="vac-read-item">
                            <label>Shop/Company Name</label>
                            <p>{vendorData.companyName || <span className="text-gray">Not Set</span>}</p>
                        </div>
                        <div className="vac-read-item">
                            <label>Primary Category</label>
                            <p>{vendorData.category || <span className="text-gray">Not Set</span>}</p>
                        </div>
                        <div className="vac-read-item">
                            <label>Business Type</label>
                            <p>{vendorData.businessType || <span className="text-gray">Not Set</span>}</p>
                        </div>
                        <div className="vac-read-item" style={{gridColumn: '1 / -1'}}>
                            <label>Shop Description</label>
                            <p style={{lineHeight: '1.5'}}>{vendorData.description || <span className="text-gray">No description added yet.</span>}</p>
                        </div>
                    </div>
                ) : (
                    <div className="vac-edit-form mt-20">
                        <div className="vac-row-inputs">
                            <div className="vac-input-group flex-1">
                                <label>Shop/Company Name *</label>
                                <input type="text" name="companyName" value={vendorData.companyName} onChange={handleInputChange} disabled={isLoading} />
                            </div>
                            <div className="vac-input-group flex-1">
                                <label>Primary Category *</label>
                                <input type="text" name="category" value={vendorData.category} onChange={handleInputChange} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="vac-input-group">
                            <label>Business Type *</label>
                            <select name="businessType" value={vendorData.businessType} onChange={handleInputChange} disabled={isLoading}>
                                <option value="Retailer">Retailer (Direct to Consumer)</option>
                                <option value="Wholesaler">Wholesaler (B2B)</option>
                                <option value="Manufacturer">Manufacturer</option>
                                <option value="Home Business">Home Business / Cloud Store</option>
                            </select>
                        </div>
                        <div className="vac-input-group mb-0">
                            <label>Shop Description (Max 500 characters)</label>
                            <textarea name="description" rows="3" value={vendorData.description} onChange={handleInputChange} disabled={isLoading}></textarea>
                        </div>
                        <div className="vac-action-row mt-20 border-top-pt">
                            <button className="vac-btn-outline" onClick={() => { setIsEditing(false); setMessage({text: '', type: ''}); }} disabled={isLoading}>Cancel</button>
                            <button className="vac-btn-primary flex-align" onClick={handleUpdateStorefront} disabled={isLoading || !vendorData.companyName || !vendorData.category}>
                                {isLoading ? <><Loader2 size={16} className="spinner"/> Saving...</> : 'Save Shop Details'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="vac-card">
                <h3 className="vac-card-title">Shop Banners & Logo</h3>
                <p className="vac-card-subtitle mb-20">Update your branding visuals.</p>
                <div className="vac-row-inputs">
                    <div className="vac-upload-box flex-1">
                        <div className="vac-logo-circle"><UploadCloud size={20} className="text-gray"/></div>
                        <div>
                            <p className="vac-up-title">Upload Logo</p>
                            <p className="vac-up-sub">PNG/JPG (Max 2MB)</p>
                        </div>
                    </div>
                    <div className="vac-upload-box flex-1" style={{flexDirection: 'column', textAlign: 'center'}}>
                        <ImageIcon size={24} className="text-gray mb-2"/>
                        <p className="vac-up-title">Upload Store Banner</p>
                        <p className="vac-up-sub">1200x300px ideal size</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorStorefront;