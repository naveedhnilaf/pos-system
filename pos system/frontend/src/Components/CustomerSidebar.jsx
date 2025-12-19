import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/authContext.jsx';

const CustomerSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // Absolute paths for navigation
    const menuItems = [
        { label: 'Products', path: '/customer-dashboard/products', icon: '📦' },
        { label: 'Orders', path: '/customer-dashboard/orders', icon: '📋' },
        { label: 'Profile', path: '/customer-dashboard/profile', icon: '👤' },
    ];

    return (
        <div className='fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 overflow-y-auto'>
            <h2 className='text-2xl font-bold mb-8 text-center'>POS System</h2>
            
            <nav className='space-y-2 mb-8'>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                                isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'
                            }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={handleLogout}
                className='w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors'
            >
                Logout
            </button>
        </div>
    );
};

export default CustomerSidebar;
