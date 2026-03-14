import React, { useState } from 'react';
import axios from 'axios';
import server from '../environment';
import { useNavigate, Navigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { Loader2, LockKeyhole } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminLogin.css';
import { customAlert } from '../utils/toastAlert';


const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login, token } = useAdminAuth();

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post(`${server}/admin/login`, { email, password });
            if (res.data.success) {
                login({
                    token: res.data.token,
                    role: res.data.data.role,
                    user: res.data.data
                });
                navigate('/dashboard'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Email or Password!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <PublicNavbar />
            
            <div className="split-layout">
                <div className="branding-side">
                    <h1 className="branding-title">
                        Manage the <br/>
                        <span className="highlight-text">Bargit Ecosystem.</span>
                    </h1>
                    <p className="branding-desc">
                        Welcome to the central control node. Monitor global inventory, manage vendor subscriptions, and track AI bargaining metrics in real-time.
                    </p>
                </div>

                <div className="form-side">
                    <div className="login-card">
                        <div className="icon-wrapper">
                            <div className="icon-circle">
                                <LockKeyhole size={32} color="#FF2E63" />
                            </div>
                        </div>
                        
                        <h2 className="form-title">Admin Authentication</h2>
                        <p className="form-subtitle">Please verify your identity to continue</p>
                        
                        {error && (
                            <div className="error-alert">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label className="input-label">Admin Email</label>
                                <input 
                                    type="email" 
                                    className="form-input"
                                    required 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="admin@bargit.com" 
                                />
                            </div>
                            <div className="input-group" style={{ marginBottom: '30px' }}>
                                <label className="input-label">Master Password</label>
                                <input 
                                    type="password" 
                                    className="form-input"
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? <Loader2 className="spinner" size={20} /> : 'Authorize Access'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;