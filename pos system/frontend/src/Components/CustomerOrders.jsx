import React from 'react';

function CustomerOrders() {
    const [orders] = React.useState([
        {
            id: 1,
            orderNumber: 'ORD-001',
            date: '2024-12-15',
            status: 'Delivered',
            total: 150.00,
            items: 3,
        },
        {
            id: 2,
            orderNumber: 'ORD-002',
            date: '2024-12-16',
            status: 'Processing',
            total: 280.50,
            items: 5,
        },
        {
            id: 3,
            orderNumber: 'ORD-003',
            date: '2024-12-17',
            status: 'Pending',
            total: 95.25,
            items: 2,
        },
    ]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <h1 className='text-2xl font-bold mb-6'>My Orders</h1>

            {orders.length > 0 ? (
                <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                    <table className='w-full'>
                        <thead className='bg-gray-100'>
                            <tr>
                                <th className='px-6 py-3 text-left text-sm font-semibold'>Order #</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold'>Date</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold'>Items</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold'>Total</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold'>Status</th>
                                <th className='px-6 py-3 text-left text-sm font-semibold'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className='border-t hover:bg-gray-50'>
                                    <td className='px-6 py-3'>{order.orderNumber}</td>
                                    <td className='px-6 py-3'>{new Date(order.date).toLocaleDateString()}</td>
                                    <td className='px-6 py-3'>{order.items}</td>
                                    <td className='px-6 py-3 font-semibold'>${order.total.toFixed(2)}</td>
                                    <td className='px-6 py-3'>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className='px-6 py-3'>
                                        <button className='text-blue-600 hover:text-blue-800 font-semibold'>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='bg-white shadow-md rounded-lg p-8 text-center'>
                    <p className='text-gray-500 text-lg'>No orders yet</p>
                </div>
            )}
        </div>
    );
}

export default CustomerOrders;
