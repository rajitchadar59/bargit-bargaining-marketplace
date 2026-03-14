import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import server from '../environment'; 

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(() => {
        const t = localStorage.getItem('adminToken');
        return (t && t !== 'undefined' && t !== 'null') ? t : null;
    });
    
    const [role, setRole] = useState(() => {
        const r = localStorage.getItem('adminRole');
        return (r && r !== 'undefined' && r !== 'null') ? r : null;
    });

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (responseData) => {
        const authToken = responseData.token;
        const adminRole = responseData.data?.role || responseData.role;
        const adminInfo = responseData.data || responseData.user;

        setToken(authToken);
        setRole(adminRole);
        setAdmin(adminInfo);

        localStorage.setItem('adminToken', authToken);
        localStorage.setItem('adminRole', adminRole);
        
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setAdmin(null);
        
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        
        window.location.href = '/'; 
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${server}/verify`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }); 
                    
                    const adminInfo = res.data.user || res.data.data;
                    const adminRole = res.data.role || adminInfo?.role;

                    setAdmin(adminInfo);
                    setRole(adminRole);
                    
                    if (adminRole) localStorage.setItem('adminRole', adminRole);
                    
                } catch (err) {
                    console.error("Token verification error:", err);
                    if (err.response && err.response.status === 401) {
                        logout(); 
                    }
                } finally {
                    setLoading(false); 
                }
            } else {
                setLoading(false); 
            }
        };
        
        checkAuth();
    }, [token]);

    return (
        <AdminAuthContext.Provider value={{ admin, token, role, login, logout, loading }}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);