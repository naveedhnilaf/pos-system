import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Summary() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        highestSaleProduct: null,
        outOfStockProducts: [],
        lowStockProducts: [],
        products: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            const token = localStorage.getItem('pos-token');
            const response = await axios.get(
                "http://localhost:5000/api/products/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                const products = response.data.products || [];
                
                // Calculate stats
                const totalProducts = products.length;
                const totalStock = products.reduce((sum, p) => sum + (p.productQuantity || 0), 0);
                const highestSaleProduct = products.length > 0 ? products[0].productName : 'N/A';
                const outOfStockProducts = products.filter(p => p.productQuantity === 0);
                const lowStockProducts = products.filter(p => p.productQuantity > 0 && p.productQuantity <= 5);

                // Mock data for revenue and orders (in real app, fetch from backend)
                const revenue = products.reduce((sum, p) => sum + (p.productPrice * 2), 0); // Mock calculation
                const ordersToday = Math.floor(Math.random() * 20) + 5; // Mock orders

                setStats({
                    totalProducts,
                    totalStock,
                    ordersToday,
                    revenue,
                    highestSaleProduct,
                    outOfStockProducts,
                    lowStockProducts,
                    products
                });
            }
        } catch (error) {
            console.error("Error fetching summary data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className='text-center py-10 text-xl'>Loading summary...</div>;
    }

    // Prepare data for pie chart (stock status)
    const stockStatusData = {
        inStock: stats.products.filter(p => p.productQuantity > 5).length,
        lowStock: stats.lowStockProducts.length,
        outOfStock: stats.outOfStockProducts.length
    };

    const pieColors = ['#10b981', '#f59e0b', '#ef4444']; // green, amber, red

    return (
        <div className='space-y-6'>
            <h1 className='text-3xl font-bold'>Dashboard Summary</h1>

            {/* Top Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {/* Total Products */}
                <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm opacity-90'>Total Products</p>
                            <h2 className='text-4xl font-bold mt-2'>{stats.totalProducts}</h2>
                        </div>
                        <span className='text-4xl'>📦</span>
                    </div>
                    <p className='text-xs opacity-75 mt-3'>Active products in system</p>
                </div>

                {/* Total Stock */}
                <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm opacity-90'>Total Stock</p>
                            <h2 className='text-4xl font-bold mt-2'>{stats.totalStock}</h2>
                        </div>
                        <span className='text-4xl'>📊</span>
                    </div>
                    <p className='text-xs opacity-75 mt-3'>Units in inventory</p>
                </div>

                {/* Orders Today */}
                <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm opacity-90'>Orders Today</p>
                            <h2 className='text-4xl font-bold mt-2'>{stats.ordersToday}</h2>
                        </div>
                        <span className='text-4xl'>📋</span>
                    </div>
                    <p className='text-xs opacity-75 mt-3'>Today&apos;s orders</p>
                </div>

                {/* Revenue */}
                <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <p className='text-sm opacity-90'>Revenue</p>
                            <h2 className='text-3xl font-bold mt-2'>${stats.revenue.toFixed(2)}</h2>
                        </div>
                        <span className='text-4xl'>💰</span>
                    </div>
                    <p className='text-xs opacity-75 mt-3'>Total revenue</p>
                </div>
            </div>

            {/* Middle Row */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* Highest Sale Product */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-lg font-bold mb-4 text-gray-800'>Highest Sale Product</h2>
                    <div className='bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border-l-4 border-indigo-500'>
                        <p className='text-2xl font-bold text-indigo-700'>{stats.highestSaleProduct}</p>
                        <p className='text-sm text-gray-600 mt-1'>⭐ Top performing product</p>
                    </div>
                </div>

                {/* Out of Stock */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-lg font-bold mb-4 text-gray-800'>Out of Stock</h2>
                    <div className='bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500'>
                        <p className='text-2xl font-bold text-red-700'>{stats.outOfStockProducts.length}</p>
                        <p className='text-sm text-gray-600 mt-1'>Products need restocking</p>
                    </div>
                </div>

                {/* Low Stock */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-lg font-bold mb-4 text-gray-800'>Low Stock</h2>
                    <div className='bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500'>
                        <p className='text-2xl font-bold text-yellow-700'>{stats.lowStockProducts.length}</p>
                        <p className='text-sm text-gray-600 mt-1'>Products with &lt;= 5 units</p>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Stock Status Chart and Details */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {/* Pie Chart */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-lg font-bold mb-6 text-gray-800'>Stock Status Distribution</h2>
                    <div className='flex justify-center items-center'>
                        <svg width='200' height='200' viewBox='0 0 200 200'>
                            {/* Pie slices */}
                            <circle cx='100' cy='100' r='60' fill={pieColors[0]} opacity={stockStatusData.inStock > 0 ? 1 : 0.2} 
                                style={{
                                    transform: `rotate(${(stockStatusData.inStock / (stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock)) * 360}deg)`,
                                    transformOrigin: '100px 100px'
                                }}
                            />
                            
                            {/* Using a simpler donut chart approach */}
                            <circle cx='100' cy='100' r='60' fill='none' stroke={pieColors[0]} 
                                strokeWidth='20' strokeDasharray={`${(stockStatusData.inStock / (stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock || 1)) * 376} 376`}
                                strokeDashoffset='0'
                            />
                            <circle cx='100' cy='100' r='60' fill='none' stroke={pieColors[1]} 
                                strokeWidth='20' 
                                strokeDasharray={`${(stockStatusData.lowStock / (stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock || 1)) * 376} 376`}
                                strokeDashoffset={`-${(stockStatusData.inStock / (stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock || 1)) * 376}`}
                            />
                            <circle cx='100' cy='100' r='60' fill='none' stroke={pieColors[2]} 
                                strokeWidth='20' 
                                strokeDasharray={`${(stockStatusData.outOfStock / (stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock || 1)) * 376} 376`}
                                strokeDashoffset={`-${((stockStatusData.inStock + stockStatusData.lowStock) / (stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock || 1)) * 376}`}
                            />
                            <circle cx='100' cy='100' r='50' fill='white' />
                            <text x='100' y='105' textAnchor='middle' fontSize='20' fontWeight='bold' fill='#374151'>
                                {stockStatusData.inStock + stockStatusData.lowStock + stockStatusData.outOfStock}
                            </text>
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className='mt-6 space-y-2'>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: pieColors[0] }}></div>
                            <span className='text-sm'>In Stock ({stockStatusData.inStock})</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: pieColors[1] }}></div>
                            <span className='text-sm'>Low Stock ({stockStatusData.lowStock})</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: pieColors[2] }}></div>
                            <span className='text-sm'>Out of Stock ({stockStatusData.outOfStock})</span>
                        </div>
                    </div>
                </div>

                {/* Product Details Table */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-lg font-bold mb-4 text-gray-800'>Recent Products</h2>
                    <div className='space-y-3 max-h-80 overflow-y-auto'>
                        {stats.products.slice(0, 8).map((product, idx) => (
                            <div key={product._id || idx} className='flex justify-between items-center border-b pb-2'>
                                <div className='flex-1'>
                                    <p className='font-medium text-gray-800 text-sm'>{product.productName}</p>
                                    <p className='text-xs text-gray-500'>${product.productPrice}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    product.productQuantity === 0 ? 'bg-red-100 text-red-700' :
                                    product.productQuantity <= 5 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    Stock: {product.productQuantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summary;
