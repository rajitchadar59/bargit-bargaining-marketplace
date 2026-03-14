import React, { useState } from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import server from '../environment'; 
import { Loader2 } from 'lucide-react'; 
import { customAlert } from '../utils/toastAlert';

const Home = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userRole: 'buyer',
        name: '',
        email: '',
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await axios.post(`${server}/help/contact`, {
                role: formData.userRole,
                name: formData.name,
                email: formData.email,
                message: formData.message
            });

            if (res.data.success) {
                customAlert(res.data.message); 
                setFormData({ userRole: 'buyer', name: '', email: '', message: '' });
            }
        } catch (error) {
            console.error(error);
            customAlert(error.response?.data?.message || "Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="home-page">
                <section className="hero-section">
                    <div className="container">
                        <h1 className="hero-title">
                            The Price Tag Is <br />
                            Just A <span className="pink-text">Suggestion.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Experience India’s most exclusive bargaining floor. We bring you direct
                            access to premium inventory with the freedom to define your own deal.
                        </p>

                        <div className="hero-btns">
                            <button className="btn-main" onClick={() => { navigate('/vendor/auth') }}>
                                Sell With Us
                            </button>
                            <button className="btn-ghost" onClick={() => { navigate('/dashboard') }}>
                                Explore Collections
                            </button>
                        </div>
                    </div>
                </section>

                <section className="stats-section container">
                    <div className="stat-item">
                        <h2>98%</h2>
                        <p>Success Rate</p>
                    </div>
                    <div className="stat-item">
                        <h2>Premium</h2>
                        <p>Inventory Only</p>
                    </div>
                    <div className="stat-item">
                        <h2>Verified</h2>
                        <p>Authenticity</p>
                    </div>
                </section>

                <section className="info-section">
                    <div className="info-content">
                        <span className="section-tag">THE REVOLUTION</span>
                        <h2>Retail, But On Your <span className="pink-text">Terms.</span></h2>
                        <p>
                            Traditional e-commerce is a monologue—they set the price, you pay.
                            We’ve turned it into a dialogue. At Bargit, we believe luxury should
                            be accessible to those who know the value of a good deal.
                        </p>
                        <div className="mini-feature">
                            <h4>Direct Brand Access</h4>
                            <p>No middlemen. We source directly from premium labels to ensure you get authentic goods at the lowest possible ceiling.</p>
                        </div>
                    </div>

                    <div className="info-content right-side">
                        <span className="section-tag">YOUR PRIVILEGE</span>
                        <h2>Why Members <span className="pink-text">Choose Us.</span></h2>
                        <div className="benefits-container">
                            <div className="benefit-line"></div>
                            <div className="benefit-item">
                                <div className="benefit-dot"></div>
                                <div>
                                    <h4>Personalized Pricing</h4>
                                    <p>Every deal is unique. Your history and engagement define your discount.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-dot"></div>
                                <div>
                                    <h4>Curated Selection</h4>
                                    <p>We don't sell everything. Only handpicked, high-end electronics and gear.</p>
                                </div>
                            </div>
                            <div className="benefit-item">
                                <div className="benefit-dot"></div>
                                <div>
                                    <h4>Private Offers</h4>
                                    <p>Negotiated prices are exclusive to you and kept confidential.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="query-section-merged" id="query">
                    <div className="container">
                        <div className="query-split-card">

                            <div className="query-left-box">
                                <span className="section-tag">CONNECT</span>
                                <h2 className="hero-title" style={{ textAlign: 'left', fontSize: '2.8rem', marginBottom: '20px' }}>
                                    Still have <br /> <span className="pink-text">Doubts?</span>
                                </h2>
                                <p className="hero-subtitle" style={{ margin: '0', textAlign: 'left', fontSize: '1rem' }}>
                                    Our concierge team is here to guide you. Select your role and send us a message.
                                </p>
                            </div>

                            <div className="query-right-form">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="role-selection-clean">
                                        <label className="clean-radio">
                                            <input 
                                                type="radio" 
                                                name="userRole" 
                                                value="buyer" 
                                                checked={formData.userRole === 'buyer'}
                                                onChange={handleInputChange} 
                                            />
                                            <span className="radio-label-text">I am a Buyer</span>
                                        </label>
                                        <label className="clean-radio">
                                            <input 
                                                type="radio" 
                                                name="userRole" 
                                                value="seller" 
                                                checked={formData.userRole === 'seller'}
                                                onChange={handleInputChange} 
                                            />
                                            <span className="radio-label-text">I am a Seller</span>
                                        </label>
                                    </div>

                                    <div className="input-group-refined">
                                        <input 
                                            type="text" 
                                            name="name"
                                            placeholder="Full Name" 
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        <input 
                                            type="email" 
                                            name="email"
                                            placeholder="Email Address" 
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        <textarea 
                                            name="message"
                                            placeholder="How can we help?" 
                                            rows="3" 
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn-main full-width-btn" 
                                        disabled={isSubmitting}
                                        style={{ display: 'flex', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
                                    >
                                        {isSubmitting && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>

            </div>
        </>
    );
};

export default Home;