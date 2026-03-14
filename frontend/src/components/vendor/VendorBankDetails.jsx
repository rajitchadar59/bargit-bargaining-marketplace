import React, { useState, useEffect } from 'react';
import axios from 'axios';
import server from '../../environment';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Save, Loader2, QrCode } from 'lucide-react';
import '../../pages/vendor/VendorAccount.css'; 
import { customAlert } from '../../utils/toastAlert';


const VendorBankDetails = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', upiId: ''
    });

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const res = await axios.get(`${server}/vendors/profile/bank`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success && res.data.data) {
                    setFormData({
                        accountHolderName: res.data.data.accountHolderName || '',
                        accountNumber: res.data.data.accountNumber || '',
                        ifscCode: res.data.data.ifscCode || '',
                        bankName: res.data.data.bankName || '',
                        upiId: res.data.data.upiId || ''
                    });
                }
            } catch (error) { 
                console.error("Failed to load bank details"); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchBankDetails();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put(`${server}/vendors/profile/bank`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) customAlert("Payout Details Saved Successfully! ✅");
        } catch (error) {
            customAlert(error.response?.data?.message || "Failed to save details");
        } finally { setSaving(false); }
    };

    if (loading) {
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
            <div className="vac-card">
                
                <div className="vac-card-header-flex" style={{marginBottom: '25px'}}>
                    <div>
                        <h3 className="vac-card-title flex-align" style={{gap: '8px'}}>
                            <Landmark size={20} className="text-gray" /> Payout & Bank Details
                        </h3>
                        <p className="vac-card-subtitle">Add your Bank Account or UPI ID to receive payments for your sales.</p>
                    </div>
                </div>
                
                <form onSubmit={handleSave}>
                    
                    <div style={{ background: '#fcfcfd', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px dashed #cbd5e1' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 15px 0', color: '#0f172a', fontSize: '1rem' }}>
                            <QrCode size={18} color="#FF2E63"/> Fast Payout (UPI)
                        </h4>
                        <div className="vac-input-group mb-0">
                            <label>UPI ID (Optional)</label>
                            <input 
                                type="text" 
                                name="upiId" 
                                value={formData.upiId} 
                                onChange={handleChange} 
                                placeholder="e.g. yourname@ybl or 9876543210@paytm" 
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <h4 style={{ margin: '0 0 20px 0', color: '#0f172a', borderBottom: '1px solid #edf2f7', paddingBottom: '10px', fontSize: '1.05rem' }}>
                        Bank Account Details
                    </h4>
                    
                    <div className="vac-input-group">
                        <label>Account Holder Name</label>
                        <input 
                            type="text" 
                            name="accountHolderName" 
                            value={formData.accountHolderName} 
                            onChange={handleChange} 
                            placeholder="As per bank records" 
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="vac-input-group">
                        <label>Account Number</label>
                        <input 
                            type="password" 
                            name="accountNumber" 
                            value={formData.accountNumber} 
                            onChange={handleChange} 
                            placeholder="Enter A/C Number" 
                            disabled={saving}
                        />
                    </div>
                    
                    <div className="vac-row-inputs">
                        <div className="vac-input-group flex-1 mb-0">
                            <label>IFSC Code</label>
                            <input 
                                type="text" 
                                name="ifscCode" 
                                value={formData.ifscCode} 
                                onChange={handleChange} 
                                placeholder="e.g. SBIN0001234" 
                                style={{textTransform: 'uppercase'}}
                                disabled={saving}
                            />
                        </div>
                        <div className="vac-input-group flex-1 mb-0">
                            <label>Bank Name</label>
                            <input 
                                type="text" 
                                name="bankName" 
                                value={formData.bankName} 
                                onChange={handleChange} 
                                placeholder="e.g. State Bank of India" 
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="vac-action-row mt-30 border-top-pt">
                        <button type="submit" className="vac-btn-primary flex-align" disabled={saving}>
                            {saving ? <><Loader2 size={16} className="spinner"/> Saving Details...</> : <><Save size={16}/> Save Payout Details</>}
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default VendorBankDetails;