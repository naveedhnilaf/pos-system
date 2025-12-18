import Product from '../Models/Product.js';

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, productQuantity, productCategory } = req.body;

        if (!productName || !productDescription || !productPrice || !productQuantity || !productCategory) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const newProduct = new Product({
            productName,
            productDescription,
            productPrice,
            productQuantity,
            productCategory
        });

        await newProduct.save();
        res.status(201).json({ 
            success: true, 
            message: 'Product created successfully', 
            product: newProduct 
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ 
            success: true, 
            products 
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            product 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productDescription, productPrice, productQuantity, productCategory } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productName, productDescription, productPrice, productQuantity, productCategory },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
