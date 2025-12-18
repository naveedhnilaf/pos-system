import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/authContext.jsx';

function CustomerProfile() {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || '',
        role: user?.role || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                address: user.address || '',
                role: user.role || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // In a real app, you'd send this to the backend
        alert('Profile update feature coming soon!');
        setIsEditing(false);
    };

    return (
        <div className='max-w-2xl mx-auto'>
            <h1 className='text-2xl font-bold mb-6'>My Profile</h1>

            <div className='bg-white shadow-md rounded-lg p-6'>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={true}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            rows="3"
                            className='w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-100'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            disabled={true}
                            className='w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100'
                        />
                    </div>
                </div>

                <div className='flex gap-4 mt-6'>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600'
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className='bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600'
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className='bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600'
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerProfile;
