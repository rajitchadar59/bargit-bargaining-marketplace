import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './VendorAuth.css'; 
import VendorNavbar from './VendorNavbar';
import server from '../../environment';
import { useAuth } from '../../context/AuthContext';
import { customAlert } from '../../utils/toastAlert';


const VendorAuth = () => {
  const { login, user, role, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    email: '', password: '', ownerName: '', companyName: '',
    phoneNumber: '', businessType: 'Retailer', category: '', city: ''
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/vendor/dashboard';

  useEffect(() => {
    if (!loading && user) {
      if (role === 'vendor') {
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, role, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && step < 3) {
      setStep(step + 1);
      return;
    }
    
    setError('');
    const endpoint = isLogin ? '/vendors/login' : '/vendors/register';
    
    try {
      const res = await axios.post(`${server}${endpoint}`, formData);
      
      login({
        token: res.data.token,
        role: 'vendor',
        companyName: res.data.companyName,
        userId: res.data._id
      });

      customAlert("Business Account Access Granted!");
      navigate(from, { replace: true }); // ✨
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication Failed. Check your details.');
    }
  };

  return (
    <>
     <VendorNavbar />
      <div className="vendor-auth-page">
        <div className="vendor-auth-card">
          <h2>{isLogin ? 'Vendor Login' : 'Grow Your Business'}</h2>
          <p>
            {isLogin 
              ? 'Manage your products & deals efficiently.' 
              : `Step ${step} of 3: ${step === 1 ? 'Personal Info' : step === 2 ? 'Brand Details' : 'Final Touch'}`}
          </p>
          
          {!isLogin && (
            <div className="vendor-progress-bar">
              <div className="vendor-progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
          )}

          {error && <div className="vendor-error-alert">{error}</div>}

          <form className="vendor-auth-form" onSubmit={handleSubmit}>
            {isLogin ? (
              <div className="vendor-form-step">
                <div className="vendor-input-group">
                  <label>Business Email</label>
                  <input type="email" name="email" placeholder="e.g. shop@email.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="vendor-input-group">
                  <label>Password</label>
                  <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                </div>
              </div>
            ) : (
              <div className="vendor-form-step">
                {step === 1 && (
                  <>
                    <div className="vendor-input-group">
                      <label>Owner Full Name</label>
                      <input type="text" name="ownerName" placeholder="Enter your name" value={formData.ownerName} onChange={handleChange} required />
                    </div>
                    <div className="vendor-input-group">
                      <label>Business Email</label>
                      <input type="email" name="email" placeholder="shop@email.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="vendor-input-group">
                      <label>Set Password</label>
                      <input type="password" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="vendor-input-group">
                      <label>Company/Shop Name</label>
                      <input type="text" name="companyName" placeholder="e.g. Tech World" value={formData.companyName} onChange={handleChange} required />
                    </div>
                    <div className="vendor-input-group">
                      <label>Phone Number</label>
                      <input type="text" name="phoneNumber" placeholder="91XXXXXXXX" value={formData.phoneNumber} onChange={handleChange} required />
                    </div>
                    <div className="vendor-input-group">
                      <label>Business Type</label>
                      <select name="businessType" value={formData.businessType} onChange={handleChange}>
                        <option value="Retailer">Retailer</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="Manufacturer">Manufacturer</option>
                        <option value="Home Business">Home Business</option>
                      </select>
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <div className="vendor-input-group">
                      <label>Category</label>
                      <input type="text" name="category" placeholder="e.g. Electronics" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="vendor-input-group">
                      <label>City</label>
                      <input type="text" name="city" placeholder="Your City" value={formData.city} onChange={handleChange} required />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="vendor-btn-group">
              <button type="submit" className="vendor-auth-btn">
                {isLogin ? 'Sign In' : (step < 3 ? 'Next Step' : 'Launch My Shop')}
              </button>
              
              {!isLogin && step > 1 && (
                <button type="button" className="vendor-auth-btn vendor-back-btn" onClick={() => setStep(step - 1)}>
                  Go Back
                </button>
              )}
            </div>
          </form>

          <p className="vendor-toggle-text">
            {isLogin ? "Want to sell with us? " : "Already a partner? "}
            <span onClick={() => { setIsLogin(!isLogin); setStep(1); setError(''); }}>
              {isLogin ? 'Register Now' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default VendorAuth;