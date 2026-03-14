import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import './PublicNavbar.css'; 

const PublicNavbar = () => {
    return (
        <div className="public-navbar">
            
            <div className="navbar-brand">
                <ShieldAlert color="#FF2E63" size={24} />
                <h2 className="logo-text">
                    Bargit <span className="logo-highlight">Workspace</span>
                </h2>
            </div>

            <div className="security-badge">
                <Lock size={12} strokeWidth={2.5} /> 
                RESTRICTED ACCESS
            </div>

        </div>
    );
};

export default PublicNavbar;