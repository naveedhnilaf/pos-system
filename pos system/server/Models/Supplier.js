import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    supplierName: { type: String, required: true },
    supplierEmail: { type: String, required: true, unique: true },
    supplierPhone: { type: String, required: true },
    supplierAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
