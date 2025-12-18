import express from "express";
import { 
    createSupplier, 
    getAllSuppliers, 
    getSupplierById, 
    updateSupplier, 
    deleteSupplier 
} from "../Controllers/SupplierController.js";

const router = express.Router();

// Create a new supplier
router.post('/add', createSupplier);

// Get all suppliers
router.get('/all', getAllSuppliers);

// Get a single supplier by ID
router.get('/:id', getSupplierById);

// Update a supplier
router.put('/:id', updateSupplier);

// Delete a supplier
router.delete('/:id', deleteSupplier);

export default router;
