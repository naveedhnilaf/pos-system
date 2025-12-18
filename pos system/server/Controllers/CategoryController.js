import Category from '../Models/Category.js';

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        if (!categoryName || !categoryDescription) {
            return res.status(400).json({ 
                success: false, 
                message: 'Category name and description are required' 
            });
        }

        const newCategory = new Category({
            categoryName,
            categoryDescription
        });

        await newCategory.save();
        res.status(201).json({ 
            success: true, 
            message: 'Category created successfully', 
            category: newCategory 
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message
        });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ 
            success: true, 
            categories 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            category 
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, categoryDescription } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { categoryName, categoryDescription },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Category updated successfully', 
            category: updatedCategory 
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Category deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };