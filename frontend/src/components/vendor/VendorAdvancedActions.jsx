import React, { useState } from 'react';
import { LogOut, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../pages/vendor/VendorAccount.css';
import server from '../../environment';
import { customAlert } from '../../utils/toastAlert';


const VendorAdvancedActions = () => {
    const navigate = useNavigate();
    
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.clear();
            window.location.href = '/vendor/auth'; 
        }
    };

    const handleDeleteAccount = async () => {
        if (!showPasswordInput) {
            setShowPasswordInput(true);
            return;
        }

        if (!password) {
            setMessage({ text: 'Please enter your password to confirm deletion.', type: 'error' });
            return;
        }

        if (!window.confirm("FINAL WARNING: This will permanently delete your shop and all related data. This cannot be undone. Proceed?")) {
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.delete(`${server}/vendors/profile/account`, {
                data: { password }
            });

            if (response.data.success) {
                customAlert("Your account has been permanently deleted.");
                localStorage.clear();
                window.location.href = '/vendor/auth'; 
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to delete account.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

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
                <h3 className="vac-card-title text-red" style={{color: '#ef4444'}}>Advanced Actions</h3>
                <p className="vac-helper-text mb-30">Manage your session and account lifecycle.</p>
                
                <div className="vac-danger-action" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <p className="vac-helper-text m-0">End your current session on this device.</p>
                    </div>
                    <button className="vac-btn-outline flex-align" style={{gap: '6px'}} onClick={handleLogout}>
                        <LogOut size={16}/> Logout
                    </button>
                </div>

                <div className="vac-divider"></div>

                <div className="vac-danger-action" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px'}}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h4 className="m-0 text-red" style={{color: '#ef4444'}}>Deactivate or Delete Shop</h4>
                        <p className="vac-helper-text " style={{marginTop:"0.5rem"}}>Permanently remove your shop and inventory. This action is irreversible.</p>
                        
                       
                        {showPasswordInput && (
                            <div className="vac-input-group mt-20 fade-in mb-0">
                                <label style={{ color: '#ef4444' }}>Enter Password to Confirm</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter your current password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    
                                />
                                <button 
                                    className="vac-btn-ghost mt-10" 
                                    style={{ padding: '0' ,marginTop:"0.5rem" ,height:'2rem' , width:"6rem" , textAlign:"center"}} 
                                    onClick={() => { setShowPasswordInput(false); setPassword(''); setMessage({text:'', type:''}); }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <button 
                        className="vac-btn-danger flex-align mt-10" 
                        style={{gap: '6px'}}
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={16} className="spinner"/> : <AlertTriangle size={16}/>}
                        {showPasswordInput ? 'Confirm Delete' : 'Delete Shop'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorAdvancedActions;