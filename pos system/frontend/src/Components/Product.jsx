import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Product() {
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5002/api/products/all",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // Update existing product
                const response = await axios.put(
                    `http://localhost:5002/api/products/${editingId}`,
                    { productName, productDescription, productPrice, productQuantity, productCategory },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("Product updated successfully!");
                    setProductName("");
                    setProductDescription("");
                    setProductPrice("");
                    setProductQuantity("");
                    setProductCategory("");
                    setIsEditMode(false);
                    setEditingId(null);
                    fetchProducts();
                }
            } else {
                // Add new product
                const response = await axios.post(
                    "http://localhost:5002/api/products/add",
                    { productName, productDescription, productPrice, productQuantity, productCategory },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    alert("Product added successfully!");
                    setProductName("");
                    setProductDescription("");
                    setProductPrice("");
                    setProductQuantity("");
                    setProductCategory("");
                    fetchProducts();
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setIsEditMode(true);
        setEditingId(product._id);
        setProductName(product.productName);
        setProductDescription(product.productDescription);
        setProductPrice(product.productPrice);
        setProductQuantity(product.productQuantity);
        setProductCategory(product.productCategory);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setEditingId(null);
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductQuantity("");
        setProductCategory("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:5002/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                alert("Product deleted successfully!");
                fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.response?.data?.message || "Error deleting product. Please try again.");
        }
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Product Management</h1>

            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
                        <form className='space-y-4' onSubmit={handleSubmit}>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Product Name" 
                                    className='border w-full p-2 rounded-md' 
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <textarea 
                                    placeholder="Product Description"
                                    className='border w-full p-2 rounded-md' 
                                    rows="3"
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <input 
                                    type="number"
                                    placeholder="Product Price"
                                    className='border w-full p-2 rounded-md' 
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                    step="1"
                                    required
                                />
                            </div>

                            <div>
                                <input 
                                    type="number"
                                    placeholder="Product Quantity"
                                    className='border w-full p-2 rounded-md' 
                                    value={productQuantity}
                                    onChange={(e) => setProductQuantity(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <input 
                                    type="text"
                                    placeholder="Product Category"
                                    className='border w-full p-2 rounded-md' 
                                    value={productCategory}
                                    onChange={(e) => setProductCategory(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className='flex gap-2'>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 disabled:bg-gray-400'
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Product')}
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
                        <h2 className='text-center text-xl font-bold mb-4'>Products List</h2>
                        
                        {/* Search Bar */}
                        <div className='mb-4'>
                            <input 
                                type="text"
                                placeholder="Search by product name..."
                                className='w-full border border-gray-300 p-2 rounded-md'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {products.length > 0 ? (
                            <table className='w-full border-collapse border border-gray-200'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        <th className='border border-gray-200 p-2 text-left'>S No</th>
                                        <th className='border border-gray-200 p-2 text-left'>Product Name</th>
                                        <th className='border border-gray-200 p-2 text-left'>Description</th>
                                        <th className='border border-gray-200 p-2 text-left'>Price</th>
                                        <th className='border border-gray-200 p-2 text-left'>Qty</th>
                                        <th className='border border-gray-200 p-2 text-left'>Category</th>
                                        <th className='border border-gray-200 p-2 text-center'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product, index) => (
                                            <tr key={product._id}>
                                                <td className='border border-gray-200 p-2'>{index + 1}</td>
                                                <td className='border border-gray-200 p-2'>{product.productName}</td>
                                                <td className='border border-gray-200 p-2'>{product.productDescription}</td>
                                                <td className='border border-gray-200 p-2'>${product.productPrice}</td>
                                                <td className='border border-gray-200 p-2'>{product.productQuantity}</td>
                                                <td className='border border-gray-200 p-2'>{product.productCategory}</td>
                                                <td className='border border-gray-200 p-2 text-center'>
                                                    <button 
                                                        className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mr-3'
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600'
                                                        onClick={() => handleDelete(product._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className='border border-gray-200 p-2 text-center text-gray-500'>
                                                No products found matching "{searchTerm}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <p className='text-gray-500 text-center'>No products found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product
