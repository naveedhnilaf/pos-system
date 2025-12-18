import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
