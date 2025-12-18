import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Order() {
    const [orderNumber, setOrderNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [products, setProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentProduct, setCurrentProduct] = useState({ name: "", quantity: 1, price: 0 });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setError("");
        try {
            const token = localStorage.getItem('pos-token');
            if (!token) {
                setError("Not authenticated. Please login first.");
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/orders/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
                setError("");
            } else {
                setError(response.data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError(error.response?.data?.message || error.message || "Error fetching orders. Make sure backend is running.");
        }
    };

    const handleAddProduct = () => {
        if (currentProduct.name && currentProduct.quantity && currentProduct.price) {
            setProducts([...products, { ...currentProduct }]);
            setCurrentProduct({ name: "", quantity: 1, price: 0 });
        }
    };

    const handleRemoveProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isEditMode) {
                const response = await axios.put(
                    `http://localhost:5000/api/orders/${editingId}`,
                    { status, notes },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    setError("");
                    resetForm();
                    fetchOrders();
                }
            } else {
                const response = await axios.post(
                    "http://localhost:5000/api/orders/add",
                    { 
                        orderNumber, 
                        customerName, 
                        customerEmail, 
                        products, 
                        totalAmount: parseFloat(totalAmount), 
                        shippingAddress, 
                        notes 
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                        }
                    }
                );

                if (response.data.success) {
                    setError("");
                    resetForm();
                    fetchOrders();
                }
            }
        } catch (error) {
            console.error("Error:", error);
            setError(error.response?.data?.message || error.message || "Error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setOrderNumber("");
        setCustomerName("");
        setCustomerEmail("");
        setProducts([]);
        setTotalAmount("");
        setShippingAddress("");
        setNotes("");
        setStatus("pending");
        setIsEditMode(false);
        setEditingId(null);
        setCurrentProduct({ name: "", quantity: 1, price: 0 });
    };

    const handleEdit = (order) => {
        setIsEditMode(true);
        setEditingId(order._id);
        setStatus(order.status);
        setNotes(order.notes || "");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) {
            return;
        }

        try {
            setError("");
            const response = await axios.delete(
                `http://localhost:5000/api/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('pos-token')}`
                    }
                }
            );

            if (response.data.success) {
                fetchOrders();
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            setError(error.response?.data?.message || "Error deleting order. Please try again.");
        }
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (orderStatus) => {
        switch (orderStatus) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-indigo-100 text-indigo-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-8'>Order Management</h1>

            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-1/3'>
                    <div className='bg-white shadow-md rounded-lg p-4'>
                        <h2 className='text-center text-xl font-bold mb-4'>{isEditMode ? 'Update Order Status' : 'Create Order'}</h2>
                        
                        {error && (
                            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                                {error}
                            </div>
                        )}

                        {!error && !isEditMode && products.length > 0 && (
                            <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                                {products.length} product(s) added
                            </div>
                        )}

                        <form className='space-y-4' onSubmit={handleSubmit}>
                            {!isEditMode ? (
                                <>
                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Order Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="ORD-001" 
                                            className='border w-full p-2 rounded-md' 
                                            value={orderNumber}
                                            onChange={(e) => setOrderNumber(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Customer Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            className='border w-full p-2 rounded-md' 
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Customer Email</label>
                                        <input 
                                            type="email" 
                                            placeholder="john@example.com"
                                            className='border w-full p-2 rounded-md' 
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Shipping Address</label>
                                        <textarea 
                                            placeholder="Full shipping address"
                                            className='border w-full p-2 rounded-md' 
                                            rows="2"
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Product Section */}
                                    <div className='border-t pt-4'>
                                        <h3 className='font-bold mb-2'>Add Products</h3>
                                        <div className='space-y-2'>
                                            <input 
                                                type="text" 
                                                placeholder="Product Name"
                                                className='border w-full p-2 rounded-md text-sm' 
                                                value={currentProduct.name}
                                                onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Quantity"
                                                className='border w-full p-2 rounded-md text-sm' 
                                                value={currentProduct.quantity}
                                                onChange={(e) => setCurrentProduct({...currentProduct, quantity: parseInt(e.target.value)})}
                                                min="1"
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="Price"
                                                className='border w-full p-2 rounded-md text-sm' 
                                                value={currentProduct.price}
                                                onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                                                step="0.01"
                                            />
                                            <button 
                                                type="button"
                                                onClick={handleAddProduct}
                                                className='w-full bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 text-sm'
                                            >
                                                Add Product
                                            </button>
                                        </div>

                                        {products.length > 0 && (
                                            <div className='mt-3 space-y-2'>
                                                {products.map((prod, idx) => (
                                                    <div key={idx} className='bg-gray-100 p-2 rounded flex justify-between items-center text-sm'>
                                                        <span>{prod.name} x{prod.quantity}</span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleRemoveProduct(idx)}
                                                            className='text-red-600 hover:text-red-800'
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Total Amount</label>
                                        <input 
                                            type="number" 
                                            placeholder="0.00"
                                            className='border w-full p-2 rounded-md' 
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(e.target.value)}
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Notes</label>
                                        <textarea 
                                            placeholder="Order notes..."
                                            className='border w-full p-2 rounded-md' 
                                            rows="2"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Order Status</label>
                                        <select 
                                            className='border w-full p-2 rounded-md' 
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className='block text-sm font-semibold mb-1'>Notes</label>
                                        <textarea 
                                            placeholder="Order notes..."
                                            className='border w-full p-2 rounded-md' 
                                            rows="3"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className='flex gap-2'>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className='flex-1 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600 disabled:bg-gray-400'
                                >
                                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Order' : 'Create Order')}
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
                        <h2 className='text-center text-xl font-bold mb-4'>Orders List</h2>
                        
                        <div className='mb-4'>
                            <input 
                                type="text"
                                placeholder="Search by order number or customer name..."
                                className='w-full border border-gray-300 p-2 rounded-md'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {orders.length > 0 ? (
                            <div className='overflow-x-auto'>
                                <table className='w-full border-collapse border border-gray-200'>
                                    <thead>
                                        <tr className='bg-gray-100'>
                                            <th className='border border-gray-200 p-2 text-left text-sm'>Order #</th>
                                            <th className='border border-gray-200 p-2 text-left text-sm'>Customer</th>
                                            <th className='border border-gray-200 p-2 text-left text-sm'>Email</th>
                                            <th className='border border-gray-200 p-2 text-left text-sm'>Total</th>
                                            <th className='border border-gray-200 p-2 text-left text-sm'>Status</th>
                                            <th className='border border-gray-200 p-2 text-center text-sm'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td className='border border-gray-200 p-2 text-sm font-semibold'>{order.orderNumber}</td>
                                                    <td className='border border-gray-200 p-2 text-sm'>{order.customerName}</td>
                                                    <td className='border border-gray-200 p-2 text-sm'>{order.customerEmail}</td>
                                                    <td className='border border-gray-200 p-2 text-sm font-semibold'>${order.totalAmount.toFixed(2)}</td>
                                                    <td className='border border-gray-200 p-2 text-sm'>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className='border border-gray-200 p-2 text-center'>
                                                        <button 
                                                            className='bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 mr-2 text-xs'
                                                            onClick={() => handleEdit(order)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className='bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-xs'
                                                            onClick={() => handleDelete(order._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className='border border-gray-200 p-2 text-center text-gray-500 text-sm'>
                                                    No orders found matching "{searchTerm}"
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className='text-gray-500 text-center py-10'>No orders found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
