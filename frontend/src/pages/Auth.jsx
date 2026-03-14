import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import Navbar from '../components/Navbar';
import server from '../environment';
import { useAuth } from '../context/AuthContext';
import { customAlert } from '../utils/toastAlert';


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '', email: '', password: ''
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, role, loading } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard'; 

  useEffect(() => {
    if (!loading && user) {
      if (role === 'customer') {
        navigate(from, { replace: true }); 
      }
    }
  }, [user, loading, role, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/customer/auth/login' : '/customer/auth/register';

    try {
      const res = await axios.post(`${server}${endpoint}`, formData);

      login({
        token: res.data.token,
        role: 'customer',
        username: res.data.user?.username || res.data.username,
        userId: res.data.user?._id || res.data._id
      });

      customAlert(isLogin ? "Welcome Back!" : "Account Created Successfully!");
      navigate(from, { replace: true }); 

    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.msg || "Authentication failed"
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2>{isLogin ? 'Welcome User' : 'Create Account'}</h2>
          <p>{isLogin ? 'Enter your details to start bargaining.' : 'Join the elite club of smart shoppers.'}</p>

          {error && <div className="error-alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label className="auth-label">Username</label>
                <input type="text" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} required />
              </div>
            )}

            <div className="input-group">
              <label className="auth-label">Email Address</label>
              <input type="email" name="email" placeholder="e.g. name@company.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="auth-label">Password</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-submit">
              {isLogin ? 'Sign In' : 'Get Started'}
            </button>
          </form>

          <p className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;