// server/Routes/Supplier.js
import express from 'express';
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} from '../Controllers/SupplierController.js';

const router = express.Router();

// GET all suppliers
// Full URL: /api/suppliers
router.get('/', getAllSuppliers);

// POST create a new supplier
// Full URL: /api/suppliers
router.post('/', createSupplier);

// GET a single supplier by ID
// Full URL: /api/suppliers/:id
router.get('/:id', getSupplierById);

// PUT update a supplier by ID
// Full URL: /api/suppliers/:id
router.put('/:id', updateSupplier);

// DELETE a supplier by ID
// Full URL: /api/suppliers/:id
router.delete('/:id', deleteSupplier);

export default router;
