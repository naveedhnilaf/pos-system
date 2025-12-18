import Supplier from '../Models/Supplier.js';

// Create a new supplier
const createSupplier = async (req, res) => {
    try {
        const { supplierName, supplierEmail, supplierPhone, supplierAddress } = req.body;

        if (!supplierName || !supplierEmail || !supplierPhone || !supplierAddress) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const newSupplier = new Supplier({
            supplierName,
            supplierEmail,
            supplierPhone,
            supplierAddress
        });

        await newSupplier.save();
        res.status(201).json({ 
            success: true, 
            message: 'Supplier created successfully', 
            supplier: newSupplier 
        });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({ 
            success: true, 
            suppliers 
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get a single supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json({ 
                success: false, 
                message: 'Supplier not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            supplier 
        });
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Update a supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { supplierName, supplierEmail, supplierPhone, supplierAddress } = req.body;

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { supplierName, supplierEmail, supplierPhone, supplierAddress },
            { new: true, runValidators: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ 
                success: false, 
                message: 'Supplier not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Supplier updated successfully', 
            supplier: updatedSupplier 
        });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Delete a supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSupplier = await Supplier.findByIdAndDelete(id);

        if (!deletedSupplier) {
            return res.status(404).json({ 
                success: false, 
                message: 'Supplier not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Supplier deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };

