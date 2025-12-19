import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Categories() {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5002/api/categories/all",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // Update existing category
                const response = await axios.put(
                    `http://localhost:5002/api/categories/${editingId}`,
                    { categoryName, categoryDescription },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("Category updated successfully!");
                    setCategoryName("");
                    setCategoryDescription("");
                    setIsEditMode(false);
                    setEditingId(null);
                    fetchCategories();
                }
            } else {
                // Add new category
                const response = await axios.post(
                    "http://localhost:5002/api/categories/add",
                    { categoryName, categoryDescription },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("Category added successfully!");
                    setCategoryName("");
                    setCategoryDescription("");
                    fetchCategories();
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setIsEditMode(true);
        setEditingId(category._id);
        setCategoryName(category.categoryName);
        setCategoryDescription(category.categoryDescription);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditingId(null);
        setCategoryName("");
        setCategoryDescription("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5002/api/categories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                alert("Category deleted successfully!");
                fetchCategories();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert(error.response?.data?.message || "Error deleting category. Please try again.");
        }
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(cat =>
        cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Category Management</h1>

            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Category Name" 
                                    className='border w-full p-2 rounded-md' 
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Category Description"
                                    className='border w-full p-2 rounded-md' 
                                    value={categoryDescription}
                                    onChange={(e) => setCategoryDescription(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className='flex gap-2'>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 disabled:bg-gray-400'
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Category')}
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
                        <h2 className='text-center text-xl font-bold mb-4'>Categories List</h2>
                        
                        {/* Search Bar */}
                        <div className='mb-4'>
                            <input 
                                type="text"
                                placeholder="Search by category name..."
                                className='w-full border border-gray-300 p-2 rounded-md'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {categories.length > 0 ? (
                            <table className='w-full border-collapse border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className='border border-gray-200 p-2 text-left'>S No</th>
                                        <th className='border border-gray-200 p-2 text-left'> Category Name</th>
                                        <th className='border border-gray-200 p-2 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((cat, index) => (
                                            <tr key={cat._id}>
                                                <td className='border border-gray-200 p-2'>{index + 1}</td>
                                                <td className='border border-gray-200 p-2'>{cat.categoryName}</td>
                                                <td className='border border-gray-200 p-2 text-center'>
                                                    <button 
                                                        className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-3'
                                                        onClick={() => handleEdit(cat)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                                        onClick={() => handleDelete(cat._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className='border border-gray-200 p-2 text-center text-gray-500'>
                                                No categories found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p className='text-gray-500 text-center'>No categories found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories