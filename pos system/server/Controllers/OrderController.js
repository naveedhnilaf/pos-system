import Order from '../Models/Order.js';

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { orderNumber, customerName, customerEmail, products, totalAmount, shippingAddress, notes } = req.body;

        if (!orderNumber || !customerName || !customerEmail || !products || !totalAmount || !shippingAddress) {
            return res.status(400).json({ 
                success: false, 
                message: 'All required fields must be provided' 
            });
        }

        const newOrder = new Order({
            orderNumber,
            customerName,
            customerEmail,
            products,
            totalAmount,
            shippingAddress,
            notes,
            status: 'pending'
        });

        await newOrder.save();
        res.status(201).json({ 
            success: true, 
            message: 'Order created successfully', 
            order: newOrder 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            orders 
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            order 
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Update order status
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Order updated successfully', 
            order: updatedOrder 
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Order deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
