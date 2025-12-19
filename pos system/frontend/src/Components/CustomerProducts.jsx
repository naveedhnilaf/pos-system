import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
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
            alert("Error loading products");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);
        if (existingItem) {
            setCart(cart.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        alert(`${product.productName} added to cart!`);
    };

    if (loading) {
        return <div className='text-center py-10'>Loading products...</div>;
    }

    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-bold mb-6'>Browse Products</h1>

            <div className='mb-4'>
                <input 
                    type="text"
                    placeholder="Search products..."
                    className='w-full border border-gray-300 p-2 rounded-md'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredProducts.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredProducts.map((product) => (
                        <div key={product._id} className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition'>
                            <h3 className='text-lg font-bold mb-2'>{product.productName}</h3>
                            <p className='text-gray-600 text-sm mb-2'>{product.productDescription}</p>
                            <div className='flex justify-between items-center mb-3'>
                                <span className='text-green-600 font-bold text-lg'>${product.productPrice}</span>
                                <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                                    Stock: {product.productQuantity}
                                </span>
                            </div>
                            <p className='text-sm text-gray-500 mb-3'>Category: {product.productCategory}</p>
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.productQuantity === 0}
                                className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400'
                            >
                                {product.productQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-gray-500 text-center py-10'>No products found</p>
            )}

            {cart.length > 0 && (
                <div className='bg-white shadow-md rounded-lg p-4 mt-6'>
                    <h2 className='text-xl font-bold mb-4'>Cart Items: {cart.length}</h2>
                    <div className='space-y-2'>
                        {cart.map((item) => (
                            <div key={item._id} className='flex justify-between border-b pb-2'>
                                <span>{item.productName} x{item.quantity}</span>
                                <span className='font-bold'>${(item.productPrice * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className='text-right font-bold text-lg mt-4'>
                            Total: ${cart.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerProducts;
