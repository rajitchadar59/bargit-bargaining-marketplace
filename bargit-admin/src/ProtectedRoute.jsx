import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext'; 

const ProtectedRoute = ({ children, allowedRoles, redirectPath = "/" }) => {
    const { token, role, loading } = useAdminAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #FF2E63', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: '#64748b', fontWeight: '500' }}>Verifying Admin Access...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!token) {
        return <Navigate to={redirectPath} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        console.warn(`Access Denied: User role is '${role}', required: ${allowedRoles}`);
        
        if (location.pathname !== '/dashboard') {
            return <Navigate to="/dashboard" replace />; 
        } else {
            return (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444', fontWeight: 'bold', fontSize: '20px' }}>
                    ⛔ Unauthorized Access
                </div>
            );
        }
    }
 
    return children;
};

export default ProtectedRoute;