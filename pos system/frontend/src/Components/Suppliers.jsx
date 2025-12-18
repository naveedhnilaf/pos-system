import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Suppliers() {
    const [supplierName, setSupplierName] = useState("");
    const [supplierEmail, setSupplierEmail] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [supplierAddress, setSupplierAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all suppliers on component mount
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/suppliers/all",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                setSuppliers(response.data.suppliers);
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // Update existing supplier
                const response = await axios.put(
                    `http://localhost:5000/api/suppliers/${editingId}`,
                    { supplierName, supplierEmail, supplierPhone, supplierAddress },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("Supplier updated successfully!");
                    setSupplierName("");
                    setSupplierEmail("");
                    setSupplierPhone("");
                    setSupplierAddress("");
                    setIsEditMode(false);
                    setEditingId(null);
                    fetchSuppliers();
                }
            } else {
                // Add new supplier
                const response = await axios.post(
                    "http://localhost:5000/api/suppliers/add",
                    { supplierName, supplierEmail, supplierPhone, supplierAddress },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("Supplier added successfully!");
                    setSupplierName("");
                    setSupplierEmail("");
                    setSupplierPhone("");
                    setSupplierAddress("");
                    fetchSuppliers();
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (supplier) => {
        setIsEditMode(true);
        setEditingId(supplier._id);
        setSupplierName(supplier.supplierName);
        setSupplierEmail(supplier.supplierEmail);
        setSupplierPhone(supplier.supplierPhone);
        setSupplierAddress(supplier.supplierAddress);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditingId(null);
        setSupplierName("");
        setSupplierEmail("");
        setSupplierPhone("");
        setSupplierAddress("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/suppliers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                alert("Supplier deleted successfully!");
                fetchSuppliers();
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
            alert(error.response?.data?.message || "Error deleting supplier. Please try again.");
        }
    };

    // Filter suppliers based on search term
    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Supplier Management</h1>

            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{isEditMode ? 'Edit Supplier' : 'Add Supplier'}</h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Supplier Name" 
                                    className='border w-full p-2 rounded-md' 
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <input 
                                    type="email"
                                    placeholder="Supplier Email"
                                    className='border w-full p-2 rounded-md' 
                                    value={supplierEmail}
                                    onChange={(e) => setSupplierEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <input 
                                    type="text"
                                    placeholder="Supplier Phone"
                                    className='border w-full p-2 rounded-md' 
                                    value={supplierPhone}
                                    onChange={(e) => setSupplierPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <textarea 
                                    placeholder="Supplier Address"
                                    className='border w-full p-2 rounded-md' 
                                    rows="3"
                                    value={supplierAddress}
                                    onChange={(e) => setSupplierAddress(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className='flex gap-2'>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 disabled:bg-gray-400'
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Supplier')}
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
                        <h2 className='text-center text-xl font-bold mb-4'>Suppliers List</h2>
                        
                        {/* Search Bar */}
                        <div className='mb-4'>
                            <input 
                                type="text"
                                placeholder="Search by supplier name..."
                                className='w-full border border-gray-300 p-2 rounded-md'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {suppliers.length > 0 ? (
                            <table className='w-full border-collapse border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className='border border-gray-200 p-2 text-left'>S No</th>
                                        <th className='border border-gray-200 p-2 text-left'>Supplier Name</th>
                                        <th className='border border-gray-200 p-2 text-left'>Email</th>
                                        <th className='border border-gray-200 p-2 text-left'>Phone</th>
                                        <th className='border border-gray-200 p-2 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSuppliers.length > 0 ? (
                                        filteredSuppliers.map((supplier, index) => (
                                            <tr key={supplier._id}>
                                                <td className='border border-gray-200 p-2'>{index + 1}</td>
                                                <td className='border border-gray-200 p-2'>{supplier.supplierName}</td>
                                                <td className='border border-gray-200 p-2'>{supplier.supplierEmail}</td>
                                                <td className='border border-gray-200 p-2'>{supplier.supplierPhone}</td>
                                                <td className='border border-gray-200 p-2 text-center'>
                                                    <button 
                                                        className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-3'
                                                        onClick={() => handleEdit(supplier)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                                        onClick={() => handleDelete(supplier._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className='border border-gray-200 p-2 text-center text-gray-500'>
                                                No suppliers found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p className='text-gray-500 text-center'>No suppliers found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Suppliers
