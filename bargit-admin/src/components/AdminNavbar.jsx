import React from 'react';
import { 
    LogOut, LayoutDashboard, Users, Box, Settings, Store, ShoppingCart,CreditCard
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { admin, logout } = useAdminAuth();

    const activeTab = location.pathname.includes('vendors') ? 'Vendors' : 
                      location.pathname.includes('customers') ? 'Customers' : 
                      location.pathname.includes('catalog') ? 'Catalog' : 
                      location.pathname.includes('settings') ? 'Settings' : 
                      location.pathname.includes('plans') ? 'Plans' : 'Dashboard';

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Vendors', path: '/vendors', icon: Store },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Catalog', path: '/catalog', icon: Box },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Plans', path: '/plans', icon: CreditCard },
    ];

    return (
        <nav className="admin-navbar">
            
            <div className="admin-brand" onClick={() => navigate('/dashboard')}>
                <h2>Bargit <span>Admin</span></h2>
            </div>
            
            <div className="admin-nav-links">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link 
                            key={link.name} 
                            to={link.path} 
                            className={`nav-item ${activeTab === link.name ? 'active' : ''}`}
                        >
                            <Icon size={15} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="admin-actions">
                <div className="admin-profile">
                    <span className="admin-name">{admin?.name || 'Admin'}</span>
                    <span className="admin-badge">{admin?.role || 'SYSTEM'}</span>
                </div>
                
                <div className="divider"></div>

                <button onClick={logout} className="logout-btn" title="Logout safely">
                  
                    <LogOut size={14} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;