import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            productName: String,
            quantity: Number,
            price: Number,
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
