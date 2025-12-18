import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/authContext';

function Profile() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        address: '',
        role: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            setError('');
            const token = localStorage.getItem('pos-token');
            if (!token || !user?._id) {
                setError('User not authenticated');
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/users/${user._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setProfileData({
                    name: response.data.user.name || '',
                    email: response.data.user.email || '',
                    address: response.data.user.address || '',
                    role: response.data.user.role || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError(error.response?.data?.message || 'Failed to load profile');
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('pos-token');
            const response = await axios.put(
                `http://localhost:5000/api/users/${user._id}`,
                {
                    name: profileData.name,
                    email: profileData.email,
                    address: profileData.address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Profile updated successfully');
                setIsEditing(false);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('pos-token');
            const response = await axios.post(
                `http://localhost:5000/api/users/${user._id}/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setShowPasswordForm(false);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-600 mt-2">Manage your account information and security</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Profile Information */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-700">Profile Information</h2>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                    isEditing
                                        ? 'bg-gray-500 text-white hover:bg-gray-600'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Display */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-800">{profileData.name}</p>
                                </div>

                                {/* Email Display */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                    <p className="text-lg font-semibold text-gray-800">{profileData.email}</p>
                                </div>

                                {/* Role Display */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Role</p>
                                    <p className="text-lg font-semibold text-gray-800 capitalize">
                                        {profileData.role}
                                    </p>
                                </div>

                                {/* Address Display */}
                                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                    <p className="text-sm text-gray-600 mb-1">Address</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {profileData.address || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Security Section */}
                    <div className="border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6">Security</h2>

                        {showPasswordForm ? (
                            <form onSubmit={handleChangePassword} className="max-w-md">
                                {/* Current Password */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* New Password */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
                                    >
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: '',
                                            });
                                        }}
                                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                            >
                                Change Password
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
