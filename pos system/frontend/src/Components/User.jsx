import React, { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('pos-token');
            console.log("Token:", token);
            console.log("Fetching from: http://localhost:5000/api/users/all");
            
            const response = await axios.get(
                "http://localhost:5000/api/users/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Response:", response.data);
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error("Error details:", error);
            console.error("Error response:", error.response);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // Update existing user
                const updateData = { name, email, address, role };
                if (password) {
                    updateData.password = password;
                }

                const response = await axios.put(
                    `http://localhost:5000/api/users/${editingId}`,
                    updateData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("User updated successfully!");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setAddress("");
                    setRole("user");
                    setIsEditMode(false);
                    setEditingId(null);
                    fetchUsers();
                }
            } else {
                // Add new user
                const response = await axios.post(
                    "http://localhost:5000/api/users/add",
                    { name, email, password, address, role },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("User added successfully!");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setAddress("");
                    setRole("user");
                    fetchUsers();
                }
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMsg = error.response?.data?.message || error.message || "Error. Please try again.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setIsEditMode(true);
        setEditingId(user._id);
        setName(user.name);
        setEmail(user.email);
        setPassword("");
        setAddress(user.address);
        setRole(user.role);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditingId(null);
        setName("");
        setEmail("");
        setPassword("");
        setAddress("");
        setRole("user");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                alert("User deleted successfully!");
                fetchUsers();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(error.response?.data?.message || "Error deleting user. Please try again.");
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>User Management</h1>

            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{isEditMode ? 'Edit User' : 'Add User'}</h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    className='border w-full p-2 rounded-md' 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <input 
                                    type="email"
                                    placeholder="Email"
                                    className='border w-full p-2 rounded-md' 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isEditMode}
                                />
                            </div>

                            <div>
                                <input 
                                    type="password"
                                    placeholder={isEditMode ? "Password (leave blank to keep current)" : "Password"}
                                    className='border w-full p-2 rounded-md' 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required={!isEditMode}
                                />
                            </div>

                            <div>
                                <textarea 
                                    placeholder="Address"
                                    className='border w-full p-2 rounded-md' 
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <select 
                                    className='border w-full p-2 rounded-md' 
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            
                            <div className='flex gap-2'>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 disabled:bg-gray-400'
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add User')}
                                </button>
                                {isEditMode && (
                                    <button 
                                        type="button"
                                        onClick={handleCancel}
                                        className='flex-1 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600'
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className='lg:w-2/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>Users List</h2>
                        
                        {/* Search Bar */}
                        <div className='mb-4'>
                            <input 
                                type="text"
                                placeholder="Search by user name..."
                                className='w-full border border-gray-300 p-2 rounded-md'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {users.length > 0 ? (
                            <table className='w-full border-collapse border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className='border border-gray-200 p-2 text-left'>S No</th>
                                        <th className='border border-gray-200 p-2 text-left'>Name</th>
                                        <th className='border border-gray-200 p-2 text-left'>Email</th>
                                        <th className='border border-gray-200 p-2 text-left'>Address</th>
                                        <th className='border border-gray-200 p-2 text-left'>Role</th>
                                        <th className='border border-gray-200 p-2 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={user._id}>
                                                <td className='border border-gray-200 p-2'>{index + 1}</td>
                                                <td className='border border-gray-200 p-2'>{user.name}</td>
                                                <td className='border border-gray-200 p-2'>{user.email}</td>
                                                <td className='border border-gray-200 p-2'>{user.address}</td>
                                                <td className='border border-gray-200 p-2'>
                                                    <span className={`px-3 py-1 rounded-full text-white text-sm ${user.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className='border border-gray-200 p-2 text-center'>
                                                    <button 
                                                        className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-3'
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className='border border-gray-200 p-2 text-center text-gray-500'>
                                                No users found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p className='text-gray-500 text-center'>No users found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
