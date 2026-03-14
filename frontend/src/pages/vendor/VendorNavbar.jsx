import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorNavbar.css';

const VendorNavbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="v-nav">
            <div className="v-nav-container">
                <div className="v-logo-section" onClick={() => navigate("/")}>
                    <div className="logo">BARGIT<span>.</span></div>
                    <span className="v-logo-badge">Business</span>
                </div>

                <div className="v-nav-actions">
                    <span className="v-help-link" onClick={() => navigate("http://localhost:5173/#query")}>
                        Need help?
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default VendorNavbar;