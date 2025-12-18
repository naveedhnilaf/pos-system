import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/authContext.jsx'
import { FaHome, FaBox, FaTable, FaTruck, FaShoppingCart, FaCog, FaUsers, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
    const menuItems = [
        { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome />, isParent: true },
        { name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable />, isParent: false },
        { name: "Products", path: "/admin-dashboard/products", icon: <FaBox />, isParent: false },
        { name: "Suppliers", path: "/admin-dashboard/suppliers", icon: <FaTruck />, isParent: false },
        { name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart />, isParent: false },
        { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers />, isParent: false },
        { name: "Profile", path: "/admin-dashboard/profile", icon: <FaCog />, isParent: false },
        { name: "Logout", path: "/logout", icon: <FaSignOutAlt />, isParent: false },
    ]

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className='flex flex-col h-screen bg-black text-white w-16 md:w-64 fixed'>
            {/* Header */}
            <div className='h-16 flex items-center justify-center border-b border-gray-700'>
                <span className='hidden md:block text-xl font-bold'>Inventory MS</span>
                <span className='md:hidden text-xl font-bold'>IMS</span>
            </div>

            {/* Menu Items */}
            <div className='flex-1 overflow-y-auto'>
                <ul className='space-y-2 p-2'>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                                    {item.name === 'Logout' ? (
                                        <button
                                            onClick={handleLogout}
                                            className={`flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200`}
                                        >
                                            <span className='text-xl'>{item.icon}</span>
                                            <span className='ml-4 hidden md:block'>{item.name}</span>
                                        </button>
                                    ) : (
                                        <NavLink 
                                            end={item.isParent}
                                            className={({ isActive }) => 
                                                `flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200 ${
                                                    isActive ? "bg-gray-700" : ""
                                                }`
                                            } 
                                            to={item.path}
                                        >
                                            <span className='text-xl'>{item.icon}</span>
                                            <span className='ml-4 hidden md:block'>{item.name}</span>
                                        </NavLink>
                                    )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
