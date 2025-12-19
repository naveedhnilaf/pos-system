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

    // -------------------- FETCH SUPPLIERS --------------------
 const fetchSuppliers = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5002/api/suppliers",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('pos-token')}`
        }
      }
    );

    if (response.data.success) {
      console.log("Suppliers from backend:", response.data.suppliers);
      setSuppliers(response.data.suppliers); // ✅ USE DIRECTLY
    }
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
};


    useEffect(() => {
        fetchSuppliers();
    }, []);

    // -------------------- ADD / UPDATE SUPPLIER --------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // Update supplier
                const response = await axios.put(
                    `http://localhost:5002/api/suppliers/${editingId}`,
                    { supplierName, supplierEmail, supplierPhone, supplierAddress },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('pos-token')}` } }
                );

                console.log("Update response:", response.data);

                if (response.data.success) {
                    alert("Supplier updated successfully!");
                    resetForm();
                    fetchSuppliers();
                }
            } else {
                // Add new supplier
                const response = await axios.post(
                    "http://localhost:5002/api/suppliers",
                    { supplierName, supplierEmail, supplierPhone, supplierAddress },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('pos-token')}` } }
                );

                console.log("Add response:", response.data);

                if (response.data.success) {
                    alert("Supplier added successfully!");
                    resetForm();
                    fetchSuppliers();
                }
            }
        } catch (error) {
            console.error("Error submitting supplier:", error);
            alert(error.response?.data?.message || "Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSupplierName("");
        setSupplierEmail("");
        setSupplierPhone("");
        setSupplierAddress("");
        setIsEditMode(false);
        setEditingId(null);
    };

    // -------------------- EDIT SUPPLIER --------------------
    const handleEdit = (supplier) => {
        setIsEditMode(true);
        setEditingId(supplier._id);
        setSupplierName(supplier.supplierName);
        setSupplierEmail(supplier.supplierEmail);
        setSupplierPhone(supplier.supplierPhone);
        setSupplierAddress(supplier.supplierAddress);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // -------------------- DELETE SUPPLIER --------------------
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this supplier?")) return;

        try {
            const response = await axios.delete(
                `http://localhost:5002/api/suppliers/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('pos-token')}` } }
            );

            console.log("Delete response:", response.data);

            if (response.data.success) {
                alert("Supplier deleted successfully!");
                fetchSuppliers();
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
            alert(error.response?.data?.message || "Error deleting supplier.");
        }
    };

    // -------------------- FILTER SUPPLIERS --------------------
    const filteredSuppliers = suppliers.filter(
        supplier => supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Supplier Management</h1>

            <div className='flex flex-col lg:flex-row gap-4'>
                {/* Form */}
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>
                            {isEditMode ? 'Edit Supplier' : 'Add Supplier'}
                        </h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <input 
                                type="text" placeholder="Supplier Name" 
                                className='border w-full p-2 rounded-md'
                                value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required 
                            />
                            <input 
                                type="email" placeholder="Supplier Email" 
                                className='border w-full p-2 rounded-md'
                                value={supplierEmail} onChange={(e) => setSupplierEmail(e.target.value)} required 
                            />
                            <input 
                                type="text" placeholder="Supplier Phone" 
                                className='border w-full p-2 rounded-md'
                                value={supplierPhone} onChange={(e) => setSupplierPhone(e.target.value)} required 
                            />
                            <textarea 
                                placeholder="Supplier Address" rows="3"
                                className='border w-full p-2 rounded-md'
                                value={supplierAddress} onChange={(e) => setSupplierAddress(e.target.value)} required 
                            />
                            <div className='flex gap-2'>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-md bg-green-500 text-white p-3 hover:bg-green-600 disabled:bg-gray-400'
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Supplier')}
                                </button>
                                {isEditMode && (
                                    <button 
                                        type="button"
                                        onClick={resetForm}
                                        className='flex-1 rounded-md bg-red-500 text-white p-3 hover:bg-red-600'
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Supplier List */}
                <div className='lg:w-2/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>Suppliers List</h2>
                        <input 
                            type="text" placeholder="Search by supplier name..." 
                            className='w-full border p-2 rounded-md mb-4'
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {suppliers.length > 0 ? (
                            <table className='w-full border-collapse border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className='border p-2 text-left'>S No</th>
                                        <th className='border p-2 text-left'>Name</th>
                                        <th className='border p-2 text-left'>Email</th>
                                        <th className='border p-2 text-left'>Phone</th>
                                        <th className='border p-2 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSuppliers.length > 0 ? filteredSuppliers.map((s, i) => (
                                        <tr key={s._id}>
                                            <td className='border p-2'>{i + 1}</td>
                                            <td className='border p-2'>{s.supplierName}</td>
                                            <td className='border p-2'>{s.supplierEmail}</td>
                                            <td className='border p-2'>{s.supplierPhone}</td>
                                            <td className='border p-2 text-center'>
                                                <button className='bg-blue-500 text-white p-2 rounded-md mr-2' onClick={() => handleEdit(s)}>Edit</button>
                                                <button className='bg-red-500 text-white p-2 rounded-md' onClick={() => handleDelete(s._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className='text-center text-gray-500 p-2'>
                                                No suppliers found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : <p className='text-gray-500 text-center'>No suppliers found</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suppliers;
