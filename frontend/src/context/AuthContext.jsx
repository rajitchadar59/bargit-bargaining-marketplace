import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import server from '../environment'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [loading, setLoading] = useState(true);

    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    
    const login = (data) => {
        setToken(data.token);
        setRole(data.role);
        setUser(data); 
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        
        if(data.companyName) localStorage.setItem('companyName', data.companyName);
        if(data.username) localStorage.setItem('username', data.username);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    };


    const logout = () => {
        setToken(null);
        setRole(null);
        setUser(null);
        
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('companyName');
        localStorage.removeItem('username');
        
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/';
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${server}/verify`); 
                    setUser(res.data.user); 
                    setRole(res.data.role);
                } catch (err) {
                    console.error("Token verification failed. Logging out.", err);
                    logout();
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
        <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);